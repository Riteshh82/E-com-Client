import { type FormEvent } from "react";
import { companySettings } from "../../data/mockData";
import { Input } from "../../components/ui/index";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../context/ToastContext";
import { Building2, Globe, ShoppingBag, MessageCircle, Upload, Save } from "lucide-react";

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Building2;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-charcoal-950/8 bg-white">
      <div className="flex items-center gap-3 border-b border-charcoal-950/8 bg-beige-100/30 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-copper-50 text-copper-600">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div>
          <h2 className="font-display text-base text-charcoal-950">{title}</h2>
          <p className="text-xs text-stone-400">{description}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export default function Settings() {
  const { showToast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    showToast("Settings saved successfully.");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl text-charcoal-950">Settings</h1>
        <p className="mt-1 text-sm text-stone-500">
          Configure company information displayed across the website.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company Information */}
        <SectionCard
          icon={Building2}
          title="Company Information"
          description="Your brand name, contact details and address"
        >
          <div className="space-y-5">
            {/* Logo */}
            <div>
              <span className="mb-2 block text-sm font-medium text-charcoal-900">Logo</span>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-charcoal-950 font-display text-2xl text-copper-300">
                  {companySettings.logoInitial}
                </div>
                <div>
                  <Button type="button" variant="outline" size="sm" className="flex items-center gap-1.5">
                    <Upload className="h-3.5 w-3.5" />
                    Upload New Logo
                  </Button>
                  <p className="mt-1.5 text-xs text-stone-400">PNG or SVG, 256×256px minimum</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                id="company-name"
                label="Company Name"
                defaultValue={companySettings.name}
              />
              <Input
                id="company-phone"
                label="Phone"
                type="tel"
                defaultValue={companySettings.phone}
              />
              <Input
                id="company-email"
                label="Email"
                type="email"
                defaultValue={companySettings.email}
                className="sm:col-span-2"
              />
              <Input
                id="company-address"
                label="Business Address"
                defaultValue={companySettings.address}
                className="sm:col-span-2"
              />
            </div>
          </div>
        </SectionCard>

        {/* Social Media */}
        <SectionCard
          icon={Globe}
          title="Social Media Links"
          description="Links used in footer and contact pages"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input id="s-instagram" label="Instagram URL" defaultValue={companySettings.instagram} />
            <Input id="s-facebook" label="Facebook URL" defaultValue={companySettings.facebook} />
            <Input id="s-linkedin" label="LinkedIn URL" defaultValue={companySettings.linkedin} />
            <Input id="s-whatsapp" label="WhatsApp Link" defaultValue={companySettings.whatsapp} />
          </div>
        </SectionCard>

        {/* Marketplace */}
        <SectionCard
          icon={ShoppingBag}
          title="Marketplace Stores"
          description="Your Amazon and Flipkart store pages"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              id="s-amazon"
              label="Amazon Store URL"
              defaultValue={companySettings.amazonStoreUrl}
            />
            <Input
              id="s-flipkart"
              label="Flipkart Store URL"
              defaultValue={companySettings.flipkartStoreUrl}
            />
          </div>
        </SectionCard>

        {/* Notifications */}
        <SectionCard
          icon={MessageCircle}
          title="Notification Preferences"
          description="Choose what to be notified about"
        >
          <div className="space-y-4">
            {[
              { label: "New bulk order inquiries", desc: "Get notified when a new B2B inquiry is submitted" },
              { label: "New contact messages", desc: "Get notified for every new contact form submission" },
              { label: "Weekly summary", desc: "Receive a weekly digest of orders and messages" },
            ].map((item, i) => (
              <label key={item.label} className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  defaultChecked={i < 2}
                  className="mt-0.5 h-4 w-4 accent-copper-500"
                />
                <div>
                  <p className="text-sm font-medium text-charcoal-950">{item.label}</p>
                  <p className="text-xs text-stone-400">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </SectionCard>

        {/* Save */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost">Discard Changes</Button>
          <Button type="submit" className="flex items-center gap-1.5">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
