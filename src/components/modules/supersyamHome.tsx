'use client';

import { FormEvent, useEffect, useState } from 'react';
import { getKlookThailandUrl } from '@/lib/affiliate';
import { supabase } from '@/lib/supabase';

type View = 'home' | 'auth' | 'cart' | 'dashboard';
type Category = 'hotels' | 'tours' | 'cars' | 'food' | 'esim';
type Product = { id: string; name: string; price: number; type: string; location: string };

const categories: Array<{ id: Category; label: string; icon: string }> = [
  { id: 'hotels', label: 'โรงแรมที่พัก', icon: '🏨' },
  { id: 'tours', label: 'ตั๋ว & ทัวร์', icon: '🎟️' },
  { id: 'cars', label: 'รถเช่า', icon: '🚗' },
  { id: 'food', label: 'ร้านอาหาร', icon: '🍲' },
  { id: 'esim', label: 'ซิม & eSIM', icon: '📱' },
];

const products: Record<Category, Product[]> = {
  hotels: [
    { id: 'h1', name: 'โรงแรมหรู 5 ดาว ริมแม่น้ำเจ้าพระยา', price: 4200, type: 'โรงแรม', location: 'กรุงเทพฯ' },
    { id: 'h2', name: 'พูลวิลล่าส่วนตัว ใกล้หาดป่าตอง', price: 6500, type: 'โรงแรม', location: 'ภูเก็ต' },
    { id: 'h3', name: 'รีสอร์ตท่ามกลางขุนเขาและหมอกเช้า', price: 2900, type: 'โรงแรม', location: 'เชียงใหม่' },
  ],
  tours: [
    { id: 't1', name: 'ทัวร์ล่องเรือเกาะพีพีเต็มวัน', price: 1500, type: 'ตั๋วท่องเที่ยว', location: 'ภูเก็ต - กระบี่' },
    { id: 't2', name: 'บัตรเข้าชมมหานคร สกายวอล์ค', price: 880, type: 'ตั๋วท่องเที่ยว', location: 'กรุงเทพฯ' },
    { id: 't3', name: 'ดินเนอร์ล่องเรือเจ้าพระยาพร้อมวิวเมือง', price: 1200, type: 'ตั๋วท่องเที่ยว', location: 'กรุงเทพฯ' },
  ],
  cars: [
    { id: 'c1', name: 'รถเช่าขับเอง รับที่สนามบิน', price: 950, type: 'รถเช่า', location: 'สุวรรณภูมิ' },
    { id: 'c2', name: 'รถตู้ VIP พร้อมคนขับนำเที่ยว', price: 2500, type: 'รถเช่า', location: 'เชียงใหม่' },
    { id: 'c3', name: 'รถยนต์ไฟฟ้าสำหรับเที่ยวเมือง', price: 1100, type: 'รถเช่า', location: 'ภูเก็ต' },
  ],
  food: [
    { id: 'f1', name: 'บุฟเฟต์วิวเมืองบนตึกใบหยก 2', price: 850, type: 'ร้านอาหาร', location: 'กรุงเทพฯ' },
    { id: 'f2', name: 'ดีลสตรีทฟู้ดมิชลินย่านเยาวราช', price: 500, type: 'ร้านอาหาร', location: 'กรุงเทพฯ' },
    { id: 'f3', name: 'เซ็ตอาหารเหนือรสต้นตำรับ', price: 690, type: 'ร้านอาหาร', location: 'เชียงใหม่' },
  ],
  esim: [
    { id: 'e1', name: 'Thailand 5G eSIM เน็ตไม่จำกัด 10 วัน', price: 390, type: 'ซิมการ์ด', location: 'ใช้ได้ทั่วไทย' },
    { id: 'e2', name: 'Thailand eSIM เน็ต 15GB ใช้ได้ 8 วัน', price: 249, type: 'ซิมการ์ด', location: 'ใช้ได้ทั่วไทย' },
  ],
};

export function SupersyamHome() {
  const [view, setView] = useState<View>('home');
  const [category, setCategory] = useState<Category>('hotels');
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) window.alert(`เข้าสู่ระบบไม่สำเร็จ: ${error.message}`);
    else setView('home');
  }

  async function handleRegister() {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) window.alert(`สมัครสมาชิกไม่สำเร็จ: ${error.message}`);
    else window.alert('สมัครสมาชิกสำเร็จ กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี');
  }

  const total = cart.reduce((sum, product) => sum + product.price, 0);

  return (
    <div className="travel-app">
      <header className="travel-header">
        <button className="travel-logo" onClick={() => setView('home')} type="button"><span>✦</span> supersyam</button>
        <nav className="travel-nav" aria-label="เมนูหลัก"><button onClick={() => setView('home')} type="button">ค้นหากิจกรรม</button><a href="#popular">ยอดนิยม</a><a href="#footer">เกี่ยวกับเรา</a></nav>
        <div className="header-tools"><button className="cart-button" onClick={() => setView('cart')} type="button">🛒 ตะกร้า <b>{cart.length}</b></button>{user ? <button className="account-button" onClick={() => setView('dashboard')} type="button">👤 บัญชีของฉัน</button> : <button className="account-button" onClick={() => setView('auth')} type="button">เข้าสู่ระบบ</button>}</div>
      </header>

      {view === 'home' && <main>
        <section className="travel-hero"><div className="hero-content"><p className="hero-kicker">THAILAND, YOUR WAY</p><h1>ออกไปค้นพบ<br /><em>ความสุข</em> ที่ใช่</h1><p>จองโรงแรม กิจกรรม และประสบการณ์ดีๆ ทั่วประเทศไทย ในที่เดียว</p><div className="hero-search"><span>⌕</span><input aria-label="ค้นหาจุดหมาย" placeholder="คุณอยากไปที่ไหน? เช่น ภูเก็ต" /><button onClick={() => document.getElementById('popular')?.scrollIntoView({ behavior: 'smooth' })} type="button">ค้นหา</button></div></div><div className="hero-scene"><div className="scene-sun" /><div className="scene-wave wave-one" /><div className="scene-wave wave-two" /><div className="scene-stamp">EXPLORE<br /><strong>THAILAND</strong><br />SINCE 2026</div></div></section>
        <section className="quick-section"><p className="section-kicker">วางแผนทริปของคุณ</p><h2>เลือกสิ่งที่คุณกำลังมองหา</h2><div className="quick-grid">{categories.map((item) => <button className={category === item.id ? 'quick-card active' : 'quick-card'} key={item.id} onClick={() => setCategory(item.id)} type="button"><span className="quick-icon">{item.icon}</span><strong>{item.label}</strong><small>ค้นหาดีลที่ดีที่สุด</small><span className="quick-arrow">↗</span></button>)}</div></section>
        <section className="products-section" id="popular"><div className="products-heading"><div><p className="section-kicker">ดีลที่คัดมาให้คุณ</p><h2>ยอดนิยมในประเทศไทย</h2></div><span className="all-link">{products[category].length} รายการ ↗</span></div><div className="product-grid">{products[category].map((product) => <article className="product-card" key={product.id}><div className="product-image"><span>{product.type}</span><b>{product.location}</b><div className={`product-pattern pattern-${category}`} /></div><div className="product-info"><h3>{product.name}</h3><p className="rating">★★★★★ <span>4.8 (120)</span></p><div className="product-bottom"><div><small>เริ่มต้นที่</small><strong>฿{product.price.toLocaleString()}</strong></div><button onClick={() => setCart((currentCart) => [...currentCart, product])} type="button">+ เพิ่มลงตะกร้า</button></div><a href={getKlookThailandUrl('activity')} rel="noopener noreferrer" target="_blank">ดูดีลจากพาร์ตเนอร์ Klook ↗</a></div></article>)}</div></section>
      </main>}

      {view === 'auth' && <section className="panel-view"><div className="account-panel"><p className="section-kicker">WELCOME TO SUPERSYAM</p><h2>เข้าสู่ระบบ / สมัครสมาชิก</h2><form onSubmit={handleLogin}><label>อีเมล<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>รหัสผ่าน<input minLength={6} required type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label><div className="form-actions"><button className="primary-action" type="submit">เข้าสู่ระบบ</button><button className="secondary-action" onClick={handleRegister} type="button">สมัครสมาชิก</button></div></form><button className="back-link" onClick={() => setView('home')} type="button">← กลับหน้าหลัก</button></div></section>}
      {view === 'cart' && <section className="panel-view"><div className="account-panel cart-panel"><p className="section-kicker">YOUR TRIP</p><h2>ตะกร้าและการจอง <span>({cart.length})</span></h2>{cart.length === 0 ? <p className="empty-state">ยังไม่มีรายการในตะกร้า<br /><button className="back-link" onClick={() => setView('home')} type="button">ไปค้นหากิจกรรม</button></p> : <><div className="cart-list">{cart.map((product, index) => <div className="cart-row" key={`${product.id}-${index}`}><div><strong>{product.name}</strong><small>{product.type} · {product.location}</small></div><b>฿{product.price.toLocaleString()}</b></div>)}</div><div className="cart-total"><span>ยอดรวมโดยประมาณ</span><strong>฿{total.toLocaleString()}</strong></div><button className="primary-action checkout-action" onClick={() => window.alert('ระบบจะนำคุณไปยังหน้าชำระเงินในขั้นตอนถัดไป')} type="button">ดำเนินการจองต่อ →</button></>}<button className="back-link" onClick={() => setView('home')} type="button">← กลับหน้าหลัก</button></div></section>}
      {view === 'dashboard' && <section className="panel-view"><div className="account-panel"><p className="section-kicker">YOUR ACCOUNT</p><h2>บัญชีของฉัน</h2><p className="signed-email">{user?.email}</p><button className="secondary-action" onClick={async () => { await supabase.auth.signOut(); setUser(null); setView('home'); }} type="button">ออกจากระบบ</button><br /><button className="back-link" onClick={() => setView('home')} type="button">← กลับหน้าหลัก</button></div></section>}

      <footer className="travel-footer" id="footer"><strong>✦ supersyam</strong><span>เที่ยวไทยในแบบของคุณ</span><span>© 2026 Supersyam Thailand</span></footer>
    </div>
  );
}

export default SupersyamHome;
