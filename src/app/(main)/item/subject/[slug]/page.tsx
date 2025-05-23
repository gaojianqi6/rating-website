"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useUserStore } from "@/store/userStore";

import {
  Typography,
  Box,
  Container,
  Card,
  CardMedia,
  CardContent,
  Rating,
} from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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
      <Box sx={{ mt: 1 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main", pl: 0 }}
        >
          Recommended {TEMPLATE_DISPLAY_NAMES[item.templateId] || "Items"}
        </Typography>
        {templateRecommendations.length === 0 ? (
          <Typography>No recommendations available.</Typography>
        ) : (
          <Swiper
            modules={[Navigation, Mousewheel]}
            spaceBetween={10}
            slidesPerView={2}
            breakpoints={{
              480: { slidesPerView: 3 },
              640: { slidesPerView: 4 },
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 6 },
            }}
            navigation={{
              prevEl: ".swiper-button-prev-template",
              nextEl: ".swiper-button-next-template",
              disabledClass: "swiper-button-disabled",
              hiddenClass: "swiper-button-hidden",
            }}
            mousewheel={{ forceToAxis: true }}
            style={{ padding: "10px 0px", position: "relative" }}
          >
            {templateRecommendations.map((rec, index) => (
              <SwiperSlide
                key={rec.id}
                style={{ paddingLeft: index === 0 ? 0 : undefined }}
              >
                <Link href={`/item/subject/${rec.slug}`}>
                  <Card
                    sx={{
                      minWidth: 160,
                      maxWidth: 160,
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: 6,
                      },
                      borderRadius: 2,
                    }}
                  >
                    <CardMedia
                      component="img"
                      height={200}
                      image={rec.poster}
                      alt={rec.title}
                      sx={{
                        objectFit: "cover",
                        width: "100%",
                        cursor: "pointer",
                      }}
                    />
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "medium",
                          textAlign: "center",
                          fontSize: "0.875rem",
                          lineHeight: 1.2,
                          height: "2.4em",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {rec.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textAlign: "center", display: "block", mt: 0.5 }}
                      >
                        {rec.createdAt}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5 }}>
                        <Rating
                          value={rec.avgRating / 2}
                          precision={0.5}
                          size="small"
                          readOnly
                          sx={{ fontSize: 14 }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 0.5, fontSize: 11 }}
                        >
                          {rec.avgRating.toFixed(1)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Link>
              </SwiperSlide>
            ))}
            <Box
              className="swiper-button-prev-template"
              sx={{
                position: "absolute",
                top: "50%",
                left: 0,
                transform: "translateY(-50%)",
                width: 28,
                height: 28,
                backgroundColor: "rgba(128, 128, 128, 0.5)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                cursor: "pointer",
                "&:after": {
                  content: "none",
                },
                "&.swiper-button-disabled": {
                  display: "none",
                },
              }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 14, color: "white" }} />
            </Box>
            <Box
              className="swiper-button-next-template"
              sx={{
                position: "absolute",
                top: "50%",
                right: 0,
                transform: "translateY(-50%)",
                width: 28,
                height: 28,
                backgroundColor: "rgba(128, 128, 128, 0.5)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                cursor: "pointer",
                "&:after": {
                  content: "none",
                },
                "&.swiper-button-disabled": {
                  display: "none",
                },
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: 14, color: "white" }} />
            </Box>
          </Swiper>
        )}
      </Box>

      <Box sx={{ mt: 2, mb: 6 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main", pl: 0 }}
        >
          Recommended {TEMPLATE_DISPLAY_NAMES[item.templateId] || "Items"} in
          the same genre
        </Typography>
        {genreRecommendations.length === 0 ? (
          <Typography>No recommendations available.</Typography>
        ) : (
          <Swiper
            modules={[Navigation, Mousewheel]}
            spaceBetween={10}
            slidesPerView={2}
            breakpoints={{
              480: { slidesPerView: 3 },
              640: { slidesPerView: 4 },
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 6 },
            }}
            navigation={{
              prevEl: ".swiper-button-prev-genre",
              nextEl: ".swiper-button-next-genre",
              disabledClass: "swiper-button-disabled",
              hiddenClass: "swiper-button-hidden",
            }}
            mousewheel={{ forceToAxis: true }}
            style={{ padding: "10px 0px", position: "relative" }}
          >
            {genreRecommendations.map((rec, index) => (
              <SwiperSlide
                key={rec.id}
                style={{ paddingLeft: index === 0 ? 0 : undefined }}
              >
                <Link href={`/item/subject/${rec.slug}`}>
                  <Card
                    sx={{
                      minWidth: 160,
                      maxWidth: 160,
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: 6,
                      },
                      borderRadius: 2,
                    }}
                  >
                    <CardMedia
                      component="img"
                      height={200}
                      image={rec.poster}
                      alt={rec.title}
                      sx={{
                        objectFit: "cover",
                        width: "100%",
                        cursor: "pointer",
                      }}
                    />
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "medium",
                          textAlign: "center",
                          fontSize: "0.875rem",
                          lineHeight: 1.2,
                          height: "2.4em",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {rec.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textAlign: "center", display: "block", mt: 0.5 }}
                      >
                        {rec.createdAt}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5 }}>
                        <Rating
                          value={rec.avgRating / 2}
                          precision={0.5}
                          size="small"
                          readOnly
                          sx={{ fontSize: 14 }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 0.5, fontSize: 11 }}
                        >
                          {rec.avgRating.toFixed(1)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Link>
              </SwiperSlide>
            ))}
            <Box
              className="swiper-button-prev-genre"
              sx={{
                position: "absolute",
                top: "50%",
                left: 0,
                transform: "translateY(-50%)",
                width: 28,
                height: 28,
                backgroundColor: "rgba(128, 128, 128, 0.5)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                cursor: "pointer",
                "&:after": {
                  content: "none",
                },
                "&.swiper-button-disabled": {
                  display: "none",
                },
              }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 14, color: "white" }} />
            </Box>
            <Box
              className="swiper-button-next-genre"
              sx={{
                position: "absolute",
                top: "50%",
                right: 0,
                transform: "translateY(-50%)",
                width: 28,
                height: 28,
                backgroundColor: "rgba(128, 128, 128, 0.5)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                cursor: "pointer",
                "&:after": {
                  content: "none",
                },
                "&.swiper-button-disabled": {
                  display: "none",
                },
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: 14, color: "white" }} />
            </Box>
          </Swiper>
        )}
      </Box>
    </Container>
  );
};

export default ItemDetailPage;
