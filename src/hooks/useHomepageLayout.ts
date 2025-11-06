import { useState, useEffect } from 'react';
import { 
  HomepageLayoutConfig, 
  HomepageSectionConfig, 
  defaultHomepageLayout,
  getOrderedSections,
  getSectionConfig
} from '@/config/homepageLayout';

export const useHomepageLayout = () => {
  const [layout, setLayout] = useState<HomepageLayoutConfig>(defaultHomepageLayout);
  const [isLoading, setIsLoading] = useState(false);

  // Get ordered sections
  const orderedSections = getOrderedSections(layout);

  // Get section configuration by type
  const getSection = (type: HomepageSectionConfig['type']) => {
    return getSectionConfig(type, layout);
  };

  // Update section order
  const updateSectionOrder = (sectionId: string, newOrder: number) => {
    setLayout(prevLayout => ({
      ...prevLayout,
      sections: prevLayout.sections.map(section =>
        section.id === sectionId ? { ...section, order: newOrder } : section
      )
    }));
  };

  // Toggle section visibility
  const toggleSectionVisibility = (sectionId: string) => {
    setLayout(prevLayout => ({
      ...prevLayout,
      sections: prevLayout.sections.map(section =>
        section.id === sectionId ? { ...section, visible: !section.visible } : section
      )
    }));
  };

  // Update section configuration
  const updateSectionConfig = (sectionId: string, config: Partial<HomepageSectionConfig['config']>) => {
    setLayout(prevLayout => ({
      ...prevLayout,
      sections: prevLayout.sections.map(section =>
        section.id === sectionId 
          ? { ...section, config: { ...section.config, ...config } }
          : section
      )
    }));
  };

  // Reset to default layout
  const resetToDefault = () => {
    setLayout(defaultHomepageLayout);
  };

  // Load layout from localStorage (for future persistence)
  useEffect(() => {
    const savedLayout = localStorage.getItem('homepage-layout');
    if (savedLayout) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        setLayout(parsedLayout);
      } catch (error) {
        console.warn('Failed to parse saved homepage layout, using default');
        setLayout(defaultHomepageLayout);
      }
    }
  }, []);

  // Save layout to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('homepage-layout', JSON.stringify(layout));
  }, [layout]);

  return {
    layout,
    orderedSections,
    isLoading,
    getSection,
    updateSectionOrder,
    toggleSectionVisibility,
    updateSectionConfig,
    resetToDefault
  };
};