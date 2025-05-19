import { Typography, Grid } from "@mui/material";
import BaseTemplate from "./BaseTemplate";
import { Item, UserRating, RatingsResponse } from "@/types/item";

interface TVSeriesTemplateProps {
  item: Item;
  ratingsData: RatingsResponse | null;
  userRating: UserRating | null;
  onRateClick: () => void;
}

const TVSeriesTemplate = ({ item, ratingsData, userRating, onRateClick }: TVSeriesTemplateProps) => {
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
      contentType="tv series"
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
          <strong>Created By:</strong> {getFieldValue("created_by")}
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
          <strong>Network/Platform:</strong> {getFieldValue("network")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Status:</strong> {getFieldValue("status")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Seasons:</strong> {getFieldValue("seasons")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Episodes:</strong> {getFieldValue("episodes")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Average Runtime:</strong> {getFieldValue("avg_runtime")} minutes
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Content Rating:</strong> {getFieldValue("content_rating")}
        </Typography>
      </Grid>
    </BaseTemplate>
  );
};

export default TVSeriesTemplate; 