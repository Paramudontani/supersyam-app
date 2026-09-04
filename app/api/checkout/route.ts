import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getInternalDeal } from '@/lib/partner/deals';

export async function POST(req: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      console.error('STRIPE_ERROR: ไม่พบ STRIPE_SECRET_KEY ในไฟล์ .env.local');
      return NextResponse.json(
        { error: 'ไม่พบ STRIPE_SECRET_KEY ในไฟล์ .env.local' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({})) as { email?: unknown; productIds?: unknown; paymentMethod?: unknown };
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const paymentMethod = body.paymentMethod === 'promptpay' || body.paymentMethod === 'card'
      ? body.paymentMethod
      : null;
    const productIds = Array.isArray(body.productIds)
      ? body.productIds.filter((id): id is string => typeof id === 'string')
      : [];

    const stripe = new Stripe(secretKey);
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (productIds.length > 0) {
      for (const productId of productIds) {
        const product = getInternalDeal(productId);
        if (!product) {
          return NextResponse.json({ error: `ไม่พบสินค้า ${productId}` }, { status: 400 });
        }
        lineItems.push({
          price_data: {
            currency: 'thb',
            product_data: { name: product.name },
            unit_amount: product.price * 100,
          },
          quantity: 1,
        });
      }
    } else {
      lineItems.push({
        price_data: {
          currency: 'thb',
          product_data: {
            name: 'Supersyam Luxury Experience',
            description: 'แพ็กเกจสมาชิกและบริการสุดเอ็กซ์คลูซีฟ',
          },
          unit_amount: 500000,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      ...(email ? { customer_email: email } : {}),
      line_items: lineItems,
      mode: 'payment',
      payment_method_types: paymentMethod ? [paymentMethod] : ['promptpay', 'card'],
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const stripeError = error as { message?: string; type?: string; code?: string; param?: string };
    console.error('--- STRIPE API ERROR DETAILED ---');
    console.error('Message:', stripeError.message);
    console.error('Type:', stripeError.type);
    console.error('Code:', stripeError.code);
    console.error('Param:', stripeError.param);
    console.error('--------------------------------');

    return NextResponse.json(
      { error: stripeError.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ Stripe' },
      { status: 400 }
    );
  }
}