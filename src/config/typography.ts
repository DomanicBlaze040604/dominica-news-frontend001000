/**
 * Centralized Typography Configuration
 * Defines font scales, weights, and line heights for different screen sizes
 */

export interface FontScale {
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  h6: string;
  body: string;
  bodyLarge: string;
  bodySmall: string;
  caption: string;
}

export interface TypographyConfig {
  fonts: {
    primary: string;
    heading: string;
  };
  scales: {
    mobile: FontScale;
    tablet: FontScale;
    desktop: FontScale;
  };
  weights: {
    light: number;
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
    black: number;
  };
  lineHeights: {
    tight: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
}

export const typographyConfig: TypographyConfig = {
  fonts: {
    primary: 'Roboto',
    heading: 'Montserrat',
  },
  scales: {
    mobile: {
      h1: '2rem',      // 32px
      h2: '1.75rem',   // 28px
      h3: '1.5rem',    // 24px
      h4: '1.25rem',   // 20px
      h5: '1.125rem',  // 18px
      h6: '1rem',      // 16px
      body: '0.875rem',     // 14px
      bodyLarge: '1rem',    // 16px
      bodySmall: '0.75rem', // 12px
      caption: '0.75rem',   // 12px
    },
    tablet: {
      h1: '2.5rem',    // 40px
      h2: '2rem',      // 32px
      h3: '1.75rem',   // 28px
      h4: '1.5rem',    // 24px
      h5: '1.25rem',   // 20px
      h6: '1.125rem',  // 18px
      body: '1rem',         // 16px
      bodyLarge: '1.125rem', // 18px
      bodySmall: '0.875rem', // 14px
      caption: '0.875rem',   // 14px
    },
    desktop: {
      h1: '3rem',      // 48px
      h2: '2.5rem',    // 40px
      h3: '2rem',      // 32px
      h4: '1.75rem',   // 28px
      h5: '1.5rem',    // 24px
      h6: '1.25rem',   // 20px
      body: '1rem',         // 16px
      bodyLarge: '1.125rem', // 18px
      bodySmall: '0.875rem', // 14px
      caption: '0.875rem',   // 14px
    },
  },
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 800,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
};

/**
 * CSS Custom Properties for Typography
 * These can be used in CSS files for responsive typography
 */
export const typographyCSSVariables = `
  /* Typography Scale - Mobile */
  --font-size-h1-mobile: ${typographyConfig.scales.mobile.h1};
  --font-size-h2-mobile: ${typographyConfig.scales.mobile.h2};
  --font-size-h3-mobile: ${typographyConfig.scales.mobile.h3};
  --font-size-h4-mobile: ${typographyConfig.scales.mobile.h4};
  --font-size-h5-mobile: ${typographyConfig.scales.mobile.h5};
  --font-size-h6-mobile: ${typographyConfig.scales.mobile.h6};
  --font-size-body-mobile: ${typographyConfig.scales.mobile.body};
  --font-size-body-large-mobile: ${typographyConfig.scales.mobile.bodyLarge};
  --font-size-body-small-mobile: ${typographyConfig.scales.mobile.bodySmall};
  --font-size-caption-mobile: ${typographyConfig.scales.mobile.caption};

  /* Typography Scale - Tablet */
  --font-size-h1-tablet: ${typographyConfig.scales.tablet.h1};
  --font-size-h2-tablet: ${typographyConfig.scales.tablet.h2};
  --font-size-h3-tablet: ${typographyConfig.scales.tablet.h3};
  --font-size-h4-tablet: ${typographyConfig.scales.tablet.h4};
  --font-size-h5-tablet: ${typographyConfig.scales.tablet.h5};
  --font-size-h6-tablet: ${typographyConfig.scales.tablet.h6};
  --font-size-body-tablet: ${typographyConfig.scales.tablet.body};
  --font-size-body-large-tablet: ${typographyConfig.scales.tablet.bodyLarge};
  --font-size-body-small-tablet: ${typographyConfig.scales.tablet.bodySmall};
  --font-size-caption-tablet: ${typographyConfig.scales.tablet.caption};

  /* Typography Scale - Desktop */
  --font-size-h1-desktop: ${typographyConfig.scales.desktop.h1};
  --font-size-h2-desktop: ${typographyConfig.scales.desktop.h2};
  --font-size-h3-desktop: ${typographyConfig.scales.desktop.h3};
  --font-size-h4-desktop: ${typographyConfig.scales.desktop.h4};
  --font-size-h5-desktop: ${typographyConfig.scales.desktop.h5};
  --font-size-h6-desktop: ${typographyConfig.scales.desktop.h6};
  --font-size-body-desktop: ${typographyConfig.scales.desktop.body};
  --font-size-body-large-desktop: ${typographyConfig.scales.desktop.bodyLarge};
  --font-size-body-small-desktop: ${typographyConfig.scales.desktop.bodySmall};
  --font-size-caption-desktop: ${typographyConfig.scales.desktop.caption};

  /* Font Families */
  --font-family-primary: ${typographyConfig.fonts.primary}, system-ui, sans-serif;
  --font-family-heading: ${typographyConfig.fonts.heading}, system-ui, sans-serif;

  /* Font Weights */
  --font-weight-light: ${typographyConfig.weights.light};
  --font-weight-regular: ${typographyConfig.weights.regular};
  --font-weight-medium: ${typographyConfig.weights.medium};
  --font-weight-semibold: ${typographyConfig.weights.semibold};
  --font-weight-bold: ${typographyConfig.weights.bold};
  --font-weight-black: ${typographyConfig.weights.black};

  /* Line Heights */
  --line-height-tight: ${typographyConfig.lineHeights.tight};
  --line-height-normal: ${typographyConfig.lineHeights.normal};
  --line-height-relaxed: ${typographyConfig.lineHeights.relaxed};
  --line-height-loose: ${typographyConfig.lineHeights.loose};
`;