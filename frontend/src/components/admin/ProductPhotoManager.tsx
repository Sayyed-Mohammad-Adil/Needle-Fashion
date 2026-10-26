'use client';

import { useState, useRef } from 'react';
import { uploadService } from '@/lib/api/upload-service';
import { toast } from 'react-hot-toast';
import {
  PhotoIcon,
  CloudArrowUpIcon,
  TrashIcon,
  StarIcon,
  PlusIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

export interface FormattedImage {
  data: string; // URL or base64
  alt?: string;
}

interface ProductPhotoManagerProps {
  images: FormattedImage[];
  onChange: (images: FormattedImage[]) => void;
}

export default function ProductPhotoManager({
  images,
  onChange,
}: ProductPhotoManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlModal, setShowUrlModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const fileList = Array.from(files);
      const response = await uploadService.uploadMultipleImages(fileList);
      
      const newImages: FormattedImage[] = response.files.map((file) => ({
        data: file.url,
        alt: file.originalName || '',
      }));

      onChange([...images, ...newImages]);
      toast.success(`${newImages.length} photo(s) uploaded successfully!`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Photo upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const newImage: FormattedImage = {
      data: urlInput.trim(),
      alt: '',
    };
    onChange([...images, newImage]);
    setUrlInput('');
    setShowUrlModal(false);
    toast.success('Photo URL added to collection');
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
    toast.success('Photo removed');
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const filtered = images.filter((_, i) => i !== index);
    onChange([target, ...filtered]);
    toast.success('Set as primary cover photo');
  };

  const handleAltChange = (index: number, alt: string) => {
    const updated = [...images];
    updated[index] = { ...updated[index], alt };
    onChange(updated);
  };

  // Helper to resolve display src
  const getImageSrc = (data: string) => {
    if (!data) return '/images/hero-ethnic.jpg';
    if (data.startsWith('data:') || data.startsWith('http://') || data.startsWith('https://') || data.startsWith('/')) {
      return data;
    }
    // assume base64 jpeg if raw
    return `data:image/jpeg;base64,${data}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="font-serif text-base font-bold text-foreground">
            Product Photos &amp; Lookbook Gallery
          </h4>
          <p className="text-xs text-muted-foreground">
            The first photo serves as the primary catalogue cover. Upload high-res imagery of the garment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={handleFileUpload}
            className="hidden"
            id="product-photo-upload"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="btn-luxury-gold px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5"
          >
            <CloudArrowUpIcon className="w-4 h-4" />
            <span>{isUploading ? 'Uploading...' : 'Upload Photos'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowUrlModal(true)}
            className="px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary transition-colors flex items-center gap-1.5"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add by URL</span>
          </button>
        </div>
      </div>

      {/* URL Input Modal */}
      {showUrlModal && (
        <div className="p-4 rounded-2xl bg-muted/40 border border-primary/30 flex items-center gap-3">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste direct image URL (e.g. /images/hero-ethnic.jpg or https://...)"
            className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="btn-luxury-gold px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Add Image
          </button>
          <button
            type="button"
            onClick={() => setShowUrlModal(false)}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Images List */}
      {images.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="rounded-2xl border-2 border-dashed border-border hover:border-primary/50 p-8 text-center cursor-pointer transition-colors"
        >
          <PhotoIcon className="w-10 h-10 mx-auto text-muted-foreground/60 mb-2" />
          <p className="text-xs font-semibold text-foreground">No Photos Uploaded for this Piece</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Click here to upload garment photos from your device or use existing image links.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((img, idx) => {
            const isPrimary = idx === 0;
            return (
              <div
                key={idx}
                className={`group relative rounded-2xl border overflow-hidden bg-card shadow-sm transition-all ${
                  isPrimary ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-primary/50'
                }`}
              >
                {/* Photo Thumbnail */}
                <div className="relative aspect-[3/4] w-full bg-muted/30 overflow-hidden">
                  <img
                    src={getImageSrc(img.data)}
                    alt={img.alt || `Photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Primary Badge */}
                  {isPrimary && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-primary text-primary-foreground shadow-md flex items-center gap-1">
                        <StarSolidIcon className="w-2.5 h-2.5" />
                        <span>Cover</span>
                      </span>
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(idx)}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white backdrop-blur-md"
                        title="Make Cover Photo"
                      >
                        <StarIcon className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white backdrop-blur-md"
                      title="Remove Photo"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Alt text field for SEO */}
                <div className="p-2 border-t border-border/60">
                  <input
                    type="text"
                    value={img.alt || ''}
                    onChange={(e) => handleAltChange(idx, e.target.value)}
                    placeholder="Photo caption/alt..."
                    className="w-full text-[10px] bg-transparent border-0 p-0 text-foreground placeholder:text-muted-foreground focus:ring-0 truncate"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
