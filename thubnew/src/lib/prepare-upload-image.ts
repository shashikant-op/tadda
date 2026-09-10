const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const OPTIMIZE_ABOVE_BYTES = 512 * 1024;
const MAX_IMAGE_EDGE = 2560;

/** Reduce photo transfer size; preserve PNG diagrams, WebP animations and small images verbatim. */
export async function prepareUploadImage(file: File): Promise<File> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Please select a JPG, PNG or WebP image.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image size must be 5MB or less.");
  }
  if (file.size <= OPTIMIZE_ABOVE_BYTES || file.type !== "image/jpeg"
    || typeof createImageBitmap === "undefined" || typeof document === "undefined") return file;

  let bitmap: ImageBitmap | undefined;
  try {
    bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.9));
    // Some browsers fall back to PNG; only replace when WebP saves at least 10%.
    if (!blob || blob.type !== "image/webp" || blob.size >= file.size * 0.9) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: blob.type });
  } catch {
    // Optimization is optional; decoding/encoding support must not block uploads.
    return file;
  } finally {
    bitmap?.close();
  }
}
