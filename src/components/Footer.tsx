import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">About Us</h3>
            <p className="text-sm opacity-90">
              Dominica News is your trusted source for breaking news, politics, weather updates, and Caribbean coverage.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-secondary transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-secondary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/news" className="hover:text-secondary transition-colors">News</Link></li>
              <li><Link to="/category/politics" className="hover:text-secondary transition-colors">Politics</Link></li>
              <li><Link to="/category/weather" className="hover:text-secondary transition-colors">Weather</Link></li>
              <li><Link to="/category/sports" className="hover:text-secondary transition-colors">Sports</Link></li>
              <li><Link to="/category/entertainment" className="hover:text-secondary transition-colors">Entertainment</Link></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                <Youtube className="h-6 w-6" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-90">
          <p>&copy; {new Date().getFullYear()} Dominica News. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
