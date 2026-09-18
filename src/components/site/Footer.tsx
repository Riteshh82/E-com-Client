import { Link } from "react-router-dom";
import { companySettings } from "../../data/mockData";
import { Mail, Phone, MapPin } from "lucide-react";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M14 8.5h2.5V5H14c-2 0-3.5 1.6-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.3l.7-3.5h-3V9c0-.3.2-1 1-1Z" />
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="7.5" y1="10.5" x2="7.5" y2="17" />
      <circle cx="7.5" cy="7.2" r="0.6" fill="currentColor" stroke="none" />
      <path d="M11.5 17v-4.2c0-1.3 1-2.3 2.3-2.3s2.2 1 2.2 2.3V17" />
    </svg>
  );
}

const columns = [
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Products", to: "/products" },
      { label: "Collections", to: "/collections" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "For Businesses",
    links: [
      { label: "Bulk Orders", to: "/bulk-orders" },
      { label: "Request Quote", to: "/bulk-orders" },
      { label: "Project Enquiries", to: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", to: "/contact" },
      { label: "FAQs", to: "/about" },
    ],
  },
];

const contactItems = [
  { icon: Phone, value: companySettings.phone },
  { icon: Mail, value: companySettings.email },
  { icon: MapPin, value: "Lower Parel, Mumbai" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-charcoal-950 text-cream-100">
      {/* Decorative copper glow */}
      <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-copper-500/5 blur-[80px]" />

      {/* Top copper border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-copper-500/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-copper-500 font-display text-base text-charcoal-950">
                C
              </span>
              <span className="font-display text-xl tracking-wide text-cream-50">
                {companySettings.name}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-400">
              Premium copper tiles and architectural surfaces. Crafted for spaces
              that are built to be noticed.
            </p>

            {/* Contact items */}
            <div className="mt-6 space-y-2.5">
              {contactItems.map(({ icon: Icon, value }) => (
                <div key={value} className="flex items-center gap-2.5 text-xs text-stone-500">
                  <Icon className="h-3.5 w-3.5 text-copper-400 shrink-0" />
                  {value}
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div className="mt-6 flex gap-2.5">
              {[
                { icon: InstagramIcon, href: companySettings.instagram, label: "Instagram" },
                { icon: FacebookIcon, href: companySettings.facebook, label: "Facebook" },
                { icon: LinkedinIcon, href: companySettings.linkedin, label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-50/12 text-stone-400 transition-all hover:border-copper-400 hover:bg-copper-500/10 hover:text-copper-300"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm tracking-wider text-copper-400">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-stone-500 transition-colors hover:text-cream-50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Marketplace column */}
          <div>
            <h4 className="font-display text-sm tracking-wider text-copper-400">Buy Online</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={companySettings.amazonStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-stone-500 transition-colors hover:text-[#FF9900]"
                >
                  Amazon India
                </a>
              </li>
              <li>
                <a
                  href={companySettings.flipkartStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-stone-500 transition-colors hover:text-[#2874F0]"
                >
                  Flipkart
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-3 border-t border-cream-50/8 pt-6 text-xs text-stone-600 md:flex-row md:items-center md:justify-between">
          <p>© 2026 {companySettings.name}. All rights reserved.</p>
          <p>Products sold via Amazon & Flipkart. Bulk orders handled directly.</p>
        </div>
      </div>
    </footer>
  );
}
