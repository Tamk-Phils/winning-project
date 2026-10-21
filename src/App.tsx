import { useState, useEffect } from 'react';
import type { 
  Farm, 
  Product, 
  CartItem, 
  Order, 
  BulkRFQ, 
  ProductCategory,
  AppView,
  DemandOpportunity,
  AppNotification,
  EmailLog,
  SmsLog,
  DisputeReport,
  SupplierPrivacySettings
} from './types';
import { 
  fetchFarms, 
  fetchProducts, 
  fetchOrders,
  saveProduct, 
  saveOrder, 
  submitBulkRFQ, 
  getStoredSupabaseConfig
} from './lib/supabase';
import type { SupabaseConfig } from './lib/supabase';
import { fetchDemandOpportunities } from './lib/demandRadar';
import { 
  fetchNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  fetchEmailLogs, 
  fetchSmsLogs, 
  fetchDisputes,
  addNotification
} from './lib/communicationServices';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MarketplaceView } from './components/MarketplaceView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { FarmerPortal } from './components/FarmerPortal';
import { FarmStories } from './components/FarmStories';
import { CartDrawer } from './components/CartDrawer';
import { WholesaleRFQModal } from './components/WholesaleRFQModal';
import { SupabaseModal } from './components/SupabaseModal';
import { CSASubscriptionsView } from './components/CSASubscriptionsView';
import { LogisticsNetworkView } from './components/LogisticsNetworkView';
import { WholesaleHubView } from './components/WholesaleHubView';
import { FarmerOnboardingView } from './components/FarmerOnboardingView';
import { OrderHistoryView } from './components/OrderHistoryView';
import { ImpactView } from './components/ImpactView';
import { DemandRadarView } from './components/DemandRadarView';
import { LiveChatView } from './components/LiveChatView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { NotificationDrawer } from './components/NotificationDrawer';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { DisputeModal } from './components/DisputeModal';
import { SupplierPrivacyModal } from './components/SupplierPrivacyModal';
import { Footer } from './components/Footer';
import { Mic } from 'lucide-react';

const CART_STORAGE_KEY = 'agriflow_cart_v1';

export function App() {
  // Data States
  const [farms, setFarms] = useState<Farm[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [demandOpportunities, setDemandOpportunities] = useState<DemandOpportunity[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [smsLogs, setSmsLogs] = useState<SmsLog[]>([]);
  const [disputes, setDisputes] = useState<DisputeReport[]>([]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // App Navigation & View
  const [activeView, setActiveView] = useState<AppView>('marketplace');
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isRFQModalOpen, setIsRFQModalOpen] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(getStoredSupabaseConfig());

  // Upgraded Feature Modals
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState<boolean>(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState<boolean>(false);
  const [disputeReportedName, setDisputeReportedName] = useState<string>('');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [privacyFarm, setPrivacyFarm] = useState<Farm | null>(null);
  const [activeChatId, setActiveChatId] = useState<string>('');

  // Load initial data
  useEffect(() => {
    async function loadData() {
      const [
        loadedFarms, 
        loadedProducts, 
        loadedOrders,
        loadedOpps,
        loadedNotifs,
        loadedEmails,
        loadedSms,
        loadedDisputes
      ] = await Promise.all([
        fetchFarms(),
        fetchProducts(),
        fetchOrders(),
        fetchDemandOpportunities(),
        fetchNotifications(),
        fetchEmailLogs(),
        fetchSmsLogs(),
        fetchDisputes()
      ]);

      setFarms(loadedFarms);
      setProducts(loadedProducts);
      setOrders(loadedOrders);
      setDemandOpportunities(loadedOpps);
      setNotifications(loadedNotifs);
      setEmailLogs(loadedEmails);
      setSmsLogs(loadedSms);
      setDisputes(loadedDisputes);
    }
    loadData();
  }, [supabaseConfig.isConnected]);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number, tier: 'retail' | 'wholesale') => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.tier === tier
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, quantity, tier }];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number, tier: 'retail' | 'wholesale') => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId && item.tier === tier) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId: string, tier: 'retail' | 'wholesale') => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.product.id === productId && item.tier === tier))
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Farmer Portal: Add New Produce Batch
  const handleAddProduct = async (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    await saveProduct(newProduct);
    
    // Alert via in-app notification
    await addNotification({
      id: `notif-prod-${Date.now()}`,
      type: 'order_update',
      title: 'New Harvest Batch Listed',
      message: `${newProduct.name} (${newProduct.stockQuantity} ${newProduct.stockUnit}) is now visible to regional & export buyers.`,
      timestamp: 'Just now',
      isRead: false,
      targetView: 'marketplace'
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter(p => p.id !== productId));
  };

  // Farmer Onboarding: Add New Farm
  const handleRegisterFarm = (newFarm: Farm) => {
    setFarms((prev) => [newFarm, ...prev]);
  };

  // Order Placement
  const handleOrderPlaced = async (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    await saveOrder(order);

    await addNotification({
      id: `notif-ord-${Date.now()}`,
      type: 'order_update',
      title: `Order Placed #${order.id}`,
      message: `Total: ${order.total} XAF. Cold-chain dispatch scheduled.`,
      timestamp: 'Just now',
      isRead: false,
      targetView: 'orders'
    });
  };

  // Wholesale RFQ
  const handleSubmitRFQ = async (rfq: BulkRFQ) => {
    await submitBulkRFQ(rfq);
    await addNotification({
      id: `notif-rfq-${Date.now()}`,
      type: 'match_alert',
      title: 'Wholesale RFQ Submitted',
      message: `RFQ for ${rfq.volumeNeeded} ${rfq.produceNeeded} forwarded to certified cooperatives.`,
      timestamp: 'Just now',
      isRead: false,
      targetView: 'wholesale_hub'
    });
  };

  // Notification actions
  const handleMarkAsRead = async (id: string) => {
    const updated = await markNotificationAsRead(id);
    setNotifications(updated);
  };

  const handleMarkAllAsRead = async () => {
    const updated = await markAllNotificationsAsRead();
    setNotifications(updated);
  };

  // Privacy Settings update
  const handleUpdatePrivacy = (farmId: string, settings: SupplierPrivacySettings) => {
    setFarms((prev) => prev.map(f => {
      if (f.id === farmId) {
        return { ...f, privacySettings: settings };
      }
      return f;
    }));
  };

  // Open Live Chat from Demand Radar or other cards
  const handleOpenLiveChat = (_buyerId: string, _buyerName: string, _subject: string, _oppId?: string) => {
    setActiveChatId('conv-001'); // Navigate to active conversation
    setActiveView('live_chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Privacy Settings Modal for farmer
  const handleOpenPrivacyModal = (farm?: Farm) => {
    setPrivacyFarm(farm || (farms.length > 0 ? farms[0] : null));
    setIsPrivacyModalOpen(true);
  };

  // Open Dispute Modal
  const handleOpenDispute = (reportedName: string) => {
    setDisputeReportedName(reportedName);
    setIsDisputeModalOpen(true);
  };

  // Voice Assistant add produce helper
  const handleAddProduceVoice = (produceName: string, quantity: number, priceXaf: number) => {
    const newProd: Product = {
      id: `prod-voice-${Date.now()}`,
      name: produceName,
      category: 'fruits',
      variety: 'Giant French Horn Export Grade',
      farmId: 'farm-cm-1',
      farmName: 'Coopérative Agro-Écologique de Penja (CAEP)',
      farmLocation: 'Njombé-Penja, Littoral Region',
      farmAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=120&q=80',
      description: 'Voice-listed fresh harvest batch. Ready for cold-transit dispatch.',
      imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=800&q=80',
      retailPrice: Number((priceXaf / 600).toFixed(2)),
      retailPriceXaf: priceXaf,
      retailUnit: 'kg',
      wholesalePrice: Number((priceXaf / 600 * 0.85).toFixed(2)),
      wholesalePriceXaf: Math.round(priceXaf * 0.85),
      wholesaleUnit: 'kg in 20kg Carton',
      wholesaleMinOrder: 50,
      stockQuantity: quantity,
      stockUnit: 'kg',
      harvestDate: 'Harvested Today',
      harvestAgeHours: 4,
      shelfLifeDays: 21,
      coldChainTemp: 'Cool Ambient (13°C - 15°C)',
      grade: 'Grade A+ Premium',
      certifications: ['GAP West Africa', 'PGI Protected'],
      practices: ['Volcanic Soil', 'Zero Synthetic Chemical Spray'],
      nutritionalNotes: ['High Potassium', 'Resistant Starch'],
      isOrganic: true,
      isRegenerative: true,
      inSeason: true,
      featured: true,
      rating: 5.0,
      reviewsCount: 1,
      originCountry: 'Cameroon',
      exportReady: true
    };
    handleAddProduct(newProd);
  };

  const handleFilterByFarm = (farmName: string) => {
    setSearchQuery(farmName);
    setActiveView('marketplace');
  };

  const handleNavigateView = (view: AppView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Global Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={handleNavigateView}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        supabaseConfig={supabaseConfig}
        setIsSupabaseModalOpen={setIsSupabaseModalOpen}
        setIsRFQModalOpen={setIsRFQModalOpen}
        unreadNotificationCount={unreadNotificationCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
        onOpenPrivacyModal={() => handleOpenPrivacyModal()}
        chatUnreadCount={1}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        
        {/* Marketplace View */}
        {activeView === 'marketplace' && (
          <>
            <Hero
              onExploreClick={() => {
                const el = document.getElementById('catalog-anchor');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onPostRFQClick={() => setIsRFQModalOpen(true)}
              onCategorySelect={(cat) => {
                setActiveCategory(cat);
                const el = document.getElementById('catalog-anchor');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <div id="catalog-anchor">
              <MarketplaceView
                products={products}
                farms={farms}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedRegion={selectedRegion}
                onAddToCart={handleAddToCart}
                onSelectProduct={setSelectedProduct}
                onSelectFarm={setSelectedFarmId}
                onOpenRFQ={() => setIsRFQModalOpen(true)}
              />
            </div>

            <FarmStories
              farms={farms}
              products={products}
              selectedFarmId={selectedFarmId}
              setSelectedFarmId={setSelectedFarmId}
              onSelectProduct={setSelectedProduct}
              onFilterByFarm={handleFilterByFarm}
            />
          </>
        )}

        {/* Demand Radar View (Continuous Discovery of Buyer Requests) */}
        {activeView === 'demand_radar' && (
          <DemandRadarView
            opportunities={demandOpportunities}
            products={products}
            farms={farms}
            onOpenLiveChat={handleOpenLiveChat}
          />
        )}

        {/* Live Chat View (1-to-1 Buyer-Supplier Messaging) */}
        {activeView === 'live_chat' && (
          <LiveChatView
            initialConversationId={activeChatId}
            onOpenDisputeModal={handleOpenDispute}
          />
        )}

        {/* Admin Dashboard & Observability View */}
        {activeView === 'admin_dashboard' && (
          <AdminDashboardView
            opportunities={demandOpportunities}
            farms={farms}
            products={products}
            disputes={disputes}
            emailLogs={emailLogs}
            smsLogs={smsLogs}
            supabaseConnected={supabaseConfig.isConnected}
            onResolveDispute={(id) => setDisputes(prev => prev.filter(d => d.id !== id))}
            onToggleOpportunityStatus={(id) => {
              setDemandOpportunities(prev => prev.map(o => {
                if (o.id === id) {
                  return {
                    ...o,
                    status: o.status === 'active_request' ? 'expired' : 'active_request'
                  };
                }
                return o;
              }));
            }}
          />
        )}

        {/* CSA Subscriptions Page */}
        {activeView === 'csa_boxes' && (
          <CSASubscriptionsView
            onAddToCart={handleAddToCart}
            onExploreMarket={() => handleNavigateView('marketplace')}
            products={products}
          />
        )}

        {/* Wholesale B2B Commercial Portal Page */}
        {activeView === 'wholesale_hub' && (
          <WholesaleHubView
            products={products}
            onOpenRFQ={() => setIsRFQModalOpen(true)}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* Verified Farms Showcase Page */}
        {activeView === 'farms' && (
          <div style={{ padding: '20px 0' }}>
            <FarmStories
              farms={farms}
              products={products}
              selectedFarmId={selectedFarmId}
              setSelectedFarmId={setSelectedFarmId}
              onSelectProduct={setSelectedProduct}
              onFilterByFarm={handleFilterByFarm}
            />
          </div>
        )}

        {/* Cold-Chain Logistics & IoT Hubs Page */}
        {activeView === 'logistics' && (
          <LogisticsNetworkView />
        )}

        {/* Live Orders & Dispatch Telemetry Tracker Page */}
        {activeView === 'orders' && (
          <OrderHistoryView
            orders={orders}
            onExploreMarket={() => handleNavigateView('marketplace')}
          />
        )}

        {/* Farmer Onboarding Wizard ("Sell on AgriFlow") */}
        {activeView === 'onboarding' && (
          <FarmerOnboardingView
            onRegisterFarm={handleRegisterFarm}
            onGoToFarmerPortal={() => handleNavigateView('farmer_portal')}
          />
        )}

        {/* Soil Health & Sustainability Impact Page */}
        {activeView === 'impact' && (
          <ImpactView
            onExploreFarms={() => handleNavigateView('farms')}
            onExploreMarket={() => handleNavigateView('marketplace')}
          />
        )}

        {/* Farmer Producer Portal */}
        {activeView === 'farmer_portal' && (
          <FarmerPortal
            farms={farms}
            products={products}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onSelectProduct={setSelectedProduct}
          />
        )}
      </main>

      {/* Floating Accessible Voice Assistant Button */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 900
      }}>
        <button
          type="button"
          onClick={() => setIsVoiceAssistantOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 18px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary-800)',
            color: '#ffffff',
            border: '2px solid rgba(255,255,255,0.2)',
            boxShadow: 'var(--shadow-xl)',
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: '0.88rem',
            transition: 'all 0.2s ease'
          }}
          title="Voice Assistant for Farmers (English & Pidgin)"
        >
          <Mic size={18} color="#86efac" />
          <span>Voice Assistant</span>
        </button>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onSelectFarm={(farmId) => {
          setSelectedProduct(null);
          setSelectedFarmId(farmId);
        }}
        onOpenRFQ={() => setIsRFQModalOpen(true)}
      />

      {/* Cart Drawer & Checkout Flow */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Wholesale RFQ Modal */}
      <WholesaleRFQModal
        isOpen={isRFQModalOpen}
        onClose={() => setIsRFQModalOpen(false)}
        onSubmitRFQ={handleSubmitRFQ}
      />

      {/* Supabase Database Config & SQL Schema Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        config={supabaseConfig}
        onConfigUpdated={() => setSupabaseConfig(getStoredSupabaseConfig())}
      />

      {/* In-App Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onNavigate={handleNavigateView}
      />

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        onNavigate={handleNavigateView}
        onAddProduceVoice={handleAddProduceVoice}
        products={products}
        opportunities={demandOpportunities}
      />

      {/* Dispute & Safety Reporting Modal */}
      <DisputeModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        defaultReportedName={disputeReportedName}
      />

      {/* Supplier Privacy Shield Modal */}
      <SupplierPrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        farm={privacyFarm || (farms.length > 0 ? farms[0] : null)}
        onUpdatePrivacy={handleUpdatePrivacy}
      />

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigateView}
        onOpenFarmerPortal={() => handleNavigateView('farmer_portal')}
        onOpenRFQ={() => setIsRFQModalOpen(true)}
        onOpenSupabase={() => setIsSupabaseModalOpen(true)}
      />

    </div>
  );
}

export default App;
