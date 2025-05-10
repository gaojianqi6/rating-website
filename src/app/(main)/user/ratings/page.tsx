'use client';

import { useState, useEffect } from 'react';
import { getRatings } from '@/api/user';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Container,
  Box,
  CircularProgress,
  Rating,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface RatingItem {
  id: number;
  title: string;
  slug: string;
  year: number;
  poster: string;
  rating: number; // Backend scale: 0-10
  comment: string;
}

interface TemplateRating {
  templateId: number;
  templateName: string;
  templateDisplayName: string;
  ratings: RatingItem[];
}

const RatingsPage = () => {
  const [ratings, setRatings] = useState<TemplateRating[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to convert backend rating (0-10) to frontend scale (0-5)
  const toFrontendScale = (backendRating: number) => backendRating / 2;

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await getRatings();
        setRatings(response);
      } catch (err) {
        setError('Failed to fetch ratings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" className="py-6 flex justify-center">
        <CircularProgress />
      </Container>
    );
  }
  if (error) {
    return (
      <Container maxWidth="lg" className="py-6">
        <Typography color="error" className="text-center text-lg">
          {error}
        </Typography>
      </Container>
    );
  }
  if (!ratings || ratings.length === 0) {
    return (
      <Container maxWidth="lg" className="py-6">
        <Typography className="text-center text-lg">No ratings available</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-6">
      <Typography
        variant="h4"
        gutterBottom
        className="text-left font-bold text-gray-800 mb-6 text-[16px]"
      >
        My Ratings
      </Typography>
      {ratings.map((template) => (
        <Box
          key={template.templateId}
          className="mb-6 shadow-lg rounded-lg bg-white"
        >
          <Box className="bg-blue-50 p-4 rounded-t-lg">
            <Typography
              variant="h6"
              className="text-left font-semibold text-gray-600 text-[14px]"
            >
              {template.templateDisplayName} ({template.ratings.length})
            </Typography>
          </Box>
          <Box className="p-4">
            {template.ratings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
                {template.ratings.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-md"
                  >
                    <CardMedia
                      component="img"
                      height="150"
                      image={item.poster || '/placeholder.jpg'}
                      alt={item.title}
                      className="object-cover"
                    />
                    <CardContent className="p-3 bg-gray-50">
                      <Typography
                        variant="subtitle1"
                        className="font-medium text-gray-900 line-clamp-1 text-[14px]"
                      >
                        {item.title} ({item.year})
                      </Typography>
                      <Box className="mt-2">
                        <Rating
                          value={toFrontendScale(item.rating)}
                          precision={0.5}
                          max={5}
                          readOnly
                          size="small"
                          sx={{ color: '#f4c430' }}
                        />
                        <Typography
                          variant="caption"
                          className="ml-2 text-gray-600 text-[12px]"
                        >
                          ({item.rating}/10)
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        className="text-gray-700 line-clamp-2 text-[12px] mt-1"
                      >
                        {item.comment || 'No comment'}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Typography className="text-gray-500 text-[12px] text-center">
                No ratings yet
              </Typography>
            )}
          </Box>
        </Box>
      ))}
    </Container>
  );
};

export default RatingsPage;