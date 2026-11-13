'use client';

import { useState, useEffect } from 'react';
import { siteConfigService, CommerceSettings } from '@/lib/api/site-config-service';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { formatEuro, formatInr } from '@/lib/currency';
import { toast } from 'react-hot-toast';
import {
  CurrencyEuroIcon,
  CheckIcon,
  SparklesIcon,
  TruckIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/outline';

export default function AdminSettingsPage() {
  const { commerce, setCommerceLocal } = useSiteConfig();
  const [form, setForm] = useState<CommerceSettings>(commerce);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(commerce);
  }, [commerce]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await siteConfigService.updateCommerceSettings(form);
      if (res.commerce) {
        setCommerceLocal(res.commerce);
      }
      toast.success('Pricing & commerce rules updated live');
    } catch {
      toast.error('Failed to save commerce settings');
    } finally {
      setSaving(false);
    }
  };

  const sampleInrPrices = [15000, 24999, 32999, 55000];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-border pb-5">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.24em] uppercase text-primary mb-1">
          <SparklesIcon className="w-3.5 h-3.5" />
          <span>Monaco &amp; Atelier Commerce</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
          Pricing, Currency &amp; Rules
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage the live ₹ → € exchange rate, VAT/Duty rate, white-glove courier fees, and global storefront controls.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Currency Conversion Card */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2.5">
            <CurrencyEuroIcon className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-lg font-bold text-foreground">
              INR (Admin) → EUR (Monaco Storefront) Rate
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                1 Euro (€) equals (₹ INR)
              </label>
              <input
                type="number"
                min={1}
                step="0.5"
                value={form.inrPerEur}
                onChange={(e) =>
                  setForm({ ...form, inrPerEur: Math.max(1, Number(e.target.value)) })
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground"
              />
              <p className="mt-2 text-[11px] text-muted-foreground">
                Admin enters base prices in Rupees (₹). Customers automatically see rounded Euro (€) prices across all pages.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4 space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Live Conversion Preview
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {sampleInrPrices.map((inr) => (
                  <div
                    key={inr}
                    className="flex items-center justify-between rounded-lg bg-card px-3 py-2 border border-border/60"
                  >
                    <span className="text-muted-foreground">{formatInr(inr)}</span>
                    <span className="font-bold text-foreground">
                      {formatEuro(inr, form.inrPerEur)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tax & Shipping Rules */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2.5">
            <ReceiptPercentIcon className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-lg font-bold text-foreground">
              VAT, Duties &amp; White-Glove Delivery
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                VAT / Import Tax (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step="0.5"
                value={form.vatRatePercent}
                onChange={(e) =>
                  setForm({ ...form, vatRatePercent: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                White-Glove Shipping (₹)
              </label>
              <input
                type="number"
                min={0}
                value={form.shippingFeeInr}
                onChange={(e) =>
                  setForm({ ...form, shippingFeeInr: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground"
              />
              <p className="mt-1 text-[11px] text-primary">
                Customer sees: {formatEuro(form.shippingFeeInr, form.inrPerEur)}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                min={0}
                value={form.freeShippingThresholdInr}
                onChange={(e) =>
                  setForm({ ...form, freeShippingThresholdInr: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground"
              />
              <p className="mt-1 text-[11px] text-primary">
                Customer threshold: {formatEuro(form.freeShippingThresholdInr, form.inrPerEur)}
              </p>
            </div>
          </div>
        </div>

        {/* Storefront Controls */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <TruckIcon className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-lg font-bold text-foreground">
              Storefront Controls
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Optional Announcement Banner (leave blank to hide)
            </label>
            <input
              type="text"
              placeholder="e.g. Private Monaco Trunk Show — By Appointment"
              value={form.announcementText}
              onChange={(e) => setForm({ ...form, announcementText: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={form.maintenanceMode}
              onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
              className="h-4 w-4 rounded border-border"
            />
            <span className="text-xs font-medium text-foreground">
              Enable Private Atelier Mode (maintenance notice for non-admin visitors)
            </span>
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50"
          >
            <CheckIcon className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Commerce Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

