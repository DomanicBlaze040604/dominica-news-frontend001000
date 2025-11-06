/**
 * Utility functions for social media URL validation and formatting
 */

export interface SocialMediaValidation {
  isValid: boolean;
  formattedUrl: string;
  error?: string;
}

/**
 * Validates and formats social media URLs
 */
export const validateSocialMediaUrl = (url: string, platform: string): SocialMediaValidation => {
  if (!url || url.trim() === '') {
    return {
      isValid: false,
      formattedUrl: '',
      error: 'URL is required',
    };
  }

  const trimmedUrl = url.trim();
  
  // Check if URL starts with http/https
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    return {
      isValid: false,
      formattedUrl: trimmedUrl,
      error: 'URL must start with http:// or https://',
    };
  }

  try {
    const urlObj = new URL(trimmedUrl);
    
    // Platform-specific validation
    switch (platform.toLowerCase()) {
      case 'facebook':
        if (!urlObj.hostname.includes('facebook.com') && !urlObj.hostname.includes('fb.com')) {
          return {
            isValid: false,
            formattedUrl: trimmedUrl,
            error: 'Must be a valid Facebook URL',
          };
        }
        break;
      
      case 'twitter':
        if (!urlObj.hostname.includes('twitter.com') && !urlObj.hostname.includes('x.com')) {
          return {
            isValid: false,
            formattedUrl: trimmedUrl,
            error: 'Must be a valid Twitter/X URL',
          };
        }
        break;
      
      case 'instagram':
        if (!urlObj.hostname.includes('instagram.com')) {
          return {
            isValid: false,
            formattedUrl: trimmedUrl,
            error: 'Must be a valid Instagram URL',
          };
        }
        break;
      
      case 'youtube':
        if (!urlObj.hostname.includes('youtube.com') && !urlObj.hostname.includes('youtu.be')) {
          return {
            isValid: false,
            formattedUrl: trimmedUrl,
            error: 'Must be a valid YouTube URL',
          };
        }
        break;
      
      case 'linkedin':
        if (!urlObj.hostname.includes('linkedin.com')) {
          return {
            isValid: false,
            formattedUrl: trimmedUrl,
            error: 'Must be a valid LinkedIn URL',
          };
        }
        break;
      
      case 'tiktok':
        if (!urlObj.hostname.includes('tiktok.com')) {
          return {
            isValid: false,
            formattedUrl: trimmedUrl,
            error: 'Must be a valid TikTok URL',
          };
        }
        break;
      
      case 'whatsapp':
        if (!urlObj.hostname.includes('wa.me') && !urlObj.hostname.includes('whatsapp.com')) {
          return {
            isValid: false,
            formattedUrl: trimmedUrl,
            error: 'Must be a valid WhatsApp URL (wa.me or whatsapp.com)',
          };
        }
        break;
    }

    return {
      isValid: true,
      formattedUrl: trimmedUrl,
    };
  } catch (error) {
    return {
      isValid: false,
      formattedUrl: trimmedUrl,
      error: 'Invalid URL format',
    };
  }
};

/**
 * Formats a social media handle into a proper URL
 */
export const formatSocialHandle = (handle: string, platform: string): string => {
  if (!handle || handle.trim() === '') {
    return '';
  }

  const cleanHandle = handle.trim().replace('@', '');
  
  switch (platform.toLowerCase()) {
    case 'facebook':
      return `https://facebook.com/${cleanHandle}`;
    case 'twitter':
      return `https://twitter.com/${cleanHandle}`;
    case 'instagram':
      return `https://instagram.com/${cleanHandle}`;
    case 'youtube':
      return cleanHandle.startsWith('@') 
        ? `https://youtube.com/${cleanHandle}`
        : `https://youtube.com/@${cleanHandle}`;
    case 'linkedin':
      return `https://linkedin.com/company/${cleanHandle}`;
    case 'tiktok':
      return `https://tiktok.com/@${cleanHandle}`;
    default:
      return handle;
  }
};

/**
 * Extracts the handle/username from a social media URL
 */
export const extractSocialHandle = (url: string, platform: string): string => {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    switch (platform.toLowerCase()) {
      case 'facebook':
        return pathname.split('/')[1] || '';
      case 'twitter':
        return pathname.split('/')[1] || '';
      case 'instagram':
        return pathname.split('/')[1] || '';
      case 'youtube':
        return pathname.includes('@') 
          ? pathname.split('/')[1] 
          : pathname.split('/')[2] || '';
      case 'linkedin':
        return pathname.split('/')[2] || '';
      case 'tiktok':
        return pathname.split('/')[1]?.replace('@', '') || '';
      default:
        return '';
    }
  } catch {
    return '';
  }
};