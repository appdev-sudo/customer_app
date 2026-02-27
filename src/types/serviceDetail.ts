import type { ImageSourcePropType } from 'react-native';

export type DetailSection = {
  title: string;
  items: string[];
};

export type ServiceDetailParam = {
  id?: string;
  title: string;
  subtitle?: string;
  fullDescription?: string;
  bullets?: string[];
  image?: ImageSourcePropType;
  /** e.g. "₹2,49,000" */
  price?: string;
  /** e.g. "20 IV Sessions • 6 Months" */
  sessionInfo?: string;
  /** e.g. "The Definitive Longevity & Cellular Reset" */
  tagline?: string;
  /** Structured sections e.g. A. Pre-Therapy, B. IV Sessions, C. Post-Therapy */
  sections?: DetailSection[];
  serviceType?: 'subscription' | 'individual';
};

export type MedicalServiceItem = {
  id: string;
  title: string;
  subtitle?: string;
  shortDescription?: string;
  fullDescription?: string;
  bullets?: string[];
  image: ImageSourcePropType;
  price?: string;
  sessionInfo?: string;
  tagline?: string;
  sections?: DetailSection[];
  serviceType?: 'subscription' | 'individual';
};
