import { Product, ProductVariant } from '../types';

/**
 * Standard brand code map for clean, standardized SKU prefixes
 */
const BRAND_CODE_MAP: Record<string, string> = {
  apple: 'APL',
  samsung: 'SAM',
  sony: 'SNY',
  xiaomi: 'XMI',
  anker: 'ANK',
  jbl: 'JBL',
  asus: 'ASUS',
  hyperx: 'HPX',
  razer: 'RZR',
  logitech: 'LOG',
  dell: 'DELL',
  lenovo: 'LNV',
  huawei: 'HWA',
  tecno: 'TCN',
  infinix: 'INFX',
  ugreen: 'UGR',
  braun: 'BRN',
  pitaka: 'PTK',
  deepcool: 'DCL',
  acefast: 'ACF',
  yesido: 'YSD',
  wiwu: 'WIWU',
  whoop: 'WHP',
  marshall: 'MSH',
  dji: 'DJI',
  google: 'GGL',
  honor: 'HNR',
  nintendo: 'NTD',
  bose: 'BSE',
  gopro: 'GPR',
  sandisk: 'SND',
  hoco: 'HOCO',
  'green lion': 'GRL',
  porodo: 'PRD',
};

/**
 * Curated concise model abbreviations for flagship store devices
 */
const CURATED_MODEL_SKUS: Record<string, string> = {
  'iphone-16-pro-max': 'OAS-APL-IP16PM',
  'iphone-16-pro': 'OAS-APL-IP16P',
  'iphone-16': 'OAS-APL-IP16',
  'galaxy-s25-ultra': 'OAS-SAM-S25U',
  'galaxy-z-fold-6': 'OAS-SAM-ZFOLD6',
  'xiaomi-14-ultra': 'OAS-XMI-14U',
  'google-pixel-9-pro-xl': 'OAS-GGL-P9PXL',
  'macbook-pro-m4-16': 'OAS-APL-MBP16-M4',
  'macbook-air-m3-15': 'OAS-APL-MBA15-M3',
  'asus-rog-zephyrus-g16': 'OAS-ASUS-ROG-G16',
  'ipad-pro-m4-13': 'OAS-APL-IPAD-M4-13',
  'samsung-galaxy-tab-s9-ultra': 'OAS-SAM-TABS9U',
  'airpods-pro-2-usbc': 'OAS-APL-APP2-USBC',
  'airpods-max-usbc': 'OAS-APL-APMAX-USBC',
  'sony-wh1000xm5': 'OAS-SNY-WH1000XM5',
  'jbl-boombox-3-wifi': 'OAS-JBL-BB3-WIFI',
  'marshall-emberton-3': 'OAS-MSH-EMB3',
  'apple-watch-ultra-2': 'OAS-APL-AW-ULTRA2',
  'samsung-galaxy-watch-ultra': 'OAS-SAM-GW-ULTRA',
  'ps5-pro-console': 'OAS-SNY-PS5-PRO',
  'logitech-g923-racing-wheel': 'OAS-LOG-G923',
  'anker-prime-200w-powerbank': 'OAS-ANK-PRIME200',
  'dji-mini-4-pro': 'OAS-DJI-MINI4PRO',
  'dji-osmo-pocket-3-creator': 'OAS-DJI-POCKET3-CR',
  'samsung-t9-2tb-ssd': 'OAS-SAM-T9-2TB',
  'ugreen-nexode-300w-gan': 'OAS-UGR-NEX300W',
  'nintendo-switch-oled': 'OAS-NTD-SW-OLED',
  'pitaka-magez-car-mount-pro-2': 'OAS-PTK-MAGEZ-PRO2',
  'whoop-4-fitness-band': 'OAS-WHP-BAND4',
  'razer-viper-v3-pro': 'OAS-RZR-VIPER-V3P',
  'apple-watch-series-10': 'OAS-APL-AW-S10',
  'samsung-galaxy-s24-ultra': 'OAS-SAM-S24U',
  'samsung-galaxy-s24-plus': 'OAS-SAM-S24P',
  'samsung-galaxy-z-flip-6': 'OAS-SAM-ZFLIP6',
  'xiaomi-13t-pro': 'OAS-XMI-13TP',
  'apple-macbook-pro-14-m4': 'OAS-APL-MBP14-M4',
  'apple-macbook-air-13-m3': 'OAS-APL-MBA13-M3',
  'lenovo-legion-pro-7i': 'OAS-LNV-LEGION7I',
  'dell-xps-15-oled': 'OAS-DELL-XPS15',
  'ipad-pro-m4-11': 'OAS-APL-IPAD-M4-11',
  'ipad-air-13-m2': 'OAS-APL-IPAD-AIR13-M2',
  'ipad-10th-gen': 'OAS-APL-IPAD-10GEN',
  'xiaomi-pad-6': 'OAS-XMI-PAD6',
  'sony-wf1000xm5': 'OAS-SNY-WF1000XM5',
  'jbl-partybox-stage-320': 'OAS-JBL-PB-STAGE320',
  'marshall-stanmore-3': 'OAS-MSH-STANMORE3',
  'bose-quietcomfort-ultra': 'OAS-BSE-QC-ULTRA',
  'samsung-galaxy-watch-7': 'OAS-SAM-GW-7',
  'ps5-slim-digital': 'OAS-SNY-PS5-SLIM-DIG',
  'playstation-portal': 'OAS-SNY-PS-PORTAL',
  'anker-737-powerbank': 'OAS-ANK-737-PB',
  'apple-35w-dual-usbc': 'OAS-APL-35W-DUAL',
  'gopro-hero-13-black': 'OAS-GPR-HERO13-BLK',
  'anker-maggo-car-mount': 'OAS-ANK-MAGGO-CAR',
  'sandisk-extreme-pro-1tb-microsd': 'OAS-SND-EXTPRO-1TB',
  'ugreen-thunderbolt-4-cable': 'OAS-UGR-TB4-CABLE',
  'green-lion-magsafe-powerbank': 'OAS-GRL-MAGSAFE-PB',
};

/**
 * Returns a 3-4 character brand abbreviation for SKU generation
 */
export function getBrandSkuCode(brand?: string): string {
  if (!brand) return 'GEN';
  const clean = brand.trim().toLowerCase();
  if (BRAND_CODE_MAP[clean]) {
    return BRAND_CODE_MAP[clean];
  }
  const stripped = clean.replace(/[^a-z0-9]/g, '');
  return stripped.slice(0, 4).toUpperCase() || 'GEN';
}

/**
 * Normalizes a product id or name into a concise model SKU code
 */
export function getModelSkuCode(id?: string, name?: string): string {
  const source = (id || name || 'PRD').toUpperCase();

  const cleaned = source
    .replace(/APPLE[-_ ]?/gi, '')
    .replace(/SAMSUNG[-_ ]?/gi, '')
    .replace(/SONY[-_ ]?/gi, '')
    .replace(/XIAOMI[-_ ]?/gi, '')
    .replace(/LOGITECH[-_ ]?/gi, '')
    .replace(/ANKER[-_ ]?/gi, '')
    .replace(/[^A-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return cleaned.slice(0, 16) || 'MODEL';
}

/**
 * Generates a consistent, unique SKU for any product.
 * Checks curated list first, then generates standard OAS-[BRAND]-[MODEL] format.
 */
export function generateProductSku(
  product: {
    id?: string;
    name?: string;
    brand?: string;
    category?: string;
    sku?: string;
  }
): string {
  if (product.sku && product.sku.trim().length > 0) {
    return product.sku.trim().toUpperCase();
  }

  const cleanId = (product.id || '').trim().toLowerCase();
  if (cleanId && CURATED_MODEL_SKUS[cleanId]) {
    return CURATED_MODEL_SKUS[cleanId];
  }

  const brandCode = getBrandSkuCode(product.brand);
  const modelCode = getModelSkuCode(product.id, product.name);

  return `OAS-${brandCode}-${modelCode}`;
}

/**
 * Returns the effective SKU for a product, optionally specific to a variant.
 * Fallbacks to deterministic unique SKU generation.
 */
export function getProductSku(
  product?: Partial<Product> | null,
  variant?: Partial<ProductVariant> | null
): string {
  if (!product) return 'OAS-GEN-ITEM';

  // 1. If variant has an explicit SKU
  if (variant?.sku && variant.sku.trim().length > 0) {
    return variant.sku.trim().toUpperCase();
  }

  // 2. Base product SKU
  const baseSku = product.sku && product.sku.trim().length > 0
    ? product.sku.trim().toUpperCase()
    : generateProductSku(product);

  // 3. If variant has distinct storage or color info, append variant specifier
  if (variant?.storage || variant?.color) {
    const parts: string[] = [];
    if (variant.storage) {
      parts.push(variant.storage.replace(/[^A-Za-z0-9]/g, '').toUpperCase());
    }
    if (variant.color) {
      const colorCode = variant.color
        .split(/[\s-]+/)
        .map((w) => w[0])
        .join('')
        .slice(0, 3)
        .toUpperCase();
      if (colorCode) parts.push(colorCode);
    }
    if (parts.length > 0) {
      return `${baseSku}-${parts.join('-')}`;
    }
  }

  return baseSku;
}
