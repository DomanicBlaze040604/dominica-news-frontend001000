import { Facebook, Twitter, Instagram, Youtube, MessageCircle, Linkedin, Music } from 'lucide-react';

export interface SocialPlatformConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  hoverColor: string;
  gradient?: string;
  defaultUrl?: string;
}

export const socialPlatformConfigs: SocialPlatformConfig[] = [
  { 
    key: 'facebook', 
    label: 'Facebook', 
    icon: Facebook, 
    color: '#1877F2',
    hoverColor: '#166FE5',
    defaultUrl: 'https://facebook.com/dominicanews',
  },
  { 
    key: 'twitter', 
    label: 'Twitter/X', 
    icon: Twitter, 
    color: '#000000',
    hoverColor: '#1a1a1a',
    defaultUrl: 'https://twitter.com/dominicanews',
  },
  { 
    key: 'instagram', 
    label: 'Instagram', 
    icon: Instagram, 
    color: '#E4405F',
    hoverColor: '#d73559',
    gradient: 'from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
    defaultUrl: 'https://instagram.com/dominicanews',
  },
  { 
    key: 'youtube', 
    label: 'YouTube', 
    icon: Youtube, 
    color: '#FF0000',
    hoverColor: '#e60000',
    defaultUrl: 'https://youtube.com/@dominicanews',
  },
  { 
    key: 'linkedin', 
    label: 'LinkedIn', 
    icon: Linkedin, 
    color: '#0A66C2',
    hoverColor: '#0958a8',
    defaultUrl: 'https://linkedin.com/company/dominicanews',
  },
  { 
    key: 'tiktok', 
    label: 'TikTok', 
    icon: Music, 
    color: '#000000',
    hoverColor: '#1a1a1a',
    defaultUrl: 'https://tiktok.com/@dominicanews',
  },
  { 
    key: 'whatsapp', 
    label: 'WhatsApp', 
    icon: MessageCircle, 
    color: '#25D366',
    hoverColor: '#22c55e',
    defaultUrl: 'https://wa.me/17671234567',
  },
];

export interface SocialMediaSectionConfig {
  title: string;
  description: string;
  layout: 'horizontal' | 'vertical' | 'grid';
  variant: 'default' | 'cards' | 'minimal';
  showFollowText: boolean;
  enabledPlatforms: string[];
}

export const defaultSocialMediaConfig: SocialMediaSectionConfig = {
  title: 'Follow Us',
  description: 'Stay connected with us on social media for the latest updates and breaking news',
  layout: 'horizontal',
  variant: 'default',
  showFollowText: true,
  enabledPlatforms: ['facebook', 'twitter', 'instagram', 'youtube', 'whatsapp'],
};