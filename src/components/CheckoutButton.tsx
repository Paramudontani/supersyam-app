'use client';

import { useState } from 'react';

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);

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

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-500 text-black text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50"
    >
      {loading ? 'กำลังเชื่อมต่อ...' : 'ชำระเงิน'}
    </button>
  );
}