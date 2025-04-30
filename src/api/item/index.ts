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