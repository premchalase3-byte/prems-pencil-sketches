import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import BeforeAfter from "../components/BeforeAfter";
import HowItWorks from "../components/HowItWorks";
import Portfolio from "../components/Portfolio";
import Pricing from "../components/Pricing";
import Reviews from "../components/Reviews";
import About from "../components/About";
import FAQ from "../components/FAQ";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import Challenge from "../components/Challenge";
import ChallengePopup from "../components/ChallengePopup";
export default function Home() {
  return (
    <main>
      <ChallengePopup />
      <Navbar />
      <Hero />
      <Stats />
      <BeforeAfter />
      <HowItWorks />
      <Portfolio />
      <Pricing />
      <Reviews />
      <About />
      <Challenge />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}