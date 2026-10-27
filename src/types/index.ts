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
  | 'Heritage Heirloom'
  | 'Fairtrade Africa Certified'
  | 'Rainforest Alliance'
  | 'PGI Certified (Penja Protected Geographical Indication)';

export type AppView = 
  | 'marketplace'
  | 'services'
  | 'farmer_portal'
  | 'farms'
  | 'csa_boxes'
  | 'wholesale_hub'
  | 'logistics'
  | 'orders'
  | 'onboarding'
  | 'impact'
  | 'demand_radar'
  | 'live_chat'
  | 'admin_dashboard';


export type GeographicRegion = 
  | 'Littoral & Coastal'
  | 'Centre & Yaoundé'
  | 'West Highlands (Foumbot/Bafoussam)'
  | 'Southwest & Mt. Cameroon'
  | 'Northwest & Grassfields'
  | 'North & Adamawa'
  | 'Pacific West'
  | 'California Central Valley'
  | 'Midwest Prairies'
  | 'Sunbelt South'
  | 'International Export Corridor';

export interface SupplierPrivacySettings {
  showPhonePublicly: boolean;
  showEmailPublicly: boolean;
  showExactAddress: boolean;
  allowWhatsAppDirect: boolean;
  preferredContactMethod: 'whatsapp' | 'live_chat' | 'email' | 'platform_rfq';
}

export interface Farm {
  id: string;
  name: string;
  tagline: string;
  location: string;
  state: string;
  coordinates: { lat: number; lng: number };
  region: string;
  country?: string; // e.g. "Cameroon" or "USA"
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
  directPayoutShare: number; // e.g. 88%
  phone: string;
  email: string;
  whatsappNumber?: string;
  privacySettings?: SupplierPrivacySettings;
  verificationBadges?: {
    identityVerified: boolean;
    businessVerified: boolean;
    exportCertified: boolean;
    trustedTrader: boolean;
  };
  minaderRegNumber?: string; // Cameroon Ministry of Agriculture registration
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
  retailPrice: number; // In local currency base (or converted)
  retailPriceXaf?: number; // Primary or converted FCFA price
  retailUnit: string;
  wholesalePrice: number;
  wholesalePriceXaf?: number;
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
  originCountry?: string;
  exportReady?: boolean;
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
  buyerType: 'consumer' | 'restaurant' | 'grocery' | 'wholesale_distributor' | 'international_importer';
  shippingAddress: string;
  deliverySlot: string;
  deliveryMethod: 'cold_chain_express' | 'hub_pickup' | 'farm_gate' | 'air_freight_export' | 'sea_cargo';
  tipPercentage: number;
  subtotal: number;
  deliveryFee: number;
  tipAmount: number;
  farmerDirectPayout: number;
  platformFee: number;
  total: number;
  currency?: 'USD' | 'XAF' | 'EUR';
  status: 
    | 'confirmed' 
    | 'harvest_assigned' 
    | 'cold_transport' 
    | 'hub_verified' 
    | 'in_export_transit'
    | 'delivered'
    | 'disputed';
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
  exportReady?: boolean;
}

export interface CSABoxPlan {
  id: string;
  name: string;
  tagline: string;
  servings: string;
  weightKg: number;
  pricePerDelivery: number;
  pricePerDeliveryXaf?: number;
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
  country?: string;
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
  region: string;
  acreage: number;
  primaryCrops: string;
  farmingPractices: string[];
  certifications: string[];
  hasColdStorage: boolean;
  story: string;
  status: 'submitted' | 'under_review' | 'approved';
  minaderRegNumber?: string;
}

// -------------------------------------------------------------
// DEMAND RADAR & INTELLIGENT MATCHING TYPES
// -------------------------------------------------------------

export type DemandOpportunityStatus = 
  | 'active_request'
  | 'potential_buyer'
  | 'matched'
  | 'introduction_sent'
  | 'confirmed_interest'
  | 'expired';

export type ContactPermissionStatus = 
  | 'direct_outreach_permitted'
  | 'manual_review_required'
  | 'prohibited_opt_out';

export interface DemandOpportunity {
  id: string;
  title: string;
  productSought: string;
  category: ProductCategory;
  quantityNeeded: number;
  unit: string; // e.g. 'kg', 'MT (Metric Tons)', 'Crates', 'Pallets'
  qualityGrade: string; // e.g. 'Grade A+ Export Quality'
  targetPrice?: number;
  targetPriceUnit?: string;
  currency: 'XAF' | 'USD' | 'EUR';
  destinationLocation: string; // e.g. 'Douala Autonomous Port', 'Rungis International Market, Paris'
  destinationCountry: string; // e.g. 'Cameroon', 'France', 'Gabon', 'Germany', 'UAE'
  deadlineDate: string; // e.g. '2026-11-15'
  buyerOrgName: string; // e.g. 'Société Camerounaise de Distribution', 'BioFresh Europe Importers'
  buyerType: 'processor' | 'importer' | 'wholesaler' | 'supermarket' | 'food_service';
  buyerContactMethod: 'whatsapp' | 'email' | 'rfq_portal' | 'tender_board';
  buyerContactInfo?: string; // Formatted number or email (only visible if permission permits)
  originalSourceUrl: string; // Official link to the tender/bulletin
  sourceName: string; // e.g. 'UN FAO Agro-Trade Bulletin', 'Cameroon CACE Export Registry', 'CEMAC Tender Board'
  sourceCredibilityScore: number; // 0 - 100
  discoveryTimestamp: string;
  lastVerificationTimestamp: string;
  status: DemandOpportunityStatus;
  contactPermissionStatus: ContactPermissionStatus;
  extractionConfidence: number; // 0 - 100
  notes?: string;
}

export interface MatchFactor {
  factor: string;
  match: boolean;
  details: string;
}

export interface OpportunityMatch {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  opportunity: DemandOpportunity;
  productId: string;
  product: Product;
  supplierId: string;
  supplierName: string;
  compatibilityScore: number; // 0 - 100
  matchReasonSummary: string;
  detailedFactors: MatchFactor[];
  missingInfo: string[];
  automatedContactPermitted: boolean;
  contactDecisionReason: string;
  status: 'suggested' | 'approved_by_supplier' | 'introduction_queued' | 'introduction_sent' | 'declined';
  createdAt: string;
}

// -------------------------------------------------------------
// LIVE CHAT & CONVERSATION TYPES
// -------------------------------------------------------------

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: 'buyer' | 'supplier' | 'system';
  senderName: string;
  messageText: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'document' | 'audio';
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  buyerLocation: string;
  supplierId: string;
  supplierName: string;
  supplierAvatar: string;
  relatedOpportunityId?: string;
  relatedProductId?: string;
  subject: string;
  lastMessageText: string;
  lastMessageTimestamp: string;
  unreadCountSupplier: number;
  unreadCountBuyer: number;
  status: 'active' | 'archived' | 'blocked';
  isReported?: boolean;
}

// -------------------------------------------------------------
// IN-APP NOTIFICATIONS
// -------------------------------------------------------------

export type NotificationType = 
  | 'match_alert'
  | 'chat_message'
  | 'buyer_response'
  | 'order_update'
  | 'system_alert'
  | 'privacy_notice';

export interface AppNotification {
  id: string;
  userId?: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  targetView?: AppView;
  targetId?: string;
  actionLabel?: string;
}

// -------------------------------------------------------------
// EMAIL & SMS WORKFLOW LOGS
// -------------------------------------------------------------

export interface EmailLog {
  id: string;
  toEmail: string;
  recipientName: string;
  subject: string;
  template: 'match_introduction' | 'buyer_inquiry' | 'order_confirmation' | 'supplier_notification';
  bodyHtml: string;
  bodyText: string;
  status: 'queued' | 'simulated' | 'sent' | 'failed';
  provider: 'smtp_mock' | 'resend_active' | 'sendgrid_active';
  timestamp: string;
  errorMessage?: string;
}

export interface SmsLog {
  id: string;
  toPhone: string;
  messageText: string;
  status: 'simulated_test';
  provider: 'simulator';
  timestamp: string;
  note: string;
}

// -------------------------------------------------------------
// TRUST, VERIFICATION & DISPUTES
// -------------------------------------------------------------

export interface DisputeReport {
  id: string;
  reporterName: string;
  reporterRole: 'buyer' | 'supplier';
  reporterContact: string;
  reportedEntityName: string;
  reason: 'produce_quality_mismatch' | 'non_delivery' | 'unauthorized_contact' | 'pricing_fraud' | 'other';
  details: string;
  status: 'open_investigation' | 'resolved' | 'dismissed';
  createdAt: string;
}

// -------------------------------------------------------------
// VOICE ASSISTANT TYPES
// -------------------------------------------------------------

export type VoiceLanguage = 'en' | 'pcm'; // English or Cameroonian Pidgin

export interface VoiceActionProposal {
  type: 'list_produce' | 'search_buyers' | 'read_notifications' | 'contact_buyer';
  description: string;
  payload: Record<string, unknown>;
  requiresConfirmation: boolean;
}

// -------------------------------------------------------------
// ADMIN OBSERVABILITY & AUDIT
// -------------------------------------------------------------

export interface SystemHealthStatus {
  crawlerActive: boolean;
  lastDiscoveryRun: string;
  opportunitiesIndexed: number;
  activeMatchesCount: number;
  whatsappOutreachCount: number;
  emailSimulatorLogsCount: number;
  supabaseConnected: boolean;
  errorLogCount: number;
}

// -------------------------------------------------------------
// AGRICULTURAL SERVICE HUB & SPECIALIST NETWORK TYPES
// -------------------------------------------------------------

export type ServiceCategory = 
  | 'all'
  | 'agronomy'
  | 'machinery'
  | 'drone_tech'
  | 'cold_chain'
  | 'harvest_labor'
  | 'irrigation_solar'
  | 'veterinary'
  | 'soil_testing'
  | 'certification';

export interface ServiceOffering {
  id: string;
  title: string;
  description: string;
  priceXaf: number;
  priceUsd: number;
  unit: string; // e.g. 'per hectare', 'per hour', 'per day', 'per test', 'per transit trip'
  estimatedDuration: string;
  includesEquipment: boolean;
}

export interface ServiceProvider {
  id: string;
  userId?: string;
  fullName: string;
  businessName?: string;
  title: string; // e.g. "Lead Agronomist & Soil Diagnostic Specialist"
  category: ServiceCategory;
  avatarUrl: string;
  bannerUrl: string;
  rating: number; // 0 - 5.0
  reviewCount: number;
  startingPriceXaf: number;
  startingPriceUsd: number;
  location: string;
  region: string;
  country: string;
  bio: string;
  experienceYears: number;
  verified: boolean;
  licensedProfessional: boolean;
  insuranceCovered: boolean;
  phone: string;
  whatsappNumber: string;
  email: string;
  certifications: string[];
  equipmentList: string[];
  services: ServiceOffering[];
  completedJobsCount: number;
  responseTimeMinutes: number;
  availableDays: string[]; // e.g. ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  featured?: boolean;
}

export type ServiceBookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface ServiceBooking {
  id: string;
  providerId: string;
  providerName: string;
  providerTitle: string;
  providerAvatar: string;
  providerPhone: string;
  providerWhatsapp: string;
  serviceId: string;
  serviceTitle: string;
  serviceUnit: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientFarmLocation: string;
  bookingDate: string;
  timeSlot: 'morning' | 'afternoon' | 'full_day';
  scopeQuantity: number; // e.g. 3 (hectares, hours, or tests)
  unitPriceXaf: number;
  subtotalXaf: number;
  platformEscrowFeeXaf: number;
  totalPriceXaf: number;
  specialInstructions?: string;
  status: ServiceBookingStatus;
  createdAt: string;
}
