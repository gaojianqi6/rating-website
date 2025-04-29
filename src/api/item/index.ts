import api from "@/lib/api";

export const getItemBySlug = (slug: string) => api.get(`items/slug/${slug}`).json();