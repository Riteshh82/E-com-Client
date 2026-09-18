import { ShieldCheck, Gem, Building2, Layers, Award, Users, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Quality Commitment",
    desc: "Every tile is inspected for gauge, finish and consistency before it leaves the workshop.",
  },
  {
    icon: Gem,
    title: "Design-Led Products",
    desc: "Finishes developed with architects and interior designers, not mass-market defaults.",
  },
  {
    icon: Layers,
    title: "Full Product Range",
    desc: "From smooth classic tiles to facade-grade architectural surfaces.",
  },
  {
    icon: Building2,
    title: "B2B Capabilities",
    desc: "Dedicated bulk pricing, project support and dispatch for trade and commercial orders.",
  },
];

const stats = [
  { value: "2018", label: "Year Founded", icon: Award },
  { value: "500+", label: "Projects Done", icon: MapPin },
  { value: "8+", label: "Copper Finishes", icon: Layers },
  { value: "B2B", label: "Trade Support", icon: Users },
];

const timeline = [
  {
    year: "2018",
    title: "Founded in Mumbai",
    desc: "Started with a single copper tile design, crafted by hand in a small workshop in Lower Parel.",
  },
  {
    year: "2020",
    title: "Expanded to 6 Collections",
    desc: "Launched our full range — from classic polished tiles to hammered architectural panels.",
  },
  {
    year: "2022",
    title: "Marketplace Partnerships",
    desc: "Joined Amazon and Flipkart to make premium copper surfaces accessible across India.",
  },
  {
    year: "2024",
    title: "B2B Programme",
    desc: "Launched dedicated bulk ordering for architects, contractors and interior designers.",
  },
];

export default function About() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1622467827417-bec7da96f1ba?auto=format&fit=crop&w=1600&q=85"
            alt="Copper texture background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal-950/85 via-charcoal-950/70 to-copper-900/50" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 py-32 lg:px-10">
          <span className="inline-flex items-center rounded-full border border-copper-400/30 bg-copper-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-copper-300">
            Our Story
          </span>
          <h1 className="mt-5 font-display text-5xl leading-tight text-cream-50 sm:text-6xl lg:text-7xl">
            About Coppera
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-300">
            We design and produce copper tiles and architectural surfaces for spaces that are
            meant to be remembered — bringing warmth, craft and character to modern interiors.
          </p>
        </div>
      </section>

      {/* ── Stats row ── */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-charcoal-950/8 lg:grid-cols-4 lg:divide-y-0">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center py-12 px-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-copper-50 text-copper-600">
                <s.icon className="h-5 w-5" />
              </div>
              <p className="mt-3 font-display text-4xl text-charcoal-950">{s.value}</p>
              <p className="mt-1 text-sm text-stone-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-copper-600">Who We Are</span>
            <h2 className="mt-3 font-display text-4xl text-charcoal-950">Our Story</h2>
            <p className="mt-5 leading-relaxed text-stone-600">
              Coppera began with a simple observation: copper, one of the oldest materials used by
              architects and craftspeople, was rarely available in a form that felt considered rather
              than decorative. We set out to change that — building a focused range of copper tiles,
              panels and surfaces engineered for how modern interiors are actually designed and built.
            </p>
            <p className="mt-4 leading-relaxed text-stone-600">
              Every product in our range is developed in close collaboration with architects and
              interior designers — people who know that the difference between a good space and a
              great one often comes down to the quality of a single material decision.
            </p>

            <Link to="/products" className="mt-8 inline-block">
              <Button>View Our Products</Button>
            </Link>
          </div>

          {/* Timeline */}
          <div className="space-y-6">
            {timeline.map((item, i) => (
              <div key={item.year} className={`flex gap-5 animate-fade-up stagger-${i + 1}`}>
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-copper-400 bg-copper-50 font-display text-xs text-copper-700">
                    {item.year.slice(2)}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="mt-1 flex-1 w-px bg-gradient-to-b from-copper-300/40 to-transparent min-h-[2rem]" />
                  )}
                </div>
                <div className="pb-6">
                  <span className="text-xs font-semibold text-copper-600">{item.year}</span>
                  <h3 className="mt-0.5 font-display text-lg text-charcoal-950">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vision ── */}
      <section className="relative overflow-hidden bg-charcoal-950">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 -translate-y-1/3 translate-x-1/3 rounded-full bg-copper-500/8 blur-[80px]" />
        <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-copper-400">Vision</span>
          <h2 className="mt-3 font-display text-4xl text-cream-50 sm:text-5xl">Our Vision</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-stone-400">
            To make premium copper surfaces a practical, specifiable material for architects,
            interior designers and homeowners — not a rare or bespoke indulgence, but a considered
            choice available at the scale a project needs.
          </p>
        </div>
      </section>

      {/* ── Pillars ── */}
      <section className="bg-beige-100/50">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-copper-600">What Drives Us</span>
            <h2 className="mt-3 font-display text-4xl text-charcoal-950">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <div
                key={p.title}
                className={`rounded-2xl bg-white p-7 shadow-sm border border-charcoal-950/6 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-copper-400/30 animate-fade-up stagger-${i + 1}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-copper-50 text-copper-600">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg text-charcoal-950">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── B2B callout ── */}
      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
        <div className="flex flex-col gap-8 rounded-3xl border border-copper-500/20 bg-gradient-to-br from-copper-50 to-white p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl text-charcoal-950">
              Ready to work with us on a project?
            </h2>
            <p className="mt-2 text-stone-500">
              Our B2B team supports architects, designers and contractors with dedicated pricing and project support.
            </p>
          </div>
          <Link to="/bulk-orders" className="shrink-0">
            <Button size="lg">Request Bulk Quote</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
