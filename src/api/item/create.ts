import api from "@/lib/api";

export const getTemplates = () => api.get('templates').json();
export const getTemplate = (id: string | number) => api.get(`templates/${id}`).json();

export const createItem = (data) => {
  const { formValues, templateId, userRating } = data;
  const title = formValues.title;
  const fieldValues = Object.entries(formValues).map((arr) => ({ fieldName: arr[0], value: arr[1] }));
  return api.post("items", {
    json: { templateId, title, fieldValues, userRating }
  }).json();
};

export const uploadImage = async (file: File, type: string) => {
  return api.post('upload/presigned-url', {
    json: {
      filename: file.name,
      contentType: file.type,
      type: type, // e.g., 'movie', 'tv', 'book'
    },
  }).json();
};