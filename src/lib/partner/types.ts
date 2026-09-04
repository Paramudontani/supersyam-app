export type Category = 'hotels' | 'tours' | 'cars' | 'buses' | 'food' | 'flights' | 'esim';

export type PublicDeal = {
  id: string;
  name: string;
  location: string;
  type: string;
  category: Category;
  price: number;
  image: string;
  rating: number;
  reviews: number;
};
