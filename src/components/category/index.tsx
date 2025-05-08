"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { searchItems } from '@/api/item';
import { getTemplateByName } from '@/api/template';

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

        // Filter fields where isFilterable is true
        const filterableFields = templateData.fields.filter((field) => field.isFilterable);

        // Generate filter options
        const options: Record<number, FilterOption[]> = {};
        filterableFields.forEach((field) => {
          if (field.name.toLowerCase().includes('year')) {
            // Special case for release_year: generate years 1950-2025
            options[field.id] = Array.from({ length: 2025 - 1950 + 1 }, (_, i) => ({
              id: i + 1950,
              dataSourceId: field.dataSourceId || 0,
              value: (1950 + i).toString(),
              displayText: (1950 + i).toString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }));
          } else if (field.dataSource && field.dataSource.options) {
            // Use dataSource options for other fields
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

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value as 'date' | 'score' | 'popularity');
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        {template?.displayName || categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
      </h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="mb-4 flex flex-wrap gap-4">
        {template &&
          template.fields
            .filter((field) => field.isFilterable)
            .map((field) => (
              <select
                key={field.id}
                className="border p-2 rounded"
                onChange={(e) => handleFilterChange(field.id, e.target.value)}
                defaultValue=""
              >
                <option value="">Select {field.displayName}</option>
                {filterOptions[field.id]?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.displayText}
                  </option>
                ))}
              </select>
            ))}

        <select
          className="border p-2 rounded"
          onChange={handleSortChange}
          value={sort}
        >
          <option value="date">Sort by Date</option>
          <option value="score">Sort by Score</option>
          <option value="popularity">Sort by Popularity</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <Link href={`/item/${item.slug}`} key={item.id}>
            <div className="border rounded overflow-hidden shadow hover:shadow-lg transition">
              <img
                src={item.poster}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-2">
                <h3 className="text-lg font-semibold truncate">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.createdAt}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 mx-1 border rounded disabled:opacity-50"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          className="px-4 py-2 mx-1 border rounded disabled:opacity-50"
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CategoryPage;