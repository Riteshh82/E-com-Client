import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { ContactForm } from "../../components/site/Misc";
import { WhatsAppButton } from "../../components/site/WhatsAppButton";

// Company contact details — update these when the Settings API is available
const COMPANY = {
  phone: "+91 98765 43210",
  email: "hello@nextsteelinnovation.in",
  address: "Plot 14, Industrial Estate, Lower Parel, Mumbai, Maharashtra 400013",
};

const contactItems = [
  {
    icon: Phone,
    label: "Phone",
    value: COMPANY.phone,
    sub: "Mon – Sat, 9 AM – 6 PM IST",
    href: `tel:${COMPANY.phone}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: COMPANY.email,
    sub: "We reply within one business day",
    href: `mailto:${COMPANY.email}`,
  },
  {
    icon: MapPin,
    label: "Address",
    value: COMPANY.address,
    sub: "Visit by appointment only",
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Mon – Sat, 9:00 AM – 6:00 PM",
    sub: "Closed on public holidays",
  },
];

export default function Contact() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="bg-charcoal-950 relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 bottom-0 h-80 w-80 -translate-x-1/3 translate-y-1/3 rounded-full bg-copper-500/8 blur-[70px]" />
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
          <span className="inline-flex items-center rounded-full border border-copper-400/30 bg-copper-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-copper-300">
            Reach Out
          </span>
          <h1 className="mt-5 font-display text-5xl leading-tight text-cream-50 sm:text-6xl">
            Get in Touch
          </h1>
          <p className="mt-5 max-w-xl text-stone-400">
            Questions about a product, a project, or a bulk order — our team is here to help.
            We aim to respond to every enquiry within one business day.
          </p>
        </div>
      </section>

      {/* ── Main ── */}
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Left — info */}
          <div className="lg:col-span-2 space-y-5">
            {contactItems.map((item) => {
              const content = (
                <div className="flex items-start gap-4 rounded-2xl border border-charcoal-950/8 bg-white p-5 transition-all hover:border-copper-400/30 hover:shadow-md">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-copper-50 text-copper-600">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-charcoal-950">{item.value}</p>
                    <p className="mt-0.5 text-xs text-stone-400">{item.sub}</p>
                  </div>
                </div>
              );
              return item.href ? (
                <a key={item.label} href={item.href} className="block">
                  {content}
                </a>
              ) : (
                <div key={item.label}>{content}</div>
              );
            })}

            {/* WhatsApp */}
            <WhatsAppButton />
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-charcoal-950/8 bg-white p-8 shadow-sm lg:p-10">
              <h2 className="font-display text-2xl text-charcoal-950">Send us a message</h2>
              <p className="mt-1.5 text-sm text-stone-500">
                Fill in the form and we'll get back to you as soon as possible.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
