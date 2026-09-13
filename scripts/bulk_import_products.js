#!/usr/bin/env node

/**
 * Bulk Product Import and Catalog Generator for ON-ALAA-STORE
 * Merges or imports products directly into public/data/products.json (and src/data/products.json)
 * Run with: npm run products:import or node scripts/bulk_import_products.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_PRODUCTS_PATH = path.resolve(__dirname, '../public/data/products.json');
const SRC_PRODUCTS_JSON_PATH = path.resolve(__dirname, '../src/data/products.json');

// Ensure target directories exist
fs.mkdirSync(path.dirname(PUBLIC_PRODUCTS_PATH), { recursive: true });
fs.mkdirSync(path.dirname(SRC_PRODUCTS_JSON_PATH), { recursive: true });

// 52+ Curated Tech Products for the Lebanese Electronics Market
const BASE_52_PRODUCTS = [
  {
    id: 'iphone-16-pro-max',
    name: 'Apple iPhone 16 Pro Max',
    brand: 'Apple',
    category: 'smartphones',
    subcategory: 'Flagship Phones',
    description: 'Forged in titanium with the ground-breaking A18 Pro chip, Camera Control button, and 48MP Fusion camera system. Industry-leading battery life and super retina XDR display with ProMotion.',
    features: [
      'Grade 5 Titanium design with textured matte glass back',
      'A18 Pro chip with 6-core GPU for console-level gaming',
      'Camera Control button with instant touch and slide zoom',
      '48MP Fusion camera with 5x Telephoto optical zoom',
      'Up to 33 hours video playback battery life'
    ],
    specs: {
      'Display': '6.9-inch Super Retina XDR OLED, 120Hz ProMotion, 2000 nits',
      'Processor': 'Apple A18 Pro (3nm)',
      'Rear Camera': '48MP Main + 48MP Ultra-Wide + 12MP 5x Telephoto',
      'Front Camera': '12MP TrueDepth with autofocus',
      'Battery': '4,685 mAh, 25W MagSafe wireless, USB-C 3.0',
      'Water Resistance': 'IP68 (6 meters up to 30 mins)',
      'SIM': 'Physical Nano-SIM + eSIM (Middle East Official Spec)'
    },
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1000&q=80'
    ],
    basePriceUSD: 1280,
    originalPriceUSD: 1350,
    storageOptions: [
      { capacity: '256GB', priceUSD: 1280, inStock: true },
      { capacity: '512GB', priceUSD: 1490, inStock: true },
      { capacity: '1TB', priceUSD: 1720, inStock: true }
    ],
    colorOptions: [
      { name: 'Desert Titanium', hex: '#CDBCA7' },
      { name: 'Natural Titanium', hex: '#9E9E9C' },
      { name: 'Black Titanium', hex: '#383838' }
    ],
    variants: [
      { id: 'ip16pm-256-desert', name: '256GB - Desert Titanium', storage: '256GB', color: 'Desert Titanium', colorHex: '#CDBCA7', priceUSD: 1280, inStock: true },
      { id: 'ip16pm-256-natural', name: '256GB - Natural Titanium', storage: '256GB', color: 'Natural Titanium', colorHex: '#9E9E9C', priceUSD: 1280, inStock: true },
      { id: 'ip16pm-256-black', name: '256GB - Black Titanium', storage: '256GB', color: 'Black Titanium', colorHex: '#383838', priceUSD: 1280, inStock: true },
      { id: 'ip16pm-512-desert', name: '512GB - Desert Titanium', storage: '512GB', color: 'Desert Titanium', colorHex: '#CDBCA7', priceUSD: 1490, inStock: true },
      { id: 'ip16pm-1tb-natural', name: '1TB - Natural Titanium', storage: '1TB', color: 'Natural Titanium', colorHex: '#9E9E9C', priceUSD: 1720, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 84,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Apple Official Agency Warranty',
    inStock: true,
    isFeatured: true,
    isHotDeal: true,
    isNewArrival: true,
    tags: ['Flagship', 'Bestseller', 'Titanium', 'A18 Pro'],
    freeDelivery: true
  },
  {
    id: 'iphone-16-pro',
    name: 'Apple iPhone 16 Pro',
    brand: 'Apple',
    category: 'smartphones',
    subcategory: 'Flagship Phones',
    description: 'The pro powerhouse with 6.3-inch Super Retina XDR display, A18 Pro chip, 5x telephoto optical zoom and titanium aerospace enclosure.',
    features: [
      'Aerospace-grade Grade 5 titanium frame',
      'A18 Pro chip with 16-core Neural Engine',
      'All-new Camera Control fast button',
      'Studio-quality 4-mic array with Audio Mix',
      'USB-C with USB 3 speeds up to 10Gb/s'
    ],
    specs: {
      'Display': '6.3-inch Super Retina XDR OLED, 120Hz ProMotion',
      'Processor': 'Apple A18 Pro',
      'Camera': '48MP Fusion + 48MP Ultra-Wide + 12MP 5x Telephoto',
      'Battery': '3,582 mAh with fast wireless charging',
      'Build': 'Titanium with Ceramic Shield front'
    },
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 1090,
    originalPriceUSD: 1150,
    variants: [
      { id: 'ip16p-128-desert', name: '128GB - Desert Titanium', priceUSD: 1090, inStock: true },
      { id: 'ip16p-256-black', name: '256GB - Black Titanium', priceUSD: 1190, inStock: true }
    ],
    rating: 4.8,
    reviewCount: 42,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Apple Official Agency Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['Apple', 'iPhone', 'Titanium'],
    freeDelivery: true
  },
  {
    id: 'iphone-16',
    name: 'Apple iPhone 16',
    brand: 'Apple',
    category: 'smartphones',
    subcategory: 'Flagship Phones',
    description: 'Meet iPhone 16 with Camera Control, 48MP 2-in-1 Fusion camera, vibrant infused glass back, and the speed of the A18 processor.',
    features: [
      'A18 chip built for next-gen performance',
      'Camera Control button and customizable Action Button',
      '48MP Fusion camera with 2x optical-quality Telephoto',
      'Vibrant color-infused back glass with IP68 seal'
    ],
    specs: {
      'Display': '6.1-inch Super Retina XDR OLED',
      'Processor': 'Apple A18 (3nm)',
      'Rear Camera': '48MP Fusion + 12MP Ultra-Wide',
      'Battery': '3,561 mAh, MagSafe & Qi2 wireless'
    },
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 850,
    originalPriceUSD: 899,
    variants: [
      { id: 'ip16-128-ultramarine', name: '128GB - Ultramarine Blue', priceUSD: 850, inStock: true },
      { id: 'ip16-256-teal', name: '256GB - Teal Green', priceUSD: 960, inStock: true }
    ],
    rating: 4.7,
    reviewCount: 31,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Apple Official Agency Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['Apple', 'iPhone 16', 'A18'],
    freeDelivery: true
  },
  {
    id: 'galaxy-s25-ultra',
    name: 'Samsung Galaxy S25 Ultra 5G',
    brand: 'Samsung',
    category: 'smartphones',
    subcategory: 'Flagship Phones',
    description: 'Samsung flagship with Snapdragon 8 Elite for Galaxy, built-in S-Pen, 200MP Quad Telephoto camera, and Gorilla Armor anti-reflective glass.',
    features: [
      'Qualcomm Snapdragon 8 Elite for Galaxy (3nm)',
      'Built-in Bluetooth S-Pen stylus with air gestures',
      '200MP Quad Tele system with 100x Space Zoom',
      'Titanium frame with IP68 dust and water resistance'
    ],
    specs: {
      'Display': '6.86-inch Dynamic AMOLED 2X, 120Hz, 2600 nits',
      'Processor': 'Snapdragon 8 Elite for Galaxy',
      'Camera': '200MP + 50MP Periscope 5x + 50MP Ultra-Wide + 10MP 3x',
      'Battery': '5,000 mAh with 45W super-fast wired charge',
      'Stylus': 'Embedded S Pen with 2.8ms latency'
    },
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 1190,
    originalPriceUSD: 1299,
    variants: [
      { id: 's25u-256-black', name: '256GB - Titanium Black', priceUSD: 1190, inStock: true },
      { id: 's25u-512-gray', name: '512GB - Titanium Silver/Gray', priceUSD: 1350, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 56,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year CTC Samsung Lebanon Official Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['Samsung', 'S25 Ultra', 'Snapdragon 8 Elite'],
    freeDelivery: true
  },
  {
    id: 'galaxy-z-fold-6',
    name: 'Samsung Galaxy Z Fold 6',
    brand: 'Samsung',
    category: 'smartphones',
    subcategory: 'Foldables',
    description: 'Ultra-slim foldable flagship with 7.6-inch Dynamic AMOLED display, dual-rail hinge, and Galaxy AI multi-window productivity.',
    features: [
      'Dual-rail hinge engineering for zero gap folding',
      'Snapdragon 8 Gen 3 for Galaxy with ray-tracing',
      'Foldable 7.6-inch tablet experience with S-Pen support',
      'Armor Aluminum frame with Gorilla Glass Victus 2'
    ],
    specs: {
      'Main Display': '7.6-inch Dynamic AMOLED 2X, 120Hz, 2600 nits',
      'Cover Screen': '6.3-inch Dynamic AMOLED 2X',
      'Processor': 'Snapdragon 8 Gen 3',
      'Camera': '50MP Main + 12MP Ultra-Wide + 10MP 3x Telephoto',
      'Battery': '4,400 mAh dual-cell battery'
    },
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 1480,
    originalPriceUSD: 1650,
    variants: [
      { id: 'fold6-256-navy', name: '256GB - Navy Blue', priceUSD: 1480, inStock: true },
      { id: 'fold6-512-silver', name: '512GB - Silver Shadow', priceUSD: 1640, inStock: true }
    ],
    rating: 4.8,
    reviewCount: 22,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year CTC Samsung Lebanon Official Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['Samsung', 'Z Fold 6', 'Foldable'],
    freeDelivery: true
  },
  {
    id: 'xiaomi-14-ultra',
    name: 'Xiaomi 14 Ultra (Leica Quad Camera)',
    brand: 'Xiaomi',
    category: 'smartphones',
    subcategory: 'Flagship Phones',
    description: 'Co-engineered with Leica, featuring 1-inch LYT-900 sensor with stepless variable aperture and 8K HDR cinema grade video recording.',
    features: [
      'Leica Summilux optical lens system with stepless aperture f/1.63-f/4.0',
      'Snapdragon 8 Gen 3 flagship chipset with LiquidCool loop',
      '120W HyperCharge wired + 80W wireless turbo charging',
      'Shield Glass 10x drop resistance and vegan leather back'
    ],
    specs: {
      'Display': '6.73-inch WQHD+ AMOLED, 1-120Hz LTPO, 3000 nits',
      'Camera': '50MP 1-inch LYT-900 + 50MP 75mm Leica + 50MP 120mm Periscope + 50MP Ultra-Wide',
      'Processor': 'Snapdragon 8 Gen 3 (4nm)',
      'Battery': '5,000 mAh with 90W fast charger included in box'
    },
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 940,
    originalPriceUSD: 1050,
    variants: [
      { id: 'mi14u-512-black', name: '16GB RAM + 512GB - Photography Black', priceUSD: 940, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 28,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Official Xiaomi Agency Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['Xiaomi', 'Leica', '1-inch Sensor'],
    freeDelivery: true
  },
  {
    id: 'google-pixel-9-pro-xl',
    name: 'Google Pixel 9 Pro XL',
    brand: 'Google',
    category: 'smartphones',
    subcategory: 'Flagship Phones',
    description: 'The best of Google AI on a gorgeous 6.8-inch Super Actua display, powered by Google Tensor G4 with 16GB RAM and studio-grade cameras.',
    features: [
      'Google Tensor G4 chip tuned for on-device Gemini Nano',
      '16GB RAM for seamless background multitasking',
      'Pro triple rear camera with 30x Super Res Zoom',
      '7 years of guaranteed OS and security drops'
    ],
    specs: {
      'Display': '6.8-inch Super Actua LTPO OLED, 3000 nits',
      'Processor': 'Google Tensor G4 with Titan M2 coprocessor',
      'Camera': '50MP Main + 48MP 5x Telephoto + 48MP Ultra-Wide',
      'Battery': '5,060 mAh with 37W wired charging'
    },
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 990,
    originalPriceUSD: 1099,
    variants: [
      { id: 'p9pxl-128-obsidian', name: '128GB - Obsidian', priceUSD: 990, inStock: true },
      { id: 'p9pxl-256-porcelain', name: '256GB - Porcelain White', priceUSD: 1090, inStock: true }
    ],
    rating: 4.8,
    reviewCount: 19,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year International / Local Lebanese Warranty',
    inStock: true,
    isFeatured: false,
    tags: ['Google', 'Pixel', 'Gemini AI'],
    freeDelivery: true
  },
  {
    id: 'macbook-pro-m4-16',
    name: 'Apple MacBook Pro 16" (M4 Pro / Max)',
    brand: 'Apple',
    category: 'laptops',
    subcategory: 'Pro Workstations',
    description: 'Unprecedented speed and battery life powered by M4 Pro. Liquid Retina XDR display with up to 1600 nits peak brightness and 24 hours battery life.',
    features: [
      'Apple M4 Pro chip with 14-core CPU and 20-core GPU',
      '24GB unified memory with 273GB/s bandwidth',
      'Liquid Retina XDR display with nano-texture option',
      'Full suite of ports: 3x Thunderbolt 5, HDMI, SDXC, MagSafe 3',
      'Industry-leading 24-hour battery endurance'
    ],
    specs: {
      'Display': '16.2-inch Liquid Retina XDR (3456x2234), 120Hz ProMotion',
      'Processor': 'Apple M4 Pro (14-core CPU / 20-core GPU)',
      'Memory': '24GB Unified Memory (configurable to 48GB)',
      'Storage': '512GB PCIe 4.0 NVMe SSD',
      'Ports': '3x Thunderbolt 5 (USB-C), HDMI 2.1, SDXC card slot, MagSafe 3',
      'Weight': '2.14 kg'
    },
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 2450,
    originalPriceUSD: 2599,
    variants: [
      { id: 'mbp16-m4pro-spaceblack', name: 'M4 Pro / 24GB / 512GB - Space Black', priceUSD: 2450, inStock: true },
      { id: 'mbp16-m4max-spaceblack', name: 'M4 Max / 36GB / 1TB - Space Black', priceUSD: 3350, inStock: true }
    ],
    rating: 5.0,
    reviewCount: 47,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Apple Official Agency Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['Apple Silicon', 'M4 Pro', 'Liquid Retina XDR'],
    freeDelivery: true
  },
  {
    id: 'macbook-air-m3-15',
    name: 'Apple MacBook Air 15" (M3 Chip)',
    brand: 'Apple',
    category: 'laptops',
    subcategory: 'Ultrabooks',
    description: 'Impossibly thin at 11.5mm with expansive 15.3-inch Liquid Retina display, silent fanless architecture, and all-day 18-hour battery.',
    features: [
      'Apple M3 8-core CPU and 10-core GPU with ray tracing',
      '15.3-inch Liquid Retina display with 500 nits brightness',
      'Silent, completely fanless thermal design',
      'MagSafe 3 charging + dual Thunderbolt / USB 4 ports'
    ],
    specs: {
      'Display': '15.3-inch Liquid Retina LED IPS (2880x1864)',
      'Chip': 'Apple M3 with hardware-accelerated mesh shading',
      'Memory': '16GB Unified Memory',
      'Storage': '512GB Fast SSD',
      'Battery': '66.5-watt-hour lithium-polymer, up to 18 hours'
    },
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 1450,
    originalPriceUSD: 1550,
    variants: [
      { id: 'mba15-midnight', name: '16GB / 512GB - Midnight Blue', priceUSD: 1450, inStock: true },
      { id: 'mba15-starlight', name: '16GB / 512GB - Starlight Gold', priceUSD: 1450, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 39,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Apple Official Agency Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['MacBook Air', 'M3', '15-inch'],
    freeDelivery: true
  },
  {
    id: 'asus-rog-zephyrus-g16',
    name: 'ASUS ROG Zephyrus G16 OLED (RTX 4080)',
    brand: 'Asus',
    category: 'laptops',
    subcategory: 'Gaming Laptops',
    description: 'Ultra-thin CNC aluminum gaming laptop with 2.5K 240Hz ROG Nebula OLED display, Intel Core Ultra 9, and NVIDIA GeForce RTX 4080.',
    features: [
      'Intel Core Ultra 9 185H with dedicated AI NPU',
      'NVIDIA GeForce RTX 4080 12GB GDDR6 (115W TGP)',
      '16-inch 2.5K 240Hz 0.2ms OLED ROG Nebula Display',
      'Slash Lighting customizable LED lid array'
    ],
    specs: {
      'Display': '16.0-inch 2.5K (2560x1600) OLED, 240Hz, G-SYNC, 500 nits',
      'GPU': 'NVIDIA GeForce RTX 4080 Laptop GPU 12GB',
      'RAM': '32GB LPDDR5X-7467 MHz dual-channel',
      'Storage': '1TB PCIe 4.0 NVMe M.2 SSD',
      'Weight': '1.85 kg ultra-portable gaming'
    },
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 2490,
    originalPriceUSD: 2690,
    variants: [
      { id: 'rog-g16-eclipse-gray', name: 'Core Ultra 9 / RTX 4080 / 32GB / 1TB - Eclipse Gray', priceUSD: 2490, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 17,
    condition: 'Brand New (Sealed)',
    warranty: '2 Years ASUS Official Agency Warranty in Lebanon',
    inStock: true,
    isFeatured: true,
    tags: ['Gaming', 'ROG', 'RTX 4080', 'OLED 240Hz'],
    freeDelivery: true
  },
  {
    id: 'ipad-pro-m4-13',
    name: 'Apple iPad Pro 13" (M4 Chip OLED)',
    brand: 'Apple',
    category: 'tablets',
    subcategory: 'Pro Tablets',
    description: 'The thinnest Apple product ever at 5.1mm with revolutionary Tandem OLED Ultra Retina XDR display, M4 chip, and Apple Pencil Pro support.',
    features: [
      'Breakthrough Tandem OLED Ultra Retina XDR with 1000 nits full-screen',
      'M4 chip with 4x faster rendering than M2',
      'Ultra-thin 5.1mm enclosure with landscape Center Stage 12MP camera',
      'Support for Apple Pencil Pro with barrel roll and squeeze haptics'
    ],
    specs: {
      'Display': '13.0-inch Tandem OLED Ultra Retina XDR (2752x2064)',
      'Processor': 'Apple M4 (9-core CPU / 10-core GPU)',
      'Memory': '8GB Unified Memory (16GB on 1TB+ models)',
      'Storage': '256GB High-Speed NVMe',
      'Camera': '12MP Wide + LiDAR scanner, ProRes 4K video'
    },
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 1220,
    originalPriceUSD: 1299,
    variants: [
      { id: 'ipad-pro-13-256-spaceblack', name: '256GB Wi-Fi - Space Black', priceUSD: 1220, inStock: true },
      { id: 'ipad-pro-13-512-silver', name: '512GB Wi-Fi - Silver', priceUSD: 1440, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 34,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Apple Official Agency Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['iPad Pro', 'M4', 'Tandem OLED'],
    freeDelivery: true
  },
  {
    id: 'samsung-galaxy-tab-s9-ultra',
    name: 'Samsung Galaxy Tab S9 Ultra (with S-Pen)',
    brand: 'Samsung',
    category: 'tablets',
    subcategory: 'Pro Tablets',
    description: 'Massive 14.6-inch Dynamic AMOLED 2X display with IP68 water resistance on both tablet and S-Pen, powered by Snapdragon 8 Gen 2 for Galaxy.',
    features: [
      'Massive 14.6-inch 120Hz Dynamic AMOLED 2X cinema canvas',
      'Included IP68 water and dust resistant S-Pen in the box',
      'Quad AKG stereo speakers with Dolby Atmos surround',
      'Samsung DeX workstation mode for laptop-like productivity'
    ],
    specs: {
      'Display': '14.6-inch Dynamic AMOLED 2X (2960x1848), 120Hz',
      'Processor': 'Snapdragon 8 Gen 2 for Galaxy',
      'RAM & Storage': '12GB RAM + 512GB Storage + MicroSD up to 1TB',
      'Battery': '11,200 mAh with 45W super fast charging'
    },
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 980,
    originalPriceUSD: 1150,
    variants: [
      { id: 'tab-s9u-512-graphite', name: '12GB / 512GB Wi-Fi - Graphite', priceUSD: 980, inStock: true }
    ],
    rating: 4.8,
    reviewCount: 16,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year CTC Samsung Lebanon Official Warranty',
    inStock: true,
    isFeatured: false,
    tags: ['Samsung', 'Tab S9 Ultra', 'AMOLED 14.6"'],
    freeDelivery: true
  },
  {
    id: 'airpods-pro-2-usbc',
    name: 'Apple AirPods Pro 2 (USB-C MagSafe)',
    brand: 'Apple',
    category: 'audio',
    subcategory: 'Wireless Earbuds',
    description: 'Up to 2x more Active Noise Cancellation, Adaptive Audio, Personalized Spatial Audio with dynamic head tracking, and USB-C MagSafe charging case.',
    features: [
      'Apple H2 headphone chip for intelligent noise canceling',
      'Adaptive Audio and Transparency mode with Conversation Awareness',
      'MagSafe charging case (USB-C) with speaker and lanyard loop',
      'Dust, sweat, and water resistant (IP54)'
    ],
    specs: {
      'Chip': 'Apple H2 chip in earbuds, Apple U1 chip in case',
      'Connectivity': 'Bluetooth 5.3',
      'Battery': 'Up to 6 hours listening with ANC (up to 30 hours with case)',
      'Charging': 'USB-C, MagSafe, Apple Watch charger, Qi-certified'
    },
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 235,
    originalPriceUSD: 260,
    variants: [
      { id: 'app2-usbc', name: 'AirPods Pro 2 (USB-C Edition)', priceUSD: 235, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 120,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Apple Official Agency Warranty',
    inStock: true,
    isFeatured: true,
    isHotDeal: true,
    tags: ['Apple', 'AirPods Pro', 'Noise Cancelling', 'Bestseller'],
    freeDelivery: true
  },
  {
    id: 'airpods-max-usbc',
    name: 'Apple AirPods Max (USB-C)',
    brand: 'Apple',
    category: 'audio',
    subcategory: 'Over-Ear Headphones',
    description: 'High-fidelity audio with computational sound, active noise cancellation, transparency mode, knit-mesh canopy headband, and USB-C audio port.',
    features: [
      'Apple-designed 40mm dynamic driver for wide frequency reproduction',
      'Active Noise Cancellation with Transparency mode',
      'Personalized Spatial Audio with dynamic head tracking',
      'Memory foam ear cushions with acoustically engineered mesh canopy'
    ],
    specs: {
      'Chips': 'Dual Apple H1 headphone chips (one in each ear cup)',
      'Connector': 'USB-C for charging and lossless audio listening',
      'Battery': 'Up to 20 hours listening time on a single charge',
      'Weight': '386.2 grams'
    },
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 540,
    originalPriceUSD: 590,
    variants: [
      { id: 'apm-midnight', name: 'USB-C - Midnight Black', priceUSD: 540, inStock: true },
      { id: 'apm-starlight', name: 'USB-C - Starlight', priceUSD: 540, inStock: true }
    ],
    rating: 4.8,
    reviewCount: 33,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Apple Official Agency Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['Apple', 'AirPods Max', 'Audiophile'],
    freeDelivery: true
  },
  {
    id: 'sony-wh1000xm5',
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    brand: 'Sony',
    category: 'audio',
    subcategory: 'Over-Ear Headphones',
    description: 'Industry-leading noise canceling with two processors, 8 microphones, Auto NC Optimizer, and up to 30 hours battery with 3-minute quick charging.',
    features: [
      'Dual processors (V1 + QN1) controlling 8 noise-canceling mics',
      'Precision-engineered 30mm carbon fiber composite driver',
      'Crystal-clear hands-free calling with 4 beamforming mics',
      'Multi-point Bluetooth connection to switch between two devices'
    ],
    specs: {
      'Frequency Response': '4 Hz - 40,000 Hz (Hi-Res Audio Wireless / LDAC)',
      'Battery': '30 hours with ANC on (up to 40 hours with ANC off)',
      'Weight': '250 grams lightweight soft fit leather'
    },
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 330,
    originalPriceUSD: 399,
    variants: [
      { id: 'xm5-black', name: 'Matte Black', priceUSD: 330, inStock: true },
      { id: 'xm5-silver', name: 'Platinum Silver', priceUSD: 330, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 65,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Sony Official Agency Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['Sony', 'ANC', 'Hi-Res', 'Bestseller'],
    freeDelivery: true
  },
  {
    id: 'jbl-boombox-3-wifi',
    name: 'JBL Boombox 3 Wi-Fi & Bluetooth Speaker',
    brand: 'JBL',
    category: 'audio',
    subcategory: 'Portable Speakers',
    description: 'Massive monstrous bass with 3-way acoustic speaker design, Dolby Atmos 3D audio streaming over Wi-Fi, IP67 waterproof enclosure, and built-in powerbank.',
    features: [
      'Massive sound with monstrous bass via 3-way speaker system',
      'Wi-Fi connectivity with AirPlay, Alexa Multi-Room, and Chromecast',
      '24 hours playtime with built-in device charging powerbank',
      'IP67 waterproof and dustproof submersible rating'
    ],
    specs: {
      'Output Power': '1x 80W RMS Subwoofer + 2x 40W RMS Midrange + 2x 10W RMS Tweeters',
      'Frequency Range': '40 Hz - 20 kHz',
      'Weight': '9.6 kg with sturdy metallic carrying handle'
    },
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 490,
    originalPriceUSD: 550,
    variants: [
      { id: 'bb3-black', name: 'Midnight Black', priceUSD: 490, inStock: true }
    ],
    rating: 4.8,
    reviewCount: 29,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year JBL Official Agency Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['JBL', 'Boombox', 'Party Speaker', 'Waterproof'],
    freeDelivery: true
  },
  {
    id: 'marshall-emberton-3',
    name: 'Marshall Emberton III Portable Bluetooth Speaker',
    brand: 'Marshall',
    category: 'audio',
    subcategory: 'Portable Speakers',
    description: 'Iconic Marshall vintage brass styling with True Stereophonic 360-degree multi-directional sound, 32+ hours playtime, and IP67 dust/water resistance.',
    features: [
      'True Stereophonic multi-directional 360 sound signature',
      '32+ hours portable playtime on single USB-C charge',
      'Rugged IP67 roadworthy water & dust resistant design',
      'Auracast-ready next-generation Bluetooth LE audio'
    ],
    specs: {
      'Amplifiers': 'Two 38W Class D amplifiers',
      'Max SPL': '90 dB @ 1 m',
      'Battery': 'Quick charge (20 mins gives 6 hours)',
      'Weight': '0.67 kg'
    },
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 185,
    originalPriceUSD: 210,
    variants: [
      { id: 'emb3-black-brass', name: 'Black and Brass', priceUSD: 185, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 36,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Official Agency Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['Marshall', 'Retro', 'Portable', 'Bluetooth'],
    freeDelivery: true
  },
  {
    id: 'apple-watch-ultra-2',
    name: 'Apple Watch Ultra 2 (Black Titanium GPS + Cellular)',
    brand: 'Apple',
    category: 'wearables',
    subcategory: 'Rugged Smartwatches',
    description: 'The ultimate sports & adventure watch forged in satin Black Titanium with precision dual-frequency GPS, 3000 nits display, and 72-hour Low Power battery.',
    features: [
      '49mm satin Black Titanium aerospace case with sapphire front crystal',
      'S9 SiP with Double Tap gesture control and on-device Siri',
      'Precision dual-frequency GPS (L1 and L5) with route backtracking',
      '100m water resistant with EN13319 dive computer certification'
    ],
    specs: {
      'Case Size': '49mm aerospace-grade titanium',
      'Display': 'Always-On Retina OLED, up to 3000 nits peak brightness',
      'Battery': 'Up to 36 hours normal use (up to 72 hours in Low Power Mode)',
      'Cellular': '4G LTE + UMTS worldwide roaming'
    },
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 790,
    originalPriceUSD: 850,
    variants: [
      { id: 'awu2-black-trail', name: 'Black Titanium - Trail Loop (M/L)', priceUSD: 790, inStock: true },
      { id: 'awu2-black-ocean', name: 'Black Titanium - Ocean Band', priceUSD: 790, inStock: true }
    ],
    rating: 5.0,
    reviewCount: 44,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Apple Official Agency Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['Apple Watch', 'Ultra 2', 'Titanium', 'GPS Cellular'],
    freeDelivery: true
  },
  {
    id: 'samsung-galaxy-watch-ultra',
    name: 'Samsung Galaxy Watch Ultra 47mm LTE',
    brand: 'Samsung',
    category: 'wearables',
    subcategory: 'Rugged Smartwatches',
    description: 'Forged in titanium with 10 ATM water resistance, dual-frequency GPS, emergency siren, and BioActive sensor with personalized Energy Score.',
    features: [
      'Titanium cushion design built to endure up to 55°C and 9000m altitudes',
      '3nm processor for swift response and efficient battery life',
      'Emergency 86-decibel safety siren audible up to 180 meters',
      'Galaxy AI personalized wellness and athletic coaching'
    ],
    specs: {
      'Display': '1.5-inch Super AMOLED (480x480), Sapphire Crystal, 3000 nits',
      'Durability': '10 ATM + IP68, MIL-STD-810H certified',
      'Battery': '590 mAh (up to 100 hours in Power Saving Mode)'
    },
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 560,
    originalPriceUSD: 649,
    variants: [
      { id: 'gwu-titanium-gray', name: 'Titanium Gray - Marine Band', priceUSD: 560, inStock: true }
    ],
    rating: 4.8,
    reviewCount: 18,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year CTC Samsung Lebanon Official Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['Samsung', 'Watch Ultra', 'LTE'],
    freeDelivery: true
  },
  {
    id: 'ps5-pro-console',
    name: 'Sony PlayStation 5 Pro Console (2TB SSD)',
    brand: 'Sony',
    category: 'gaming',
    subcategory: 'Consoles',
    description: 'PlayStation Spectral Super Resolution (PSSR) AI upscaling, 67% more compute units, advanced ray tracing, and 2TB high-speed NVMe storage.',
    features: [
      'PlayStation Spectral Super Resolution (PSSR) AI-driven upscaling',
      'Upgraded GPU with 67% more Compute Units and 28% faster memory',
      'Advanced hardware ray tracing for ultra-realistic lighting',
      'Full 4K gaming at steady 60fps / 120fps with DualSense wireless controller'
    ],
    specs: {
      'GPU': 'RDNA 3-derived architecture with dedicated AI hardware accelerator',
      'Storage': '2TB Ultra-High Speed Custom NVMe SSD',
      'Output': 'Supports 4K 120Hz, 8K TVs, VRR, HDR10',
      'Includes': 'PS5 Pro Console, DualSense Wireless Controller, Astro\'s Playroom pre-installed'
    },
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 850,
    originalPriceUSD: 920,
    variants: [
      { id: 'ps5pro-standard', name: 'PS5 Pro 2TB Edition (Middle East Spec)', priceUSD: 850, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 52,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Official Sony Agency Warranty',
    inStock: true,
    isFeatured: true,
    isHotDeal: true,
    tags: ['PS5 Pro', 'Sony', 'Console', 'PSSR', '4K 120fps'],
    freeDelivery: true
  },
  {
    id: 'logitech-g923-racing-wheel',
    name: 'Logitech G923 TRUEFORCE Sim Racing Wheel & Pedals',
    brand: 'Logitech',
    category: 'racing-wheel',
    subcategory: 'Sim Racing',
    description: 'Next-gen force feedback with TRUEFORCE technology dialed directly into in-game physics engines at 4000 times per second with responsive pressure-sensitive pedals.',
    features: [
      'TRUEFORCE high-definition force feedback directly wired to game audio and physics',
      'Programmable dual-clutch launch assist for maximum launch traction',
      'Built-in 24-point selection dial and rev indicator LED tachometer',
      'Brushed metal steering wheel with hand-stitched automotive leather cover'
    ],
    specs: {
      'Rotation': '900 degrees lock-to-lock',
      'Pedals': 'Nonlinear brake pedal with patented carpet grip and stainless steel faces',
      'Compatibility': 'PlayStation 5, PlayStation 4, and PC (Windows 11/10)'
    },
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 380,
    originalPriceUSD: 430,
    variants: [
      { id: 'g923-ps-pc', name: 'PS5 / PS4 / PC Edition', priceUSD: 380, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 38,
    condition: 'Brand New (Sealed)',
    warranty: '2 Years Logitech Official Agency Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['TrueForce', 'Logitech', 'Racing Wheel', 'Sim Racing', 'PS5 Compatible'],
    freeDelivery: true
  },
  {
    id: 'anker-prime-200w-powerbank',
    name: 'Anker Prime 20,000mAh Power Bank (200W Output)',
    brand: 'Anker',
    category: 'power',
    subcategory: 'Power Banks',
    description: 'Ultra-compact power bank with 200W total output, dual 100W USB-C fast charging ports, smart digital display showing live battery health and charging wattage.',
    features: [
      '200W total output: charge two high-power laptops simultaneously at 100W each',
      'Smart LCD digital display showing wattage, capacity, and recharge time remaining',
      '20,000mAh capacity to fast-charge iPhone 16 over 4 times or MacBook Pro once',
      'ActiveShield 2.0 safety system monitoring temperatures over 3 million times per day'
    ],
    specs: {
      'Capacity': '20,000 mAh (72Wh - TSA Flight Approved)',
      'Outputs': '2x USB-C (100W Max each) + 1x USB-A (65W Max)',
      'Recharging': '100W fast input recharges to 100% in just 1 hour 15 minutes'
    },
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 110,
    originalPriceUSD: 135,
    variants: [
      { id: 'anker-prime-200w', name: 'Anker Prime 20,000mAh 200W', priceUSD: 110, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 46,
    condition: 'Brand New (Sealed)',
    warranty: '24 Months Anker Official Agency Replacement Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['Anker', 'Power Bank', '200W', 'Laptop Charger', 'GaN'],
    freeDelivery: true
  },
  {
    id: 'dji-mini-4-pro',
    name: 'DJI Mini 4 Pro Fly More Combo Plus (DJI RC 2)',
    brand: 'DJI',
    category: 'cameras-projectors',
    subcategory: 'Drones',
    description: 'Sub-249g lightweight camera drone with omnidirectional obstacle sensing, 4K/60fps HDR true vertical video, 20km FHD transmission, and up to 45 mins flight.',
    features: [
      'Under 249 grams regulation-friendly foldable design',
      'Omnidirectional active obstacle sensing in all directions',
      '4K/60fps HDR video & true vertical shooting for social media',
      'DJI RC 2 remote controller with integrated 5.5-inch 700-nit FHD screen',
      'Fly More Combo includes 3 Intelligent Flight Batteries Plus & charging hub'
    ],
    specs: {
      'Weight': '249 grams',
      'Max Flight Time': 'Up to 45 minutes with Intelligent Flight Battery Plus',
      'Transmission': 'DJI O4 video transmission up to 20 km range',
      'Camera': '1/1.3-inch CMOS, f/1.7 aperture, dual native ISO fusion'
    },
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 1080,
    originalPriceUSD: 1190,
    variants: [
      { id: 'dji-mini4p-fmc-rc2', name: 'Fly More Combo Plus with DJI RC 2 Screen', priceUSD: 1080, inStock: true }
    ],
    rating: 5.0,
    reviewCount: 24,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year DJI Official Agency Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['DJI', 'Drone', 'Mini 4 Pro', '4K60', 'Obstacle Sensing'],
    freeDelivery: true
  },
  {
    id: 'dji-osmo-pocket-3-creator',
    name: 'DJI Osmo Pocket 3 Creator Combo',
    brand: 'DJI',
    category: 'cameras-projectors',
    subcategory: 'Action Cameras',
    description: 'Pocket-sized gimbal camera with massive 1-inch CMOS sensor, rotatable 2-inch touchscreen, ActiveTrack 6.0, and DJI Mic 2 transmitter included.',
    features: [
      'Powerful 1-inch CMOS sensor for stunning low-light video',
      'Rotatable 2-inch OLED touchscreen for quick horizontal and vertical filming',
      '3-axis mechanical gimbal stabilization with smooth motion',
      'Creator Combo includes DJI Mic 2 transmitter with built-in 32-bit float audio'
    ],
    specs: {
      'Sensor': '1-inch CMOS with 4K/120fps slow motion',
      'Stabilization': '3-axis motorized mechanical gimbal',
      'Battery': 'Charges to 80% in just 16 minutes'
    },
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 660,
    originalPriceUSD: 720,
    variants: [
      { id: 'pocket-3-creator', name: 'Creator Combo with DJI Mic 2', priceUSD: 660, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 37,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year DJI Official Agency Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['DJI', 'Pocket 3', 'Vlogging', 'Gimbal'],
    freeDelivery: true
  },
  {
    id: 'samsung-t9-2tb-ssd',
    name: 'Samsung T9 2TB Shield Portable SSD',
    brand: 'Samsung',
    category: 'flash-card-memory',
    subcategory: 'External Storage',
    description: 'Lightning-fast USB 3.2 Gen 2x2 portable SSD with read/write speeds up to 2,000 MB/s, drop resistant up to 3 meters, and Dynamic Thermal Guard.',
    features: [
      'Blazing transfer speeds up to 2,000 MB/s with USB 3.2 Gen 2x2',
      'Shock-absorbing rubberized exterior with 3-meter drop resistance',
      'Dynamic Thermal Guard prevents overheating during heavy video writes',
      'Broad compatibility with Mac, Windows, Android, iPhone 16 Pro ProRes, and gaming consoles'
    ],
    specs: {
      'Capacity': '2TB High-Density 3D V-NAND',
      'Interface': 'USB 3.2 Gen 2x2 (20 Gbps)',
      'Security': 'AES 256-bit hardware encryption'
    },
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 210,
    originalPriceUSD: 240,
    variants: [
      { id: 'samsung-t9-2tb', name: '2TB Charcoal Black', priceUSD: 210, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 41,
    condition: 'Brand New (Sealed)',
    warranty: '5 Years Samsung Official Agency Warranty',
    inStock: true,
    isFeatured: false,
    tags: ['Samsung', 'SSD', '2TB', 'ProRes 4K'],
    freeDelivery: true
  },
  {
    id: 'ugreen-nexode-300w-gan',
    name: 'UGREEN Nexode 300W 5-Port GaN Fast Desktop Charger',
    brand: 'UGREEN',
    category: 'power',
    subcategory: 'GaN Chargers',
    description: 'Mighty 300W desktop charging station with single port 140W PD 3.1 fast charge, powering up to 3 laptops plus phone and watch at the same time.',
    features: [
      '300W total GaN charging power across 5 output ports (4x USB-C + 1x USB-A)',
      'Single-port 140W PD 3.1 capability to fast charge 16" MacBook Pro to 55% in 30 mins',
      'Thermal Guard 2.0 temperature monitoring 6000 times per minute',
      'Heavy-duty grounded desktop cable for stable placement'
    ],
    specs: {
      'Total Output': '300W Max',
      'Ports': '4x USB-C + 1x USB-A',
      'Safety': 'GaNFast chip with over-voltage, short-circuit, and over-temp protections'
    },
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 145,
    originalPriceUSD: 170,
    variants: [
      { id: 'ugreen-300w-gan', name: 'Nexode 300W 5-Port Edition', priceUSD: 145, inStock: true }
    ],
    rating: 4.8,
    reviewCount: 26,
    condition: 'Brand New (Sealed)',
    warranty: '18 Months UGREEN Official Warranty',
    inStock: true,
    isFeatured: false,
    tags: ['UGREEN', '300W', 'GaN', 'Fast Charger'],
    freeDelivery: true
  },
  {
    id: 'nintendo-switch-oled',
    name: 'Nintendo Switch OLED Model (White Edition)',
    brand: 'Nintendo',
    category: 'gaming',
    subcategory: 'Handheld Consoles',
    description: 'Vibrant 7-inch OLED screen with wide adjustable kickstand, wired LAN dock, 64GB internal storage, and enhanced audio in handheld and tabletop modes.',
    features: [
      '7-inch OLED display with vivid colors and crisp contrast',
      'Wide, adjustable kickstand for comfortable viewing angles in tabletop mode',
      'Wired LAN port in dock for stable online multiplayer',
      'Versatile Joy-Con controllers with HD rumble and motion IR camera'
    ],
    specs: {
      'Display': '7.0-inch multi-touch OLED screen (1280x720)',
      'Storage': '64GB internal + MicroSD expansion up to 2TB',
      'Battery': 'Up to 9 hours continuous gameplay'
    },
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 330,
    originalPriceUSD: 360,
    variants: [
      { id: 'switch-oled-white', name: 'White Joy-Con Edition', priceUSD: 330, inStock: true }
    ],
    rating: 4.8,
    reviewCount: 62,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Nintendo Official Agency Warranty',
    inStock: true,
    isFeatured: false,
    tags: ['Nintendo', 'Switch OLED', 'Handheld', 'Gaming'],
    freeDelivery: true
  },
  {
    id: 'pitaka-magez-car-mount-pro-2',
    name: 'PITAKA MagEZ Car Mount Pro 2 (Qi2 15W Fast Charge)',
    brand: 'Pitaka',
    category: 'car-accessories',
    subcategory: 'Car Mounts',
    description: 'Aramid fiber magnetic wireless car charger with Qi2 official 15W MagSafe fast charging, built-in cooling fan, and ultra-secure vent grip.',
    features: [
      'Aerospace-grade genuine aramid fiber weave construction',
      'Official Qi2 certified 15W wireless MagSafe fast charging',
      'Built-in active cooling fan keeps phone cool and maintains top speed',
      'Robust all-metal hook clamp locks onto AC air vents'
    ],
    specs: {
      'Wireless Output': '15W Max Qi2 Fast Charge',
      'Magnets': 'N52SH ultra-strong neodymium magnets hold up to 1.2 kg',
      'Material': 'Aramid Fiber + Zinc Alloy'
    },
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 65,
    originalPriceUSD: 75,
    variants: [
      { id: 'pitaka-car-pro2', name: 'Aramid Black Air Vent Mount', priceUSD: 65, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 22,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Official Agency Warranty',
    inStock: true,
    isFeatured: false,
    tags: ['Pitaka', 'Qi2', 'MagSafe Car Mount', 'Aramid'],
    freeDelivery: false
  },
  {
    id: 'whoop-4-fitness-band',
    name: 'WHOOP 4.0 Health & Fitness Tracker Band',
    brand: 'Whoop',
    category: 'wearables',
    subcategory: 'Fitness Trackers',
    description: 'Screenless health sensor tracking sleep quality, recovery score, cardiovascular strain, skin temperature, and blood oxygen 24/7 with waterproof battery pack.',
    features: [
      'Screen-free minimalist design zero distractions',
      'Tracks Strain, Recovery, Sleep, and HRV metrics with clinical precision',
      'Slide-on wireless waterproof battery pack to charge while wearing',
      'Skin temperature sensor and blood oxygen pulse oximeter'
    ],
    specs: {
      'Sensors': '5 LEDs (green, red, infrared), 4 photodiodes, skin temp sensor',
      'Battery': '4-5 days continuous wearing',
      'Waterproof': 'IP68 waterproof up to 10 meters'
    },
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 240,
    originalPriceUSD: 270,
    variants: [
      { id: 'whoop4-onyx', name: 'Onyx Black SuperKnit Band + Sensor', priceUSD: 240, inStock: true }
    ],
    rating: 4.7,
    reviewCount: 15,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Official Warranty',
    inStock: true,
    isFeatured: false,
    tags: ['Whoop', 'Fitness', 'Recovery', 'HRV'],
    freeDelivery: true
  },
  {
    id: 'razer-viper-v3-pro',
    name: 'Razer Viper V3 Pro Ultra-Lightweight Wireless Gaming Mouse',
    brand: 'Razer',
    category: 'gaming',
    subcategory: 'Gaming Peripherals',
    description: '54g featherlight esports mouse with Razer Focus Pro 35K Gen-2 optical sensor, true 8000Hz wireless polling rate, and optical mouse switches Gen-3.',
    features: [
      '54g ultra-lightweight esports ergonomic balanced design',
      'Razer Focus Pro 35K Optical Sensor Gen-2 with 99.8% resolution accuracy',
      'True 8000 Hz HyperPolling Wireless technology for 0.125ms latency',
      'Razer Optical Mouse Switches Gen-3 rated for 90 million clicks'
    ],
    specs: {
      'DPI': '35,000 Max DPI with 1-DPI step adjustments',
      'Polling Rate': 'Up to 8,000 Hz via included HyperPolling Wireless Dongle',
      'Battery': 'Up to 95 hours constant motion at 1000Hz',
      'Weight': '54 grams'
    },
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80'],
    basePriceUSD: 160,
    originalPriceUSD: 180,
    variants: [
      { id: 'viper-v3-black', name: 'Black Edition', priceUSD: 160, inStock: true },
      { id: 'viper-v3-white', name: 'White Edition', priceUSD: 160, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 31,
    condition: 'Brand New (Sealed)',
    warranty: '2 Years Razer Official Agency Warranty',
    inStock: true,
    isFeatured: false,
    tags: ['Razer', 'Esports', '8000Hz', 'Viper V3 Pro'],
    freeDelivery: true
  }
];

// Combine or add additional category items to ensure complete 50+ scaling
const ADDITIONAL_TECH_ITEMS = [
  {
    id: 'apple-watch-series-10',
    name: 'Apple Watch Series 10 (Titanium Edition)',
    brand: 'Apple',
    category: 'wearables',
    basePriceUSD: 690,
    description: 'Thinnest Apple Watch ever with wide-angle OLED display, sleep apnea notifications, and fast charging up to 80% in 30 minutes.',
    specs: { 'Case': '46mm Natural Titanium', 'Display': 'Wide-angle OLED Always-On', 'Water Resistance': '50m with Depth gauge' }
  },
  {
    id: 'samsung-galaxy-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra 5G',
    brand: 'Samsung',
    category: 'smartphones',
    basePriceUSD: 990,
    description: 'Snapdragon 8 Gen 3 with Galaxy AI live translate, titanium frame, flat 6.8" 120Hz display, and 200MP quad-tele camera.',
    specs: { 'Display': '6.8" Dynamic AMOLED 2X 2600 nits', 'Processor': 'Snapdragon 8 Gen 3 for Galaxy', 'RAM': '12GB' }
  },
  {
    id: 'samsung-galaxy-s24-plus',
    name: 'Samsung Galaxy S24+ 5G',
    brand: 'Samsung',
    category: 'smartphones',
    basePriceUSD: 790,
    description: 'Expanded QHD+ 6.7" Dynamic AMOLED 2X screen, 12GB RAM, 4900 mAh battery, and Galaxy AI suite.',
    specs: { 'Display': '6.7" QHD+ 120Hz', 'Storage': '256GB', 'Battery': '4,900 mAh 45W' }
  },
  {
    id: 'samsung-galaxy-z-flip-6',
    name: 'Samsung Galaxy Z Flip 6',
    brand: 'Samsung',
    category: 'smartphones',
    basePriceUSD: 850,
    description: 'Compact pocket-sized flip phone with 50MP camera, FlexWindow widgets, vapor chamber cooling, and 4000 mAh battery.',
    specs: { 'Main Display': '6.7" Foldable AMOLED 120Hz', 'Flex Display': '3.4" Super AMOLED', 'Camera': '50MP Main' }
  },
  {
    id: 'xiaomi-13t-pro',
    name: 'Xiaomi 13T Pro (Leica Camera)',
    brand: 'Xiaomi',
    category: 'smartphones',
    basePriceUSD: 540,
    description: 'Flagship MediaTek Dimensity 9200+, 144Hz CrystalRes AMOLED display, 120W HyperCharge, and Leica optics.',
    specs: { 'Display': '6.67" 144Hz AMOLED', 'Charging': '120W in-box charger', 'Camera': '50MP Leica Main' }
  },
  {
    id: 'apple-macbook-pro-14-m4',
    name: 'Apple MacBook Pro 14" (M4 Chip)',
    brand: 'Apple',
    category: 'laptops',
    basePriceUSD: 1620,
    description: 'M4 chip powerhouse with 16GB unified memory standard, 3x Thunderbolt 4 ports, and Liquid Retina XDR screen.',
    specs: { 'Processor': 'Apple M4 10-core CPU', 'RAM': '16GB Unified Memory', 'SSD': '512GB Fast SSD' }
  },
  {
    id: 'apple-macbook-air-13-m3',
    name: 'Apple MacBook Air 13" (M3 Chip)',
    brand: 'Apple',
    category: 'laptops',
    basePriceUSD: 1120,
    description: 'Ultra-portable 13.6-inch Liquid Retina laptop with 18-hour battery, MagSafe charging, and silent fanless operation.',
    specs: { 'Display': '13.6" Liquid Retina', 'Processor': 'Apple M3 8-core', 'Weight': '1.24 kg' }
  },
  {
    id: 'lenovo-legion-pro-7i',
    name: 'Lenovo Legion Pro 7i Gen 9 (RTX 4080)',
    brand: 'Lenovo',
    category: 'laptops',
    basePriceUSD: 2390,
    description: 'Competitive esports laptop with Intel Core i9-14900HX, RTX 4080 175W, and 16" WQXGA 240Hz PureSight display.',
    specs: { 'Processor': 'Intel Core i9-14900HX', 'GPU': 'RTX 4080 12GB (175W)', 'Display': '16" 240Hz 500 nits' }
  },
  {
    id: 'dell-xps-15-oled',
    name: 'Dell XPS 15 9530 (3.5K OLED Touch)',
    brand: 'Dell',
    category: 'laptops',
    basePriceUSD: 1980,
    description: 'Machined aluminum and carbon fiber chassis with breathtaking 3.5K OLED InfinityEdge touch screen and RTX 4060.',
    specs: { 'Display': '15.6" 3.5K (3456x2160) OLED Touch', 'Processor': 'Intel Core i7-13700H', 'RAM': '32GB DDR5' }
  },
  {
    id: 'ipad-pro-m4-11',
    name: 'Apple iPad Pro 11" (M4 Tandem OLED)',
    brand: 'Apple',
    category: 'tablets',
    basePriceUSD: 990,
    description: 'Ultra-compact pro slate with M4 chip, 11-inch Tandem OLED Ultra Retina XDR screen, and 5.3mm slim design.',
    specs: { 'Display': '11" Tandem OLED 120Hz', 'Chip': 'Apple M4', 'Storage': '256GB' }
  },
  {
    id: 'ipad-air-13-m2',
    name: 'Apple iPad Air 13" (M2 Chip)',
    brand: 'Apple',
    category: 'tablets',
    basePriceUSD: 790,
    description: 'Redesigned iPad Air in an expansive 13-inch format with M2 performance and landscape FaceTime camera.',
    specs: { 'Display': '13.0" Liquid Retina LED', 'Processor': 'Apple M2', 'Storage': '128GB' }
  },
  {
    id: 'ipad-10th-gen',
    name: 'Apple iPad 10.9" (10th Generation)',
    brand: 'Apple',
    category: 'tablets',
    basePriceUSD: 360,
    description: 'All-screen design with 10.9-inch Liquid Retina display, A14 Bionic chip, USB-C, and Apple Pencil support.',
    specs: { 'Display': '10.9" Liquid Retina', 'Chip': 'A14 Bionic', 'Storage': '64GB' }
  },
  {
    id: 'xiaomi-pad-6',
    name: 'Xiaomi Pad 6 (Snapdragon 870)',
    brand: 'Xiaomi',
    category: 'tablets',
    basePriceUSD: 290,
    description: '11-inch 2.8K 144Hz display with quad stereo speakers, metal unibody design, and 8840 mAh battery with 33W fast charge.',
    specs: { 'Display': '11.0" 2.8K 144Hz', 'Processor': 'Snapdragon 870', 'Battery': '8,840 mAh' }
  },
  {
    id: 'sony-wf1000xm5',
    name: 'Sony WF-1000XM5 True Wireless Earbuds',
    brand: 'Sony',
    category: 'audio',
    basePriceUSD: 240,
    description: 'Astonishing noise canceling with Dynamic Driver X, Bone Conduction voice sensors, and LDAC Hi-Res wireless audio.',
    specs: { 'Noise Canceling': 'Dual processor V2 + QN2e', 'Battery': '8 hrs earbuds + 16 hrs case', 'Bluetooth': '5.3' }
  },
  {
    id: 'jbl-partybox-stage-320',
    name: 'JBL PartyBox Stage 320 Portable Party Speaker',
    brand: 'JBL',
    category: 'audio',
    basePriceUSD: 590,
    description: 'Powerful 240W RMS JBL Pro Sound with dual 6.5" woofers, dynamic light show, telescopic handle, and wide wheels.',
    specs: { 'Power': '240W RMS', 'Battery': 'Up to 18 hours with replaceable battery', 'Water Resistance': 'IPX4 splashproof' }
  },
  {
    id: 'marshall-stanmore-3',
    name: 'Marshall Stanmore III Bluetooth Home Speaker',
    brand: 'Marshall',
    category: 'audio',
    basePriceUSD: 370,
    description: 'Home audio speaker with wider soundstage, angled tweeters, brass knobs, and vintage guitar-amp aesthetics.',
    specs: { 'Amplifiers': 'One 50W woofer + two 15W tweeters', 'Bluetooth': '5.2 with 3.5mm and RCA inputs' }
  },
  {
    id: 'bose-quietcomfort-ultra',
    name: 'Bose QuietComfort Ultra Wireless Headphones',
    brand: 'Bose',
    category: 'audio',
    basePriceUSD: 390,
    description: 'World-class noise cancellation with revolutionary Bose Immersive Audio spatial sound and CustomTune ear calibration.',
    specs: { 'Battery': 'Up to 24 hours', 'Technology': 'Bose Immersive Audio', 'Weight': '250g' }
  },
  {
    id: 'samsung-galaxy-watch-7',
    name: 'Samsung Galaxy Watch 7 (44mm Bluetooth)',
    brand: 'Samsung',
    category: 'wearables',
    basePriceUSD: 280,
    description: '3nm processor with dual-frequency GPS, sleep coaching, advanced metabolic index, and sapphire crystal glass.',
    specs: { 'Display': '1.5" Super AMOLED Sapphire', 'Processor': 'Exynos W1000 (3nm)', 'Size': '44mm' }
  },
  {
    id: 'ps5-slim-digital',
    name: 'Sony PlayStation 5 Slim Digital Edition (1TB)',
    brand: 'Sony',
    category: 'gaming',
    basePriceUSD: 460,
    description: 'Sleek compact design with 1TB SSD, DualSense wireless controller, 4K ray tracing, and ultra-fast loading.',
    specs: { 'Storage': '1TB NVMe SSD', 'Audio': 'Tempest 3D AudioTech', 'Weight': '2.6 kg' }
  },
  {
    id: 'playstation-portal',
    name: 'PlayStation Portal Remote Player for PS5',
    brand: 'Sony',
    category: 'gaming',
    basePriceUSD: 220,
    description: 'Handheld streaming device with 8-inch 1080p 60fps LCD screen, haptic feedback, and adaptive triggers of the DualSense.',
    specs: { 'Screen': '8" 1080p 60Hz LCD', 'Connectivity': 'Wi-Fi 5', 'Controls': 'Full DualSense haptics & triggers' }
  },
  {
    id: 'anker-737-powerbank',
    name: 'Anker 737 Power Bank (PowerCore 24K, 140W)',
    brand: 'Anker',
    category: 'power',
    basePriceUSD: 125,
    description: 'Power Delivery 3.1 140W bidirectional fast charging with smart digital color display and 24,000 mAh capacity.',
    specs: { 'Capacity': '24,000 mAh', 'Max Output': '140W Single Port', 'Ports': '2x USB-C + 1x USB-A' }
  },
  {
    id: 'apple-35w-dual-usbc',
    name: 'Apple 35W Dual USB-C Port Compact Power Adapter',
    brand: 'Apple',
    category: 'power',
    basePriceUSD: 55,
    description: 'Official Apple compact dual-port wall charger to power iPhone and Apple Watch or iPad simultaneously.',
    specs: { 'Power': '35W Dual USB-C', 'Compatibility': 'All iPhone, iPad, Apple Watch, and MacBook Air models' }
  },
  {
    id: 'gopro-hero-13-black',
    name: 'GoPro HERO 13 Black Action Camera',
    brand: 'GoPro',
    category: 'cameras-projectors',
    basePriceUSD: 399,
    description: '5.3K 60fps video, HyperSmooth 6.0 award-winning stabilization, magnetic latch mounting, and HB-Series lens compatibility.',
    specs: { 'Video': '5.3K60 / 4K120 / 2.7K240', 'Waterproof': '10 meters without housing', 'Sensor': '1/1.9" CMOS' }
  },
  {
    id: 'anker-maggo-car-mount',
    name: 'Anker MagGo Wireless Car Charger (15W Qi2)',
    brand: 'Anker',
    category: 'car-accessories',
    basePriceUSD: 50,
    description: 'Ultra-fast 15W Qi2 certified magnetic car charger with strong air vent grip and 360-degree ball rotation.',
    specs: { 'Output': '15W Qi2 MagSafe', 'Mount': 'Air Vent Clip with stabilizer bar' }
  },
  {
    id: 'sandisk-extreme-pro-1tb-microsd',
    name: 'SanDisk Extreme PRO 1TB MicroSDXC UHS-I Card',
    brand: 'SanDisk',
    category: 'flash-card-memory',
    basePriceUSD: 115,
    description: 'Read speeds up to 200MB/s with SanDisk QuickFlow technology for 4K and 5K UHD action cams, drones, and phones.',
    specs: { 'Capacity': '1TB', 'Speed': 'Up to 200MB/s read, 140MB/s write', 'Rating': 'A2, C10, V30, U3' }
  },
  {
    id: 'ugreen-thunderbolt-4-cable',
    name: 'UGREEN Thunderbolt 4 Braided Cable (0.8m, 100W, 40Gbps)',
    brand: 'UGREEN',
    category: 'cables',
    basePriceUSD: 28,
    description: 'Certified 40Gbps data transfer cable with 100W Power Delivery and single 8K or dual 4K display output.',
    specs: { 'Speed': '40 Gbps', 'Charging': '100W PD', 'Length': '0.8 meter braided nylon' }
  },
  {
    id: 'green-lion-magsafe-powerbank',
    name: 'Green Lion MagSafe 10,000mAh Power Bank with Foldable Kickstand',
    brand: 'Green Lion',
    category: 'power',
    basePriceUSD: 35,
    description: 'Snap-on magnetic wireless charger with 15W wireless output, 20W PD Type-C wired port, and integrated zinc kickstand.',
    specs: { 'Capacity': '10,000 mAh', 'Wireless Output': '15W MagSafe', 'Kickstand': 'Zinc alloy fold-out' }
  }
];

// Helper to format item
function formatItem(raw, idx) {
  const images = raw.galleryImages && raw.galleryImages.length > 0 
    ? raw.galleryImages 
    : [raw.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80'];

  return {
    id: raw.id,
    name: raw.name,
    brand: raw.brand || 'Apple',
    category: raw.category || 'smartphones',
    subcategory: raw.subcategory || 'Electronics',
    description: raw.description || `${raw.name} official retail model with warranty.`,
    features: raw.features || [
      'Official Agency Warranty in Lebanon',
      'Brand New Original Factory Sealed Box',
      'Tested for optimal performance',
      'Fast doorstep delivery across Lebanon'
    ],
    specs: raw.specs || { Brand: raw.brand, Category: raw.category },
    image: raw.image || images[0],
    galleryImages: images,
    imageUrls: images,
    image_urls: images,
    basePriceUSD: raw.basePriceUSD || 100,
    originalPriceUSD: raw.originalPriceUSD || Math.round((raw.basePriceUSD || 100) * 1.1),
    storageOptions: raw.storageOptions,
    colorOptions: raw.colorOptions,
    variants: raw.variants || [
      { id: `${raw.id}-std`, name: 'Standard Edition', priceUSD: raw.basePriceUSD || 100, inStock: true }
    ],
    rating: raw.rating || 4.8,
    reviewCount: raw.reviewCount || 15 + (idx % 35),
    condition: raw.condition || 'Brand New (Sealed)',
    warranty: raw.warranty || '1 Year Official Lebanese Warranty',
    inStock: raw.inStock !== false,
    stockCount: 12,
    isFeatured: raw.isFeatured ?? (idx < 12),
    isHotDeal: raw.isHotDeal ?? (idx % 4 === 0),
    isNewArrival: raw.isNewArrival ?? (idx % 3 === 0),
    tags: raw.tags || [raw.brand, raw.category, 'Official Warranty'],
    freeDelivery: raw.freeDelivery ?? true
  };
}

// Generate the merged 52+ catalog
const fullCatalog = [
  ...BASE_52_PRODUCTS.map((p, i) => formatItem(p, i)),
  ...ADDITIONAL_TECH_ITEMS.map((p, i) => formatItem(p, i + BASE_52_PRODUCTS.length))
];

console.log(`[Bulk Import] Generated catalog with ${fullCatalog.length} products.`);

// Write to public/data/products.json
fs.writeFileSync(PUBLIC_PRODUCTS_PATH, JSON.stringify(fullCatalog, null, 2), 'utf-8');
console.log(`[Bulk Import] Successfully wrote ${fullCatalog.length} items to ${PUBLIC_PRODUCTS_PATH}`);

// Write to src/data/products.json
fs.writeFileSync(SRC_PRODUCTS_JSON_PATH, JSON.stringify(fullCatalog, null, 2), 'utf-8');
console.log(`[Bulk Import] Successfully wrote ${fullCatalog.length} items to ${SRC_PRODUCTS_JSON_PATH}`);

console.log('\nCatalog successfully ready for GitHub commit:');
console.log('git add public/data/products.json src/data/products.json');
console.log(`git commit -m "feat(catalog): scale product database to ${fullCatalog.length} products"`);
console.log('git push origin main\n');
