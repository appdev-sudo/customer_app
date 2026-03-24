import type { ImageSourcePropType } from 'react-native';

const ASSETS: Record<string, ImageSourcePropType> = {
  banner: require('../assets/images/Website_banner_2.jpg'),
  'saline-drip': require('../assets/icons/saline-drip.png'),
  endocrine: require('../assets/icons/endocrine.png'),
  'ecg-machine': require('../assets/icons/ecg-machine.png'),
  bio: require('../assets/icons/bio.png'),
  dna: require('../assets/icons/dna.png'),
  
  // Diagnostics
  pathology: require('../assets/images/diag_pathology.png'),
  radiology: require('../assets/images/diag_radiology.png'),
  cardiac: require('../assets/images/diag_cardiac.png'),
  'body-composition': require('../assets/images/diag_bodycomp.png'),
  genetics: require('../assets/images/diag_genetics.png'),
  'cancer-screening': require('../assets/images/diag_cancer.png'),
  
  // IV Drips
  'complete-recode': require('../assets/images/iv_complete_recode.png'),
  'renewal-series': require('../assets/images/iv_renewal_series.png'),
  'starter-evolution': require('../assets/images/iv_starter_evolution.png'),
  'vytal-power-plus': require('../assets/images/iv_vytal_power.png'),
  'vytal-shred-plus': require('../assets/images/iv_vytal_shred.png'),
  'vytal-liver-detox': require('../assets/images/iv_vytal_liver.png'),
  'vytal-iv-essentials': require('../assets/images/iv_vytal_essentials.png'),
  'vytal-cycle-support': require('../assets/images/iv_vytal_cycle.png'),
  'vytal-revive': require('../assets/images/iv_vytal_revive.png'),
  'vytal-immune-plus': require('../assets/images/iv_vytal_immune.png'),
  'vytal-detox': require('../assets/images/iv_vytal_detox.png'),
  'vytal-femme-strong': require('../assets/images/iv_vytal_femme.png'),
  'femme-strong': require('../assets/images/iv_vytal_femme.png'),
  'vytal-endure-plus': require('../assets/images/iv_vytal_endurance.png'),
  'endurance': require('../assets/images/iv_vytal_endurance.png'),
  'vytal-alpha-power': require('../assets/images/iv_vytal_alpha.png'),
  'alpha-athlete': require('../assets/images/iv_vytal_alpha.png'),
  'vytal-gut-cleanse': require('../assets/images/iv_vytal_gut.png'),
  'alpha-executive': require('../assets/images/iv_vytal_executive.png'),
  'vytal-hairboost': require('../assets/images/iv_vytal_hairboost.png'),
  'red-light-therapy': require('../assets/images/red_light_therapy.png'),
  'hyperbaric-oxygen': require('../assets/images/hyperbaric_oxygen.png'),
};

const DEFAULT_IMAGE = require('../assets/icons/saline-drip.png');

/**
 * Map API ID or imageUrl string to local require() image for display.
 */
export function getImageSource(id: string, imageUrl?: string | null): ImageSourcePropType {
  if (id && ASSETS[id]) return ASSETS[id];
  if (imageUrl && ASSETS[imageUrl]) return ASSETS[imageUrl];
  return DEFAULT_IMAGE;
}

