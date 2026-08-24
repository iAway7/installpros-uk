import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

// Node runtime (not edge): the logo is read straight off disk at build time.
// The previous edge + fetch(new URL(...)) approach resolved to a relative
// /_next/static/media URL, which fetch can't parse — it broke `next build`.
export const alt = "InstallPros: Professional Starlink Installation UK";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Site-wide social share image (og:image), generated at the edge — used by
 * WhatsApp, Facebook, iMessage, Slack, LinkedIn previews when ad URLs are
 * shared. Both landing pages inherit it.
 */
export default async function OgImage() {
  const svg = await readFile(path.join(process.cwd(), "public/funnel/installpros-logo-white-new.svg"));
  const logo = `data:image/svg+xml;base64,${svg.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          background: "linear-gradient(135deg, #0a1929 0%, #0d1b2a 60%, #000000 100%)",
          color: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="" width={380} height={95} style={{ marginBottom: 48 }} />
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: -2, display: "flex" }}>
          Professional Starlink
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: -2, display: "flex" }}>
          Installation Across the UK
        </div>
        <div style={{ marginTop: 32, fontSize: 30, color: "#cbd5e1", display: "flex" }}>
          Same-week fitting · Nationwide UK coverage · 4.9★ rated installers
        </div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            background: "#CC0202",
            color: "#ffffff",
            fontSize: 28,
            fontWeight: 700,
            padding: "18px 44px",
            borderRadius: 14,
          }}
        >
          Check Availability
        </div>
      </div>
    ),
    size,
  );
}
