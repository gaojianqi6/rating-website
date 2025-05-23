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
  CircularProgress,
  Stack,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { MENU_ITEMS, MenuItem } from "@/constants/menu";
import Image from "next/image";
import Recommendations from "@/components/items/Recommendations";

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
      <Box sx={{ width: "100%", overflow: "hidden", bgcolor: "black" }}>
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
            <Recommendations
              recommendations={templateRec.recommendations}
              templateName={templateRec.template.displayName || templateRec.template.name}
              swiperNavigationClass={templateRec.template.name}
            />
          </Box>
        ))}
      </Container>
    </Box>
  );
}
