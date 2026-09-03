'use client';

import React, { useState } from 'react';

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // จำลองการเรียก API ไปยังหลังบ้านเพื่อสร้าง Checkout Session ของ Stripe
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // พาผู้ใช้ไปยังหน้าชำระเงินของ Stripe
      } else {
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อระบบชำระเงิน');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 text-black text-xs uppercase tracking-widest font-semibold rounded-xl hover:opacity-95 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
    >
      <span>{loading ? 'กำลังเชื่อมต่อระบบชำระเงิน...' : '✦ ชำระเงิน / จองบริการระดับลักชูรี'}</span>
    </button>
  );
}