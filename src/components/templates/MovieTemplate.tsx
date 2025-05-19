import { Typography, Grid } from "@mui/material";
import BaseTemplate from "./BaseTemplate";
import { Item, UserRating, RatingsResponse } from "@/types/item";

interface MovieTemplateProps {
  item: Item;
  ratingsData: RatingsResponse | null;
  userRating: UserRating | null;
  onRateClick: () => void;
}

const MovieTemplate = ({ item, ratingsData, userRating, onRateClick }: MovieTemplateProps) => {
  const getFieldValue = (fieldName: string) => {
    const field = item.fieldValues.find((fv) => fv.field.name === fieldName);
    if (!field) return "N/A";

    switch (field.field.fieldType) {
      case "text":
      case "textarea":
        return field.textValue || "N/A";
      case "number":
        return field.numericValue || "N/A";
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
      contentType="movie"
    >
      <Grid item xs={12} md={8}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          {getFieldValue("title")} ({getFieldValue("release_year")})
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Director:</strong> {getFieldValue("director")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Cast:</strong> {getFieldValue("cast")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Genre:</strong> {getFieldValue("type")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Production Countries:</strong> {getFieldValue("country")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Language:</strong> {getFieldValue("language")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Runtime:</strong> {getFieldValue("runtime")} minutes
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Content Rating:</strong> {getFieldValue("content_rating")}
        </Typography>
      </Grid>
    </BaseTemplate>
  );
};

export default MovieTemplate; 