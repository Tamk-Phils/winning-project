import type { 
  Farm, 
  Product, 
  ServiceProvider, 
  ServiceBooking, 
  Order, 
  PlatformUser 
} from '../types';

const FARMS_KEY = 'agriflow_farms_v3';
const PRODUCTS_KEY = 'agriflow_products_v3';
const PROVIDERS_KEY = 'agriflow_service_providers_v3';
const BOOKINGS_KEY = 'agriflow_service_bookings_v3';
const ORDERS_KEY = 'agriflow_orders_v3';
const USERS_KEY = 'agriflow_platform_users_v3';

// ---------------------------------------------------------------------------
// 1. SEED SUPPLIERS (5 Real Cameroonian Agricultural Cooperatives & Farms)
// ---------------------------------------------------------------------------
export const SEED_FARMS: Farm[] = [
  {
    id: 'farm-mbang-01',
    name: 'Mbang Agro-Ecological Farms',
    tagline: 'Authentic Penja PGI Pepper & Regenerative Plantains',
    location: 'Mbanga & Penja Corridor',
    state: 'Moungo Division',
    coordinates: { lat: 4.5122, lng: 9.6821 },
    region: 'Littoral & Coastal',
    country: 'Cameroon',
    ownerName: 'Mama Nicole Mbang',
    story: 'Founded in 2008 by agricultural cooperative leader Nicole Mbang, our 28-hectare estate sits on fertile volcanic slopes in the Moungo corridor. We preserve ancestral agroforestry, intercropping heirloom plantains with our internationally renowned Penja Protected White Pepper.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    certifications: ['PGI Certified Penja Pepper', 'Fairtrade Africa Certified', 'Organic Rainforest Alliance'],
    practices: ['Regenerative Organic', 'Biodynamic Soil Mulching', 'Pesticide-Free'],
    acreage: 28,
    rating: 4.95,
    reviewCount: 64,
    totalHarvestSoldKg: 84500,
    joinedYear: 2021,
    directPayoutShare: 92,
    phone: '+237 677 34 19 02',
    email: 'nicole@mbang-farms.cm',
    whatsappNumber: '+237677341902',
    privacySettings: {
      showPhonePublicly: true,
      showEmailPublicly: true,
      showExactAddress: true,
      allowWhatsAppDirect: true,
      preferredContactMethod: 'whatsapp'
    },
    verificationBadges: {
      identityVerified: true,
      businessVerified: true,
      exportCertified: true,
      trustedTrader: true
    },
    minaderRegNumber: 'MINADER-COOP-LT-2018-0941'
  },
  {
    id: 'farm-foumbot-02',
    name: 'Foumbot Highland Valley Growers Coop',
    tagline: 'The Breadbasket of Cameroon: Premium Field Vegetables',
    location: 'Foumbot Agricultural Basin',
    state: 'Noun Division',
    coordinates: { lat: 5.5083, lng: 10.6317 },
    region: 'West Highlands (Foumbot/Bafoussam)',
    country: 'Cameroon',
    ownerName: 'Ibrahim Njikam',
    story: 'Spanning across the lush river flats of Foumbot, our 45-member cooperative cultivates high-yield, naturally sun-ripened Roma tomatoes, sweet bell peppers, and crisp highland cabbages using gravity-fed stream irrigation and biological pest deterrents.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    certifications: ['MINADER GAP Certified', 'Highland Bio-Certified'],
    practices: ['Regenerative Organic', 'Non-GMO', 'Crop Rotation'],
    acreage: 65,
    rating: 4.88,
    reviewCount: 92,
    totalHarvestSoldKg: 198000,
    joinedYear: 2020,
    directPayoutShare: 90,
    phone: '+237 699 18 44 20',
    email: 'contact@foumbot-coop.cm',
    whatsappNumber: '+237699184420',
    privacySettings: {
      showPhonePublicly: true,
      showEmailPublicly: true,
      showExactAddress: true,
      allowWhatsAppDirect: true,
      preferredContactMethod: 'whatsapp'
    },
    verificationBadges: {
      identityVerified: true,
      businessVerified: true,
      exportCertified: true,
      trustedTrader: true
    },
    minaderRegNumber: 'MINADER-COOP-OU-2016-1102'
  },
  {
    id: 'farm-buea-03',
    name: 'Buea Mountain Green Orchards',
    tagline: 'Volcanic Soil Butter Avocados & High-Elevation Ginger',
    location: 'Buea Upper Farms, Mount Cameroon',
    state: 'Fako Division',
    coordinates: { lat: 4.1594, lng: 9.2435 },
    region: 'Southwest & Mt. Cameroon',
    country: 'Cameroon',
    ownerName: 'Dr. Roland Ebot',
    story: 'Perched 1,100 meters above sea level on the mineral-dense slopes of Mount Cameroon, our orchards produce naturally creamy Hass avocados, pungent ginger root, and solo papayas bathed in crisp mountain mists without chemical inputs.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80',
    certifications: ['GlobalGAP Export Certified', 'African Organic Standard'],
    practices: ['Regenerative Organic', 'Biodynamic', 'Permaculture Canopy'],
    acreage: 32,
    rating: 4.96,
    reviewCount: 47,
    totalHarvestSoldKg: 62000,
    joinedYear: 2022,
    directPayoutShare: 93,
    phone: '+237 675 22 91 14',
    email: 'roland@buea-greenorchards.com',
    whatsappNumber: '+237675229114',
    privacySettings: {
      showPhonePublicly: true,
      showEmailPublicly: true,
      showExactAddress: true,
      allowWhatsAppDirect: true,
      preferredContactMethod: 'whatsapp'
    },
    verificationBadges: {
      identityVerified: true,
      businessVerified: true,
      exportCertified: true,
      trustedTrader: true
    },
    minaderRegNumber: 'MINADER-PROD-SW-2022-0489'
  },
  {
    id: 'farm-bamenda-04',
    name: 'Bamenda Highland Tubers & Honey Union',
    tagline: 'Certified Oku White Honey & Pure Highland Seed Potatoes',
    location: 'Bamenda & Mount Oku Foothills',
    state: 'Mezam Division',
    coordinates: { lat: 5.9631, lng: 10.1591 },
    region: 'Northwest & Grassfields',
    country: 'Cameroon',
    ownerName: 'Beatrice Che',
    story: 'Led by agronomy champion Beatrice Che, our cooperative brings together 60 high-altitude family plots in the Northwest grassfields. Famous for authentic Oku White Honey harvested from the Kilum-Ijim forest canopy, along with dense Irish potatoes and yams.',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80',
    certifications: ['Oku White Honey PGI Indication', 'Fairtrade Certified'],
    practices: ['Non-GMO', 'Traditional Bee Husbandry', 'Highland Terracing'],
    acreage: 40,
    rating: 4.92,
    reviewCount: 71,
    totalHarvestSoldKg: 114000,
    joinedYear: 2021,
    directPayoutShare: 91,
    phone: '+237 671 90 45 66',
    email: 'beatrice@bamenda-tubers.org',
    whatsappNumber: '+237671904566',
    privacySettings: {
      showPhonePublicly: true,
      showEmailPublicly: true,
      showExactAddress: true,
      allowWhatsAppDirect: true,
      preferredContactMethod: 'whatsapp'
    },
    verificationBadges: {
      identityVerified: true,
      businessVerified: true,
      exportCertified: true,
      trustedTrader: true
    },
    minaderRegNumber: 'MINADER-COOP-NW-2019-3382'
  },
  {
    id: 'farm-garoua-05',
    name: 'Grand-Bayam Grain & Legumes Trading Co.',
    tagline: 'Clean Dry White Maize, Red Sorghum & Golden Soybeans',
    location: 'Garoua & Benoue River Basin',
    state: 'Benoue Division',
    coordinates: { lat: 9.3011, lng: 13.3977 },
    region: 'North & Adamawa',
    country: 'Cameroon',
    ownerName: 'Ousmanou Daouda',
    story: 'Specialized in large-scale commercial grains and legumes across the sunny savannahs of Northern Cameroon. We maintain industrial hermetic silos and solar drying floors to guarantee less than 12% moisture content, free from mold or weevils.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=80',
    certifications: ['National Cereal Quality Standard A', 'Phytosanitary Export Cleared'],
    practices: ['Mechanized Precision Planting', 'Solar Drying', 'Hermetic Storage'],
    acreage: 120,
    rating: 4.87,
    reviewCount: 58,
    totalHarvestSoldKg: 340000,
    joinedYear: 2020,
    directPayoutShare: 89,
    phone: '+237 696 55 12 88',
    email: 'daouda@grandbayam-grains.cm',
    whatsappNumber: '+237696551288',
    privacySettings: {
      showPhonePublicly: true,
      showEmailPublicly: true,
      showExactAddress: true,
      allowWhatsAppDirect: true,
      preferredContactMethod: 'whatsapp'
    },
    verificationBadges: {
      identityVerified: true,
      businessVerified: true,
      exportCertified: true,
      trustedTrader: true
    },
    minaderRegNumber: 'MINADER-CORP-NO-2017-0814'
  }
];

// ---------------------------------------------------------------------------
// 2. SEED PRODUCTS (Real Produce Linked to the 5 Suppliers)
// ---------------------------------------------------------------------------
export const SEED_PRODUCTS: Product[] = [
  // Mbang Agro-Ecological Farms
  {
    id: 'prod-penja-pepper-01',
    name: 'Protected Penja White Pepper (PGI)',
    category: 'herbs',
    variety: 'Piper Nigrum (Volcanic Terroir)',
    farmId: 'farm-mbang-01',
    farmName: 'Mbang Agro-Ecological Farms',
    farmLocation: 'Mbanga & Penja Corridor',
    farmAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    description: 'Renowned worldwide for its refined aroma and volcanic sharpness. Hand-harvested, soaked in natural spring water, and sun-dried to a creamy white pearl.',
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    retailPrice: 22,
    retailPriceXaf: 13500,
    retailUnit: 'kg',
    wholesalePrice: 18,
    wholesalePriceXaf: 11000,
    wholesaleUnit: 'kg bag',
    wholesaleMinOrder: 25,
    stockQuantity: 450,
    stockUnit: 'kg',
    harvestDate: '2026-10-18',
    harvestAgeHours: 48,
    shelfLifeDays: 365,
    coldChainTemp: 'Ambient / Dry (20°C)',
    grade: 'Export Quality',
    certifications: ['PGI Certified (Penja Protected Geographical Indication)', 'Fairtrade Africa Certified'],
    practices: ['Regenerative Organic', 'Pesticide-Free'],
    nutritionalNotes: ['High piperine', 'Digestive stimulant', 'Rich in essential monoterpenes'],
    flavorProfile: 'Woody, camphoraceous, subtle floral heat with prolonged volcanic finish',
    isOrganic: true,
    isRegenerative: true,
    inSeason: true,
    featured: true,
    rating: 4.98,
    reviewsCount: 42,
    originCountry: 'Cameroon',
    exportReady: true
  },
  {
    id: 'prod-plantain-02',
    name: 'Organic Green Cavendish Plantains',
    category: 'fruits',
    variety: 'Big Ebanga Giant French',
    farmId: 'farm-mbang-01',
    farmName: 'Mbang Agro-Ecological Farms',
    farmLocation: 'Mbanga & Penja Corridor',
    farmAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    description: 'Firm, heavy green plantain bunches freshly cut from organic agroforestry rows. Ideal for boiling, crisp chips, or commercial flour processing.',
    imageUrl: 'https://images.unsplash.com/photo-1603052875302-d376b7c0638a?auto=format&fit=crop&w=800&q=80',
    retailPrice: 8,
    retailPriceXaf: 5000,
    retailUnit: 'regime (bunch ~15kg)',
    wholesalePrice: 6,
    wholesalePriceXaf: 3800,
    wholesaleUnit: 'regime',
    wholesaleMinOrder: 30,
    stockQuantity: 320,
    stockUnit: 'bunches',
    harvestDate: '2026-10-25',
    harvestAgeHours: 18,
    shelfLifeDays: 16,
    coldChainTemp: 'Ambient Well-Ventilated (18°C)',
    grade: 'Grade A+ Premium',
    certifications: ['Fairtrade Africa Certified'],
    practices: ['Regenerative Organic', 'Non-GMO'],
    nutritionalNotes: ['Complex resistant starch', 'High potassium', 'Vitamin B6'],
    flavorProfile: 'Savory, starchy, subtle sweet undertones when yellowed',
    isOrganic: true,
    isRegenerative: true,
    inSeason: true,
    featured: true,
    rating: 4.9,
    reviewsCount: 31,
    originCountry: 'Cameroon',
    exportReady: true
  },
  {
    id: 'prod-bird-chili-03',
    name: 'Fresh African Red Bird\'s Eye Chili',
    category: 'vegetables',
    variety: 'Capsicum Frutescens African Piri-Piri',
    farmId: 'farm-mbang-01',
    farmName: 'Mbang Agro-Ecological Farms',
    farmLocation: 'Mbanga & Penja Corridor',
    farmAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    description: 'Vibrant, hand-selected red bird peppers delivering 120,000 Scoville Heat Units. Cleaned, graded, and packed in ventilated crates for local markets and hot sauce manufacturers.',
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
    retailPrice: 5,
    retailPriceXaf: 3200,
    retailUnit: 'kg',
    wholesalePrice: 4,
    wholesalePriceXaf: 2500,
    wholesaleUnit: 'kg basket',
    wholesaleMinOrder: 20,
    stockQuantity: 280,
    stockUnit: 'kg',
    harvestDate: '2026-10-26',
    harvestAgeHours: 12,
    shelfLifeDays: 14,
    coldChainTemp: 'Cool (10-12°C)',
    grade: 'Export Quality',
    certifications: ['Fairtrade Africa Certified'],
    practices: ['Pesticide-Free', 'Biodynamic'],
    nutritionalNotes: ['Capsaicin concentrate', 'Vitamin C powerhouse', 'Antioxidant rich'],
    flavorProfile: 'Fruity, sharp, intense searing heat that peaks cleanly',
    isOrganic: true,
    isRegenerative: true,
    inSeason: true,
    featured: false,
    rating: 4.93,
    reviewsCount: 22,
    originCountry: 'Cameroon',
    exportReady: true
  },

  // Foumbot Highland Valley Coop
  {
    id: 'prod-roma-tomato-04',
    name: 'Roma Plum Field Tomatoes (Grade A+)',
    category: 'vegetables',
    variety: 'Roma VF Highland Vigorous',
    farmId: 'farm-foumbot-02',
    farmName: 'Foumbot Highland Valley Growers Coop',
    farmLocation: 'Foumbot Agricultural Basin',
    farmAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    description: 'Thick-walled, deep red plum tomatoes with low water ratio, high solid pulp, and sweet acidity. Picked at pink-firm turning stage for zero transit damage.',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    retailPrice: 12,
    retailPriceXaf: 7500,
    retailUnit: 'wooden crate (~22kg)',
    wholesalePrice: 9.5,
    wholesalePriceXaf: 6000,
    wholesaleUnit: 'crate (22kg)',
    wholesaleMinOrder: 40,
    stockQuantity: 650,
    stockUnit: 'crates',
    harvestDate: '2026-10-27',
    harvestAgeHours: 8,
    shelfLifeDays: 12,
    coldChainTemp: 'Cool Ventilated (13-15°C)',
    grade: 'Grade A+ Premium',
    certifications: ['MINADER GAP Certified'],
    practices: ['Regenerative Organic', 'Crop Rotation'],
    nutritionalNotes: ['Lycopene rich', 'High Vitamin A & C', 'Low sodium'],
    flavorProfile: 'Rich umami, tangy tomato sweetness, thick hearty flesh',
    isOrganic: true,
    isRegenerative: true,
    inSeason: true,
    featured: true,
    rating: 4.88,
    reviewsCount: 54,
    originCountry: 'Cameroon',
    exportReady: true
  },
  {
    id: 'prod-bell-pepper-05',
    name: 'Sun-Ripened Bell Peppers (Red & Yellow)',
    category: 'vegetables',
    variety: 'California Wonder Highland Strain',
    farmId: 'farm-foumbot-02',
    farmName: 'Foumbot Highland Valley Growers Coop',
    farmLocation: 'Foumbot Agricultural Basin',
    farmAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    description: 'Crisp, sweet, four-lobed bell peppers grown in Foumbot rich loam soils. Hand-harvested with calyx intact for maximum longevity.',
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80',
    retailPrice: 4.5,
    retailPriceXaf: 2800,
    retailUnit: 'kg',
    wholesalePrice: 3.5,
    wholesalePriceXaf: 2200,
    wholesaleUnit: 'kg carton',
    wholesaleMinOrder: 25,
    stockQuantity: 420,
    stockUnit: 'kg',
    harvestDate: '2026-10-26',
    harvestAgeHours: 14,
    shelfLifeDays: 14,
    coldChainTemp: 'Cool (8-10°C)',
    grade: 'Grade A',
    certifications: ['MINADER GAP Certified'],
    practices: ['Regenerative Organic'],
    nutritionalNotes: ['Triple daily Vitamin C', 'Carotenoids', 'Fiber'],
    flavorProfile: 'Crisp watery crunch, honeyed bell sweetness with subtle grassy notes',
    isOrganic: true,
    isRegenerative: true,
    inSeason: true,
    featured: false,
    rating: 4.86,
    reviewsCount: 19,
    originCountry: 'Cameroon',
    exportReady: true
  },
  {
    id: 'prod-carrots-06',
    name: 'Highland Crisp Orange Carrots',
    category: 'vegetables',
    variety: 'Nantes Kuroda Cross',
    farmId: 'farm-foumbot-02',
    farmName: 'Foumbot Highland Valley Growers Coop',
    farmLocation: 'Foumbot Agricultural Basin',
    farmAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    description: 'Tender cylindrical carrots grown in deeply tilled volcanic loam. Sweet, aromatic, and free from woodiness or cracks.',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
    retailPrice: 3.5,
    retailPriceXaf: 2200,
    retailUnit: 'kg',
    wholesalePrice: 2.7,
    wholesalePriceXaf: 1700,
    wholesaleUnit: '50kg jute sack',
    wholesaleMinOrder: 10,
    stockQuantity: 800,
    stockUnit: 'kg',
    harvestDate: '2026-10-25',
    harvestAgeHours: 24,
    shelfLifeDays: 28,
    coldChainTemp: 'Chilled (4-6°C)',
    grade: 'Grade A+ Premium',
    certifications: ['MINADER GAP Certified'],
    practices: ['Pesticide-Free', 'Organic Compost'],
    nutritionalNotes: ['Beta-carotene', 'Vitamin K1', 'Dietary Fiber'],
    flavorProfile: 'Earthy sweetness with snappy crisp bite',
    isOrganic: true,
    isRegenerative: true,
    inSeason: true,
    featured: false,
    rating: 4.89,
    reviewsCount: 27,
    originCountry: 'Cameroon',
    exportReady: true
  },

  // Buea Mountain Green Orchards
  {
    id: 'prod-avocado-07',
    name: 'Volcanic Butter Hass Avocados',
    category: 'fruits',
    variety: 'Mountain Grafted Hass',
    farmId: 'farm-buea-03',
    farmName: 'Buea Mountain Green Orchards',
    farmLocation: 'Buea Upper Farms, Mount Cameroon',
    farmAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    description: 'High oil-content Hass avocados grown on cool slopes at 1,100m. Pebbled skin turns purplish-black when ripe, unveiling golden, silky flesh with nutty flavor.',
    imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
    retailPrice: 6,
    retailPriceXaf: 3700,
    retailUnit: 'kg (~5-6 fruits)',
    wholesalePrice: 4.5,
    wholesalePriceXaf: 2800,
    wholesaleUnit: '10kg carton',
    wholesaleMinOrder: 20,
    stockQuantity: 520,
    stockUnit: 'kg',
    harvestDate: '2026-10-26',
    harvestAgeHours: 16,
    shelfLifeDays: 20,
    coldChainTemp: 'Cool (6-8°C)',
    grade: 'Export Quality',
    certifications: ['GlobalGAP Export Certified'],
    practices: ['Regenerative Organic', 'Permaculture Canopy'],
    nutritionalNotes: ['Oleic fatty acids', 'Vitamin E', 'High potassium'],
    flavorProfile: 'Decadent buttery texture, rich nutty hazelnut undertones',
    isOrganic: true,
    isRegenerative: true,
    inSeason: true,
    featured: true,
    rating: 4.97,
    reviewsCount: 38,
    originCountry: 'Cameroon',
    exportReady: true
  },
  {
    id: 'prod-ginger-08',
    name: 'Volcanic Mountain Organic Ginger Root',
    category: 'herbs',
    variety: 'Zingiber Officinale Mountain Yellow',
    farmId: 'farm-buea-03',
    farmName: 'Buea Mountain Green Orchards',
    farmLocation: 'Buea Upper Farms, Mount Cameroon',
    farmAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    description: 'Plump, aromatic rhizomes harvested by hand from Mount Cameroon volcanic soils. Unwashed or power-washed according to export destination specifications.',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    retailPrice: 5,
    retailPriceXaf: 3200,
    retailUnit: 'kg',
    wholesalePrice: 3.8,
    wholesalePriceXaf: 2400,
    wholesaleUnit: '25kg mesh bag',
    wholesaleMinOrder: 15,
    stockQuantity: 600,
    stockUnit: 'kg',
    harvestDate: '2026-10-24',
    harvestAgeHours: 36,
    shelfLifeDays: 60,
    coldChainTemp: 'Dry Cool (12-14°C)',
    grade: 'Export Quality',
    certifications: ['African Organic Standard'],
    practices: ['Regenerative Organic', 'Biodynamic'],
    nutritionalNotes: ['High gingerol', 'Anti-inflammatory', 'Metabolic booster'],
    flavorProfile: 'Warm, pungent lemon-zest spice with intense aromatic kick',
    isOrganic: true,
    isRegenerative: true,
    inSeason: true,
    featured: false,
    rating: 4.94,
    reviewsCount: 29,
    originCountry: 'Cameroon',
    exportReady: true
  },

  // Bamenda Highland Tubers & Honey Union
  {
    id: 'prod-oku-honey-09',
    name: 'Certified Oku White Honey (PGI)',
    category: 'dairy_honey',
    variety: 'Kilum-Ijim Forest Canopy Flora',
    farmId: 'farm-bamenda-04',
    farmName: 'Bamenda Highland Tubers & Honey Union',
    farmLocation: 'Bamenda & Mount Oku Foothills',
    farmAvatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80',
    description: 'Africa\'s first internationally recognized Protected Geographical Indication honey. Naturally crystalline, pure milky-white texture with floral and menthol undertones.',
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    retailPrice: 15,
    retailPriceXaf: 9500,
    retailUnit: '1kg glass jar',
    wholesalePrice: 12,
    wholesalePriceXaf: 7500,
    wholesaleUnit: 'jar (min 12)',
    wholesaleMinOrder: 12,
    stockQuantity: 340,
    stockUnit: 'jars',
    harvestDate: '2026-10-15',
    harvestAgeHours: 96,
    shelfLifeDays: 730,
    coldChainTemp: 'Ambient Dry (20°C)',
    grade: 'Export Quality',
    certifications: ['PGI Certified (Penja Protected Geographical Indication)', 'Fairtrade Africa Certified'],
    practices: ['Traditional Bee Husbandry', 'Zero Chemical Processing'],
    nutritionalNotes: ['Natural enzymes', 'Raw pollen grains', 'Antimicrobial inhibin'],
    flavorProfile: 'Velvety cream texture, delicate sweet wild clover with cooling citrus-mint finish',
    isOrganic: true,
    isRegenerative: true,
    inSeason: true,
    featured: true,
    rating: 4.99,
    reviewsCount: 68,
    originCountry: 'Cameroon',
    exportReady: true
  },
  {
    id: 'prod-potatoes-10',
    name: 'Highland Irish Seed Potatoes (Red & White)',
    category: 'vegetables',
    variety: 'Cipira & Tubira Certified Seed',
    farmId: 'farm-bamenda-04',
    farmName: 'Bamenda Highland Tubers & Honey Union',
    farmLocation: 'Bamenda & Mount Oku Foothills',
    farmAvatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80',
    description: 'Bacterial-wilt resistant highland potatoes grown at 2,000m. Exceptional for commercial French fry processing, boiling, and seed propagation.',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    retailPrice: 8,
    retailPriceXaf: 5000,
    retailUnit: '10kg net bag',
    wholesalePrice: 6.5,
    wholesalePriceXaf: 4000,
    wholesaleUnit: '50kg sack',
    wholesaleMinOrder: 10,
    stockQuantity: 950,
    stockUnit: 'kg',
    harvestDate: '2026-10-22',
    harvestAgeHours: 40,
    shelfLifeDays: 45,
    coldChainTemp: 'Dark Cool (8-10°C)',
    grade: 'Grade A',
    certifications: ['Fairtrade Certified'],
    practices: ['Highland Terracing', 'Non-GMO'],
    nutritionalNotes: ['Starch energy', 'Potassium', 'Vitamin C'],
    flavorProfile: 'Fluffy, dense, buttery texture when steamed or roasted',
    isOrganic: true,
    isRegenerative: false,
    inSeason: true,
    featured: false,
    rating: 4.88,
    reviewsCount: 34,
    originCountry: 'Cameroon',
    exportReady: true
  },

  // Grand-Bayam Grain & Legumes Trading Co.
  {
    id: 'prod-maize-11',
    name: 'Clean Dry White Maize Grain (Grade 1)',
    category: 'grains',
    variety: 'CMS 8704 Elite Grain',
    farmId: 'farm-garoua-05',
    farmName: 'Grand-Bayam Grain & Legumes Trading Co.',
    farmLocation: 'Garoua & Benoue River Basin',
    farmAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    description: 'Double-screened, destoned white maize grain with moisture calibrated under 11.5%. Flawless for brewery grist, commercial milling, or poultry feed.',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    retailPrice: 6,
    retailPriceXaf: 3800,
    retailUnit: '10kg bag',
    wholesalePrice: 4.8,
    wholesalePriceXaf: 3000,
    wholesaleUnit: '100kg bulk sack',
    wholesaleMinOrder: 10,
    stockQuantity: 4500,
    stockUnit: 'kg',
    harvestDate: '2026-10-18',
    harvestAgeHours: 72,
    shelfLifeDays: 365,
    coldChainTemp: 'Dry Ambient (<12% moisture)',
    grade: 'Grade A+ Premium',
    certifications: ['National Cereal Quality Standard A'],
    practices: ['Mechanized Precision Planting', 'Solar Drying'],
    nutritionalNotes: ['Carbohydrate density', 'Zeaxanthin', 'Thiamine B1'],
    flavorProfile: 'Sweet toasted corn aroma, clean dry grain crunch',
    isOrganic: false,
    isRegenerative: true,
    inSeason: true,
    featured: true,
    rating: 4.87,
    reviewsCount: 45,
    originCountry: 'Cameroon',
    exportReady: true
  },
  {
    id: 'prod-soybeans-12',
    name: 'Golden Non-GMO Soybeans',
    category: 'grains',
    variety: 'TGX 1904 High-Protein Strain',
    farmId: 'farm-garoua-05',
    farmName: 'Grand-Bayam Grain & Legumes Trading Co.',
    farmLocation: 'Garoua & Benoue River Basin',
    farmAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    description: 'Uniform golden spherical soybeans boasting 41% crude protein and 21% oil content. Ideal for soy oil extraction, tofu processing, and livestock feeds.',
    imageUrl: 'https://images.unsplash.com/photo-1599818818545-2129fbba4ca8?auto=format&fit=crop&w=800&q=80',
    retailPrice: 7,
    retailPriceXaf: 4500,
    retailUnit: '10kg sack',
    wholesalePrice: 5.5,
    wholesalePriceXaf: 3500,
    wholesaleUnit: '100kg bag',
    wholesaleMinOrder: 15,
    stockQuantity: 3200,
    stockUnit: 'kg',
    harvestDate: '2026-10-20',
    harvestAgeHours: 60,
    shelfLifeDays: 365,
    coldChainTemp: 'Dry Ambient (<11% moisture)',
    grade: 'Export Quality',
    certifications: ['National Cereal Quality Standard A'],
    practices: ['Non-GMO', 'Crop Rotation'],
    nutritionalNotes: ['41% vegetable protein', 'Omega-3 fatty acids', 'Complete amino profile'],
    flavorProfile: 'Nutty, clean legume flavor with smooth oil pressability',
    isOrganic: false,
    isRegenerative: true,
    inSeason: true,
    featured: false,
    rating: 4.89,
    reviewsCount: 28,
    originCountry: 'Cameroon',
    exportReady: true
  }
];

// ---------------------------------------------------------------------------
// 3. SEED SERVICE RENDERERS (20 Real Specialists across Cameroon)
// ---------------------------------------------------------------------------
export const SEED_SERVICE_PROVIDERS: ServiceProvider[] = [
  {
    id: 'sp-01',
    fullName: 'Dr. Jean-Paul Mvogo',
    businessName: 'AgroBio Soil Diagnostics Lab',
    title: 'Senior Agronomist & Soil Health Consultant',
    category: 'agronomy',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    rating: 4.95,
    reviewCount: 44,
    startingPriceXaf: 35000,
    startingPriceUsd: 58,
    location: 'Bafoussam & West Region',
    region: 'West Highlands (Foumbot/Bafoussam)',
    country: 'Cameroon',
    bio: 'Over 14 years advising agricultural cooperatives and commercial estates. Specializes in soil chemistry mapping, organic remediation plans, and crop yield enhancement without synthetic chemicals.',
    experienceYears: 14,
    verified: true,
    licensedProfessional: true,
    insuranceCovered: true,
    phone: '+237 677 82 19 04',
    whatsappNumber: '+237677821904',
    email: 'jp.mvogo@agrobio-cm.com',
    certifications: ['CIRAD Tropical Agronomy Fellow', 'MINADER Certified Soil Analyst', 'IFOAM Organic Assessor'],
    equipmentList: ['Digital Field Spectrometer', 'LaMotte Soil NPK Testing Kit', 'GPS Soil Core Sampler'],
    completedJobsCount: 142,
    responseTimeMinutes: 20,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    featured: true,
    services: [
      {
        id: 'srv-101',
        title: 'Full Farm Soil Chemistry & NPK Diagnostic',
        description: 'Comprehensive core soil sampling, pH, nitrogen, phosphorus, potassium, organic matter ratio, and tailored organic remediation roadmap.',
        priceXaf: 35000,
        priceUsd: 58,
        unit: 'per 5-hectare block',
        estimatedDuration: '4 hours field visit + lab report',
        includesEquipment: true,
      },
      {
        id: 'srv-102',
        title: 'Organic Pest & Disease Management Plan',
        description: 'In-field pathology inspection, biological control prescription (neem, compost tea, companion planting), and preventive spray calendar.',
        priceXaf: 45000,
        priceUsd: 75,
        unit: 'per consultation',
        estimatedDuration: 'Half-day on farm',
        includesEquipment: true,
      }
    ]
  },
  {
    id: 'sp-02',
    fullName: 'Jean-Luc Ngassa',
    businessName: 'Highland Heavy Agro-Mechanization',
    title: 'Master Tractor Operator & Tillage Contractor',
    category: 'machinery',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
    rating: 4.88,
    reviewCount: 56,
    startingPriceXaf: 45000,
    startingPriceUsd: 75,
    location: 'Foumbot & Mbouda Basin',
    region: 'West Highlands (Foumbot/Bafoussam)',
    country: 'Cameroon',
    bio: 'Heavy tractor fleet owner providing John Deere 75HP-90HP tractors with disc ploughs, rotavators, and bed-formers. Precision leveling and deep furrowing for commercial plantains, maize, and vegetables.',
    experienceYears: 11,
    verified: true,
    licensedProfessional: true,
    insuranceCovered: true,
    phone: '+237 699 44 23 11',
    whatsappNumber: '+237699442311',
    email: 'ngassa.tillage@gmail.com',
    certifications: ['Certified Heavy Machinery Operator Class B', 'MINADER Mechanization Partner'],
    equipmentList: ['John Deere 5075E 4WD Tractor', '4-Disc Heavy Duty Plough', 'Baldan Rotary Tiller 2.2m'],
    completedJobsCount: 215,
    responseTimeMinutes: 30,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    featured: true,
    services: [
      {
        id: 'srv-201',
        title: 'Deep Disc Ploughing & Soil Inversion',
        description: 'Complete mechanical soil turning down to 35cm depth, breaking hardpan layers to allow deep root penetration.',
        priceXaf: 45000,
        priceUsd: 75,
        unit: 'per hectare',
        estimatedDuration: '2.5 hours per hectare',
        includesEquipment: true,
      },
      {
        id: 'srv-202',
        title: 'Rotary Harrowing & Fine Seedbed Preparation',
        description: 'Pulverizes heavy soil clods into fine tilth, creating optimum aeration and moisture retention for tomato and vegetable seedlings.',
        priceXaf: 35000,
        priceUsd: 58,
        unit: 'per hectare',
        estimatedDuration: '2 hours per hectare',
        includesEquipment: true,
      }
    ]
  },
  {
    id: 'sp-03',
    fullName: 'Aissatou Bello',
    businessName: 'Sahelian AeroAgri Drone Systems',
    title: 'Certified Drone Pilot & Precision Agronomist',
    category: 'drone_tech',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
    rating: 4.97,
    reviewCount: 39,
    startingPriceXaf: 28000,
    startingPriceUsd: 46,
    location: 'Garoua, Maroua & North Corridor',
    region: 'North & Adamawa',
    country: 'Cameroon',
    bio: 'Specialist in aerial crop health monitoring and precision spraying using DJI Agras T40 and Phantom 4 Multispectral drones. Reduces chemical usage by 40% and treats 40 hectares per single working day.',
    experienceYears: 6,
    verified: true,
    licensedProfessional: true,
    insuranceCovered: true,
    phone: '+237 698 12 77 03',
    whatsappNumber: '+237698127703',
    email: 'aissatou.drones@sahelaero.cm',
    certifications: ['Civil Aviation Authority Certified Drone Pilot', 'Precision Ag Remote Sensing Specialist'],
    equipmentList: ['2x DJI Agras T40 40L Spray Drones', 'DJI Mavic 3 Multispectral', 'High-Output RTK Mobile Base Station'],
    completedJobsCount: 88,
    responseTimeMinutes: 15,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    featured: true,
    services: [
      {
        id: 'srv-301',
        title: 'Ultra-Low-Volume (ULV) Organic Foliar Spraying',
        description: 'Drone-driven micronized mist application of bio-fungicides or liquid seaweed extracts. Covers entire canopy tops and undersides.',
        priceXaf: 28000,
        priceUsd: 46,
        unit: 'per hectare',
        estimatedDuration: '15 mins flight per hectare',
        includesEquipment: true,
      },
      {
        id: 'srv-302',
        title: 'Multispectral NDVI Crop Vigor & Water Stress Survey',
        description: 'Generates geo-tagged NDVI vegetation index maps pin-pointing chlorosis, drought stress, and pest hot-spots.',
        priceXaf: 22000,
        priceUsd: 36,
        unit: 'per 10-hectare block',
        estimatedDuration: 'Same-day cloud orthomosaic delivery',
        includesEquipment: true,
      }
    ]
  },
  {
    id: 'sp-04',
    fullName: 'Eng. Samuel Ndive',
    businessName: 'Equatorial Solar & Drip Hydraulics',
    title: 'Irrigation Engineer & Solar Pumping Specialist',
    category: 'irrigation_solar',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=1200&q=80',
    rating: 4.91,
    reviewCount: 31,
    startingPriceXaf: 50000,
    startingPriceUsd: 83,
    location: 'Buea, Limbe & Tiko Plain',
    region: 'Southwest & Mt. Cameroon',
    country: 'Cameroon',
    bio: 'Designs and commissions gravity-fed and solar submersible drip irrigation arrays. Enabling smallholders to sustain year-round market harvests even during the dry season.',
    experienceYears: 10,
    verified: true,
    licensedProfessional: true,
    insuranceCovered: true,
    phone: '+237 674 88 15 90',
    whatsappNumber: '+237674881590',
    email: 'samuel@equatorialsun.cm',
    certifications: ['Chartered Water Resources Engineer', 'Lorentz Solar Pump Certified Installer'],
    equipmentList: ['Hydrostatic Pressure Testing Rig', 'Pipe Fusion Welding Kit', 'Solar Irradiance Flow Meters'],
    completedJobsCount: 76,
    responseTimeMinutes: 45,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    featured: true,
    services: [
      {
        id: 'srv-401',
        title: 'Drip Irrigation Field Engineering & Turnkey Installation',
        description: 'Sizing mainline PVC, sub-laterals, disc filtration, pressure compensation drip lines, and venturi fertilizer injectors.',
        priceXaf: 50000,
        priceUsd: 83,
        unit: 'per hectare layout',
        estimatedDuration: '1-2 days on site',
        includesEquipment: true,
      }
    ]
  },
  {
    id: 'sp-05',
    fullName: 'Mamadou Touré',
    businessName: 'Atlantic Cold-Chain Transit Lines',
    title: 'Refrigerated Fleet Manager & Cold Storage Logistics',
    category: 'cold_chain',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    rating: 4.89,
    reviewCount: 62,
    startingPriceXaf: 75000,
    startingPriceUsd: 125,
    location: 'Douala Port to Yaoundé Corridor',
    region: 'Littoral & Coastal',
    country: 'Cameroon',
    bio: 'Operating 5-ton and 10-ton Thermo King refrigerated trucks with real-time IoT temperature logging. Prevents spoilages and maintains 4°C - 12°C cool chain from farmgate to supermarkets.',
    experienceYears: 12,
    verified: true,
    licensedProfessional: true,
    insuranceCovered: true,
    phone: '+237 694 03 66 12',
    whatsappNumber: '+237694036612',
    email: 'transit@atlanticcold.cm',
    certifications: ['HACCP Food Safety Cold-Chain Certified', 'CEMAC Cross-Border Hauler License'],
    equipmentList: ['3x Isuzu 5-Ton Chilled Trucks (+2°C to +15°C)', 'Real-time GPS/IoT Thermal Loggers'],
    completedJobsCount: 310,
    responseTimeMinutes: 25,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    featured: true,
    services: [
      {
        id: 'srv-501',
        title: 'Chilled Inter-City Produce Transit (Douala / Yaoundé)',
        description: 'Dedicated temperature-controlled transit for delicate berries, green plantains, avocados, and export herbs.',
        priceXaf: 75000,
        priceUsd: 125,
        unit: 'per transit run (up to 3 tons)',
        estimatedDuration: 'Same-day express transit',
        includesEquipment: true,
      }
    ]
  },
  {
    id: 'sp-06',
    fullName: 'Clarisse Kengne',
    businessName: 'Bamboutos Export Grading & Phytosanitary Packhouse',
    title: 'Post-Harvest Technologist & Packhouse Supervisor',
    category: 'certification',
    avatarUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
    rating: 4.93,
    reviewCount: 28,
    startingPriceXaf: 30000,
    startingPriceUsd: 50,
    location: 'Mbouda & Bafoussam',
    region: 'West Highlands (Foumbot/Bafoussam)',
    country: 'Cameroon',
    bio: 'Assists export-oriented producers with washing, ozone sanitization, optical weight grading, and phytosanitary documentation for regional and international flights.',
    experienceYears: 8,
    verified: true,
    licensedProfessional: true,
    insuranceCovered: true,
    phone: '+237 671 22 90 33',
    whatsappNumber: '+237671229033',
    email: 'clarisse@bamboutos-packhouse.cm',
    certifications: ['GlobalGAP Lead Auditor', 'MINADER Phytosanitary Inspector'],
    equipmentList: ['Roller Sizer Grading Table', 'Digital Calipers & Refractometers', 'Ozone Water Dip Tank'],
    completedJobsCount: 94,
    responseTimeMinutes: 30,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    featured: false,
    services: [
      {
        id: 'srv-601',
        title: 'Export Batch Grading, Sorting & Phytosanitary Audit',
        description: 'Quality grading to European & CEMAC specifications, fruit blemish culling, and issuance of certified export audit sheets.',
        priceXaf: 30000,
        priceUsd: 50,
        unit: 'per 2-ton batch',
        estimatedDuration: '1 working day',
        includesEquipment: true,
      }
    ]
  },
  {
    id: 'sp-07',
    fullName: 'Pa Ephraim Tabi',
    businessName: 'Manyu Heritage Tree Canopy & Grafting Brigade',
    title: 'Master Cocoa & Fruit Arborist',
    category: 'harvest_labor',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
    rating: 4.96,
    reviewCount: 51,
    startingPriceXaf: 25000,
    startingPriceUsd: 41,
    location: 'Mamfe, Kumba & Manyu',
    region: 'Southwest & Mt. Cameroon',
    country: 'Cameroon',
    bio: '30 years mastering high-canopy pruning, sanitary clearing of black pod diseased branches, and top-grafting unproductive older cocoa and avocado trees with elite clones.',
    experienceYears: 30,
    verified: true,
    licensedProfessional: true,
    insuranceCovered: true,
    phone: '+237 678 30 11 99',
    whatsappNumber: '+237678301199',
    email: 'tabi.canopy@gmail.com',
    certifications: ['ONCC Certified Cocoa Master Artisan'],
    equipmentList: ['Telescopic Stihl Pole Pruners', 'Sterilized Grafting Knives', 'Wound Sealing Biopaste'],
    completedJobsCount: 168,
    responseTimeMinutes: 40,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    featured: false,
    services: [
      {
        id: 'srv-701',
        title: 'Orchard & Cocoa High-Canopy Sanitary Pruning',
        description: 'Removal of mistletoes, dead branches, and excessive shade canopy to maximize sunlight and increase flowering up to 35%.',
        priceXaf: 25000,
        priceUsd: 41,
        unit: 'per hectare',
        estimatedDuration: '1 full day on farm',
        includesEquipment: true,
      }
    ]
  },
  {
    id: 'sp-08',
    fullName: 'Dr. Nadine Eyenga',
    businessName: 'Centre BioTech Nursery & Hydroponic Solutions',
    title: 'Horticultural Scientist & Propagation Director',
    category: 'agronomy',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    rating: 4.92,
    reviewCount: 35,
    startingPriceXaf: 40000,
    startingPriceUsd: 66,
    location: 'Yaoundé, Obala & Sa\'a',
    region: 'Centre & Yaoundé',
    country: 'Cameroon',
    bio: 'Provides tissue-culture hardened plantain suckers, greenhouse nursery design, nutrient solution balancing for hydroponics, and disease-free vegetable starter plugs.',
    experienceYears: 9,
    verified: true,
    licensedProfessional: true,
    insuranceCovered: true,
    phone: '+237 691 40 88 55',
    whatsappNumber: '+237691408855',
    email: 'nadine@centre-biotech.cm',
    certifications: ['PhD in Plant Biotechnology', 'MINADER Nursery Registry Officer'],
    equipmentList: ['In-line EC & pH Controllers', 'Mist Propagation Enclosure', 'Microscopic Spore Trap'],
    completedJobsCount: 82,
    responseTimeMinutes: 20,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    featured: false,
    services: [
      {
        id: 'srv-801',
        title: 'Greenhouse & High-Tunnel Production Audit',
        description: 'Calibration of ventilation, temperature thresholds, drip fertigation timing, and bio-protection scouting.',
        priceXaf: 40000,
        priceUsd: 66,
        unit: 'per audit visit',
        estimatedDuration: 'Half-day intensive consultation',
        includesEquipment: true,
      }
    ]
  },
  {
    id: 'sp-09',
    fullName: 'Gervais Kamdem',
    businessName: 'Mbam Mechanical Harvesters & Chipper Brigade',
    title: 'Tuber Harvesting & Chipping Contractor',
    category: 'machinery',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80',
    rating: 4.86,
    reviewCount: 39,
    startingPriceXaf: 38000,
    startingPriceUsd: 63,
    location: 'Bafia & Mbam Corridor',
    region: 'Centre & Yaoundé',
    country: 'Cameroon',
    bio: 'Contractor operating mobile diesel cassava chipping machines and tractor-mounted tuber diggers. Processes up to 10 tons of fresh roots daily right at the farm gate.',
    experienceYears: 7,
    verified: true,
    licensedProfessional: true,
    insuranceCovered: true,
    phone: '+237 690 15 24 78',
    whatsappNumber: '+237690152478',
    email: 'kamdem.mbam@gmail.com',
    certifications: ['Agricultural Machinery Tech Diploma'],
    equipmentList: ['Mobile 12HP Diesel Root Chipper', 'Tractor 2-Row Potato & Cassava Lifter'],
    completedJobsCount: 112,
    responseTimeMinutes: 35,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    featured: false,
    services: [
      {
        id: 'srv-901',
        title: 'On-Farm Mobile Mechanical Cassava Chipping',
        description: 'Immediate slicing of fresh cassava roots into 3mm chips to enable fast 24-hour solar drying and stop starch fermentation.',
        priceXaf: 38000,
        priceUsd: 63,
        unit: 'per 5 tons roots',
        estimatedDuration: '1 working day',
        includesEquipment: true,
      }
    ]
  },
  {
    id: 'sp-10',
    fullName: 'Suh Emmanuel',
    businessName: 'Ndop Valley Rice & Grain Mechanization Co.',
    title: 'Combine Harvester & Laser Leveling Specialist',
    category: 'machinery',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    reviewCount: 48,
    startingPriceXaf: 60000,
    startingPriceUsd: 100,
    location: 'Ndop Plain & Bamunka',
    region: 'Northwest & Grassfields',
    country: 'Cameroon',
    bio: 'Equipped with tracked mini-combine harvesters suitable for wet rice paddies and laser land-levelers. Drastically reduces field grain shattering and cuts harvesting time by 90%.',
    experienceYears: 13,
    verified: true,
    licensedProfessional: true,
    insuranceCovered: true,
    phone: '+237 673 88 41 20',
    whatsappNumber: '+237673884120',
    email: 'suh.ndop@rice-coop.cm',
    certifications: ['Certified Tracked Machine Operator', 'UNIDO Rice Value Chain Trainer'],
    equipmentList: ['Yanmar Tracked Mini Combine Harvester', 'Spectra Precision Laser Leveler'],
    completedJobsCount: 175,
    responseTimeMinutes: 30,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    featured: false,
    services: [
      {
        id: 'srv-1001',
        title: 'Mechanical Rice & Small Grain Combine Harvesting',
        description: 'Simultaneous reaping, threshing, de-chaffing, and bagging of paddy rice with less than 2% grain loss.',
        priceXaf: 60000,
        priceUsd: 100,
        unit: 'per hectare',
        estimatedDuration: '3 hours per hectare',
        includesEquipment: true,
      }
    ]
  },
  {
    id: 'sp-11',
    fullName: 'Félicité Nkoa',
    businessName: 'Sanaga Bio-Compost & Microbial Inoculants',
    title: 'Bio-Fertilization Chemist & Soil Microbiome Lead',
    category: 'soil_testing',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80',
    rating: 4.94,
    reviewCount: 26,
    startingPriceXaf: 32000,
    startingPriceUsd: 53,
    location: 'Nanga Eboko & Yaoundé',
    region: 'Centre & Yaoundé',
    country: 'Cameroon',
    bio: 'Custom brewing of indigenous microorganism (IMO) teas and thermal composting. Restores depleted soil biology and mycorrhizal networks on large commercial plantations.',
    experienceYears: 8,
    verified: true,
    licensedProfessional: true,
    insuranceCovered: true,
    phone: '+237 695 44 91 00',
    whatsappNumber: '+237695449100',
    email: 'felicite@sanagabiocompost.cm',
    certifications: ['Soil Food Web Certified Biologist', 'Organic Inputs Assessor'],
    equipmentList: ['1,000L Aerated Compost Tea Brewer', 'Compound Light Microscope with Oil Immersion'],
    completedJobsCount: 63,
    responseTimeMinutes: 20,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    featured: false,
    services: [
      {
        id: 'srv-1101',
        title: 'Microbial Compost Tea Brewing & Soil Inoculation',
        description: 'On-farm biological liquid brew rich in aerobic bacteria, beneficial fungi, and protozoa to unlock bound soil phosphorus.',
        priceXaf: 32000,
        priceUsd: 53,
        unit: 'per 500L application',
        estimatedDuration: '24-hour brew + application',
        includesEquipment: true,
      }
    ]
  },
  {
    id: 'sp-12',
    fullName: 'Bouba Haman',
    businessName: 'Adamawa Pasture & Solar Electric Fencing',
    title: 'Silage Contractor & Pasture Range Architect',
    category: 'veterinary',
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=80',
    rating: 4.88,
    reviewCount: 41,
    startingPriceXaf: 48000,
    startingPriceUsd: 80,
    location: 'Ngaoundéré & Adamawa Plateaus',
    region: 'North & Adamawa',
    country: 'Cameroon',
    bio: 'Helps livestock and dairy farms establish high-nutrition Brachiaria grass pastures, solar electric predator fencing, and dry-season pit silage packing.',
    experienceYears: 15,
    verified: true,
    licensedProfessional: true,
    insuranceCovered: true,
    phone: '+237 699 80 14 33',
    whatsappNumber: '+237699801433',
    email: 'bouba.pastures@gmail.com',
    certifications: ['Certified Livestock Extension Specialist', 'Solar Fencing Master Installer'],
    equipmentList: ['Heavy Forage Chopper & Blower', 'Silage Trench Compaction Roller', 'Solar Fence Energizers'],
    completedJobsCount: 120,
    responseTimeMinutes: 30,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    featured: false,
    services: [
      {
        id: 'srv-1201',
        title: 'Forage Silage Harvesting & Pit Sealing',
        description: 'High-speed cutting and packing of forage maize/sorghum into airtight silage bunkers with lactic acid inoculants.',
        priceXaf: 48000,
        priceUsd: 80,
        unit: 'per 10-ton bunker',
        estimatedDuration: '1 full day',
        includesEquipment: true,
      }
    ]
  },
  {
    id: 'sp-13',
    fullName: 'Patrick Enow',
    businessName: 'Moungo Elite Orchard Care & Tree Grafting',
    title: 'Commercial Tree Grafting & Canopy Spraying Specialist',
    category: 'harvest_labor',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1603052875302-d376b7c0638a?auto=format&fit=crop&w=1200&q=80',
    rating: 4.93,
    reviewCount: 37,
    startingPriceXaf: 28000,
    startingPriceUsd: 46,
    location: 'Nkongsamba, Melong & Loum',
    region: 'Littoral & Coastal',
    country: 'Cameroon',
    bio: 'Precision side-veneer and cleft grafting for Hass avocados, citrus, and sweet mango trees. Over 96% success rate on rootstock take.',
    experienceYears: 12,
    verified: true,
    licensedProfessional: true,
    insuranceCovered: true,
    phone: '+237 675 44 19 88',
    whatsappNumber: '+237675441988',
    email: 'enow.grafting@moungo.cm',
    certifications: ['Certified Horticulturist MINADER'],
    equipmentList: ['Swiss Grafting Knives', 'Parafilm Degradable Tape', 'Motorized Mist Blowers'],
    completedJobsCount: 154,
    responseTimeMinutes: 25,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    featured: false,
    services: [
      {
        id: 'srv-1301',
        title: 'Elite Fruit Tree Top-Grafting (Avocado & Citrus)',
        description: 'Grafting high-value scion wood onto established wild rootstocks to achieve commercial fruiting in under 24 months.',
        priceXaf: 28000,
        priceUsd: 46,
        unit: 'per 100 trees grafted',
        estimatedDuration: '1 working day',
        includesEquipment: true,
      }
    ]
  },
  {
    id: 'sp-14',
    fullName: 'Marie-Claire Fon',
    businessName: 'Kumbo Organic Seedling & Rootstock Nursery',
    title: 'Certified Nursery Propagator & Seed Technologist',
    category: 'certification',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=1200&q=80',
    rating: 4.96,
    reviewCount: 49,
    startingPriceXaf: 20000,
    startingPriceUsd: 33,
    location: 'Kumbo & Donga-Mantung',
    region: 'Northwest & Grassfields',
    country: 'Cameroon',
    bio: 'Supplying disease-free potted vegetable seedlings (leek, cabbage, tomato, pepper) and certified organic seed tubers. Guarantees 98% germination and vigorous field establishment.',
    experienceYears: 10,
    verified: true,
    licensedProfessional: true,
    insuranceCovered: true,
    phone: '+237 671 00 82 45',
    whatsappNumber: '+237671008245',
    email: 'marieclaire@kumbo-nursery.cm',
    certifications: ['National Seed Service Certified Nursery Producer'],
    equipmentList: ['Shade Nets 50% UV Block', 'Peat Moss Plug Trays', 'Controlled Germination Chamber'],
    completedJobsCount: 138,
    responseTimeMinutes: 20,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    featured: false,
    services: [
      {
        id: 'srv-1401',
        title: 'Pre-Germinated Seedling Plug Trays Preparation',
        description: 'Hardened, disease-inoculated seedling plugs delivered ready for field transplanting, avoiding critical nursery mortality.',
        priceXaf: 20000,
        priceUsd: 33,
        unit: 'per 1,000 seedling plugs',
        estimatedDuration: 'Delivered in trays',
        includesEquipment: true,
      }
    ]
  },
  {
    id: 'sp-15',
    fullName: 'Alain Mbida',
    businessName: 'Nyong & So\'o Oil Palm Harvesters Collective',
    title: 'High-Canopy Palm Harvester Crew Lead',
    category: 'harvest_labor',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    rating: 4.87,
    reviewCount: 55,
    startingPriceXaf: 30000,
    startingPriceUsd: 50,
    location: 'Mbalmayo & Ebolowa',
    region: 'Centre & Yaoundé',
    country: 'Cameroon',
    bio: 'Professional harvesting brigade specializing in tall Tenera oil palms. Equipped with motorized sickle cutters and mechanical winches for zero fruit bruising and maximum extraction.',
    experienceYears: 14,
    verified: true,
    licensedProfessional: true,
    insuranceCovered: true,
    phone: '+237 696 22 18 90',
    whatsappNumber: '+237696221890',
    email: 'alain.palm@gmail.com',
    certifications: ['Certified Plantation Labor Foreman'],
    equipmentList: ['Motorized Telescopic Sickles (up to 18m)', 'Rubber-Tired Fruit Wheelbarrows'],
    completedJobsCount: 195,
    responseTimeMinutes: 35,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    featured: false,
    services: [
      {
        id: 'srv-1501',
        title: 'Complete Palm Harvest & Fruit Bunch Gathering',
        description: 'Professional high-canopy cutting, bunch collection, and delivery to central field roadside collection bays.',
        priceXaf: 30000,
        priceUsd: 50,
        unit: 'per hectare',
        estimatedDuration: '1 full working day',
        includesEquipment: true,
      }
    ]
  },
  {
    id: 'sp-16',
    fullName: 'Dr. Christian Wamba',
    businessName: 'Menoua Bio-Protection & Mycotoxin Testing Lab',
    title: 'Plant Pathologist & Chemical Residue Assayer',
    category: 'soil_testing',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    rating: 4.95,
    reviewCount: 33,
    startingPriceXaf: 45000,
    startingPriceUsd: 75,
    location: 'Dschang & West Region',
    region: 'West Highlands (Foumbot/Bafoussam)',
    country: 'Cameroon',
    bio: 'Conducts rapid HPLC and lateral flow assays for aflatoxins, ochratoxins, and pesticide residues in maize, coffee, and cocoa prior to shipment.',
    experienceYears: 11,
    verified: true,
    licensedProfessional: true,
    insuranceCovered: true,
    phone: '+237 679 11 34 02',
    whatsappNumber: '+237679113402',
    email: 'wamba@menoualab.cm',
    certifications: ['PhD in Agricultural Microbiology', 'ISO 17025 Laboratory Assessor'],
    equipmentList: ['Portable Fluorometer for Aflatoxin B1', 'Moisture Titration Apparatus'],
    completedJobsCount: 89,
    responseTimeMinutes: 15,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    featured: false,
    services: [
      {
        id: 'srv-1601',
        title: 'Rapid Grain Aflatoxin & Chemical Residue Screening',
        description: 'Quantitative test giving parts-per-billion (ppb) aflatoxin concentration within 45 minutes for export containers.',
        priceXaf: 45000,
        priceUsd: 75,
        unit: 'per composite sample',
        estimatedDuration: 'Same-day certificate',
        includesEquipment: true,
      }
    ]
  },
  {
    id: 'sp-17',
    fullName: 'Ibrahim Sali',
    businessName: 'Far-North Deep Borehole & Solar Submersible Drills',
    title: 'Hydrogeologist & Deep Well Contractor',
    category: 'irrigation_solar',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    rating: 4.91,
    reviewCount: 42,
    startingPriceXaf: 95000,
    startingPriceUsd: 158,
    location: 'Kousseri, Yagoua & Far North',
    region: 'North & Adamawa',
    country: 'Cameroon',
    bio: 'Drills deep productive agricultural wells (down to 80m) in the semi-arid northern zone and equips them with continuous solar DC submersible pumps.',
    experienceYears: 16,
    verified: true,
    licensedProfessional: true,
    insuranceCovered: true,
    phone: '+237 697 33 22 10',
    whatsappNumber: '+237697332210',
    email: 'sali.water@farnorth.cm',
    certifications: ['National Hydraulic Contractor Grade A'],
    equipmentList: ['Truck-Mounted Rotary Percussion Drill Rig', 'Geophysical Resistivity Meter'],
    completedJobsCount: 110,
    responseTimeMinutes: 30,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    featured: false,
    services: [
      {
        id: 'srv-1701',
        title: 'Geophysical Ground Water Survey & Aquifer Profiling',
        description: 'Electrical resistivity soundings to pinpoint deepest, cleanest freshwater veins prior to expensive drilling.',
        priceXaf: 95000,
        priceUsd: 158,
        unit: 'per site survey',
        estimatedDuration: '1 full day on site',
        includesEquipment: true,
      }
    ]
  },
  {
    id: 'sp-18',
    fullName: 'Bernadette Atangana',
    businessName: 'Lekié Plantain Sanitation & De-Suckering Squad',
    title: 'Field Brigade Leader & Sanitation Specialist',
    category: 'harvest_labor',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=80',
    rating: 4.89,
    reviewCount: 36,
    startingPriceXaf: 22000,
    startingPriceUsd: 36,
    location: 'Monatélé, Sa\'a & Obala',
    region: 'Centre & Yaoundé',
    country: 'Cameroon',
    bio: 'Leads a coordinated 12-woman brigade trained in banana weevil trap setting, sanitary de-leafing of black sigatoka leaves, and optimal sucker thinning.',
    experienceYears: 9,
    verified: true,
    licensedProfessional: true,
    insuranceCovered: true,
    phone: '+237 693 88 19 44',
    whatsappNumber: '+237693881944',
    email: 'bernadette.lekie@gmail.com',
    certifications: ['MINADER Community Ag Extension Facilitator'],
    equipmentList: ['Sterilized De-suckering Chisels', 'Organic Pheromone Weevil Traps'],
    completedJobsCount: 130,
    responseTimeMinutes: 20,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    featured: false,
    services: [
      {
        id: 'srv-1801',
        title: 'Plantain De-Suckering & Plantation Sanitation',
        description: 'Systematic thinning to mother-daughter-granddaughter stems, removal of fungal diseased leaves, and trench weevil trapping.',
        priceXaf: 22000,
        priceUsd: 36,
        unit: 'per hectare',
        estimatedDuration: '1 working day (brigade of 4)',
        includesEquipment: true,
      }
    ]
  },
  {
    id: 'sp-19',
    fullName: 'Georges Fomekong',
    businessName: 'Haute-Sanaga Drainage & Wetland Engineers',
    title: 'Agro-Hydrology Contractor',
    category: 'machinery',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    rating: 4.87,
    reviewCount: 29,
    startingPriceXaf: 55000,
    startingPriceUsd: 91,
    location: 'Nkoteng & Mbandjock',
    region: 'Centre & Yaoundé',
    country: 'Cameroon',
    bio: 'Designs and excavates perimeter drainage canals and flood-retention basins for vegetable bottomlands prone to waterlogging during heavy tropical rains.',
    experienceYears: 13,
    verified: true,
    licensedProfessional: true,
    insuranceCovered: true,
    phone: '+237 694 55 12 01',
    whatsappNumber: '+237694551201',
    email: 'georges.hydrology@gmail.com',
    certifications: ['Civil & Environmental Hydraulics Engineer'],
    equipmentList: ['Caterpillar 320 Track Excavator', 'Optical Dumpy Survey Level'],
    completedJobsCount: 77,
    responseTimeMinutes: 40,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    featured: false,
    services: [
      {
        id: 'srv-1901',
        title: 'Perimeter Drainage Ditch Excavation & Soil Contouring',
        description: 'Rapid excavation of anti-flood trenches to redirect excess surface runoff and keep root zones aerated.',
        priceXaf: 55000,
        priceUsd: 91,
        unit: 'per 100 meters linear ditch',
        estimatedDuration: 'Half-day machine run',
        includesEquipment: true,
      }
    ]
  },
  {
    id: 'sp-20',
    fullName: 'Hassana Djibrilla',
    businessName: 'Logone Hermetic Grain Silo & Bio-Fumigation',
    title: 'Post-Harvest Grain Preservation Specialist',
    category: 'certification',
    avatarUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1200&q=80',
    rating: 4.95,
    reviewCount: 52,
    startingPriceXaf: 35000,
    startingPriceUsd: 58,
    location: 'Yagoua, Kousseri & Lake Chad Basin',
    region: 'North & Adamawa',
    country: 'Cameroon',
    bio: 'Specialist in chemical-free hermetic grain storage using Purdue Improved Crop Storage (PICS) protocols and phosphine gas bio-monitoring for large commercial warehouses.',
    experienceYears: 12,
    verified: true,
    licensedProfessional: true,
    insuranceCovered: true,
    phone: '+237 698 44 20 18',
    whatsappNumber: '+237698442018',
    email: 'hassana.siloprotect@gmail.com',
    certifications: ['FAO Post-Harvest Grain Management Certificate'],
    equipmentList: ['Gas Leak Detector & Concentration Meters', 'Grain Moisture Sampler', 'Hermetic Sealing Clamps'],
    completedJobsCount: 164,
    responseTimeMinutes: 25,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    featured: true,
    services: [
      {
        id: 'srv-2001',
        title: 'Silo Hermetic Sealing & Insect Eradication Audit',
        description: 'Testing oxygen levels, verifying hermetic seals, and applying botanical deterrents to safeguard dry maize and sorghum for 12+ months.',
        priceXaf: 35000,
        priceUsd: 58,
        unit: 'per 50-ton silo',
        estimatedDuration: '1 working day inspection',
        includesEquipment: true,
      }
    ]
  }
];

// ---------------------------------------------------------------------------
// 4. SEED ORDERS & SERVICE BOOKINGS (Initial Platform Transactions)
// ---------------------------------------------------------------------------
export const SEED_ORDERS: Order[] = [
  {
    id: 'ord-2026-1001',
    customerName: 'Douala Fresh Basket Supermarkets',
    customerEmail: 'procurement@doualafresh.cm',
    customerPhone: '+237 670 11 22 33',
    buyerType: 'wholesale_distributor',
    shippingAddress: 'Akwa Commercial District, Douala, Littoral',
    deliverySlot: 'Morning (08:00 - 11:00)',
    deliveryMethod: 'cold_chain_express',
    subtotal: 154000,
    deliveryFee: 15000,
    tipAmount: 0,
    tipPercentage: 0,
    farmerDirectPayout: 146300,
    platformFee: 7700,
    total: 169000,
    currency: 'XAF',
    status: 'delivered',
    createdAt: '2026-10-25T09:30:00Z',
    timeline: [
      { status: 'confirmed', label: 'Order Escrow Verified', time: '09:30 AM', location: 'Douala Wholesale Terminal', completed: true },
      { status: 'harvest_assigned', label: 'Produce Prepared & Packed', time: '11:00 AM', location: 'Mbang Agro Farms', completed: true },
      { status: 'cold_transport', label: 'Cold-Chain Refrigerated Van Dispatched', time: '02:00 PM', location: 'Route Nationale 5', completed: true },
      { status: 'delivered', label: 'Delivered & Accepted by Buyer', time: '05:30 PM', location: 'Akwa Commercial District', completed: true },
    ],
    items: [
      {
        product: SEED_PRODUCTS[0], // Penja pepper
        quantity: 10,
        tier: 'wholesale'
      },
      {
        product: SEED_PRODUCTS[3], // Roma tomatoes
        quantity: 10,
        tier: 'wholesale'
      }
    ]
  },
  {
    id: 'ord-2026-1002',
    customerName: 'Hôtel Mont Fébé Yaoundé',
    customerEmail: 'chef@montfebe.cm',
    customerPhone: '+237 699 88 77 66',
    buyerType: 'restaurant',
    shippingAddress: 'Mont Fébé Hill, Yaoundé, Centre',
    deliverySlot: 'Morning (07:00 - 10:00)',
    deliveryMethod: 'cold_chain_express',
    subtotal: 62000,
    deliveryFee: 8000,
    tipAmount: 3100,
    tipPercentage: 5,
    farmerDirectPayout: 58900,
    platformFee: 3100,
    total: 73100,
    currency: 'XAF',
    status: 'cold_transport',
    createdAt: '2026-10-27T11:15:00Z',
    timeline: [
      { status: 'confirmed', label: 'Escrow Confirmed', time: '11:15 AM', location: 'Yaoundé Central Hub', completed: true },
      { status: 'harvest_assigned', label: 'Fresh Harvest Crated', time: '01:00 PM', location: 'Buea Orchards', completed: true },
      { status: 'cold_transport', label: 'Chilled Transit In Progress', time: '03:30 PM', location: 'Douala - Yaoundé Highway', completed: true },
    ],
    items: [
      {
        product: SEED_PRODUCTS[6], // Hass Avocados
        quantity: 10,
        tier: 'wholesale'
      },
      {
        product: SEED_PRODUCTS[8], // Oku Honey
        quantity: 4,
        tier: 'retail'
      }
    ]
  }
];

export const SEED_SERVICE_BOOKINGS: ServiceBooking[] = [
  {
    id: 'bk-2026-5001',
    providerId: 'sp-02',
    providerName: 'Jean-Luc Ngassa',
    providerTitle: 'Master Tractor Operator & Tillage Contractor',
    providerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    providerPhone: '+237 699 44 23 11',
    providerWhatsapp: '+237699442311',
    serviceId: 'srv-201',
    serviceTitle: 'Deep Disc Ploughing & Soil Inversion',
    serviceUnit: 'per hectare',
    clientName: 'Mama Nicole Mbang',
    clientPhone: '+237 677 34 19 02',
    clientEmail: 'nicole@mbang-farms.cm',
    clientFarmLocation: 'Mbanga Volcanic Valley Plot 4',
    bookingDate: '2026-10-29',
    timeSlot: 'morning',
    scopeQuantity: 4,
    unitPriceXaf: 45000,
    subtotalXaf: 180000,
    platformEscrowFeeXaf: 9000,
    totalPriceXaf: 189000,
    specialInstructions: 'Soil is moderately moist after weekend rain; please bring the heavy 4-disc plough.',
    status: 'confirmed',
    createdAt: '2026-10-26T14:20:00Z',
  },
  {
    id: 'bk-2026-5002',
    providerId: 'sp-03',
    providerName: 'Aissatou Bello',
    providerTitle: 'Certified Drone Pilot & Precision Agronomist',
    providerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    providerPhone: '+237 698 12 77 03',
    providerWhatsapp: '+237698127703',
    serviceId: 'srv-301',
    serviceTitle: 'Ultra-Low-Volume (ULV) Organic Foliar Spraying',
    serviceUnit: 'per hectare',
    clientName: 'Ousmanou Daouda',
    clientPhone: '+237 696 55 12 88',
    clientEmail: 'daouda@grandbayam-grains.cm',
    clientFarmLocation: 'Benoue North Plot B2',
    bookingDate: '2026-10-30',
    timeSlot: 'full_day',
    scopeQuantity: 12,
    unitPriceXaf: 28000,
    subtotalXaf: 336000,
    platformEscrowFeeXaf: 16800,
    totalPriceXaf: 352800,
    specialInstructions: 'Spray our organic liquid seaweed foliar fertilizer before 10 AM to prevent heat evaporation.',
    status: 'in_progress',
    createdAt: '2026-10-27T08:00:00Z',
  }
];

// ---------------------------------------------------------------------------
// 5. UNIFIED PLATFORM USERS (All 5 Suppliers + All 20 Service Renderers + Admins)
// ---------------------------------------------------------------------------
export function generateSeedUsers(): PlatformUser[] {
  const users: PlatformUser[] = [];

  // 1. Add Suppliers as Users
  SEED_FARMS.forEach((farm, idx) => {
    users.push({
      id: `usr-supplier-${idx + 1}`,
      fullName: farm.ownerName,
      email: farm.email,
      phone: farm.phone,
      role: 'supplier',
      businessName: farm.name,
      location: farm.location,
      region: farm.region,
      avatarUrl: farm.avatar,
      verified: true,
      status: 'active',
      joinedDate: `${farm.joinedYear}-04-12`,
      linkedEntityId: farm.id,
      notes: `Registered supplier cooperative with MINADER ${farm.minaderRegNumber || 'Active'}`
    });
  });

  // 2. Add Service Renderers as Users
  SEED_SERVICE_PROVIDERS.forEach((sp, idx) => {
    users.push({
      id: `usr-renderer-${idx + 1}`,
      fullName: sp.fullName,
      email: sp.email,
      phone: sp.phone,
      role: 'service_renderer',
      businessName: sp.businessName || `${sp.fullName} Agricultural Services`,
      location: sp.location,
      region: sp.region,
      avatarUrl: sp.avatarUrl,
      verified: sp.verified,
      status: 'active',
      joinedDate: '2022-01-15',
      linkedEntityId: sp.id,
      notes: `${sp.title} (${sp.experienceYears} yrs experience)`
    });
  });

  return users;
}

// ---------------------------------------------------------------------------
// 6. REACTIVE PERSISTENT STORE METHODS
// ---------------------------------------------------------------------------

function notifyStoreUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('agriflow-data-updated'));
  }
}

// FARMS / SUPPLIERS
export function getStoredFarms(): Farm[] {
  try {
    const raw = localStorage.getItem(FARMS_KEY);
    if (!raw) {
      localStorage.setItem(FARMS_KEY, JSON.stringify(SEED_FARMS));
      return SEED_FARMS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_FARMS;
  } catch {
    return SEED_FARMS;
  }
}

export function saveFarmToStore(farm: Farm): void {
  const current = getStoredFarms();
  const index = current.findIndex(f => f.id === farm.id);
  let updated: Farm[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = farm;
  } else {
    updated = [farm, ...current];
  }
  localStorage.setItem(FARMS_KEY, JSON.stringify(updated));

  // Sync to users list
  const users = getStoredPlatformUsers();
  const userIdx = users.findIndex(u => u.linkedEntityId === farm.id);
  if (userIdx >= 0) {
    users[userIdx].fullName = farm.ownerName;
    users[userIdx].businessName = farm.name;
    users[userIdx].phone = farm.phone;
    users[userIdx].email = farm.email;
    users[userIdx].location = farm.location;
    users[userIdx].avatarUrl = farm.avatar;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } else {
    users.unshift({
      id: `usr-sup-${Date.now()}`,
      fullName: farm.ownerName,
      email: farm.email,
      phone: farm.phone,
      role: 'supplier',
      businessName: farm.name,
      location: farm.location,
      region: farm.region,
      avatarUrl: farm.avatar,
      verified: true,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      linkedEntityId: farm.id,
      notes: 'Added via Admin or Supplier Portal'
    });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  notifyStoreUpdated();
}

export function deleteFarmFromStore(farmId: string): void {
  const current = getStoredFarms();
  const filtered = current.filter(f => f.id !== farmId);
  localStorage.setItem(FARMS_KEY, JSON.stringify(filtered));

  // Remove linked products
  const products = getStoredProducts().filter(p => p.farmId !== farmId);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));

  // Remove linked user
  const users = getStoredPlatformUsers().filter(u => u.linkedEntityId !== farmId);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  notifyStoreUpdated();
}

// PRODUCTS
export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(SEED_PRODUCTS));
      return SEED_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_PRODUCTS;
  } catch {
    return SEED_PRODUCTS;
  }
}

export function saveProductToStore(product: Product): void {
  const current = getStoredProducts();
  const index = current.findIndex(p => p.id === product.id);
  let updated: Product[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = product;
  } else {
    updated = [product, ...current];
  }
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  notifyStoreUpdated();
}

export function deleteProductFromStore(productId: string): void {
  const current = getStoredProducts();
  const filtered = current.filter(p => p.id !== productId);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
  notifyStoreUpdated();
}

// SERVICE PROVIDERS
export function getStoredServiceProviders(): ServiceProvider[] {
  try {
    const raw = localStorage.getItem(PROVIDERS_KEY);
    if (!raw) {
      localStorage.setItem(PROVIDERS_KEY, JSON.stringify(SEED_SERVICE_PROVIDERS));
      return SEED_SERVICE_PROVIDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length >= 20 ? parsed : SEED_SERVICE_PROVIDERS;
  } catch {
    return SEED_SERVICE_PROVIDERS;
  }
}

export function saveServiceProviderToStore(sp: ServiceProvider): void {
  const current = getStoredServiceProviders();
  const index = current.findIndex(p => p.id === sp.id);
  let updated: ServiceProvider[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = sp;
  } else {
    updated = [sp, ...current];
  }
  localStorage.setItem(PROVIDERS_KEY, JSON.stringify(updated));

  // Sync to platform users list
  const users = getStoredPlatformUsers();
  const userIdx = users.findIndex(u => u.linkedEntityId === sp.id);
  if (userIdx >= 0) {
    users[userIdx].fullName = sp.fullName;
    users[userIdx].businessName = sp.businessName || sp.fullName;
    users[userIdx].phone = sp.phone;
    users[userIdx].email = sp.email;
    users[userIdx].location = sp.location;
    users[userIdx].avatarUrl = sp.avatarUrl;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } else {
    users.unshift({
      id: `usr-rend-${Date.now()}`,
      fullName: sp.fullName,
      email: sp.email,
      phone: sp.phone,
      role: 'service_renderer',
      businessName: sp.businessName || sp.fullName,
      location: sp.location,
      region: sp.region,
      avatarUrl: sp.avatarUrl,
      verified: sp.verified,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      linkedEntityId: sp.id,
      notes: `${sp.title} (${sp.category})`
    });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  notifyStoreUpdated();
}

export function deleteServiceProviderFromStore(spId: string): void {
  const current = getStoredServiceProviders();
  const filtered = current.filter(p => p.id !== spId);
  localStorage.setItem(PROVIDERS_KEY, JSON.stringify(filtered));

  // Remove linked user
  const users = getStoredPlatformUsers().filter(u => u.linkedEntityId !== spId);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  notifyStoreUpdated();
}

// SERVICE BOOKINGS
export function getStoredServiceBookings(): ServiceBooking[] {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(SEED_SERVICE_BOOKINGS));
      return SEED_SERVICE_BOOKINGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_SERVICE_BOOKINGS;
  } catch {
    return SEED_SERVICE_BOOKINGS;
  }
}

export function saveServiceBookingToStore(booking: ServiceBooking): void {
  const current = getStoredServiceBookings();
  const updated = [booking, ...current];
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
  notifyStoreUpdated();
}

export function updateServiceBookingStatusInStore(bookingId: string, status: ServiceBooking['status']): void {
  const current = getStoredServiceBookings();
  const updated = current.map(b => b.id === bookingId ? { ...b, status } : b);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
  notifyStoreUpdated();
}

// ORDERS
export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(SEED_ORDERS));
      return SEED_ORDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_ORDERS;
  } catch {
    return SEED_ORDERS;
  }
}

export function saveOrderToStore(order: Order): void {
  const current = getStoredOrders();
  const updated = [order, ...current];
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  notifyStoreUpdated();
}

export function updateOrderStatusInStore(orderId: string, status: Order['status']): void {
  const current = getStoredOrders();
  const updated = current.map(o => o.id === orderId ? { ...o, status } : o);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  notifyStoreUpdated();
}

// PLATFORM USERS (Unified Supplier & Service Renderer Registry for Admin)
export function getStoredPlatformUsers(): PlatformUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      const initialUsers = generateSeedUsers();
      localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : generateSeedUsers();
  } catch {
    return generateSeedUsers();
  }
}

export function savePlatformUserToStore(user: PlatformUser): void {
  const current = getStoredPlatformUsers();
  const index = current.findIndex(u => u.id === user.id);
  let updated: PlatformUser[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = user;
  } else {
    updated = [user, ...current];
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(updated));
  notifyStoreUpdated();
}

export function deletePlatformUserFromStore(userId: string): void {
  const current = getStoredPlatformUsers();
  const user = current.find(u => u.id === userId);
  const filtered = current.filter(u => u.id !== userId);
  localStorage.setItem(USERS_KEY, JSON.stringify(filtered));

  // If linked to a supplier or renderer, remove from respective stores
  if (user?.linkedEntityId) {
    if (user.role === 'supplier') {
      deleteFarmFromStore(user.linkedEntityId);
    } else if (user.role === 'service_renderer') {
      deleteServiceProviderFromStore(user.linkedEntityId);
    }
  }

  notifyStoreUpdated();
}
