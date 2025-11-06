import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  date: string;
  author: string;
  featured?: boolean;
}

const ArticleCard = ({
  slug,
  title,
  excerpt,
  imageUrl,
  category,
  date,
  author,
  featured = false,
}: ArticleCardProps) => {
  return (
    <Link to={`/article/${slug}`} className="group block">
      <article className={`h-full bg-card rounded-lg overflow-hidden border border-border interactive-card ${featured ? 'md:flex md:gap-6' : ''}`}>
        <div className={`relative overflow-hidden bg-muted ${featured ? 'md:w-1/2' : 'aspect-video'}`}>
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            {category}
          </Badge>
        </div>
        
        <div className={`p-4 ${featured ? 'md:w-1/2 md:flex md:flex-col md:justify-center' : ''}`}>
          <h3 className={`font-display font-bold mb-2 group-hover:text-primary transition-colors ${featured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
            {title}
          </h3>
          <p className={`text-muted-foreground mb-3 ${featured ? 'text-base' : 'text-sm'} line-clamp-2`}>
            {excerpt}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">{author}</span>
            <span>•</span>
            <time dateTime={date}>{date}</time>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;
