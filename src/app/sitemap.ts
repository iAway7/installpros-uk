import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteConfig.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/install-quote`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/faqs`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
