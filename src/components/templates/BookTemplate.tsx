import React from "react";
import { Typography, Grid, Stack, Button } from "@mui/material";
import { MenuBook as MenuBookIcon } from "@mui/icons-material";
import BaseTemplate from "./BaseTemplate";
import { Item, UserRating, RatingsResponse } from "@/types/item";

interface BookTemplateProps {
  item: Item;
  ratingsData: RatingsResponse | null;
  userRating: UserRating | null;
  onRateClick: () => void;
}

const BookTemplate: React.FC<BookTemplateProps> = ({
  item,
  ratingsData,
  userRating,
  onRateClick,
}) => {
  // Helper function to get field value
  const getFieldValue = (fieldName: string): string => {
    const field = item.fieldValues.find((fv) => fv.field.name === fieldName);
    if (!field) return "N/A";

    const { textValue, numericValue, dateValue, jsonValue } = field;
    return textValue || numericValue?.toString() || dateValue || jsonValue?.join(", ") || "N/A";
  };

  const sourceUrl = getFieldValue("source_url");

  return (
    <BaseTemplate
      item={item}
      ratingsData={ratingsData}
      userRating={userRating}
      onRateClick={onRateClick}
      contentType="book"
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        {getFieldValue("title")} ({getFieldValue("publication_year")})
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Author:</strong> {getFieldValue("author")}
          </Typography>
          <Typography variant="body1">
            <strong>Publisher:</strong> {getFieldValue("publisher")}
          </Typography>
          <Typography variant="body1">
            <strong>ISBN:</strong> {getFieldValue("isbn")}
          </Typography>
          <Typography variant="body1">
            <strong>Genre:</strong> {getFieldValue("type")}
          </Typography>
          <Typography variant="body1">
            <strong>Language:</strong> {getFieldValue("language")}
          </Typography>
          <Typography variant="body1">
            <strong>Country:</strong> {getFieldValue("country")}
          </Typography>
          <Typography variant="body1">
            <strong>Format:</strong> {getFieldValue("format")}
          </Typography>
          <Typography variant="body1">
            <strong>Pages:</strong> {getFieldValue("pages")}
          </Typography>
          <Typography variant="body1">
            <strong>Content Rating:</strong> {getFieldValue("content_rating")}
          </Typography>
        </Grid>
      </Grid>

      {sourceUrl && sourceUrl !== "N/A" && (
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="warning"
            startIcon={<MenuBookIcon />}
            href={sourceUrl}
            target="_blank"
            sx={{ borderRadius: 2 }}
          >
            Book Source
          </Button>
        </Stack>
      )}
    </BaseTemplate>
  );
};

export default BookTemplate; 