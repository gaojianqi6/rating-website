import CategoryPage from '@/components/category';

export default function BookPage() {
  return (
    <CategoryPage
      templateId={4}
      dataSourceIds={[4, 7, 8, 9]} // book_type, language, content_rating, country
      categoryName="book"
    />
  );
}