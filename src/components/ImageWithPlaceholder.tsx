import { useState, useEffect } from "react";
import CardMedia from "@mui/material/CardMedia";
import { SxProps, Theme } from "@mui/material";

interface ImageWithPlaceholderProps {
  src?: string;
  fallbackSrc: string;
  alt: string;
  height: number | string;
  sx?: SxProps<Theme>;
}

export const ImageWithPlaceholder = ({
  src,
  fallbackSrc,
  alt,
  height,
  sx,
}: ImageWithPlaceholderProps) => {
  const [imageSrc, setImageSrc] = useState(fallbackSrc); // Start with fallback
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!src) {
      setImageSrc(fallbackSrc);
      setLoading(false);
      return;
    }

    // Create a new Image object to preload the image
    const img = new Image();
    img.src = src;

    // On successful load, update the image source
    img.onload = () => {
      setImageSrc(src);
      setLoading(false);
    };

    // On error, use the fallback image
    img.onerror = () => {
      setImageSrc(fallbackSrc);
      setLoading(false);
    };

    // Cleanup on unmount
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc]);

  return (
    <CardMedia
      component="img"
      height={height}
      image={imageSrc}
      alt={alt}
      sx={{
        ...sx,
        transition: "opacity 0.3s ease-in-out",
        opacity: loading ? 0.5 : 1,
      }}
    />
  );
};

export default ImageWithPlaceholder; 