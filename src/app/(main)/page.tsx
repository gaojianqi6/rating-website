"use client";
import { getProfile } from "@/api/user";
import { getTemplates } from "@/api/template";
import { fetchRecommendationsByTemplate, RecommendationItem } from "@/api/item";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  Typography,
  Box,
  Container,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Stack,
} from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { MENU_ITEMS, MenuItem } from "@/constants/menu";

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
  const [templateRecommendations, setTemplateRecommendations] = useState<TemplateRecommendations[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile and templates
        const [, templates] = await Promise.all([
          getProfile(),
          getTemplates() as Promise<Template[]>
        ]);

        // Fetch recommendations for each template
        const recommendationsPromises = templates.map(async (template: Template) => {
          const recommendations = await fetchRecommendationsByTemplate(template.id);
          const menuItem = MENU_ITEMS.find(item => item.name === template.name.toLowerCase()) || {
            name: template.name,
            displayName: template.displayName,
            recommendTitle: template.displayName,
            icon: null,
            order: 999
          };
          
          return {
            template,
            recommendations,
            menuItem
          };
        });

        const allRecommendations = await Promise.all(recommendationsPromises);
        // Sort recommendations based on menu item order
        const sortedRecommendations = allRecommendations.sort((a, b) => a.menuItem.order - b.menuItem.order);
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
          justifyContent: "center" 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
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
                  color: "primary.main"
                }} 
              />
            )}
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                fontSize: 16
              }}
            >
              {templateRec.menuItem?.recommendTitle || templateRec.template.displayName}
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
                1280: { slidesPerView: 8, spaceBetween: 12 }
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
                      <CardMedia
                        component="img"
                        height={140}
                        image={rec.poster || "/placeholder.jpg"}
                        alt={rec.title}
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
                            fontSize: 11
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
  );
}
