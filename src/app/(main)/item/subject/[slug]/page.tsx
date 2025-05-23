"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUserStore } from "@/store/userStore";

import {
  Typography,
  Box,
  Container,
} from "@mui/material";

import {
  getItemBySlug,
  getUserRating,
  getRatingsForItem,
  createOrUpdateRating,
  fetchRecommendationsByGenre,
  fetchRecommendationsByTemplate,
  RecommendationItem,
} from "@/api/item";

// Import template components
import MovieTemplate from "@/components/templates/MovieTemplate";
import TVSeriesTemplate from "@/components/templates/TVSeriesTemplate";
import VarietyShowTemplate from "@/components/templates/VarietyShowTemplate";
import BookTemplate from "@/components/templates/BookTemplate";
import MusicTemplate from "@/components/templates/MusicTemplate";
import PodcastTemplate from "@/components/templates/PodcastTemplate";

import { Item, UserRating, RatingsResponse } from "@/types/item";
import RatingCommentDialog from '@/components/RatingCommentDialog';
import Recommendations from "@/components/items/Recommendations";

// Add template display names mapping
const TEMPLATE_DISPLAY_NAMES: { [key: number]: string } = {
  1: "Movies",
  2: "TV Series",
  3: "Variety Shows",
  4: "Books",
  5: "Music",
  6: "Podcasts",
};

// Main Component
const ItemDetailPage = () => {
  const { slug } = useParams();
  const { user } = useUserStore();
  const [item, setItem] = useState<Item | null>(null);
  const [userRating, setUserRating] = useState<UserRating | null>(null);
  const [ratingsData, setRatingsData] = useState<RatingsResponse | null>(null);
  const [templateRecommendations, setTemplateRecommendations] = useState<
    RecommendationItem[]
  >([]);
  const [genreRecommendations, setGenreRecommendations] = useState<
    RecommendationItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openRatingDialog, setOpenRatingDialog] = useState(false);
  const [newRating, setNewRating] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>("");

  // Helper functions to convert between frontend (0-5) and backend (0-10) scales
  const toFrontendScale = (backendRating: number) => backendRating / 2;
  const toBackendScale = (frontendRating: number) => frontendRating * 2;

  // Fetch non-ratings data (item and recommendations) on mount
  const loadNonRatingsData = async () => {
    try {
      const itemData = (await getItemBySlug(slug as string)) as Item;
      setItem(itemData);

      // Fetch recommendations
      const templateTypeId = itemData.templateId;
      const field = itemData.fieldValues.find(
        (fv: { field: { name: string; displayName: string } }) =>
          fv.field.name === "type" || fv.field.displayName === "Genre"
      );
      const { fieldId, jsonValue = [] } = field || {};
      const genreValues = jsonValue || ["Drama"];

      const templateRecs = await fetchRecommendationsByTemplate(templateTypeId);
      setTemplateRecommendations(templateRecs);

      if (fieldId) {
        const genreRecs = await fetchRecommendationsByGenre(
          templateTypeId,
          fieldId,
          genreValues
        );
        setGenreRecommendations(genreRecs);
      }

      return itemData;
    } catch (error) {
      console.error("Error loading non-ratings data:", error);
      throw error;
    }
  };

  const getCurrentItemRating = async (itemId: number) => {
    // Fetch all ratings for the item
    const ratingsResponse = await getRatingsForItem(itemId);
    setRatingsData(ratingsResponse);
  };

  const getCurrentUserRating = async (itemId: number) => {
    const userRatingData = await getUserRating(itemId);
    setUserRating(userRatingData);

    // Set initial values for the dialog (convert backend scale to frontend scale)
    setNewRating(userRatingData ? toFrontendScale(userRatingData.rating) : 0);
    setNewComment(userRatingData?.reviewText || "");
  };

  // Fetch ratings data (user rating and all ratings)
  const loadRatingsData = async (itemId: number) => {
    try {
      // Only fetch user rating if user is logged in
      if (user) {
        getCurrentUserRating(itemId);
      }
      getCurrentItemRating(itemId);
    } catch (error) {
      console.error("Error loading ratings data:", error);
      throw error;
    }
  };

  // Initial data load on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const itemData = await loadNonRatingsData();
        // Only load ratings data if we have an item
        if (itemData) {
          await getCurrentItemRating(itemData.id);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      loadData();
    }
  }, [slug]);

  // Load user rating when user state changes
  useEffect(() => {
    const loadUserRating = async () => {
      if (user && item) {
        try {
          getCurrentUserRating(item.id);
        } catch (error) {
          console.error("Error loading user rating:", error);
        }
      }
    };

    loadUserRating();
  }, [user, item]);

  // Handle rating submission
  const handleRateNow = async () => {
    if (!item) return;

    if (!user) {
      // Redirect to login page if user is not authenticated
      window.location.href = "/auth/login";
      return;
    }

    try {
      // Convert the frontend rating (0-5) to backend scale (0-10)
      const backendRating = toBackendScale(newRating);
      await createOrUpdateRating(item.id, backendRating, newComment);
      // Refresh only the ratings data
      await loadRatingsData(item.id);
      setOpenRatingDialog(false);
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating. Please try again.");
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

  // Render the appropriate template based on templateId
  const renderTemplate = () => {
    switch (item.templateId) {
      case 1: // Movie
        return (
          <MovieTemplate
            item={item}
            ratingsData={ratingsData}
            userRating={userRating}
            onRateClick={() => setOpenRatingDialog(true)}
          />
        );
      case 2: // TV Series
        return (
          <TVSeriesTemplate
            item={item}
            ratingsData={ratingsData}
            userRating={userRating}
            onRateClick={() => setOpenRatingDialog(true)}
          />
        );
      case 3: // Variety Show
        return (
          <VarietyShowTemplate
            item={item}
            ratingsData={ratingsData}
            userRating={userRating}
            onRateClick={() => setOpenRatingDialog(true)}
          />
        );
      case 4: // Book
        return (
          <BookTemplate
            item={item}
            ratingsData={ratingsData}
            userRating={userRating}
            onRateClick={() => setOpenRatingDialog(true)}
          />
        );
      case 5: // Music
        return (
          <MusicTemplate
            item={item}
            ratingsData={ratingsData}
            userRating={userRating}
            onRateClick={() => setOpenRatingDialog(true)}
          />
        );
      case 6: // Podcast
        return (
          <PodcastTemplate
            item={item}
            ratingsData={ratingsData}
            userRating={userRating}
            onRateClick={() => setOpenRatingDialog(true)}
          />
        );
      default:
        return (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography>Unknown template type.</Typography>
          </Container>
        );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Render the appropriate template */}
      {renderTemplate()}

      {/* Rating Dialog */}
      <RatingCommentDialog
        open={openRatingDialog}
        onClose={() => setOpenRatingDialog(false)}
        onSubmit={handleRateNow}
        rating={newRating}
        setRating={setNewRating}
        comment={newComment}
        setComment={setNewComment}
        isUpdate={!!userRating}
        maxRating={5}
      />

      {/* Recommendation Sections with Swiper */}
      <Recommendations
        title={`Recommended ${TEMPLATE_DISPLAY_NAMES[item.templateId] || "Items"}`}
        recommendationsType="item"
        recommendations={templateRecommendations}
        templateName={TEMPLATE_DISPLAY_NAMES[item.templateId] || "movie"}
        swiperNavigationClass="template"
      />
      <Box sx={{ mt: 2, mb: 6 }}>
        <Recommendations
          title={`Recommended ${TEMPLATE_DISPLAY_NAMES[item.templateId] || "Items"} in the same genre`}
          recommendationsType="item"
          recommendations={genreRecommendations}
          templateName={TEMPLATE_DISPLAY_NAMES[item.templateId] || "movie"}
          swiperNavigationClass="genre"
        />
      </Box>
    </Container>
  );
};

export default ItemDetailPage;
