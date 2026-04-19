import { useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SignatureData } from "@/types/signature";
import { toast } from "sonner";

const INACTIVITY_MS = 5 * 60 * 1000; // 5 minutes
const TOUCH_THROTTLE_MS = 30 * 1000; // refresh last_accessed at most every 30s
const AUTOSAVE_DEBOUNCE_MS = 1500;
const SESSION_KEY = "mesign:draft-key"; // stores { email, phone } for refresh recovery

type DraftKey = { email: string; phone: string };

export function useDraftStorage(
  data: SignatureData,
  setData: (d: SignatureData) => void
) {
  const lastTouchRef = useRef<number>(0);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dataRef = useRef<SignatureData>(data);
  const restoredRef = useRef<boolean>(false);

  // Keep latest data accessible inside async callbacks
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const keyOf = (d: SignatureData): DraftKey => ({
    email: d.email.trim().toLowerCase(),
    phone: d.phone.trim(),
  });

  const hasKey = (d: SignatureData) => {
    const { email, phone } = keyOf(d);
    return email.length > 0 && phone.length > 0;
  };

  const persistSessionKey = (k: DraftKey) => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(k));
    } catch {
      /* ignore */
    }
  };

  const clearSessionKey = () => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  };

  const readSessionKey = (): DraftKey | null => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as DraftKey;
      if (parsed?.email && parsed?.phone) return parsed;
      return null;
    } catch {
      return null;
    }
  };

  const upsertDraft = useCallback(
    async (silent = false) => {
      const current = dataRef.current;
      if (!hasKey(current)) {
        if (!silent) {
          toast.error("Email and phone are required", {
            description: "Email + phone are used as the key for saving your draft.",
          });
        }
        return false;
      }
      const { email, phone } = keyOf(current);
      const { error } = await supabase
        .from("signature_drafts")
        .upsert(
          [
            {
              email,
              phone,
              data: current as never,
              last_accessed_at: new Date().toISOString(),
            },
          ],
          { onConflict: "email,phone" }
        );
      if (error) {
        if (!silent) toast.error("Save failed", { description: error.message });
        return false;
      }
      persistSessionKey({ email, phone });
      lastTouchRef.current = Date.now();
      resetInactivityTimer();
      return true;
    },
    []
  );

  const save = useCallback(async () => {
    const ok = await upsertDraft(false);
    if (ok) {
      toast.success("Draft saved", {
        description: "Will be deleted after 5 minutes of inactivity.",
      });
    }
    return ok;
  }, [upsertDraft]);

  const loadByKey = useCallback(
    async (k: DraftKey, silent = false) => {
      const { email, phone } = k;
      const { data: row, error } = await supabase
        .from("signature_drafts")
        .select("data")
        .eq("email", email)
        .eq("phone", phone)
        .maybeSingle();
      if (error) {
        if (!silent) toast.error("Load failed", { description: error.message });
        return false;
      }
      if (!row) {
        if (!silent) {
          toast("No saved draft found", {
            description: "It may have been deleted after 5 minutes of inactivity.",
          });
        }
        clearSessionKey();
        return false;
      }
      setData(row.data as unknown as SignatureData);
      // refresh last_accessed
      await supabase
        .from("signature_drafts")
        .update({ last_accessed_at: new Date().toISOString() })
        .eq("email", email)
        .eq("phone", phone);
      persistSessionKey(k);
      if (!silent) toast.success("Draft loaded");
      lastTouchRef.current = Date.now();
      resetInactivityTimer();
      return true;
    },
    [setData]
  );

  const load = useCallback(async () => {
    const current = dataRef.current;
    if (!hasKey(current)) {
      toast.error("Email and phone are required", {
        description: "Fill in email and phone to load a saved draft.",
      });
      return false;
    }
    return loadByKey(keyOf(current), false);
  }, [loadByKey]);

  const deleteDraft = useCallback(async () => {
    const current = dataRef.current;
    if (!hasKey(current)) return;
    const { email, phone } = keyOf(current);
    await supabase
      .from("signature_drafts")
      .delete()
      .eq("email", email)
      .eq("phone", phone);
    clearSessionKey();
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      // After 5 min of no interaction, remove the draft from DB
      void deleteDraft();
      toast("Draft deleted", {
        description: "5 minutes of inactivity elapsed.",
      });
    }, INACTIVITY_MS);
  }, [deleteDraft]);

  // Touch (refresh last_accessed) on user activity, throttled
  const touch = useCallback(async () => {
    resetInactivityTimer();
    const current = dataRef.current;
    if (!hasKey(current)) return;
    const now = Date.now();
    if (now - lastTouchRef.current < TOUCH_THROTTLE_MS) return;
    lastTouchRef.current = now;
    const { email, phone } = keyOf(current);
    await supabase
      .from("signature_drafts")
      .update({ last_accessed_at: new Date().toISOString() })
      .eq("email", email)
      .eq("phone", phone);
  }, [resetInactivityTimer]);

  // Auto-restore on mount (refresh recovery)
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    const k = readSessionKey();
    if (k) {
      void loadByKey(k, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save (debounced) whenever data changes and key is present
  useEffect(() => {
    if (!hasKey(data)) return;
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      void upsertDraft(true);
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [data, upsertDraft]);

  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, []);

  return { save, load, deleteDraft, touch };
}
