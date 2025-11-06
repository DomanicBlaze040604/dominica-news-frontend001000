import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Newspaper, Globe, Building2, Wheat, Users, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
  name: string;
  slug: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const categories: Category[] = [
  {
    name: 'World News',
    slug: 'world',
    icon: <Globe className="h-4 w-4" />,
    description: 'International news and global events',
    color: 'text-blue-600 bg-blue-50 hover:bg-blue-100'
  },
  {
    name: 'Dominica',
    slug: 'dominica',
    icon: <Newspaper className="h-4 w-4" />,
    description: 'Local news from across Dominica',
    color: 'text-green-600 bg-green-50 hover:bg-green-100'
  },
  {
    name: 'Economy',
    slug: 'economy',
    icon: <Building2 className="h-4 w-4" />,
    description: 'Business and economic developments',
    color: 'text-purple-600 bg-purple-50 hover:bg-purple-100'
  },
  {
    name: 'Agriculture',
    slug: 'agriculture',
    icon: <Wheat className="h-4 w-4" />,
    description: 'Farming and agricultural news',
    color: 'text-amber-600 bg-amber-50 hover:bg-amber-100'
  },
  {
    name: 'Politics',
    slug: 'politics',
    icon: <Users className="h-4 w-4" />,
    description: 'Political news and government updates',
    color: 'text-red-600 bg-red-50 hover:bg-red-100'
  },
  {
    name: 'Events',
    slug: 'events',
    icon: <Calendar className="h-4 w-4" />,
    description: 'Community events and celebrations',
    color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
  }
];

interface CategoryDropdownProps {
  className?: string;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
          "text-gray-700 hover:text-green-600 hover:bg-green-50",
          "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
          isOpen && "text-green-600 bg-green-50"
        )}
        data-testid="dropdown-trigger"
      >
        <Newspaper className="h-4 w-4" />
        Categories
        <ChevronDown 
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200",
            "animate-in fade-in-0 zoom-in-95 duration-200",
            "z-50"
          )}
          onMouseLeave={() => setIsOpen(false)}
          data-testid="dropdown-content"
        >
          <div className="p-2">
            <div className="grid gap-1">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg transition-all duration-200",
                    "hover:scale-[1.02] hover:shadow-md",
                    category.color,
                    "group"
                  )}
                >
                  <div className={cn(
                    "flex-shrink-0 p-2 rounded-lg transition-all duration-200",
                    "group-hover:scale-110 group-hover:rotate-3"
                  )}>
                    {category.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "font-semibold text-sm transition-all duration-200",
                      "group-hover:translate-x-1"
                    )}>
                      {category.name}
                    </h3>
                    <p className={cn(
                      "text-xs opacity-70 mt-1 transition-all duration-200",
                      "group-hover:opacity-100"
                    )}>
                      {category.description}
                    </p>
                  </div>
                  <div className={cn(
                    "flex-shrink-0 opacity-0 transition-all duration-200",
                    "group-hover:opacity-100 group-hover:translate-x-1"
                  )}>
                    <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 p-3">
            <Link
              to="/categories"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center justify-center gap-2 w-full p-2 text-sm font-medium rounded-lg",
                "text-gray-600 hover:text-green-600 hover:bg-green-50",
                "transition-all duration-200 hover:scale-[1.02]"
              )}
            >
              <Newspaper className="h-4 w-4" />
              View All Categories
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;