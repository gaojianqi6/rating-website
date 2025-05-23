import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Typography, Box, Card, CardContent, Rating } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { RecommendationItem } from "@/api/item";

interface RecommendationsProps {
  title?: string;
  recommendations: RecommendationItem[];
  templateName: string;
  swiperNavigationClass: string;
  cardWidth?: number;
  recommendationsType?: "home" | "item";
}

// Helper function to get aspect ratio by template name
const getAspectRatio = (templateName: string) => {
  switch (templateName.toLowerCase()) {
    case "movie":
    case "tv series":
      return 2 / 3;
    case "variety show":
      return 0.68;
    case "book":
      return 0.65;
    case "music":
    case "podcast":
      return 1;
    default:
      return 2 / 3;
  }
};

const Recommendations: React.FC<RecommendationsProps> = ({
  title = "",
  recommendations,
  templateName,
  swiperNavigationClass,
  cardWidth = 140,
  recommendationsType = "home",
}) => {
  if (!recommendations || recommendations.length === 0) {
    return <Typography>No recommendations available.</Typography>;
  }
  const aspectRatio = getAspectRatio(templateName);
  const imageHeight = Math.round(cardWidth / aspectRatio);
  const contentMinHeight = 80;
  const cardHeight = imageHeight + contentMinHeight;

  return (
    <Box sx={{ mt: 1 }}>
      {title && (
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main", pl: 0 }}
        >
          {title}
        </Typography>
      )}
      <Swiper
        modules={[Navigation, Mousewheel]}
        spaceBetween={10}
        slidesPerView={2}
        breakpoints={{
          480: { slidesPerView: 3, spaceBetween: 10 },
          640: { slidesPerView: 4, spaceBetween: 10 },
          768: { slidesPerView: 5, spaceBetween: 10 },
          1024: { slidesPerView: 6, spaceBetween: 12 },
          1280: { slidesPerView: recommendationsType === "home" ? 8 : 6, spaceBetween: 12 },
        }}
        navigation={{
          prevEl: `.swiper-button-prev-${swiperNavigationClass}`,
          nextEl: `.swiper-button-next-${swiperNavigationClass}`,
          disabledClass: "swiper-button-disabled",
          hiddenClass: "swiper-button-hidden",
        }}
        mousewheel={{ forceToAxis: true }}
        style={{ padding: "10px 0px", position: "relative" }}
      >
        {recommendations.map((rec, index) => (
          <SwiperSlide
            key={rec.id}
            style={{ paddingLeft: index === 0 ? 0 : undefined }}
          >
            <Link href={`/item/subject/${rec.slug}`}>
              <Card
                sx={{
                  maxWidth: "100%",
                  height: cardHeight,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 6,
                  },
                  borderRadius: 1,
                }}
              >
                <ImageWithPlaceholder
                  src={rec.poster}
                  fallbackSrc="/placeholder.svg"
                  alt={rec.title}
                  height={imageHeight}
                  sx={{
                    objectFit: "cover",
                    width: "100%",
                    minHeight: imageHeight,
                    maxHeight: imageHeight,
                  }}
                />
                <CardContent
                  sx={{
                    p: 1,
                    pb: "8px !important",
                    flex: 1,
                    display: "block",
                    minHeight: contentMinHeight,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "medium",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      fontSize: 13,
                      lineHeight: 1.2,
                      minHeight: 18,
                    }}
                  >
                    {rec.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "block",
                      mt: 0.5,
                      fontSize: 11,
                    }}
                  >
                    {new Date(rec.createdAt).toLocaleDateString()}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                    <Rating
                      value={rec.avgRating / 2}
                      precision={0.5}
                      size="small"
                      readOnly
                      sx={{ fontSize: 14 }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 0.5, fontSize: 11 }}
                    >
                      {rec.avgRating.toFixed(1)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Link>
          </SwiperSlide>
        ))}
        <Box
          className={`swiper-button-prev-${swiperNavigationClass}`}
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            width: 28,
            height: 28,
            backgroundColor: "rgba(128, 128, 128, 0.5)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            cursor: "pointer",
            "&:after": {
              content: "none",
            },
            "&.swiper-button-disabled": {
              display: "none",
            },
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 12, color: "white" }} />
        </Box>
        <Box
          className={`swiper-button-next-${swiperNavigationClass}`}
          sx={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            width: 28,
            height: 28,
            backgroundColor: "rgba(128, 128, 128, 0.5)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            cursor: "pointer",
            "&:after": {
              content: "none",
            },
            "&.swiper-button-disabled": {
              display: "none",
            },
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: 12, color: "white" }} />
        </Box>
      </Swiper>
    </Box>
  );
};

export default Recommendations;
