import { useQuery } from "@tanstack/react-query";
import { articlesApi } from "@/lib/api";
import ArticleCard from "./ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";

const LatestNews = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["articles", "latest"],
    queryFn: async () => {
      console.log('📰 Fetching latest articles...');
      try {
        const result = await articlesApi.getAll({ limit: 12, sort: "-publishedAt", status: "published" });
        console.log('✅ Articles loaded:', result);
        return result;
      } catch (err) {
        console.error('❌ Error loading articles:', err);
        throw err;
      }
    },
    retry: 1,
  });

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <h2 className="font-display text-3xl font-bold mb-6">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="w-full h-[350px] rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  if (error || !data?.success) {
    console.error('Error details:', { error, data });
    return (
      <section className="container mx-auto px-4 py-8">
        <h2 className="font-display text-3xl font-bold mb-6">Latest News</h2>
        <div className="space-y-4">
          <p className="text-muted-foreground">Unable to load articles. Please try again later.</p>
          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              Show error details
            </summary>
            <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto">
              {error ? String(error) : 'No data received from API'}
            </pre>
          </details>
          <p className="text-xs text-muted-foreground">
            Check browser console (F12) for detailed error information
          </p>
        </div>
      </section>
    );
  }

  const articles = data.data;

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="font-display text-3xl font-bold mb-6">Latest News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            slug={article.slug}
            title={article.title}
            excerpt={article.excerpt || ""}
            imageUrl={article.featuredImage || `https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop`}
            category={article.category?.name || "News"}
            date={new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            author={article.author.name}
          />
        ))}
      </div>
    </section>
  );
};

export default LatestNews;
