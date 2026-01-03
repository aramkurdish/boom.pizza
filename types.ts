
export type Category = 'Pizza' | 'Burgers' | 'Sides' | 'Drinks';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderDetails {
  id: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  locationLink?: string;
  location?: {
    lat: number;
    lng: number;
  };
  cartItems: CartItem[];
  total: number;
  timestamp: number;
}
