import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import NewsCard from "@/components/NewsCard";
import { MetaTags } from "@/components/MetaTags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { articlesService } from "../services/articles";
import { categoriesService } from "../services/categories";
import { useSiteSetting } from "../hooks/useSiteSettings";
import { useHomepageLayout } from "../hooks/useHomepageLayout";
import FeaturedSectionCards from "../components/FeaturedSectionCards";
import FeaturedSectionSingle from "../components/FeaturedSectionSingle";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { BreakingNewsTicker } from "../components/BreakingNewsTicker";
import { EmptyState, LoadingFallback, NetworkFallback } from "../components/FallbackContent";
import { SocialMediaSection } from "../components/SocialMediaSection";
import { Search, X } from "lucide-react";

const Index = () => {
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Homepage layout configuration
  const { orderedSections, getSection } = useHomepageLayout();

  // Update local search when URL changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Fetch pinned articles for featured section
  const { data: pinnedData, isLoading: isLoadingPinned } = useQuery({
    queryKey: ['pinned-articles'],
    queryFn: () => articlesService.getPinnedArticles(3),
    enabled: !searchQuery, // Only fetch when not searching
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch latest articles
  const { data: latestData, isLoading: isLoadingLatest, error: articlesError } = useQuery({
    queryKey: ['latest-articles', { page, limit: 9, search: searchQuery }],
    queryFn: async () => {
      if (searchQuery) {
        return articlesService.getPublishedArticles({ page, limit: 9 });
      } else {
        return articlesService.getLatestArticles({ limit: 9, excludePinned: true });
      }
    },
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getCategories,
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch featured section layout setting
  const { data: layoutSetting } = useSiteSetting('featured_section_layout');

  const pinnedArticles = pinnedData?.data?.articles || pinnedData?.data || [];
  const latestArticles = (latestData as any)?.data?.articles || (latestData as any)?.data || [];
  const categories = categoriesData?.data?.categories || categoriesData?.data || [];
  const pagination = (latestData as any)?.data?.pagination;
  
  // Get section configurations
  const latestNewsSection = getSection('latest-news');
  const featuredStoriesSection = getSection('featured-stories');
  const socialMediaSection = getSection('social-media');
  const categoriesSection = getSection('categories');

  // Determine layout type - default to 'single' if not set, or use section config
  const layoutType = featuredStoriesSection?.config?.layout || layoutSetting?.data?.value || 'single';

  // Use pinned articles for featured section, fallback to latest
  const featuredArticles = searchQuery ? latestArticles : pinnedArticles;
  const isLoadingArticles = searchQuery ? isLoadingLatest : (isLoadingPinned || isLoadingLatest);

  // Search functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      setSearchParams({ search: localSearchQuery.trim() });
      setPage(1);
    }
  };

  const clearSearch = () => {
    setLocalSearchQuery('');
    setSearchParams({});
    setPage(1);
  };

  // Filter articles based on search query (client-side filtering for now)
  const filteredArticles = searchQuery 
    ? latestArticles.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : latestArticles;
  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags for Homepage */}
      <MetaTags />
      <Header>
        <Navbar />
      </Header>
      
      {/* Breaking News Ticker - Positioned prominently at top */}
      <BreakingNewsTicker className="sticky top-0 z-40" />
      
      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        {searchQuery && (
          <section className="mb-8 animate-fade-in">
            <div className="bg-muted/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Search Results for "{searchQuery}"
                </h2>
                <Button variant="ghost" size="sm" onClick={clearSearch}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Search
                </Button>
              </div>
              <p className="text-muted-foreground">
                Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
              </p>
            </div>
          </section>
        )}

        {/* Search Bar (Alternative) */}
        <section className="mb-8 animate-fade-in">
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
        </section>

        {/* Latest News Section - Primary content section positioned prominently */}
        {latestNewsSection?.visible && (
          <section className="mb-16 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-5xl font-headline font-black text-foreground mb-2">
                  {searchQuery ? 'Search Results' : (latestNewsSection.title || 'Latest News')}
                </h2>
                <div className="w-24 h-1 bg-primary rounded-full"></div>
                <p className="text-muted-foreground mt-2 text-lg">
                  {searchQuery 
                    ? `Search results for "${searchQuery}"` 
                    : (latestNewsSection.description || 'Stay informed with the most recent news from Dominica')
                  }
                </p>
              </div>
            {!searchQuery && pagination && pagination.totalPages > 1 && (
              <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                View All
              </Button>
            )}
          </div>
          
          {/* Responsive grid layout optimized for latest news priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {isLoadingArticles ? (
              <div className="col-span-full">
                <LoadingFallback 
                  type="article" 
                  message="Loading latest news..." 
                  size="medium"
                />
              </div>
            ) : articlesError ? (
              <div className="col-span-full">
                <NetworkFallback
                  title="Failed to Load Articles"
                  description="Unable to load the latest news. Please check your connection and try again."
                  onRetry={() => window.location.reload()}
                />
              </div>
            ) : filteredArticles.length > 0 ? (
              (searchQuery ? filteredArticles : latestArticles.slice(0, latestNewsSection?.config?.articlesCount || 6)).map((article, index) => (
                <NewsCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  excerpt={article.excerpt || ''}
                  image={article.featuredImage || ''}
                  imageAlt={article.featuredImageAlt}
                  category={article.category?.name || 'Uncategorized'}
                  date={article.publishedAt || article.createdAt}
                  slug={article.slug}
                  author={article.author}
                  featured={index === 0} // Make first article featured for better hierarchy
                  animationDelay={100 * (index + 1)}
                />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState
                  type={searchQuery ? "search" : "articles"}
                  title={searchQuery ? `No results for "${searchQuery}"` : "No Articles Available"}
                  description={searchQuery 
                    ? "Try different keywords or browse our categories to find what you're looking for."
                    : "Check back later for the latest news and updates from Dominica."
                  }
                  actionLabel={searchQuery ? "Clear Search" : "Browse Categories"}
                  onAction={searchQuery ? clearSearch : undefined}
                  actionHref={searchQuery ? undefined : "/"}
                />
              </div>
            )}
          </div>

          {/* Load More Button - Only show if not searching and enabled in config */}
          {!searchQuery && latestNewsSection?.config?.showLoadMore && pagination && pagination.hasNextPage && (
            <div className="text-center mt-12">
              <Button
                onClick={() => setPage(page + 1)}
                variant="outline"
                size="lg"
                className="hover:bg-primary hover:text-primary-foreground transition-colors px-8 py-3"
              >
                Load More Articles
              </Button>
            </div>
          )}
        </section>
        )}

        {/* Featured Stories Section - Secondary content section positioned below Latest News */}
        {!searchQuery && featuredStoriesSection?.visible && (
          <section className="mb-16 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="mb-8">
              <h2 className="text-4xl font-headline font-bold text-foreground mb-2">
                {featuredStoriesSection.title || 'Featured Stories'}
              </h2>
              <div className="w-20 h-1 bg-secondary rounded-full"></div>
              <p className="text-muted-foreground mt-2">
                {featuredStoriesSection.description || 'Editor\'s picks and highlighted content'}
              </p>
            </div>
            <div className="mt-8">
              {articlesError ? (
                <NetworkFallback
                  title="Featured Stories Unavailable"
                  description="Unable to load featured stories at the moment. Please try again later."
                  onRetry={() => window.location.reload()}
                  showSearch={false}
                />
              ) : layoutType === 'cards' ? (
                <FeaturedSectionCards 
                  articles={featuredArticles} 
                  isLoading={isLoadingPinned} 
                />
              ) : (
                <FeaturedSectionSingle 
                  articles={featuredArticles} 
                  isLoading={isLoadingPinned} 
                />
              )}
            </div>
          </section>
        )}



        {/* Social Media Section */}
        {socialMediaSection?.visible && (
          <div className="mt-12 bg-primary/5 rounded-lg animate-fade-in-up" style={{ animationDelay: "250ms" }}>
            <SocialMediaSection
              title={socialMediaSection.title || 'Follow Us On'}
              description={socialMediaSection.description || 'Stay connected with us on social media for the latest updates and breaking news'}
              layout="horizontal"
              variant="default"
            />
          </div>
        )}

        {/* Categories Quick Access */}
        {categoriesSection?.visible && (
          <section className="mt-12 py-8 bg-secondary/30 rounded-lg animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-headline font-bold text-foreground mb-2">
                {categoriesSection.title || 'Explore by Category'}
              </h2>
              <p className="text-muted-foreground">
                {categoriesSection.description || 'Stay informed with news from across Dominica and the world'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto px-4">
              {(Array.isArray(categories) ? categories : []).slice(0, categoriesSection?.config?.articlesCount || 8).map((category) => (
              <Button
                key={category.id}
                variant="outline"
                className="h-20 text-lg font-semibold hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link to={`/category/${category.slug}`}>
                  {category?.name || 'Unknown Category'}
                </Link>
              </Button>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
