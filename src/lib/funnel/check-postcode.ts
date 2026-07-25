/**
 * UK postcode availability check. Hits the existing /api/coverage route
 * (backed by postcodes.io) and returns the real area name to echo back —
 * "We're available in Westminster". InstallPros covers the whole UK, so any
 * valid postcode resolves to "available"; only invalid postcodes are rejected.
 */
export type PostcodeStatus = "available" | "invalid" | "error";

export interface PostcodeCheck {
  status: PostcodeStatus;
  region: string;
}

export async function checkUkPostcode(postcode: string): Promise<PostcodeCheck> {
  try {
    const res = await fetch("/api/coverage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postcode }),
    });
    const json = (await res.json()) as { result: string; location_name?: string; region?: string };
    if (json.result === "available" || json.result === "waitlist") {
      return { status: "available", region: json.location_name || json.region || "your area" };
    }
    if (json.result === "invalid") return { status: "invalid", region: "" };
    return { status: "error", region: "" };
  } catch {
    return { status: "error", region: "" };
  }
}
