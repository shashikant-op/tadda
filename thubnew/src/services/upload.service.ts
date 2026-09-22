import { axiosInstance } from "@/lib/axios";
import { prepareUploadImage } from "@/lib/prepare-upload-image";

export type UploadStatus = { stage: "preparing" | "uploading" | "processing"; percent: number };

export const uploadService = {
  uploadImage: async (file: File, onProgress?: (status: UploadStatus) => void): Promise<{ url: string }> => {
    onProgress?.({ stage: "preparing", percent: 0 });
    const image = await prepareUploadImage(file);
    const formData = new FormData();
    formData.append("image", image);
    onProgress?.({ stage: "uploading", percent: 0 });
    const res = await axiosInstance.post("/tutorials/upload/image", formData, {
      // Do not set Content-Type manually: the browser must add the multipart
      // boundary or multer will receive an unreadable request body.
      headers: { "Content-Type": undefined },
      timeout: 45000,
      onUploadProgress: ({ loaded, total }) => {
        const percent = total ? Math.min(100, Math.round(loaded * 100 / total)) : 0;
        onProgress?.({ stage: percent === 100 ? "processing" : "uploading", percent });
      },
    });
    return res.data.data;
  },
};

export function uploadStatusLabel(status: UploadStatus): string {
  if (status.stage === "preparing") return "Preparing image…";
  if (status.stage === "processing") return "Finishing upload…";
  return `Uploading image… ${status.percent}%`;
}
