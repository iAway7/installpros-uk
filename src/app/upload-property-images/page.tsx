import type { Metadata } from "next";
import { PropertyImageUpload } from "@/components/funnel/property-image-upload";
import { FunnelFooter } from "@/components/funnel/funnel-footer";

export const metadata: Metadata = {
  title: "Upload Property Photos | InstallPros",
  description: "Upload a few exterior photos of your property to get an accurate same-day Starlink installation quote.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/upload-property-images" },
};

export default function UploadPropertyImagesPage() {
  return (
    <div className="theme-editorial">
      <PropertyImageUpload />
      <FunnelFooter />
    </div>
  );
}
