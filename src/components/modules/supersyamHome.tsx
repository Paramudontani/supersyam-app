'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { DealCard } from '@/components/DealCard';
import { getBookingHref } from '@/lib/booking';
import type { Category, PublicDeal } from '@/lib/partner/types';
import { supabase } from '@/lib/supabase';

type View = 'home' | 'auth' | 'dashboard';

type Booking = {
  id: string;
  product_name: string;
  amount: number;
  status: string;
  created_at: string;
};

type PaymentIntent = {
  amount: number;
  products: PublicDeal[];
};

const membershipFee = 5000;

const categories: Array<{ id: Category; label: string; icon: string }> = [
  { id: 'hotels', label: 'โรงแรมที่พัก', icon: '🏨' },
  { id: 'tours', label: 'ตั๋ว & ทัวร์', icon: '🎟️' },
  { id: 'cars', label: 'รถเช่า', icon: '🚗' },
  { id: 'buses', label: 'ตั๋วรถทัวร์', icon: '🚌' },
  { id: 'food', label: 'ร้านอาหาร', icon: '🍲' },
  { id: 'flights', label: 'ตั๋วเครื่องบิน', icon: '✈️' },
  { id: 'esim', label: 'ซิม & eSIM', icon: '📱' },
];

const provinceHighlights = [
  { province: 'กรุงเทพฯ', place: 'วัดอรุณฯ และเยาวราช', food: 'ก๋วยเตี๋ยวเรือ' },
  { province: 'เชียงใหม่', place: 'ดอยสุเทพ และถนนนิมมาน', food: 'ข้าวซอย' },
  { province: 'ภูเก็ต', place: 'เมืองเก่า และแหลมพรหมเทพ', food: 'หมี่ฮกเกี้ยน' },
  { province: 'พระนครศรีอยุธยา', place: 'วัดมหาธาตุ และวัดไชยวัฒนาราม', food: 'กุ้งแม่น้ำเผา' },
];

const emptyCatalog: Record<Category, PublicDeal[]> = {
  hotels: [],
  tours: [],
  cars: [],
  buses: [],
  food: [],
  flights: [],
  esim: [],
};

export function SupersyamHome() {
  const [view, setView] = useState<View>('home');
  const [category, setCategory] = useState<Category>('hotels');
  const [catalog, setCatalog] = useState<Record<Category, PublicDeal[]>>(emptyCatalog);
  const [cart, setCart] = useState<PublicDeal[]>([]);
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<PublicDeal | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [pendingPayment, setPendingPayment] = useState<PaymentIntent>({ amount: membershipFee, products: [] });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user.email ?? null);
      setUserId(session?.user.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null);
      setUserId(session?.user.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetch('/api/deals')
      .then((response) => response.json() as Promise<{ byCategory?: Record<Category, PublicDeal[]> }>)
      .then((payload) => {
        if (payload.byCategory) setCatalog(payload.byCategory);
      })
      .catch(() => undefined);
  }, []);

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError('');
    const result = authMode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (result.error) {
      setAuthError(result.error.message);
      return;
    }

    const account = result.data.user;
    if (!account) {
      setAuthError('ยืนยันบัญชีไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      return;
    }

    setUserEmail(account.email ?? email);
    setUserId(account.id);
    try {
      await createStripeCheckout(account.id, account.email ?? email, pendingPayment);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'เปิดหน้าชำระเงินไม่สำเร็จ');
    }
  }

  async function createStripeCheckout(accountUserId: string, accountEmail: string, payment: PaymentIntent) {
    if (payment.products.length > 0) {
      const { error: bookingError } = await supabase.from('bookings').insert(payment.products.map((product) => ({
        user_id: accountUserId,
        product_id: product.id,
        product_name: product.name,
        amount: product.price,
        status: 'pending',
      })));
      if (bookingError) throw bookingError;
    }

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: accountEmail,
        productIds: payment.products.map((product) => product.id),
      }),
    });
    const result = await response.json() as { url?: string; error?: string };
    if (!response.ok || !result.url) throw new Error(result.error || 'Stripe ไม่สามารถสร้างหน้าชำระเงินได้');
    window.location.assign(result.url);
  }

  async function startCheckout() {
    const payment = {
      amount: cart.reduce((sum, product) => sum + product.price, 0),
      products: [...cart],
    };

    if (!userEmail || !userId) {
      setCheckoutError('กรุณาเข้าสู่ระบบก่อนชำระเงิน');
      setPendingPayment(payment);
      setAuthMode('login');
      setView('auth');
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError('');
    try {
      await createStripeCheckout(userId, userEmail, payment);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'ลองใหม่อีกครั้ง');
    } finally {
      setIsCheckingOut(false);
    }
  }

  const visibleProducts = useMemo(() => {
    const keyword = query.toLowerCase().trim();
    return catalog[category].filter((product) => `${product.name} ${product.location}`.toLowerCase().includes(keyword));
  }, [catalog, category, query]);

  const compareProducts = catalog[category].filter((product) => compareIds.includes(product.id));
  const toggleCompare = (productId: string) => setCompareIds((ids) => (
    ids.includes(productId)
      ? ids.filter((id) => id !== productId)
      : ids.length < 3
        ? [...ids, productId]
        : ids
  ));

  async function loadBookings() {
    if (!userId) return;
    const { data } = await supabase
      .from('bookings')
      .select('id, product_name, amount, status, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setBookings((data as Booking[] | null) ?? []);
  }

  return (
    <div className="travel-app">
      <header className="travel-header">
        <a className="travel-logo" href="#top" aria-label="Supersyam หน้าแรก">
          <span className="brand-monogram" aria-hidden="true">S</span>
          <span className="brand-wordmark">SUPERSYAM<small>CURATED JOURNEYS</small></span>
        </a>
        <nav className="travel-nav" aria-label="เมนูหลัก"><a href="#popular">ยอดนิยม</a><a href="#footer">เกี่ยวกับเรา</a></nav>
        <div className="header-tools">
          <button className="cart-button" onClick={() => document.getElementById('cart')?.scrollIntoView({ behavior: 'smooth' })} type="button">ตะกร้า <b>{cart.length}</b></button>
          {userEmail
            ? <button className="account-button" onClick={() => { setView('dashboard'); void loadBookings(); }} type="button">👤 บัญชีของฉัน</button>
            : <>
                <button className="signup-button" onClick={() => { setPendingPayment({ amount: membershipFee, products: [] }); setAuthMode('signup'); setAuthError(''); setView('auth'); }} type="button">สมัครสมาชิก</button>
                <button className="account-button" onClick={() => { setPendingPayment({ amount: membershipFee, products: [] }); setAuthMode('login'); setAuthError(''); setView('auth'); }} type="button">เข้าสู่ระบบ</button>
              </>}
        </div>
      </header>

      <main id="top">
        <section className="travel-hero">
          <div className="hero-content">
            <p className="hero-kicker">THAILAND, YOUR WAY</p>
            <h1>ออกไปค้นพบ<br /><em>ความสุข</em> ที่ใช่</h1>
            <p>จองโรงแรม กิจกรรม และประสบการณ์ดีๆ ทั่วประเทศไทย ในที่เดียว</p>
            <div className="hero-search">
              <span>⌕</span>
              <input aria-label="ค้นหาจุดหมาย" onChange={(event) => setQuery(event.target.value)} placeholder="คุณอยากไปที่ไหน? เช่น ภูเก็ต" value={query} />
              <button onClick={() => document.getElementById('popular')?.scrollIntoView({ behavior: 'smooth' })} type="button">ค้นหา</button>
            </div>
          </div>
          <div className="hero-scene">
            <div className="scene-sun" />
            <div className="scene-wave wave-one" />
            <div className="scene-wave wave-two" />
            <div className="scene-stamp"><i>S</i><strong>SUPERSYAM</strong><small>CURATED JOURNEYS</small></div>
          </div>
        </section>

        <section className="quick-section">
          <p className="section-kicker">วางแผนทริปของคุณ</p>
          <h2>เลือกสิ่งที่คุณกำลังมองหา</h2>
          <div className="quick-grid">
            {categories.map((item) => (
              <button className={category === item.id ? 'quick-card active' : 'quick-card'} key={item.id} onClick={() => setCategory(item.id)} type="button">
                <span className="quick-icon">{item.icon}</span>
                <strong>{item.label}</strong>
                <small>ค้นหาดีลที่ดีที่สุด</small>
                <span className="quick-arrow">↗</span>
              </button>
            ))}
          </div>
        </section>

        <section className="province-section" aria-labelledby="province-heading">
          <div className="province-heading">
            <div>
              <p className="section-kicker">Siam Notes</p>
              <h2 id="province-heading">ไปจังหวัดไหนดี</h2>
            </div>
            <p>จุดหมายและรสชาติที่ไม่ควรพลาด</p>
          </div>
          <div className="province-grid">
            {provinceHighlights.map((highlight) => (
              <button
                aria-label={`ดูดีลใน${highlight.province}`}
                className="province-card"
                key={highlight.province}
                onClick={() => {
                  setCategory('hotels');
                  setQuery(highlight.province);
                  document.getElementById('popular')?.scrollIntoView({ behavior: 'smooth' });
                }}
                type="button"
              >
                <h3>{highlight.province}</h3>
                <p><span>เที่ยว</span>{highlight.place}</p>
                <p><span>กิน</span>{highlight.food}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="products-section" id="popular">
          <div className="products-heading">
            <div>
              <p className="section-kicker">ดีลที่คัดมาให้คุณ</p>
              <h2>ยอดนิยมในประเทศไทย</h2>
            </div>
            <div className="product-tools">
              <span className="all-link">{visibleProducts.length} รายการ</span>
              {compareIds.length > 1 && (
                <button className="compare-button" onClick={() => setSelectedProduct(compareProducts[0])} type="button">เปรียบเทียบ {compareIds.length}</button>
              )}
            </div>
          </div>
          {visibleProducts.length === 0 ? (
            <p className="empty-state">ไม่พบดีลที่ตรงกับคำค้นหา</p>
          ) : (
            <div className="product-grid">
              {visibleProducts.map((product) => (
                <DealCard
                  compared={compareIds.includes(product.id)}
                  deal={product}
                  key={product.id}
                  onAddToCart={() => setCart((currentCart) => [...currentCart, product])}
                  onSelect={() => setSelectedProduct(product)}
                  onToggleCompare={() => toggleCompare(product.id)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="cart-summary" id="cart">
          <h2>ตะกร้าของคุณ</h2>
          {cart.length === 0 ? (
            <p>ยังไม่มีรายการในตะกร้า</p>
          ) : (
            <>
              <p>มี {cart.length} รายการพร้อมชำระเงิน</p>
              <button className="primary-action" disabled={isCheckingOut} onClick={startCheckout} type="button">
                {isCheckingOut ? 'กำลังเปิด Stripe...' : 'ชำระเงินด้วย PromptPay / บัตร'}
              </button>
              {checkoutError && <p role="alert">{checkoutError}</p>}
            </>
          )}
        </section>
      </main>

      {view === 'auth' && (
        <section className="panel-view">
          <div className="account-panel">
            <p className="section-kicker">WELCOME TO SUPERSYAM</p>
            <h2>{authMode === 'login' ? 'เข้าสู่ระบบ' : 'สร้างบัญชีใหม่'}</h2>
            <p className="auth-payment-note">หลังยืนยันบัญชี ระบบจะเปิด Stripe เพื่อชำระด้วย PromptPay หรือบัตร ยอด ฿{pendingPayment.amount.toLocaleString()}</p>
            <form onSubmit={handleAuth}>
              <label>อีเมล<input autoComplete="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
              <label>รหัสผ่าน<input autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} minLength={6} required type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
              {authError && <p className="form-error" role="alert">{authError}</p>}
              <button className="primary-action" type="submit">{authMode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</button>
            </form>
            <button className="back-link" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} type="button">
              {authMode === 'login' ? 'ยังไม่มีบัญชี? สมัครสมาชิก' : 'มีบัญชีแล้ว? เข้าสู่ระบบ'}
            </button>
            <br />
            <button className="back-link" onClick={() => setView('home')} type="button">← กลับหน้าหลัก</button>
          </div>
        </section>
      )}

      {view === 'dashboard' && (
        <section className="panel-view">
          <div className="account-panel">
            <p className="section-kicker">YOUR ACCOUNT</p>
            <h2>บัญชีของฉัน</h2>
            <p className="signed-email">{userEmail}</p>
            <div className="dashboard-stat"><strong>{cart.length}</strong><span>รายการในตะกร้าปัจจุบัน</span></div>
            <h3 className="booking-heading">ประวัติการจอง</h3>
            {bookings.length === 0 ? (
              <p className="dashboard-note">ยังไม่มีประวัติการจอง</p>
            ) : (
              <div className="booking-list">
                {bookings.map((booking) => (
                  <div className="booking-row" key={booking.id}>
                    <span>{booking.product_name}<small>{new Date(booking.created_at).toLocaleDateString('th-TH')}</small></span>
                    <b>฿{booking.amount.toLocaleString()}<small>{booking.status}</small></b>
                  </div>
                ))}
              </div>
            )}
            <button className="secondary-action" onClick={async () => { await supabase.auth.signOut(); setUserEmail(null); setUserId(null); setView('home'); }} type="button">ออกจากระบบ</button>
            <br />
            <button className="back-link" onClick={() => setView('home')} type="button">← กลับหน้าหลัก</button>
          </div>
        </section>
      )}

      {selectedProduct && (
        <div className="deal-modal" role="dialog" aria-modal="true" aria-label="รายละเอียดดีล">
          <div className="deal-modal-card">
            <button className="modal-close" onClick={() => setSelectedProduct(null)} type="button">×</button>
            <p className="section-kicker">{selectedProduct.type} · {selectedProduct.location}</p>
            <h2>{compareProducts.length > 1 ? 'เปรียบเทียบดีล' : selectedProduct.name}</h2>
            {compareProducts.length > 1 ? (
              <div className="compare-table">
                {compareProducts.map((product) => (
                  <div className="compare-item" key={product.id}>
                    <img alt="" src={product.image} />
                    <strong>{product.name}</strong>
                    <span>{product.location}</span>
                    <b>฿{product.price.toLocaleString()}</b>
                    <a href={getBookingHref(product.id)} rel="sponsored noopener noreferrer" target="_blank">จองดีลนี้</a>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <img alt="" className="deal-hero-image" src={selectedProduct.image} />
                <p className="deal-description">ประสบการณ์คัดสรรสำหรับการเดินทางในประเทศไทย พร้อมราคาเริ่มต้นและรายละเอียดที่คัดมาให้บน Supersyam</p>
                <div className="deal-meta">
                  <span>คะแนนผู้ใช้ <b>{selectedProduct.rating.toFixed(1)} / 5</b></span>
                  <span>ยกเลิกฟรี <b>ตามเงื่อนไข</b></span>
                  <span>เริ่มต้นที่ <b>฿{selectedProduct.price.toLocaleString()}</b></span>
                </div>
                <a className="primary-action deal-book" href={getBookingHref(selectedProduct.id)} rel="sponsored noopener noreferrer" target="_blank">จองเลย</a>
              </>
            )}
          </div>
        </div>
      )}

      <footer className="travel-footer" id="footer">
        <strong className="footer-brand"><span className="brand-monogram">S</span> SUPERSYAM</strong>
        <span>เที่ยวไทยในแบบของคุณ</span>
        <span>© 2026 Supersyam Thailand</span>
      </footer>
    </div>
  );
}

export default SupersyamHome;
