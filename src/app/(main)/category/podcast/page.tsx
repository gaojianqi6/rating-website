import CategoryPage from '@/components/category';

export default function PodcastPage() {
  return (
    <CategoryPage
      templateId={6}
      dataSourceIds={[6, 7, 8, 9]} // podcast_type, language, content_rating, country
      categoryName="podcast"
    />
  );
}