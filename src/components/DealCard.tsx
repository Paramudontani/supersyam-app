'use client';

import { getBookingHref } from '@/lib/booking';
import type { PublicDeal } from '@/lib/partner/types';

type DealCardProps = {
  deal: PublicDeal;
  compared: boolean;
  onAddToCart: () => void;
  onSelect: () => void;
  onToggleCompare: () => void;
};

export function DealCard({
  deal,
  compared,
  onAddToCart,
  onSelect,
  onToggleCompare,
}: DealCardProps) {
  const partnerName = deal.category === 'hotels' ? 'Agoda' : 'Klook';

  return (
    <article className="product-card">
      <div className="product-image">
        <img alt={deal.name} src={deal.image} />
        <span>{deal.type}</span>
        <b>{deal.location}</b>
      </div>
      <div className="product-info">
        <h3>{deal.name}</h3>
        <p className="rating">★★★★★ <span>{deal.rating.toFixed(1)} ({deal.reviews})</span></p>
        <div className="product-bottom">
          <div>
            <small>เริ่มต้นที่</small>
            <strong>฿{deal.price.toLocaleString()}</strong>
          </div>
          <button onClick={onAddToCart} type="button">+ เพิ่มลงตะกร้า</button>
        </div>
        <div className="product-links">
          <button onClick={onSelect} type="button">ดูรายละเอียด</button>
          <button className={compared ? 'compare-active' : ''} onClick={onToggleCompare} type="button">
            {compared ? '✓ เปรียบเทียบแล้ว' : '+ เปรียบเทียบ'}
          </button>
        </div>
        <a
          className="book-cta"
          href={getBookingHref(deal.id)}
          onClick={() => window.sessionStorage.setItem('lastAffiliateClick', deal.id)}
          rel="sponsored noopener noreferrer"
          target="_blank"
        >
          จองผ่าน {partnerName} ↗
        </a>
      </div>
    </article>
  );
}
