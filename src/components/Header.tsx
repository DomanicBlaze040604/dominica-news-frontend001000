import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
const Header = () => {
  return <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            
            <h1 className="font-display text-2xl md:text-3xl font-bold text-primary tracking-tight">
              DOMINICA NEWS
            </h1>
          </Link>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover-scale">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Link to="/admin">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex hover-scale">
                Admin
              </Button>
            </Link>
            <Button variant="default" size="sm" className="hidden sm:inline-flex hover-scale">
              Register
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex hover-scale">
              Sign In
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 border-t border-border overflow-x-auto">
          <Link to="/" className="px-4 py-3 text-sm font-medium hover:text-primary transition-all duration-300 border-b-2 border-primary hover:bg-primary/5">
            Home
          </Link>
          <Link to="/category/weather" className="px-4 py-3 text-sm font-medium hover:text-primary transition-all duration-300 border-b-2 border-transparent hover:border-primary hover:bg-primary/5">
            Weather
          </Link>
          <Link to="/category/news" className="px-4 py-3 text-sm font-medium hover:text-primary transition-all duration-300 border-b-2 border-transparent hover:border-primary hover:bg-primary/5">
            News
          </Link>
          <Link to="/category/world" className="px-4 py-3 text-sm font-medium hover:text-primary transition-all duration-300 border-b-2 border-transparent hover:border-primary hover:bg-primary/5">
            World
          </Link>
          <Link to="/category/crime" className="px-4 py-3 text-sm font-medium hover:text-primary transition-all duration-300 border-b-2 border-transparent hover:border-primary hover:bg-primary/5">
            Crime
          </Link>
          <Link to="/category/caribbean" className="px-4 py-3 text-sm font-medium hover:text-primary transition-all duration-300 border-b-2 border-transparent hover:border-primary hover:bg-primary/5">
            Caribbean
          </Link>
          <Link to="/category/entertainment" className="px-4 py-3 text-sm font-medium hover:text-primary transition-all duration-300 border-b-2 border-transparent hover:border-primary hover:bg-primary/5">
            Entertainment
          </Link>
          <Link to="/category/business" className="px-4 py-3 text-sm font-medium hover:text-primary transition-all duration-300 border-b-2 border-transparent hover:border-primary hover:bg-primary/5">
            Business
          </Link>
          <Link to="/category/trending" className="px-4 py-3 text-sm font-medium hover:text-primary transition-all duration-300 border-b-2 border-transparent hover:border-primary hover:bg-primary/5">
            Trending
          </Link>
        </nav>
      </div>
    </header>;
};
export default Header;