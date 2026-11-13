'use client';

import { useState, useEffect, useRef } from 'react';
import {
  siteConfigService,
  PageSectionConfig,
  SectionMediaItem,
  NavigationConfig,
  FooterConfig,
  AspectRatioOption,
  ObjectFitOption,
  FocalPointOption,
} from '@/lib/api/site-config-service';
import { uploadService, UploadedFile } from '@/lib/api/upload-service';
import {
  useSiteConfig,
  DEFAULT_NAVIGATION,
  DEFAULT_FOOTER,
  getAspectRatioClass,
  getObjectFitClass,
  getFocalPointClass,
} from '@/contexts/SiteConfigContext';
import NavbarEditor from '@/components/admin/NavbarEditor';
import FooterEditor from '@/components/admin/FooterEditor';
import { formatEuro } from '@/lib/currency';
import { toast } from 'react-hot-toast';
import {
  PhotoIcon,
  CloudArrowUpIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const PAGE_TABS = [
  { key: 'navbar', label: 'Navbar & Menus' },
  { key: 'footer', label: 'Footer & Links' },
  { key: 'home', label: 'Home Page' },
  { key: 'about', label: 'About / Maison' },
  { key: 'new-arrivals', label: 'New Arrivals' },
  { key: 'categories', label: 'Category Banners' },
];

const ASPECT_RATIOS: { value: AspectRatioOption; label: string }[] = [
  { value: '3:4', label: '3:4 Portrait (Editorial)' },
  { value: '4:5', label: '4:5 Tall Portrait' },
  { value: '1:1', label: '1:1 Square' },
  { value: '16:10', label: '16:10 Classic Wide' },
  { value: '16:9', label: '16:9 Widescreen' },
  { value: '21:9', label: '21:9 Cinematic Banner' },
  { value: 'auto', label: 'Auto (Natural)' },
];

export default function AdminPagesStudio() {
  const { sections: ctxSections, navigation: ctxNavigation, footer: ctxFooter, refreshSiteConfig, commerce } = useSiteConfig();
  const [sections, setSections] = useState<PageSectionConfig[]>([]);
  const [navState, setNavState] = useState<NavigationConfig>(DEFAULT_NAVIGATION);
  const [footerState, setFooterState] = useState<FooterConfig>(DEFAULT_FOOTER);
  const [activePage, setActivePage] = useState<string>('navbar');
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savingNav, setSavingNav] = useState(false);
  const [savingFooter, setSavingFooter] = useState(false);

  // Media Picker Modal State
  const [pickerTarget, setPickerTarget] = useState<{
    sectionKey: string;
    slotIndex: number;
  } | null>(null);
  const [navPickerTarget, setNavPickerTarget] = useState<{
    catIdx: number;
    featIdx: number;
  } | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<UploadedFile[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [uploadingInModal, setUploadingInModal] = useState(false);
  const modalFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  useEffect(() => {
    if (ctxSections.length > 0 && sections.length === 0) {
      setSections(ctxSections);
    }
  }, [ctxSections, sections.length]);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const data = await siteConfigService.getSiteConfig();
      setSections(data.sections || []);
      if (data.navigation) {
        setNavState(data.navigation);
      }
      if (data.footer) {
        setFooterState(data.footer);
      } else if (ctxNavigation) {
        setNavState(ctxNavigation);
      }
      if (data.footer) {
        setFooterState(data.footer);
      } else if (ctxFooter) {
        setFooterState(ctxFooter);
      }
    } catch {
      toast.error('Failed to load page sections');
    } finally {
      setLoading(false);
    }
  };

  const openMediaPicker = async (sectionKey: string, slotIndex: number) => {
    setNavPickerTarget(null);
    setPickerTarget({ sectionKey, slotIndex });
    try {
      setLoadingGallery(true);
      const res = await uploadService.getMediaGallery();
      setGalleryFiles(res.files || []);
    } catch {
      toast.error('Could not load media gallery');
    } finally {
      setLoadingGallery(false);
    }
  };

  const openNavMediaPicker = async (catIdx: number, featIdx: number) => {
    setPickerTarget(null);
    setNavPickerTarget({ catIdx, featIdx });
    try {
      setLoadingGallery(true);
      const res = await uploadService.getMediaGallery();
      setGalleryFiles(res.files || []);
    } catch {
      toast.error('Could not load media gallery');
    } finally {
      setLoadingGallery(false);
    }
  };

  const applyNavImage = (catIdx: number, featIdx: number, url: string) => {
    setNavState((prev) => {
      const nextCats = [...(prev.categories || [])];
      const targetCat = nextCats[catIdx];
      if (!targetCat) return prev;
      const nextFeatured = [...(targetCat.featured || [])];
      if (!nextFeatured[featIdx]) return prev;
      nextFeatured[featIdx] = { ...nextFeatured[featIdx], imageSrc: url };
      nextCats[catIdx] = { ...targetCat, featured: nextFeatured };
      return { ...prev, categories: nextCats };
    });
  };

  const saveNavigation = async () => {
    try {
      setSavingNav(true);
      await siteConfigService.updateNavigation(navState);
      await refreshSiteConfig();
      toast.success('Navbar & nested menus saved');
    } catch {
      toast.error('Failed to save navbar');
    } finally {
      setSavingNav(false);
    }
  };

  const saveFooter = async () => {
    try {
      setSavingFooter(true);
      await siteConfigService.updateFooter(footerState);
      await refreshSiteConfig();
      toast.success('Footer configuration saved');
    } catch {
      toast.error('Failed to save footer');
    } finally {
      setSavingFooter(false);
    }
  };

  const handleModalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingInModal(true);
      const res = await uploadService.uploadImage(file);
      toast.success('Photo uploaded');
      if (pickerTarget) {
        updateMediaSlot(pickerTarget.sectionKey, pickerTarget.slotIndex, { url: res.url });
        setPickerTarget(null);
      } else if (navPickerTarget) {
        applyNavImage(navPickerTarget.catIdx, navPickerTarget.featIdx, res.url);
        setNavPickerTarget(null);
      }
      const gallery = await uploadService.getMediaGallery();
      setGalleryFiles(gallery.files || []);
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploadingInModal(false);
      if (modalFileRef.current) modalFileRef.current.value = '';
    }
  };

  const updateSectionField = (
    sectionKey: string,
    patch: Partial<PageSectionConfig>
  ) => {
    setSections((prev) =>
      prev.map((sec) =>
        sec.pageKey === activePage && sec.sectionKey === sectionKey
          ? { ...sec, ...patch }
          : sec
      )
    );
  };

  const updateMediaSlot = (
    sectionKey: string,
    slotIndex: number,
    patch: Partial<SectionMediaItem>
  ) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.pageKey !== activePage || sec.sectionKey !== sectionKey) return sec;
        const nextMedia = [...sec.media];
        nextMedia[slotIndex] = { ...nextMedia[slotIndex], ...patch };
        return { ...sec, media: nextMedia };
      })
    );
  };

  const addMediaSlot = (sectionKey: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.pageKey !== activePage || sec.sectionKey !== sectionKey) return sec;
        const nextIndex = sec.media.length + 1;
        return {
          ...sec,
          media: [
            ...sec.media,
            {
              slotKey: `slot-${nextIndex}`,
              url: '/images/original-ivory-blazer.jpg',
              alt: `Section visual ${nextIndex}`,
              title: `New Visual ${nextIndex}`,
            },
          ],
        };
      })
    );
  };

  const removeMediaSlot = (sectionKey: string, slotIndex: number) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.pageKey !== activePage || sec.sectionKey !== sectionKey) return sec;
        return {
          ...sec,
          media: sec.media.filter((_, idx) => idx !== slotIndex),
        };
      })
    );
  };

  const saveSection = async (section: PageSectionConfig) => {
    try {
      setSavingKey(section.sectionKey);
      await siteConfigService.updatePageSection(
        section.pageKey,
        section.sectionKey,
        section
      );
      await refreshSiteConfig();
      toast.success(`Saved "${section.label}"`);
    } catch {
      toast.error('Failed to save section');
    } finally {
      setSavingKey(null);
    }
  };

  const handleResetDefaults = async () => {
    if (!confirm('Reset all page sections, navbar & commerce settings to factory defaults?')) return;
    try {
      setLoading(true);
      const data = await siteConfigService.resetSiteConfig();
      setSections(data.sections || []);
      if (data.navigation) {
        setNavState(data.navigation);
      }
      if (data.footer) {
        setFooterState(data.footer);
      }
      await refreshSiteConfig();
      toast.success('Restored factory defaults');
    } catch {
      toast.error('Failed to reset defaults');
    } finally {
      setLoading(false);
    }
  };

  const pageSections = sections
    .filter((s) => s.pageKey === activePage)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.24em] uppercase text-primary mb-1">
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>Visual Storefront CMS</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Page &amp; Image Studio
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Control which photo, aspect ratio, focal framing, heading, and visibility appears on every storefront page &amp; section.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          <ArrowPathIcon className="w-4 h-4" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Page Tabs */}
      <div className="flex flex-wrap gap-2">
        {PAGE_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActivePage(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activePage === tab.key
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sections List / Navbar Editor */}
      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Loading storefront layout...
        </div>
      ) : activePage === 'navbar' ? (
        <NavbarEditor
          navigation={navState}
          onChange={setNavState}
          onSave={saveNavigation}
          saving={savingNav}
          onPickFeaturedImage={openNavMediaPicker}
        />
      ) : activePage === 'footer' ? (
        <FooterEditor
          footer={footerState}
          onChange={setFooterState}
          onSave={saveFooter}
          saving={savingFooter}
        />
      ) : pageSections.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground border border-border rounded-2xl bg-card">
          No sections configured for this page yet.
        </div>
      ) : (
        <div className="space-y-8">
          {pageSections.map((section) => (
            <div
              key={`${section.pageKey}-${section.sectionKey}`}
              className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-6 shadow-sm"
            >
              {/* Section Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="font-serif text-lg font-bold text-foreground">
                      {section.label}
                    </h2>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        section.enabled
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}
                    >
                      {section.enabled ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                    {section.pageKey} / {section.sectionKey}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      updateSectionField(section.sectionKey, {
                        enabled: !section.enabled,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors"
                  >
                    {section.enabled ? (
                      <>
                        <EyeSlashIcon className="w-4 h-4" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <EyeIcon className="w-4 h-4" />
                        <span>Show</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => saveSection(section)}
                    disabled={savingKey === section.sectionKey}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    <CheckIcon className="w-4 h-4" />
                    <span>
                      {savingKey === section.sectionKey ? 'Saving...' : 'Save Section'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Frame & Copy Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Section Aspect Ratio
                  </label>
                  <select
                    value={section.aspectRatio}
                    onChange={(e) =>
                      updateSectionField(section.sectionKey, {
                        aspectRatio: e.target.value as AspectRatioOption,
                      })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground"
                  >
                    {ASPECT_RATIOS.map((ar) => (
                      <option key={ar.value} value={ar.value}>
                        {ar.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Image Fit
                  </label>
                  <select
                    value={section.objectFit}
                    onChange={(e) =>
                      updateSectionField(section.sectionKey, {
                        objectFit: e.target.value as ObjectFitOption,
                      })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground"
                  >
                    <option value="cover">Cover (Fill Frame)</option>
                    <option value="contain">Contain (No Crop)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Focal Point
                  </label>
                  <select
                    value={section.focalPoint}
                    onChange={(e) =>
                      updateSectionField(section.sectionKey, {
                        focalPoint: e.target.value as FocalPointOption,
                      })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground"
                  >
                    <option value="center">Center</option>
                    <option value="top">Top (Portrait Headroom)</option>
                    <option value="bottom">Bottom</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Eyebrow Label
                  </label>
                  <input
                    type="text"
                    value={section.eyebrow || ''}
                    onChange={(e) =>
                      updateSectionField(section.sectionKey, { eyebrow: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Heading
                  </label>
                  <input
                    type="text"
                    value={section.title || ''}
                    onChange={(e) =>
                      updateSectionField(section.sectionKey, { title: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    CTA Button &amp; Link
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Label"
                      value={section.ctaLabel || ''}
                      onChange={(e) =>
                        updateSectionField(section.sectionKey, { ctaLabel: e.target.value })
                      }
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground"
                    />
                    <input
                      type="text"
                      placeholder="/route"
                      value={section.ctaHref || ''}
                      onChange={(e) =>
                        updateSectionField(section.sectionKey, { ctaHref: e.target.value })
                      }
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Subtitle / Editorial Copy
                </label>
                <textarea
                  rows={2}
                  value={section.subtitle || ''}
                  onChange={(e) =>
                    updateSectionField(section.sectionKey, { subtitle: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground"
                />
              </div>

              {/* Media Slots */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Assigned Photos ({section.media.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => addMediaSlot(section.sectionKey)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    <span>Add Slot</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {section.media.map((slot, idx) => {
                    const effectiveRatio = slot.aspectRatio || section.aspectRatio;
                    const effectiveFit = slot.objectFit || section.objectFit;
                    const effectiveFocal = slot.focalPoint || section.focalPoint;

                    return (
                      <div
                        key={`${slot.slotKey}-${idx}`}
                        className="rounded-xl border border-border bg-background p-3.5 space-y-3"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-semibold text-muted-foreground">
                            {slot.slotKey} ({effectiveRatio})
                          </span>
                          <button
                            type="button"
                            onClick={() => removeMediaSlot(section.sectionKey, idx)}
                            className="text-muted-foreground hover:text-red-500"
                            title="Remove slot"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Live Aspect Ratio Preview */}
                        <div
                          className={`relative w-full overflow-hidden rounded-lg bg-muted border border-border/60 ${getAspectRatioClass(
                            effectiveRatio
                          )}`}
                        >
                          <img
                            src={slot.url}
                            alt={slot.alt || slot.title || 'Preview'}
                            className={`w-full h-full ${getObjectFitClass(
                              effectiveFit
                            )} ${getFocalPointClass(effectiveFocal)}`}
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openMediaPicker(section.sectionKey, idx)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-primary/40 bg-primary/5 px-3 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/10 transition-colors"
                          >
                            <PhotoIcon className="w-3.5 h-3.5" />
                            <span>Pick / Upload Photo</span>
                          </button>
                        </div>

                        <input
                          type="text"
                          placeholder="Image URL (/images/... or /uploads/...)"
                          value={slot.url}
                          onChange={(e) =>
                            updateMediaSlot(section.sectionKey, idx, { url: e.target.value })
                          }
                          className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-mono text-foreground"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Title"
                            value={slot.title || ''}
                            onChange={(e) =>
                              updateMediaSlot(section.sectionKey, idx, { title: e.target.value })
                            }
                            className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground"
                          />
                          <input
                            type="text"
                            placeholder="Link (/product/1)"
                            value={slot.href || ''}
                            onChange={(e) =>
                              updateMediaSlot(section.sectionKey, idx, { href: e.target.value })
                            }
                            className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground"
                          />
                        </div>

                        {slot.priceInr !== undefined && (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="Price ₹"
                              value={slot.priceInr}
                              onChange={(e) =>
                                updateMediaSlot(section.sectionKey, idx, {
                                  priceInr: Number(e.target.value),
                                })
                              }
                              className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground"
                            />
                            <span className="whitespace-nowrap text-[11px] font-semibold text-primary">
                              {formatEuro(slot.priceInr, commerce.inrPerEur)}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media Picker Modal */}
      {(pickerTarget || navPickerTarget) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Select or Upload Photo
                </h3>
                <p className="text-xs text-muted-foreground">
                  Choose from your uploaded Media Gallery or upload a new image.
                </p>
              </div>
              <button
                onClick={() => {
                  setPickerTarget(null);
                  setNavPickerTarget(null);
                }}
                className="p-1.5 rounded-lg hover:bg-muted"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <input
                ref={modalFileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleModalUpload}
                className="hidden"
                id="studio-modal-upload"
              />
              <label
                htmlFor="studio-modal-upload"
                className="inline-flex items-center gap-2 cursor-pointer rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-bold uppercase tracking-wider"
              >
                <CloudArrowUpIcon className="w-4 h-4" />
                <span>{uploadingInModal ? 'Uploading...' : 'Upload New Photo'}</span>
              </label>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
              {loadingGallery ? (
                <div className="col-span-full py-12 text-center text-xs text-muted-foreground">
                  Loading gallery...
                </div>
              ) : galleryFiles.length === 0 ? (
                <div className="col-span-full py-12 text-center text-xs text-muted-foreground">
                  No uploaded photos yet. Upload one above!
                </div>
              ) : (
                galleryFiles.map((file) => (
                  <button
                    key={file.filename}
                    type="button"
                    onClick={() => {
                      if (pickerTarget) {
                        updateMediaSlot(pickerTarget.sectionKey, pickerTarget.slotIndex, {
                          url: file.url,
                        });
                        setPickerTarget(null);
                      } else if (navPickerTarget) {
                        applyNavImage(navPickerTarget.catIdx, navPickerTarget.featIdx, file.url);
                        setNavPickerTarget(null);
                      }
                    }}
                    className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-border hover:border-primary transition-all bg-muted"
                  >
                    <img
                      src={file.url}
                      alt={file.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 text-[10px] text-white truncate">
                      {file.filename}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

