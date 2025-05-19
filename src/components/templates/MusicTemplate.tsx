import React from "react";
import { Typography, Grid, Stack, Button } from "@mui/material";
import { MusicNote as MusicNoteIcon } from "@mui/icons-material";
import BaseTemplate from "./BaseTemplate";
import { Item, UserRating, RatingsResponse } from "@/types/item";

interface MusicTemplateProps {
  item: Item;
  ratingsData: RatingsResponse | null;
  userRating: UserRating | null;
  onRateClick: () => void;
}

const MusicTemplate: React.FC<MusicTemplateProps> = ({
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
      contentType="music"
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        {getFieldValue("title")} ({getFieldValue("release_year")})
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Artist:</strong> {getFieldValue("artist")}
          </Typography>
          <Typography variant="body1">
            <strong>Label:</strong> {getFieldValue("label")}
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
            <strong>Duration:</strong> {getFieldValue("duration")} minutes
          </Typography>
          <Typography variant="body1">
            <strong>Tracks:</strong> {getFieldValue("tracks")}
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
            startIcon={<MusicNoteIcon />}
            href={audioUrl}
            target="_blank"
            sx={{ borderRadius: 2 }}
          >
            Listen to Audio
          </Button>
        </Stack>
      )}
    </BaseTemplate>
  );
};

export default MusicTemplate; 