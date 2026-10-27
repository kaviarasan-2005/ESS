import React, { useState, useRef } from 'react';
import { useToast } from '../admin/components/ToastContext';
import { uploadImageFile } from '../services/api';

const ImageUploader = ({ value, onChange, label = "Upload Image" }) => {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const res = await uploadImageFile(file);
      if (res?.url) {
        onChange(res.url); // Sends hosted Cloudinary URL back to parent form
        showToast('Image uploaded successfully!', 'success');
      } else {
        showToast('Upload finished but no image URL was returned.', 'error');
      }
    } catch (err) {
      console.error('Upload error:', err);
      const detail = err?.response?.data?.detail;
      const message = typeof detail === 'string' ? detail : 'Upload failed. Check admin auth or backend logs.';
      setError(message);
      showToast('Failed to upload image.', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    showToast('Image removed.', 'info');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Drag & Drop / Click Upload Area */}
        <label
          className={`flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 p-3 rounded-xl cursor-pointer transition-all text-slate-600 hover:text-blue-600 ${
            uploading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
          }`}
        >
          <span className="text-base">{uploading ? '⏳' : '📁'}</span>
          <span className="text-xs font-bold">
            {uploading ? 'Uploading to Cloudinary...' : 'Click to Upload / Change Image'}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {/* Thumbnail Preview Box & Remove Action */}
        {value && (
          <div className="flex items-center gap-2 shrink-0">
            {/* Visual Thumbnail */}
            <div className="w-14 h-12 bg-white border border-slate-200 rounded-xl overflow-hidden p-1 shadow-sm flex items-center justify-center">
              <img
                src={value}
                alt="Uploaded Preview"
                className="w-full h-full object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

            {/* Clear / Remove Image Button */}
            <button
              type="button"
              onClick={handleRemove}
              className="text-xs font-bold text-rose-500 hover:text-rose-700 px-3 py-3 border border-slate-200 rounded-xl hover:bg-rose-50 transition-colors"
              title="Remove Image"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Error Output */}
      {error && (
        <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg">
          <p className="text-[10px] font-bold text-rose-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;