import { SupersyamHome } from '@/components/modules/supersyamHome';

export default function Page() {
  return <SupersyamHome />;
}
export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-amber-500 selection:text-black">
      {/* --- Navbar สไตล์ Luxury --- */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-[#0A0A0A]/80">
        <div className="text-2xl font-bold tracking-widest bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600 bg-clip-text text-transparent">
          SUPERSYAM
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm tracking-wider text-neutral-400">
          <a href="#" className="hover:text-amber-400 transition-colors">เอกสิทธิ์เหนือระดับ</a>
          <a href="#" className="hover:text-amber-400 transition-colors">คอลเลกชัน</a>
          <a href="#" className="hover:text-amber-400 transition-colors">เกี่ยวกับเรา</a>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-5 py-2.5 text-xs uppercase tracking-widest font-medium text-black bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 rounded-full hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all duration-300">
            เข้าสู่ระบบ
          </button>
        </div>
      </nav>

      {/* --- Hero Section หรูหราพรีเมียม --- */}
      <section className="relative px-8 py-24 md:py-32 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* ข้อความฝั่งซ้าย */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs tracking-widest uppercase">
            <span>✦ Thailand Exclusive Experience 2026</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-[1.1]">
            สัมผัสประสบการณ์ <br />
            <span className="font-normal bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              เหนือระดับที่คู่ควร
            </span>
          </h1>

          <p className="text-neutral-400 text-lg font-light max-w-xl leading-relaxed">
            ยกระดับการเดินทาง ท่องเที่ยว และไลฟ์สไตล์ของคุณให้หรูหราอย่างไร้ขีดจำกัด ค้นพบสิ่งที่ดีที่สุดทั่วประเทศไทยในที่เดียว
          </p>

          {/* กล่องค้นหาดีไซน์ Glassmorphism หรูหรา */}
          <div className="p-3 bg-neutral-900/80 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center gap-3">
            <input 
              type="text" 
              placeholder="ค้นหาจุดหมายปลายทางระดับลักชูรี..." 
              className="w-full bg-transparent px-4 py-3 text-white placeholder-neutral-500 focus:outline-none text-sm"
            />
            <button className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 text-black text-xs uppercase tracking-widest font-semibold rounded-xl hover:opacity-95 transition-opacity shadow-lg shadow-amber-500/20">
              ค้นหา
            </button>
          </div>
        </div>

        {/* องค์ประกอบภาพดีไซน์ฝั่งขวา (Luxury Card) */}
        <div className="lg:col-span-5 relative">
          <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-neutral-800 to-neutral-900 p-8 flex flex-col justify-between shadow-2xl group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.15),transparent_50%)]" />
            
            <div className="flex justify-between items-start z-10">
              <span className="text-xs uppercase tracking-widest text-amber-400 border-b border-amber-400/40 pb-1">Featured Collection</span>
              <span className="text-xs text-neutral-500">2026 Edition</span>
            </div>

            <div className="z-10 space-y-3">
              <h2 className="text-2xl font-light tracking-wide">Thailand, Your Way</h2>
              <p className="text-sm text-neutral-400 font-light">ออกแบบการเดินทางเฉพาะตัวคุณ สู่ความสุขที่เหนือกว่า</p>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}
