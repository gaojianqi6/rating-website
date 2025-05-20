import React, { ReactNode } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Rating,
  Alert,
  Avatar,
  Paper,
  Stack,
} from "@mui/material";
import { Item, UserRating, RatingsResponse } from "@/types/item";
import { useUserStore } from "@/store/userStore";
import Link from "next/link";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface BaseTemplateProps {
  item: Item;
  ratingsData: RatingsResponse | null;
  userRating: UserRating | null;
  onRateClick: () => void;
  children?: ReactNode;
  contentType: string;
}

const BaseTemplate: React.FC<BaseTemplateProps> = ({
  item,
  ratingsData,
  userRating,
  onRateClick,
  children,
  contentType,
}) => {
  const { user } = useUserStore();

  // Helper function to get field value
  const getFieldValue = (fieldName: string): string => {
    const field = item.fieldValues.find((fv) => fv.field.name === fieldName);
    if (!field) return "N/A";

    const { textValue, numericValue, dateValue, jsonValue } = field;
    return (
      textValue ||
      numericValue?.toString() ||
      dateValue ||
      jsonValue?.join(", ") ||
      "N/A"
    );
  };

  // Get rating prompt based on content type
  const getRatingPrompt = () => {
    switch (contentType.toLowerCase()) {
      case "movie":
        return "Have you watched or want to watch this movie?";
      case "tv series":
        return "Have you watched or want to watch this TV series?";
      case "variety show":
        return "Have you watched or want to watch this variety show?";
      case "book":
        return "Have you read or want to read this book?";
      case "music":
        return "Have you listened to or want to listen to this music?";
      case "podcast":
        return "Have you listened to or want to listen to this podcast?";
      default:
        return "Have you experienced or want to experience this item?";
    }
  };

  // Helper function to convert backend rating (0-10) to frontend (0-5)
  const toFrontendScale = (backendRating: number) => backendRating / 2;

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 4, mb: 4 }}
      style={{ paddingLeft: 0, paddingRight: 0 }}
    >
      <Grid container spacing={4}>
        {/* Poster */}
        <Grid item xs={12} md={4}>
          <Box
            component="img"
            src={getFieldValue("poster")}
            alt={getFieldValue("title")}
            sx={{
              width: "100%",
              maxHeight: 400,
              objectFit: "cover",
              borderRadius: 2,
              boxShadow: 3,
            }}
          />
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={8}>
          {children}
        </Grid>
      </Grid>

      {/* Synopsis Section */}
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Synopsis
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
          {getFieldValue("synopsis") || getFieldValue("description")}
        </Typography>
      </Box>

      {/* Rating Section */}
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Ratings ({ratingsData?.ratingsCount || 0})
        </Typography>
        <Typography variant="h6" gutterBottom>
          Average Rating: {(ratingsData?.averageRating || 0).toFixed(1)} / 10
          <Rating
            value={(ratingsData?.averageRating || 0) / 2}
            precision={0.5}
            max={5}
            readOnly
            sx={{ verticalAlign: "middle", ml: 1, color: "warning.main" }}
          />
        </Typography>

        {/* My Rating Alert */}
        <Alert
          severity="info"
          sx={{
            mt: 2,
            borderRadius: 2,
            backgroundColor: "rgba(33, 150, 243, 0.12)",
            color: "text.primary",
            p: 1.5,
            alignItems: "center",
            "& .MuiAlert-message": { width: "100%", p: 0 },
          }}
          icon={false}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ overflow: "hidden" }}
          >
            <InfoOutlinedIcon color="info" fontSize="small" />
            {user ? (
              userRating ? (
                <>
                  <Typography
                    variant="body1"
                    component="span"
                    sx={{ flexShrink: 0 }}
                  >
                    Your Rating:
                  </Typography>
                  <Rating
                    value={userRating.rating / 2}
                    precision={0.5}
                    max={5}
                    readOnly
                    size="small"
                    sx={{ verticalAlign: "middle", ml: 1, flexShrink: 0 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      ml: 2,
                      mr: 2,
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {userRating.reviewText}
                  </Typography>
                  <Button
                    color="primary"
                    onClick={onRateClick}
                    sx={{ ml: 1, flexShrink: 0, whiteSpace: "nowrap" }}
                  >
                    Update Rating
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="body1" component="span" sx={{ flex: 1 }}>
                    {getRatingPrompt()}
                  </Typography>
                  <Button color="primary" onClick={onRateClick} sx={{ ml: 1 }}>
                    Rate Now
                  </Button>
                </>
              )
            ) : (
              <>
                <Typography variant="body1" component="span" sx={{ flex: 1 }}>
                  Want to rate this {contentType.toLowerCase()}?
                </Typography>
                <Button
                  color="primary"
                  component={Link}
                  href="/auth/login"
                  sx={{ ml: 1 }}
                >
                  Login to Rate
                </Button>
              </>
            )}
          </Box>
        </Alert>
      </Box>

      {/* Reviews List Section */}
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Reviews ({ratingsData?.ratings.length || 0})
        </Typography>
        {ratingsData?.ratings.length === 0 ? (
          <Typography>No reviews yet.</Typography>
        ) : (
          ratingsData?.ratings.map((rating) => (
            <Paper
              key={rating.id}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                boxShadow: 0, // flat
                border: "1px solid #eee",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="flex-start">
                {rating.user.avatar ? (
                  <Avatar
                    src={rating.user.avatar}
                    alt={rating.user.username}
                  />
                ) : (
                  <Avatar
                    sx={{
                      bgcolor: "primary.main"
                    }}
                  >
                    {rating.user.username[0].toUpperCase()}
                  </Avatar>
                )}

                <Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      {rating.user.nickname || rating.user.username}
                    </Typography>
                    <Rating
                      value={toFrontendScale(rating.rating)}
                      precision={0.5}
                      max={5}
                      readOnly
                      size="small"
                      sx={{ color: "warning.main" }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(rating.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {rating.reviewText}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          ))
        )}
      </Box>
    </Container>
  );
};

export default BaseTemplate;
