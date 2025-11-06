import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSiteSetting } from '../hooks/useSiteSettings';
import { socialPlatformConfigs, SocialPlatformConfig } from '../config/socialMedia';
import { validateSocialMediaUrl } from '../utils/socialMediaUtils';
import { SocialMediaErrorBoundary } from './ErrorBoundaries';

interface SocialMediaSectionProps {
  title?: string;
  description?: string;
  layout?: 'horizontal' | 'vertical' | 'grid';
  variant?: 'default' | 'cards' | 'minimal';
  className?: string;
  showFollowText?: boolean;
}

export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  title = 'Follow Us',
  description = 'Stay connected with us on social media for the latest updates and breaking news',
  layout = 'horizontal',
  variant = 'default',
  className = '',
  showFollowText = true,
}) => {
  // Get social media settings using hooks
  const { data: facebookData } = useSiteSetting('social_facebook');
  const { data: twitterData } = useSiteSetting('social_twitter');
  const { data: instagramData } = useSiteSetting('social_instagram');
  const { data: youtubeData } = useSiteSetting('social_youtube');
  const { data: linkedinData } = useSiteSetting('social_linkedin');
  const { data: tiktokData } = useSiteSetting('social_tiktok');
  const { data: whatsappData } = useSiteSetting('social_whatsapp');

  // Map the data to social links
  const socialLinks = socialPlatformConfigs.map(platform => {
    let settingData;
    switch (platform.key) {
      case 'facebook':
        settingData = facebookData;
        break;
      case 'twitter':
        settingData = twitterData;
        break;
      case 'instagram':
        settingData = instagramData;
        break;
      case 'youtube':
        settingData = youtubeData;
        break;
      case 'linkedin':
        settingData = linkedinData;
        break;
      case 'tiktok':
        settingData = tiktokData;
        break;
      case 'whatsapp':
        settingData = whatsappData;
        break;
      default:
        settingData = null;
    }
    
    const url = settingData?.value || platform.defaultUrl || '';
    const validation = validateSocialMediaUrl(url, platform.key);
    
    return {
      ...platform,
      url: validation.isValid ? validation.formattedUrl : '',
    };
  }).filter(link => link.url); // Only show platforms with valid URLs

  if (socialLinks.length === 0) {
    return null;
  }

  const renderSocialLink = (link: SocialPlatformConfig & { url: string }) => {
    const Icon = link.icon;
    
    if (variant === 'cards') {
      return (
        <Card key={link.key} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4 text-center">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="block"
              aria-label={`Follow us on ${link.label}`}
              title={`Follow us on ${link.label}`}
            >
              <div 
                className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 ${
                  link.gradient ? `bg-gradient-to-br ${link.gradient}` : ''
                }`}
                style={!link.gradient ? { backgroundColor: link.color } : {}}
              >
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {link.label}
              </p>
              {showFollowText && (
                <p className="text-xs text-muted-foreground mt-1">Follow us</p>
              )}
            </a>
          </CardContent>
        </Card>
      );
    }

    if (variant === 'minimal') {
      return (
        <Button
          key={link.key}
          variant="ghost"
          size="sm"
          asChild
          className="hover:scale-110 transition-all duration-300 hover:bg-transparent"
        >
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            aria-label={`Follow us on ${link.label}`}
            title={`Follow us on ${link.label}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm">{link.label}</span>
          </a>
        </Button>
      );
    }

    // Default variant
    return (
      <a
        key={link.key}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="group flex items-center justify-center w-14 h-14 rounded-full text-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        style={{ backgroundColor: link.color }}
        aria-label={`Follow us on ${link.label}`}
        title={`Follow us on ${link.label}`}
      >
        <Icon className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
      </a>
    );
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'vertical':
        return 'flex flex-col items-center gap-4';
      case 'grid':
        return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4';
      default:
        return 'flex flex-wrap justify-center items-center gap-4 sm:gap-6';
    }
  };

  return (
    <section className={`py-8 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-headline font-bold text-foreground mb-2">
          {title}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
      </div>
      
      <div className={getLayoutClasses()}>
        {socialLinks.map(renderSocialLink)}
      </div>
    </section>
  );
};

// Wrap with error boundary for better error handling
export const SocialMediaSectionWithErrorBoundary: React.FC<SocialMediaSectionProps> = (props) => (
  <SocialMediaErrorBoundary>
    <SocialMediaSection {...props} />
  </SocialMediaErrorBoundary>
);