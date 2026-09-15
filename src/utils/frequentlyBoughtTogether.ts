import { Product } from '../types';

export interface FrequentlyBoughtBundle {
  primaryProduct: Product;
  accessories: Product[];
  categoryTitle: string;
  bundleSubtitle: string;
  discountRate: number; // e.g. 0.08 for 8% bundle discount
  bundleBadge: string;
}

/**
 * Dynamically selects matching accessories for a product based on its category,
 * subcategory, brand, and device specifications.
 * Specializes in essential accessories like protective cases, GaN fast chargers,
 * braided high-speed cables, and audio/memory companions.
 */
export function getFrequentlyBoughtTogether(
  currentProduct: Product,
  catalog: Product[]
): FrequentlyBoughtBundle {
  if (!currentProduct || !catalog || catalog.length === 0) {
    return {
      primaryProduct: currentProduct,
      accessories: [],
      categoryTitle: 'Frequently Bought Together',
      bundleSubtitle: 'Complete your setup with compatible accessories',
      discountRate: 0.08,
      bundleBadge: 'Bundle Deal',
    };
  }

  // Available candidate accessories (exclude the current product and out of stock items)
  const available = catalog.filter(
    (p) => p.id !== currentProduct.id && p.inStock !== false
  );

  const byId = (id: string) => available.find((p) => p.id === id);
  const byCategory = (cat: string) => available.filter((p) => p.category === cat);
  const byKeyword = (kw: string) =>
    available.filter(
      (p) =>
        p.name.toLowerCase().includes(kw.toLowerCase()) ||
        p.description?.toLowerCase().includes(kw.toLowerCase()) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(kw.toLowerCase())))
    );

  const cat = (currentProduct.category || '').toLowerCase();
  const brand = (currentProduct.brand || '').toLowerCase();
  const name = (currentProduct.name || '').toLowerCase();

  const matchedAccessories: Product[] = [];
  let categoryTitle = 'Frequently Bought Together';
  let bundleSubtitle = 'Recommended accessories frequently paired by our customers';
  let bundleBadge = 'Bundle Deal';

  // 1. SMARTPHONES CATEGORY
  if (cat === 'smartphones') {
    if (brand.includes('apple') || name.includes('iphone')) {
      categoryTitle = 'iPhone Pro Protection & Power Bundle';
      bundleSubtitle = 'Ultra-slim Aramid Fiber case, dual fast charger & MagSafe powerbank';
      bundleBadge = 'MagSafe Essentials';

      // 1. Case
      const caseItem = byId('pitaka-magez-case-5') || byKeyword('iphone 16')[0] || byCategory('bags-cases')[0];
      if (caseItem) matchedAccessories.push(caseItem);

      // 2. Charger
      const chargerItem = byId('apple-35w-dual-usbc') || byId('anker-3in1-cube-magsafe') || byCategory('power')[0];
      if (chargerItem) matchedAccessories.push(chargerItem);

      // 3. Powerbank / Audio / Cable
      const companionItem =
        byId('green-lion-magsafe-powerbank') ||
        byId('airpods-pro-2-usbc') ||
        byId('ugreen-thunderbolt-4-cable') ||
        byId('pitaka-magez-car-mount-pro-2');
      if (companionItem) matchedAccessories.push(companionItem);
    } else if (brand.includes('samsung') || name.includes('galaxy')) {
      categoryTitle = 'Galaxy Ultra Armor & Super Fast Charging Duo';
      bundleSubtitle = 'Crystal clear shockproof case, 300W GaN desktop charger & 100W cable';
      bundleBadge = 'Galaxy Power Pack';

      // 1. Case
      const caseItem = byId('spigen-ultra-hybrid-s25u') || byKeyword('galaxy')[0] || byCategory('bags-cases')[0];
      if (caseItem) matchedAccessories.push(caseItem);

      // 2. Charger
      const chargerItem = byId('ugreen-nexode-300w-gan') || byId('anker-prime-200w-powerbank') || byCategory('power')[0];
      if (chargerItem) matchedAccessories.push(chargerItem);

      // 3. Cable / Mount
      const companionItem =
        byId('ugreen-thunderbolt-4-cable') ||
        byId('pitaka-magez-car-mount-pro-2') ||
        byId('sony-wf1000xm5');
      if (companionItem) matchedAccessories.push(companionItem);
    } else {
      categoryTitle = 'Smartphone Armor & GaN Fast Power Pack';
      bundleSubtitle = 'Protective hybrid case, high-output charger & braided fast cable';
      bundleBadge = 'Phone Essentials';

      const caseItem = byCategory('bags-cases')[0] || byId('spigen-ultra-hybrid-s25u');
      const chargerItem = byId('anker-prime-200w-powerbank') || byCategory('power')[0];
      const cableItem = byId('ugreen-thunderbolt-4-cable') || byCategory('cables')[0];

      if (caseItem) matchedAccessories.push(caseItem);
      if (chargerItem) matchedAccessories.push(chargerItem);
      if (cableItem) matchedAccessories.push(cableItem);
    }
  }

  // 2. LAPTOPS CATEGORY
  else if (cat === 'laptops') {
    categoryTitle = 'MacBook & Laptop Pro Workstation Kit';
    bundleSubtitle = 'Military-grade 360° sleeve, 300W GaN charging hub & rugged 2TB SSD';
    bundleBadge = 'Workstation Bundle';

    // 1. Laptop Sleeve
    const sleeve = byId('tomtoc-defender-laptop-sleeve') || byCategory('bags-cases')[0];
    if (sleeve) matchedAccessories.push(sleeve);

    // 2. High-power GaN Charger
    const charger = byId('ugreen-nexode-300w-gan') || byId('anker-737-powerbank') || byCategory('power')[0];
    if (charger) matchedAccessories.push(charger);

    // 3. Thunderbolt Cable or Portable SSD
    const accessory = byId('samsung-t9-2tb-ssd') || byId('ugreen-thunderbolt-4-cable');
    if (accessory) matchedAccessories.push(accessory);
  }

  // 3. TABLETS & IPADS CATEGORY
  else if (cat === 'tablets') {
    categoryTitle = 'iPad Pro Creative Studio Bundle';
    bundleSubtitle = 'Apple Pencil Pro with haptics, magnetic smart folio & 35W dual charger';
    bundleBadge = 'Creative Duo';

    // 1. Folio Case
    const folio = byId('apple-smart-folio-ipad') || byCategory('bags-cases')[0];
    if (folio) matchedAccessories.push(folio);

    // 2. Stylus
    const pencil = byId('apple-pencil-pro') || byKeyword('pencil')[0];
    if (pencil) matchedAccessories.push(pencil);

    // 3. Fast Dual Charger
    const charger = byId('apple-35w-dual-usbc') || byId('anker-3in1-cube-magsafe') || byCategory('power')[0];
    if (charger) matchedAccessories.push(charger);
  }

  // 4. GAMING & CONSOLES
  else if (cat === 'gaming') {
    categoryTitle = 'PlayStation Pro Ultimate Gaming Setup';
    bundleSubtitle = 'DualSense fast charging station, ANC gaming audio & high-speed storage';
    bundleBadge = 'Pro Gaming Pack';

    // 1. Controller Charging Dock
    const dock = byId('ps5-dualsense-charging-station') || byKeyword('dualsense')[0];
    if (dock) matchedAccessories.push(dock);

    // 2. High-End Audio / Headset
    const headset = byId('sony-wh1000xm5') || byId('bose-quietcomfort-ultra') || byCategory('audio')[0];
    if (headset) matchedAccessories.push(headset);

    // 3. Expansion Storage / Cable
    const storage = byId('samsung-t9-2tb-ssd') || byId('ugreen-thunderbolt-4-cable');
    if (storage) matchedAccessories.push(storage);
  }

  // 5. WEARABLES & SMARTWATCHES
  else if (cat === 'wearables') {
    categoryTitle = 'Smartwatch All-Day Power & Wireless Audio';
    bundleSubtitle = 'Official MagSafe 3-in-1 fast charger cube & AirPods Pro wireless audio';
    bundleBadge = 'Watch Companion';

    // 1. 3-in-1 Wireless Hub
    const cube = byId('anker-3in1-cube-magsafe') || byId('apple-35w-dual-usbc');
    if (cube) matchedAccessories.push(cube);

    // 2. Earbuds
    const earbuds = byId('airpods-pro-2-usbc') || byId('sony-wf1000xm5') || byCategory('audio')[0];
    if (earbuds) matchedAccessories.push(earbuds);

    // 3. MagSafe Powerbank
    const pb = byId('green-lion-magsafe-powerbank') || byCategory('power')[0];
    if (pb) matchedAccessories.push(pb);
  }

  // 6. AUDIO & SPEAKERS
  else if (cat === 'audio') {
    categoryTitle = 'Hi-Fi Audio Power & Travel Setup';
    bundleSubtitle = 'Compact 35W fast dual charger, braided USB-C cable & MagSafe car mount';
    bundleBadge = 'Audio Travel Kit';

    // 1. Fast Charger
    const charger = byId('apple-35w-dual-usbc') || byCategory('power')[0];
    if (charger) matchedAccessories.push(charger);

    // 2. Braided Cable
    const cable = byId('ugreen-thunderbolt-4-cable') || byCategory('cables')[0];
    if (cable) matchedAccessories.push(cable);

    // 3. Car Mount or Powerbank
    const mount = byId('pitaka-magez-car-mount-pro-2') || byId('green-lion-magsafe-powerbank');
    if (mount) matchedAccessories.push(mount);
  }

  // 7. RACING WHEEL
  else if (cat === 'racing-wheel') {
    categoryTitle = 'Sim Racing Immersion Bundle';
    bundleSubtitle = 'DualSense fast charging station, ANC headphones & high-speed data cable';
    bundleBadge = 'Sim Rig Addon';

    const dock = byId('ps5-dualsense-charging-station');
    const audio = byId('sony-wh1000xm5');
    const storage = byId('samsung-t9-2tb-ssd');

    if (dock) matchedAccessories.push(dock);
    if (audio) matchedAccessories.push(audio);
    if (storage) matchedAccessories.push(storage);
  }

  // 8. CAMERAS, DRONES & SMART HOME
  else if (cat === 'cameras-projectors' || cat === 'smart-home') {
    categoryTitle = 'Aerial 4K Recording & High-Capacity GaN Pack';
    bundleSubtitle = 'SanDisk Extreme PRO 1TB 4K card, 200W GaN power bank & high-speed cable';
    bundleBadge = 'Content Creator Pack';

    // 1. MicroSD card
    const sd = byId('sandisk-extreme-pro-1tb-microsd') || byCategory('flash-card-memory')[0];
    if (sd) matchedAccessories.push(sd);

    // 2. Heavy-duty powerbank
    const pb = byId('anker-prime-200w-powerbank') || byCategory('power')[0];
    if (pb) matchedAccessories.push(pb);

    // 3. Fast Cable
    const cable = byId('ugreen-thunderbolt-4-cable') || byCategory('cables')[0];
    if (cable) matchedAccessories.push(cable);
  }

  // 9. POWER & CHARGERS CATEGORY
  else if (cat === 'power') {
    categoryTitle = 'High-Speed Power & High-Capacity Storage';
    bundleSubtitle = 'Braided 100W/40Gbps Thunderbolt cable & rugged 2TB shield SSD';
    bundleBadge = 'Fast Charge Kit';

    const cable = byId('ugreen-thunderbolt-4-cable') || byCategory('cables')[0];
    const ssd = byId('samsung-t9-2tb-ssd') || byCategory('flash-card-memory')[0];
    const mount = byId('pitaka-magez-car-mount-pro-2') || byCategory('car-accessories')[0];

    if (cable) matchedAccessories.push(cable);
    if (ssd) matchedAccessories.push(ssd);
    if (mount) matchedAccessories.push(mount);
  }

  // 10. BAGS & CASES CATEGORY
  else if (cat === 'bags-cases') {
    categoryTitle = 'Protection & Fast Charging Pairing';
    bundleSubtitle = 'Apple 35W dual power adapter & high-speed braided USB-C cable';
    bundleBadge = 'Accessory Duo';

    const charger = byId('apple-35w-dual-usbc') || byCategory('power')[0];
    const cable = byId('ugreen-thunderbolt-4-cable') || byCategory('cables')[0];
    const earbuds = byId('airpods-pro-2-usbc') || byCategory('audio')[0];

    if (charger) matchedAccessories.push(charger);
    if (cable) matchedAccessories.push(cable);
    if (earbuds) matchedAccessories.push(earbuds);
  }

  // GENERIC CATEGORY FALLBACK
  else {
    categoryTitle = 'Frequently Bought Together';
    bundleSubtitle = 'High-demand companion accessories verified for this product';
    bundleBadge = 'Bundle Deal';

    const power = byCategory('power')[0] || byId('apple-35w-dual-usbc');
    const caseOrCable = byCategory('bags-cases')[0] || byCategory('cables')[0] || byId('ugreen-thunderbolt-4-cable');
    const audioOrSsd = byCategory('audio')[0] || byCategory('flash-card-memory')[0];

    if (power) matchedAccessories.push(power);
    if (caseOrCable) matchedAccessories.push(caseOrCable);
    if (audioOrSsd) matchedAccessories.push(audioOrSsd);
  }

  // Deduplicate and filter out any accidental reference to current product
  const finalAccessories: Product[] = [];
  const seenIds = new Set<string>([currentProduct.id]);

  for (const acc of matchedAccessories) {
    if (acc && !seenIds.has(acc.id) && acc.inStock !== false) {
      seenIds.add(acc.id);
      finalAccessories.push(acc);
    }
  }

  // If fewer than 2 accessories, dynamically backfill with verified universal accessories
  if (finalAccessories.length < 2) {
    const universalFallbacks = [
      byId('apple-35w-dual-usbc'),
      byId('ugreen-thunderbolt-4-cable'),
      byId('pitaka-magez-case-5'),
      byId('spigen-ultra-hybrid-s25u'),
      byId('anker-prime-200w-powerbank'),
      byId('green-lion-magsafe-powerbank'),
      byId('airpods-pro-2-usbc'),
    ];

    for (const fb of universalFallbacks) {
      if (fb && !seenIds.has(fb.id) && fb.inStock !== false) {
        seenIds.add(fb.id);
        finalAccessories.push(fb);
        if (finalAccessories.length >= 3) break;
      }
    }
  }

  return {
    primaryProduct: currentProduct,
    accessories: finalAccessories.slice(0, 3),
    categoryTitle,
    bundleSubtitle,
    discountRate: 0.08, // 8% bundle savings
    bundleBadge,
  };
}

/**
 * Prepares a formatted WhatsApp message for direct ordering of the entire bundle
 */
export function buildBundleWhatsAppMessage(
  primaryProduct: Product,
  primaryVariantName: string,
  primaryPriceUSD: number,
  selectedAccessories: Product[],
  currencyCode: string,
  formattedBundleTotal: string
): string {
  const accessoriesList = selectedAccessories
    .map((acc, i) => `  ${i + 1}. ${acc.name} ($${acc.basePriceUSD})`)
    .join('\n');

  return `Hello On Alaa Store! 🇱🇧\nI would like to order this Frequently Bought Together bundle:\n\n📱 Main Device:\n• ${primaryProduct.name}\n• Selected Variant: ${primaryVariantName}\n• Price: $${primaryPriceUSD}\n\n⚡ Included Accessories:\n${accessoriesList}\n\n🏷️ Bundle Total (${currencyCode}): ${formattedBundleTotal}\n\nPlease confirm availability and delivery to my address. Thank you!`;
}
