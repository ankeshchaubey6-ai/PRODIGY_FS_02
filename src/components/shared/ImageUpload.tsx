"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn, formatFileSize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from "@/lib/constants";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  onClear?: () => void;
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  onClear,
  className,
  disabled,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    // Client-side validation
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP images are allowed.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        `Image is too large (${formatFileSize(file.size)}). Maximum is 5MB.`
      );
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const json = await res.json();
        toast.error(json.error ?? "Upload failed");
        return;
      }

      const json = await res.json();
      onChange(json.data.url);
      toast.success("Image uploaded successfully.");
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!disabled && !isUploading) setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleClear() {
    onChange("");
    onClear?.();
  }

  // ── Preview mode (image selected) ────────────────────────
  if (value) {
    return (
      <div className={cn("relative inline-block", className)}>
        <img
          src={value}
          alt="Profile"
          className="w-24 h-24 rounded-xl object-cover border border-border"
        />
        {!disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-sm hover:bg-destructive/90 transition-colors"
            aria-label="Remove image"
          >
            <X className="w-3 h-3" />
          </button>
        )}
        {!disabled && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 rounded-xl bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100"
            disabled={isUploading}
            aria-label="Change image"
          >
            <span className="text-white text-xs font-medium">Change</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
    );
  }

  // ── Upload mode (no image) ────────────────────────────────
  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-xl transition-colors cursor-pointer",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-muted/30",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={() => !disabled && !isUploading && inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      role="button"
      tabIndex={0}
      aria-label="Upload image"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!disabled && !isUploading) inputRef.current?.click();
        }
      }}
    >
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        {isUploading ? (
          <>
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3">
              {isDragging ? (
                <ImageIcon className="w-5 h-5 text-primary" />
              ) : (
                <Upload className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              {isDragging ? "Drop image here" : "Upload profile photo"}
            </p>
            <p className="text-xs text-muted-foreground">
              JPEG, PNG, WebP · Max 5MB
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
}