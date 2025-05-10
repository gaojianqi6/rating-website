"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Typography,
  Box,
  Container,
  Button,
  Paper,
  Grid,
  Alert,
  Chip,
} from "@mui/material";
import { getTemplateByName } from "@/api/template";
import { searchItems } from "@/api/item";

// Define types for the data
interface Item {
  id: number;
  title: string;
  slug: string;
  poster: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface Template {
  id: number;
  name: string;
  displayName: string;
  description: string;
  fullMarks: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number | null;
  updatedBy: number | null;
  fields: TemplateField[];
}

interface TemplateField {
  id: number;
  templateId: number;
  name: string;
  displayName: string;
  description: string;
  fieldType: string;
  isRequired: boolean;
  isSearchable: boolean;
  isFilterable: boolean;
  displayOrder: number;
  dataSourceId: number | null;
  validationRules: any | null;
  createdAt: string;
  updatedAt: string;
  dataSource: DataSource | null;
}

interface DataSource {
  id: number;
  name: string;
  sourceType: string;
  configuration: any | null;
  createdAt: string;
  updatedAt: string;
  createdBy: number | null;
  options: FilterOption[];
}

interface FilterOption {
  id: number;
  dataSourceId: number;
  value: string;
  displayText: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryPageProps {
  categoryName: string; // e.g., "movie", "book"
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categoryName }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 1,
  });
  const [sort, setSort] = useState<"date" | "score" | "popularity">("date");
  const [filters, setFilters] = useState<
    { fieldId: number; fieldValue: any[] }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [filterOptions, setFilterOptions] = useState<
    Record<number, FilterOption[]>
  >({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const templateData = await getTemplateByName(categoryName);
        setTemplate(templateData);

        const filterableFields = templateData.fields.filter(
          (field) => field.isFilterable
        );

        const options: Record<number, FilterOption[]> = {};
        filterableFields.forEach((field) => {
          if (field.name.toLowerCase().includes("year")) {
            options[field.id] = Array.from(
              { length: 2025 - 2005 + 1 },
              (_, i) => ({
                id: 2025 - i,
                dataSourceId: field.dataSourceId || 0,
                value: (2025 - i).toString(),
                displayText: (2025 - i).toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              })
            );
          } else if (field.dataSource && field.dataSource.options) {
            options[field.id] = field.dataSource.options;
          }
        });
        setFilterOptions(options);
      } catch (error) {
        console.error("Error fetching template:", error);
        setError("Failed to load category data. Please try again later.");
      }
    };

    fetchTemplate();
  }, [categoryName]);

  useEffect(() => {
    if (!template) return;

    const fetchItems = async () => {
      try {
        setError(null);
        const response = await searchItems(
          template.id,
          filters,
          sort,
          pagination.pageSize,
          pagination.page
        );
        setItems(response.items);
        setPagination(response.pagination);
      } catch (error) {
        console.error("Error fetching items:", error);
        setError("Failed to load items. Please try again later.");
      }
    };

    fetchItems();
  }, [template, filters, sort, pagination.page, pagination.pageSize]);

  const handleFilterChange = (fieldId: number, value: string) => {
    setFilters((prevFilters) => {
      const existingFilter = prevFilters.find((f) => f.fieldId === fieldId);
      const updatedFilters = existingFilter
        ? prevFilters.map((f) =>
            f.fieldId === fieldId
              ? { ...f, fieldValue: value ? [value] : [] }
              : f
          )
        : [...prevFilters, { fieldId, fieldValue: value ? [value] : [] }];

      setPagination((prev) => ({ ...prev, page: 1 }));
      return updatedFilters;
    });
  };

  const handleSortChange = (value: "date" | "score" | "popularity") => {
    setSort(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters([]);
    setSort("date");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleToggleFilters = () => {
    setIsFiltersOpen((prev) => !prev);
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <Container maxWidth="lg" className="py-4">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Paper elevation={1} sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <div className="flex align-middle">
              <Typography variant="h2" component="h1" sx={{ fontSize: "16px" }}>
                {template?.displayName ||
                  categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
              </Typography>
              <Typography
                onClick={handleResetFilters}
                variant="h2"
                component="h2"
                sx={{ fontSize: "14px", position: "relative", marginLeft: "12px", cursor: "pointer", top: "1px" }}
              >
                Reset Filters
              </Typography>
            </div>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip
                label={isFiltersOpen ? "Pack Up" : "Open Up"}
                onClick={handleToggleFilters}
                color="default"
                sx={{
                  backgroundColor: "transparent",
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {template &&
              template.fields
                .filter((field) => field.isFilterable)
                .map((field) => (
                  <Box
                    key={field.id}
                    sx={{
                      display: isFiltersOpen ? "flex" : "none",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: 0.5,
                    }}
                  >
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      <Chip
                        label={`${field.displayName}:`}
                        sx={{
                          backgroundColor: "transparent",
                          fontWeight: "medium",
                          alignSelf: "center",
                        }}
                      ></Chip>
                      <Chip
                        label="All"
                        onClick={() => handleFilterChange(field.id, "")}
                        color={
                          !filters.find((f) => f.fieldId === field.id)
                            ?.fieldValue[0]
                            ? "primary"
                            : "default"
                        }
                        sx={{
                          borderRadius: "4px",
                          backgroundColor: !filters.find(
                            (f) => f.fieldId === field.id
                          )?.fieldValue[0]
                            ? undefined
                            : "transparent",
                        }}
                      />
                      {filterOptions[field.id]?.map((option) => (
                        <Chip
                          key={option.value}
                          label={option.displayText}
                          onClick={() =>
                            handleFilterChange(field.id, option.value)
                          }
                          color={
                            filters.find((f) => f.fieldId === field.id)
                              ?.fieldValue[0] === option.value
                              ? "primary"
                              : "default"
                          }
                          sx={{
                            borderRadius: "4px",
                            backgroundColor:
                              filters.find((f) => f.fieldId === field.id)
                                ?.fieldValue[0] === option.value
                                ? undefined
                                : "transparent",
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 0.5,
              }}
            >
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                <Chip
                  label="Sort By:"
                  sx={{
                    backgroundColor: "transparent",
                    fontWeight: "medium",
                    alignSelf: "center",
                  }}
                ></Chip>
                {["date", "score", "popularity"].map((sortOption) => (
                  <Chip
                    key={sortOption}
                    label={
                      sortOption.charAt(0).toUpperCase() +
                      sortOption.slice(1).replace("_", " ")
                    }
                    onClick={() =>
                      handleSortChange(
                        sortOption as "date" | "score" | "popularity"
                      )
                    }
                    color={sort === sortOption ? "primary" : "default"}
                    sx={{
                      borderRadius: "4px",
                      backgroundColor:
                        sort === sortOption ? undefined : "transparent",
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Grid container spacing={1}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={item.id}>
            <Link href={`/item/${item.slug}`} passHref>
              <Paper
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
                className="overflow-hidden"
              >
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <Box p={1} flexGrow={1}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.createdAt}
                  </Typography>
                </Box>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 1 }}>
        <Button
          variant="contained"
          disabled={pagination.page === 1}
          onClick={() => handlePageChange(pagination.page - 1)}
          sx={{ py: 0.5, px: 1 }}
        >
          Previous
        </Button>
        <Typography variant="body1" sx={{ py: 0.5 }}>
          Page {pagination.page} of {pagination.totalPages}
        </Typography>
        <Button
          variant="contained"
          disabled={pagination.page === pagination.totalPages}
          onClick={() => handlePageChange(pagination.page + 1)}
          sx={{ py: 0.5, px: 1 }}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default CategoryPage;
