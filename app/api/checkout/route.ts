import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) { // 👈 เพิ่ม req เพื่อรับข้อมูล User จากหน้าสมัคร
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      console.error('STRIPE_ERROR: ไม่พบ STRIPE_SECRET_KEY ในไฟล์ .env.local');
      return NextResponse.json(
        { error: 'ไม่พบ STRIPE_SECRET_KEY ในไฟล์ .env.local' },
        { status: 500 }
      );
    }

    // 1. รับข้อมูลที่ส่งมาจากฟอร์มสมัครสมาชิก (เช่น email, password)
    const body = await req.json().catch(() => ({}));
    const { email, password, name } = body;

    // 2. 🔥 สั่งบันทึก User เข้า Database / Auth System ของคุณตรงนี้!
    // (ตัวอย่าง: ถ้าใช้ Supabase/Prisma/Firebase ก็ใส่คำสั่งสร้าง User ตรงนี้)
    /* 
       await createUserInDatabase({ email, password, name });
    */

    const stripe = new Stripe(secretKey);
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // 3. สร้าง Checkout Session ตามเดิมของคุณ
    const session = await stripe.checkout.sessions.create({
      customer_email: email, // แนบอีเมลลูกค้าไปด้วย
      line_items: [
        {
          price_data: {
            currency: 'thb',
            product_data: {
              name: 'Supersyam Luxury Experience',
              description: 'แพ็กเกจท่องเที่ยวและบริการสุดเอ็กซ์คลูซีฟ',
            },
            unit_amount: 500000, // 5,000 THB (หน่วยสตางค์)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('--- STRIPE API ERROR DETAILED ---');
    console.error('Message:', error.message);
    console.error('Type:', error.type);
    console.error('Code:', error.code);
    console.error('Param:', error.param);
    console.error('--------------------------------');

    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ Stripe' },
      { status: 400 }
    );
  }
}