import type { Category } from '@/lib/partner/types';

export function getBookingHref(dealId: string): string {
  return `/api/book?id=${encodeURIComponent(dealId)}`;
}

export function getCategoryBookingHref(category: Category): string {
  return `/api/book?category=${encodeURIComponent(category)}`;
}
