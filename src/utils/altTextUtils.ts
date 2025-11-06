/**
 * Utility functions for generating and validating alt text for images
 * Ensures accessibility compliance and provides fallback content
 */

export interface AltTextValidation {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
  score: number; // 0-100 accessibility score
}

export interface ImageContext {
  title?: string;
  category?: string;
  author?: string;
  description?: string;
  isDecorative?: boolean;
  context?: 'article' | 'profile' | 'logo' | 'thumbnail' | 'gallery';
}

/**
 * Validates alt text for accessibility compliance
 */
export const validateAltText = (altText: string, context?: ImageContext): AltTextValidation => {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Check if alt text exists
  if (!altText || altText.trim() === '') {
    if (!context?.isDecorative) {
      issues.push('Missing alt text - required for screen readers');
      suggestions.push('Add descriptive alt text that explains what the image shows');
      score -= 50;
    }
    return { isValid: false, issues, suggestions, score: Math.max(0, score) };
  }

  // Check length
  if (altText.length < 3) {
    issues.push('Alt text too short - should be descriptive');
    suggestions.push('Expand alt text to describe the key visual elements');
    score -= 30;
  }

  if (altText.length > 125) {
    issues.push('Alt text too long - consider shorter description');
    suggestions.push('Shorten alt text to focus on essential information');
    score -= 20;
  }

  // Check for redundant phrases
  const redundantPhrases = [
    'image of', 'picture of', 'photo of', 'graphic of', 'illustration of',
    'screenshot of', 'icon of', 'logo of'
  ];
  
  const lowerAlt = altText.toLowerCase();
  const foundRedundant = redundantPhrases.filter(phrase => lowerAlt.includes(phrase));
  
  if (foundRedundant.length > 0) {
    issues.push(`Contains redundant phrases: ${foundRedundant.join(', ')}`);
    suggestions.push('Remove redundant phrases - screen readers already announce it\'s an image');
    score -= 15;
  }

  // Check for placeholder text
  const placeholderPhrases = [
    'placeholder', 'default', 'no image', 'missing image', 'broken image',
    'image not found', 'loading', 'untitled'
  ];
  
  if (placeholderPhrases.some(phrase => lowerAlt.includes(phrase))) {
    issues.push('Contains placeholder text');
    suggestions.push('Replace placeholder text with actual description');
    score -= 40;
  }

  // Check for filename-like text
  if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(altText)) {
    issues.push('Alt text appears to be a filename');
    suggestions.push('Replace filename with descriptive text');
    score -= 35;
  }

  // Check for overly technical language
  const technicalTerms = ['pixel', 'resolution', 'dpi', 'rgb', 'hex', 'css', 'html'];
  if (technicalTerms.some(term => lowerAlt.includes(term))) {
    issues.push('Contains technical terms that may not be helpful to users');
    suggestions.push('Use plain language that describes what users would see');
    score -= 10;
  }

  // Positive checks
  if (altText.length >= 10 && altText.length <= 100) {
    score += 5; // Bonus for good length
  }

  const isValid = issues.length === 0;
  return { isValid, issues, suggestions, score: Math.max(0, Math.min(100, score)) };
};

/**
 * Generates alt text based on image context and available information
 */
export const generateAltText = (context: ImageContext): string => {
  if (context.isDecorative) {
    return '';
  }

  const parts: string[] = [];

  switch (context.context) {
    case 'article':
      if (context.title) {
        parts.push(`Article image for "${context.title}"`);
      }
      if (context.category) {
        parts.push(`in ${context.category} category`);
      }
      break;

    case 'profile':
      if (context.author) {
        parts.push(`Profile photo of ${context.author}`);
      } else {
        parts.push('Profile photo');
      }
      break;

    case 'logo':
      if (context.title) {
        parts.push(`${context.title} logo`);
      } else {
        parts.push('Organization logo');
      }
      break;

    case 'thumbnail':
      if (context.title) {
        parts.push(`Thumbnail for "${context.title}"`);
      } else {
        parts.push('Article thumbnail');
      }
      break;

    case 'gallery':
      if (context.description) {
        parts.push(context.description);
      } else if (context.title) {
        parts.push(`Gallery image: ${context.title}`);
      } else {
        parts.push('Gallery image');
      }
      break;

    default:
      if (context.description) {
        parts.push(context.description);
      } else if (context.title) {
        parts.push(context.title);
      } else {
        parts.push('Image');
      }
  }

  return parts.join(' ').trim();
};

/**
 * Provides fallback alt text when original is missing or invalid
 */
export const getFallbackAltText = (
  originalAlt: string,
  context?: ImageContext,
  filename?: string
): string => {
  // If original alt text is valid, use it
  const validation = validateAltText(originalAlt, context);
  if (validation.isValid && validation.score > 70) {
    return originalAlt;
  }

  // Try to generate from context
  if (context) {
    const generated = generateAltText(context);
    if (generated) {
      return generated;
    }
  }

  // Use filename as last resort (cleaned up)
  if (filename) {
    const cleanFilename = filename
      .replace(/\.[^/.]+$/, '') // Remove extension
      .replace(/[-_]/g, ' ') // Replace dashes and underscores with spaces
      .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize words
      .trim();
    
    if (cleanFilename && cleanFilename !== 'Untitled') {
      return cleanFilename;
    }
  }

  // Final fallback
  return 'Image content not available';
};

/**
 * Improves existing alt text by removing redundant phrases and improving clarity
 */
export const improveAltText = (altText: string): string => {
  if (!altText) return altText;

  let improved = altText.trim();

  // Remove redundant phrases
  const redundantPhrases = [
    /^(image of|picture of|photo of|graphic of|illustration of|screenshot of)\s+/i,
    /\s+(image|picture|photo|graphic|illustration|screenshot)$/i
  ];

  redundantPhrases.forEach(pattern => {
    improved = improved.replace(pattern, '');
  });

  // Clean up spacing
  improved = improved.replace(/\s+/g, ' ').trim();

  // Capitalize first letter
  if (improved.length > 0) {
    improved = improved.charAt(0).toUpperCase() + improved.slice(1);
  }

  return improved;
};

/**
 * Checks if an image should be considered decorative
 */
export const isDecorativeImage = (
  src: string,
  altText: string,
  context?: ImageContext
): boolean => {
  // Explicit decorative marking
  if (context?.isDecorative) {
    return true;
  }

  // Empty alt text usually indicates decorative intent
  if (altText === '') {
    return true;
  }

  // Check for decorative patterns in filename
  const decorativePatterns = [
    /decoration/i,
    /ornament/i,
    /divider/i,
    /spacer/i,
    /border/i,
    /background/i
  ];

  return decorativePatterns.some(pattern => pattern.test(src));
};

/**
 * Generates comprehensive accessibility report for an image
 */
export const generateAccessibilityReport = (
  src: string,
  altText: string,
  context?: ImageContext
): {
  validation: AltTextValidation;
  isDecorative: boolean;
  improvedAltText: string;
  recommendations: string[];
} => {
  const validation = validateAltText(altText, context);
  const isDecorative = isDecorativeImage(src, altText, context);
  const improvedAltText = improveAltText(altText);
  
  const recommendations: string[] = [];

  if (!isDecorative && validation.score < 70) {
    recommendations.push('Consider rewriting alt text for better accessibility');
  }

  if (isDecorative && altText !== '') {
    recommendations.push('Use empty alt text (alt="") for decorative images');
  }

  if (!isDecorative && altText === '') {
    recommendations.push('Add descriptive alt text for this functional image');
  }

  if (validation.suggestions.length > 0) {
    recommendations.push(...validation.suggestions);
  }

  return {
    validation,
    isDecorative,
    improvedAltText,
    recommendations
  };
};