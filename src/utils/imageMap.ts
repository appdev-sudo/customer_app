import type { ImageSourcePropType } from 'react-native';

const ASSETS: Record<string, ImageSourcePropType> = {
  banner: { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/Website_banner_2.jpg' },
  'saline-drip': require('../assets/icons/saline-drip.png'),
  endocrine: require('../assets/icons/endocrine.png'),
  'ecg-machine': require('../assets/icons/ecg-machine.png'),
  bio: require('../assets/icons/bio.png'),
  dna: require('../assets/icons/dna.png'),
  
  // Diagnostics
  pathology: { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/diag_pathology.png' },
  radiology: { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/diag_radiology.png' },
  cardiac: { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/diag_cardiac.png' },
  'body-composition': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/diag_bodycomp.png' },
  genetics: { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/diag_genetics.png' },
  'cancer-screening': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/diag_cancer.png' },
  
  // IV Drips
  'complete-recode': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/iv_complete_recode.png' },
  'renewal-series': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/iv_renewal_series.png' },
  'starter-evolution': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/iv_starter_evolution.png' },
  'vytal-power-plus': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/iv_vytal_power.png' },
  'vytal-shred-plus': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/iv_vytal_shred.png' },
  'vytal-liver-detox': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/iv_vytal_liver.png' },
  'vytal-iv-essentials': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/iv_vytal_essentials.png' },
  'vytal-cycle-support': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/iv_vytal_cycle.png' },
  'vytal-revive': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/iv_vytal_revive.png' },
  'vytal-immune-plus': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/iv_vytal_immune.png' },
  'vytal-detox': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/iv_vytal_detox.png' },
  'vytal-femme-strong': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/iv_vytal_femme.png' },
  'femme-strong': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/iv_vytal_femme.png' },
  'vytal-endure-plus': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/iv_vytal_endurance.png' },
  'endurance': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/iv_vytal_endurance.png' },
  'vytal-alpha-power': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/iv_vytal_alpha.png' },
  'alpha-athlete': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/iv_vytal_alpha.png' },
  'vytal-gut-cleanse': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/iv_vytal_gut.png' },
  'alpha-executive': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/iv_vytal_executive.png' },
  'vytal-hairboost': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/iv_vytal_hairboost.png' },
  'red-light-therapy': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/red_light_therapy.png' },
  'hyperbaric-oxygen': { uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/hyperbaric_oxygen.png' },
};

const DEFAULT_IMAGE = require('../assets/icons/saline-drip.png');

/**
 * Map API ID or imageUrl string to local require() image for display, or an S3 network link.
 */
export function getImageSource(id: string, imageUrl?: string | null): ImageSourcePropType {
  // Directly support S3 bucket URLs from the database
  if (imageUrl && imageUrl.startsWith('http')) {
    return { uri: imageUrl };
  }

  // Fallbacks to local mappings
  if (id && ASSETS[id]) return ASSETS[id];
  if (imageUrl && ASSETS[imageUrl]) return ASSETS[imageUrl];
  
  return DEFAULT_IMAGE;
}

