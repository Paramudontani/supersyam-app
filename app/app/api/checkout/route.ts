import { NextResponse } from 'main'; // หรือใช้ standard NextResponse จาก next/server
import { NextResponse as NextServerResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-28.acacia' as any,
});

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'promptpay'], // รองรับทั้งบัตรและสแกนพร้อมเพย์
      line_items: [
        {
          price_data: {
            currency: 'thb',
            product_data: {
              name: 'Supersyam Luxury Experience',
              description: 'แพ็กเกจท่องเที่ยวและบริการสุดเอ็กซ์คลูซีฟ',
            },
            unit_amount: 500000, // ราคา 5,000 บาท (หน่วยเป็นสตางค์)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/?success=true,
      cancel_url: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/?canceled=true,
    });

    return NextServerResponse.json({ url: session.url });
  } catch (error: any) {
    return NextServerResponse.json({ error: error.message }, { status: 500 });
  }
}