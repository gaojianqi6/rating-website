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
} from '@mui/material';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteIcon from '@mui/icons-material/Favorite';

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
  fieldType: 'text' | 'textarea' | 'number' | 'select' | 'multiselect' | 'img';
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
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
  };
}

interface RecommendationItem {
  id: number;
  title: string;
  slug: string;
  poster: string;
  createdAt: string;
}

// Mock API functions (replace with actual API calls)
const fetchItem = async (slug: string): Promise<Item> => {
  return {
    id: 5,
    templateId: 1,
    title: "The Hobbit: The Battle of the Five Armies",
    slug: "the-hobbit-battle-of-five-armies",
    createdBy: 2,
    createdAt: "2025-04-21T23:53:57.761Z",
    updatedAt: "2025-04-21T23:53:57.761Z",
    fieldValues: [
      {
        id: 36,
        itemId: 5,
        fieldId: 1,
        textValue: "The Hobbit: The Battle of the Five Armies",
        numericValue: null,
        dateValue: null,
        booleanValue: null,
        jsonValue: null,
        createdAt: "2025-04-21T23:53:57.770Z",
        updatedAt: "2025-04-21T23:53:57.770Z",
        field: {
          id: 1,
          templateId: 1,
          name: "title",
          displayName: "Title",
          description: "The official title of the movie.",
          fieldType: "text",
          isRequired: true,
          isSearchable: true,
          isFilterable: true,
          displayOrder: 1,
          dataSourceId: null,
          validationRules: null,
          createdAt: "2025-04-17T16:56:37.006Z",
          updatedAt: "2025-04-17T16:56:37.006Z",
        },
      },
      {
        id: 37,
        itemId: 5,
        fieldId: 2,
        textValue: "https://rating-item.s3.amazonaws.com/movie/b67b8318-7e87-431a-8e56-631dfa0ac30e/passed.png",
        numericValue: null,
        dateValue: null,
        booleanValue: null,
        jsonValue: null,
        createdAt: "2025-04-21T23:53:57.770Z",
        updatedAt: "2025-04-21T23:53:57.770Z",
        field: {
          id: 2,
          templateId: 1,
          name: "poster",
          displayName: "Poster",
          description: "URL to the movie’s poster image.",
          fieldType: "img",
          isRequired: false,
          isSearchable: false,
          isFilterable: false,
          displayOrder: 2,
          dataSourceId: null,
          validationRules: null,
          createdAt: "2025-04-17T16:56:37.006Z",
          updatedAt: "2025-04-17T16:56:37.006Z",
        },
      },
      {
        id: 38,
        itemId: 5,
        fieldId: 3,
        textValue: null,
        numericValue: 2014,
        dateValue: null,
        booleanValue: null,
        jsonValue: null,
        createdAt: "2025-04-21T23:53:57.770Z",
        updatedAt: "2025-04-21T23:53:57.770Z",
        field: {
          id: 3,
          templateId: 1,
          name: "release_year",
          displayName: "Release Year",
          description: "The year the movie was first released.",
          fieldType: "number",
          isRequired: true,
          isSearchable: true,
          isFilterable: true,
          displayOrder: 3,
          dataSourceId: null,
          validationRules: null,
          createdAt: "2025-04-17T16:56:37.006Z",
          updatedAt: "2025-04-17T16:56:37.006Z",
        },
      },
      {
        id: 39,
        itemId: 5,
        fieldId: 4,
        textValue: "Peter Jackson",
        numericValue: null,
        dateValue: null,
        booleanValue: null,
        jsonValue: null,
        createdAt: "2025-04-21T23:53:57.770Z",
        updatedAt: "2025-04-21T23:53:57.770Z",
        field: {
          id: 4,
          templateId: 1,
          name: "director",
          displayName: "Director",
          description: "The primary director(s) of the movie.",
          fieldType: "text",
          isRequired: false,
          isSearchable: false,
          isFilterable: false,
          displayOrder: 4,
          dataSourceId: null,
          validationRules: null,
          createdAt: "2025-04-17T16:56:37.006Z",
          updatedAt: "2025-04-17T16:56:37.006Z",
        },
      },
      {
        id: 40,
        itemId: 5,
        fieldId: 5,
        textValue: "Martin Freeman, Ian McKellen, Richard Armitage, Evangeline Lilly, Lee Pace, Luke Evans, Benedict Cumberbatch, Cate Blanchett, Hugo Weaving, Orlando Bloom",
        numericValue: null,
        dateValue: null,
        booleanValue: null,
        jsonValue: null,
        createdAt: "2025-04-21T23:53:57.770Z",
        updatedAt: "2025-04-21T23:53:57.770Z",
        field: {
          id: 5,
          templateId: 1,
          name: "cast",
          displayName: "Cast",
          description: "Main actors and actresses starring in the movie.",
          fieldType: "text",
          isRequired: false,
          isSearchable: false,
          isFilterable: false,
          displayOrder: 5,
          dataSourceId: null,
          validationRules: null,
          createdAt: "2025-04-17T16:56:37.006Z",
          updatedAt: "2025-04-17T16:56:37.006Z",
        },
      },
      {
        id: 41,
        itemId: 5,
        fieldId: 6,
        textValue: null,
        numericValue: null,
        dateValue: null,
        booleanValue: null,
        jsonValue: ["English"],
        createdAt: "2025-04-21T23:53:57.770Z",
        updatedAt: "2025-04-21T23:53:57.770Z",
        field: {
          id: 6,
          templateId: 1,
          name: "language",
          displayName: "Language",
          description: "The primary language(s) spoken in the movie.",
          fieldType: "multiselect",
          isRequired: true,
          isSearchable: false,
          isFilterable: false,
          displayOrder: 6,
          dataSourceId: 7,
          validationRules: null,
          createdAt: "2025-04-17T16:56:37.006Z",
          updatedAt: "2025-04-17T16:56:37.006Z",
        },
      },
      {
        id: 42,
        itemId: 5,
        fieldId: 7,
        textValue: null,
        numericValue: null,
        dateValue: null,
        booleanValue: null,
        jsonValue: ["Fantasy", "Adventure"],
        createdAt: "2025-04-21T23:53:57.770Z",
        updatedAt: "2025-04-21T23:53:57.770Z",
        field: {
          id: 7,
          templateId: 1,
          name: "type",
          displayName: "Genre",
          description: "The genre(s) or category of the movie.",
          fieldType: "multiselect",
          isRequired: true,
          isSearchable: true,
          isFilterable: true,
          displayOrder: 7,
          dataSourceId: 1,
          validationRules: null,
          createdAt: "2025-04-17T16:56:37.006Z",
          updatedAt: "2025-04-17T16:56:37.006Z",
        },
      },
      {
        id: 43,
        itemId: 5,
        fieldId: 8,
        textValue: null,
        numericValue: null,
        dateValue: null,
        booleanValue: null,
        jsonValue: ["USA", "New Zealand"],
        createdAt: "2025-04-21T23:53:57.770Z",
        updatedAt: "2025-04-21T23:53:57.770Z",
        field: {
          id: 8,
          templateId: 1,
          name: "country",
          displayName: "Country",
          description: "The country or countries where the movie was produced.",
          fieldType: "multiselect",
          isRequired: true,
          isSearchable: true,
          isFilterable: true,
          displayOrder: 8,
          dataSourceId: 9,
          validationRules: null,
          createdAt: "2025-04-17T16:56:37.006Z",
          updatedAt: "2025-04-17T16:56:37.006Z",
        },
      },
      {
        id: 44,
        itemId: 5,
        fieldId: 9,
        textValue: "The adventure of hobbit Bilbo Baggins (Martin Freeman) continues. Dwarf king Thorin (Richard Armitage), after reclaiming the Lonely Mountain, becomes increasingly greedy, intent on hoarding its treasures. Meanwhile, elf king Thranduil (Lee Pace), human archer Bard (Luke Evans), and other forces join the struggle for the mountain's riches. At the same time, an orc army, led by the dark lord Sauron, prepares to attack the mountain. Bilbo must navigate the conflict between loyalty, friendship, and justice as tensions rise and war looms on the horizon...",
        numericValue: null,
        dateValue: null,
        booleanValue: null,
        jsonValue: null,
        createdAt: "2025-04-21T23:53:57.770Z",
        updatedAt: "2025-04-21T23:53:57.770Z",
        field: {
          id: 9,
          templateId: 1,
          name: "synopsis",
          displayName: "Synopsis",
          description: "A brief summary of the movie’s plot.",
          fieldType: "textarea",
          isRequired: true,
          isSearchable: false,
          isFilterable: false,
          displayOrder: 9,
          dataSourceId: null,
          validationRules: null,
          createdAt: "2025-04-17T16:56:37.006Z",
          updatedAt: "2025-04-17T16:56:37.006Z",
        },
      },
      {
        id: 45,
        itemId: 5,
        fieldId: 10,
        textValue: "PG-13",
        numericValue: null,
        dateValue: null,
        booleanValue: null,
        jsonValue: null,
        createdAt: "2025-04-21T23:53:57.770Z",
        updatedAt: "2025-04-21T23:53:57.770Z",
        field: {
          id: 10,
          templateId: 1,
          name: "content_rating",
          displayName: "Content Rating",
          description: "The age-appropriateness rating of the movie.",
          fieldType: "select",
          isRequired: false,
          isSearchable: false,
          isFilterable: false,
          displayOrder: 10,
          dataSourceId: 8,
          validationRules: null,
          createdAt: "2025-04-17T16:56:37.006Z",
          updatedAt: "2025-04-17T16:56:37.006Z",
        },
      },
      {
        id: 46,
        itemId: 5,
        fieldId: 11,
        textValue: null,
        numericValue: 144,
        dateValue: null,
        booleanValue: null,
        jsonValue: null,
        createdAt: "2025-04-21T23:53:57.770Z",
        updatedAt: "2025-04-21T23:53:57.770Z",
        field: {
          id: 11,
          templateId: 1,
          name: "runtime",
          displayName: "Runtime (minutes)",
          description: "The total duration of the movie in minutes.",
          fieldType: "number",
          isRequired: true,
          isSearchable: false,
          isFilterable: false,
          displayOrder: 11,
          dataSourceId: null,
          validationRules: null,
          createdAt: "2025-04-17T16:56:37.006Z",
          updatedAt: "2025-04-17T16:56:37.006Z",
        },
      },
      {
        id: 47,
        itemId: 5,
        fieldId: 12,
        textValue: "http://www.youtube.com/test",
        numericValue: null,
        dateValue: null,
        booleanValue: null,
        jsonValue: null,
        createdAt: "2025-04-21T23:53:57.770Z",
        updatedAt: "2025-04-21T23:53:57.770Z",
        field: {
          id: 12,
          templateId: 1,
          name: "trailer_url",
          displayName: "Trailer URL",
          description: "A URL linking to the movie’s official trailer.",
          fieldType: "text",
          isRequired: false,
          isSearchable: false,
          isFilterable: false,
          displayOrder: 12,
          dataSourceId: null,
          validationRules: null,
          createdAt: "2025-04-17T16:56:37.006Z",
          updatedAt: "2025-04-17T16:56:37.006Z",
        },
      },
    ],
  };
};

const fetchUserRatings = async (itemId: number): Promise<UserRating[]> => {
  // Mock data for ratings
  return [
    {
      id: 1,
      itemId,
      userId: 1,
      rating: 5,
      comment: "The final Hobbit film delivered a thrilling conclusion. It looks even better in theaters. Bilbo's journey felt so emotional after 13 months away from home... I was deeply moved.",
      createdAt: "2025-04-21T23:55:00.000Z",
      user: { id: 1, username: "User1" },
    },
  ];
};

const fetchRecommendationsByTemplate = async (templateType: string): Promise<RecommendationItem[]> => {
  return [
    { id: 1, title: "Movie 1", slug: "movie-1", poster: "https://via.placeholder.com/150", createdAt: "2025-04-01" },
    { id: 2, title: "Movie 2", slug: "movie-2", poster: "https://via.placeholder.com/150", createdAt: "2025-04-02" },
  ];
};

const fetchRecommendationsByGenre = async (genreType: string): Promise<RecommendationItem[]> => {
  return [
    { id: 11, title: "Fantasy Movie 1", slug: "fantasy-movie-1", poster: "https://via.placeholder.com/150", createdAt: "2025-04-01" },
    { id: 12, title: "Fantasy Movie 2", slug: "fantasy-movie-2", poster: "https://via.placeholder.com/150", createdAt: "2025-04-02" },
  ];
};

// Main Component
const ItemDetailPage = () => {
  const { slug } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [userRatings, setUserRatings] = useState<UserRating[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [ratingDistribution] = useState({
    5: 47.5,
    4: 38.6,
    3: 12.3,
    2: 1.2,
    1: 0.4,
  });
  const [templateRecommendations, setTemplateRecommendations] = useState<RecommendationItem[]>([]);
  const [genreRecommendations, setGenreRecommendations] = useState<RecommendationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch item and ratings on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const itemData = await fetchItem(slug as string);
        setItem(itemData);

        const ratingsData = await fetchUserRatings(itemData.id);
        setUserRatings(ratingsData);

        // Calculate average rating
        if (ratingsData.length > 0) {
          const avg = ratingsData.reduce((sum, r) => sum + r.rating, 0) / ratingsData.length;
          setAverageRating(avg);
        }

        // Fetch recommendations
        const templateType = 'movie';
        const genres = itemData.fieldValues.find(fv => fv.field.name === 'type')?.jsonValue || [];
        const genreType = genres[0] || 'Fantasy';

        const templateRecs = await fetchRecommendationsByTemplate(templateType);
        setTemplateRecommendations(templateRecs);

        const genreRecs = await fetchRecommendationsByGenre(genreType);
        setGenreRecommendations(genreRecs);
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
            {title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            <strong>Director:</strong> {director}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            <strong>Writers:</strong> Fran Walsh, Philippa Boyens, Peter Jackson, Guillermo del Toro
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
            <strong>Release Dates:</strong> 2015-01-23 (China), 2014-12-17 (USA)
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            <strong>Runtime:</strong> {runtime} minutes / 164 minutes (Extended Edition)
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            <strong>Also Known As:</strong> The Hobbit: There and Back Again
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            <strong>IMDb:</strong> tt2310332
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            <strong>Rating:</strong> 8.6 <Rating value={4.3} precision={0.1} readOnly size="small" sx={{ verticalAlign: 'middle', ml: 1 }} />
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            <strong>Number of Ratings:</strong> 408,846 users
          </Typography>

          {/* Rating Distribution */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" component="span">
              5 stars {ratingDistribution[5]}%
            </Typography>
            <Box sx={{ width: '100px', bgcolor: '#ddd', height: '4px', borderRadius: 1, overflow: 'hidden', display: 'inline-block', verticalAlign: 'middle', mx: 1 }}>
              <Box sx={{ width: `${ratingDistribution[5]}%`, bgcolor: '#f5a623', height: '100%' }} />
            </Box>
            <Typography variant="body2" color="text.secondary" component="span">
              4 stars {ratingDistribution[4]}%
            </Typography>
            <Box sx={{ width: '100px', bgcolor: '#ddd', height: '4px', borderRadius: 1, overflow: 'hidden', display: 'inline-block', verticalAlign: 'middle', mx: 1 }}>
              <Box sx={{ width: `${ratingDistribution[4]}%`, bgcolor: '#f5a623', height: '100%' }} />
            </Box>
            <Typography variant="body2" color="text.secondary" component="span">
              3 stars {ratingDistribution[3]}%
            </Typography>
            <Box sx={{ width: '100px', bgcolor: '#ddd', height: '4px', borderRadius: 1, overflow: 'hidden', display: 'inline-block', verticalAlign: 'middle', mx: 1 }}>
              <Box sx={{ width: `${ratingDistribution[3]}%`, bgcolor: '#f5a623', height: '100%' }} />
            </Box>
            <Typography variant="body2" color="text.secondary" component="span">
              2 stars {ratingDistribution[2]}%
            </Typography>
            <Box sx={{ width: '100px', bgcolor: '#ddd', height: '4px', borderRadius: 1, overflow: 'hidden', display: 'inline-block', verticalAlign: 'middle', mx: 1 }}>
              <Box sx={{ width: `${ratingDistribution[2]}%`, bgcolor: '#f5a623', height: '100%' }} />
            </Box>
            <Typography variant="body2" color="text.secondary" component="span">
              1 star {ratingDistribution[1]}%
            </Typography>
            <Box sx={{ width: '100px', bgcolor: '#ddd', height: '4px', borderRadius: 1, overflow: 'hidden', display: 'inline-block', verticalAlign: 'middle', mx: 1 }}>
              <Box sx={{ width: `${ratingDistribution[1]}%`, bgcolor: '#f5a623', height: '100%' }} />
            </Box>
          </Box>

          {/* Good/Bad Rating Percentages */}
          <Typography variant="subtitle1" color="text.secondary">
            Better than 98% of Fantasy movies
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Better than 97% of Adventure movies
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
              Play Now
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<FavoriteIcon />}
              onClick={() => alert('Add to favorites functionality not implemented')}
            >
              Favorite
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Synopsis Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Synopsis of The Hobbit: The Battle of the Five Armies
        </Typography>
        <Typography variant="body1" paragraph>
          {synopsis}
        </Typography>
      </Box>

      {/* Rating Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Ratings ({userRatings.length})
        </Typography>
        <Typography variant="h6" gutterBottom>
          Average Rating: {averageRating.toFixed(1)} / 5
          <Rating value={averageRating} precision={0.1} readOnly sx={{ verticalAlign: 'middle', ml: 1 }} />
        </Typography>

        {/* My Rating Alert */}
        <Alert severity="info" sx={{ mt: 2 }}>
          Have you watched or want to watch this movie? <Button color="primary" onClick={() => alert('Please go to the rating page to submit your rating.')}>Rate Now</Button>
        </Alert>
      </Box>

      {/* User Ratings List */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Reviews ({userRatings.length})
        </Typography>
        {userRatings.length === 0 ? (
          <Typography>No reviews yet.</Typography>
        ) : (
          userRatings.map((rating) => (
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
                  <Rating value={rating.rating} readOnly size="small" />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {rating.comment}
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
              <Link href={`/items/${rec.slug}`}>
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
              <Link href={`/items/${rec.slug}`}>
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