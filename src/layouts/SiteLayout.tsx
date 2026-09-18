import { Outlet } from "react-router-dom";
import { Header } from "../components/site/Header";
import { Footer } from "../components/site/Footer";

export function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
