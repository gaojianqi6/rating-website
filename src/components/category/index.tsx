"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { searchItems, fetchDataSources, DataSource, FilterOption } from '@/api/item';

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

interface CategoryPageProps {
  templateId: number;
  dataSourceIds: number[]; // Array of data source IDs to fetch (e.g., [1,7,8,9] for movie)
  categoryName: string; // e.g., "movie", "tv_series"
}

const CategoryPage: React.FC<CategoryPageProps> = ({
  templateId,
  dataSourceIds,
  categoryName,
}) => {
  // State for items, filters, sorting, and pagination
  const [items, setItems] = useState<Item[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 1,
  });
  const [sort, setSort] = useState<'date' | 'score' | 'popularity'>('date');
  const [filters, setFilters] = useState<{ fieldId: number; fieldValue: any[] }[]>([]);

  // State for filter options
  const [typeOptions, setTypeOptions] = useState<FilterOption[]>([]);
  const [languageOptions, setLanguageOptions] = useState<FilterOption[]>([]);
  const [contentRatingOptions, setContentRatingOptions] = useState<FilterOption[]>([]);
  const [countryOptions, setCountryOptions] = useState<FilterOption[]>([]);

  // Fetch filter options when the component mounts
  useEffect(() => {
    const fetchFilterOptionsData = async () => {
      try {
        const dataSources = await fetchDataSources(dataSourceIds);

        // Map data sources to their respective filter options
        dataSources.forEach((ds: DataSource) => {
          switch (ds.id) {
            case 1: // movie_type
            case 2: // tv_type
            case 3: // show_type
            case 4: // book_type
            case 5: // music_type
            case 6: // podcast_type
              setTypeOptions(ds.options);
              break;
            case 7: // language
              setLanguageOptions(ds.options);
              break;
            case 8: // content_rating
              setContentRatingOptions(ds.options);
              break;
            case 9: // country
              setCountryOptions(ds.options);
              break;
            default:
              break;
          }
        });
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilterOptionsData();
  }, [dataSourceIds]);

  // Fetch items based on filters, sorting, and pagination
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await searchItems(
          templateId,
          filters,
          sort,
          pagination.pageSize,
          pagination.page,
        );
        setItems(response.items);
        setPagination(response.pagination);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, [templateId, filters, sort, pagination.page, pagination.pageSize]);

  // Handle filter changes
  const handleFilterChange = (fieldId: number, value: string) => {
    setFilters((prevFilters) => {
      const existingFilter = prevFilters.find((f) => f.fieldId === fieldId);
      if (existingFilter) {
        return prevFilters.map((f) =>
          f.fieldId === fieldId
            ? { ...f, fieldValue: value ? [value] : [] }
            : f,
        );
      }
      return [...prevFilters, { fieldId, fieldValue: value ? [value] : [] }];
    });
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value as 'date' | 'score' | 'popularity');
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
      </h1>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4">
        {/* Type filter (movie_type, tv_type, etc.) */}
        {typeOptions.length > 0 && (
          <select
            className="border p-2 rounded"
            onChange={(e) => handleFilterChange(dataSourceIds[0], e.target.value)} // Use the first dataSourceId (e.g., 1 for movie_type)
            defaultValue=""
          >
            <option value="">Select Type</option>
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.displayText}
              </option>
            ))}
          </select>
        )}

        {/* Language filter */}
        {languageOptions.length > 0 && (
          <select
            className="border p-2 rounded"
            onChange={(e) => handleFilterChange(7, e.target.value)} // dataSourceId 7 for language
            defaultValue=""
          >
            <option value="">Select Language</option>
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.displayText}
              </option>
            ))}
          </select>
        )}

        {/* Content Rating filter */}
        {contentRatingOptions.length > 0 && (
          <select
            className="border p-2 rounded"
            onChange={(e) => handleFilterChange(8, e.target.value)} // dataSourceId 8 for content_rating
            defaultValue=""
          >
            <option value="">Select Content Rating</option>
            {contentRatingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.displayText}
              </option>
            ))}
          </select>
        )}

        {/* Country filter */}
        {countryOptions.length > 0 && (
          <select
            className="border p-2 rounded"
            onChange={(e) => handleFilterChange(9, e.target.value)} // dataSourceId 9 for country
            defaultValue=""
          >
            <option value="">Select Country</option>
            {countryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.displayText}
              </option>
            ))}
          </select>
        )}

        {/* Sort dropdown */}
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

      {/* Items Grid */}
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

      {/* Pagination */}
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