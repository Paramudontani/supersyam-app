'use client';

import Image from 'next/image';
import { useState } from 'react';
import { SupersyamHome } from '@/components/modules/supersyamHome';

export default function Home() {
  const [loading, setLoading] = useState(false);
  
  // State สำหรับเปิด/ปิด หน้าต่างสมัครสมาชิก (Modal)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerMethod, setRegisterMethod] = useState<'phone' | 'email'>('phone');
  const [registerInput, setRegisterInput] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // ฟังก์ชันเรียก Stripe Checkout API เมื่อกดปุ่มชำระเงิน/เข้าสู่ระบบ
  const handleCheckout = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (data.url) {
        // วิ่งตรงไปหน้าชำระเงินของ Stripe (สแกน PromptPay / ตัดบัตร)
        window.location.href = data.url;
      } else {
        alert(data.error || 'เกิดข้อผิดพลาดในการดึงหน้าชำระเงิน');
      }
    } catch (error: any) {
      alert('ไม่สามารถเชื่อมต่อระบบชำระเงินได้: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันส่งข้อมูลสมัครสมาชิก
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`สมัครสมาชิกสำเร็จด้วย ${registerMethod === 'phone' ? 'เบอร์โทรศัพท์' : 'อีเมล'}: ${registerInput}`);
    setIsRegisterOpen(false);
    setRegisterInput('');
    setRegisterPassword('');
  };

  return (
    <main className="relative min-h-screen bg-[#070707] text-white selection:bg-amber-400 selection:text-black overflow-hidden font-sans">
      {/* Background Ambient Glow Enhancements */}
      <div 
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-amber-500/10 via-amber-600/5 to-transparent blur-[120px] pointer-events-none" 
      />
      <div 
        aria-hidden="true"
        className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" 
      />

      {/* --- Navbar สไตล์ Luxury Glassmorphism --- */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10 backdrop-blur-xl sticky top-0 z-50 bg-[#070707]/70 transition-all duration-300">
        <div className="text-2xl font-black tracking-[0.2em] bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(245,158,11,0.2)]">
          SUPERSYAM
        </div>
        
        <div className="hidden md:flex items-center space-x-10 text-xs font-medium tracking-[0.15em] text-neutral-400 uppercase">
          <a href="#" className="hover:text-amber-300 transition-colors duration-200">เอกสิทธิ์เหนือระดับ</a>
          <a href="#" className="hover:text-amber-300 transition-colors duration-200">คอลเลกชัน</a>
          <a href="#" className="hover:text-amber-300 transition-colors duration-200">เกี่ยวกับเรา</a>
        </div>

        {/* กลุ่มปุ่ม Navbar (เพิ่มปุ่มสมัครสมาชิก + ปุ่มเดิม) */}
        <div className="flex items-center space-x-3">
          {/* ✦ ปุ่มสมัครสมาชิก (ดีไซน์ Luxury Glassmorphism เข้ากัน) */}
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="px-5 py-2 rounded-full border border-amber-500/30 bg-neutral-900/80 text-amber-300 hover:bg-amber-500/10 hover:border-amber-400 text-xs font-semibold tracking-widest uppercase transition-all duration-300 backdrop-blur-md"
          >
            สมัครสมาชิก
          </button>

          {/* ปุ่มเดิมของคุณ (คงไว้ 100% ไม่เปลี่ยนสไตล์/ฟังก์ชัน) */}
          <button 
            onClick={handleCheckout}
            disabled={loading}
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-semibold tracking-widest text-black uppercase rounded-full group bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all duration-300 disabled:opacity-50"
          >
            <span className="px-6 py-2.5 transition-all ease-in duration-75 rounded-full bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-500 group-hover:bg-transparent">
              {loading ? 'กำลังเชื่อมต่อ...' : 'เข้าสู่ระบบ / ชำระเงิน'}
            </span>
          </button>
        </div>
      </nav>

      {/* --- Main Section --- */}
      <div className="relative z-10">
        {/* Render คอมโพเนนต์เดิมของโปรเจกต์ */}
        <SupersyamHome />

        {/* --- Hero Section หรูหราพรีเมียม --- */}
        <section className="relative px-8 py-20 md:py-32 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* ข้อความฝั่งซ้าย */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent text-amber-300 text-xs tracking-[0.2em] uppercase backdrop-blur-md">
              <span className="text-amber-400">✦</span>
              <span>Thailand Exclusive Experience 2026</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extralight tracking-tight leading-[1.15]">
              สัมผัสประสบการณ์ <br />
              <span className="font-normal bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(245,158,11,0.15)]">
                เหนือระดับที่คู่ควร
              </span>
            </h1>

            <p className="text-neutral-400 text-base md:text-lg font-light max-w-xl leading-relaxed tracking-wide">
              ยกระดับการเดินทาง ท่องเที่ยว และไลฟ์สไตล์ของคุณให้หรูหราอย่างไร้ขีดจำกัด ค้นพบสิ่งที่ดีที่สุดทั่วประเทศไทยในที่เดียว
            </p>

            {/* กล่องค้นหาดีไซน์ Ultra-Luxury Glassmorphism */}
            <div className="p-2 bg-neutral-900/60 border border-white/10 rounded-2xl backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-2 focus-within:border-amber-500/40 transition-colors duration-300">
              <input 
                type="text" 
                placeholder="ค้นหาจุดหมายปลายทางระดับลักชูรี..." 
                className="w-full bg-transparent px-5 py-3.5 text-white placeholder-neutral-500 focus:outline-none text-sm font-light tracking-wide"
              />
              <button className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-600 text-black text-xs uppercase tracking-[0.15em] font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] whitespace-nowrap">
                ค้นหา
              </button>
            </div>
          </div>

          {/* องค์ประกอบภาพดีไซน์ฝั่งขวา (Luxury Card) */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-yellow-600/10 rounded-3xl blur-xl opacity-50 transition duration-1000"></div>
            
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-neutral-900/90 to-black/90 p-8 flex flex-col justify-between shadow-2xl backdrop-blur-md">
              <Image
                src="/supersyam.png"
                alt="Supersyam premium travel services"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-contain"
              />
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute top-0 right-0 -m-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex justify-between items-start z-10">
                <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-semibold border-b border-amber-400/30 pb-1">
                  Featured Collection
                </span>
                <span className="text-[10px] tracking-widest text-neutral-500 uppercase">2026 Edition</span>
              </div>

              <div className="z-10 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-light tracking-wide text-neutral-100">Thailand, Your Way</h2>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">ออกแบบการเดินทางเฉพาะตัวคุณ สู่ความสุขที่เหนือกว่า</p>
                </div>

                {/* ปุ่มจองแพ็กเกจบน Card เชื่อมต่อ Stripe Checkout */}
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-600 text-black text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.25)] disabled:opacity-50"
                >
                  {loading ? 'กำลังโหลด...' : 'จองแพ็กเกจ (฿5,000)'}
                </button>
              </div>
            </div>
          </div>

        </section>
      </div>

      {/* --- Modal สมัครสมาชิกดีไซน์ Ultra-Luxury --- */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300">
          <div className="relative w-full max-w-md rounded-3xl border border-amber-500/30 bg-neutral-900/90 p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] backdrop-blur-2xl text-white">
            
            {/* ปุ่มปิด Modal */}
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-amber-300 transition-colors text-sm"
            >
              ✕
            </button>

            <div className="text-center space-y-2 mb-6">
              <span className="text-amber-400 text-xs uppercase tracking-[0.2em]">Become A Member</span>
              <h2 className="text-2xl font-light tracking-wide bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                สมัครสมาชิก SUPERSYAM
              </h2>
              <p className="text-neutral-400 text-xs font-light">
                ลงทะเบียนเพื่อรับเอกสิทธิ์การเดินทางและบริการพิเศษ
              </p>
            </div>

            {/* ปุ่มเลือกช่องทาง เบอร์โทร / อีเมล */}
            <div className="flex rounded-xl bg-black/50 p-1 border border-white/10 mb-6">
              <button
                type="button"
                onClick={() => { setRegisterMethod('phone'); setRegisterInput(''); }}
                className={`flex-1 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg transition-all duration-200 ${
                  registerMethod === 'phone'
                    ? 'bg-gradient-to-r from-amber-200 to-amber-500 text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                เบอร์โทรศัพท์
              </button>
              <button
                type="button"
                onClick={() => { setRegisterMethod('email'); setRegisterInput(''); }}
                className={`flex-1 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg transition-all duration-200 ${
                  registerMethod === 'email'
                    ? 'bg-gradient-to-r from-amber-200 to-amber-500 text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                อีเมล (Email)
              </button>
            </div>

            {/* ฟอร์มสมัครสมาชิก */}
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-light">
                  {registerMethod === 'phone' ? 'เบอร์โทรศัพท์' : 'อีเมลของคุณ'}
                </label>
                <input
                  type={registerMethod === 'phone' ? 'tel' : 'email'}
                  required
                  placeholder={registerMethod === 'phone' ? '0812345678' : 'yourname@supersyam.com'}
                  value={registerInput}
                  onChange={(e) => setRegisterInput(e.target.value)}
                  className="w-full rounded-xl bg-black/60 border border-white/10 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:border-amber-500/60 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-light">
                  รหัสผ่าน
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full rounded-xl bg-black/60 border border-white/10 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:border-amber-500/60 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-600 text-black text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
              >
                ยืนยันการสมัครสมาชิก
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-neutral-500 font-light">
              มีบัญชีอยู่แล้ว?{' '}
              <button
                onClick={() => { setIsRegisterOpen(false); handleCheckout(); }}
                className="text-amber-300 hover:underline font-normal ml-1"
              >
                เข้าสู่ระบบ / ชำระเงิน
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}