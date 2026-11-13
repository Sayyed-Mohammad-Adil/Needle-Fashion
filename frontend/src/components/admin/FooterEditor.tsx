'use client';

import { FooterConfig, FooterColumn } from '@/lib/api/site-config-service';
import {
  PlusIcon,
  TrashIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

interface FooterEditorProps {
  footer: FooterConfig;
  onChange: (next: FooterConfig) => void;
  onSave: () => Promise<void>;
  saving: boolean;
}

export default function FooterEditor({
  footer,
  onChange,
  onSave,
  saving,
}: FooterEditorProps) {
  const columns = footer.columns || [];
  const socialLinks = footer.socialLinks || [];
  const bottomLinks = footer.bottomLinks || [];

  const addColumn = () => {
    const next: FooterColumn[] = [
      ...columns,
      {
        id: `col-${Date.now()}`,
        title: 'New Column',
        items: [{ name: 'Link Label', href: '/about' }],
      },
    ];
    onChange({ ...footer, columns: next });
  };

  const updateColumnTitle = (colIdx: number, title: string) => {
    const next = [...columns];
    next[colIdx] = { ...next[colIdx], title };
    onChange({ ...footer, columns: next });
  };

  const removeColumn = (colIdx: number) => {
    onChange({ ...footer, columns: columns.filter((_, i) => i !== colIdx) });
  };

  const addColumnLink = (colIdx: number) => {
    const next = [...columns];
    next[colIdx] = {
      ...next[colIdx],
      items: [...(next[colIdx].items || []), { name: 'New Link', href: '/' }],
    };
    onChange({ ...footer, columns: next });
  };

  const updateColumnLink = (
    colIdx: number,
    linkIdx: number,
    patch: { name?: string; href?: string }
  ) => {
    const next = [...columns];
    const items = [...(next[colIdx].items || [])];
    items[linkIdx] = { ...items[linkIdx], ...patch };
    next[colIdx] = { ...next[colIdx], items };
    onChange({ ...footer, columns: next });
  };

  const removeColumnLink = (colIdx: number, linkIdx: number) => {
    const next = [...columns];
    next[colIdx] = {
      ...next[colIdx],
      items: (next[colIdx].items || []).filter((_, i) => i !== linkIdx),
    };
    onChange({ ...footer, columns: next });
  };

  return (
    <div className="space-y-6">
      {/* Top Save Bar & Brand Bio */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-border bg-muted/30">
          <div>
            <h2 className="font-serif text-lg font-bold text-foreground">
              Footer Brand, Columns &amp; Newsletter
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Manage footer brand statement, social links, navigation columns, newsletter box, and legal links.
            </p>
          </div>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50"
          >
            <CheckIcon className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Footer'}</span>
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Footer Brand Name
            </label>
            <input
              type="text"
              value={footer.brandName || ''}
              onChange={(e) => onChange({ ...footer, brandName: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Copyright Text
            </label>
            <input
              type="text"
              value={footer.copyrightText || ''}
              onChange={(e) => onChange({ ...footer, copyrightText: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Maison Bio / Tagline
            </label>
            <textarea
              rows={2}
              value={footer.brandBio || ''}
              onChange={(e) => onChange({ ...footer, brandBio: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Footer Link Columns */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <h3 className="font-serif text-base font-bold text-foreground">
            Footer Columns ({columns.length})
          </h3>
          <button
            type="button"
            onClick={addColumn}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold uppercase tracking-wider"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add Column</span>
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {columns.map((col, colIdx) => (
            <div key={col.id || colIdx} className="rounded-xl border border-border bg-background p-4 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={col.title}
                  onChange={(e) => updateColumnTitle(colIdx, e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground"
                />
                <button
                  type="button"
                  onClick={() => removeColumn(colIdx)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {(col.items || []).map((lnk, lnkIdx) => (
                  <div key={lnkIdx} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={lnk.name}
                      onChange={(e) => updateColumnLink(colIdx, lnkIdx, { name: e.target.value })}
                      placeholder="Label"
                      className="flex-1 min-w-0 rounded-lg border border-border bg-card px-2 py-1 text-xs text-foreground"
                    />
                    <input
                      type="text"
                      value={lnk.href}
                      onChange={(e) => updateColumnLink(colIdx, lnkIdx, { href: e.target.value })}
                      placeholder="/path"
                      className="flex-1 min-w-0 rounded-lg border border-border bg-card px-2 py-1 text-xs text-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => removeColumnLink(colIdx, lnkIdx)}
                      className="p-1 rounded text-red-500 hover:bg-red-500/10"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addColumnLink(colIdx)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                <PlusIcon className="w-3 h-3" />
                <span>Add Link</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter & Social & Bottom Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
          <h3 className="font-serif text-base font-bold text-foreground">
            Newsletter / Private Salon Box
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Heading
              </label>
              <input
                type="text"
                value={footer.newsletterTitle || ''}
                onChange={(e) => onChange({ ...footer, newsletterTitle: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Button Label
              </label>
              <input
                type="text"
                value={footer.newsletterButtonLabel || ''}
                onChange={(e) => onChange({ ...footer, newsletterButtonLabel: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={footer.newsletterSubtitle || ''}
              onChange={(e) => onChange({ ...footer, newsletterSubtitle: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Input Placeholder
            </label>
            <input
              type="text"
              value={footer.newsletterPlaceholder || ''}
              onChange={(e) => onChange({ ...footer, newsletterPlaceholder: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-foreground">Social Links</h3>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...footer,
                    socialLinks: [...socialLinks, { label: 'Instagram', href: 'https://instagram.com' }],
                  })
                }
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                <PlusIcon className="w-3 h-3" />
                <span>Add Social</span>
              </button>
            </div>
            {socialLinks.map((soc, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={soc.label}
                  onChange={(e) => {
                    const next = [...socialLinks];
                    next[idx] = { ...next[idx], label: e.target.value };
                    onChange({ ...footer, socialLinks: next });
                  }}
                  placeholder="Label"
                  className="w-32 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs"
                />
                <input
                  type="text"
                  value={soc.href}
                  onChange={(e) => {
                    const next = [...socialLinks];
                    next[idx] = { ...next[idx], href: e.target.value };
                    onChange({ ...footer, socialLinks: next });
                  }}
                  placeholder="https://..."
                  className="flex-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs"
                />
                <button
                  type="button"
                  onClick={() =>
                    onChange({ ...footer, socialLinks: socialLinks.filter((_, i) => i !== idx) })
                  }
                  className="p-1.5 rounded text-red-500 hover:bg-red-500/10"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-foreground">Bottom Legal Links</h3>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...footer,
                    bottomLinks: [...bottomLinks, { name: 'Policy', href: '/privacy' }],
                  })
                }
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                <PlusIcon className="w-3 h-3" />
                <span>Add Link</span>
              </button>
            </div>
            {bottomLinks.map((lnk, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={lnk.name}
                  onChange={(e) => {
                    const next = [...bottomLinks];
                    next[idx] = { ...next[idx], name: e.target.value };
                    onChange({ ...footer, bottomLinks: next });
                  }}
                  placeholder="Label"
                  className="w-36 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs"
                />
                <input
                  type="text"
                  value={lnk.href}
                  onChange={(e) => {
                    const next = [...bottomLinks];
                    next[idx] = { ...next[idx], href: e.target.value };
                    onChange({ ...footer, bottomLinks: next });
                  }}
                  placeholder="/privacy"
                  className="flex-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs"
                />
                <button
                  type="button"
                  onClick={() =>
                    onChange({ ...footer, bottomLinks: bottomLinks.filter((_, i) => i !== idx) })
                  }
                  className="p-1.5 rounded text-red-500 hover:bg-red-500/10"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

