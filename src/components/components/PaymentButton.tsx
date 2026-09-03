'use client';

import { useState } from 'react';

export default function PaymentButton() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      // เรียกไปยัง API Route ที่เราสร้างไว้ (/api/checkout)
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.error) {
        alert(`เกิดข้อผิดพลาด: ${data.error}`);
        return;
      }

      // นำทางผู้ใช้ไปยังหน้าชำระเงินของ Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('ไม่สามารถเชื่อมต่อระบบชำระเงินได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
    >
      {loading ? 'กำลังนำคุณไปสู้หน้าชำระเงิน...' : 'จองเลย - 5,000 บาท'}
    </button>
  );
}