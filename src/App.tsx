import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
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
  SupplierPrivacySettings,
  ServiceProvider
} from './types';
import {
  fetchFarms,
  fetchProducts,
  fetchOrders,
  deleteProduct,
  updateFarm,
  saveFarm,
  saveProduct,
  saveOrder,
  submitBulkRFQ,
  getStoredSupabaseConfig,
  getSupabase
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
  addNotification,
  subscribeToNotifications
} from './lib/communicationServices';
import { getStoredServiceProviders } from './lib/agriflowStore';

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
import { AIAssistantWidget } from './components/AIAssistantWidget';
import { ServiceHubView } from './components/ServiceHubView';
import { SupplierProfileView } from './components/SupplierProfileView';
import { ServiceProviderProfileView } from './components/ServiceProviderProfileView';
import { DisputeModal } from './components/DisputeModal';
import { SupplierPrivacyModal } from './components/SupplierPrivacyModal';
import { Footer } from './components/Footer';
import { Sparkles } from 'lucide-react';
import { AuthModal } from './components/AuthModal';

const CART_STORAGE_KEY = 'agriflow_cart_v1';

export function App() {
  // Data States
  const [farms, setFarms] = useState<Farm[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>(() => getStoredServiceProviders());
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

  // Dedicated profile selectors
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isRFQModalOpen, setIsRFQModalOpen] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(getStoredSupabaseConfig());
  const [dataNotice, setDataNotice] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Upgraded Feature Modals
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState<boolean>(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState<boolean>(false);
  const [disputeReportedName, setDisputeReportedName] = useState<string>('');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [privacyFarm, setPrivacyFarm] = useState<Farm | null>(null);
  const [activeChatId, setActiveChatId] = useState<string>('');

  // URL Route Synchronization (/admin route support)
  useEffect(() => {
    const syncRouteFromUrl = () => {
      const pathname = window.location.pathname.replace(/\/$/, '');
      const hash = window.location.hash;
      if (pathname === '/admin' || hash === '#admin') {
        setActiveView('admin_dashboard');
      }
    };

    syncRouteFromUrl();
    window.addEventListener('popstate', syncRouteFromUrl);
    window.addEventListener('hashchange', syncRouteFromUrl);
    return () => {
      window.removeEventListener('popstate', syncRouteFromUrl);
      window.removeEventListener('hashchange', syncRouteFromUrl);
    };
  }, []);

  // Supabase Auth session listener
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setSession(null);
      return;
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, [supabaseConfig.isConnected]);

  useEffect(() => {
    if (!session?.user) return;
    return subscribeToNotifications(session.user.id, (notification) => {
      setNotifications((current) => current.some((item) => item.id === notification.id) ? current : [notification, ...current]);
    });
  }, [session?.user]);

  // Load operational data (unconditionally loads from local-first shared operational store)
  useEffect(() => {
    async function loadData() {
      try {
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
          fetchFarms(), fetchProducts(), fetchOrders(), fetchDemandOpportunities(),
          fetchNotifications(), fetchEmailLogs(), fetchSmsLogs(), fetchDisputes()
        ]);

        setFarms(loadedFarms); 
        setProducts(loadedProducts); 
        setOrders(loadedOrders);
        setDemandOpportunities(loadedOpps); 
        setNotifications(loadedNotifs);
        setEmailLogs(loadedEmails); 
        setSmsLogs(loadedSms); 
        setDisputes(loadedDisputes);
        setServiceProviders(getStoredServiceProviders());
        setDataNotice(null);
      } catch (error: unknown) {
        console.error('Data load error:', error);
      }
    }
    loadData();
  }, [supabaseConfig.isConnected]);

  // Listen to cross-component data updates from central operational store
  useEffect(() => {
    const reloadOperationalData = async () => {
      try {
        const [f, p, o] = await Promise.all([fetchFarms(), fetchProducts(), fetchOrders()]);
        setFarms(f);
        setProducts(p);
        setOrders(o);
        setServiceProviders(getStoredServiceProviders());
      } catch (err) {
        console.warn('Failed to sync updated store data:', err);
      }
    };

    window.addEventListener('agriflow-data-updated', reloadOperationalData);
    return () => window.removeEventListener('agriflow-data-updated', reloadOperationalData);
  }, []);

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
    const result = await saveProduct(newProduct);
    if (!result.success) {
      setDataNotice(result.error || 'The listing was not saved.');
      return;
    }
    setProducts((prev) => [result.product, ...prev]);

    // Alert via in-app notification
    try {
      await addNotification({
        id: `notif-prod-${Date.now()}`,
        type: 'order_update',
        title: 'New Harvest Batch Listed',
        message: `${result.product.name} (${result.product.stockQuantity} ${result.product.stockUnit}) is now visible to regional & export buyers.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        targetView: 'marketplace'
      });
    } catch (error) { console.warn('Listing notification was not saved:', error); }
  };

  const handleDeleteProduct = async (productId: string) => {
    const result = await deleteProduct(productId);
    if (!result.success) {
      setDataNotice(result.error || 'The product was not deleted.');
      return;
    }
    setProducts((prev) => prev.filter(p => p.id !== productId));
  };

  // Farmer Onboarding: Add New Farm
  const handleRegisterFarm = async (newFarm: Farm) => {
    const result = await saveFarm(newFarm);
    if (!result.success) {
      setDataNotice(result.error || 'The supplier profile was not saved.');
      return;
    }
    setFarms((prev) => [result.farm, ...prev]);
  };

  // Order Placement
  const handleOrderPlaced = async (order: Order) => {
    const result = await saveOrder(order);
    if (!result.success) {
      setDataNotice(result.error || 'The order was not saved.');
      return;
    }
    setOrders((prev) => [result.order, ...prev]);

    try {
      await addNotification({
        id: `notif-ord-${Date.now()}`,
        type: 'order_update',
        title: `Order Placed #${result.order.id}`,
        message: `Total: ${result.order.total} XAF. Cold-chain dispatch scheduled.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        targetView: 'orders'
      });
    } catch (error) { console.warn('Order notification was not saved:', error); }
  };

  // Wholesale RFQ
  const handleSubmitRFQ = async (rfq: BulkRFQ) => {
    const result = await submitBulkRFQ(rfq);
    if (!result.success) {
      setDataNotice(result.error || 'The RFQ was not saved.');
      return;
    }
    try {
      await addNotification({
        id: `notif-rfq-${Date.now()}`,
        type: 'match_alert',
        title: 'Wholesale RFQ Submitted',
        message: `RFQ for ${rfq.volumeNeeded} ${rfq.produceNeeded} forwarded to certified cooperatives.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        targetView: 'wholesale_hub'
      });
    } catch (error) { console.warn('RFQ notification was not saved:', error); }
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
  const handleUpdatePrivacy = async (farmId: string, settings: SupplierPrivacySettings) => {
    const farm = farms.find((item) => item.id === farmId);
    if (!farm) return;
    const result = await updateFarm({ ...farm, privacySettings: settings });
    if (!result.success) {
      setDataNotice(result.error || 'Privacy settings were not saved.');
      return;
    }
    setFarms((prev) => prev.map(item => item.id === farmId ? result.farm : item));
  };

  // Open Live Chat from Demand Radar or other cards
  const handleOpenLiveChat = (_buyerId: string, _buyerName: string, _subject: string, _oppId?: string) => {
    setActiveChatId('');
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
    if (!farms[0]) {
      setDataNotice('Voice listing requires a saved supplier profile. Register a farm first.');
      return;
    }
    const farm = farms[0];
    const newProd: Product = {
      id: `prod-voice-${Date.now()}`,
      name: produceName,
      category: 'fruits',
      variety: 'Giant French Horn Export Grade',
      farmId: farm.id,
      farmName: farm.name,
      farmLocation: `${farm.location}, ${farm.state}`,
      farmAvatar: farm.avatar,
      description: `Voice-listed fresh harvest batch from ${farm.name}.`,
      imageUrl: farm.bannerImage,
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
    if (view === 'admin_dashboard') {
      if (window.location.pathname !== '/admin') {
        window.history.pushState(null, '', '/admin');
      }
    } else {
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        window.history.pushState(null, '', '/');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProtectedView = (view: AppView) => {
    if (!session) {
      setIsAuthOpen(true);
      setDataNotice('Sign in to access supplier, chat, dispute, and administration features.');
      return;
    }
    handleNavigateView(view);
  };

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="site-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Global Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={(view) => view === 'farmer_portal' || view === 'live_chat' ? handleProtectedView(view) : handleNavigateView(view)}
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
        chatUnreadCount={0}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {dataNotice && (
          <div role="status" style={{ background: 'var(--amber-50)', color: 'var(--amber-600)', borderBottom: '1px solid var(--amber-100)', padding: '10px 20px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>
            {dataNotice}
          </div>
        )}

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
                serviceProviders={serviceProviders}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedRegion={selectedRegion}
                onAddToCart={handleAddToCart}
                onSelectProduct={setSelectedProduct}
                onSelectFarm={(farmId) => {
                  setSelectedSupplierId(farmId);
                  handleNavigateView('supplier_profile');
                }}
                onSelectProvider={(providerId) => {
                  setSelectedProviderId(providerId);
                  handleNavigateView('provider_profile');
                }}
                onNavigateServices={() => handleNavigateView('services')}
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

        {/* Dedicated Full-Page Supplier Profile */}
        {activeView === 'supplier_profile' && (
          <SupplierProfileView
            farmId={selectedSupplierId || (farms[0]?.id ?? 'farm-mbang-01')}
            onAddToCart={handleAddToCart}
            onBack={() => handleNavigateView('marketplace')}
          />
        )}

        {/* Dedicated Full-Page Service Specialist Profile */}
        {activeView === 'provider_profile' && (
          <ServiceProviderProfileView
            providerId={selectedProviderId || (serviceProviders[0]?.id ?? 'sp-01')}
            onBack={() => handleNavigateView('services')}
          />
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
            currentUser={session?.user ? { id: session.user.id, name: session.user.email || 'AgriFlow user', role: 'supplier' } : null}
          />
        )}

        {/* Admin Dashboard & Complete Platform Management View */}
        {activeView === 'admin_dashboard' && (
          <AdminDashboardView
            opportunities={demandOpportunities}
            farms={farms}
            products={products}
            disputes={disputes}
            emailLogs={emailLogs}
            smsLogs={smsLogs}
            supabaseConnected={supabaseConfig.isConnected}
            isAdmin={session?.user.app_metadata?.role === 'admin' || session?.user.user_metadata?.role === 'admin'}
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

        {/* Service Booking Hub Page */}
        {activeView === 'services' && (
          <ServiceHubView
            onNavigateMarketplace={() => handleNavigateView('marketplace')}
            onOpenLiveChat={() => handleProtectedView('live_chat')}
            onSelectProvider={(providerId) => {
              setSelectedProviderId(providerId);
              handleNavigateView('provider_profile');
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

        {/* Verified Suppliers & Farms Showcase Page */}
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
            onGoToFarmerPortal={() => handleProtectedView('farmer_portal')}
          />
        )}

        {/* Soil Health & Sustainability Impact Page */}
        {activeView === 'impact' && (
          <ImpactView
            isLiveDataAvailable={farms.length > 0 && products.length > 0}
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

      {/* Floating Accessible AI Assistant Launch Button */}
      {!isVoiceAssistantOpen && (
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
              padding: '12px 20px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary-900)',
              color: '#ffffff',
              border: '2px solid rgba(52, 211, 153, 0.4)',
              boxShadow: 'var(--shadow-xl)',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.88rem',
              transition: 'all 0.2s ease'
            }}
            title="AgriFlow AI Copilot (Background Voice Assistant)"
          >
            <Sparkles size={18} color="#86efac" />
            <span>AgriFlow Copilot</span>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#34d399',
              boxShadow: '0 0 8px #34d399'
            }} />
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onSelectFarm={(farmId) => {
          setSelectedProduct(null);
          setSelectedSupplierId(farmId);
          handleNavigateView('supplier_profile');
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

      {/* AI Assistant Floating Background Widget */}
      <AIAssistantWidget
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        onNavigate={handleNavigateView}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSupabase={() => setIsSupabaseModalOpen(true)}
        onSearch={(query) => {
          setSearchQuery(query);
          handleNavigateView('marketplace');
        }}
        onAddProduceVoice={handleAddProduceVoice}
        products={products}
        opportunities={demandOpportunities}
        unreadNotificationCount={unreadNotificationCount}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onAuthenticated={() => setIsAuthOpen(false)} />

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
