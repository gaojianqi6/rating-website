import CategoryPage from '@/components/category';

export default function MusicPage() {
  return (
    <CategoryPage
      templateId={5}
      dataSourceIds={[5, 7, 8, 9]} // music_type, language, content_rating, country
      categoryName="music"
    />
  );
}