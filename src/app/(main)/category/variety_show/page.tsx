import CategoryPage from '@/components/category';

export default function VarietyShowPage() {
  return (
    <CategoryPage
      templateId={3}
      dataSourceIds={[3, 7, 8, 9]} // show_type, language, content_rating, country
      categoryName="variety_show"
    />
  );
}