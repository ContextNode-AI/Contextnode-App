import { Hero } from "@/components/hero/Hero";
import { SearchCategory } from "@/components/sections/SearchCategory";
import { TrendingAssets } from "@/components/sections/TrendingAssets";
import { WhyContextNode } from "@/components/sections/WhyContextNode";
import { CreativePrompts } from "@/components/sections/CreativePrompts";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { AIEcosystem } from "@/components/sections/AIEcosystem";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/footer/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <CreativePrompts />
      <SearchCategory />
      <TrendingAssets />
      <WhyContextNode />
      <HowItWorks />
      <AIEcosystem />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}
