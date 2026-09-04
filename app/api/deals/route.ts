import { NextResponse } from 'next/server';
import { getPublicDeals, getPublicDealsByCategory } from '@/lib/partner/deals';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  if (category) {
    return NextResponse.json({ deals: getPublicDeals(category) });
  }

  return NextResponse.json({ byCategory: getPublicDealsByCategory() });
}
