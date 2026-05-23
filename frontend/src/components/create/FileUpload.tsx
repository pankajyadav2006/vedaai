'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { useAssignmentStore } from '@/stores/assignmentStore';

const FileUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { formData, updateFormData } = useAssignmentStore();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData({ file });
    }
  };

  const removeFile = () => {
    updateFormData({ file: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      updateFormData({ file });
    }
  };

  return (
    <div className="space-y-4">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer
          ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-gray-400'}
          ${formData.file ? 'bg-gray-50' : ''}`}
        onClick={() => !formData.file && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
        />
        
        {formData.file ? (
          <div className="flex items-center gap-4 w-full max-w-xs p-3 bg-white rounded-xl shadow-sm border border-border">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-primary truncate">{formData.file.name}</p>
              <p className="text-xs text-secondary">{(formData.file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); removeFile(); }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-secondary" />
            </button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-sm font-bold text-primary mb-1">Choose a file or drag & drop it here</p>
            <p className="text-xs text-secondary mb-6">JPEG, PNG, upto 10MB</p>
            <button className="px-6 py-2 border border-border rounded-full text-sm font-bold hover:bg-gray-50 transition-colors">
              Browse Files
            </button>
          </>
        )}
      </div>
      <p className="text-center text-xs text-secondary">Upload images of your preferred document/image</p>
    </div>
  );
};

export default FileUpload;
