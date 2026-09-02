import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const catalog = new Map([
  ['h1', { name: 'โรงแรมหรูริมแม่น้ำเจ้าพระยา', price: 4200 }],
  ['h2', { name: 'พูลวิลล่าส่วนตัวใกล้หาดป่าตอง', price: 6500 }],
  ['h3', { name: 'รีสอร์ตท่ามกลางขุนเขาและหมอกเช้า', price: 2900 }],
  ['t1', { name: 'ทัวร์ล่องเรือเกาะพีพีเต็มวัน', price: 1500 }],
  ['t2', { name: 'บัตรเข้าชมมหานคร สกายวอล์ค', price: 880 }],
  ['t3', { name: 'ดินเนอร์ล่องเรือเจ้าพระยา', price: 1200 }],
  ['c1', { name: 'รถเช่าขับเอง รับที่สนามบิน', price: 950 }],
  ['c2', { name: 'รถตู้ VIP พร้อมคนขับนำเที่ยว', price: 2500 }],
  ['c3', { name: 'รถยนต์ไฟฟ้าสำหรับเที่ยวเมือง', price: 1100 }],
  ['b1', { name: 'ตั๋วรถทัวร์ กรุงเทพฯ - พัทยา', price: 180 }],
  ['b2', { name: 'รถทัวร์ VIP กรุงเทพฯ - เชียงใหม่', price: 780 }],
  ['b3', { name: 'ตั๋วรถทัวร์ กรุงเทพฯ - ภูเก็ต', price: 950 }],
  ['f1', { name: 'บุฟเฟต์วิวเมืองบนตึกใบหยก 2', price: 850 }],
  ['f2', { name: 'ดีลสตรีทฟู้ดมิชลินย่านเยาวราช', price: 500 }],
  ['f3', { name: 'เซ็ตอาหารเหนือรสต้นตำรับ', price: 690 }],
  ['a1', { name: 'เที่ยวบินไปกลับ กรุงเทพฯ - ภูเก็ต', price: 1890 }],
  ['a2', { name: 'เที่ยวบินไปกลับ กรุงเทพฯ - เชียงใหม่', price: 1490 }],
  ['a3', { name: 'เที่ยวบินไปกลับ กรุงเทพฯ - กระบี่', price: 2190 }],
  ['e1', { name: 'Thailand 5G eSIM เน็ตไม่จำกัด 10 วัน', price: 390 }],
  ['e2', { name: 'Thailand eSIM เน็ต 15GB ใช้ได้ 8 วัน', price: 249 }],
]);

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return NextResponse.json({ error: 'ยังไม่ได้ตั้งค่า Stripe secret key' }, { status: 503 });

  try {
    const body = await request.json() as { productIds?: unknown };
    const productIds = Array.isArray(body.productIds) ? body.productIds.filter((id): id is string => typeof id === 'string') : [];
    const lineItems = productIds.map((id) => {
      const product = catalog.get(id);
      if (!product) throw new Error('ไม่พบรายการสินค้า');
      return { price_data: { currency: 'thb', product_data: { name: product.name }, unit_amount: product.price * 100 }, quantity: 1 };
    });
    if (lineItems.length === 0) return NextResponse.json({ error: 'ตะกร้าว่าง' }, { status: 400 });

    const stripe = new Stripe(secretKey);
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${origin}/?payment=success`,
      cancel_url: `${origin}/?payment=cancelled`,
      billing_address_collection: 'auto',
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'สร้างหน้าชำระเงินไม่สำเร็จ';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
