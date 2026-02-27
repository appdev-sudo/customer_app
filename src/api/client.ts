import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { getImageSource } from '../utils/imageMap';
import type { MedicalServiceItem } from '../types/serviceDetail';
import type { DetailSection } from '../types/serviceDetail';

export type ApiMedicalService = {
  _id: string;
  serviceId: string;
  category: string;
  title: string;
  subtitle?: string;
  shortDescription?: string;
  fullDescription?: string;
  price?: string;
  sessionInfo?: string;
  tagline?: string;
  bullets?: string[];
  sections?: DetailSection[];
  imageUrl?: string;
  serviceType?: 'subscription' | 'individual';
  order?: number;
};

function mapApiServiceToItem(api: ApiMedicalService): MedicalServiceItem {
  return {
    id: api.serviceId,
    title: api.title,
    subtitle: api.subtitle,
    shortDescription: api.shortDescription,
    fullDescription: api.fullDescription,
    price: api.price,
    sessionInfo: api.sessionInfo,
    tagline: api.tagline,
    bullets: api.bullets,
    sections: api.sections,
    image: getImageSource(api.imageUrl),
    serviceType: api.serviceType,
  };
}

async function fetchApi<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const { token, ...init } = options ?? {};
  const headers: HeadersInit_ = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    ...(init.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Request failed: ${res.status}`);
  }
  return data as T;
}

/** Fetch all services, optionally by category. */
export async function getServices(
  category?: 'iv_drips' | 'diagnostics' | 'red_light' | 'hyperbaric' | 'longevity'
): Promise<MedicalServiceItem[]> {
  const path = category
    ? `${API_ENDPOINTS.services}?category=${category}`
    : API_ENDPOINTS.services;
  const list = await fetchApi<ApiMedicalService[]>(path);
  return list.map(mapApiServiceToItem);
}

/** Fetch a single service by id (Mongo _id or serviceId). */
export async function getService(id: string): Promise<MedicalServiceItem | null> {
  try {
    const api = await fetchApi<ApiMedicalService>(API_ENDPOINTS.serviceById(id));
    return mapApiServiceToItem(api);
  } catch {
    return null;
  }
}

/** Health check. */
export async function healthCheck(): Promise<{ ok: boolean }> {
  return fetchApi<{ ok: boolean }>(API_ENDPOINTS.health);
}
