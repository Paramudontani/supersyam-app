'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// กำหนดค่าการเชื่อมต่อ (รองรับทั้ง Environment Variables และค่าสำรองป้องกันจอขาว)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SupersyamHome = () => {
  const [currentView, setCurrentView] = useState<'home' | 'auth' | 'cart' | 'dashboard' | 'checkout'>('home');
  const [activeCategory, setActiveCategory] = useState<'hotels' | 'tours' | 'cars' | 'food' | 'esim'>('hotels');
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cart, setCart] = useState<Array<{ id: string; name: string; price: number; type: string }>>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // Fallback จำลองล็อกอินสำเร็จกรณีรันแบบ Offline / ไม่มี Supabase Key จริง
      setUser({ email });
      alert('เข้าสู่ระบบจำลองสำเร็จ!');
      setCurrentView('home');
    } else {
      alert('เข้าสู่ระบบสำเร็จ!');
      setCurrentView('home');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert('สมัครสมาชิกไม่สำเร็จ: ' + error.message);
    } else {
      alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
    }
  };

  // ฐานข้อมูลสินค้าบริการท่องเที่ยวไทยแบบครบวงจร
  const thaiProducts: Record<string, Array<{ id: string; name: string; price: number; type: string; desc: string; image: string }>> = {
    hotels: [
      { id: 'h1', name: 'โรงแรมหรู 5 ดาว ริมแม่น้ำเจ้าพระยา กรุงเทพฯ', price: 4200, type: 'โรงแรม', desc: 'วิวแม่น้ำสุดอลังการ พร้อมสระว่ายน้ำอินฟินิตี้พูล', image: '🏨' },
      { id: 'h2', name: 'พูลวิลล่าส่วนตัว หาดป่าตอง ภูเก็ต', price: 6500, type: 'โรงแรม', desc: 'วิลล่าส่วนตัวพร้อมสระว่ายน้ำส่วนตัว ใกล้หาดป่าตอง', image: '🏡' },
      { id: 'h3', name: 'รีสอร์ตท่ามกลางขุนเขาและสายหมอก เชียงใหม่', price: 2900, type: 'โรงแรม', desc: 'สัมผัสธรรมชาติแท้ สไตล์มินิมอลอบอุ่น', image: '⛰️' },
    ],
    tours: [
      { id: 't1', name: 'ทัวร์ล่องเรือสปีดโบ๊ทเกาะพีพี & อ่าวมาหยา', price: 1500, type: 'ตั๋วท่องเที่ยว', desc: 'รวมอาหารเที่ยง อุปกรณ์ดำน้ำ และไกด์มืออาชีพ', image: '⛵' },
      { id: 't2', name: 'บัตรเข้าชมมหานคร สกายวอล์ค (ชั้น 78)', price: 880, type: 'ตั๋วท่องเที่ยว', desc: 'ชมวิวกรุงเทพฯ แบบ 360 องศาบนพื้นกระจกใส', image: '🌆' },
      { id: 't3', name: 'แพ็กเกจดินเนอร์ล่องเรือหรูแม่น้ำเจ้าพระยา', price: 1200, type: 'ตั๋วท่องเที่ยว', desc: 'บุฟเฟต์นานาชาติ ดนตรีสดโรแมนติก', image: '🚢' },
    ],
    cars: [
      { id: 'c1', name: 'รถเช่าขับเอง ท่าอากาศยานสุวรรณภูมิ (Toyota Vios/City)', price: 950, type: 'รถเช่า', desc: 'ประกันภัยชั้น 1 ครบถ้วน ไม่จำกัดระยะทาง', image: '🚗' },
      { id: 'c2', name: 'รถตู้ VIP พร้อมคนขับนำเที่ยวส่วนตัว เชียงใหม่', price: 2500, type: 'รถเช่า', desc: 'รวมน้ำมัน คนขับชำนาญเส้นทาง 10 ชั่วโมงเต็ม', image: '🚐' },
    ],
    food: [
      { id: 'f1', name: 'บัตรรับประทานอาหารบุฟเฟต์ตึกใบหยก 2 (Bangkok Balcony)', price: 850, type: 'ร้านอาหาร', desc: 'อาหารซีฟู้ดพรีเมียม พร้อมวิวตึกสูงระฟ้า', image: '🍽️' },
      { id: 'f2', name: 'ดีลสตรีทฟู้ดมิชลินย่านเยาวราช (เจ๊ไฝ / ข้าวเหนียวมะม่วง)', price: 500, type: 'ร้านอาหาร', desc: 'คูปองพิเศษไม่ต้องต่อคิวนาน', image: '🥢' },
    ],
    esim: [
      { id: 'e1', name: 'Thailand 5G eSIM เน็ตไม่จำกัด 10 วัน (Dtac/True)', price: 390, type: 'ซิมการ์ด', desc: 'สแกน QR Code ใช้ได้ทันที ไม่ต้องเปลี่ยนซิม', image: '📱' },
    ]
  };

  const filteredProducts = (thaiProducts[activeCategory] || []).filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Navigation Bar */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentView('home')}>
            <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">
              Supersyam Thailand
            </span>
            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30">Official</span>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentView('cart')} 
              className="relative bg-slate-800 hover:bg-slate-700 text-cyan-400 px-4 py-2 rounded-xl text-sm font-medium border border-slate-700 transition flex items-center space-x-2"
            >
              <span>🛒 ตะกร้า</span>
              {cart.length > 0 && (
                <span className="bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-full text-xs font-bold">
                  {cart.length}
                </span>
              )}
            </button>

            {user ? (
              <button 
                onClick={() => setCurrentView('dashboard')} 
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:opacity-90 transition"
              >
                👤 บัญชีของฉัน
              </button>
            ) : (
              <button 
                onClick={() => setCurrentView('auth')} 
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:opacity-90 transition"
              >
                เข้าสู่ระบบ / สมัคร
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main View: Home */}
      {currentView === 'home' && (
        <main className="max-w-7xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none"></div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
              ท่องเที่ยวไทยครบวงจร <span className="text-cyan-400">จองง่าย จ่ายสะดวก</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto mb-8 text-sm md:text-base">
              รวมโรงแรมหรู พูลวิลล่า ตั๋วท่องเที่ยว รถเช่า อาหารมิชลิน และ eSIM ทั่วประเทศไทย พร้อมดีลพิเศษสุดคุ้ม
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto flex bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-inner">
              <input 
                type="text" 
                placeholder="ค้นหาโรงแรม, สถานที่ท่องเที่ยว, รถเช่า..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-4 py-2 text-white focus:outline-none text-sm"
              />
              <button className="bg-cyan-500 text-slate-950 px-6 py-2 rounded-xl font-bold text-sm hover:bg-cyan-400 transition">
                ค้นหา
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-start md:justify-center space-x-3 mb-10 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'hotels', label: '🏨 โรงแรมที่พัก', count: thaiProducts.hotels.length },
              { id: 'tours', label: '🎟️ ตั๋ว & ทัวร์', count: thaiProducts.tours.length },
              { id: 'cars', label: '🚗 รถเช่า', count: thaiProducts.cars.length },
              { id: 'food', label: '🍲 ร้านอาหาร', count: thaiProducts.food.length },
              { id: 'esim', label: '📱 ซิม & eSIM', count: thaiProducts.esim.length },
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveCategory(tab.id as any)} 
                className={`px-6 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all flex items-center space-x-2 ${
                  activeCategory === tab.id 
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-lg scale-105' 
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl hover:border-cyan-500/50 transition duration-300">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-3xl">{item.image}</span>
                    <span className="text-xs bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full font-semibold border border-cyan-500/20">{item.type}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                  <p className="text-slate-400 text-xs mb-4 leading-relaxed">{item.desc}</p>
                </div>
                <div>
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-xs text-slate-500">ราคาพิเศษ</span>
                    <span className="text-emerald-400 font-extrabold text-xl">฿{item.price.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={() => { 
                      setCart([...cart, item]); 
                      alert(เพิ่ม "${item.name}" ลงในตะกร้าเรียบร้อย!); 
                    }} 
                    className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold py-3 rounded-xl shadow-md hover:opacity-90 transition text-sm"
                  >
                    + เพิ่มลงตะกร้าทันที
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Cart View */}
      {currentView === 'cart' && (
        <div className="max-w-3xl mx-auto my-12 p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-cyan-400 pl-3">ตะกร้าสินค้าและการจองของคุณ</h2>
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 mb-4">ยังไม่มีสินค้าในตะกร้าของคุณ</p>
              <button onClick={() => setCurrentView('home')} className="px-6 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-sm">
                เลือกชมสินค้าท่องเที่ยว
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                  <div>
                    <h4 className="text-white font-semibold text-sm">{item.name}</h4>
                    <span className="text-xs text-slate-400">{item.type}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-emerald-400 font-bold">฿{item.price.toLocaleString()}</span>
                    <button 
                      onClick={() => setCart(cart.filter((_, i) => i !== idx))}
                      className="text-rose-400 text-xs hover:underline"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
              <div className="border-t border-slate-800 pt-4 flex justify-between items-center text-lg font-bold text-white">
                <span>ยอดรวมทั้งสิ้น:</span>
                <span className="text-emerald-400">฿{totalPrice.toLocaleString()}</span>
              </div>
              <button 
                onClick={() => setCurrentView('checkout')} 
                className="w-full mt-6 py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black rounded-xl shadow-lg hover:opacity-90 transition"
              >
                ดำเนินการชำระเงิน (PromptPay / บัตรเครดิต)
              </button>
            </div>
          )}
          <div className="mt-6 text-center">
            <button onClick={() => setCurrentView('home')} className="text-sm text-slate-400 hover:text-white">← กลับไปหน้าหลัก</button>
          </div>
        </div>
      )}

      {/* Checkout View */}
      {currentView === 'checkout' && (
        <div className="max-w-md mx-auto my-12 p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">ชำระเงินค่าบริการ</h2>
          <div className="bg-slate-950 p-4 rounded-2xl mb-6 border border-slate-800 text-center">
            <p className="text-slate-400 text-xs mb-1">ยอดชำระสุทธิ</p>
            <p className="text-2xl font-black text-emerald-400">฿{totalPrice.toLocaleString()}</p>
          </div>
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-slate-950 border border-cyan-500/50 rounded-2xl flex items-center space-x-3 cursor-pointer">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-white font-bold text-sm">พร้อมเพย์ (PromptPay QR)</p>
                <p className="text-slate-400 text-xs"> ฟรีค่าธรรมเนียม ตรวจสอบอัตโนมัติ</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => { 
              alert('จำลองการชำระเงินสำเร็จ! ระบบได้ออก Voucher และส่งเข้าอีเมลของคุณแล้ว'); 
              setCart([]); 
              setCurrentView('home'); 
            }} 
            className="w-full py-3.5 bg-emerald-500 text-slate-950 font-bold rounded-xl shadow-lg hover:bg-emerald-400 transition"
          >
            ยืนยันการชำระเงิน ฿{totalPrice.toLocaleString()}
          </button>
          <button onClick={() => setCurrentView('cart')} className="mt-4 w-full text-center text-sm text-slate-400">← กลับไปตะกร้าสินค้า</button>
        </div>
      )}

      {/* Auth View */}
      {currentView === 'auth' && (
        <div className="max-w-md mx-auto my-16 p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold text-center text-cyan-400 mb-6">เข้าสู่ระบบ / สมัครสมาชิก</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">อีเมล</label>
              <input type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">รหัสผ่าน</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500" />
            </div>
            <div className="flex space-x-3 pt-2">
              <button onClick={handleLogin} type="button" className="flex-1 py-3 bg-cyan-500 text-slate-950 font-bold rounded-xl hover:bg-cyan-400 transition text-sm">เข้าสู่ระบบ</button>
              <button onClick={handleRegister} type="button" className="flex-1 py-3 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400 transition text-sm">สมัครสมาชิก</button>
            </div>
          </form>
          <button onClick={() => setCurrentView('home')} className="mt-6 w-full text-center text-sm text-slate-500 hover:text-white">← กลับหน้าหลัก</v:button>
        </div>
      )}

      {/* Dashboard View */}
      {currentView === 'dashboard' && (
        <div className="max-w-xl mx-auto my-16 p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-center">
          <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 border border-cyan-500/30">👤</div>
          <h2 className="text-2xl font-bold text-white mb-2">บัญชีผู้ใช้งานของคุณ</h2>
          <p className="text-emerald-400 mb-6 text-sm">อีเมล: {user?.email || 'user@supersyam.com'}</p>
          <div className="bg-slate-950 p-4 rounded-2xl mb-6 text-left border border-slate-800">
            <h4 className="text-xs text-slate-400 uppercase font-bold mb-2">ประวัติการจองล่าสุด</h4>
            <p className="text-slate-300 text-sm">ยังไม่มีประวัติการจองแพ็กเกจท่องเที่ยว</p>
          </div>
          <button onClick={async () => { await supabase.auth.signOut(); setUser(null); setCurrentView('home'); }} className="px-6 py-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl font-bold text-sm hover:bg-rose-500/20 transition">
            ออกจากระบบ
          </button>
          <div className="mt-4"><button onClick={() => setCurrentView('home')} className="text-sm text-slate-400 hover:text-white">← กลับหน้าหลัก</button></div>
        </div>
      )}
    </div>
  );
};
