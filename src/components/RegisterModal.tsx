'use client';

import { useState } from 'react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [method, setMethod] = useState<'email' | 'phone'>('phone');
  const [inputVal, setInputVal] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`สมัครสมาชิกสำเร็จด้วย: ${inputVal}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-gray-900 border border-amber-500/30 p-6 text-white shadow-2xl">
        {/* ปุ่มปิด Modal */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-amber-400 text-center mb-2">
          สมัครสมาชิก SUPERSYAM
        </h2>
        <p className="text-xs text-gray-400 text-center mb-6">
          เลือกช่องทางการลงทะเบียนเพื่อรับสิทธิพิเศษระดับพรีเมียม
        </p>

        {/* ตัวเลือก switcher เบอร์โทร / อีเมล */}
        <div className="flex rounded-lg bg-gray-800 p-1 mb-6 border border-gray-700">
          <button
            type="button"
            onClick={() => setMethod('phone')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${
              method === 'phone'
                ? 'bg-amber-500 text-gray-950 font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            เบอร์โทรศัพท์
          </button>
          <button
            type="button"
            onClick={() => setMethod('email')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${
              method === 'email'
                ? 'bg-amber-500 text-gray-950 font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            อีเมล (Email)
          </button>
        </div>

        {/* ฟอร์มสมัคร */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              {method === 'phone' ? 'เบอร์โทรศัพท์' : 'อีเมลของคุณ'}
            </label>
            <input
              type={method === 'phone' ? 'tel' : 'email'}
              required
              placeholder={
                method === 'phone' ? '0812345678' : 'example@domain.com'
              }
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              รหัสผ่าน
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-sm font-bold text-gray-950 shadow-lg hover:from-amber-400 hover:to-amber-500 transition"
          >
            ยืนยันการสมัครสมาชิก
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          มีบัญชีอยู่แล้ว?{' '}
          <button
            onClick={onClose}
            className="text-amber-400 hover:underline font-medium"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    </div>
  );
}