import { SignatureData } from "@/types/signature";
import { Linkedin, Twitter, Instagram, Facebook, Github, Globe } from "lucide-react";

interface SignatureTemplateProps {
  data: SignatureData;
}

const getFontUrl = (font: string) => {
  const fonts: Record<string, string> = {
    Inter: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
    Rubik: "https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600&display=swap",
    Heebo: "https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600&display=swap",
    Arimo: "https://fonts.googleapis.com/css2?family=Arimo:wght@400;500;600&display=swap",
  };
  return fonts[font] || fonts.Inter;
};

const getSocialIcon = (platform: string, color: string) => {
  const iconStyle = { width: 20, height: 20, color };
  switch (platform) {
    case "linkedin":
      return <Linkedin style={iconStyle} />;
    case "twitter":
      return <Twitter style={iconStyle} />;
    case "instagram":
      return <Instagram style={iconStyle} />;
    case "facebook":
      return <Facebook style={iconStyle} />;
    case "github":
      return <Github style={iconStyle} />;
    case "website":
      return <Globe style={iconStyle} />;
    default:
      return null;
  }
};

export const SignatureTemplate = ({ data }: SignatureTemplateProps) => {
  const { direction, colors, fontFamily, socials } = data;
  const isRTL = direction === "rtl";
  const textAlign = isRTL ? "right" : "left";
  const marginDir = isRTL ? { marginLeft: "8px" } : { marginRight: "8px" };
  // Increased spacing between social icons
  const socialMarginDir = isRTL ? { marginRight: "16px" } : { marginLeft: "16px" };

  const activeSocials = Object.entries(socials).filter(([_, url]) => url && url.trim() !== "");

  return (
    <div dir={direction} style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
      <link href={getFontUrl(fontFamily)} rel="stylesheet" />
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
                  paddingRight: isRTL ? "0" : "16px",
                  paddingLeft: isRTL ? "16px" : "0",
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
                  }}
                />
              </td>
            )}

            {/* Separator */}
            {data.logoUrl && (
              <td
                style={{
                  width: "2px",
                  backgroundColor: colors.primary,
                  paddingRight: isRTL ? "0" : "16px",
                  paddingLeft: isRTL ? "16px" : "0",
                }}
              >
                <div
                  style={{
                    width: "2px",
                    height: "80px",
                    backgroundColor: colors.primary,
                  }}
                />
              </td>
            )}

            {/* Info Column */}
            <td style={{ verticalAlign: "top", textAlign, paddingLeft: isRTL ? "0" : "16px", paddingRight: isRTL ? "16px" : "0" }}>
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
                          letterSpacing: "-0.025em",
                        }}
                      >
                        {data.fullName}
                      </span>
                    </td>
                  </tr>

                  {/* Job Title & Company */}
                  <tr>
                    <td style={{ paddingBottom: "12px" }}>
                      <span style={{ fontSize: "14px", color: colors.secondary }}>
                        {data.jobTitle}
                        {data.companyName && (
                          <>
                            <span style={{ ...marginDir }}> | </span>
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
                      <td style={{ paddingBottom: "8px" }}>
                        <table cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              {data.email && (
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
                              )}
                              {data.email && data.phone && (
                                <td style={{ padding: "0 8px", color: colors.secondary }}>|</td>
                              )}
                              {data.phone && (
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
                      <td style={{ paddingBottom: "12px" }}>
                        <span style={{ fontSize: "12px", color: colors.secondary }}>
                          {data.address}
                        </span>
                      </td>
                    </tr>
                  )}

                  {/* Social Links */}
                  {activeSocials.length > 0 && (
                    <tr>
                      <td style={{ paddingTop: "4px" }}>
                        <table cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              {activeSocials.map(([platform, url], index) => (
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
                                    {getSocialIcon(platform, colors.primary)}
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
    </div>
  );
};

export default SignatureTemplate;
