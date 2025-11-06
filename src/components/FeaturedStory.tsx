import { useQuery } from "@tanstack/react-query";
import { articlesApi } from "@/lib/api";
import ArticleCard from "./ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedStory = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["articles", "featured"],
    queryFn: async () => {
      console.log('⭐ Fetching featured articles...');
      try {
        const result = await articlesApi.getFeatured(3);
        console.log('✅ Featured articles loaded:', result);
        return result;
      } catch (err) {
        console.error('❌ Error loading featured articles:', err);
        throw err;
      }
    },
    retry: 1,
  });

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <h2 className="font-display text-3xl font-bold mb-6">Featured Story</h2>
        <Skeleton className="w-full h-[400px] rounded-lg" />
      </section>
    );
  }

  if (error || !data?.success || !data.data.length) {
    return null;
  }

  const featuredArticles = data.data;

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="font-display text-3xl font-bold mb-6">Featured Story</h2>
      <div className="space-y-6">
        {featuredArticles.map((article) => (
          <ArticleCard
            key={article.id}
            slug={article.slug}
            title={article.title}
            excerpt={article.excerpt || ""}
            imageUrl={article.featuredImage || "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=1200&h=600&fit=crop"}
            category={article.category?.name || "News"}
            date={new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            author={article.author.name}
            featured
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedStory;
