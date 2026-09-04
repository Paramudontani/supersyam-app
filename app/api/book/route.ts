import { NextResponse } from 'next/server';
import {
  AffiliateConfigurationError,
  AffiliateProviderError,
  resolveAffiliateUrl,
} from '@/lib/affiliate';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ไม่พบรหัสดีล' }, { status: 400 });
  }

  try {
    const destination = await resolveAffiliateUrl(id);
    if (!destination) {
      return NextResponse.json({ error: 'ไม่พบดีลนี้' }, { status: 404 });
    }

    return NextResponse.redirect(destination, 302);
  } catch (error) {
    if (error instanceof AffiliateConfigurationError) {
      return NextResponse.json({ error: 'ระบบจองโรงแรมยังตั้งค่า Agoda ไม่ครบ' }, { status: 503 });
    }
    if (error instanceof AffiliateProviderError) {
      return NextResponse.json({ error: 'ระบบจองโรงแรมของพาร์ตเนอร์ขัดข้องชั่วคราว' }, { status: 502 });
    }
    return NextResponse.json({ error: 'ไม่สามารถสร้างลิงก์จองได้ในขณะนี้' }, { status: 502 });
  }
}
