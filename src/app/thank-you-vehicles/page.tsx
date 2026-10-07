import type { Metadata } from "next";
import { VehiclePhotoRequestCard } from "@/components/funnel/vehicle-photo-request-card";
import { FunnelHeaderLight } from "@/components/funnel/funnel-header-light";
import { FunnelFooter } from "@/components/funnel/funnel-footer";

export const metadata: Metadata = {
  title: "One Step Left",
  robots: { index: false, follow: false },
};

/**
 * Post-submit page for the vehicle funnel, serving both the vehicles landing
 * and its weather-hero variant, which pass the same install type.
 *
 * It asks for photos like the residential one, but different photos: the
 * landing's own promise is "Fixed quote from two photos", so this is where
 * that promise is kept. lib/funnel/thank-you-path.ts covers the routing.
 */
export default function ThankYouVehiclesPage() {
  return (
    <div className="theme-editorial flex min-h-screen flex-col bg-background md:bg-secondary">
      <FunnelHeaderLight />
      <main id="main" tabIndex={-1} className="flex flex-1 items-center justify-center px-5 py-10 outline-none md:py-14">
        <VehiclePhotoRequestCard />
      </main>
      <FunnelFooter />
    </div>
  );
}
