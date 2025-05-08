import api from "@/lib/api";

// Interface for the rating response
interface UserRating {
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

// Interface for the ratings response (from GET /ratings/:itemId)
interface RatingsResponse {
  averageRating: number;
  ratingsCount: number;
  ratings: UserRating[];
}

export interface RecommendationItem {
  id: number;
  title: string;
  slug: string;
  poster: string;
  createdAt: string;
}

// Interface for pagination metadata
export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Interface for the search response (from GET /items)
export interface SearchItemsResponse {
  items: RecommendationItem[];
  pagination: Pagination;
}

// Interface for filter options (from /data-source?ids=...)
export interface FilterOption {
  value: string;
  displayText: string;
}

export interface DataSource {
  id: number;
  name: string;
  sourceType: string;
  configuration: any | null;
  createdAt: string;
  updatedAt: string;
  createdBy: number | null;
  options: FilterOption[];
}

// Fetch item by slug
export const getItemBySlug = (slug: string) => api.get(`items/slug/${slug}`).json();

// Fetch the current user's rating for an item
export const getUserRating = (itemId: number) => 
  api.get(`ratings/my-rating/${itemId}`).json<UserRating | null>();

// Fetch all ratings for an item
export const getRatingsForItem = (itemId: number) => 
  api.get(`ratings/${itemId}`).json<RatingsResponse>();

// Create or update a rating
export const createOrUpdateRating = (itemId: number, rating: number, reviewText: string) =>
  api.post(`ratings`, { json: { itemId, rating, reviewText } }).json<UserRating>();

// Fetch recommendations by template
export const fetchRecommendationsByTemplate = async (templateTypeId: number): Promise<RecommendationItem[]> => {
  return api.get(`items/recommendations/template/${templateTypeId}`).json<RecommendationItem[]>();
};

// Fetch recommendations by genre
export const fetchRecommendationsByGenre = async (templateId: number, fieldId: number, genreValues: string[]): Promise<RecommendationItem[]> => {
  const genreQuery = genreValues.join(',');
  return api.get(`items/recommendations/genre/${templateId}/${fieldId}?genreValues=${encodeURIComponent(genreQuery)}`).json<RecommendationItem[]>();
};

// Fetch items with search parameters
export const searchItems = async (
  templateId: number,
  fields: { fieldId: number; fieldValue: any[] }[],
  sort: 'date' | 'score' | 'popularity',
  pageSize: number,
  pageNo: number,
): Promise<SearchItemsResponse> => {
  const query = new URLSearchParams({
    templateId: templateId.toString(),
    fields: JSON.stringify(fields),
    sort,
    pageSize: pageSize.toString(),
    pageNo: pageNo.toString(),
  });
  return api.get(`items?${query.toString()}`).json<SearchItemsResponse>();
};

// Fetch multiple data sources in a single call
export const fetchDataSources = async (dataSourceIds: number[]): Promise<DataSource[]> => {
  const idsQuery = dataSourceIds.join(',');
  return api.get(`data-source?ids=${idsQuery}`).json<DataSource[]>();
};