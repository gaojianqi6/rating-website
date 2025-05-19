"use client";
import { getTemplates } from "@/api/template";
import { fetchRecommendationsByTemplate, RecommendationItem } from "@/api/item";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Mousewheel,
  Autoplay,
  Pagination,
  EffectFade,
  Keyboard,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import {
  Typography,
  Box,
  Container,
  Card,
  CardContent,
  CircularProgress,
  Stack,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { MENU_ITEMS, MenuItem } from "@/constants/menu";
import Image from "next/image";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";

// Temporary banner data - replace slugs later
const BANNERS = [
  { id: 1, image: "/banners/01.webp", slug: "the-mandalorian", width: 2880, height: 1620, alt: "The Mandalorian" },
  { id: 2, image: "/banners/02.webp", slug: "star-wars-the-force-awakens", width: 1920, height: 1080, alt: "Star wars: The force awakens" },
  { id: 3, image: "/banners/03.webp", slug: "star-wars-the-last-jedi", width: 1920, height: 1080, alt: "Star wars: The last jedi" },
  { id: 4, image: "/banners/04.webp", slug: "the-empire-strikes-back", width: 1920, height: 1080, alt: "Star wars: The empire strikes back" },
  { id: 5, image: "/banners/05.webp", slug: "return-of-the-jedi", width: 1920, height: 1080, alt: "Star wars: Return of the jedi" },
];

interface Template {
  id: number;
  name: string;
  displayName: string;
  description: string;
  fullMarks: number;
}

interface TemplateRecommendations {
  template: Template;
  recommendations: RecommendationItem[];
  menuItem: MenuItem;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [templateRecommendations, setTemplateRecommendations] = useState<
    TemplateRecommendations[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile and templates
        const templates = await getTemplates() as Template[];

        // Fetch recommendations for each template
        const recommendationsPromises = templates.map(
          async (template: Template) => {
            const recommendations = await fetchRecommendationsByTemplate(
              template.id
            );
            const menuItem = MENU_ITEMS.find(
              (item) => item.name === template.name.toLowerCase()
            ) || {
              name: template.name,
              displayName: template.displayName,
              recommendTitle: template.displayName,
              icon: null,
              order: 999,
            };

            return {
              template,
              recommendations,
              menuItem,
            };
          }
        );

        const allRecommendations = await Promise.all(recommendationsPromises);
        // Sort recommendations based on menu item order
        const sortedRecommendations = allRecommendations.sort(
          (a, b) => a.menuItem.order - b.menuItem.order
        );
        setTemplateRecommendations(sortedRecommendations);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Banner Section */}
      <Box sx={{ width: "100%", overflow: "hidden", mb: 4, bgcolor: "black" }}>
        <Swiper
          modules={[Navigation, Autoplay, Pagination, EffectFade, Mousewheel, Keyboard]}
          spaceBetween={0}
          slidesPerView={1}
          effect="fade"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 1,
          }}
          keyboard={{
            enabled: true,
          }}
          pagination={{
            clickable: true,
            bulletActiveClass: "swiper-pagination-bullet-active",
            bulletClass: "swiper-pagination-bullet",
          }}
          navigation={{
            prevEl: ".swiper-button-prev-banner",
            nextEl: ".swiper-button-next-banner",
            disabledClass: "swiper-button-disabled",
            hiddenClass: "swiper-button-hidden",
          }}
          style={{ 
            width: "100%",
          }}
        >
          {BANNERS.map((banner) => (
            <SwiperSlide key={banner.id}>
              <Link href={`/item/subject/${banner.slug}`}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: { 
                      xs: "240px", 
                      sm: "360px", 
                      md: "480px", 
                      lg: "600px" 
                    },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    "&:hover": {
                      "& > .banner-overlay": {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <Image
                    src={banner.image}
                    alt={`Banner ${banner.id}`}
                    width={banner.width}
                    height={banner.height}
                    priority={banner.id === 1}
                    quality={90}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                  <Box
                    className="banner-overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    }}
                  />
                </Box>
              </Link>
            </SwiperSlide>
          ))}
          <Box
            className="swiper-button-prev-banner"
            sx={{
              position: "absolute",
              top: "50%",
              left: { xs: 8, sm: 16 },
              transform: "translateY(-50%)",
              width: { xs: 32, sm: 40 },
              height: { xs: 32, sm: 40 },
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              cursor: "pointer",
              backdropFilter: "blur(4px)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.5)",
              },
              "&:after": {
                content: "none",
              },
              "&.swiper-button-disabled": {
                opacity: 0,
              },
            }}
          >
            <ArrowBackIosNewIcon
              sx={{ fontSize: { xs: 16, sm: 20 }, color: "white" }}
            />
          </Box>
          <Box
            className="swiper-button-next-banner"
            sx={{
              position: "absolute",
              top: "50%",
              right: { xs: 8, sm: 16 },
              transform: "translateY(-50%)",
              width: { xs: 32, sm: 40 },
              height: { xs: 32, sm: 40 },
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              cursor: "pointer",
              backdropFilter: "blur(4px)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.5)",
              },
              "&:after": {
                content: "none",
              },
              "&.swiper-button-disabled": {
                opacity: 0,
              },
            }}
          >
            <ArrowForwardIosIcon
              sx={{ fontSize: { xs: 16, sm: 20 }, color: "white" }}
            />
          </Box>
        </Swiper>
      </Box>

      {/* Recommendations Sections */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {templateRecommendations.map((templateRec) => (
          <Box key={templateRec.template.id} sx={{ mb: 3 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              {templateRec.menuItem?.icon && (
                <templateRec.menuItem.icon
                  sx={{
                    fontSize: 16,
                    color: "primary.main",
                  }}
                />
              )}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  fontSize: 16,
                }}
              >
                {templateRec.menuItem?.recommendTitle ||
                  templateRec.template.displayName}
              </Typography>
            </Stack>
            {templateRec.recommendations.length === 0 ? (
              <Typography>No recommendations available.</Typography>
            ) : (
              <Swiper
                modules={[Navigation, Mousewheel]}
                spaceBetween={8}
                slidesPerView={3}
                breakpoints={{
                  640: { slidesPerView: 4, spaceBetween: 10 },
                  768: { slidesPerView: 5, spaceBetween: 10 },
                  1024: { slidesPerView: 6, spaceBetween: 12 },
                  1280: { slidesPerView: 8, spaceBetween: 12 },
                }}
                navigation={{
                  prevEl: `.swiper-button-prev-${templateRec.template.name}`,
                  nextEl: `.swiper-button-next-${templateRec.template.name}`,
                  disabledClass: "swiper-button-disabled",
                  hiddenClass: "swiper-button-hidden",
                }}
                mousewheel={{ forceToAxis: true }}
                style={{ padding: "8px 0px", position: "relative" }}
              >
                {templateRec.recommendations.map((rec) => (
                  <SwiperSlide key={rec.id}>
                    <Link href={`/item/subject/${rec.slug}`}>
                      <Card
                        sx={{
                          maxWidth: "100%",
                          transition: "transform 0.3s, box-shadow 0.3s",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: 6,
                          },
                          borderRadius: 1,
                          height: "100%",
                        }}
                      >
                        <ImageWithPlaceholder
                          src={rec.poster}
                          fallbackSrc="/placeholder.svg"
                          alt={rec.title}
                          height={140}
                          sx={{ objectFit: "cover" }}
                        />
                        <CardContent sx={{ p: 1, pb: "8px !important" }}>
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
                        </CardContent>
                      </Card>
                    </Link>
                  </SwiperSlide>
                ))}
                <Box
                  className={`swiper-button-prev-${templateRec.template.name}`}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    transform: "translateY(-50%)",
                    width: 20,
                    height: 20,
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
                  className={`swiper-button-next-${templateRec.template.name}`}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: 0,
                    transform: "translateY(-50%)",
                    width: 20,
                    height: 20,
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
            )}
          </Box>
        ))}
      </Container>
    </Box>
  );
}
