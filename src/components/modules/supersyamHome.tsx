'use client';

import { useState } from 'react';
import { getKlookThailandUrl } from '@/lib/affiliate';

type Category = 'hotels' | 'tours' | 'cars' | 'food' | 'esim';

type Product = {
  id: string;
  name: string;
  location: string;
  type: string;
  price: number;
};

const categories: Array<{ id: Category; label: string; icon: string }> = [
  { id: 'hotels', label: 'โรงแรมที่พัก', icon: '🏨' },
  { id: 'tours', label: 'ตั๋ว & ทัวร์', icon: '🎟️' },
  { id: 'cars', label: 'รถเช่า', icon: '🚗' },
  { id: 'food', label: 'ร้านอาหาร', icon: '🍲' },
  { id: 'esim', label: 'ซิม & eSIM', icon: '📱' },
];

const products: Record<Category, Product[]> = {
  hotels: [
    { id: 'h1', name: 'โรงแรมหรูริมแม่น้ำเจ้าพระยา', location: 'กรุงเทพฯ', type: 'โรงแรม', price: 4200 },
    { id: 'h2', name: 'พูลวิลล่าส่วนตัวใกล้หาดป่าตอง', location: 'ภูเก็ต', type: 'โรงแรม', price: 6500 },
    { id: 'h3', name: 'รีสอร์ตท่ามกลางขุนเขาและหมอกเช้า', location: 'เชียงใหม่', type: 'โรงแรม', price: 2900 },
  ],
  tours: [
    { id: 't1', name: 'ทัวร์ล่องเรือเกาะพีพีเต็มวัน', location: 'ภูเก็ต - กระบี่', type: 'ทัวร์', price: 1500 },
    { id: 't2', name: 'บัตรเข้าชมมหานคร สกายวอล์ค', location: 'กรุงเทพฯ', type: 'ตั๋ว', price: 880 },
    { id: 't3', name: 'ดินเนอร์ล่องเรือเจ้าพระยา', location: 'กรุงเทพฯ', type: 'ทัวร์', price: 1200 },
  ],
  cars: [
    { id: 'c1', name: 'รถเช่าขับเอง รับที่สนามบิน', location: 'สุวรรณภูมิ', type: 'รถเช่า', price: 950 },
    { id: 'c2', name: 'รถตู้ VIP พร้อมคนขับนำเที่ยว', location: 'เชียงใหม่', type: 'รถเช่า', price: 2500 },
    { id: 'c3', name: 'รถยนต์ไฟฟ้าสำหรับเที่ยวเมือง', location: 'ภูเก็ต', type: 'รถเช่า', price: 1100 },
  ],
  food: [
    { id: 'f1', name: 'บุฟเฟต์วิวเมืองบนตึกใบหยก 2', location: 'กรุงเทพฯ', type: 'ร้านอาหาร', price: 850 },
    { id: 'f2', name: 'ดีลสตรีทฟู้ดมิชลินย่านเยาวราช', location: 'กรุงเทพฯ', type: 'ร้านอาหาร', price: 500 },
    { id: 'f3', name: 'เซ็ตอาหารเหนือรสต้นตำรับ', location: 'เชียงใหม่', type: 'ร้านอาหาร', price: 690 },
  ],
  esim: [
    { id: 'e1', name: 'Thailand 5G eSIM เน็ตไม่จำกัด 10 วัน', location: 'ทั่วประเทศไทย', type: 'eSIM', price: 390 },
    { id: 'e2', name: 'Thailand eSIM เน็ต 15GB ใช้ได้ 8 วัน', location: 'ทั่วประเทศไทย', type: 'eSIM', price: 249 },
  ],
};

export function SupersyamHome() {
  const [category, setCategory] = useState<Category>('hotels');
  const [cart, setCart] = useState<Product[]>([]);

  return (
    <div className="travel-app">
      <header className="travel-header">
        <a className="travel-logo" href="#top"><span>✦</span> supersyam</a>
        <nav className="travel-nav" aria-label="เมนูหลัก"><a href="#popular">ยอดนิยม</a><a href="#footer">เกี่ยวกับเรา</a></nav>
        <button className="cart-button" onClick={() => document.getElementById('cart')?.scrollIntoView({ behavior: 'smooth' })} type="button">🛒 ตะกร้า <b>{cart.length}</b></button>
      </header>

      <main id="top">
        <section className="travel-hero">
          <div className="hero-content"><p className="hero-kicker">THAILAND, YOUR WAY</p><h1>ออกไปค้นพบ<br /><em>ความสุข</em> ที่ใช่</h1><p>จองโรงแรม กิจกรรม และประสบการณ์ดีๆ ทั่วประเทศไทย ในที่เดียว</p><div className="hero-search"><span>⌕</span><input aria-label="ค้นหาจุดหมาย" placeholder="คุณอยากไปที่ไหน? เช่น ภูเก็ต" /><button onClick={() => document.getElementById('popular')?.scrollIntoView({ behavior: 'smooth' })} type="button">ค้นหา</button></div></div>
          <div className="hero-scene"><div className="scene-sun" /><div className="scene-wave wave-one" /><div className="scene-wave wave-two" /><div className="scene-stamp">EXPLORE<br /><strong>THAILAND</strong><br />SINCE 2026</div></div>
        </section>

        <section className="quick-section"><p className="section-kicker">วางแผนทริปของคุณ</p><h2>เลือกสิ่งที่คุณกำลังมองหา</h2><div className="quick-grid">{categories.map((item) => <button className={category === item.id ? 'quick-card active' : 'quick-card'} key={item.id} onClick={() => setCategory(item.id)} type="button"><span className="quick-icon">{item.icon}</span><strong>{item.label}</strong><small>ค้นหาดีลที่ดีที่สุด</small><span className="quick-arrow">↗</span></button>)}</div></section>

        <section className="products-section" id="popular"><div className="products-heading"><div><p className="section-kicker">ดีลที่คัดมาให้คุณ</p><h2>ยอดนิยมในประเทศไทย</h2></div><span className="all-link">{products[category].length} รายการ ↗</span></div><div className="product-grid">{products[category].map((product) => <article className="product-card" key={product.id}><div className="product-image"><span>{product.type}</span><b>{product.location}</b><div className={`product-pattern pattern-${category}`} /></div><div className="product-info"><h3>{product.name}</h3><p className="rating">★★★★★ <span>4.8 (120)</span></p><div className="product-bottom"><div><small>เริ่มต้นที่</small><strong>฿{product.price.toLocaleString()}</strong></div><button onClick={() => setCart((currentCart) => [...currentCart, product])} type="button">+ เพิ่มลงตะกร้า</button></div><a href={getKlookThailandUrl('activity')} rel="noopener noreferrer" target="_blank">ดูดีลจากพาร์ตเนอร์ Klook ↗</a></div></article>)}</div></section>
        <section className="cart-summary" id="cart"><h2>ตะกร้าของคุณ</h2>{cart.length === 0 ? <p>ยังไม่มีรายการในตะกร้า</p> : <p>มี {cart.length} รายการพร้อมวางแผนการจอง</p>}</section>
      </main>
      <footer className="travel-footer" id="footer"><strong>✦ supersyam</strong><span>เที่ยวไทยในแบบของคุณ</span><span>© 2026 Supersyam Thailand</span></footer>
    </div>
  );
}

export default SupersyamHome;
