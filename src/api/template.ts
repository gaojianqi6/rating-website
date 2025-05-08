import api from "@/lib/api";

export const getTemplates = () => api.get('templates').json();
export const getTemplate = (id: string | number) => api.get(`templates/${id}`).json();
export const getTemplateByName = (templateName: string) => api.get(`templates/by-name/${templateName}`).json();