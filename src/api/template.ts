import api from "@/lib/api";
import { Template } from "@/types/template";

export const getTemplates = (): Promise<Template[]> => api.get('templates').json();
export const getTemplate = (id: string | number): Promise<Template> => api.get(`templates/${id}`).json();
export const getTemplateByName = (templateName: string) => api.get(`templates/by-name/${templateName}`).json();