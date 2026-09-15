import type { Metadata } from "next";

/**
 * /go is the split-URL entry point: it assigns a variant in the browser and
 * redirects. It is a redirector, not a page, so there is nothing to index.
 *
 * The tag lives here and not in page.tsx because that file is a client
 * component, and a client component cannot export `metadata`.
 *
 * Note it stays crawlable on purpose. A noindex is only obeyed if the crawler
 * can fetch the page and read it: blocking the path in robots.txt instead
 * would leave the URL indexable with no content, which is the opposite of
 * what we want.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function GoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
