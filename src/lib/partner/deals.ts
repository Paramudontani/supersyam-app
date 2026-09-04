import type { Category, PublicDeal } from '@/lib/partner/types';

export type { Category, PublicDeal };

type TrackingNetwork = 'klook' | 'agoda';

type InternalDeal = PublicDeal & {
  tracking: {
    network: TrackingNetwork;
    path: string;
  };
};

const catalog: InternalDeal[] = [
  {
    id: 'h1',
    name: 'โรงแรมหรูริมแม่น้ำเจ้าพระยา',
    location: 'กรุงเทพฯ',
    type: 'โรงแรม',
    category: 'hotels',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    reviews: 214,
    tracking: { network: 'agoda', path: 'Bangkok' },
  },
  {
    id: 'h2',
    name: 'พูลวิลล่าส่วนตัวใกล้หาดป่าตอง',
    location: 'ภูเก็ต',
    type: 'โรงแรม',
    category: 'hotels',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviews: 168,
    tracking: { network: 'agoda', path: 'Phuket' },
  },
  {
    id: 'h3',
    name: 'รีสอร์ตท่ามกลางขุนเขาและหมอกเช้า',
    location: 'เชียงใหม่',
    type: 'โรงแรม',
    category: 'hotels',
    price: 2900,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviews: 142,
    tracking: { network: 'agoda', path: 'Chiang Mai' },
  },
  {
    id: 't1',
    name: 'ทัวร์ล่องเรือเกาะพีพีเต็มวัน',
    location: 'ภูเก็ต - กระบี่',
    type: 'ทัวร์',
    category: 'tours',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1552465011-b4e05e00b99a?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviews: 326,
    tracking: { network: 'klook', path: 'activity' },
  },
  {
    id: 't2',
    name: 'บัตรเข้าชมมหานคร สกายวอล์ค',
    location: 'กรุงเทพฯ',
    type: 'ตั๋ว',
    category: 'tours',
    price: 880,
    image: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    reviews: 410,
    tracking: { network: 'klook', path: 'activity' },
  },
  {
    id: 't3',
    name: 'ดินเนอร์ล่องเรือเจ้าพระยา',
    location: 'กรุงเทพฯ',
    type: 'ทัวร์',
    category: 'tours',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviews: 198,
    tracking: { network: 'klook', path: 'activity' },
  },
  {
    id: 'c1',
    name: 'รถเช่าขับเอง รับที่สนามบิน',
    location: 'สุวรรณภูมิ',
    type: 'รถเช่า',
    category: 'cars',
    price: 950,
    image: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1200&q=80',
    rating: 4.5,
    reviews: 97,
    tracking: { network: 'klook', path: 'car-rental' },
  },
  {
    id: 'c2',
    name: 'รถตู้ VIP พร้อมคนขับนำเที่ยว',
    location: 'เชียงใหม่',
    type: 'รถเช่า',
    category: 'cars',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviews: 64,
    tracking: { network: 'klook', path: 'car-rental' },
  },
  {
    id: 'c3',
    name: 'รถยนต์ไฟฟ้าสำหรับเที่ยวเมือง',
    location: 'ภูเก็ต',
    type: 'รถเช่า',
    category: 'cars',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    reviews: 51,
    tracking: { network: 'klook', path: 'car-rental' },
  },
  {
    id: 'b1',
    name: 'ตั๋วรถทัวร์ กรุงเทพฯ - พัทยา',
    location: 'เอกมัย',
    type: 'ตั๋วรถทัวร์',
    category: 'buses',
    price: 180,
    image: 'https://images.unsplash.com/photo-1544620341-11cb2cd7c3df?auto=format&fit=crop&w=1200&q=80',
    rating: 4.3,
    reviews: 88,
    tracking: { network: 'klook', path: 'bus-tickets' },
  },
  {
    id: 'b2',
    name: 'รถทัวร์ VIP กรุงเทพฯ - เชียงใหม่',
    location: 'หมอชิต',
    type: 'ตั๋วรถทัวร์',
    category: 'buses',
    price: 780,
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
    rating: 4.5,
    reviews: 73,
    tracking: { network: 'klook', path: 'bus-tickets' },
  },
  {
    id: 'b3',
    name: 'ตั๋วรถทัวร์ กรุงเทพฯ - ภูเก็ต',
    location: 'สายใต้ใหม่',
    type: 'ตั๋วรถทัวร์',
    category: 'buses',
    price: 950,
    image: 'https://images.unsplash.com/photo-1544620341-11cb2cd7c3df?auto=format&fit=crop&w=1200&q=80',
    rating: 4.4,
    reviews: 41,
    tracking: { network: 'klook', path: 'bus-tickets' },
  },
  {
    id: 'f1',
    name: 'บุฟเฟต์วิวเมืองบนตึกใบหยก 2',
    location: 'กรุงเทพฯ',
    type: 'ร้านอาหาร',
    category: 'food',
    price: 850,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviews: 256,
    tracking: { network: 'klook', path: 'activity' },
  },
  {
    id: 'f2',
    name: 'ดีลสตรีทฟู้ดมิชลินย่านเยาวราช',
    location: 'กรุงเทพฯ',
    type: 'ร้านอาหาร',
    category: 'food',
    price: 500,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    reviews: 189,
    tracking: { network: 'klook', path: 'activity' },
  },
  {
    id: 'f3',
    name: 'เซ็ตอาหารเหนือรสต้นตำรับ',
    location: 'เชียงใหม่',
    type: 'ร้านอาหาร',
    category: 'food',
    price: 690,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviews: 112,
    tracking: { network: 'klook', path: 'activity' },
  },
  {
    id: 'a1',
    name: 'เที่ยวบินไปกลับ กรุงเทพฯ - ภูเก็ต',
    location: 'สุวรรณภูมิ',
    type: 'เที่ยวบิน',
    category: 'flights',
    price: 1890,
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
    rating: 4.4,
    reviews: 77,
    tracking: { network: 'klook', path: 'flights' },
  },
  {
    id: 'a2',
    name: 'เที่ยวบินไปกลับ กรุงเทพฯ - เชียงใหม่',
    location: 'ดอนเมือง',
    type: 'เที่ยวบิน',
    category: 'flights',
    price: 1490,
    image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=1200&q=80',
    rating: 4.5,
    reviews: 69,
    tracking: { network: 'klook', path: 'flights' },
  },
  {
    id: 'a3',
    name: 'เที่ยวบินไปกลับ กรุงเทพฯ - กระบี่',
    location: 'สุวรรณภูมิ',
    type: 'เที่ยวบิน',
    category: 'flights',
    price: 2190,
    image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    reviews: 54,
    tracking: { network: 'klook', path: 'flights' },
  },
  {
    id: 'e1',
    name: 'Thailand 5G eSIM เน็ตไม่จำกัด 10 วัน',
    location: 'ทั่วประเทศไทย',
    type: 'eSIM',
    category: 'esim',
    price: 390,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviews: 203,
    tracking: { network: 'klook', path: 'esim' },
  },
  {
    id: 'e2',
    name: 'Thailand eSIM เน็ต 15GB ใช้ได้ 8 วัน',
    location: 'ทั่วประเทศไทย',
    type: 'eSIM',
    category: 'esim',
    price: 249,
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80',
    rating: 4.5,
    reviews: 131,
    tracking: { network: 'klook', path: 'esim' },
  },
];

export function toPublicDeal(deal: InternalDeal): PublicDeal {
  return {
    id: deal.id,
    name: deal.name,
    location: deal.location,
    type: deal.type,
    category: deal.category,
    price: deal.price,
    image: deal.image,
    rating: deal.rating,
    reviews: deal.reviews,
  };
}

export function getPublicDeals(category?: string | null): PublicDeal[] {
  const deals = category
    ? catalog.filter((deal) => deal.category === category)
    : catalog;
  return deals.map(toPublicDeal);
}

export function getPublicDealsByCategory(): Record<Category, PublicDeal[]> {
  return catalog.reduce((groups, deal) => {
    groups[deal.category].push(toPublicDeal(deal));
    return groups;
  }, {
    hotels: [],
    tours: [],
    cars: [],
    buses: [],
    food: [],
    flights: [],
    esim: [],
  } as Record<Category, PublicDeal[]>);
}

export function getInternalDeal(id: string): InternalDeal | undefined {
  return catalog.find((deal) => deal.id === id);
}
