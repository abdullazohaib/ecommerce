import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  X, 
  Check, 
  Sparkles, 
  AlertCircle,
  FolderOpen
} from 'lucide-react';

/**
 * Optimizes an uploaded image file before storing as Data URL
 * Prevents exceeding localStorage quota by scaling down massive phone camera photos (e.g. 5MB -> ~150KB)
 * while preserving crystal-clear sharpness for web screens.
 */
export const compressImageFile = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided'));
    // SVGs can be read directly
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const isPng = file.type === 'image/png';
    const isWebp = file.type === 'image/webp';
    const hasTransparency = isPng || isWebp;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!hasTransparency) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
        } else {
          ctx.clearRect(0, 0, width, height);
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to optimized format (PNG to preserve transparency for logos, JPEG for photos)
        const format = hasTransparency ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(format, hasTransparency ? undefined : quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(event.target.result); // Fallback to raw
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function ImageUploadField({
  label = "Upload Image",
  value = "",
  onChange,
  presets = [],
  aspect = "square", // 'square' | 'wide' | 'banner' | 'contain'
  helperText = "Direct upload from gallery or device files (PNG, JPG, WEBP, SVG)"
}) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'url' | 'presets'
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [imageDims, setImageDims] = useState(null);
  const fileInputRef = useRef(null);

  // Measure uploaded / linked image resolution
  React.useEffect(() => {
    if (!value || typeof value !== 'string') {
      setImageDims(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      setImageDims({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => setImageDims(null);
    img.src = value;
  }, [value]);

  const handleFileProcess = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WEBP, SVG).');
      return;
    }
    setErrorMsg('');
    setIsProcessing(true);

    try {
      // Optimize image for fast rendering and local storage compatibility
      const maxW = aspect === 'contain' ? 600 : 1200;
      const maxH = aspect === 'contain' ? 240 : 1200;
      const compressedDataUrl = await compressImageFile(file, maxW, maxH, 0.85);
      onChange(compressedDataUrl);
    } catch (err) {
      console.error("Image processing error:", err);
      // Fallback: direct read
      const reader = new FileReader();
      reader.onload = (e) => onChange(e.target.result);
      reader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const isLocalDataUrl = value && value.startsWith('data:image');
  const hasValue = Boolean(value && value.trim());

  return (
    <div className="space-y-2">
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#5B4DF5]" />
          <span>{label}</span>
        </label>

        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'upload'
                ? 'bg-white text-[#5B4DF5] shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-2.5 h-2.5" />
            <span>Upload File</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'url'
                ? 'bg-white text-[#5B4DF5] shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LinkIcon className="w-2.5 h-2.5" />
            <span>Paste Link</span>
          </button>

          {presets && presets.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'presets'
                  ? 'bg-white text-[#5B4DF5] shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>Presets</span>
            </button>
          )}
        </div>
      </div>

      {/* Hidden File Input (supports gallery/photos on mobile & files on desktop) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* TAB 1: DIRECT FILE / GALLERY UPLOAD */}
      {activeTab === 'upload' && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#5B4DF5] bg-indigo-50/50 scale-[0.99]'
              : 'border-slate-200 hover:border-[#5B4DF5]/60 hover:bg-slate-50/80 bg-white'
          }`}
        >
          {isProcessing ? (
            <div className="py-4 space-y-2">
              <div className="w-8 h-8 border-2 border-[#5B4DF5] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-semibold text-slate-700">Reading & optimizing image...</p>
            </div>
          ) : (
            <div className="space-y-2 py-1">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#5B4DF5] flex items-center justify-center mx-auto shadow-2xs">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Click to select from Gallery or Device Files
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  or drag & drop your image file here
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                  PNG
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                  JPG
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                  WEBP
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                  SVG
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PASTE WEB URL */}
      {activeTab === 'url' && (
        <div className="space-y-1.5">
          <div className="relative">
            <input
              type="url"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
            />
            {hasValue && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            Paste any direct image URL from web, Cloudinary, AWS S3, or Unsplash.
          </p>
        </div>
      )}

      {/* TAB 3: CURATED PRESETS */}
      {activeTab === 'presets' && presets && presets.length > 0 && (
        <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
          <span className="text-[11px] font-semibold text-slate-500 block">Select a curated beauty preset:</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(preset.url || preset.image)}
                className={`p-2 bg-white border rounded-xl text-left hover:border-[#5B4DF5] transition-all cursor-pointer flex items-center gap-2 group ${
                  value === (preset.url || preset.image) ? 'border-[#5B4DF5] ring-2 ring-indigo-100' : 'border-slate-200'
                }`}
              >
                <img
                  src={preset.url || preset.image}
                  alt={preset.label}
                  className="w-8 h-8 rounded-lg object-cover shrink-0"
                />
                <span className="text-[10px] font-semibold text-slate-700 group-hover:text-[#5B4DF5] truncate">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* LIVE IMAGE PREVIEW CARD */}
      {hasValue && (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-14 h-14 rounded-xl bg-white border border-slate-200/80 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
              <img
                src={value}
                alt="Uploaded preview"
                className={`w-full h-full ${aspect === 'contain' ? 'object-contain p-1' : 'object-cover'}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80";
                }}
              />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Check className="w-2.5 h-2.5" />
                  {isLocalDataUrl ? 'Uploaded from Device' : 'Live Image Connected'}
                </span>
                {imageDims && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                    📐 {imageDims.width} × {imageDims.height} px
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-1 max-w-[200px] sm:max-w-xs font-mono">
                {isLocalDataUrl ? 'Local Device Photo (Optimized)' : value}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer shadow-2xs"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-xs cursor-pointer shadow-2xs"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {helperText && !hasValue && (
        <p className="text-[11px] text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
}

