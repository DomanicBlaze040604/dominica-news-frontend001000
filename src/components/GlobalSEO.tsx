import React from 'react';
import { Helmet } from 'react-helmet-async';

export const GlobalSEO: React.FC = () => {
  return (
    <Helmet>
      {/* Global Meta Tags */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#16a34a" />
      
      {/* Open Graph */}
      <meta property="og:site_name" content="Dominica News" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:site" content="@DominicaNews" />
      <meta name="twitter:creator" content="@DominicaNews" />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsMediaOrganization",
          "name": "Dominica News",
          "url": "https://dominica-news.com",
          "logo": "https://dominica-news.com/logo.png",
          "sameAs": [
            "https://facebook.com/dominicanews",
            "https://twitter.com/dominicanews",
            "https://instagram.com/dominicanews"
          ],
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "DM",
            "addressLocality": "Roseau"
          }
        })}
      </script>
    </Helmet>
  );
};