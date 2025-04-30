"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import {
  Typography,
  Box,
  Container,
  Button,
  Rating,
  Grid,
  Paper,
  Avatar,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { getItemBySlug, getUserRating, getRatingsForItem, createOrUpdateRating } from '@/api/item';

// Types (same as in CreateItemPage)
interface Item {
  id: number;
  templateId: number;
  title: string;
  slug: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  fieldValues: FieldValue[];
}

interface FieldValue {
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

interface Field {
  id: number;
  templateId: 1;
  name: string;
  displayName: string;
  description: string;
  fieldType: 'text' | 'textarea' | 'number' | 'select' | 'multiselect' | 'img' | 'url';
  isRequired: boolean;
  isSearchable: boolean;
  isFilterable: boolean;
  displayOrder: number;
  dataSourceId: number | null;
  validationRules: any;
  createdAt: string;
  updatedAt: string;
}

interface UserRating {
  id: number;
  itemId: number;
  userId: number;
  rating: number; // Backend scale: 0-10
  reviewText: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
  };
}

interface RatingsResponse {
  averageRating: number; // Backend scale: 0-10
  ratingsCount: number;
  ratings: UserRating[];
}

interface RecommendationItem {
  id: number;
  title: string;
  slug: string;
  poster: string;
  createdAt: string;
}

// Mock API functions for recommendations
const fetchRecommendationsByTemplate = async (templateType: string): Promise<RecommendationItem[]> => {
  return [
    { id: 1, title: "Movie 1", slug: "movie-1", poster: "https://via.placeholder.com/150", createdAt: "2025-04-01" },
    { id: 2, title: "Movie 2", slug: "movie-2", poster: "https://via.placeholder.com/150", createdAt: "2025-04-02" },
  ];
};

const fetchRecommendationsByGenre = async (genreType: string): Promise<RecommendationItem[]> => {
  return [
    { id: 11, title: "Sci-Fi Movie 1", slug: "sci-fi-movie-1", poster: "https://via.placeholder.com/150", createdAt: "2025-04-01" },
    { id: 12, title: "Sci-Fi Movie 2", slug: "sci-fi-movie-2", poster: "https://via.placeholder.com/150", createdAt: "2025-04-02" },
  ];
};

// Main Component
const ItemDetailPage = () => {
  const { slug } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [userRating, setUserRating] = useState<UserRating | null>(null);
  const [ratingsData, setRatingsData] = useState<RatingsResponse | null>(null);
  const [templateRecommendations, setTemplateRecommendations] = useState<RecommendationItem[]>([]);
  const [genreRecommendations, setGenreRecommendations] = useState<RecommendationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openRatingDialog, setOpenRatingDialog] = useState(false);
  const [newRating, setNewRating] = useState<number>(0); // Frontend scale: 0-5
  const [newComment, setNewComment] = useState<string>('');

  // Helper functions to convert between frontend (0-5) and backend (0-10) scales
  const toFrontendScale = (backendRating: number) => backendRating / 2;
  const toBackendScale = (frontendRating: number) => frontendRating * 2;

  // Fetch non-ratings data (item and recommendations) on mount
  const loadNonRatingsData = async () => {
    try {
      const itemData = await getItemBySlug(slug as string);
      setItem(itemData);

      // Fetch recommendations
      const templateType = 'movie';
      const genres = itemData.fieldValues.find(fv => fv.field.name === 'type')?.jsonValue || [];
      const genreType = genres[0] || 'Science Fiction';

      const templateRecs = await fetchRecommendationsByTemplate(templateType);
      setTemplateRecommendations(templateRecs);

      const genreRecs = await fetchRecommendationsByGenre(genreType);
      setGenreRecommendations(genreRecs);

      return itemData;
    } catch (error) {
      console.error('Error loading non-ratings data:', error);
      throw error;
    }
  };

  // Fetch ratings data (user rating and all ratings)
  const loadRatingsData = async (itemId: number) => {
    try {
      // Fetch the current user's rating
      const userRatingData = await getUserRating(itemId);
      setUserRating(userRatingData);

      // Set initial values for the dialog (convert backend scale to frontend scale)
      setNewRating(userRatingData ? toFrontendScale(userRatingData.rating) : 0);
      setNewComment(userRatingData?.reviewText || '');

      // Fetch all ratings for the item
      const ratingsResponse = await getRatingsForItem(itemId);
      setRatingsData(ratingsResponse);
    } catch (error) {
      console.error('Error loading ratings data:', error);
      throw error;
    }
  };

  // Initial data load on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const itemData = await loadNonRatingsData();
        await loadRatingsData(itemData.id);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      loadData();
    }
  }, [slug]);

  // Handle rating submission
  const handleRateNow = async () => {
    if (!item) return;

    try {
      // Convert the frontend rating (0-5) to backend scale (0-10)
      const backendRating = toBackendScale(newRating);
      await createOrUpdateRating(item.id, backendRating, newComment);
      // Refresh only the ratings data
      await loadRatingsData(item.id);
      setOpenRatingDialog(false);
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Item not found.</Typography>
      </Container>
    );
  }

  // Extract field values for easy access
  const title = item.fieldValues.find(fv => fv.field.name === 'title')?.textValue || 'N/A';
  const poster = item.fieldValues.find(fv => fv.field.name === 'poster')?.textValue || '';
  const releaseYear = item.fieldValues.find(fv => fv.field.name === 'release_year')?.numericValue || 'N/A';
  const director = item.fieldValues.find(fv => fv.field.name === 'director')?.textValue || 'N/A';
  const cast = item.fieldValues.find(fv => fv.field.name === 'cast')?.textValue || 'N/A';
  const language = item.fieldValues.find(fv => fv.field.name === 'language')?.jsonValue?.join(', ') || 'N/A';
  const genre = item.fieldValues.find(fv => fv.field.name === 'type')?.jsonValue?.join(', ') || 'N/A';
  const country = item.fieldValues.find(fv => fv.field.name === 'country')?.jsonValue?.join(', ') || 'N/A';
  const synopsis = item.fieldValues.find(fv => fv.field.name === 'synopsis')?.textValue || 'N/A';
  const contentRating = item.fieldValues.find(fv => fv.field.name === 'content_rating')?.textValue || 'N/A';
  const runtime = item.fieldValues.find(fv => fv.field.name === 'runtime')?.numericValue || 'N/A';
  const trailerUrl = item.fieldValues.find(fv => fv.field.name === 'trailer_url')?.textValue || '#';

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Main Detail Section */}
      <Grid container spacing={4}>
        {/* Poster */}
        <Grid item xs={12} md={4}>
          <Box
            component="img"
            src={poster}
            alt={title}
            sx={{
              width: '100%',
              maxHeight: 400,
              objectFit: 'cover',
              borderRadius: 2,
            }}
          />
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {title} ({releaseYear})
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            <strong>Director:</strong> {director}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            <strong>Cast:</strong> {cast}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            <strong>Genre:</strong> {genre}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            <strong>Production Countries:</strong> {country}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            <strong>Language:</strong> {language}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            <strong>Runtime:</strong> {runtime} minutes
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            <strong>Content Rating:</strong> {contentRating}
          </Typography>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="warning"
              startIcon={<PlayArrowIcon />}
              href={trailerUrl}
              target="_blank"
            >
              Play Trailer
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Synopsis Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Synopsis of {title}
        </Typography>
        <Typography variant="body1" paragraph>
          {synopsis}
        </Typography>
      </Box>

      {/* Rating Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Ratings ({ratingsData?.ratingsCount || 0})
        </Typography>
        <Typography variant="h6" gutterBottom>
          Average Rating: {(ratingsData?.averageRating || 0).toFixed(1)} / 10
          <Rating
            value={toFrontendScale(ratingsData?.averageRating || 0)}
            precision={0.5}
            max={5}
            readOnly
            sx={{ verticalAlign: 'middle', ml: 1 }}
          />
        </Typography>

        {/* My Rating Alert */}
        <Alert severity="info" sx={{ mt: 2 }}>
          {userRating ? (
            <>
              Your Rating:{' '}
              <Rating
                value={toFrontendScale(userRating.rating)}
                precision={0.5}
                max={5}
                readOnly
                size="small"
                sx={{ verticalAlign: 'middle', ml: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>{userRating.reviewText}</Typography>
              <Button color="primary" onClick={() => setOpenRatingDialog(true)} sx={{ mt: 1 }}>
                Update Rating
              </Button>
            </>
          ) : (
            <>
              Have you watched or want to watch this movie?{' '}
              <Button color="primary" onClick={() => setOpenRatingDialog(true)}>
                Rate Now
              </Button>
            </>
          )}
        </Alert>
      </Box>

      {/* Rating Dialog */}
      <Dialog open={openRatingDialog} onClose={() => setOpenRatingDialog(false)}>
        <DialogTitle>{userRating ? 'Update Your Rating' : 'Rate This Item'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography>Rating (out of 5 stars):</Typography>
            <Rating
              value={newRating}
              onChange={(event, value) => setNewRating(value || 0)}
              precision={0.5}
              max={5}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {newRating ? `Score: ${toBackendScale(newRating).toFixed(1)} / 10` : 'Select a rating'}
            </Typography>
          </Box>
          <TextField
            label="Comment"
            multiline
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRatingDialog(false)}>Cancel</Button>
          <Button onClick={handleRateNow} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Ratings List */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Reviews ({ratingsData?.ratings.length

 || 0})
        </Typography>
        {ratingsData?.ratings.length === 0 ? (
          <Typography>No reviews yet.</Typography>
        ) : (
          ratingsData?.ratings.map((rating) => (
            <Paper key={rating.id} sx={{ p: 2, mb: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar>{rating.user.username[0]}</Avatar>
                <Box>
                  <Typography variant="subtitle2">
                    {rating.user.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(rating.createdAt).toLocaleString()}
                  </Typography>
                  <Rating
                    value={toFrontendScale(rating.rating)}
                    precision={0.5}
                    max={5}
                    readOnly
                    size="small"
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {rating.reviewText}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          ))
        )}
      </Box>

      {/* Recommendation Sections */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recommended Movies
        </Typography>
        <Grid container spacing={2}>
          {templateRecommendations.map((rec) => (
            <Grid item xs={12} sm={6} md={2} key={rec.id}>
              <Link href={`/item/subject/${rec.slug}`}>
                <Box
                  component="img"
                  src={rec.poster}
                  alt={rec.title}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 2,
                    cursor: 'pointer',
                  }}
                />
              </Link>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {rec.title}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          More {genre} Movies
        </Typography>
        <Grid container spacing={2}>
          {genreRecommendations.map((rec) => (
            <Grid item xs={12} sm={6} md={2} key={rec.id}>
              <Link href={`/item/subject/${rec.slug}`}>
                <Box
                  component="img"
                  src={rec.poster}
                  alt={rec.title}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 2,
                    cursor: 'pointer',
                  }}
                />
              </Link>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {rec.title}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ItemDetailPage;