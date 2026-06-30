import { PrivacyBanner } from "@/components/layout/PrivacyBanner";
import { Hero } from "@/components/home/Hero";
import { ToolGrid } from "@/components/home/ToolGrid";
import { TrustSignals } from "@/components/home/TrustSignals";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 sm:py-12">
      <Hero />
      <PrivacyBanner />
      <ToolGrid />
      <TrustSignals />
    </div>
  );
}
