'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { uploadService, UploadedFile } from '@/lib/api/upload-service';
import { toast } from 'react-hot-toast';
import {
  PhotoIcon,
  CloudArrowUpIcon,
  TrashIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  XMarkIcon,
  ArrowPathIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export default function AdminMediaPage() {
  const [mediaFiles, setMediaFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await uploadService.getMediaGallery();
      setMediaFiles(response.files || []);
    } catch (error) {
      console.error('Failed to load media gallery:', error);
      toast.error('Failed to load media files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const fileList = Array.from(files);
      const response = await uploadService.uploadMultipleImages(fileList);
      toast.success(`${response.count || fileList.length} image(s) uploaded successfully!`);
      fetchMedia();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCopyUrl = (url: string) => {
    // If relative, convert to full URL or keep relative as needed
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Image URL copied to clipboard!');
  };

  const handleDelete = async (filename: string) => {
    if (!confirm('Are you sure you want to permanently delete this media file?')) return;

    try {
      await uploadService.deleteMediaFile(filename);
      toast.success('Media file deleted');
      if (selectedImage?.filename === filename) {
        setSelectedImage(null);
      }
      fetchMedia();
    } catch (error) {
      toast.error('Failed to delete media file');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.24em] uppercase text-primary mb-1">
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>Digital Asset Management</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Media &amp; Garment Photos
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Upload, preview, organize, and inspect all photography assets used across the Needle Fashion catalog.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMedia}
            className="p-2.5 rounded-xl border border-border bg-card text-foreground hover:border-primary transition-all shadow-sm"
            title="Refresh Media"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={handleFileUpload}
            className="hidden"
            id="media-file-input"
          />
          <label
            htmlFor="media-file-input"
            className="inline-flex items-center gap-2 cursor-pointer btn-luxury-gold px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.02] transition-all"
          >
            <CloudArrowUpIcon className="w-4 h-4" />
            <span>{isUploading ? 'Uploading Photos...' : 'Upload New Photos'}</span>
          </label>
        </div>
      </div>

      {/* Drag & Drop Upload Docket */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="rounded-3xl border-2 border-dashed border-primary/30 hover:border-primary/70 bg-card/50 p-8 sm:p-12 text-center cursor-pointer transition-all hover:bg-card group"
      >
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4 text-primary group-hover:scale-110 transition-transform">
          <CloudArrowUpIcon className="w-7 h-7" />
        </div>
        <h3 className="font-serif text-lg font-bold text-foreground">
          Drop Master Photoshoot Files Here
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
          High-resolution WEBP, JPEG, PNG, or SVG files up to 10MB each. Select multiple files to upload in bulk.
        </p>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto" />
          <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Loading Media Assets...</p>
        </div>
      ) : mediaFiles.length === 0 ? (
        <div className="py-16 text-center bg-card rounded-3xl border border-border p-8">
          <PhotoIcon className="w-12 h-12 mx-auto text-muted-foreground/60 mb-3" />
          <h3 className="font-serif text-lg font-bold text-foreground">No Media Files Uploaded Yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Click the button above to upload garment photoshoot pictures, model portraits, or fabric closeups.
          </p>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {mediaFiles.length} Total Asset(s) Stored
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mediaFiles.map((file) => (
              <div
                key={file.filename}
                className="group relative rounded-2xl bg-card border border-border/80 hover:border-primary/50 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full bg-muted/40 overflow-hidden">
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Overlay buttons */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      onClick={() => setSelectedImage(file)}
                      className="p-2 rounded-xl bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all"
                      title="Inspect Photo"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopyUrl(file.url)}
                      className="p-2 rounded-xl bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all"
                      title="Copy URL"
                    >
                      <ClipboardDocumentIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(file.filename)}
                      className="p-2 rounded-xl bg-red-500/80 hover:bg-red-500 text-white backdrop-blur-md transition-all"
                      title="Delete Photo"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Footer details */}
                <div className="p-3 border-t border-border/60 text-[11px] space-y-1">
                  <p className="font-medium text-foreground truncate" title={file.filename}>
                    {file.filename}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{formatFileSize(file.size)}</span>
                    <button
                      onClick={() => handleCopyUrl(file.url)}
                      className="text-primary hover:underline font-semibold"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
          <div className="bg-card max-w-3xl w-full rounded-3xl border border-primary/30 overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-foreground truncate max-w-md">
                  {selectedImage.filename}
                </h3>
                <span className="text-[11px] text-muted-foreground">
                  File Size: {formatFileSize(selectedImage.size)}
                </span>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 bg-black flex items-center justify-center max-h-[65vh] overflow-hidden">
              <img
                src={selectedImage.url}
                alt={selectedImage.filename}
                className="max-h-[60vh] max-w-full object-contain rounded-xl"
              />
            </div>

            <div className="p-4 border-t border-border bg-card/80 flex items-center justify-between gap-4">
              <code className="text-[11px] font-mono text-muted-foreground truncate bg-muted px-3 py-1.5 rounded-lg flex-1">
                {selectedImage.url}
              </code>
              <button
                onClick={() => handleCopyUrl(selectedImage.url)}
                className="btn-luxury-gold px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 flex-shrink-0"
              >
                <ClipboardDocumentIcon className="w-4 h-4" />
                <span>Copy Asset URL</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
