import { useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SignatureData } from "@/types/signature";
import { toast } from "sonner";

const INACTIVITY_MS = 5 * 60 * 1000; // 5 minutes
const TOUCH_THROTTLE_MS = 30 * 1000; // refresh last_accessed at most every 30s

export function useDraftStorage(
  data: SignatureData,
  setData: (d: SignatureData) => void
) {
  const lastTouchRef = useRef<number>(0);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const keyOf = (d: SignatureData) => ({
    email: d.email.trim().toLowerCase(),
    phone: d.phone.trim(),
  });

  const hasKey = (d: SignatureData) => {
    const { email, phone } = keyOf(d);
    return email.length > 0 && phone.length > 0;
  };

  const save = useCallback(async () => {
    if (!hasKey(data)) {
      toast.error("נדרשים אימייל וטלפון", {
        description: "שדות האימייל והטלפון הם המפתח לשמירת הטיוטה.",
      });
      return false;
    }
    const { email, phone } = keyOf(data);
    const { error } = await supabase
      .from("signature_drafts")
      .upsert(
        {
          email,
          phone,
          data: data as unknown as Record<string, unknown>,
          last_accessed_at: new Date().toISOString(),
        },
        { onConflict: "email,phone" }
      );
    if (error) {
      toast.error("שמירה נכשלה", { description: error.message });
      return false;
    }
    toast.success("הטיוטה נשמרה זמנית", {
      description: "תימחק אוטומטית לאחר 5 דקות של חוסר פעילות.",
    });
    lastTouchRef.current = Date.now();
    resetInactivityTimer();
    return true;
  }, [data]);

  const load = useCallback(async () => {
    if (!hasKey(data)) {
      toast.error("נדרשים אימייל וטלפון", {
        description: "מלא את האימייל והטלפון כדי לטעון טיוטה שמורה.",
      });
      return false;
    }
    const { email, phone } = keyOf(data);
    const { data: row, error } = await supabase
      .from("signature_drafts")
      .select("data")
      .eq("email", email)
      .eq("phone", phone)
      .maybeSingle();
    if (error) {
      toast.error("טעינה נכשלה", { description: error.message });
      return false;
    }
    if (!row) {
      toast("לא נמצאה טיוטה שמורה", {
        description: "ייתכן שעברו יותר מ-5 דקות והיא נמחקה.",
      });
      return false;
    }
    setData(row.data as unknown as SignatureData);
    // refresh last_accessed
    await supabase
      .from("signature_drafts")
      .update({ last_accessed_at: new Date().toISOString() })
      .eq("email", email)
      .eq("phone", phone);
    toast.success("הטיוטה נטענה");
    lastTouchRef.current = Date.now();
    resetInactivityTimer();
    return true;
  }, [data, setData]);

  const deleteDraft = useCallback(async () => {
    if (!hasKey(data)) return;
    const { email, phone } = keyOf(data);
    await supabase
      .from("signature_drafts")
      .delete()
      .eq("email", email)
      .eq("phone", phone);
  }, [data]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      // After 5 min of no interaction, remove the draft from DB
      void deleteDraft();
      toast("הטיוטה נמחקה", {
        description: "עברו 5 דקות של חוסר פעילות.",
      });
    }, INACTIVITY_MS);
  }, [deleteDraft]);

  // Touch (refresh last_accessed) on user activity, throttled
  const touch = useCallback(async () => {
    resetInactivityTimer();
    if (!hasKey(data)) return;
    const now = Date.now();
    if (now - lastTouchRef.current < TOUCH_THROTTLE_MS) return;
    lastTouchRef.current = now;
    const { email, phone } = keyOf(data);
    await supabase
      .from("signature_drafts")
      .update({ last_accessed_at: new Date().toISOString() })
      .eq("email", email)
      .eq("phone", phone);
  }, [data, resetInactivityTimer]);

  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, []);

  return { save, load, deleteDraft, touch };
}
