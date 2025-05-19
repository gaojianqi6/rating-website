import React from "react";
import { Typography, Grid, Stack, Button } from "@mui/material";
import { Headphones as HeadphonesIcon } from "@mui/icons-material";
import BaseTemplate from "./BaseTemplate";
import { Item, UserRating, RatingsResponse } from "@/types/item";

interface PodcastTemplateProps {
  item: Item;
  ratingsData: RatingsResponse | null;
  userRating: UserRating | null;
  onRateClick: () => void;
}

const PodcastTemplate: React.FC<PodcastTemplateProps> = ({
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

  const audioUrl = getFieldValue("audio_url");

  return (
    <BaseTemplate
      item={item}
      ratingsData={ratingsData}
      userRating={userRating}
      onRateClick={onRateClick}
      contentType="podcast"
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        {getFieldValue("title")} ({getFieldValue("first_air_year")}
        {getFieldValue("end_year") && ` - ${getFieldValue("end_year")}`})
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Host:</strong> {getFieldValue("host")}
          </Typography>
          <Typography variant="body1">
            <strong>Network:</strong> {getFieldValue("network")}
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
            <strong>Status:</strong> {getFieldValue("status")}
          </Typography>
          <Typography variant="body1">
            <strong>Episodes:</strong> {getFieldValue("episodes")}
          </Typography>
          <Typography variant="body1">
            <strong>Average Duration:</strong> {getFieldValue("avg_duration")} minutes
          </Typography>
          <Typography variant="body1">
            <strong>Content Rating:</strong> {getFieldValue("content_rating")}
          </Typography>
        </Grid>
      </Grid>

      {audioUrl && audioUrl !== "N/A" && (
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="warning"
            startIcon={<HeadphonesIcon />}
            href={audioUrl}
            target="_blank"
            sx={{ borderRadius: 2 }}
          >
            Listen to Podcast
          </Button>
        </Stack>
      )}
    </BaseTemplate>
  );
};

export default PodcastTemplate; 