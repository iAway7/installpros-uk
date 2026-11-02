import { Star } from "lucide-react";

/**
 * The one Google review about InstallPros phones, above the shared reviews
 * (voip-research, section 5): Diana Rosser, on her landline extensions,
 * shown in the Trustindex widget on Will's WordPress VoIP pages. It is honest
 * about the teething problems, which is the point: 11 of 14 buyers in the
 * chats had one, and what they wanted was someone who sorted it.
 *
 * Verbatim. The rest of the reviews (TrustpilotSection) are about the
 * company, never presented as phone reviews.
 */
export function VoipReviewSection() {
  return (
    <section aria-label="A customer review" className="w-full bg-background pt-16 md:pt-24">
      <div className="container mx-auto">
        <figure className="mx-auto max-w-3xl rounded-3xl bg-secondary p-7 md:p-10">
          <div aria-label="5 out of 5 stars" role="img" className="flex gap-1 text-[#f5b301]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} aria-hidden="true" className="h-5 w-5 fill-current" />
            ))}
          </div>
          <blockquote className="mt-5 text-pretty text-lg text-foreground md:text-xl" style={{ lineHeight: "1.55" }}>
            &ldquo;Although I&apos;ve had a few teething problems with setting up my 3 Landline Extensions James has been
            like a dog with a bone and hasn&apos;t stopped investigating the problem and has got it sorted. Great Customer
            Care and so friendly, professional and helpful.&rdquo;
          </blockquote>
          <figcaption className="mt-5 text-body-sm font-semibold text-muted-foreground">Diana Rosser, Google review</figcaption>
        </figure>
      </div>
    </section>
  );
}
