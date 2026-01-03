
import { MenuItem } from './types';

export const RESTAURANT_PHONE = "+9647504629237";

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'p1',
    name: 'پیتزای مەرگەریتا',
    description: 'سۆسی تەماتەی تایبەت، پەنیری مۆزارێلا، ریحانە',
    price: 8000,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'p2',
    name: 'پیتزای پێپەرۆنی',
    description: 'پێپەرۆنی ئەڵمانی، پەنیری مۆزارێلا، سۆسی تەماتە',
    price: 10000,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'b1',
    name: 'کلاسیک بەرگر',
    description: 'گۆشتی مانگا، کاهوو، تەماتە، سۆسی تایبەت',
    price: 6000,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's1',
    name: 'پەتاتەی سوورەکراو',
    description: 'پەتاتەی گەرم و کریسپی',
    price: 3000,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'd1',
    name: 'کۆکا کۆلا',
    description: '٣٣٠ مل',
    price: 1000,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400'
  }
];

export const CATEGORIES = [
  { id: 'Pizza', label: 'پیتزا' },
  { id: 'Burgers', label: 'بەرگر' },
  { id: 'Sides', label: 'تەنیشت' },
  { id: 'Drinks', label: 'خواردنەوە' }
];

export const UI_TEXT = {
  appName: "بومز پیتزا",
  addToCart: "زیادکردن بۆ سەبەتە",
  cart: "سەبەتەی کڕین",
  emptyCart: "سەبەتەکەت چۆڵە",
  total: "نرخی گشتی",
  orderNow: "داواکردن",
  checkout: "تەواوکردنی داواکاری",
  fullName: "ناوی کڕیار",
  phone: "ژمارەی مۆبایل",
  address: "ناونیشان / وەسفی شوێن",
  locationLink: "لينكی لۆكەیشن (Google Maps)",
  getLocation: "وەرگرتنی لۆکەیشن بە GPS",
  sendingOrder: "ناردنی داواکاری...",
  orderSuccess: "داواکارییەکەت بە سەرکەوتوویی تۆمارکرا",
  backToMenu: "گەڕانەوە بۆ لیست",
  whatsappOrder: "ناردن بۆ واتسئاپ",
  driverSummary: "پسوولەی داواکاری",
  openInMaps: "کردنەوە لە گووگڵ ماپ",
  items: "خواردنەکان",
  currency: "دینار"
};
