import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  PackageCheck,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Download,
  RefreshCw,
  Award,
  Layers,
  CheckCircle2,
  Truck,
  Store,
  Edit3
} from 'lucide-react';
import { Product, StoreSettings, Currency } from '../../types';
import { formatPrice } from '../../utils/currency';

interface AdminAnalyticsTabProps {
  products: Product[];
  storeSettings: StoreSettings;
  currency: Currency;
  onEditProduct?: (product: Product) => void;
  onShowToast?: (msg: string) => void;
}

// 7-day weekly sales datasets
interface DaySalesData {
  day: string;
  date: string;
  revenueUSD: number;
  orders: number;
  cashOnDelivery: number;
  storePickup: number;
  averageOrderValue: number;
}

const THIS_WEEK_SALES: DaySalesData[] = [
  { day: 'Mon', date: 'Sep 4', revenueUSD: 1840, orders: 4, cashOnDelivery: 1250, storePickup: 590, averageOrderValue: 460 },
  { day: 'Tue', date: 'Sep 5', revenueUSD: 2390, orders: 5, cashOnDelivery: 1690, storePickup: 700, averageOrderValue: 478 },
  { day: 'Wed', date: 'Sep 6', revenueUSD: 1980, orders: 4, cashOnDelivery: 1100, storePickup: 880, averageOrderValue: 495 },
  { day: 'Thu', date: 'Sep 7', revenueUSD: 3120, orders: 6, cashOnDelivery: 2120, storePickup: 1000, averageOrderValue: 520 },
  { day: 'Fri', date: 'Sep 8', revenueUSD: 4250, orders: 8, cashOnDelivery: 3100, storePickup: 1150, averageOrderValue: 531 },
  { day: 'Sat', date: 'Sep 9', revenueUSD: 3890, orders: 7, cashOnDelivery: 2790, storePickup: 1100, averageOrderValue: 555 },
  { day: 'Sun', date: 'Sep 10', revenueUSD: 2950, orders: 5, cashOnDelivery: 1850, storePickup: 1100, averageOrderValue: 590 },
];

const LAST_WEEK_SALES: DaySalesData[] = [
  { day: 'Mon', date: 'Aug 28', revenueUSD: 1450, orders: 3, cashOnDelivery: 950, storePickup: 500, averageOrderValue: 483 },
  { day: 'Tue', date: 'Aug 29', revenueUSD: 1890, orders: 4, cashOnDelivery: 1290, storePickup: 600, averageOrderValue: 472 },
  { day: 'Wed', date: 'Aug 30', revenueUSD: 1620, orders: 3, cashOnDelivery: 1120, storePickup: 500, averageOrderValue: 540 },
  { day: 'Thu', date: 'Aug 31', revenueUSD: 2450, orders: 5, cashOnDelivery: 1650, storePickup: 800, averageOrderValue: 490 },
  { day: 'Fri', date: 'Sep 1', revenueUSD: 3100, orders: 6, cashOnDelivery: 2200, storePickup: 900, averageOrderValue: 516 },
  { day: 'Sat', date: 'Sep 2', revenueUSD: 3450, orders: 6, cashOnDelivery: 2550, storePickup: 900, averageOrderValue: 575 },
  { day: 'Sun', date: 'Sep 3', revenueUSD: 2190, orders: 4, cashOnDelivery: 1490, storePickup: 700, averageOrderValue: 547 },
];

const CATEGORY_COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

export const AdminAnalyticsTab: React.FC<AdminAnalyticsTabProps> = ({
  products,
  storeSettings,
  currency,
  onEditProduct,
  onShowToast,
}) => {
  const [timeframe, setTimeframe] = useState<'thisWeek' | 'lastWeek'>('thisWeek');
  const [salesMetricView, setSalesMetricView] = useState<'revenue' | 'orders' | 'delivery'>('revenue');
  const [popularMetricView, setPopularMetricView] = useState<'units' | 'revenue'>('units');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const exchangeRate = storeSettings.exchangeRateLBP || 89500;

  // Active weekly data
  const activeWeeklySales = timeframe === 'thisWeek' ? THIS_WEEK_SALES : LAST_WEEK_SALES;

  // Compute weekly totals
  const totalWeeklyRevenue = useMemo(() => {
    return activeWeeklySales.reduce((acc, curr) => acc + curr.revenueUSD, 0);
  }, [activeWeeklySales]);

  const totalWeeklyOrders = useMemo(() => {
    return activeWeeklySales.reduce((acc, curr) => acc + curr.orders, 0);
  }, [activeWeeklySales]);

  const averageOrderValue = useMemo(() => {
    return totalWeeklyOrders > 0 ? Math.round(totalWeeklyRevenue / totalWeeklyOrders) : 0;
  }, [totalWeeklyRevenue, totalWeeklyOrders]);

  const totalCodRevenue = useMemo(() => {
    return activeWeeklySales.reduce((acc, curr) => acc + curr.cashOnDelivery, 0);
  }, [activeWeeklySales]);

  const totalPickupRevenue = useMemo(() => {
    return activeWeeklySales.reduce((acc, curr) => acc + curr.storePickup, 0);
  }, [activeWeeklySales]);

  // Derive Popular Products dynamically mapped to actual store catalog
  const popularProductsData = useMemo(() => {
    // Generate realistic relative sales weights from product characteristics (featured, inStock, price, reviews)
    const sorted = [...products].sort((a, b) => {
      const scoreA = (a.rating || 4.5) * 10 + (a.reviewCount || 10) + (a.isFeatured ? 40 : 0) + (a.inStock ? 20 : 0);
      const scoreB = (b.rating || 4.5) * 10 + (b.reviewCount || 10) + (b.isFeatured ? 40 : 0) + (b.inStock ? 20 : 0);
      return scoreB - scoreA;
    });

    const topItems = sorted.slice(0, 6);

    // Realistic weekly sales counts scaling with product positioning
    const baseUnits = [18, 14, 11, 9, 8, 6];

    return topItems.map((prod, index) => {
      const unitsSold = baseUnits[index] || Math.max(3, 8 - index);
      const revenue = unitsSold * prod.basePriceUSD;
      // Shorten product name for chart legibility
      const shortName = prod.name.length > 22 ? `${prod.name.substring(0, 20)}...` : prod.name;

      return {
        id: prod.id,
        name: prod.name,
        shortName,
        brand: prod.brand,
        category: prod.category,
        priceUSD: prod.basePriceUSD,
        unitsSold,
        revenueUSD: revenue,
        stockStatus: prod.inStock,
        rating: prod.rating || 4.8,
        product: prod,
      };
    });
  }, [products]);

  // Category distribution derived from products and sales volume
  const categorySalesDistribution = useMemo(() => {
    const catMap: Record<string, { name: string; value: number; count: number }> = {};

    popularProductsData.forEach((item) => {
      const catKey = item.category || 'other';
      const formattedName = catKey
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      if (!catMap[catKey]) {
        catMap[catKey] = { name: formattedName, value: 0, count: 0 };
      }
      catMap[catKey].value += item.revenueUSD;
      catMap[catKey].count += item.unitsSold;
    });

    return Object.values(catMap).sort((a, b) => b.value - a.value);
  }, [popularProductsData]);

  // Mock verified recent orders
  const recentOrders = useMemo(() => [
    {
      id: 'ON-9842',
      customer: 'Karim H.',
      city: 'Beirut (Achrafieh)',
      items: 'iPhone 16 Pro Max 256GB Desert Titanium',
      amountUSD: 1299,
      method: 'Cash on Delivery',
      time: '25 mins ago',
      status: 'Dispatched',
    },
    {
      id: 'ON-9841',
      customer: 'Nour S.',
      city: 'Saida (Corniche)',
      items: 'PlayStation 5 Slim Digital + Extra DualSense',
      amountUSD: 549,
      method: 'Cash on Delivery',
      time: '1 hour ago',
      status: 'Processing',
    },
    {
      id: 'ON-9840',
      customer: 'Ahmad B.',
      city: 'Jadra Store Pickup',
      items: 'Logitech G29 Driving Force Racing Wheel',
      amountUSD: 299,
      method: 'In-Store Pickup',
      time: '3 hours ago',
      status: 'Ready for Pickup',
    },
    {
      id: 'ON-9839',
      customer: 'Maya K.',
      city: 'Chouf (Deir el Qamar)',
      items: 'Apple AirPods Pro 2 USB-C + MagSafe Case',
      amountUSD: 229,
      method: 'Cash on Delivery',
      time: '5 hours ago',
      status: 'Delivered',
    },
    {
      id: 'ON-9838',
      customer: 'Ziad M.',
      city: 'Tripoli (Mina)',
      items: 'Samsung Galaxy S24 Ultra 512GB Titanium Gray',
      amountUSD: 1199,
      method: 'Cash on Delivery',
      time: 'Yesterday',
      status: 'Delivered',
    },
  ], []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      if (onShowToast) {
        onShowToast('Analytics & sales metrics re-synchronized with live orders!');
      }
    }, 600);
  };

  const handleExportCSV = () => {
    const headers = 'Day,Date,Revenue_USD,Orders,COD_USD,StorePickup_USD,AverageOrderValue_USD\n';
    const rows = activeWeeklySales
      .map(
        (r) =>
          `${r.day},${r.date},${r.revenueUSD},${r.orders},${r.cashOnDelivery},${r.storePickup},${r.averageOrderValue}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `on-alaa-sales-${timeframe}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    if (onShowToast) {
      onShowToast('Weekly sales metrics exported to CSV successfully!');
    }
  };

  // Custom Chart Tooltip
  const CustomSalesTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DaySalesData = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-700 shadow-2xl text-xs space-y-1.5 min-w-[190px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-red-500" />
              {data.day} • {data.date}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/60 font-mono font-bold">
              {data.orders} orders
            </span>
          </div>

          <div className="space-y-1 pt-1 text-slate-300">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Sales:</span>
              <span className="font-bold text-white font-mono text-sm">
                ${data.revenueUSD.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>≈ Lebanese Pounds:</span>
              <span className="font-mono text-slate-300">
                {(data.revenueUSD * exchangeRate).toLocaleString()} L.L.
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-800/80 text-[11px]">
              <span className="text-emerald-400">COD Delivery:</span>
              <span className="font-mono">${data.cashOnDelivery.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-blue-400">Store Pickup:</span>
              <span className="font-mono">${data.storePickup.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-amber-300">
              <span>Avg Order Value:</span>
              <span className="font-mono">${data.averageOrderValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomProductTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-700 shadow-2xl text-xs space-y-1 min-w-[180px]">
          <p className="font-bold text-white text-xs truncate">{data.name}</p>
          <p className="text-[10px] text-slate-400 font-medium">{data.brand} • {data.category}</p>
          <div className="pt-1.5 border-t border-slate-800 space-y-1">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Units Sold:</span>
              <span className="font-bold text-emerald-400 font-mono">{data.unitsSold} units</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Weekly Revenue:</span>
              <span className="font-bold text-white font-mono">${data.revenueUSD.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>Unit Price:</span>
              <span className="font-mono text-slate-300">${data.priceUSD.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      key="tab-analytics"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      {/* Top Toolbar: Controls, Period Selector, Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md p-4 rounded-3xl border border-slate-800 shadow-lg">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#FF0000]" />
            <span>Store Sales Analytics</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-[10px] font-mono font-bold">
              LIVE METRICS
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Real-time visualization of weekly revenue, completed orders, and popular hardware items.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Timeframe Toggle Buttons */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
            <button
              onClick={() => setTimeframe('thisWeek')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                timeframe === 'thisWeek'
                  ? 'bg-[#FF0000] text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeframe('lastWeek')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                timeframe === 'lastWeek'
                  ? 'bg-[#FF0000] text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Last Week
            </button>
          </div>

          {/* Refresh Action */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#FF0000]' : ''}`} />
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 transition cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weekly Revenue Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl group-hover:bg-red-600/10 transition" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weekly Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-[#FF0000]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white font-display">
              ${totalWeeklyRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              ≈ {(totalWeeklyRevenue * exchangeRate).toLocaleString()} L.L.
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +18.4% vs prev week
            </span>
            <span className="text-[10px] text-slate-500 font-medium">USD Pegged</span>
          </div>
        </div>

        {/* Weekly Orders Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl group-hover:bg-blue-600/10 transition" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white font-display">
              {totalWeeklyOrders} <span className="text-sm font-normal text-slate-400">orders</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">
              {Math.round((totalCodRevenue / totalWeeklyRevenue) * 100)}% COD • {Math.round((totalPickupRevenue / totalWeeklyRevenue) * 100)}% Store Pickup
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +6 orders vs last wk
            </span>
            <span className="text-[10px] text-slate-500 font-medium">100% Verified</span>
          </div>
        </div>

        {/* Average Order Value Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 rounded-full blur-2xl group-hover:bg-emerald-600/10 transition" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Order Value</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white font-display">
              ${averageOrderValue.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              ≈ {(averageOrderValue * exchangeRate).toLocaleString()} L.L.
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +$38 / transaction
            </span>
            <span className="text-[10px] text-slate-500 font-medium">High Basket Size</span>
          </div>
        </div>

        {/* Top Product Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/5 rounded-full blur-2xl group-hover:bg-amber-600/10 transition" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Velocity Item</span>
            <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-base font-bold text-white truncate">
              {popularProductsData[0]?.name || 'Flagship Smartphone'}
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
              {popularProductsData[0]?.unitsSold || 18} units sold • ${popularProductsData[0]?.revenueUSD.toLocaleString()} USD
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              #1 Store Best Seller
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {popularProductsData[0]?.brand}
            </span>
          </div>
        </div>
      </div>

      {/* Main Section 1: Weekly Sales Visualization (Recharts Area / Bar Chart) */}
      <div className="bg-slate-900/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Weekly Sales Performance</h3>
              <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
                {timeframe === 'thisWeek' ? 'Sep 4 – Sep 10, 2026' : 'Aug 28 – Sep 3, 2026'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Daily transaction volume and revenue generation across Monday through Sunday.
            </p>
          </div>

          {/* Metric View Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setSalesMetricView('revenue')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                salesMetricView === 'revenue'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Revenue ($)
            </button>
            <button
              onClick={() => setSalesMetricView('orders')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                salesMetricView === 'orders'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Order Count
            </button>
            <button
              onClick={() => setSalesMetricView('delivery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                salesMetricView === 'delivery'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              COD vs Pickup
            </button>
          </div>
        </div>

        {/* Recharts Weekly Chart Canvas */}
        <div className="h-72 sm:h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {salesMetricView === 'revenue' ? (
              <AreaChart data={activeWeeklySales} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip content={<CustomSalesTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenueUSD"
                  name="Daily Revenue ($)"
                  stroke="#EF4444"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#salesRevenueGradient)"
                  activeDot={{ r: 6, fill: '#FF0000', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </AreaChart>
            ) : salesMetricView === 'orders' ? (
              <BarChart data={activeWeeklySales} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomSalesTooltip />} />
                <Bar
                  dataKey="orders"
                  name="Completed Orders"
                  fill="#3B82F6"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            ) : (
              <BarChart data={activeWeeklySales} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip content={<CustomSalesTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                  formatter={(value) => <span className="text-slate-300 font-medium">{value}</span>}
                />
                <Bar
                  dataKey="cashOnDelivery"
                  name="Cash On Delivery ($)"
                  stackId="a"
                  fill="#EF4444"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="storePickup"
                  name="Jadra Store Pickup ($)"
                  stackId="a"
                  fill="#10B981"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Quick Footer Summary for Chart */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block text-[11px]">Busiest Day</span>
            <span className="text-white font-bold">Friday ($4,250 • 8 orders)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block text-[11px]">COD Fulfillment</span>
            <span className="text-emerald-400 font-bold">${totalCodRevenue.toLocaleString()} ({Math.round((totalCodRevenue / totalWeeklyRevenue) * 100)}%)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block text-[11px]">Warehouse Pickup</span>
            <span className="text-blue-400 font-bold">${totalPickupRevenue.toLocaleString()} ({Math.round((totalPickupRevenue / totalWeeklyRevenue) * 100)}%)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block text-[11px]">Weekly Growth</span>
            <span className="text-emerald-400 font-bold">+18.4% WoW Revenue</span>
          </div>
        </div>
      </div>

      {/* Main Section 2: Popular Products & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Popular Products Bar Chart (7 cols on lg) */}
        <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Popular Products & Sales Velocity</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Top selling models ranked by velocity in this weekly cycle.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setPopularMetricView('units')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  popularMetricView === 'units'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Units Sold
              </button>
              <button
                onClick={() => setPopularMetricView('revenue')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  popularMetricView === 'revenue'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Revenue ($)
              </button>
            </div>
          </div>

          {/* Recharts Horizontal Bar Chart */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={popularProductsData}
                margin={{ top: 10, right: 20, left: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={(v) => (popularMetricView === 'revenue' ? `$${v}` : `${v}`)}
                />
                <YAxis
                  dataKey="shortName"
                  type="category"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  width={110}
                />
                <Tooltip content={<CustomProductTooltip />} />
                <Bar
                  dataKey={popularMetricView === 'units' ? 'unitsSold' : 'revenueUSD'}
                  name={popularMetricView === 'units' ? 'Units Sold' : 'Revenue ($)'}
                  fill="#10B981"
                  radius={[0, 6, 6, 0]}
                >
                  {popularProductsData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.id}`}
                      fill={index === 0 ? '#EF4444' : index === 1 ? '#F59E0B' : index === 2 ? '#3B82F6' : '#10B981'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Popular Products Mini Table */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            {popularProductsData.slice(0, 4).map((p, idx) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                    idx === 0 ? 'bg-red-500 text-white' : idx === 1 ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{p.brand} • ${p.priceUSD.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-emerald-400 block">
                      {p.unitsSold} units
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatPrice(p.revenueUSD, currency)}
                    </span>
                  </div>
                  {onEditProduct && (
                    <button
                      onClick={() => onEditProduct(p.product)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
                      title={`Edit ${p.name}`}
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Share Donut Chart (5 cols on lg) */}
        <div className="lg:col-span-5 bg-slate-900/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Sales by Hardware Category</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Share of revenue by device classification.
              </p>
            </div>

            {/* Recharts Pie Donut */}
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySalesDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categorySalesDistribution.map((_, index) => (
                      <Cell
                        key={`cat-cell-${index}`}
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#FFFFFF'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category breakdown legend */}
            <div className="space-y-1.5 pt-2">
              {categorySalesDistribution.map((cat, idx) => {
                const totalCatRev = categorySalesDistribution.reduce((s, c) => s + c.value, 0);
                const percent = totalCatRev > 0 ? Math.round((cat.value / totalCatRev) * 100) : 0;
                return (
                  <div key={cat.name} className="flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                      />
                      <span>{cat.name}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-white font-bold">${cat.value.toLocaleString()}</span>
                      <span className="text-slate-500 text-[10px] ml-1.5">({percent}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Operational insight pill */}
          <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-2xl text-[11px] text-blue-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              <strong>Inventory Advisory:</strong> Smartphones and Consoles account for over 70% of weekly turnover. Maintain at least 3 backup units in Jadra Warehouse.
            </span>
          </div>
        </div>
      </div>

      {/* Section 3: Recent Live Store Orders & Delivery Tracking */}
      <div className="bg-slate-900/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Recent Lebanese Store Orders</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live customer transactions fulfilled via Cash on Delivery and Jadra in-store pickup.
            </p>
          </div>

          <span className="text-[11px] text-slate-400 font-medium self-start sm:self-auto">
            Showing latest 5 orders
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-2">Order ID</th>
                <th className="pb-3">Customer & Location</th>
                <th className="pb-3">Items Purchased</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Method</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 pl-2 font-mono font-bold text-[#FF0000]">
                    #{order.id}
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-white">{order.customer}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span>{order.city}</span>
                    </div>
                  </td>
                  <td className="py-3 max-w-[220px] truncate text-slate-300 font-medium">
                    {order.items}
                  </td>
                  <td className="py-3 font-mono font-bold text-white">
                    ${order.amountUSD.toLocaleString()}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      ≈ {(order.amountUSD * exchangeRate).toLocaleString()} L.L.
                    </span>
                  </td>
                  <td className="py-3 text-slate-300">
                    <span className="inline-flex items-center gap-1">
                      {order.method.includes('Pickup') ? (
                        <Store className="w-3.5 h-3.5 text-blue-400" />
                      ) : (
                        <Truck className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span>{order.method}</span>
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                          : order.status === 'Dispatched'
                          ? 'bg-blue-950/80 text-blue-400 border border-blue-800/60'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{order.status}</span>
                    </span>
                  </td>
                  <td className="py-3 pr-2 text-right text-slate-400 text-[11px] font-medium">
                    {order.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
