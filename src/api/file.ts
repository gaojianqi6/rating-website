import api from "@/lib/api";

export const uploadImage = async (file: File, type: string): Promise<{ presignedUrl: string; publicUrl: string }> => {
  return api.post('upload/presigned-url', {
    json: {
      filename: file.name,
      contentType: file.type,
      type: type, // e.g., 'movie', 'tv', 'book'
    },
  }).json();
};