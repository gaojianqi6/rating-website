export interface Item {
  id: number;
  templateId: number;
  title: string;
  slug: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  fieldValues: FieldValue[];
}

export interface FieldValue {
  id: number;
  itemId: number;
  fieldId: number;
  textValue: string | null;
  numericValue: number | null;
  dateValue: string | null;
  booleanValue: boolean | null;
  jsonValue: string[] | null;
  createdAt: string;
  updatedAt: string;
  field: Field;
}

export interface Field {
  id: number;
  templateId: number;
  name: string;
  displayName: string;
  description: string;
  fieldType:
    | "text"
    | "textarea"
    | "number"
    | "select"
    | "multiselect"
    | "img"
    | "url";
  isRequired: boolean;
  isSearchable: boolean;
  isFilterable: boolean;
  displayOrder: number;
  dataSourceId: number | null;
  validationRules: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserRating {
  id: number;
  itemId: number;
  userId: number;
  rating: number;
  reviewText: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
  };
}

export interface RatingsResponse {
  averageRating: number;
  ratingsCount: number;
  ratings: UserRating[];
} 