"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/system/button";
import { StepIndicator } from "./step-indicator";
import { useIsMobile } from "@/hooks/use-mobile";
import { track, EVENTS } from "@/lib/analytics";
import { fireGoogleAdsConversion } from "@/lib/funnel/google-ads-conversion";

interface QuoteData {
  name?: string;
  email?: string;
  phone?: string;
  state?: string;
  installationType?: string;
  leadId?: string;
}

const STEPS = [
  { number: 1, label: "Check Availability", completed: true },
  { number: 2, label: "Upload Property Photos", completed: false },
  { number: 3, label: "Same-Day Quote", completed: false },
];

/**
 * Step 2 of the funnel: collect exterior property photos. Mobile gets a
 * camera-capture button + library; desktop gets a single upload button.
 * Uploads stream sequentially with a progress bar, then advance to the quote.
 */
export function PropertyImageUpload() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const cameraRef = useRef<HTMLInputElement>(null);
  const libraryRef = useRef<HTMLInputElement>(null);

  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Uploading photos...");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("quoteFormData");
      if (raw) setQuote(JSON.parse(raw) as QuoteData);
    } catch {
      /* noop */
    }

    track(EVENTS.PAGE_VIEW, { cta_location: "upload_property_images" });

    // Shared with the thank-you page: whichever a converted lead lands on
    // records the conversion, and only the first one does.
    return fireGoogleAdsConversion();
  }, []);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    // Snapshot BEFORE clearing the input — FileList is live, and the React
    // state updater runs after `value = ""` empties it.
    const picked = Array.from(e.target.files);
    e.target.value = "";
    if (picked.length) setFiles((prev) => [...prev, ...picked]);
  }
  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  async function handleSubmit() {
    if (files.length === 0) return;
    setUploading(true);
    setProgress(0);
    setStatusText("Uploading photos...");

    try {
      for (let i = 0; i < files.length; i++) {
        const body = new FormData();
        body.append("file", files[i]);
        body.append("email", quote?.email ?? "");
        body.append("phone", quote?.phone ?? "");
        body.append("lead_id", quote?.leadId ?? "");
        await fetch("/api/property-photos", { method: "POST", body });
        setProgress(Math.round(((i + 1) / files.length) * 90));
      }

      setStatusText("Processing...");
      setProgress(95);
      setProgress(100);
      setStatusText("Complete!");
      track(EVENTS.QUOTE_SUBMITTED, { cta_location: "photo_upload" });
      toast.success("Photos submitted! We're preparing your same-day quote.");
      setTimeout(() => router.push("/same-day-quote"), 500);
    } catch {
      toast.error("Upload failed. Please try again or text your photos instead.");
      setUploading(false);
    }
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-center bg-white md:h-20">
        <a href="/" aria-label="InstallPros home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/funnel/installpros-logo-colored-new.svg" alt="InstallPros" className="h-8 md:h-10" />
        </a>
      </header>

      <main className="min-h-screen bg-[#0a0a0a] px-6 pb-20 pt-40 text-white md:pt-48">
        <div className="mx-auto max-w-3xl">
          <StepIndicator steps={STEPS} currentStep={2} variant="dark" />

          <h1 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">
            One last step to your quote
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-center text-body text-muted-foreground">
            Your details are in. Add a few exterior photos so we can price your install accurately, and then your
            same-day quote is on its way.
          </p>

          <div className="mx-auto max-w-xl">
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" multiple onChange={onPick} className="hidden" />
            <input ref={libraryRef} type="file" accept="image/*" multiple onChange={onPick} className="hidden" />

            {files.length === 0 ? (
              <div>
                {isMobile ? (
                  <div className="space-y-3">
                    <Button onClick={() => cameraRef.current?.click()} size="lg" className="w-full normal-case">
                      <Camera className="mr-2 h-5 w-5" /> Take Photos
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => libraryRef.current?.click()}
                      size="lg"
                      className="w-full border-white/30 normal-case text-white/70 hover:bg-white/10 hover:text-white"
                    >
                      <ImagePlus className="mr-2 h-5 w-5" /> Upload from Library
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => libraryRef.current?.click()} size="lg" className="w-full normal-case">
                    <ImagePlus className="mr-2 h-5 w-5" /> Upload Photos
                  </Button>
                )}
                <p className="mt-3 text-center text-label text-muted-foreground">Takes ~30 seconds</p>
              </div>
            ) : (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="mb-3 text-body font-medium text-primary">
                  {files.length} photo{files.length === 1 ? "" : "s"} ready to upload:
                </p>
                <div className="flex flex-wrap gap-3">
                  {files.map((file, idx) => (
                    <div key={idx} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Photo ${idx + 1}`}
                        className="h-24 w-24 rounded-lg border border-white/10 object-cover md:h-28 md:w-28"
                      />
                      {!uploading && (
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          aria-label="Remove photo"
                          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-black/80 transition-colors hover:bg-destructive"
                        >
                          <X className="h-3.5 w-3.5 text-white" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {!uploading && (
                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={() => libraryRef.current?.click()}
                      className="inline-flex items-center gap-1.5 text-body text-muted-foreground transition-colors hover:text-white"
                    >
                      <ImagePlus className="h-4 w-4" /> Add Photos
                    </button>
                  </div>
                )}

                {uploading ? (
                  <div className="mt-4 rounded-lg border border-primary/20 bg-primary/10 p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-body font-medium text-white">{statusText}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      {/* 300ms is deliberate and deliberately not a token: this smooths a
                            data-driven width, not a UI state change, so none of the three
                            motion tokens (quick / card / panel) describes what it does. */}
                        <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                ) : (
                  <Button onClick={handleSubmit} size="lg" className="mt-4 w-full normal-case">
                    Get My Quote →
                  </Button>
                )}
              </div>
            )}

            <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-3 font-semibold text-white">What to include:</h3>
              <ul className="space-y-2">
                {["Front of the house (roof visible)", "Trees or obstacles"].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-body text-white/80">
                    <span className="mt-1.5 leading-none text-primary">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
