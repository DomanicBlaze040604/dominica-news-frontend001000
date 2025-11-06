import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LazyImage } from "@/components/LazyImage";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { useOptimizedCallback } from "@/utils/performanceOptimization";

interface OptimizedNewsCardProps {
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
  className?: string;
}

/**
 * Optimized NewsCard component with memoization and performance optimizations
 */
const OptimizedNewsCard: React.FC<OptimizedNewsCardProps> = React.memo(({
  id,
  title,
  excerpt,
  slug,
  featuredImage,
  category,
  author,
  publishedAt,
  className = ""
}) => {
  // Memoize the formatted date to prevent recalculation on every render
  const formattedDate = React.useMemo(() => {
    try {
      return formatDistanceToNow(new Date(publishedAt), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  }, [publishedAt]);

  // Memoize the article URL
  const articleUrl = React.useMemo(() => `/articles/${slug}`, [slug]);
  const categoryUrl = React.useMemo(() => `/category/${category.slug}`, [category.slug]);

  // Optimized click handlers
  const handleCardClick = useOptimizedCallback((e: React.MouseEvent) => {
    // Allow default link behavior, no additional logic needed
  }, []);

  const handleCategoryClick = useOptimizedCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking category
  }, []);

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}>
      <Link to={articleUrl} onClick={handleCardClick} className="block">
        <CardContent className="p-0">
          {featuredImage && (
            <div className="relative overflow-hidden rounded-t-lg">
              <LazyImage
                src={featuredImage}
                alt={title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute top-3 left-3">
                <Link 
                  to={categoryUrl} 
                  onClick={handleCategoryClick}
                  className="inline-block"
                >
                  <Badge 
                    variant="secondary" 
                    className="bg-white/90 text-primary hover:bg-white transition-colors"
                  >
                    {category.name}
                  </Badge>
                </Link>
              </div>
            </div>
          )}
          
          <div className="p-4">
            {!featuredImage && (
              <div className="mb-3">
                <Link 
                  to={categoryUrl} 
                  onClick={handleCategoryClick}
                  className="inline-block"
                >
                  <Badge variant="outline" className="hover:bg-primary hover:text-white transition-colors">
                    {category.name}
                  </Badge>
                </Link>
              </div>
            )}
            
            <h3 className="article-title text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
            
            <p className="article-excerpt text-muted-foreground mb-3 line-clamp-2">
              {excerpt}
            </p>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="author-name">By {author.name}</span>
              <time className="article-meta" dateTime={publishedAt}>
                {formattedDate}
              </time>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
});

// Add display name for debugging
OptimizedNewsCard.displayName = 'OptimizedNewsCard';

// Custom comparison function for React.memo
const arePropsEqual = (
  prevProps: OptimizedNewsCardProps, 
  nextProps: OptimizedNewsCardProps
): boolean => {
  // Compare primitive values
  if (
    prevProps.id !== nextProps.id ||
    prevProps.title !== nextProps.title ||
    prevProps.excerpt !== nextProps.excerpt ||
    prevProps.slug !== nextProps.slug ||
    prevProps.featuredImage !== nextProps.featuredImage ||
    prevProps.publishedAt !== nextProps.publishedAt ||
    prevProps.className !== nextProps.className
  ) {
    return false;
  }

  // Compare nested objects
  if (
    prevProps.category.name !== nextProps.category.name ||
    prevProps.category.slug !== nextProps.category.slug ||
    prevProps.author.name !== nextProps.author.name
  ) {
    return false;
  }

  return true;
};

export default React.memo(OptimizedNewsCard, arePropsEqual);