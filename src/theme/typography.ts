export const fonts = {
  // From Google Fonts links in header.php / index.php:
  // - Montserrat (custom.css @import, body + headings)
  // - Outfit (header.php L43)
  // - Baskervville (header.php L44, style.css L1101-L1103)
  primary: 'Montserrat',
  display: 'Outfit',
  serif: 'Baskervville',
};

export const fontSizes = {
  // Derived proportionally from desktop CSS but scaled for mobile
  h1: 32,
  h2: 24,
  h3: 20,
  body: 16,
  small: 14,
};

export const fontWeights = {
  thin: '200',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export type FontSizeName = keyof typeof fontSizes;

