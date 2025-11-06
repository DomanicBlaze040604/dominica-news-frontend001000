import React, { useMemo, useCallback } from 'react';
import { useVirtualScroll, useIntersectionObserver } from '@/utils/performanceOptimization';
import OptimizedNewsCard from './OptimizedNewsCard';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  featuredImage?: string;
  category: {
    name: string;
    slug: string;
  };
  author: {
    name: string;
  };
  publishedAt: string;
}

interface VirtualizedArticleListProps {
  articles: Article[];
  itemHeight?: number;
  containerHeight?: number;
  className?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

/**
 * Virtualized article list for optimal performance with large datasets
 */
const VirtualizedArticleList: React.FC<VirtualizedArticleListProps> = ({
  articles,
  itemHeight = 320, // Approximate height of a news card
  containerHeight = 600,
  className = "",
  onLoadMore,
  hasMore = false,
  loading = false
}) => {
  // Use virtual scrolling for performance
  const {
    startIndex,
    endIndex,
    items: visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  } = useVirtualScroll(articles, itemHeight, containerHeight);

  // Intersection observer for infinite loading
  const { isIntersecting, elementRef } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });

  // Load more articles when intersection is detected
  React.useEffect(() => {
    if (isIntersecting && hasMore && !loading && onLoadMore) {
      onLoadMore();
    }
  }, [isIntersecting, hasMore, loading, onLoadMore]);

  // Memoize the visible article items
  const renderedItems = useMemo(() => {
    return visibleItems.map((article, index) => (
      <div
        key={article.id}
        style={{
          position: 'absolute',
          top: (startIndex + index) * itemHeight,
          left: 0,
          right: 0,
          height: itemHeight
        }}
        className="px-2 pb-4"
      >
        <OptimizedNewsCard
          id={article.id}
          title={article.title}
          excerpt={article.excerpt}
          slug={article.slug}
          featuredImage={article.featuredImage}
          category={article.category}
          author={article.author}
          publishedAt={article.publishedAt}
          className="h-full"
        />
      </div>
    ));
  }, [visibleItems, startIndex, itemHeight]);

  // Loading indicator component
  const LoadingIndicator = useCallback(() => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span className="ml-2 text-muted-foreground">Loading more articles...</span>
    </div>
  ), []);

  return (
    <div className={`relative ${className}`}>
      {/* Virtual scroll container */}
      <div
        className="overflow-auto"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        <div
          className="relative"
          style={{ height: totalHeight }}
        >
          {renderedItems}
        </div>
        
        {/* Infinite loading trigger */}
        {hasMore && (
          <div ref={elementRef} className="h-20">
            {loading && <LoadingIndicator />}
          </div>
        )}
      </div>

      {/* Empty state */}
      {articles.length === 0 && !loading && (
        <div className="flex items-center justify-center p-8 text-center">
          <div>
            <h3 className="text-lg font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground">
              There are no articles to display at the moment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(VirtualizedArticleList);