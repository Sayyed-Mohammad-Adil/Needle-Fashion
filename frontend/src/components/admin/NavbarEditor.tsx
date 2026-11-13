'use client';

import { useState } from 'react';
import {
  NavigationConfig,
  NavCategory,
  NavSectionGroup,
  NavFeaturedItem,
  NavPageLink,
} from '@/lib/api/site-config-service';
import {
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  EyeSlashIcon,
  PhotoIcon,
  CheckIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

interface NavbarEditorProps {
  navigation: NavigationConfig;
  onChange: (next: NavigationConfig) => void;
  onSave: () => Promise<void>;
  saving: boolean;
  onPickFeaturedImage: (catIdx: number, featIdx: number) => void;
}

export default function NavbarEditor({
  navigation,
  onChange,
  onSave,
  saving,
  onPickFeaturedImage,
}: NavbarEditorProps) {
  const [expandedCat, setExpandedCat] = useState<number | null>(0);

  const categories = navigation.categories || [];
  const pages = navigation.pages || [];

  const updateCategory = (idx: number, patch: Partial<NavCategory>) => {
    const next = [...categories];
    next[idx] = { ...next[idx], ...patch };
    onChange({ ...navigation, categories: next });
  };

  const addCategory = () => {
    const nextIdx = categories.length + 1;
    const newCat: NavCategory = {
      id: `nav-cat-${Date.now()}`,
      name: `New Menu ${nextIdx}`,
      href: '/products',
      enabled: true,
      sortOrder: nextIdx,
      sections: [
        {
          id: `sec-${Date.now()}`,
          name: 'Highlights',
          items: [{ name: 'View All', href: '/products' }],
        },
      ],
      featured: [],
    };
    onChange({ ...navigation, categories: [...categories, newCat] });
    setExpandedCat(categories.length);
  };

  const removeCategory = (idx: number) => {
    const next = categories.filter((_, i) => i !== idx);
    onChange({ ...navigation, categories: next });
    if (expandedCat === idx) setExpandedCat(null);
  };

  const moveCategory = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= categories.length) return;
    const next = [...categories];
    const [moved] = next.splice(idx, 1);
    next.splice(target, 0, moved);
    onChange({
      ...navigation,
      categories: next.map((c, i) => ({ ...c, sortOrder: i + 1 })),
    });
    setExpandedCat(target);
  };

  const addSectionGroup = (catIdx: number) => {
    const cat = categories[catIdx];
    const nextSections: NavSectionGroup[] = [
      ...(cat.sections || []),
      {
        id: `grp-${Date.now()}`,
        name: 'New Group',
        items: [{ name: 'Link Label', href: '/products' }],
      },
    ];
    updateCategory(catIdx, { sections: nextSections });
  };

  const updateSectionGroup = (catIdx: number, grpIdx: number, name: string) => {
    const cat = categories[catIdx];
    const nextSections = [...(cat.sections || [])];
    nextSections[grpIdx] = { ...nextSections[grpIdx], name };
    updateCategory(catIdx, { sections: nextSections });
  };

  const removeSectionGroup = (catIdx: number, grpIdx: number) => {
    const cat = categories[catIdx];
    const nextSections = (cat.sections || []).filter((_, i) => i !== grpIdx);
    updateCategory(catIdx, { sections: nextSections });
  };

  const addSectionLink = (catIdx: number, grpIdx: number) => {
    const cat = categories[catIdx];
    const nextSections = [...(cat.sections || [])];
    const grp = nextSections[grpIdx];
    nextSections[grpIdx] = {
      ...grp,
      items: [...(grp.items || []), { name: 'New Link', href: '/products' }],
    };
    updateCategory(catIdx, { sections: nextSections });
  };

  const updateSectionLink = (
    catIdx: number,
    grpIdx: number,
    linkIdx: number,
    patch: { name?: string; href?: string }
  ) => {
    const cat = categories[catIdx];
    const nextSections = [...(cat.sections || [])];
    const grp = nextSections[grpIdx];
    const nextItems = [...(grp.items || [])];
    nextItems[linkIdx] = { ...nextItems[linkIdx], ...patch };
    nextSections[grpIdx] = { ...grp, items: nextItems };
    updateCategory(catIdx, { sections: nextSections });
  };

  const removeSectionLink = (catIdx: number, grpIdx: number, linkIdx: number) => {
    const cat = categories[catIdx];
    const nextSections = [...(cat.sections || [])];
    const grp = nextSections[grpIdx];
    nextSections[grpIdx] = {
      ...grp,
      items: (grp.items || []).filter((_, i) => i !== linkIdx),
    };
    updateCategory(catIdx, { sections: nextSections });
  };

  const addFeaturedCard = (catIdx: number) => {
    const cat = categories[catIdx];
    const nextFeatured: NavFeaturedItem[] = [
      ...(cat.featured || []),
      {
        name: 'Featured Piece',
        href: cat.href || '/products',
        imageSrc: '/images/original-ivory-blazer.jpg',
        imageAlt: 'Featured editorial piece',
        desc: 'Short editorial caption',
      },
    ];
    updateCategory(catIdx, { featured: nextFeatured });
  };

  const updateFeaturedCard = (
    catIdx: number,
    featIdx: number,
    patch: Partial<NavFeaturedItem>
  ) => {
    const cat = categories[catIdx];
    const nextFeatured = [...(cat.featured || [])];
    nextFeatured[featIdx] = { ...nextFeatured[featIdx], ...patch };
    updateCategory(catIdx, { featured: nextFeatured });
  };

  const removeFeaturedCard = (catIdx: number, featIdx: number) => {
    const cat = categories[catIdx];
    const nextFeatured = (cat.featured || []).filter((_, i) => i !== featIdx);
    updateCategory(catIdx, { featured: nextFeatured });
  };

  const addPageLink = () => {
    const nextPages: NavPageLink[] = [
      ...pages,
      {
        id: `page-${Date.now()}`,
        name: 'New Link',
        href: '/products',
        enabled: true,
        sortOrder: pages.length + 1,
      },
    ];
    onChange({ ...navigation, pages: nextPages });
  };

  const updatePageLink = (idx: number, patch: Partial<NavPageLink>) => {
    const next = [...pages];
    next[idx] = { ...next[idx], ...patch };
    onChange({ ...navigation, pages: next });
  };

  const removePageLink = (idx: number) => {
    onChange({ ...navigation, pages: pages.filter((_, i) => i !== idx) });
  };

  const movePageLink = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= pages.length) return;
    const next = [...pages];
    const [moved] = next.splice(idx, 1);
    next.splice(target, 0, moved);
    onChange({
      ...navigation,
      pages: next.map((p, i) => ({ ...p, sortOrder: i + 1 })),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Save Bar & Brand Settings */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-border bg-muted/30">
          <div>
            <h2 className="font-serif text-lg font-bold text-foreground">
              Brand Wordmark &amp; Navbar Architecture
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Control the brand title, top-level menus after the brand name, and all nested dropdown links &amp; featured visuals.
            </p>
          </div>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <CheckIcon className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Navbar'}</span>
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Brand Name (Wordmark)
            </label>
            <input
              type="text"
              value={navigation.brandName || ''}
              onChange={(e) => onChange({ ...navigation, brandName: e.target.value })}
              placeholder="Needle Fashion"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Brand Click Link (Href)
            </label>
            <input
              type="text"
              value={navigation.brandHref || '/'}
              onChange={(e) => onChange({ ...navigation, brandHref: e.target.value })}
              placeholder="/"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Categories / Dropdown Menus */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-border bg-muted/30">
          <div>
            <h3 className="font-serif text-base font-bold text-foreground">
              Navbar Menus After Brand Name ({categories.length})
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Each menu can have nested link groups and featured editorial cards, or act as a direct link if nested items are empty.
            </p>
          </div>
          <button
            type="button"
            onClick={addCategory}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold uppercase tracking-wider"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add Menu</span>
          </button>
        </div>

        <div className="divide-y divide-border">
          {categories.map((cat, catIdx) => {
            const isOpen = expandedCat === catIdx;
            const isEnabled = cat.enabled !== false;

            return (
              <div key={cat.id || catIdx} className="p-5 space-y-4">
                {/* Category Row Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => updateCategory(catIdx, { enabled: !isEnabled })}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        isEnabled
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
                          : 'border-amber-500/30 bg-amber-500/10 text-amber-600'
                      }`}
                    >
                      {isEnabled ? <EyeIcon className="w-3.5 h-3.5" /> : <EyeSlashIcon className="w-3.5 h-3.5" />}
                      <span>{isEnabled ? 'Visible' : 'Hidden'}</span>
                    </button>
                    <span className="font-serif text-base font-bold text-foreground">
                      {cat.name || 'Untitled Menu'}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      ({cat.sections?.length || 0} groups · {cat.featured?.length || 0} featured)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => moveCategory(catIdx, -1)}
                      disabled={catIdx === 0}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-30"
                      title="Move Left"
                    >
                      <ArrowUpIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCategory(catIdx, 1)}
                      disabled={catIdx === categories.length - 1}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-30"
                      title="Move Right"
                    >
                      <ArrowDownIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedCat(isOpen ? null : catIdx)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium"
                    >
                      <span>{isOpen ? 'Collapse' : 'Edit Nested'}</span>
                      {isOpen ? (
                        <ChevronUpIcon className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDownIcon className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeCategory(catIdx)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10"
                      title="Remove Menu"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Top-level Category Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Menu Label
                    </label>
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => updateCategory(catIdx, { name: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Fallback Direct Link (if no nested items)
                    </label>
                    <input
                      type="text"
                      value={cat.href || ''}
                      onChange={(e) => updateCategory(catIdx, { href: e.target.value })}
                      placeholder="/category/suits"
                      className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                    />
                  </div>
                </div>

                {/* Nested Dropdown Editor */}
                {isOpen && (
                  <div className="pt-3 border-t border-border/60 space-y-6">
                    {/* Nested Link Sections */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Nested Link Columns ({cat.sections?.length || 0})
                        </span>
                        <button
                          type="button"
                          onClick={() => addSectionGroup(catIdx)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-[11px] font-semibold"
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                          <span>Add Link Column</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {(cat.sections || []).map((grp, grpIdx) => (
                          <div
                            key={grp.id || grpIdx}
                            className="rounded-xl border border-border bg-background p-4 space-y-3"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={grp.name}
                                onChange={(e) => updateSectionGroup(catIdx, grpIdx, e.target.value)}
                                placeholder="Column Heading (e.g. Tailoring)"
                                className="flex-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground"
                              />
                              <button
                                type="button"
                                onClick={() => removeSectionGroup(catIdx, grpIdx)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10"
                                title="Remove Column"
                              >
                                <TrashIcon className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="space-y-2">
                              {(grp.items || []).map((lnk, lnkIdx) => (
                                <div key={lnkIdx} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={lnk.name}
                                    onChange={(e) =>
                                      updateSectionLink(catIdx, grpIdx, lnkIdx, { name: e.target.value })
                                    }
                                    placeholder="Link label"
                                    className="flex-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-foreground"
                                  />
                                  <input
                                    type="text"
                                    value={lnk.href}
                                    onChange={(e) =>
                                      updateSectionLink(catIdx, grpIdx, lnkIdx, { href: e.target.value })
                                    }
                                    placeholder="/category/..."
                                    className="flex-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-foreground"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeSectionLink(catIdx, grpIdx, lnkIdx)}
                                    className="p-1 rounded text-red-500 hover:bg-red-500/10"
                                  >
                                    <TrashIcon className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() => addSectionLink(catIdx, grpIdx)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                            >
                              <PlusIcon className="w-3 h-3" />
                              <span>Add Nested Link</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Nested Featured Editorial Cards */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Nested Featured Cards ({cat.featured?.length || 0})
                        </span>
                        <button
                          type="button"
                          onClick={() => addFeaturedCard(catIdx)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-[11px] font-semibold"
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                          <span>Add Featured Card</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(cat.featured || []).map((feat, featIdx) => (
                          <div
                            key={featIdx}
                            className="rounded-xl border border-border bg-background p-4 space-y-3"
                          >
                            <div className="flex items-start gap-3">
                              <div className="relative w-24 aspect-[4/3] rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                                {feat.imageSrc ? (
                                  <img
                                    src={feat.imageSrc}
                                    alt={feat.imageAlt || feat.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    <PhotoIcon className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <button
                                    type="button"
                                    onClick={() => onPickFeaturedImage(catIdx, featIdx)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider"
                                  >
                                    <PhotoIcon className="w-3 h-3" />
                                    <span>Choose / Upload</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeFeaturedCard(catIdx, featIdx)}
                                    className="p-1 rounded text-red-500 hover:bg-red-500/10"
                                  >
                                    <TrashIcon className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={feat.imageSrc}
                                  onChange={(e) =>
                                    updateFeaturedCard(catIdx, featIdx, { imageSrc: e.target.value })
                                  }
                                  placeholder="Image URL"
                                  className="w-full rounded-lg border border-border bg-card px-2 py-1 text-[11px] text-foreground"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={feat.name}
                                onChange={(e) =>
                                  updateFeaturedCard(catIdx, featIdx, { name: e.target.value })
                                }
                                placeholder="Card Title"
                                className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground"
                              />
                              <input
                                type="text"
                                value={feat.href}
                                onChange={(e) =>
                                  updateFeaturedCard(catIdx, featIdx, { href: e.target.value })
                                }
                                placeholder="Link (/category/...)"
                                className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground"
                              />
                            </div>
                            <input
                              type="text"
                              value={feat.desc || ''}
                              onChange={(e) =>
                                updateFeaturedCard(catIdx, featIdx, { desc: e.target.value })
                              }
                              placeholder="Short description"
                              className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct Pages Links */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-border bg-muted/30">
          <div>
            <h3 className="font-serif text-base font-bold text-foreground">
              Direct Navbar Links ({pages.length})
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Single-click links shown after the category menus (e.g. New Arrivals, Atelier).
            </p>
          </div>
          <button
            type="button"
            onClick={addPageLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold uppercase tracking-wider"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add Direct Link</span>
          </button>
        </div>

        <div className="p-6 space-y-3">
          {pages.map((page, idx) => {
            const isEnabled = page.enabled !== false;
            return (
              <div
                key={page.id || idx}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background p-3"
              >
                <button
                  type="button"
                  onClick={() => updatePageLink(idx, { enabled: !isEnabled })}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    isEnabled
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
                      : 'border-amber-500/30 bg-amber-500/10 text-amber-600'
                  }`}
                >
                  {isEnabled ? <EyeIcon className="w-3 h-3" /> : <EyeSlashIcon className="w-3 h-3" />}
                  <span>{isEnabled ? 'On' : 'Off'}</span>
                </button>
                <input
                  type="text"
                  value={page.name}
                  onChange={(e) => updatePageLink(idx, { name: e.target.value })}
                  placeholder="Link Label"
                  className="flex-1 min-w-[140px] rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground"
                />
                <input
                  type="text"
                  value={page.href}
                  onChange={(e) => updatePageLink(idx, { href: e.target.value })}
                  placeholder="/about"
                  className="flex-1 min-w-[140px] rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground"
                />
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => movePageLink(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-30"
                  >
                    <ArrowUpIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => movePageLink(idx, 1)}
                    disabled={idx === pages.length - 1}
                    className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-30"
                  >
                    <ArrowDownIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removePageLink(idx)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

