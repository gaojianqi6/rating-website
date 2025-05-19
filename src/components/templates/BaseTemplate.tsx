import React, { ReactNode } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Rating,
  Alert,
} from "@mui/material";
import { Item, UserRating, RatingsResponse } from "@/types/item";
import { useUserStore } from "@/store/userStore";
import Link from "next/link";

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
    return textValue || numericValue?.toString() || dateValue || jsonValue?.join(", ") || "N/A";
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
          {getFieldValue("synopsis")}
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
        <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
          {user ? (
            userRating ? (
              <>
                Your Rating:{" "}
                <Rating
                  value={userRating.rating / 2}
                  precision={0.5}
                  max={5}
                  readOnly
                  size="small"
                  sx={{ verticalAlign: "middle", ml: 1, color: "warning.main" }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {userRating.reviewText}
                </Typography>
                <Button
                  color="primary"
                  onClick={onRateClick}
                  sx={{ mt: 1 }}
                >
                  Update Rating
                </Button>
              </>
            ) : (
              <>
                {getRatingPrompt()}{" "}
                <Button color="primary" onClick={onRateClick}>
                  Rate Now
                </Button>
              </>
            )
          ) : (
            <>
              Want to rate this {contentType.toLowerCase()}?{" "}
              <Button color="primary" component={Link} href="/auth/login">
                Login to Rate
              </Button>
            </>
          )}
        </Alert>
      </Box>
    </Container>
  );
};

export default BaseTemplate; 