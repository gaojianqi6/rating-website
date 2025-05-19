import { Typography, Grid } from "@mui/material";
import BaseTemplate from "./BaseTemplate";
import { Item, UserRating, RatingsResponse } from "@/types/item";

interface BookTemplateProps {
  item: Item;
  ratingsData: RatingsResponse | null;
  userRating: UserRating | null;
  onRateClick: () => void;
}

const BookTemplate = ({ item, ratingsData, userRating, onRateClick }: BookTemplateProps) => {
  const getFieldValue = (fieldName: string): string => {
    const field = item.fieldValues.find((fv) => fv.field.name === fieldName);
    if (!field) return "N/A";

    switch (field.field.fieldType) {
      case "text":
      case "textarea":
        return field.textValue || "N/A";
      case "number":
        return field.numericValue?.toString() || "N/A";
      case "multiselect":
      case "select":
        return field.jsonValue?.join(", ") || "N/A";
      case "img":
        return field.textValue || "";
      case "url":
        return field.textValue || "#";
      default:
        return "N/A";
    }
  };

  return (
    <BaseTemplate
      item={item}
      ratingsData={ratingsData}
      userRating={userRating}
      onRateClick={onRateClick}
      contentType="book"
    >
      <Grid item xs={12} md={8}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          {getFieldValue("title")} ({getFieldValue("publication_year")})
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Author:</strong> {getFieldValue("author")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Publisher:</strong> {getFieldValue("publisher")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>ISBN:</strong> {getFieldValue("isbn")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Genre:</strong> {getFieldValue("type")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Language:</strong> {getFieldValue("language")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Country:</strong> {getFieldValue("country")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Format:</strong> {getFieldValue("format")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Pages:</strong> {getFieldValue("pages")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Content Rating:</strong> {getFieldValue("content_rating")}
        </Typography>
      </Grid>
    </BaseTemplate>
  );
};

export default BookTemplate; 