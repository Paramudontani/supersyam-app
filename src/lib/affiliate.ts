import { getInternalDeal } from '@/lib/partner/deals';
import type { Category } from '@/lib/partner/types';

type AgodaSearchResponse = {
  error?: { message?: string };
  results?: Array<{ landingURL?: string }>;
};

export class AffiliateConfigurationError extends Error {}
export class AffiliateProviderError extends Error {}

const agodaApiUrl = process.env.AGODA_API_URL ?? 'http://affiliateapi7643.agoda.com/affiliateservice/lt_v1';

function getKlookTrackingUrl(path: string): string {
  const currentPaths: Record<string, string> = {
    activity: 'experiences',
    'car-rental': 'car-rentals',
    'bus-tickets': 'transport',
    flights: '',
    esim: '',
  };
  const currentPath = currentPaths[path] ?? path;
  const destination = `https://www.klook.com/th/${currentPath}`;
  return `https://affiliate.klook.com/redirect?aid=133386&aff_adid=1411178&k_site=${encodeURIComponent(destination)}&utm_source=supersyam&utm_medium=affiliate&utm_campaign=thailand-${encodeURIComponent(path)}`;
}

const klookCategoryPaths: Record<Category, string> = {
  hotels: 'hotels',
  tours: 'activity',
  cars: 'car-rental',
  buses: 'bus-tickets',
  food: 'activity',
  flights: 'flights',
  esim: 'esim',
};

export function resolveCategoryAffiliateUrl(category: string): string | null {
  const path = klookCategoryPaths[category as Category];
  return path ? getKlookTrackingUrl(path) : null;
}

function getFutureStayDates(): { checkInDate: string; checkOutDate: string } {
  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + 7);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 1);

  return {
    checkInDate: checkIn.toISOString().slice(0, 10),
    checkOutDate: checkOut.toISOString().slice(0, 10),
  };
}

function getAgodaCityIds(): Record<string, number> {
  const value = process.env.AGODA_CITY_IDS;
  if (!value) return {};

  try {
    const cityIds = JSON.parse(value) as unknown;
    if (!cityIds || typeof cityIds !== 'object' || Array.isArray(cityIds)) return {};
    return Object.fromEntries(
      Object.entries(cityIds).filter((entry): entry is [string, number] => typeof entry[1] === 'number'),
    );
  } catch {
    return {};
  }
}

async function getAgodaTrackingUrl(cityName: string): Promise<string | null> {
  const authorization = process.env.AGODA_AUTHORIZATION;
  const cityId = getAgodaCityIds()[cityName];
  if (!authorization || !cityId) {
    throw new AffiliateConfigurationError(`Agoda configuration is missing for ${cityName}`);
  }

  const { checkInDate, checkOutDate } = getFutureStayDates();
  const response = await fetch(agodaApiUrl, {
    method: 'POST',
    headers: {
      'Accept-Encoding': 'gzip, deflate',
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      criteria: {
        cityId,
        checkInDate,
        checkOutDate,
        additional: {
          currency: 'THB',
          discountOnly: false,
          language: 'th-th',
          maxResult: 1,
          occupancy: { numberOfAdult: 2, numberOfChildren: 0 },
          sortBy: 'Recommended',
        },
      },
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new AffiliateProviderError(`Agoda Lite Search returned ${response.status}`);
  }
  const payload = await response.json() as AgodaSearchResponse;
  if (payload.error?.message) {
    throw new AffiliateProviderError(`Agoda Lite Search: ${payload.error.message}`);
  }
  return payload.results?.[0]?.landingURL ?? null;
}

export async function resolveAffiliateUrl(dealId: string): Promise<string | null> {
  const deal = getInternalDeal(dealId);
  if (!deal) return null;
  if (deal.tracking.network === 'agoda') return getAgodaTrackingUrl(deal.tracking.path);
  return getKlookTrackingUrl(deal.tracking.path);
}
