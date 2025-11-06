import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, LogOut, Settings, Bell } from 'lucide-react';
import { CategoryDropdown } from './CategoryDropdown';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', href: '/', exact: true },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActiveLink = (href: string, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
          : "bg-white shadow-sm"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className={cn(
              "flex items-center gap-3 font-bold text-xl transition-all duration-200",
              "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-lg p-1"
            )}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">DN</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <span className="hidden sm:block text-gray-800">
              Dominica <span className="text-green-600">News</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-green-50 hover:text-green-600 hover:scale-105",
                  "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
                  isActiveLink(link.href, link.exact)
                    ? "text-green-600 bg-green-50"
                    : "text-gray-700"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Categories Dropdown */}
            <CategoryDropdown />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                "text-gray-600 hover:text-green-600 hover:bg-green-50 hover:scale-110",
                "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              )}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg transition-all duration-200",
                    "text-gray-700 hover:text-green-600 hover:bg-green-50",
                    "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  )}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.fullName?.charAt(0) || user.email.charAt(0)}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {user.fullName || user.email}
                  </span>
                </button>

                {/* User Dropdown */}
                <div className={cn(
                  "absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200",
                  "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
                  "transition-all duration-200 transform translate-y-2 group-hover:translate-y-0",
                  "z-50"
                )}>
                  <div className="p-2">
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className={cn(
                          "flex items-center gap-3 w-full p-3 rounded-lg text-left transition-all duration-200",
                          "text-gray-700 hover:text-green-600 hover:bg-green-50 hover:scale-[1.02]"
                        )}
                      >
                        <Settings className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/admin/profile"
                      className={cn(
                        "flex items-center gap-3 w-full p-3 rounded-lg text-left transition-all duration-200",
                        "text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:scale-[1.02]"
                      )}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={cn(
                        "flex items-center gap-3 w-full p-3 rounded-lg text-left transition-all duration-200",
                        "text-gray-700 hover:text-red-600 hover:bg-red-50 hover:scale-[1.02]"
                      )}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  "text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
                  "hover:scale-105 hover:shadow-lg",
                  "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                )}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:block">Login</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "md:hidden p-2 rounded-lg transition-all duration-200",
                "text-gray-600 hover:text-green-600 hover:bg-green-50",
                "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              )}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={cn(
            "md:hidden border-t border-gray-200 py-4",
            "animate-in slide-in-from-top-2 duration-200"
          )}>
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:bg-green-50 hover:text-green-600 hover:translate-x-2",
                    isActiveLink(link.href, link.exact)
                      ? "text-green-600 bg-green-50"
                      : "text-gray-700"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile Categories */}
              <div className="px-4 py-2">
                <CategoryDropdown className="w-full" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;