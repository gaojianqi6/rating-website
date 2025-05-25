export interface RatingItem {
  id: number;
  title: string;
  slug: string;
  year: number;
  poster: string;
  rating: number; // Backend scale: 0-10
  comment: string;
}

export interface TemplateRating {
  templateId: number;
  templateName: string;
  templateDisplayName: string;
  ratings: RatingItem[];
}