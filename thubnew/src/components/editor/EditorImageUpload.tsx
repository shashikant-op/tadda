import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { uploadService } from "@/services/upload.service";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface EditorImageUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (url: string) => void;
}

export function EditorImageUpload({ isOpen, onClose, onInsertImage }: EditorImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (jpg, png, webp).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const res = await uploadService.uploadImage(file);
      const url = res.url;
      setPreviewUrl(url);
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      setError(errObj.response?.data?.message || errObj.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleConfirm = () => {
    if (previewUrl) {
      onInsertImage(previewUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="bg-card border rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-base flex items-center space-x-2">
            <ImageIcon className="h-4 w-4 text-emerald-600" />
            <span>Upload Course Image</span>
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-xs">
            {error}
          </div>
        )}

        {previewUrl ? (
          <div className="space-y-4">
            <div className="relative border rounded-lg overflow-hidden max-h-64 bg-muted/20 flex items-center justify-center">
              <img src={previewUrl} alt="Uploaded Preview" className="max-h-60 object-contain" />
              <button
                onClick={() => setPreviewUrl(null)}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full shadow hover:bg-destructive/90"
                title="Delete Image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => setPreviewUrl(null)}>
                Upload Different
              </Button>
              <Button size="sm" onClick={handleConfirm} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Insert Image into Lesson
              </Button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-input hover:border-primary rounded-xl p-8 text-center cursor-pointer space-y-3 bg-muted/10 transition-colors"
          >
            {uploading ? (
              <div className="flex flex-col items-center space-y-2 py-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-xs font-medium text-muted-foreground">Uploading to Cloudinary securely...</p>
              </div>
            ) : (
              <>
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Drag & drop an image here, or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, WEBP up to 5MB</p>
                </div>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
