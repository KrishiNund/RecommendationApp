// The landing page (marketing page for signed out or new users)
import Hero from "./components/Hero";
import Features from "./components/Features";
import CTA from "./components/CTA";
import FAQ from "./components/FAQ";
import Pricing from "./components/Pricing";
import HowItWorks from "./components/HowItWorks";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
      <FAQ />
    </>
  );
}
