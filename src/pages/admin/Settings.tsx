import { type FormEvent, useEffect, useState } from "react";
import { Input } from "../../components/ui/index";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../context/ToastContext";
import { Building2, Globe, ShoppingBag, MessageCircle, Upload, Save, Loader2 } from "lucide-react";
import { apiGetSettings, apiUpdateSettings, type ApiSiteSettings } from "../../api";

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
  const [settings, setSettings] = useState<ApiSiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    apiGetSettings()
      .then(setSettings)
      .catch((err) => showToast(err.message, "error"))
      .finally(() => setIsLoading(false));
  }, [showToast]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!settings) return;
    
    setIsSaving(true);
    const fd = new FormData(e.currentTarget);
    const data: Partial<ApiSiteSettings> = {
      name: fd.get("name") as string,
      phone: fd.get("phone") as string,
      email: fd.get("email") as string,
      address: fd.get("address") as string,
      instagram: fd.get("instagram") as string,
      facebook: fd.get("facebook") as string,
      linkedin: fd.get("linkedin") as string,
      whatsapp: fd.get("whatsapp") as string,
      amazonStoreUrl: fd.get("amazonStoreUrl") as string,
      flipkartStoreUrl: fd.get("flipkartStoreUrl") as string,
      notifyBulkOrders: fd.get("notifyBulkOrders") === "on",
      notifyMessages: fd.get("notifyMessages") === "on",
      notifyWeeklySummary: fd.get("notifyWeeklySummary") === "on",
    };

    try {
      const updated = await apiUpdateSettings(data);
      setSettings(updated);
      showToast("Settings saved successfully.");
    } catch (err: any) {
      showToast(err.message || "Failed to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-copper-500" />
      </div>
    );
  }

  if (!settings) return null;

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
                  {settings.logoInitial}
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
              <Input name="name" label="Company Name" defaultValue={settings.name} />
              <Input name="phone" label="Phone" type="tel" defaultValue={settings.phone} />
              <Input
                name="email"
                label="Email"
                type="email"
                defaultValue={settings.email}
                className="sm:col-span-2"
              />
              <Input
                name="address"
                label="Business Address"
                defaultValue={settings.address}
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
            <Input name="instagram" label="Instagram URL" defaultValue={settings.instagram} />
            <Input name="facebook" label="Facebook URL" defaultValue={settings.facebook} />
            <Input name="linkedin" label="LinkedIn URL" defaultValue={settings.linkedin} />
            <Input name="whatsapp" label="WhatsApp Link" defaultValue={settings.whatsapp} />
          </div>
        </SectionCard>

        {/* Marketplace */}
        <SectionCard
          icon={ShoppingBag}
          title="Marketplace Stores"
          description="Your Amazon and Flipkart store pages"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input name="amazonStoreUrl" label="Amazon Store URL" defaultValue={settings.amazonStoreUrl} />
            <Input name="flipkartStoreUrl" label="Flipkart Store URL" defaultValue={settings.flipkartStoreUrl} />
          </div>
        </SectionCard>

        {/* Notifications */}
        <SectionCard
          icon={MessageCircle}
          title="Notification Preferences"
          description="Choose what to be notified about"
        >
          <div className="space-y-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="notifyBulkOrders"
                defaultChecked={settings.notifyBulkOrders}
                className="mt-0.5 h-4 w-4 accent-copper-500"
              />
              <div>
                <p className="text-sm font-medium text-charcoal-950">New bulk order inquiries</p>
                <p className="text-xs text-stone-400">Get notified when a new B2B inquiry is submitted</p>
              </div>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="notifyMessages"
                defaultChecked={settings.notifyMessages}
                className="mt-0.5 h-4 w-4 accent-copper-500"
              />
              <div>
                <p className="text-sm font-medium text-charcoal-950">New contact messages</p>
                <p className="text-xs text-stone-400">Get notified for every new contact form submission</p>
              </div>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="notifyWeeklySummary"
                defaultChecked={settings.notifyWeeklySummary}
                className="mt-0.5 h-4 w-4 accent-copper-500"
              />
              <div>
                <p className="text-sm font-medium text-charcoal-950">Weekly summary</p>
                <p className="text-xs text-stone-400">Receive a weekly digest of orders and messages</p>
              </div>
            </label>
          </div>
        </SectionCard>

        {/* Save */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => window.location.reload()}>Discard Changes</Button>
          <Button type="submit" disabled={isSaving} className="flex items-center gap-1.5">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
