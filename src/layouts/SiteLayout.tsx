import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/site/Header";
import { Footer } from "../components/site/Footer";
import { WhatsAppButton } from "../components/site/WhatsAppButton";
import { useScrollReveal } from "../lib/useScrollReveal";

export function SiteLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useScrollReveal<HTMLElement>();

  return (
    <div className="flex min-h-screen flex-col bg-cream-50 w-full">
      <Header onMobileMenuChange={setMobileMenuOpen} />
      <main ref={containerRef} className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton hidden={mobileMenuOpen} />
    </div>
  );
}
