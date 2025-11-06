import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "../services/categories";
import { LazyImage } from "./LazyImage";
import { cn } from "@/lib/utils";
import { ChevronDown, Clock, User } from "lucide-react";
import { useNavigationFeedback } from "../hooks/useFeedback";

interface CategoryDropdownProps {
  categorySlug: string;
  categoryName: string;
  isActive: boolean;
}

export const CategoryDropdown = ({ categorySlug, categoryName, isActive }: CategoryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const timeoutRef = useRef<number>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const articleLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const navigationFeedback = useNavigationFeedback();

  // Fetch category preview data when hovering
  const { data: previewData, isLoading, error } = useQuery({
    queryKey: ['category-preview', categorySlug],
    queryFn: () => categoriesService.getCategoryPreview(categorySlug, 5),
    enabled: isHovering, // Only fetch when hovering
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error: any) => {
      console.error('Category preview error:', error);
      navigationFeedback.showError('load category preview', 'Unable to load category preview. Please try again.');
    }
  });

  const articles = previewData?.data.articles || [];

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovering(true);
    // Add a small delay before showing dropdown to prevent accidental triggers
    timeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 100);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsHovering(false);
      setFocusedIndex(-1);
    }, 200); // Slightly longer delay to prevent flickering
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setIsHovering(true);
          setFocusedIndex(0);
        } else if (focusedIndex >= 0 && articles[focusedIndex]) {
          // Navigate to focused article
          window.location.href = `/articles/${articles[focusedIndex].slug}`;
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setIsHovering(false);
        setFocusedIndex(-1);
        triggerRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setIsHovering(true);
          setFocusedIndex(0);
        } else {
          const maxIndex = Math.min(articles.length - 1, 3); // Only first 4 articles are focusable
          setFocusedIndex(prev => prev < maxIndex ? prev + 1 : 0);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          const maxIndex = Math.min(articles.length - 1, 3);
          setFocusedIndex(prev => prev > 0 ? prev - 1 : maxIndex);
        }
        break;
      case 'Tab':
        if (isOpen) {
          setIsOpen(false);
          setIsHovering(false);
          setFocusedIndex(-1);
        }
        break;
    }
  };

  const handleArticleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (articles[index]) {
          window.location.href = `/articles/${articles[index].slug}`;
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setIsHovering(false);
        setFocusedIndex(-1);
        triggerRef.current?.focus();
        break;
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Focus management for keyboard navigation
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && articleLinksRef.current[focusedIndex]) {
      articleLinksRef.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, isOpen]);

  return (
    <div 
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      {/* Category Link */}
      <div 
        className="flex items-center gap-1"
        ref={triggerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`${categoryName} category menu`}
      >
        <Link
          to={`/category/${categorySlug}`}
          className={cn(
            "text-sm font-medium transition-all duration-300 relative",
            "hover:text-primary group-hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-sm px-1",
            "animate-fade-in",
            isActive
              ? "text-primary border-b-2 border-primary pb-1"
              : "text-foreground/80"
          )}
          tabIndex={-1} // Prevent double tab stops
        >
          {categoryName}
        </Link>
        <ChevronDown 
          className={cn(
            "h-3 w-3 transition-all duration-300 text-muted-foreground",
            "group-hover:text-primary",
            isOpen ? "rotate-180" : "rotate-0"
          )}
          aria-hidden="true"
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-96 bg-card border border-border rounded-lg shadow-xl z-50 animate-in slide-in-from-top-2 duration-200"
          role="menu"
          aria-label={`Latest articles in ${categoryName}`}
        >
          {/* Arrow pointer */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-4 bg-card border-l border-t border-border rotate-45"></div>
          </div>
          
          <div className="p-4 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 
                className="font-semibold text-base text-foreground flex items-center gap-2"
                id={`dropdown-heading-${categorySlug}`}
              >
                <span className="w-2 h-2 bg-primary rounded-full" aria-hidden="true"></span>
                Latest in {categoryName}
              </h3>
              <Link 
                to={`/category/${categorySlug}`}
                className="text-xs text-primary hover:text-primary/80 focus:text-primary/80 font-medium transition-colors px-2 py-1 rounded hover:bg-primary/10 focus:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label={`View all articles in ${categoryName}`}
              >
                View All →
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-14 h-14 bg-muted rounded-md"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                      <div className="h-2 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-2" role="menu" aria-labelledby={`dropdown-heading-${categorySlug}`}>
                {articles.slice(0, 4).map((article, index) => (
                  <Link
                    key={article.id}
                    ref={el => articleLinksRef.current[index] = el}
                    to={`/articles/${article.slug}`}
                    className={cn(
                      "flex gap-3 p-3 rounded-lg hover:bg-muted/50 focus:bg-muted/50 transition-all duration-200 group border border-transparent hover:border-border/50 focus:border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
                      focusedIndex === index && "bg-muted/50 border-border/50"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                    role="menuitem"
                    tabIndex={focusedIndex === index ? 0 : -1}
                    onKeyDown={(e) => handleArticleKeyDown(e, index)}
                    aria-describedby={`article-meta-${article.id}`}
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-muted group-hover:scale-105 transition-transform duration-200">
                      {article.featuredImage ? (
                        <LazyImage
                          src={article.featuredImage}
                          alt={article.title}
                          className="w-full h-full object-cover"
                          priority={false}
                          useIntersectionObserver={true}
                          threshold={0.1}
                          rootMargin="100px"
                          showLoadingIndicator={true}
                          retryOnError={true}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <span className="text-sm text-muted-foreground font-bold">
                            {categoryName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Article Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-primary group-focus:text-primary transition-colors line-clamp-2 leading-tight mb-2">
                        {article.title}
                      </h4>
                      <div 
                        className="flex items-center gap-3 text-xs text-muted-foreground"
                        id={`article-meta-${article.id}`}
                      >
                        {article.author?.name && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" aria-hidden="true" />
                            <span className="truncate max-w-20" aria-label={`By ${article.author.name}`}>
                              {article.author.name}
                            </span>
                          </div>
                        )}
                        {article.publishedAt && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            <span aria-label={`Published ${new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}>
                              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
                
                {articles.length > 4 && (
                  <div className="pt-2 border-t border-border/50">
                    <Link
                      to={`/category/${categorySlug}`}
                      className="block text-center text-sm text-primary hover:text-primary/80 focus:text-primary/80 font-medium py-2 rounded-md hover:bg-primary/10 focus:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                      aria-label={`View ${articles.length - 4} more articles in ${categoryName}`}
                    >
                      +{articles.length - 4} more articles
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8" role="status" aria-live="polite">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg text-muted-foreground font-bold" aria-hidden="true">
                    {categoryName.charAt(0)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">No articles available yet</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Check back soon for updates</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};