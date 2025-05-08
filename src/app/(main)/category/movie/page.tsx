import CategoryPage from '@/components/category';

export default function MoviePage() {
  return (
    <CategoryPage
      templateId={1}
      dataSourceIds={[1, 7, 8, 9]} // movie_type, language, content_rating, country
      categoryName="movie"
    />
  );
}