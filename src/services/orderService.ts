import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import { FirestoreOrder, OrderStatus } from '../types';
import {
  isFirestoreQuotaExceeded,
  markFirestoreQuotaExceeded,
  isFirestoreQuotaError
} from './productService';

export const ORDERS_COLLECTION = 'orders';
const LOCAL_ORDERS_KEY = 'on_alaa_customer_orders';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
    },
    operationType,
    path
  };
  console.error('[Firestore Order Error]:', JSON.stringify(errInfo));
}

// Initial demo orders for seamless testing and instant verification
export const DEMO_ORDERS: FirestoreOrder[] = [
  {
    id: 'OAS-LB-10492',
    orderNumber: 'OAS-LB-10492',
    customerName: 'Hassan Bazzi',
    customerPhone: '+961 70 882 144',
    deliveryRegion: 'Beirut - Achrafieh & Gemmayze',
    deliveryAddress: 'Charles Malek Ave, Building 44, 3rd Floor',
    deliveryType: 'delivery',
    paymentMethod: 'Cash on Delivery (USD / LBP)',
    items: [
      {
        productId: 'iphone-16-pro-max',
        productName: 'Apple iPhone 16 Pro Max',
        variantName: '256GB - Desert Titanium',
        quantity: 1,
        unitPriceUSD: 1199,
        totalUSD: 1199,
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=400&q=80'
      },
      {
        productId: 'apple-35w-charger',
        productName: 'Apple 35W Dual USB-C Port Compact Power Adapter',
        variantName: 'White - 35W Dual GaN',
        quantity: 1,
        unitPriceUSD: 59,
        totalUSD: 59,
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80'
      }
    ],
    subtotalUSD: 1258,
    deliveryFeeUSD: 0,
    totalUSD: 1258,
    status: 'out_for_delivery',
    statusDescription: 'Package loaded onto courier express van for same-day delivery across Greater Beirut.',
    courier: 'Wakilni Express Lebanon (Van #14 - Beirut Route)',
    trackingNumber: 'WAK-961-0842',
    estimatedDelivery: 'Today between 3:30 PM – 6:00 PM',
    notes: 'Please call 10 minutes before arrival at building entrance.',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    timeline: [
      {
        status: 'pending',
        title: 'Order Placed & Logged',
        description: 'Order registered in Beirut Central Dispatch system with Cash on Delivery.',
        timestamp: 'Today, 09:15 AM',
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Order Verified',
        description: 'Customer contact and delivery address confirmed via WhatsApp VIP desk.',
        timestamp: 'Today, 09:40 AM',
        completed: true
      },
      {
        status: 'processing',
        title: 'Inspected & Sealed',
        description: 'Original agency serial verified with 1-Year Official Warranty card enclosed.',
        timestamp: 'Today, 11:20 AM',
        completed: true
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery (Courier Assigned)',
        description: 'Dispatched with express delivery courier van. In transit to destination.',
        timestamp: 'Today, 01:45 PM',
        location: 'Greater Beirut Area',
        completed: true
      },
      {
        status: 'delivered',
        title: 'Package Handover & COD Settlement',
        description: 'Expected completion upon customer receipt and inspection.',
        timestamp: 'Estimated 4:30 PM',
        completed: false
      }
    ]
  },
  {
    id: 'OAS-LB-20815',
    orderNumber: 'OAS-LB-20815',
    customerName: 'Maya Khoury',
    customerPhone: '+961 71 492 811',
    deliveryRegion: 'Mount Lebanon - Keserwan (Jounieh, Zouk, Kaslik)',
    deliveryAddress: 'Kaslik Seaside Promenade, Coral Bldg, 2nd Floor',
    deliveryType: 'delivery',
    paymentMethod: 'Whish Money / COD',
    items: [
      {
        productId: 'ps5-pro',
        productName: 'Sony PlayStation 5 Pro Console (2TB SSD)',
        variantName: '2TB SSD Standard Edition',
        quantity: 1,
        unitPriceUSD: 899,
        totalUSD: 899,
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=400&q=80'
      }
    ],
    subtotalUSD: 899,
    deliveryFeeUSD: 0,
    totalUSD: 899,
    status: 'processing',
    statusDescription: 'Hardware allocated in warehouse; anti-tamper security packing in progress.',
    courier: 'Lebanon Express Courier Network',
    trackingNumber: 'LEC-961-7719',
    estimatedDelivery: 'Tomorrow before 2:00 PM',
    notes: 'Recipient requested afternoon delivery.',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    timeline: [
      {
        status: 'pending',
        title: 'Order Placed',
        description: 'Order registered via Online Storefront.',
        timestamp: 'Yesterday, 08:30 PM',
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Payment & Details Confirmed',
        description: 'Whish Money deposit verified by accounting desk.',
        timestamp: 'Today, 09:00 AM',
        completed: true
      },
      {
        status: 'processing',
        title: 'Packaging & Serial Registration',
        description: 'Preparing console for courier pickup with official warranty.',
        timestamp: 'Today, 11:00 AM',
        completed: true
      },
      {
        status: 'out_for_delivery',
        title: 'Dispatch to Mount Lebanon',
        description: 'Handover to regional courier distribution center.',
        timestamp: 'Scheduled for Tomorrow Morning',
        completed: false
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Delivery confirmation.',
        timestamp: 'Tomorrow Afternoon',
        completed: false
      }
    ]
  },
  {
    id: 'OAS-LB-34190',
    orderNumber: 'OAS-LB-34190',
    customerName: 'Karim Mansour',
    customerPhone: '+961 03 184 920',
    deliveryRegion: 'North Lebanon - Tripoli, Mina, Koura',
    deliveryAddress: 'Al-Mina Port Road, Marina Residence #5',
    deliveryType: 'delivery',
    paymentMethod: 'Cash on Delivery (USD)',
    items: [
      {
        productId: 'samsung-s24-ultra',
        productName: 'Samsung Galaxy S24 Ultra 5G',
        variantName: '512GB - Titanium Gray',
        quantity: 1,
        unitPriceUSD: 1099,
        totalUSD: 1099,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80'
      }
    ],
    subtotalUSD: 1099,
    deliveryFeeUSD: 0,
    totalUSD: 1099,
    status: 'delivered',
    statusDescription: 'Package successfully delivered and received in Tripoli by recipient.',
    courier: 'Aramex Lebanon (North Hub)',
    trackingNumber: 'ARM-LB-55102',
    estimatedDelivery: 'Completed',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    timeline: [
      {
        status: 'pending',
        title: 'Order Placed',
        description: 'Order created with Cash on Delivery.',
        timestamp: '2 days ago',
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Confirmed',
        description: 'Customer approved shipping details.',
        timestamp: '2 days ago',
        completed: true
      },
      {
        status: 'processing',
        title: 'Packed & Dispatched',
        description: 'Transferred to North Lebanon sorting facility.',
        timestamp: 'Yesterday',
        completed: true
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Courier out on Tripoli route.',
        timestamp: 'Yesterday, 11:30 AM',
        completed: true
      },
      {
        status: 'delivered',
        title: 'Delivered & Completed',
        description: 'Customer received package and completed COD payment.',
        timestamp: 'Yesterday, 03:15 PM',
        completed: true
      }
    ]
  }
];

/**
 * Get locally stored orders placed on this device
 */
export function getLocalOrders(): FirestoreOrder[] {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save order locally for quick recall in account modal
 */
export function saveOrderLocally(order: FirestoreOrder): void {
  try {
    const existing = getLocalOrders();
    const filtered = existing.filter((o) => o.orderNumber !== order.orderNumber);
    const updated = [order, ...filtered];
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated.slice(0, 15)));
  } catch (err) {
    console.warn('Failed to save order locally:', err);
  }
}

let hasSeededInitialOrders = false;

/**
 * Seeds initial demo orders to Firestore so live lookup immediately succeeds
 */
export async function seedDemoOrdersIfEmpty(): Promise<void> {
  if (hasSeededInitialOrders || isFirestoreQuotaExceeded()) return;
  hasSeededInitialOrders = true;

  try {
    // Check if the primary demo order exists
    const checkRef = doc(db, ORDERS_COLLECTION, DEMO_ORDERS[0].id);
    const snap = await getDoc(checkRef);
    if (!snap.exists()) {
      // Write demo orders to Firestore
      for (const order of DEMO_ORDERS) {
        const orderRef = doc(db, ORDERS_COLLECTION, order.id);
        await setDoc(orderRef, order);
      }
      console.log('[Firestore] Seeded initial demo orders to Firestore database.');
    }
  } catch (err: any) {
    if (isFirestoreQuotaError(err)) {
      markFirestoreQuotaExceeded();
    }
    console.warn('[Firestore] Note on seeding orders:', err?.message || err);
  }
}

/**
 * Retrieve order from Firestore database by order number
 */
export async function fetchOrderByNumber(orderNumber: string): Promise<{
  order: FirestoreOrder | null;
  source: 'firestore' | 'local' | 'not_found';
  error?: string;
}> {
  const cleanInput = orderNumber.trim();
  if (!cleanInput) {
    return { order: null, source: 'not_found' };
  }

  const cleanUpper = cleanInput.toUpperCase();

  // 1. First, attempt querying Cloud Firestore
  if (!isFirestoreQuotaExceeded()) {
    try {
      // Attempt 1: Direct document ID lookup
      const directDocRef = doc(db, ORDERS_COLLECTION, cleanUpper);
      const directDocSnap = await getDoc(directDocRef);

      if (directDocSnap.exists()) {
        const data = directDocSnap.data() as FirestoreOrder;
        saveOrderLocally(data);
        return { order: { ...data, id: directDocSnap.id }, source: 'firestore' };
      }

      // Attempt 2: Query by orderNumber field
      const ordersCol = collection(db, ORDERS_COLLECTION);
      const q = query(ordersCol, where('orderNumber', '==', cleanUpper), limit(1));
      const qSnap = await getDocs(q);

      if (!qSnap.empty) {
        const docItem = qSnap.docs[0];
        const data = docItem.data() as FirestoreOrder;
        saveOrderLocally(data);
        return { order: { ...data, id: docItem.id }, source: 'firestore' };
      }

      // Attempt 3: Try exact raw input match if user had lowercase or hyphens
      if (cleanInput !== cleanUpper) {
        const qRaw = query(ordersCol, where('orderNumber', '==', cleanInput), limit(1));
        const rawSnap = await getDocs(qRaw);
        if (!rawSnap.empty) {
          const docItem = rawSnap.docs[0];
          const data = docItem.data() as FirestoreOrder;
          saveOrderLocally(data);
          return { order: { ...data, id: docItem.id }, source: 'firestore' };
        }
      }
    } catch (err: any) {
      if (isFirestoreQuotaError(err)) {
        markFirestoreQuotaExceeded();
      }
      handleFirestoreError(err, OperationType.GET, `${ORDERS_COLLECTION}/${cleanUpper}`);
      console.warn('[Firestore] Error retrieving order from database:', err?.message || err);
    }
  }

  // 2. Check local saved orders
  const localOrders = getLocalOrders();
  const localMatch = localOrders.find(
    (o) => o.orderNumber.toUpperCase() === cleanUpper || o.id.toUpperCase() === cleanUpper
  );
  if (localMatch) {
    return { order: localMatch, source: 'local' };
  }

  // 3. Check built-in demo order catalog fallback if Firestore query didn't return
  const demoMatch = DEMO_ORDERS.find(
    (o) => o.orderNumber.toUpperCase() === cleanUpper || o.id.toUpperCase() === cleanUpper
  );
  if (demoMatch) {
    // Also try saving it to Firestore in background for future direct queries
    if (!isFirestoreQuotaExceeded()) {
      setDoc(doc(db, ORDERS_COLLECTION, demoMatch.id), demoMatch).catch(() => {});
    }
    return { order: demoMatch, source: 'firestore' };
  }

  return { order: null, source: 'not_found' };
}

/**
 * Persists an order into Firestore database & local cache upon checkout
 */
export async function saveOrderToFirestore(order: FirestoreOrder): Promise<boolean> {
  // Always save locally first
  saveOrderLocally(order);

  if (isFirestoreQuotaExceeded()) {
    return false;
  }

  try {
    const orderDocRef = doc(db, ORDERS_COLLECTION, order.id || order.orderNumber.toUpperCase());
    await setDoc(orderDocRef, order);
    console.log(`[Firestore] Order #${order.orderNumber} successfully saved in Firestore database.`);
    return true;
  } catch (err: any) {
    if (isFirestoreQuotaError(err)) {
      markFirestoreQuotaExceeded();
    }
    handleFirestoreError(err, OperationType.WRITE, `${ORDERS_COLLECTION}/${order.orderNumber}`);
    console.warn('[Firestore] Note on order persistence:', err?.message || err);
    return false;
  }
}

/**
 * Generates an initial timeline based on the order status
 */
export function buildOrderTimeline(status: OrderStatus, createdAtIso: string): FirestoreOrder['timeline'] {
  const createdDate = new Date(createdAtIso);
  const timeStr = createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = createdDate.toLocaleDateString([], { month: 'short', day: 'numeric' });

  const isPending = status === 'pending';
  const isConfirmed = ['confirmed', 'processing', 'out_for_delivery', 'delivered'].includes(status);
  const isProcessing = ['processing', 'out_for_delivery', 'delivered'].includes(status);
  const isOut = ['out_for_delivery', 'delivered'].includes(status);
  const isDelivered = status === 'delivered';

  return [
    {
      status: 'pending',
      title: 'Order Placed & Logged',
      description: 'Order registered in our system and assigned to dispatch desk.',
      timestamp: `${dateStr}, ${timeStr}`,
      completed: true,
    },
    {
      status: 'confirmed',
      title: 'Order Confirmed',
      description: 'Customer contact details verified for express Lebanon delivery.',
      timestamp: isConfirmed ? 'Confirmed' : 'Pending WhatsApp Confirmation',
      completed: isConfirmed,
    },
    {
      status: 'processing',
      title: 'Packaging & Quality Check',
      description: 'Device serial numbers registered with 1-Year Official Warranty.',
      timestamp: isProcessing ? 'Completed at Showroom' : 'Scheduled',
      completed: isProcessing,
    },
    {
      status: 'out_for_delivery',
      title: 'Dispatched with Courier',
      description: 'Assigned to courier van for express delivery to recipient address.',
      timestamp: isOut ? 'In Transit' : 'Pending Dispatch',
      location: 'Lebanon Delivery Network',
      completed: isOut,
    },
    {
      status: 'delivered',
      title: 'Delivered & Settled',
      description: 'Handover complete and COD cash settled.',
      timestamp: isDelivered ? 'Delivered' : 'Pending Handover',
      completed: isDelivered,
    },
  ];
}
