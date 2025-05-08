import CategoryPage from '@/components/category';

export default function TVSeriesPage() {
  return (
    <CategoryPage
      templateId={2}
      dataSourceIds={[2, 7, 8, 9]} // tv_type, language, content_rating, country
      categoryName="tv_series"
    />
  );
}