import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { ContactForm } from "../../components/site/Misc";

// Company contact details — update these when the Settings API is available
const COMPANY = {
  phone: "+91 98765 43210",
  email: "hello@nextsteelinnovation.in",
  address: "Plot No 39 Om Industrial Park Part 2, B/H Paavan Industrial Park Bakrol Bujrang Ahmedabad Gujarat -382430",
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
            Questions about a kitchen rack, trolley, storage organizer, or a bulk order —
            our team is here to help. We aim to respond to every enquiry within one business day.
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

            {/* WhatsApp direct card */}
            <a
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "919876543210"}?text=${encodeURIComponent("Hi Next Steel Innovation, I have an enquiry.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-50/40 p-5 transition-all hover:bg-emerald-50 hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-sm">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  Chat Instantly
                </p>
                <p className="mt-1 text-sm font-medium text-charcoal-950">WhatsApp Direct Support</p>
                <p className="mt-0.5 text-xs text-stone-400">Quick answers on stock & specifications</p>
              </div>
            </a>
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
