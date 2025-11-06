export interface HomepageSectionConfig {
  id: string;
  type: 'breaking-news' | 'search' | 'latest-news' | 'featured-stories' | 'social-media' | 'categories';
  order: number;
  visible: boolean;
  title?: string;
  description?: string;
  config?: {
    articlesCount?: number;
    showExcerpts?: boolean;
    layout?: 'grid' | 'list' | 'cards' | 'single';
    showLoadMore?: boolean;
    showViewAll?: boolean;
  };
}

export interface HomepageLayoutConfig {
  sections: HomepageSectionConfig[];
  responsive: {
    mobile: {
      articlesPerRow: number;
      sectionsToShow: string[];
    };
    tablet: {
      articlesPerRow: number;
      sectionsToShow: string[];
    };
    desktop: {
      articlesPerRow: number;
      sectionsToShow: string[];
    };
  };
}

// Default homepage layout configuration
export const defaultHomepageLayout: HomepageLayoutConfig = {
  sections: [
    {
      id: 'breaking-news',
      type: 'breaking-news',
      order: 1,
      visible: true,
      title: 'Breaking News',
      config: {
        layout: 'single'
      }
    },
    {
      id: 'search',
      type: 'search',
      order: 2,
      visible: true,
      title: 'Search Articles'
    },
    {
      id: 'latest-news',
      type: 'latest-news',
      order: 3,
      visible: true,
      title: 'Latest News',
      description: 'Stay informed with the most recent news from Dominica',
      config: {
        articlesCount: 6,
        showExcerpts: true,
        layout: 'grid',
        showLoadMore: true,
        showViewAll: true
      }
    },
    {
      id: 'featured-stories',
      type: 'featured-stories',
      order: 4,
      visible: true,
      title: 'Featured Stories',
      description: 'Editor\'s picks and highlighted content',
      config: {
        articlesCount: 3,
        showExcerpts: true,
        layout: 'cards' // or 'single' based on site setting
      }
    },
    {
      id: 'social-media',
      type: 'social-media',
      order: 5,
      visible: true,
      title: 'Follow Us On',
      description: 'Stay connected with us on social media for the latest updates and breaking news'
    },
    {
      id: 'categories',
      type: 'categories',
      order: 6,
      visible: true,
      title: 'Explore by Category',
      description: 'Stay informed with news from across Dominica and the world',
      config: {
        articlesCount: 8,
        layout: 'grid'
      }
    }
  ],
  responsive: {
    mobile: {
      articlesPerRow: 1,
      sectionsToShow: ['breaking-news', 'search', 'latest-news', 'featured-stories', 'social-media']
    },
    tablet: {
      articlesPerRow: 2,
      sectionsToShow: ['breaking-news', 'search', 'latest-news', 'featured-stories', 'social-media', 'categories']
    },
    desktop: {
      articlesPerRow: 3,
      sectionsToShow: ['breaking-news', 'search', 'latest-news', 'featured-stories', 'social-media', 'categories']
    }
  }
};

// Function to get ordered sections
export const getOrderedSections = (layout: HomepageLayoutConfig = defaultHomepageLayout): HomepageSectionConfig[] => {
  return layout.sections
    .filter(section => section.visible)
    .sort((a, b) => a.order - b.order);
};

// Function to get section by type
export const getSectionConfig = (
  type: HomepageSectionConfig['type'], 
  layout: HomepageLayoutConfig = defaultHomepageLayout
): HomepageSectionConfig | undefined => {
  return layout.sections.find(section => section.type === type);
};

// Function to update section order
export const updateSectionOrder = (
  layout: HomepageLayoutConfig,
  sectionId: string,
  newOrder: number
): HomepageLayoutConfig => {
  return {
    ...layout,
    sections: layout.sections.map(section =>
      section.id === sectionId ? { ...section, order: newOrder } : section
    )
  };
};

// Function to toggle section visibility
export const toggleSectionVisibility = (
  layout: HomepageLayoutConfig,
  sectionId: string
): HomepageLayoutConfig => {
  return {
    ...layout,
    sections: layout.sections.map(section =>
      section.id === sectionId ? { ...section, visible: !section.visible } : section
    )
  };
};