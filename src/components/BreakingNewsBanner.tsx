import { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface BreakingNews {
  id: string;
  title: string;
  link?: string;
  priority: "high" | "medium" | "low";
}

export function BreakingNewsBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample breaking news - in production, fetch from API
  const breakingNews: BreakingNews[] = [
    {
      id: "1",
      title: "🌪️ Tropical Storm Warning: Residents Advised to Prepare for Heavy Rainfall",
      link: "/article/tropical-storm-warning",
      priority: "high",
    },
  ];

  useEffect(() => {
    if (breakingNews.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingNews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [breakingNews.length]);

  if (!isVisible || breakingNews.length === 0) return null;

  const currentNews = breakingNews[currentIndex];
  
  const priorityColors = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-orange-500 text-white",
    low: "bg-yellow-500 text-black",
  };

  return (
    <div
      className={`sticky top-0 z-50 ${priorityColors[currentNews.priority]} animate-in slide-in-from-top duration-300`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 py-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 animate-pulse" />
          
          <div className="flex-1 flex items-center gap-2">
            <span className="font-bold text-sm uppercase tracking-wide">Breaking News</span>
            <span className="hidden sm:inline">•</span>
            {currentNews.link ? (
              <Link
                to={currentNews.link}
                className="font-medium hover:underline line-clamp-1"
              >
                {currentNews.title}
              </Link>
            ) : (
              <span className="font-medium line-clamp-1">{currentNews.title}</span>
            )}
          </div>

          {breakingNews.length > 1 && (
            <div className="hidden sm:flex items-center gap-1">
              {breakingNews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex ? "w-6 bg-current" : "w-1.5 bg-current/40"
                  }`}
                  aria-label={`Go to news ${index + 1}`}
                />
              ))}
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 flex-shrink-0 hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
