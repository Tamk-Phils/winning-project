export type ProductCategory = 
  | 'all'
  | 'vegetables'
  | 'fruits'
  | 'grains'
  | 'dairy_honey'
  | 'herbs'
  | 'bundles';

export type FarmingPractice = 
  | 'Regenerative Organic'
  | 'Certified Organic (USDA)'
  | 'Biodynamic'
  | 'Non-GMO'
  | 'Hydroponic / Vertical'
  | 'Pesticide-Free'
  | 'Heritage Heirloom';

export type AppView = 
  | 'marketplace'
  | 'farmer_portal'
  | 'farms'
  | 'csa_boxes'
  | 'wholesale_hub'
  | 'logistics'
  | 'orders'
  | 'onboarding'
  | 'impact';

export interface Farm {
  id: string;
  name: string;
  tagline: string;
  location: string;
  state: string;
  coordinates: { lat: number; lng: number };
  region: 'Pacific West' | 'Midwest Prairies' | 'California Central Valley' | 'Northeast Hudson' | 'Sunbelt South';
  ownerName: string;
  story: string;
  avatar: string;
  bannerImage: string;
  certifications: string[];
  practices: string[];
  acreage: number;
  rating: number;
  reviewCount: number;
  totalHarvestSoldKg: number;
  joinedYear: number;
  directPayoutShare: number; // e.g. 88 (meaning 88% goes directly to farmer)
  phone: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'vegetables' | 'fruits' | 'grains' | 'dairy_honey' | 'herbs' | 'bundles';
  variety: string;
  farmId: string;
  farmName: string;
  farmLocation: string;
  farmAvatar: string;
  description: string;
  imageUrl: string;
  galleryUrls?: string[];
  retailPrice: number;
  retailUnit: string;
  wholesalePrice: number;
  wholesaleUnit: string;
  wholesaleMinOrder: number;
  stockQuantity: number;
  stockUnit: string;
  harvestDate: string; // e.g. "2026-10-20"
  harvestAgeHours: number;
  shelfLifeDays: number;
  coldChainTemp: string;
  grade: 'Grade A+ Premium' | 'Grade A' | 'Export Quality' | 'Imperfect / Processing Grade';
  certifications: string[];
  practices: string[];
  nutritionalNotes: string[];
  flavorProfile?: string;
  isOrganic: boolean;
  isRegenerative: boolean;
  inSeason: boolean;
  featured?: boolean;
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  tier: 'retail' | 'wholesale';
}

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  buyerType: 'consumer' | 'restaurant' | 'grocery' | 'wholesale_distributor';
  shippingAddress: string;
  deliverySlot: string;
  deliveryMethod: 'cold_chain_express' | 'hub_pickup' | 'farm_gate';
  tipPercentage: number;
  subtotal: number;
  deliveryFee: number;
  tipAmount: number;
  farmerDirectPayout: number;
  platformFee: number;
  total: number;
  status: 'confirmed' | 'harvest_assigned' | 'cold_transport' | 'hub_verified' | 'delivered';
  timeline: {
    status: string;
    label: string;
    time: string;
    location: string;
    completed: boolean;
  }[];
  createdAt: string;
}

export interface BulkRFQ {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  produceNeeded: string;
  category: string;
  volumeNeeded: string;
  frequency: 'One-Time Spot Purchase' | 'Weekly Recurring' | 'Bi-Weekly' | 'Monthly Harvest Contract';
  deliveryLocation: string;
  targetPriceRange: string;
  coldChainRequired: boolean;
  additionalNotes?: string;
  status: 'Pending Review' | 'Matched with Farm' | 'Contract Quoted';
  createdAt: string;
}

export interface ProducerBatchSubmission {
  produceName: string;
  category: Product['category'];
  variety: string;
  harvestDate: string;
  quantity: number;
  unit: string;
  retailPrice: number;
  wholesalePrice: number;
  wholesaleMinOrder: number;
  shelfLifeDays: number;
  coldChainTemp: string;
  grade: Product['grade'];
  isOrganic: boolean;
  isRegenerative: boolean;
  certifications: string[];
  description: string;
  imageUrl: string;
}

export interface CSABoxPlan {
  id: string;
  name: string;
  tagline: string;
  servings: string;
  weightKg: number;
  pricePerDelivery: number;
  cadence: 'weekly' | 'biweekly' | 'monthly';
  description: string;
  includedCategories: string[];
  sampleItems: string[];
  imageUrl: string;
  popularityBadge?: string;
}

export interface LogisticsHub {
  id: string;
  name: string;
  region: string;
  location: string;
  capacityTons: number;
  activeColdRooms: number;
  targetTempRange: string;
  currentTemp: number;
  humidity: number;
  status: 'optimal' | 'high_volume' | 'dispatching';
  fleetVehiclesActive: number;
  coordinates: { lat: number; lng: number };
}

export interface FarmerApplication {
  farmName: string;
  contactName: string;
  email: string;
  phone: string;
  location: string;
  region: 'Pacific West' | 'Midwest Prairies' | 'California Central Valley' | 'Northeast Hudson' | 'Sunbelt South';
  acreage: number;
  primaryCrops: string;
  farmingPractices: string[];
  certifications: string[];
  hasColdStorage: boolean;
  story: string;
  status: 'submitted' | 'under_review' | 'approved';
}
