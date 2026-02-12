import type { ImageSourcePropType } from 'react-native';

const ASSETS: Record<string, ImageSourcePropType> = {
  banner: require('../assets/images/Website_banner_2.jpg'),
  'saline-drip': require('../assets/icons/saline-drip.png'),
  pathology: require('../assets/icons/pathology.png'),
  endocrine: require('../assets/icons/endocrine.png'),
  'ecg-machine': require('../assets/icons/ecg-machine.png'),
  bio: require('../assets/icons/bio.png'),
  dna: require('../assets/icons/dna.png'),
};

const DEFAULT_IMAGE = require('../assets/icons/saline-drip.png');

/**
 * Map API imageUrl string to local require() image for display.
 */
export function getImageSource(imageUrl?: string | null): ImageSourcePropType {
  if (!imageUrl) return DEFAULT_IMAGE;
  return ASSETS[imageUrl] ?? DEFAULT_IMAGE;
}
