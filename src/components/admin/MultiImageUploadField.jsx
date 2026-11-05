import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Plus, 
  Trash2, 
  Star, 
  Image as ImageIcon, 
  AlertCircle,
  X,
  Link as LinkIcon
} from 'lucide-react';
import { compressImageFile } from './ImageUploadField';

export default function MultiImageUploadField({
  images = [],
  onChange,
  label = "Product Gallery Photos",
  helperText = "Add multiple angles, texture, packaging, or ingredient photos directly from your phone gallery or files."
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleFilesProcess = async (files) => {
    if (!files || files.length === 0) return;
    setErrorMsg('');
    setIsProcessing(true);

    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      setErrorMsg('Please select valid image files (JPG, PNG, WEBP, SVG).');
      setIsProcessing(false);
      return;
    }

    try {
      const compressedUrls = await Promise.all(
        validFiles.map(file => compressImageFile(file, 1200, 1200, 0.85))
      );

      const nextImages = [...images, ...compressedUrls];
      onChange(nextImages);
    } catch (err) {
      console.error("Multi-image upload error:", err);
      setErrorMsg('Some images failed to load. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInputChange = (e) => {
    handleFilesProcess(e.target.files);
    // Reset file input so same files can be re-selected if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleRemove = (index) => {
    const next = images.filter((_, idx) => idx !== index);
    onChange(next);
  };

  const handleSetCover = (index) => {
    if (index === 0) return;
    const item = images[index];
    const filtered = images.filter((_, idx) => idx !== index);
    onChange([item, ...filtered]);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#5B4DF5]" />
            <span>{label}</span>
            <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {images.length} photos
            </span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'Hide URL' : '+ Add via URL'}</span>
          </button>
        </div>
      </div>

      {/* Hidden Multi-file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* URL Input Row (Optional) */}
      {showUrlInput && (
        <form onSubmit={handleAddUrl} className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image link https://..."
            className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#5B4DF5] outline-none"
          />
          <button
            type="submit"
            className="bg-[#5B4DF5] text-white px-3 py-2 rounded-xl text-xs font-bold cursor-pointer"
          >
            Add
          </button>
        </form>
      )}

      {/* Photo Grid & Upload Area */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
        {/* Existing Photos Thumbnails */}
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white aspect-square shadow-2xs"
          >
            <img
              src={img}
              alt={`Product preview ${idx + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80";
              }}
            />

            {/* Badges and Actions Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
              <div className="flex items-center justify-between">
                {idx === 0 ? (
                  <span className="bg-emerald-500 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    Cover
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetCover(idx)}
                    className="bg-black/60 hover:bg-[#5B4DF5] text-white text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                    title="Set as Cover Image"
                  >
                    Set Cover
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-md cursor-pointer transition-colors"
                  title="Delete image"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <span className="text-[9px] text-white/80 font-mono truncate px-1">
                Photo #{idx + 1}
              </span>
            </div>

            {/* Static Cover Badge for Index 0 */}
            {idx === 0 && (
              <div className="absolute top-1.5 left-1.5 group-hover:opacity-0 transition-opacity">
                <span className="bg-emerald-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs">
                  Cover
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Big Add Photos from Device / Gallery Button */}
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#5B4DF5]/40 hover:border-[#5B4DF5] bg-indigo-50/40 hover:bg-indigo-50/80 rounded-xl aspect-square flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer group"
        >
          {isProcessing ? (
            <div className="space-y-1">
              <div className="w-5 h-5 border-2 border-[#5B4DF5] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <span className="text-[10px] font-bold text-[#5B4DF5] block">Loading...</span>
            </div>
          ) : (
            <>
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-[#5B4DF5] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Upload className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-[#5B4DF5] leading-tight block">
                + Upload Photos
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5 block leading-tight">
                from Gallery / Files
              </span>
            </>
          )}
        </button>
      </div>

      {/* Error display */}
      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {helperText && (
        <p className="text-[11px] text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
}

