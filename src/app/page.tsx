import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div className="blueprint-bg" />
      <Nav />
      <Hero />
      <Work />
      <ContactSection />
      <Footer />
    </>
  );
}
