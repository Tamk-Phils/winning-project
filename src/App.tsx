import { useState, useEffect } from 'react';
import type { 
  Farm, 
  Product, 
  CartItem, 
  Order, 
  BulkRFQ, 
  ProductCategory,
  AppView 
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
import { Footer } from './components/Footer';

const CART_STORAGE_KEY = 'agriflow_cart_v1';

export function App() {
  // Data States
  const [farms, setFarms] = useState<Farm[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
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

  // Load initial data
  useEffect(() => {
    async function loadData() {
      const loadedFarms = await fetchFarms();
      const loadedProducts = await fetchProducts();
      const loadedOrders = await fetchOrders();
      setFarms(loadedFarms);
      setProducts(loadedProducts);
      setOrders(loadedOrders);
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
  };

  // Wholesale RFQ
  const handleSubmitRFQ = async (rfq: BulkRFQ) => {
    await submitBulkRFQ(rfq);
  };

  // Quick farm filter
  const handleFilterByFarm = (farmName: string) => {
    setSearchQuery(farmName);
    setActiveView('marketplace');
  };

  const handleNavigateView = (view: AppView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeView === 'marketplace' && (
          <>
            {/* Hero Section */}
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

            {/* Marketplace Grid */}
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

            {/* Verified Farm Provenance Preview */}
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
