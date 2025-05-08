"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Typography,
  Box,
  Container,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Grid,
  Alert,
} from '@mui/material';
import { getTemplateByName } from '@/api/template';
import { searchItems } from '@/api/item';

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
  const [sort, setSort] = useState<'date' | 'score' | 'popularity'>('date');
  const [filters, setFilters] = useState<{ fieldId: number; fieldValue: any[] }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [filterOptions, setFilterOptions] = useState<Record<number, FilterOption[]>>({});

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const templateData = await getTemplateByName(categoryName);
        setTemplate(templateData);

        const filterableFields = templateData.fields.filter((field) => field.isFilterable);

        const options: Record<number, FilterOption[]> = {};
        filterableFields.forEach((field) => {
          if (field.name.toLowerCase().includes('year')) {
            options[field.id] = Array.from({ length: 2025 - 1950 + 1 }, (_, i) => ({
              id: i + 1950,
              dataSourceId: field.dataSourceId || 0,
              value: (1950 + i).toString(),
              displayText: (1950 + i).toString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }));
          } else if (field.dataSource && field.dataSource.options) {
            options[field.id] = field.dataSource.options;
          }
        });
        setFilterOptions(options);
      } catch (error) {
        console.error('Error fetching template:', error);
        setError('Failed to load category data. Please try again later.');
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
          pagination.page,
        );
        setItems(response.items);
        setPagination(response.pagination);
      } catch (error) {
        console.error('Error fetching items:', error);
        setError('Failed to load items. Please try again later.');
      }
    };

    fetchItems();
  }, [template, filters, sort, pagination.page, pagination.pageSize]);

  const handleFilterChange = (fieldId: number, value: string) => {
    setFilters((prevFilters) => {
      const existingFilter = prevFilters.find((f) => f.fieldId === fieldId);
      if (existingFilter) {
        return prevFilters.map((f) =>
          f.fieldId === fieldId ? { ...f, fieldValue: value ? [value] : [] } : f,
        );
      }
      return [...prevFilters, { fieldId, fieldValue: value ? [value] : [] }];
    });
  };

  const handleSortChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSort(e.target.value as 'date' | 'score' | 'popularity');
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <Container maxWidth="lg" className="py-6">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {template?.displayName || categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </Box>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center" className="flex-wrap">
          {template &&
            template.fields
              .filter((field) => field.isFilterable)
              .map((field) => (
                <Grid item xs={12} sm={6} md={3} key={field.id}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel id={`${field.name}-label`}>{field.displayName}</InputLabel>
                    <Select
                      labelId={`${field.name}-label`}
                      value={filters.find((f) => f.fieldId === field.id)?.fieldValue[0] || ''}
                      onChange={(e) => handleFilterChange(field.id, e.target.value as string)}
                      label={field.displayName}
                    >
                      <MenuItem value="">
                        <em>Select {field.displayName}</em>
                      </MenuItem>
                      {filterOptions[field.id]?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.displayText}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              ))}

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                value={sort}
                onChange={handleSortChange}
                label="Sort By"
              >
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="score">Score</MenuItem>
                <MenuItem value="popularity">Popularity</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={item.id}>
            <Link href={`/item/subject/${item.slug}`} passHref>
              <Paper
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
                className="overflow-hidden"
              >
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <Box p={2} flexGrow={1}>
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

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="contained"
          disabled={pagination.page === 1}
          onClick={() => handlePageChange(pagination.page - 1)}
        >
          Previous
        </Button>
        <Typography variant="body1">
          Page {pagination.page} of {pagination.totalPages}
        </Typography>
        <Button
          variant="contained"
          disabled={pagination.page === pagination.totalPages}
          onClick={() => handlePageChange(pagination.page + 1)}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default CategoryPage;