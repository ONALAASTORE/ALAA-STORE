import { CartItem } from '../types';
import { DEFAULT_USD_TO_LBP_RATE } from './currency';
import { buildWhatsAppLink } from './phone';

export interface WhatsAppCartSummaryOptions {
  items: CartItem[];
  orderRef?: string;
  customer?: {
    fullName?: string;
    phone?: string;
    deliveryType?: 'delivery' | 'pickup';
    region?: string;
    address?: string;
    paymentMethod?: 'cod_usd' | 'cod_lbp' | 'whish' | 'omt' | 'usdt' | string;
    notes?: string;
  };
  deliveryFeeUSD?: number;
  rate?: number;
  storeName?: string;
}

/**
 * Maps payment method codes to customer-friendly labels with currency details.
 */
export function getPaymentMethodLabel(method?: string): string {
  switch (method) {
    case 'cod_usd':
      return '💵 Cash on Delivery (USD)';
    case 'cod_lbp':
      return '💵 Cash on Delivery (L.L. / Lebanese Pounds)';
    case 'whish':
      return '📱 Whish Money Digital Transfer';
    case 'omt':
      return '🏢 OMT Intra-Lebanon Transfer';
    case 'usdt':
      return '🪙 USDT Crypto (TRC20 / BEP20)';
    default:
      return method || '💵 Cash on Delivery (USD)';
  }
}

/**
 * Builds a beautifully formatted text block representing the user's cart summary
 * for transmission through WhatsApp message URLs.
 */
export function formatWhatsAppCartSummary(options: WhatsAppCartSummaryOptions): string {
  const {
    items,
    orderRef,
    customer,
    deliveryFeeUSD,
    rate = DEFAULT_USD_TO_LBP_RATE,
    storeName = 'ON ALAA STORE',
  } = options;

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalUSD = items.reduce(
    (sum, item) => sum + item.selectedVariant.priceUSD * item.quantity,
    0
  );

  const calculatedDeliveryUSD =
    typeof deliveryFeeUSD === 'number'
      ? deliveryFeeUSD
      : customer?.deliveryType === 'pickup'
      ? 0
      : subtotalUSD >= 150
      ? 0
      : 3;

  const grandTotalUSD = subtotalUSD + calculatedDeliveryUSD;
  const subtotalLBP = Math.round(subtotalUSD * rate);
  const grandTotalLBP = Math.round(grandTotalUSD * rate);

  const divider = '━━━━━━━━━━━━━━━━━━━━━━━━━━';
  const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

  const lines: string[] = [];

  // Header
  if (orderRef) {
    lines.push(`🇱🇧 *${storeName} — ORDER CONFIRMATION*`);
    lines.push(`🔖 *Order Reference:* #${orderRef}`);
  } else {
    lines.push(`🇱🇧 *${storeName} — CART ORDER INQUIRY*`);
    lines.push(`⚡ Fast Dispatch Across All Lebanon`);
  }
  lines.push(divider);

  // Cart Items Section
  lines.push(`🛒 *CART ITEMS SUMMARY (${totalQuantity} ${totalQuantity === 1 ? 'item' : 'items'}):*`);
  lines.push('');

  items.forEach((item, index) => {
    const itemTotalUSD = item.selectedVariant.priceUSD * item.quantity;
    const itemTotalLBP = Math.round(itemTotalUSD * rate);
    const numPrefix = numberEmojis[index] || `${index + 1}.`;

    lines.push(`${numPrefix} *${item.product.name}*`);
    lines.push(`   ▫️ *Spec/Variant:* ${item.selectedVariant.name}`);
    if (item.product.brand) {
      lines.push(`   ▫️ *Brand:* ${item.product.brand}`);
    }
    if (item.product.condition) {
      lines.push(`   ▫️ *Condition:* ${item.product.condition}`);
    }
    lines.push(
      `   ▫️ *Qty:* ${item.quantity} × $${item.selectedVariant.priceUSD.toLocaleString()} = *$${itemTotalUSD.toLocaleString()}* (≈ ${itemTotalLBP.toLocaleString()} L.L.)`
    );
    lines.push('');
  });

  lines.push(divider);

  // Pricing & Totals Breakdown
  lines.push(`📊 *PRICING & TOTAL BREAKDOWN:*`);
  lines.push(`• *Items Subtotal:* $${subtotalUSD.toLocaleString()} (≈ ${subtotalLBP.toLocaleString()} L.L.)`);
  
  if (customer?.deliveryType === 'pickup') {
    lines.push(`• *Delivery:* FREE (Store Pickup at Jadra Warehouse Store)`);
  } else if (calculatedDeliveryUSD === 0) {
    lines.push(`• *Delivery (All Lebanon):* FREE (Orders over $150)`);
  } else {
    const deliveryLBP = Math.round(calculatedDeliveryUSD * rate);
    lines.push(`• *Delivery (All Lebanon):* $${calculatedDeliveryUSD} (≈ ${deliveryLBP.toLocaleString()} L.L.)`);
  }

  lines.push(`• *GRAND TOTAL DUE:* *$${grandTotalUSD.toLocaleString()}*`);
  lines.push(`  💵 *L.L. Equivalent:* *${grandTotalLBP.toLocaleString()} L.L.* (Rate: ${rate.toLocaleString()} L.L./$)`);
  lines.push(divider);

  // Customer & Delivery Information
  if (customer) {
    const hasCustomerInfo = Boolean(
      customer.fullName?.trim() ||
      customer.phone?.trim() ||
      customer.address?.trim() ||
      customer.notes?.trim()
    );

    lines.push(`👤 *DELIVERY & RECIPIENT DETAILS:*`);
    if (customer.fullName?.trim()) {
      lines.push(`• *Customer Name:* ${customer.fullName.trim()}`);
    }
    if (customer.phone?.trim()) {
      lines.push(`• *Phone Number:* ${customer.phone.trim()}`);
    }
    
    if (customer.deliveryType === 'pickup') {
      lines.push(`• *Fulfillment:* In-Store Pickup (Jadra Warehouse Store, Lebanon)`);
    } else {
      lines.push(`• *Delivery Destination:* ${customer.region || 'All Lebanon'}`);
      if (customer.address?.trim()) {
        lines.push(`• *Address:* ${customer.address.trim()}`);
      }
    }

    if (customer.paymentMethod) {
      lines.push(`• *Payment Method:* ${getPaymentMethodLabel(customer.paymentMethod)}`);
    }

    if (customer.notes?.trim()) {
      lines.push(`• *Special Notes:* ${customer.notes.trim()}`);
    }

    if (!hasCustomerInfo) {
      lines.push(`• *Status:* Customer details to be confirmed via WhatsApp chat`);
    }

    lines.push(divider);
  }

  // Footer & Call to Action
  lines.push(`🛡️ *Official Lebanese Agency Warranty & Sealed Packaging*`);
  lines.push(`💬 _Please confirm item availability and arrange delivery dispatch timing._`);

  return lines.join('\n');
}

/**
 * Builds a direct WhatsApp URL with pre-filled formatted cart summary text block.
 */
export function buildWhatsAppCartCheckoutLink(
  phoneNumber: string,
  options: WhatsAppCartSummaryOptions
): string {
  const message = formatWhatsAppCartSummary(options);
  return buildWhatsAppLink(phoneNumber, message);
}
