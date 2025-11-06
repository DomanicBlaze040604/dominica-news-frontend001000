import React, { useEffect } from 'react';
import { useDynamicSEO, useDynamicHomepageSEO, useDynamicCategorySEO } from '../hooks/useDynamicSEO';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  category?: string;
  categorySlug?: string;
}

/**
 * Meta Tags component for SEO optimization
 * Handles homepage, category pages, and general page SEO
 */
export const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  keywords,
  canonical,
  image,
  type = 'website',
  category,
  categorySlug
}) => {
  const seoConfig = useDynamicSEO();
  const homepageSEO = useDynamicHomepageSEO();
  const categorySEO = useDynamicCategorySEO(categorySlug || '', category || '');

  useEffect(() => {
    // Determine SEO data based on page type
    let seoData;
    
    if (categorySlug && category) {
      seoData = categorySEO;
    } else if (!title && !description) {
      seoData = homepageSEO;
    } else {
      const canonicalUrl = canonical || window.location.href;
      seoData = {
        title: title || seoConfig.site.name,
        description: description || seoConfig.site.description,
        keywords: keywords || '',
        canonical: canonicalUrl
      };
    }

    // Update document title
    document.title = seoData.title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', seoData.description);
    updateMetaTag('keywords', typeof seoData.keywords === 'string' ? seoData.keywords : seoData.keywords.join(', '));
    updateMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    updateMetaTag('googlebot', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    
    // Language and locale
    updateMetaTag('language', seoConfig.site.language);
    
    // Open Graph tags
    const ogImage = image || seoConfig.site.defaultImage;
    const ogUrl = seoData.canonical || window.location.href;
    
    updateMetaTag('og:title', seoData.title, true);
    updateMetaTag('og:description', seoData.description, true);
    updateMetaTag('og:url', ogUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:site_name', seoConfig.site.name, true);
    updateMetaTag('og:locale', seoConfig.site.locale, true);
    
    // Twitter tags
    updateMetaTag('twitter:card', seoConfig.social.twitter.cardType);
    updateMetaTag('twitter:site', seoConfig.social.twitter.site);
    updateMetaTag('twitter:title', seoData.title);
    updateMetaTag('twitter:description', seoData.description);
    updateMetaTag('twitter:image', ogImage);
    
    // News-specific meta tags
    if (type === 'article' || categorySlug) {
      updateMetaTag('news_keywords', typeof seoData.keywords === 'string' ? seoData.keywords : seoData.keywords.slice(0, 10).join(', '));
      updateMetaTag('article:publisher', seoConfig.site.facebookPage, true);
    }
    
    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', seoData.canonical || ogUrl);

    // Add structured data for website
    if (!categorySlug && !title) {
      // Homepage - add website structured data
      const existingScript = document.querySelector('script[type="application/ld+json"][data-type="website"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-type', 'website');
      script.textContent = JSON.stringify(seoConfig.structuredData.website, null, 2);
      document.head.appendChild(script);
    }

  }, [title, description, keywords, canonical, image, type, category, categorySlug, seoConfig, homepageSEO, categorySEO]);

  // This component doesn't render anything visible
  return null;
};

export default MetaTags;