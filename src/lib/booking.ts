export function getBookingHref(dealId: string): string {
  return `/api/book?id=${encodeURIComponent(dealId)}`;
}
