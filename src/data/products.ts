import { Product } from '../types';

const INITIAL_PRODUCTS: Product[] = [
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
    id: 'galaxy-s25-ultra',
    name: 'Samsung Galaxy S25 Ultra 5G',
    brand: 'Samsung',
    category: 'smartphones',
    subcategory: 'Flagship Phones',
    description: 'The pinnacle of Galaxy AI and mobile photography. Titanium frame with built-in S-Pen, Snapdragon 8 Elite for Galaxy, anti-reflective 2600 nits display, and 200MP quad camera setup.',
    features: [
      'Snapdragon 8 Elite Mobile Platform with Galaxy AI 2.0',
      '200MP Quad Telephoto Camera System with 100x Space Zoom',
      'Corning Gorilla Armor anti-reflective glass',
      'Integrated S Pen with Air Actions and handwriting note-taking',
      '7 Years of Android OS and Security Upgrades'
    ],
    specs: {
      'Display': '6.8-inch Dynamic AMOLED 2X, QHD+, 1-120Hz, 2600 nits',
      'Processor': 'Qualcomm Snapdragon 8 Elite for Galaxy (3nm)',
      'Rear Camera': '200MP Main + 50MP 5x Periscope + 50MP Ultra-Wide + 10MP 3x',
      'Front Camera': '12MP Dual Pixel AF',
      'Battery': '5,000 mAh, 45W Fast Wired Charging, 15W Wireless',
      'Water Resistance': 'IP68',
      'SIM': 'Dual Nano-SIM + Dual eSIM Support'
    },
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80'
    ],
    basePriceUSD: 1190,
    originalPriceUSD: 1299,
    variants: [
      { id: 's25u-256-titanium-gray', name: '256GB - Titanium Gray', storage: '256GB', color: 'Titanium Gray', colorHex: '#7B7D82', priceUSD: 1190, inStock: true },
      { id: 's25u-256-titanium-black', name: '256GB - Titanium Black', storage: '256GB', color: 'Titanium Black', colorHex: '#2B2B2C', priceUSD: 1190, inStock: true },
      { id: 's25u-512-titanium-silver', name: '512GB - Titanium Silver Blue', storage: '512GB', color: 'Titanium Silver Blue', colorHex: '#A6B8C7', priceUSD: 1360, inStock: true },
      { id: 's25u-1tb-titanium-black', name: '1TB - Titanium Black', storage: '1TB', color: 'Titanium Black', colorHex: '#2B2B2C', priceUSD: 1620, inStock: true }
    ],
    rating: 4.8,
    reviewCount: 62,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Official CTC / Samsung Agency Warranty',
    inStock: true,
    isFeatured: true,
    isHotDeal: true,
    isNewArrival: true,
    tags: ['Galaxy AI', 'S-Pen', 'Snapdragon 8 Elite', '200MP'],
    freeDelivery: true
  },
  {
    id: 'macbook-pro-m4',
    name: 'Apple MacBook Pro 14" (M4 Pro)',
    brand: 'Apple',
    category: 'laptops',
    subcategory: 'Professional Ultrabooks',
    description: 'Unprecedented performance and efficiency for creators, developers, and power users. Liquid Retina XDR with 1000 nits sustained brightness, up to 24 hours battery life, and Thunderbolt 5.',
    features: [
      'M4 Pro chip with up to 14-core CPU and 20-core GPU',
      '24GB unified high-speed memory standard',
      'Liquid Retina XDR display with nano-texture option',
      'Advanced 12MP Center Stage camera with Desk View',
      'MagSafe 3, three Thunderbolt 5 ports, HDMI, SDXC slot'
    ],
    specs: {
      'Display': '14.2-inch Liquid Retina XDR, 3024x1964, 120Hz ProMotion',
      'Processor': 'Apple M4 Pro (12-Core CPU, 16-Core GPU, 16-Core Neural Engine)',
      'Memory': '24GB Unified Memory',
      'Storage': '512GB / 1TB Ultra-fast NVMe SSD',
      'Ports': '3x Thunderbolt 5, HDMI, SDXC, MagSafe 3, 3.5mm Headphone',
      'Keyboard': 'Backlit Magic Keyboard with Touch ID (Arabic/English)',
      'Battery': 'Up to 22 hours wireless web'
    },
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80'
    ],
    basePriceUSD: 1980,
    originalPriceUSD: 2099,
    variants: [
      { id: 'mbp-14-m4pro-512-spaceblack', name: '512GB SSD / 24GB RAM - Space Black', storage: '512GB SSD', color: 'Space Black', colorHex: '#2E3033', priceUSD: 1980, inStock: true },
      { id: 'mbp-14-m4pro-512-silver', name: '512GB SSD / 24GB RAM - Silver', storage: '512GB SSD', color: 'Silver', colorHex: '#E2E4E6', priceUSD: 1980, inStock: true },
      { id: 'mbp-14-m4pro-1tb-spaceblack', name: '1TB SSD / 24GB RAM - Space Black', storage: '1TB SSD', color: 'Space Black', colorHex: '#2E3033', priceUSD: 2280, inStock: true }
    ],
    rating: 5.0,
    reviewCount: 39,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Apple Official International Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['Apple Silicon', 'M4 Pro', 'Pro Display', 'Space Black'],
    freeDelivery: true
  },
  {
    id: 'airpods-pro-2-usbc',
    name: 'Apple AirPods Pro 2 (USB-C MagSafe)',
    brand: 'Apple',
    category: 'audio',
    subcategory: 'True Wireless',
    description: 'Up to 2x more Active Noise Cancellation than the previous generation. Adaptive Audio, Transparency mode, Personalized Spatial Audio with dynamic head tracking, and hearing health features.',
    features: [
      'H2 chip with intelligent noise cancellation algorithms',
      'USB-C MagSafe Charging Case with speaker and lanyard loop',
      'Dust, sweat, and water resistant (IP54)',
      'Up to 6 hours listening time with ANC enabled (30 hours total with case)',
      'Precision Finding for charging case with U1 ultra wideband'
    ],
    specs: {
      'Audio Technology': 'Custom high-excursion Apple driver, custom high dynamic range amplifier',
      'Chip': 'Apple H2 headphone chip, Apple U1 chip in MagSafe case',
      'Connectivity': 'Bluetooth 5.3',
      'Charging': 'USB-C, MagSafe, Apple Watch charger, Qi certified',
      'Weight': 'Earbuds: 5.3g each, Case: 50.8g'
    },
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=1000&q=80'
    ],
    basePriceUSD: 235,
    originalPriceUSD: 260,
    variants: [
      { id: 'airpods-pro-2-white', name: 'White - USB-C Case', color: 'White', colorHex: '#FFFFFF', priceUSD: 235, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 142,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Apple Official Agency Warranty',
    inStock: true,
    isFeatured: true,
    isHotDeal: true,
    tags: ['Active Noise Cancellation', 'H2 Chip', 'USB-C', 'Bestseller'],
    freeDelivery: false
  },
  {
    id: 'sony-wh1000xm5',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling',
    brand: 'Sony',
    category: 'audio',
    subcategory: 'Over-Ear Headphones',
    description: 'Industry-leading noise cancellation optimized by two processors and 8 microphones. Magnificent Hi-Res sound with 30mm carbon fiber drivers and ultra-clear hands-free calls.',
    features: [
      'HD Noise Cancelling Processor QN1 + Integrated Processor V1',
      'Up to 30 hours battery life with 3-minute quick charge for 3 hours playback',
      'Multipoint connection to pair with two Bluetooth devices simultaneously',
      'Ultra-comfortable lightweight soft fit leather headband',
      'Speak-to-Chat auto pause and voice pickup with 4 beamforming mics'
    ],
    specs: {
      'Driver Unit': '30mm, Carbon Fiber composite dome',
      'Frequency Response': '4 Hz - 40,000 Hz (Hi-Res Audio)',
      'Battery': '30h (NC ON), 40h (NC OFF)',
      'Weight': '250 grams',
      'Codecs': 'LDAC, AAC, SBC'
    },
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80'
    ],
    basePriceUSD: 330,
    originalPriceUSD: 380,
    variants: [
      { id: 'sony-xm5-black', name: 'Midnight Black', color: 'Black', colorHex: '#1E1E1E', priceUSD: 330, inStock: true },
      { id: 'sony-xm5-silver', name: 'Platinum Silver', color: 'Platinum Silver', colorHex: '#E2DEC9', priceUSD: 330, inStock: true },
      { id: 'sony-xm5-smoky-pink', name: 'Smoky Pink', color: 'Smoky Pink', colorHex: '#D6B4B0', priceUSD: 345, inStock: true }
    ],
    rating: 4.8,
    reviewCount: 51,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Sony Official Warranty',
    inStock: true,
    isFeatured: false,
    tags: ['Hi-Res Audio', 'ANC', 'LDAC', 'Sony'],
    freeDelivery: true
  },
  {
    id: 'apple-watch-ultra-2',
    name: 'Apple Watch Ultra 2 (49mm Titanium)',
    brand: 'Apple',
    category: 'wearables',
    subcategory: 'Adventure & Sport',
    description: 'The ultimate sports and adventure watch. Lightweight titanium case with precision dual-frequency GPS, 3000 nits display, 36 hours normal battery life, and customizable Action Button.',
    features: [
      'S9 SiP with double-tap gesture control and on-device Siri',
      'Brightest Apple display at 3000 nits with Night Mode sensor',
      'Water resistant 100m, certified for recreational scuba diving to 40m',
      'Dual-frequency L1 & L5 GPS for pinpoint accuracy in cities & mountains',
      'Action button for instant workout start, compass waypoint & siren'
    ],
    specs: {
      'Case': '49mm aerospace-grade titanium, sapphire front crystal',
      'Display': 'Always-On Retina OLED, 3000 nits peak',
      'Battery': 'Up to 36 hours (72 hours in low power mode)',
      'Sensors': 'ECG, Blood Oxygen, Depth gauge, Water temperature, Compass',
      'Connectivity': 'Cellular LTE & UMTS, Wi-Fi 4, Bluetooth 5.3'
    },
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80'
    ],
    basePriceUSD: 770,
    originalPriceUSD: 820,
    variants: [
      { id: 'aw-u2-black-ocean', name: 'Black Titanium - Ocean Band (Black)', color: 'Black Titanium', colorHex: '#222222', priceUSD: 790, inStock: true },
      { id: 'aw-u2-natural-alpine', name: 'Natural Titanium - Alpine Loop (Orange)', color: 'Natural Titanium', colorHex: '#9E9E9C', priceUSD: 770, inStock: true },
      { id: 'aw-u2-natural-trail', name: 'Natural Titanium - Trail Loop (Blue/Black)', color: 'Natural Titanium', colorHex: '#9E9E9C', priceUSD: 770, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 47,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Apple Official Agency Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['Titanium', 'GPS', 'Diving 40m', '3000 nits'],
    freeDelivery: true
  },
  {
    id: 'ipad-pro-m4',
    name: 'Apple iPad Pro 11" (M4 Ultra Retina Tandem OLED)',
    brand: 'Apple',
    category: 'tablets',
    subcategory: 'Creative Workstation',
    description: 'Impossibly thin design powered by Apple M4 chip. Ultra Retina XDR with groundbreaking tandem OLED technology, Apple Pencil Pro support, and studio-grade microphones.',
    features: [
      'Ultra Retina XDR display with state-of-the-art Tandem OLED',
      'M4 chip delivers monstrous AI performance with next-gen Neural Engine',
      'Support for Apple Pencil Pro with barrel roll & haptic squeeze',
      'Incredible 5.3mm ultra-thin lightweight aluminum chassis',
      'Landscape 12MP Center Stage front camera'
    ],
    specs: {
      'Display': '11-inch Tandem OLED Ultra Retina XDR, 2420x1668, 120Hz ProMotion',
      'Processor': 'Apple M4 chip (9-core CPU / 10-core GPU / 16-core NPU)',
      'Storage Options': '256GB, 512GB, 1TB, 2TB',
      'Camera': '12MP Wide rear + LiDAR Scanner + 12MP Landscape TrueDepth',
      'Connectivity': 'Wi-Fi 6E, Bluetooth 5.3, Thunderbolt / USB 4'
    },
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80'
    ],
    basePriceUSD: 960,
    originalPriceUSD: 1040,
    variants: [
      { id: 'ipad-m4-11-256-spaceblack', name: '256GB Wi-Fi - Space Black', storage: '256GB', color: 'Space Black', colorHex: '#252628', priceUSD: 960, inStock: true },
      { id: 'ipad-m4-11-256-silver', name: '256GB Wi-Fi - Silver', storage: '256GB', color: 'Silver', colorHex: '#E5E6E8', priceUSD: 960, inStock: true },
      { id: 'ipad-m4-11-512-spaceblack', name: '512GB Wi-Fi - Space Black', storage: '512GB', color: 'Space Black', colorHex: '#252628', priceUSD: 1190, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 31,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Apple Official Agency Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['Tandem OLED', 'M4 Chip', 'Pencil Pro', 'Pro Audio'],
    freeDelivery: true
  },
  {
    id: 'ps5-pro-console',
    name: 'Sony PlayStation 5 Pro Console',
    brand: 'Sony',
    category: 'gaming',
    subcategory: 'Next-Gen Consoles',
    description: 'Play PS5 games with the most impressive visuals ever possible on a PlayStation console. PlayStation Spectral Super Resolution (PSSR), advanced ray tracing, and 60FPS/120FPS smooth fidelity.',
    features: [
      'PlayStation Spectral Super Resolution (PSSR) AI upscaling',
      'Advanced Ray Tracing for realistic reflections and lighting',
      '2TB high-speed solid state drive pre-installed',
      'PS5 Pro Game Boost & Enhanced backward compatibility for 8,500+ PS4 games',
      'DualSense wireless controller with adaptive triggers and haptic feedback'
    ],
    specs: {
      'Storage': '2TB Custom NVMe SSD',
      'GPU': 'Upgraded RDNA Architecture with 67% more compute units',
      'Memory': '16GB GDDR6 + 2GB DDR5 System RAM',
      'Video Output': 'HDMI 2.1, 4K 120Hz, 8K Support, VRR (Variable Refresh Rate)',
      'Wi-Fi': 'Wi-Fi 7 (IEEE 802.11be)'
    },
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80'
    ],
    basePriceUSD: 799,
    originalPriceUSD: 850,
    variants: [
      { id: 'ps5-pro-2tb', name: 'PS5 Pro 2TB Digital Edition', storage: '2TB', color: 'White/Black', colorHex: '#EDEDED', priceUSD: 799, inStock: true },
      { id: 'ps5-pro-2tb-disc-bundle', name: 'PS5 Pro 2TB + Disc Drive + Extra DualSense Bundle', storage: '2TB', color: 'White/Black', colorHex: '#EDEDED', priceUSD: 940, inStock: true }
    ],
    rating: 4.8,
    reviewCount: 58,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Sony Official Agency Warranty',
    inStock: true,
    isFeatured: true,
    isHotDeal: true,
    tags: ['4K 120fps', 'PSSR AI', '2TB SSD', 'Gaming'],
    freeDelivery: true
  },
  {
    id: 'anker-prime-200w-powerbank',
    name: 'Anker Prime 20,000mAh Power Bank (200W Output)',
    brand: 'Anker',
    category: 'power',
    subcategory: 'High-Power GaN Chargers',
    description: 'Charge two high-performance laptops and an iPhone at blistering speeds simultaneously with 200W total output. Smart digital display shows real-time wattage, battery percentage, and temperature.',
    features: [
      'Total 200W output with 2x 100W USB-C fast charging ports',
      'Ultra-compact 20,000mAh capacity (TSA approved for flights)',
      'Smart Digital Display showing real-time power metrics',
      'ActiveShield 2.0 temperature monitoring 3,000,000 times per day',
      '100W rapid recharging - refuel to 100% in just 1 hour 15 minutes'
    ],
    specs: {
      'Capacity': '20,000mAh (72Wh)',
      'USB-C1 / C2 Output': '5V-3A / 9V-3A / 15V-3A / 20V-5A (100W Max each)',
      'USB-A Output': '5V-3A / 9V-2A / 12V-1.5A (22.5W Max)',
      'Dimensions': '126.8 × 54.6 × 49.8 mm',
      'Weight': '540g'
    },
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1000&q=80'
    ],
    basePriceUSD: 115,
    originalPriceUSD: 139,
    variants: [
      { id: 'anker-prime-200w-black', name: '20,000mAh 200W - Space Gray', color: 'Space Gray', colorHex: '#3A3B3C', priceUSD: 115, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 96,
    condition: 'Brand New (Sealed)',
    warranty: '18 Months Anker Official Agency Warranty',
    inStock: true,
    isFeatured: false,
    isHotDeal: true,
    tags: ['200W Total', 'Smart Screen', 'GaNPrime', 'Travel Friendly'],
    freeDelivery: false
  },
  {
    id: 'jbl-boombox-3-wifi',
    name: 'JBL Boombox 3 Wi-Fi & Bluetooth Speaker',
    brand: 'JBL',
    category: 'audio',
    subcategory: 'Portable Party Speakers',
    description: 'Massive sound and deepest bass anywhere you go. HD audio streaming via Wi-Fi with Dolby Atmos 3D audio, 24 hours of non-stop playtime, and IP67 waterproof and dustproof design.',
    features: [
      'Massive 180W RMS audio power with subwoofer and dual tweeters',
      'Dolby Atmos 3D spatial sound support over Wi-Fi',
      '24 Hours battery playback + built-in powerbank to charge phones',
      'Eco-friendly design incorporating recycled fabrics and plastic',
      'AirPlay, Alexa Multi-Room Music, Chromecast built-in and Spotify Connect'
    ],
    specs: {
      'Output Power': '1x 80W RMS Subwoofer + 2x 40W RMS Mid + 2x 10W Tweeters',
      'Frequency Response': '40 Hz - 20 kHz',
      'Battery': '10,000mAh Li-ion battery (24 hours playback)',
      'Waterproof': 'IP67 waterproof and dustproof',
      'Weight': '6.7 kg'
    },
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80'
    ],
    basePriceUSD: 440,
    originalPriceUSD: 499,
    variants: [
      { id: 'jbl-bb3-black', name: 'Black', color: 'Black', colorHex: '#181818', priceUSD: 440, inStock: true },
      { id: 'jbl-bb3-squad', name: 'Squad Camouflage', color: 'Camouflage', colorHex: '#5A6B4E', priceUSD: 460, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 42,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year JBL Official Agency Warranty',
    inStock: true,
    isFeatured: false,
    tags: ['Dolby Atmos', 'Wi-Fi & Bluetooth', '180W', 'IP67 Waterproof'],
    freeDelivery: true
  },
  {
    id: 'xiaomi-14-ultra',
    name: 'Xiaomi 14 Ultra (Leica Quad Camera)',
    brand: 'Xiaomi',
    category: 'smartphones',
    subcategory: 'Flagship Phones',
    description: 'Co-engineered with Leica. 1-inch Sony LYT-900 sensor with stepless variable aperture f/1.63-f/4.0, Snapdragon 8 Gen 3, Quad-Curved WQHD+ AMOLED, and 90W HyperCharge.',
    features: [
      'Leica Summilux Quad Camera with 1-inch flagship image sensor',
      'Stepless variable physical aperture (f/1.63 - f/4.0)',
      'All Around Liquid Display with 3000 nits peak brightness',
      'Xiaomi Dual-Channel IceLoop cooling system',
      '90W wired HyperCharge + 80W wireless HyperCharge'
    ],
    specs: {
      'Display': '6.73-inch LTPO AMOLED, WQHD+ (3200x1440), 1-120Hz, Dolby Vision',
      'Processor': 'Qualcomm Snapdragon 8 Gen 3 (4nm)',
      'Rear Camera': '50MP 1-inch Main + 50MP 3.2x Tele + 50MP 5x Periscope + 50MP Ultra-Wide',
      'Battery': '5,000 mAh, 90W Wired (100% in 33m), 80W Wireless',
      'Build': 'High-strength aluminum frame, nano-tech vegan leather back'
    },
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80'
    ],
    basePriceUSD: 1050,
    originalPriceUSD: 1150,
    variants: [
      { id: 'mi14u-512-black', name: '512GB / 16GB RAM - Black Vegan Leather', storage: '512GB', color: 'Black Leather', colorHex: '#262626', priceUSD: 1050, inStock: true },
      { id: 'mi14u-512-white', name: '512GB / 16GB RAM - White Vegan Leather', storage: '512GB', color: 'White Leather', colorHex: '#F2F2F2', priceUSD: 1050, inStock: true }
    ],
    rating: 4.8,
    reviewCount: 36,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Official Xiaomi Lebanon Warranty',
    inStock: true,
    isFeatured: false,
    tags: ['Leica Optics', '1-inch Sensor', '90W HyperCharge', 'Snapdragon 8 Gen 3'],
    freeDelivery: true
  },
  {
    id: 'dji-mini-4-pro',
    name: 'DJI Mini 4 Pro Drone (Fly More Combo Plus + RC 2)',
    brand: 'DJI',
    category: 'smart-home',
    subcategory: 'Aerial Tech & Drones',
    description: 'Under 249g lightweight drone with omnidirectional obstacle sensing, 4K/60fps HDR true vertical shooting, FHD 20km video transmission, and up to 45 minutes extended flight time.',
    features: [
      'Sub-249g ultra-lightweight and foldable for effortless travel',
      'Omnidirectional Active Obstacle Sensing in all directions',
      '4K/60fps HDR True Vertical Shooting for social media',
      'DJI O4 video transmission up to 20km FHD range',
      'Includes DJI RC 2 smart controller with integrated ultra-bright screen'
    ],
    specs: {
      'Weight': '< 249 g',
      'Max Flight Time': 'Up to 34 min (Standard Battery) / 45 min (Plus Battery)',
      'Camera Sensor': '1/1.3-inch CMOS, f/1.7, Dual Native ISO Fusion',
      'Video Resolution': '4K/60fps HDR, 4K/100fps Slow-Mo, D-Log M 10-bit',
      'Transmission': 'DJI O4, 1080p/60fps live view up to 20km'
    },
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=80'
    ],
    basePriceUSD: 1090,
    originalPriceUSD: 1199,
    variants: [
      { id: 'dji-m4p-fmc-rc2', name: 'Fly More Combo Plus (3 Batteries + RC 2 Controller)', storage: '64GB Internal + SD Slot', color: 'DJI Gray', colorHex: '#B0B5BA', priceUSD: 1090, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 29,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year DJI Official Agency Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['4K HDR', 'Omnidirectional Sensing', 'Sub 249g', 'DJI RC 2'],
    freeDelivery: true
  },
  {
    id: 'marshall-emberton-3',
    name: 'Marshall Emberton III Portable Bluetooth Speaker',
    brand: 'Marshall',
    category: 'audio',
    subcategory: 'Portable Speakers',
    description: 'Iconic Marshall rock-and-roll styling with True Stereophonic 360 sound, 32+ hours of portable playtime, IP67 dust and water resistance, and built-in microphone for speakerphone calls.',
    features: [
      'True Stereophonic multi-directional 360-degree sound',
      '32+ hours of wireless playtime on a single charge',
      'Rugged roadworthy IP67 dustproof and waterproof build',
      'Bluetooth 5.3 LE Audio-ready with Auracast support',
      'Signature vintage Marshall brass multi-directional control knob'
    ],
    specs: {
      'Amplifiers': 'Two 38W Class D amplifiers',
      'Drivers': 'Two 2-inch 10W full range drivers + two passive radiators',
      'Max Sound Pressure': '90 dB SPL @ 1 m',
      'Battery': '32+ hours playtime, 20-min quick charge for 6 hours',
      'Weight': '0.67 kg'
    },
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80'
    ],
    basePriceUSD: 175,
    originalPriceUSD: 199,
    variants: [
      { id: 'marshall-emb3-black-brass', name: 'Black & Brass', color: 'Black & Brass', colorHex: '#1A1A1A', priceUSD: 175, inStock: true },
      { id: 'marshall-emb3-cream', name: 'Cream', color: 'Cream Vintage', colorHex: '#EAE5D9', priceUSD: 185, inStock: true }
    ],
    rating: 4.8,
    reviewCount: 38,
    condition: 'Brand New (Sealed)',
    warranty: '1 Year Marshall Official Warranty',
    inStock: true,
    isFeatured: false,
    tags: ['True Stereophonic', '32h Playtime', 'IP67', 'Vintage Style'],
    freeDelivery: false
  },
  {
    id: 'asus-rog-zephyrus-g16',
    name: 'ASUS ROG Zephyrus G16 (OLED Gaming Laptop)',
    brand: 'ASUS',
    category: 'laptops',
    subcategory: 'Gaming & Workstation',
    description: 'Precision CNC-milled aluminum chassis with Slash Lighting. Powered by Intel Core Ultra 9 processor, NVIDIA GeForce RTX 4080 GPU, and ROG Nebula 2.5K 240Hz OLED display.',
    features: [
      'Intel Core Ultra 9 185H with integrated AI NPU accelerator',
      'NVIDIA GeForce RTX 4080 Laptop GPU with 12GB GDDR6',
      'ROG Nebula 16" 2.5K 240Hz 0.2ms OLED display with G-Sync',
      'ROG Intelligent Cooling with tri-fan technology and liquid metal',
      'Ultra-thin 1.49cm aluminum unibody weighing only 1.85 kg'
    ],
    specs: {
      'Display': '16.0-inch 2.5K (2560 x 1600) OLED, 240Hz, 0.2ms, 100% DCI-P3, 500 nits',
      'Processor': 'Intel Core Ultra 9 185H (16 Cores, up to 5.1 GHz)',
      'Graphics': 'NVIDIA GeForce RTX 4080 12GB (115W TGP with Dynamic Boost)',
      'Memory': '32GB LPDDR5X 7467 MHz Dual-Channel',
      'Storage': '1TB PCIe 4.0 NVMe M.2 SSD + free expansion slot',
      'Battery': '90WHrs 4-cell Li-ion with 240W AC Adapter + 100W Type-C support'
    },
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80'
    ],
    basePriceUSD: 2450,
    originalPriceUSD: 2690,
    variants: [
      { id: 'rog-g16-eclipse-gray', name: '32GB RAM / 1TB SSD / RTX 4080 - Eclipse Gray', storage: '1TB SSD', color: 'Eclipse Gray', colorHex: '#424347', priceUSD: 2450, inStock: true },
      { id: 'rog-g16-platinum-white', name: '32GB RAM / 2TB SSD / RTX 4080 - Platinum White', storage: '2TB SSD', color: 'Platinum White', colorHex: '#F0F2F5', priceUSD: 2650, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 22,
    condition: 'Brand New (Sealed)',
    warranty: '2 Years ASUS Official Global Warranty',
    inStock: true,
    isFeatured: true,
    tags: ['RTX 4080', '240Hz OLED', 'Core Ultra 9', 'Slash Lighting'],
    freeDelivery: true
  }
];

export const PRODUCTS: Product[] = INITIAL_PRODUCTS.map((p) => {
  const images = p.galleryImages && p.galleryImages.length > 0 ? p.galleryImages : [p.image];
  return {
    ...p,
    imageUrls: p.imageUrls || images,
    image_urls: p.image_urls || images,
  };
});
