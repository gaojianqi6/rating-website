import { Typography, Grid } from "@mui/material";
import BaseTemplate from "./BaseTemplate";
import { Item, UserRating, RatingsResponse } from "@/types/item";

interface PodcastTemplateProps {
  item: Item;
  ratingsData: RatingsResponse | null;
  userRating: UserRating | null;
  onRateClick: () => void;
}

const PodcastTemplate = ({ item, ratingsData, userRating, onRateClick }: PodcastTemplateProps) => {
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
      contentType="podcast"
    >
      <Grid item xs={12} md={8}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          {getFieldValue("title")} ({getFieldValue("first_air_year")}
          {getFieldValue("end_year") !== "N/A" ? ` - ${getFieldValue("end_year")}` : ""})
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Host:</strong> {getFieldValue("host")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Network:</strong> {getFieldValue("network")}
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
          <strong>Status:</strong> {getFieldValue("status")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Episodes:</strong> {getFieldValue("episodes")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Average Duration:</strong> {getFieldValue("avg_duration")} minutes
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Content Rating:</strong> {getFieldValue("content_rating")}
        </Typography>
      </Grid>
    </BaseTemplate>
  );
};

export default PodcastTemplate; 