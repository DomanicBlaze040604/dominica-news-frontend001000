export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  featured?: boolean;
}

export const featuredNews: NewsArticle = {
  id: "1",
  title: "Prime Minister Announces New Economic Development Initiative for Dominica",
  excerpt: "The government unveils a comprehensive plan to boost economic growth through sustainable tourism and renewable energy investments.",
  category: "Economy",
  date: "October 30, 2025",
  image: "https://images.unsplash.com/photo-1526948531399-320e7e40f0ca?w=800&h=600&fit=crop",
  featured: true,
};

export const allNews: NewsArticle[] = [
  // World News
  {
    id: "w1",
    title: "Caribbean Leaders Meet to Discuss Climate Action",
    excerpt: "Regional summit addresses urgent climate challenges and collaborative solutions for island nations.",
    category: "World",
    date: "October 28, 2025",
    image: "https://images.unsplash.com/photo-1569163139394-de4798aa62b0?w=600&h=400&fit=crop",
  },
  {
    id: "w2",
    title: "International Trade Agreement Benefits Small Island Nations",
    excerpt: "New trade pact opens markets for Caribbean agricultural exports and tourism services.",
    category: "World",
    date: "October 26, 2025",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop",
  },
  {
    id: "w3",
    title: "UN Recognizes Caribbean Climate Resilience Efforts",
    excerpt: "International body praises regional initiatives in disaster preparedness and environmental protection.",
    category: "World",
    date: "October 23, 2025",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
  },
  
  // Dominica News
  {
    id: "d1",
    title: "New Marine Conservation Area Established",
    excerpt: "Environmental initiative protects vital coral reef ecosystem along Dominica's western coast.",
    category: "Dominica",
    date: "October 27, 2025",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=400&fit=crop",
  },
  {
    id: "d2",
    title: "UNESCO Recognizes Dominica's Cultural Heritage Sites",
    excerpt: "International organization honors the nation's commitment to preserving historical landmarks.",
    category: "Dominica",
    date: "October 24, 2025",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop",
  },
  {
    id: "d3",
    title: "Roseau Market Renovation Project Completed",
    excerpt: "Historic marketplace receives modern upgrades while preserving traditional architectural elements.",
    category: "Dominica",
    date: "October 22, 2025",
    image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600&h=400&fit=crop",
  },
  {
    id: "d4",
    title: "National Park Visitor Numbers Reach New Heights",
    excerpt: "Tourism statistics show record-breaking interest in Dominica's natural attractions.",
    category: "Dominica",
    date: "October 20, 2025",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
  },
  
  // Economy News
  {
    id: "e1",
    title: "Tech Hub Opens in Roseau Creating Job Opportunities",
    excerpt: "New technology center aims to position Dominica as a Caribbean digital innovation leader.",
    category: "Economy",
    date: "October 26, 2025",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
  },
  {
    id: "e2",
    title: "Foreign Investment in Renewable Energy Sector Grows",
    excerpt: "International investors show strong interest in Dominica's clean energy initiatives.",
    category: "Economy",
    date: "October 25, 2025",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop",
  },
  {
    id: "e3",
    title: "Small Business Support Program Launches",
    excerpt: "Government initiative provides funding and training for local entrepreneurs.",
    category: "Economy",
    date: "October 21, 2025",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
  },
  {
    id: "e4",
    title: "Tourism Revenue Exceeds Annual Projections",
    excerpt: "Strong performance in hospitality sector drives economic growth across the island.",
    category: "Economy",
    date: "October 19, 2025",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop",
  },
  
  // Agriculture News
  {
    id: "a1",
    title: "Agricultural Exports Reach Record High This Quarter",
    excerpt: "Dominica's agricultural sector reports unprecedented growth in banana and citrus exports.",
    category: "Agriculture",
    date: "October 29, 2025",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop",
  },
  {
    id: "a2",
    title: "Traditional Farming Methods Blend with Modern Techniques",
    excerpt: "Local farmers successfully integrate sustainable practices while preserving cultural heritage.",
    category: "Agriculture",
    date: "October 25, 2025",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop",
  },
  {
    id: "a3",
    title: "Organic Certification Program Supports Local Farmers",
    excerpt: "New initiative helps producers access premium international markets for organic products.",
    category: "Agriculture",
    date: "October 23, 2025",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop",
  },
  {
    id: "a4",
    title: "Climate-Resistant Crop Varieties Show Promise",
    excerpt: "Agricultural research station introduces new varieties designed for changing weather patterns.",
    category: "Agriculture",
    date: "October 18, 2025",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop",
  },
];

export const getNewsByCategory = (category: string): NewsArticle[] => {
  return allNews.filter(
    (article) => article.category.toLowerCase() === category.toLowerCase()
  );
};

export const getLatestNews = (limit: number = 6): NewsArticle[] => {
  return allNews.slice(0, limit);
};
