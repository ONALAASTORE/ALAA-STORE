export interface Category {
  id: string;
  name: string;
  iconName: string;
  description: string;
  itemCount: number;
}

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All Products', iconName: 'Grid', description: 'Browse full tech catalog', itemCount: 32 },
  { id: 'smartphones', name: 'Smartphones', iconName: 'Smartphone', description: 'iPhones, Galaxy, Xiaomi & flagship devices', itemCount: 12 },
  { id: 'laptops', name: 'Laptops & MacBooks', iconName: 'Laptop', description: 'Apple Silicon MacBooks, Gaming & Workstations', itemCount: 6 },
  { id: 'tablets', name: 'Tablets & iPads', iconName: 'Tablet', description: 'iPad Pro, Air & Android flagship tablets', itemCount: 4 },
  { id: 'audio', name: 'Audio & Speakers', iconName: 'Headphones', description: 'Noise cancelling, wireless earbuds & high-power speakers', itemCount: 7 },
  { id: 'wearables', name: 'Smartwatches', iconName: 'Watch', description: 'Apple Watch Ultra, Galaxy Watch & fitness bands', itemCount: 5 },
  { id: 'gaming', name: 'Gaming & Consoles', iconName: 'Gamepad2', description: 'PS5 Pro, Switch OLED, controllers & gear', itemCount: 4 },
  { id: 'power', name: 'Power & GaN Chargers', iconName: 'Zap', description: 'Anker powerbanks, high-speed 100W+ GaN chargers', itemCount: 6 },
  { id: 'smart-home', name: 'Smart Home & Security', iconName: 'Home', description: 'Security cameras, robot vacuums & smart lighting', itemCount: 4 }
];

export const BRANDS = [
  'All Brands',
  'Apple',
  'Samsung',
  'Xiaomi',
  'Sony',
  'Anker',
  'JBL',
  'ASUS',
  'Marshall',
  'DJI',
  'Google'
];
