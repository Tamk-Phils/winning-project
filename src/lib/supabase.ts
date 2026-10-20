import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Farm, Product, Order, BulkRFQ } from '../types';
import { INITIAL_FARMS, INITIAL_PRODUCTS } from '../data/mockData';

// Storage keys for custom Supabase config and local fallback
const STORAGE_KEY_URL = 'agriflow_supabase_url';
const STORAGE_KEY_KEY = 'agriflow_supabase_key';
const STORAGE_KEY_PRODUCTS = 'agriflow_products_v1';
const STORAGE_KEY_FARMS = 'agriflow_farms_v1';
const STORAGE_KEY_ORDERS = 'agriflow_orders_v1';
const STORAGE_KEY_RFQS = 'agriflow_rfqs_v1';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}

export function getStoredSupabaseConfig(): SupabaseConfig {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = localStorage.getItem(STORAGE_KEY_URL) || envUrl;
  const storedKey = localStorage.getItem(STORAGE_KEY_KEY) || envKey;

  const isConnected = Boolean(storedUrl && storedKey && storedUrl.includes('supabase.co'));

  return {
    url: storedUrl,
    anonKey: storedKey,
    isConnected,
  };
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim());
  else localStorage.removeItem(STORAGE_KEY_URL);

  if (anonKey) localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  else localStorage.removeItem(STORAGE_KEY_KEY);
  
  // Reinitialize client
  initClient();
}

let supabaseInstance: SupabaseClient | null = null;

function initClient(): SupabaseClient | null {
  const config = getStoredSupabaseConfig();
  if (config.isConnected) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey);
      return supabaseInstance;
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      supabaseInstance = null;
      return null;
    }
  }
  supabaseInstance = null;
  return null;
}

// Initial initialization
initClient();

export function getSupabase(): SupabaseClient | null {
  return supabaseInstance;
}

// -------------------------------------------------------------
// LOCAL REPOSITORY (Fallback & Persistence when Supabase is optional)
// -------------------------------------------------------------

function getLocalData<T>(key: string, defaultData: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultData;
    return JSON.parse(raw);
  } catch {
    return defaultData;
  }
}

function setLocalData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

// -------------------------------------------------------------
// API REPOSITORIES (Combines Live Supabase + Graceful Offline/Mock)
// -------------------------------------------------------------

export async function fetchFarms(): Promise<Farm[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from('farms').select('*');
      if (!error && data && data.length > 0) {
        return data as Farm[];
      }
    } catch (err) {
      console.warn('Supabase fetchFarms error, falling back to local data', err);
    }
  }
  return getLocalData<Farm[]>(STORAGE_KEY_FARMS, INITIAL_FARMS);
}

export async function fetchProducts(): Promise<Product[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from('products').select('*');
      if (!error && data && data.length > 0) {
        return data as Product[];
      }
    } catch (err) {
      console.warn('Supabase fetchProducts error, falling back to local data', err);
    }
  }
  return getLocalData<Product[]>(STORAGE_KEY_PRODUCTS, INITIAL_PRODUCTS);
}

export async function saveProduct(product: Product): Promise<{ success: boolean; product: Product; error?: string }> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from('products').insert([product]).select().single();
      if (!error && data) {
        // Also update local cache
        const local = getLocalData<Product[]>(STORAGE_KEY_PRODUCTS, INITIAL_PRODUCTS);
        setLocalData(STORAGE_KEY_PRODUCTS, [data as Product, ...local]);
        return { success: true, product: data as Product };
      }
      if (error) {
        console.warn('Supabase insert failed, saving to local state:', error.message);
      }
    } catch (err: unknown) {
      console.warn('Supabase saveProduct error:', err);
    }
  }

  // Local fallback
  const local = getLocalData<Product[]>(STORAGE_KEY_PRODUCTS, INITIAL_PRODUCTS);
  const updated = [product, ...local];
  setLocalData(STORAGE_KEY_PRODUCTS, updated);
  return { success: true, product };
}

export async function saveOrder(order: Order): Promise<{ success: boolean; order: Order; error?: string }> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from('orders').insert([order]).select().single();
      if (!error && data) {
        const local = getLocalData<Order[]>(STORAGE_KEY_ORDERS, []);
        setLocalData(STORAGE_KEY_ORDERS, [data as Order, ...local]);
        return { success: true, order: data as Order };
      }
    } catch (err) {
      console.warn('Supabase saveOrder error:', err);
    }
  }

  const local = getLocalData<Order[]>(STORAGE_KEY_ORDERS, []);
  setLocalData(STORAGE_KEY_ORDERS, [order, ...local]);
  return { success: true, order };
}

export async function fetchOrders(): Promise<Order[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from('orders').select('*').order('createdAt', { ascending: false });
      if (!error && data) {
        return data as Order[];
      }
    } catch (err) {
      console.warn('Supabase fetchOrders error:', err);
    }
  }
  return getLocalData<Order[]>(STORAGE_KEY_ORDERS, []);
}

export async function submitBulkRFQ(rfq: BulkRFQ): Promise<{ success: boolean; rfq: BulkRFQ }> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from('bulk_rfqs').insert([rfq]).select().single();
      if (!error && data) {
        const local = getLocalData<BulkRFQ[]>(STORAGE_KEY_RFQS, []);
        setLocalData(STORAGE_KEY_RFQS, [data as BulkRFQ, ...local]);
        return { success: true, rfq: data as BulkRFQ };
      }
    } catch (err) {
      console.warn('Supabase submitBulkRFQ error:', err);
    }
  }

  const local = getLocalData<BulkRFQ[]>(STORAGE_KEY_RFQS, []);
  setLocalData(STORAGE_KEY_RFQS, [rfq, ...local]);
  return { success: true, rfq };
}

export async function fetchBulkRFQs(): Promise<BulkRFQ[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from('bulk_rfqs').select('*').order('createdAt', { ascending: false });
      if (!error && data) {
        return data as BulkRFQ[];
      }
    } catch (err) {
      console.warn('Supabase fetchBulkRFQs error:', err);
    }
  }
  return getLocalData<BulkRFQ[]>(STORAGE_KEY_RFQS, []);
}

// -------------------------------------------------------------
// SUPABASE SQL MIGRATION SCHEMA GENERATOR
// -------------------------------------------------------------
export const SUPABASE_SQL_SCHEMA = `-- AgriFlow Agribusiness Platform Schema
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create FARMS Table
CREATE TABLE IF NOT EXISTS public.farms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  location TEXT NOT NULL,
  state TEXT,
  coordinates JSONB,
  region TEXT,
  ownerName TEXT,
  story TEXT,
  avatar TEXT,
  bannerImage TEXT,
  certifications TEXT[],
  practices TEXT[],
  acreage NUMERIC,
  rating NUMERIC DEFAULT 5.0,
  reviewCount INT DEFAULT 0,
  totalHarvestSoldKg NUMERIC DEFAULT 0,
  joinedYear INT,
  directPayoutShare NUMERIC DEFAULT 88,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create PRODUCTS Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  variety TEXT,
  farmId TEXT REFERENCES public.farms(id) ON DELETE SET NULL,
  farmName TEXT NOT NULL,
  farmLocation TEXT,
  farmAvatar TEXT,
  description TEXT,
  imageUrl TEXT NOT NULL,
  galleryUrls TEXT[],
  retailPrice NUMERIC NOT NULL,
  retailUnit TEXT NOT NULL,
  wholesalePrice NUMERIC NOT NULL,
  wholesaleUnit TEXT NOT NULL,
  wholesaleMinOrder NUMERIC DEFAULT 10,
  stockQuantity NUMERIC NOT NULL,
  stockUnit TEXT NOT NULL,
  harvestDate TEXT,
  harvestAgeHours INT DEFAULT 12,
  shelfLifeDays INT DEFAULT 7,
  coldChainTemp TEXT,
  grade TEXT,
  certifications TEXT[],
  practices TEXT[],
  nutritionalNotes TEXT[],
  flavorProfile TEXT,
  isOrganic BOOLEAN DEFAULT true,
  isRegenerative BOOLEAN DEFAULT false,
  inSeason BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 4.9,
  reviewsCount INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create ORDERS Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  items JSONB NOT NULL,
  customerName TEXT NOT NULL,
  customerEmail TEXT NOT NULL,
  customerPhone TEXT,
  buyerType TEXT NOT NULL,
  shippingAddress TEXT NOT NULL,
  deliverySlot TEXT,
  deliveryMethod TEXT,
  tipPercentage NUMERIC DEFAULT 5,
  subtotal NUMERIC NOT NULL,
  deliveryFee NUMERIC NOT NULL,
  tipAmount NUMERIC NOT NULL,
  farmerDirectPayout NUMERIC NOT NULL,
  platformFee NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'confirmed',
  timeline JSONB,
  createdAt TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create BULK RFQ Table
CREATE TABLE IF NOT EXISTS public.bulk_rfqs (
  id TEXT PRIMARY KEY,
  companyName TEXT NOT NULL,
  contactPerson TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  produceNeeded TEXT NOT NULL,
  category TEXT,
  volumeNeeded TEXT NOT NULL,
  frequency TEXT NOT NULL,
  deliveryLocation TEXT NOT NULL,
  targetPriceRange TEXT,
  coldChainRequired BOOLEAN DEFAULT true,
  additionalNotes TEXT,
  status TEXT DEFAULT 'Pending Review',
  createdAt TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Allow public read/write for demo
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_rfqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on farms" ON public.farms FOR SELECT USING (true);
CREATE POLICY "Allow public read on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert on products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on bulk_rfqs" ON public.bulk_rfqs FOR SELECT USING (true);
CREATE POLICY "Allow public insert on bulk_rfqs" ON public.bulk_rfqs FOR INSERT WITH CHECK (true);
`;
