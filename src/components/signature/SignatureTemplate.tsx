import { SignatureData } from "@/types/signature";

interface SignatureTemplateProps {
  data: SignatureData;
}

const getFontUrl = (font: string) => {
  const fonts: Record<string, string> = {
    Inter: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
    Rubik: "https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600&display=swap",
    Heebo: "https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600&display=swap",
    Arimo: "https://fonts.googleapis.com/css2?family=Arimo:wght@400;500;600&display=swap",
    "Noto Sans Hebrew": "https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wght@400;500;600&display=swap",
  };
  return fonts[font] || fonts.Inter;
};

// Use img.icons8.com which serves PNG icons that render reliably
// in Gmail, Apple Mail, Outlook, etc. Supports color hex via URL.
const getSocialIconUrl = (platform: string, hexColor: string, size: number = 24) => {
  const cleanHex = hexColor.replace("#", "");
  const map: Record<string, string> = {
    linkedin: "linkedin",
    twitter: "twitterx",
    instagram: "instagram-new",
    facebook: "facebook-new",
    github: "github",
    threads: "threads",
    website: "domain",
  };
  const slug = map[platform];
  if (!slug) return "";
  return `https://img.icons8.com/sf-regular-filled/${size * 2}/${cleanHex}/${slug}.png`;
};

// Inline contact icon (mail/phone/pin) as PNG from icons8 for stacked template
const getContactIconUrl = (kind: "mail" | "phone" | "pin" | "link", hexColor: string, size: number = 14) => {
  const cleanHex = hexColor.replace("#", "");
  const slugMap: Record<string, string> = {
    mail: "new-post",
    phone: "phone",
    pin: "marker",
    link: "domain",
  };
  return `https://img.icons8.com/sf-regular-filled/${size * 2}/${cleanHex}/${slugMap[kind]}.png`;
};

// Classic template (horizontal with separator)
const ClassicTemplate = ({ data }: SignatureTemplateProps) => {
  const { direction, colors, fontFamily, socials } = data;
  const isRTL = direction === "rtl";
  const textAlign = isRTL ? "right" : "left";
  const marginDir = isRTL ? { marginLeft: "8px" } : { marginRight: "8px" };

  const activeSocials = Object.entries(socials).filter(([_, url]) => url && url.trim() !== "");

  return (
    <table
      cellPadding="0"
      cellSpacing="0"
      style={{
        borderCollapse: "collapse",
        fontFamily: `'${fontFamily}', Arial, sans-serif`,
        color: colors.text,
        direction: direction,
      }}
    >
      <tbody>
        <tr>
          {/* Logo/Avatar Column */}
          {data.logoUrl && (
            <td
              style={{
                verticalAlign: "top",
                paddingRight: isRTL ? "0" : "14px",
                paddingLeft: isRTL ? "14px" : "0",
              }}
            >
              <img
                src={data.logoUrl}
                alt={data.fullName}
                width="80"
                height="80"
                style={{
                  borderRadius: "8px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </td>
          )}

          {/* Separator - stretches full height of text content */}
          {data.logoUrl && (
            <td
              style={{
                paddingRight: isRTL ? "0" : "14px",
                paddingLeft: isRTL ? "14px" : "0",
                verticalAlign: "stretch",
              }}
            >
              <div
                style={{
                  width: "2px",
                  height: "100%",
                  minHeight: "80px",
                  backgroundColor: colors.primary,
                  opacity: 0.6,
                }}
              />
            </td>
          )}

          {/* Info Column */}
          <td style={{ verticalAlign: "top", textAlign }}>
            <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: "collapse" }}>
              <tbody>
                {/* Name */}
                <tr>
                  <td style={{ paddingBottom: "2px" }}>
                    <span
                      style={{
                        fontSize: "17px",
                        fontWeight: 600,
                        color: colors.text,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {data.fullName}
                    </span>
                  </td>
                </tr>

                {/* Job Title & Company */}
                <tr>
                  <td style={{ paddingBottom: "10px" }}>
                    <span style={{ fontSize: "13px", color: colors.secondary }}>
                      {data.jobTitle}
                      {data.companyName && (
                        <>
                          <span style={{ ...marginDir, opacity: 0.5 }}> | </span>
                          <span style={{ color: colors.primary, fontWeight: 500 }}>
                            {data.companyName}
                          </span>
                        </>
                      )}
                    </span>
                  </td>
                </tr>

                {/* Contact Info */}
                {(data.email || data.phone) && (
                  <tr>
                    <td style={{ paddingBottom: "6px" }}>
                      <table cellPadding="0" cellSpacing="0">
                        <tbody>
                          <tr>
                            {data.email && (
                              <td>
                                <a
                                  href={`mailto:${data.email}`}
                                  style={{
                                    fontSize: "12px",
                                    color: colors.secondary,
                                    textDecoration: "none",
                                  }}
                                >
                                  {data.email}
                                </a>
                              </td>
                            )}
                            {data.email && data.phone && (
                              <td style={{ padding: "0 8px", color: colors.secondary, opacity: 0.5 }}>|</td>
                            )}
                            {data.phone && (
                              <td>
                                <a
                                  href={`tel:${data.phone}`}
                                  style={{
                                    fontSize: "12px",
                                    color: colors.secondary,
                                    textDecoration: "none",
                                  }}
                                >
                                  {data.phone}
                                </a>
                              </td>
                            )}
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}

                {/* Address */}
                {data.address && (
                  <tr>
                    <td style={{ paddingBottom: "10px" }}>
                      <span style={{ fontSize: "12px", color: colors.secondary, opacity: 0.8 }}>
                        {data.address}
                      </span>
                    </td>
                  </tr>
                )}

                {/* Social Links */}
                {activeSocials.length > 0 && (
                  <tr>
                    <td style={{ paddingTop: "2px" }}>
                      <table cellPadding="0" cellSpacing="0">
                        <tbody>
                          <tr>
                            {activeSocials.map(([platform, url], index) => (
                              <td
                                key={platform}
                                style={{
                                  paddingLeft: !isRTL && index > 0 ? "10px" : undefined,
                                  paddingRight: isRTL && index > 0 ? "10px" : undefined,
                                }}
                              >
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    textDecoration: "none",
                                    display: "inline-block",
                                  }}
                                >
                                  <img
                                    src={getSocialIconUrl(platform, colors.primary, 18)}
                                    alt={platform}
                                    width="18"
                                    height="18"
                                    style={{ display: "block", border: 0 }}
                                  />
                                </a>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

// Stacked template (with icons next to contact info)
const StackedTemplate = ({ data }: SignatureTemplateProps) => {
  const { direction, colors, fontFamily, socials } = data;
  const isRTL = direction === "rtl";
  const textAlign = isRTL ? "right" : "left";

  const activeSocials = Object.entries(socials).filter(([_, url]) => url && url.trim() !== "");

  return (
    <table
      cellPadding="0"
      cellSpacing="0"
      style={{
        borderCollapse: "collapse",
        fontFamily: `'${fontFamily}', Arial, sans-serif`,
        color: colors.text,
        direction: direction,
      }}
    >
      <tbody>
        <tr>
          {/* Logo/Avatar Column */}
          {data.logoUrl && (
            <td
              style={{
                verticalAlign: "top",
                paddingRight: isRTL ? "0" : "18px",
                paddingLeft: isRTL ? "18px" : "0",
              }}
            >
              <img
                src={data.logoUrl}
                alt={data.fullName}
                width="80"
                height="80"
                style={{
                  borderRadius: "12px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </td>
          )}

          {/* Separator - stretches full height of text content */}
          {data.logoUrl && (
            <td
              style={{
                paddingRight: isRTL ? "0" : "14px",
                paddingLeft: isRTL ? "14px" : "0",
                verticalAlign: "stretch",
              }}
            >
              <div
                style={{
                  width: "2px",
                  height: "100%",
                  minHeight: "90px",
                  backgroundColor: colors.primary,
                  opacity: 0.6,
                }}
              />
            </td>
          )}

          {/* Info Column */}
          <td style={{ verticalAlign: "top", textAlign }}>
            <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: "collapse" }}>
              <tbody>
                {/* Name */}
                <tr>
                  <td style={{ paddingBottom: "4px" }}>
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: colors.text,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {data.fullName}
                    </span>
                  </td>
                </tr>

                {/* Job Title & Company */}
                <tr>
                  <td style={{ paddingBottom: "12px" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        color: colors.secondary,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        fontWeight: 500,
                      }}
                    >
                      {data.jobTitle}
                      {data.companyName && (
                        <>
                          <span style={{ opacity: 0.4, margin: "0 8px" }}>|</span>
                          <span style={{ color: colors.primary }}>
                            {data.companyName}
                          </span>
                        </>
                      )}
                    </span>
                  </td>
                </tr>

                {/* Email with icon */}
                {data.email && (
                  <tr>
                    <td style={{ paddingBottom: "4px" }}>
                      <table cellPadding="0" cellSpacing="0">
                        <tbody>
                          <tr>
                            <td style={{ paddingRight: isRTL ? "0" : "8px", paddingLeft: isRTL ? "8px" : "0", verticalAlign: "middle" }}>
                              <img
                                src={getContactIconUrl("mail", colors.secondary, 14)}
                                alt="email"
                                width="14"
                                height="14"
                                style={{ display: "block", border: 0, opacity: 0.8 }}
                              />
                            </td>
                            <td>
                              <a
                                href={`mailto:${data.email}`}
                                style={{
                                  fontSize: "13px",
                                  color: colors.secondary,
                                  textDecoration: "none",
                                }}
                              >
                                {data.email}
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}

                {/* Phone with icon */}
                {data.phone && (
                  <tr>
                    <td style={{ paddingBottom: "4px" }}>
                      <table cellPadding="0" cellSpacing="0">
                        <tbody>
                          <tr>
                            <td style={{ paddingRight: isRTL ? "0" : "8px", paddingLeft: isRTL ? "8px" : "0", verticalAlign: "middle" }}>
                              <img
                                src={getContactIconUrl("phone", colors.secondary, 14)}
                                alt="phone"
                                width="14"
                                height="14"
                                style={{ display: "block", border: 0, opacity: 0.8 }}
                              />
                            </td>
                            <td>
                              <a
                                href={`tel:${data.phone}`}
                                style={{
                                  fontSize: "13px",
                                  color: colors.secondary,
                                  textDecoration: "none",
                                }}
                              >
                                {data.phone}
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}

                {/* Website with icon */}
                {socials.website && (
                  <tr>
                    <td style={{ paddingBottom: "4px" }}>
                      <table cellPadding="0" cellSpacing="0">
                        <tbody>
                          <tr>
                            <td style={{ paddingRight: isRTL ? "0" : "8px", paddingLeft: isRTL ? "8px" : "0", verticalAlign: "middle" }}>
                              <img
                                src={getContactIconUrl("link", colors.primary, 14)}
                                alt="website"
                                width="14"
                                height="14"
                                style={{ display: "block", border: 0, opacity: 0.85 }}
                              />
                            </td>
                            <td>
                              <a
                                href={socials.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: "13px",
                                  color: colors.primary,
                                  textDecoration: "none",
                                }}
                              >
                                {socials.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}

                {/* Address with icon */}
                {data.address && (
                  <tr>
                    <td style={{ paddingBottom: "10px" }}>
                      <table cellPadding="0" cellSpacing="0">
                        <tbody>
                          <tr>
                            <td style={{ paddingRight: isRTL ? "0" : "8px", paddingLeft: isRTL ? "8px" : "0", verticalAlign: "middle" }}>
                              <img
                                src={getContactIconUrl("pin", colors.secondary, 14)}
                                alt="location"
                                width="14"
                                height="14"
                                style={{ display: "block", border: 0, opacity: 0.8 }}
                              />
                            </td>
                            <td>
                              <span style={{ fontSize: "13px", color: colors.secondary }}>
                                {data.address}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}

                {/* Social Links (excluding website since it's shown above) */}
                {activeSocials.filter(([platform]) => platform !== 'website').length > 0 && (
                  <tr>
                    <td style={{ paddingTop: "4px" }}>
                      <table cellPadding="0" cellSpacing="0">
                        <tbody>
                          <tr>
                            {activeSocials
                              .filter(([platform]) => platform !== 'website')
                              .map(([platform, url], index) => (
                                <td
                                  key={platform}
                                  style={{
                                    paddingLeft: !isRTL && index > 0 ? "12px" : undefined,
                                    paddingRight: isRTL && index > 0 ? "12px" : undefined,
                                  }}
                                >
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      textDecoration: "none",
                                      display: "inline-block",
                                    }}
                                  >
                                    <img
                                      src={getSocialIconUrl(platform, colors.primary, 20)}
                                      alt={platform}
                                      width="20"
                                      height="20"
                                      style={{ display: "block", border: 0 }}
                                    />
                                  </a>
                                </td>
                              ))}
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export const SignatureTemplate = ({ data }: SignatureTemplateProps) => {
  const { direction, fontFamily, template } = data;

  return (
    <div dir={direction} style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
      <link href={getFontUrl(fontFamily)} rel="stylesheet" />
      {template === 'stacked' ? (
        <StackedTemplate data={data} />
      ) : (
        <ClassicTemplate data={data} />
      )}
    </div>
  );
};

export default SignatureTemplate;
