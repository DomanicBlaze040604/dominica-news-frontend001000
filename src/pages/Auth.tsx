import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication logic with backend
    console.log('Auth form submitted:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Login' : 'Register'} - Dominica News</title>
        <meta name="description" content={`${isLogin ? 'Login to' : 'Create an account with'} Dominica News to access exclusive content and admin features.`} />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">DN</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">
                Dominica <span className="text-green-600">News</span>
              </span>
            </Link>
          </div>

          {/* Auth Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Sign in to access your account' 
                  : 'Join Dominica News community'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg",
                        "focus:ring-2 focus:ring-green-500 focus:border-transparent",
                        "transition-all duration-200"
                      )}
                      placeholder="Enter your full name"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg",
                      "focus:ring-2 focus:ring-green-500 focus:border-transparent",
                      "transition-all duration-200"
                    )}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg",
                      "focus:ring-2 focus:ring-green-500 focus:border-transparent",
                      "transition-all duration-200"
                    )}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg",
                        "focus:ring-2 focus:ring-green-500 focus:border-transparent",
                        "transition-all duration-200"
                      )}
                      placeholder="Confirm your password"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={cn(
                  "w-full py-3 px-4 rounded-lg font-medium transition-all duration-200",
                  "bg-gradient-to-r from-green-500 to-green-600 text-white",
                  "hover:from-green-600 hover:to-green-700 hover:scale-[1.02]",
                  "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
                  "shadow-lg hover:shadow-xl"
                )}
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-green-600 hover:text-green-700 font-medium hover:underline"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>

            {isLogin && (
              <div className="mt-4 text-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-gray-500 hover:text-green-600 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            )}
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Backend integration pending - please provide your API URL</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;