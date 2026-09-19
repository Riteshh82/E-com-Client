import { useEffect, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, UploadCloud, Building2, Users, Package, Palette } from "lucide-react";
import { Input, Select, Textarea } from "../../components/ui/index";
import { Button } from "../../components/ui/Button";
import { apiGetProducts, apiSubmitBulkOrder, type ApiProduct } from "../../api";
import { useToast } from "../../context/ToastContext";

const benefits = [
  {
    icon: Package,
    title: "Bulk Quantities",
    desc: "From 100 to 10,000+ tiles — we fulfil projects of any scale.",
  },
  {
    icon: Palette,
    title: "Custom Finishes",
    desc: "Special finishes and dimensions available for large orders.",
  },
  {
    icon: Building2,
    title: "Project Support",
    desc: "Dedicated account manager for commercial projects.",
  },
  {
    icon: Users,
    title: "Trade Pricing",
    desc: "Preferential rates for architects, designers and contractors.",
  },
];

export default function BulkOrder() {
  const location = useLocation();
  const preselected = (location.state as { product?: string } | null)?.product ?? "";
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [products, setProducts] = useState<ApiProduct[]>([]);

  useEffect(() => {
    apiGetProducts({ status: "Published" })
      .then((r) => setProducts(r.products))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      customerName: String(fd.get("customerName") ?? ""),
      company: String(fd.get("company") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      city: String(fd.get("city") ?? ""),
      product: String(fd.get("product") ?? ""),
      quantity: String(fd.get("quantity") ?? ""),
      projectType: String(fd.get("projectType") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    setSubmitting(true);
    try {
      await apiSubmitBulkOrder(payload);
      setSubmitted(true);
      showToast("Your bulk inquiry has been received. We'll respond within 24 hours.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Submission failed. Please try again.";
      showToast(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* ── Hero banner ── */}
      <section className="bg-charcoal-950 relative overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 -translate-y-1/3 translate-x-1/4 rounded-full bg-copper-500/8 blur-[80px]" />
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
          <span className="inline-flex items-center rounded-full border border-copper-400/30 bg-copper-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-copper-300">
            B2B &amp; Commercial
          </span>
          <h1 className="mt-5 font-display text-5xl leading-tight text-cream-50 sm:text-6xl">
            Request a
            <br />
            <span className="copper-shimmer-text">Bulk Quote</span>
          </h1>
          <p className="mt-5 max-w-xl text-stone-400">
            Tell us about your project and quantity requirements. Our team will respond with
            competitive pricing and lead times within one business day.
          </p>
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
          {/* Left — benefits */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl text-charcoal-950">Why order bulk with us?</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-500">
              We work with architects, contractors, interior designers and builders across India
              to deliver copper surfaces at scale.
            </p>

            <div className="mt-8 space-y-5">
              {benefits.map((b) => (
                <div key={b.title} className="flex gap-4 rounded-2xl border border-charcoal-950/8 bg-white p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-copper-50 text-copper-600">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal-950">{b.title}</p>
                    <p className="mt-0.5 text-sm text-stone-500">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Image */}
            <div className="mt-8 aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                alt="Copper tile bulk installation"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="flex flex-col items-center rounded-3xl border border-copper-500/20 bg-gradient-to-br from-copper-50 to-white p-16 text-center animate-scale-in">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-copper-100 text-copper-500">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="mt-6 font-display text-3xl text-charcoal-950">Thank you!</h2>
                <p className="mt-3 max-w-sm text-stone-600">
                  Your inquiry has been received. Our team will contact you within one business day
                  with pricing and lead times.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-sm font-medium text-copper-600 hover:text-copper-700"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-3xl border border-charcoal-950/8 bg-white p-8 shadow-sm lg:p-10"
              >
                <div>
                  <h2 className="font-display text-2xl text-charcoal-950">Project Details</h2>
                  <p className="mt-1 text-sm text-stone-500">
                    Fill in your project details and we'll get back to you promptly.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Input id="bulk-name" name="customerName" label="Full Name" placeholder="Jane Doe" required />
                  <Input id="bulk-company" name="company" label="Company Name" placeholder="Studio / Firm name" />
                  <Input id="bulk-phone" name="phone" label="Phone Number" type="tel" placeholder="+91 98765 43210" required />
                  <Input id="bulk-email" name="email" label="Email" type="email" placeholder="you@company.com" required />
                  <Input id="bulk-city" name="city" label="City" placeholder="Mumbai" required />
                  <Select id="bulk-product" name="product" label="Product" defaultValue={preselected}>
                    <option value="">Select a product</option>
                    {products.map((p) => (
                      <option key={p._id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                    <option value="Other">Other / Not sure yet</option>
                  </Select>
                  <Input id="bulk-quantity" name="quantity" label="Quantity Required" placeholder="e.g. 500 tiles / 2000 sq ft" required />
                  <Select id="bulk-project-type" name="projectType" label="Project Type" defaultValue="">
                    <option value="">Select project type</option>
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Hospitality</option>
                    <option>Retail</option>
                    <option>Facade / Exterior</option>
                    <option>Other</option>
                  </Select>
                </div>

                <Textarea id="bulk-message" name="message" label="Message" rows={4} placeholder="Tell us more about your project, timeline, or any special requirements…" />

                {/* File upload — UI only, not sent to backend */}
                <div>
                  <span className="mb-1.5 block text-sm font-medium text-charcoal-900">
                    Upload Requirement{" "}
                    <span className="font-normal text-stone-400">(optional)</span>
                  </span>
                  <label className="group flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-charcoal-950/15 px-6 py-8 text-center transition-colors hover:border-copper-400 hover:bg-copper-50/50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-beige-100 text-stone-400 transition-colors group-hover:bg-copper-100 group-hover:text-copper-600">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    {fileName ? (
                      <span className="text-sm font-medium text-copper-600">{fileName}</span>
                    ) : (
                      <div>
                        <span className="text-sm font-medium text-charcoal-950">
                          Click to upload
                        </span>
                        <span className="block text-xs text-stone-400 mt-1">
                          PDF, DOC, DOCX up to 10MB
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                    />
                  </label>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit Inquiry"}
                </Button>
                <p className="text-center text-xs text-stone-400">
                  We respond to all inquiries within one business day.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
