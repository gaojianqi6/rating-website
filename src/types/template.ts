import { DataSource } from "./datasource";

// Types
export interface Template {
  id: number;
  name: string;
  displayName: string;
  description: string;
  fullMarks: number;
  isPublished: boolean;
  fields: TemplateField[];
}

export interface TemplateField {
  id: number;
  templateId: number;
  name: string;
  displayName: string;
  description: string;
  fieldType: 'text' | 'textarea' | 'number' | 'select' | 'multiselect' | 'img';
  isRequired: boolean;
  isSearchable: boolean;
  isFilterable: boolean;
  displayOrder: number;
  dataSourceId: number | null;
  validationRules: any;
  dataSource: DataSource | null;
}