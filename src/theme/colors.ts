export const colors = {
  // Brand background & surfaces (from style.css body / custom.css)
  backgroundNavy: '#0e253d', // body background-color (style.css L80 / custom.css L15)
  backgroundBlack: '#0c0c0c', // dark sections & footer (style.css L178, L1493)
  backgroundWhite: '#ffffff', // light cards / sections

  // Brand accents
  accentOrange: '#ee7f1a', // primary orange (custom.css L22-24, buttons; Founding 100)
  accentAqua: '#7fffd4', // highlight aqua (custom.css L1177, L1715; hero quote, headings)
  accentCyan: '#4dd6ff', // light blue (custom.css borders/buttons; Enquire Now)
  accentYellow: '#f5d042', // longevity card titles (Image 2)
  accentBrown: '#af7e62', // brown accent (style.css L252, L1654)
  accentRed: '#ff5e5e', // red accent (style.css L1097, L657-663)

  // Text colors (Bootstrap palette used by site)
  textPrimary: '#ffffff', // main body text on dark
  textMuted: '#ced4da', // var(--bs-gray-400) approximate (bootstrap 5.3)
  textSecondary: '#6c757d', // var(--bs-gray-600)
  textDark: '#212529', // var(--bs-gray-900)

  // Utility
  borderSubtle: '#495057', // var(--bs-gray-700)
};

export type ColorName = keyof typeof colors;

