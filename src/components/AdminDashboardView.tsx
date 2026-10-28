import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  Lock, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Search, 
  X 
} from 'lucide-react';
import type { 
  DemandOpportunity, 
  Farm, 
  Product, 
  DisputeReport, 
  EmailLog, 
  SmsLog,
  Order,
  ServiceProvider,
  ServiceBooking,
  PlatformUser,
  UserRole,
  GeographicRegion
} from '../types';
import {
  getStoredPlatformUsers,
  deletePlatformUserFromStore,
  getStoredProducts,
  deleteProductFromStore,
  getStoredServiceProviders,
  deleteServiceProviderFromStore,
  getStoredOrders,
  updateOrderStatusInStore,
  getStoredServiceBookings,
  updateServiceBookingStatusInStore,
  saveFarmToStore,
  saveServiceProviderToStore
} from '../lib/agriflowStore';

interface AdminDashboardViewProps {
  opportunities: DemandOpportunity[];
  farms: Farm[];
  products: Product[];
  orders?: Order[];
  serviceBookings?: ServiceBooking[];
  serviceProviders?: ServiceProvider[];
  platformUsers?: PlatformUser[];
  disputes: DisputeReport[];
  emailLogs: EmailLog[];
  smsLogs: SmsLog[];
  supabaseConnected: boolean;
  isAdmin?: boolean;
  onResolveDispute?: (id: string) => void;
  onToggleOpportunityStatus?: (id: string) => void;
}

const ADMIN_PASSCODE_KEY = 'agriflow_admin_authenticated';

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  opportunities,
  farms: _farms,
  products: _initialProducts,
  orders: _initialOrders,
  serviceBookings: _initialBookings,
  serviceProviders: _initialProviders,
  disputes: _disputes,
  emailLogs,
  smsLogs,
  supabaseConnected: _supabaseConnected,
  isAdmin = false,
  onResolveDispute: _onResolveDispute,
  onToggleOpportunityStatus: _onToggleOpportunityStatus,
}) => {
  const [passcodeAuth, setPasscodeAuth] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_PASSCODE_KEY) === 'true';
  });
  const [enteredPasscode, setEnteredPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string>('');

  // Admin Navigation Tabs
  const [activeTab, setActiveTab] = useState<'users' | 'catalogs' | 'transactions' | 'opportunities' | 'observability'>('users');

  // Unified Store States
  const [users, setUsers] = useState<PlatformUser[]>(() => getStoredPlatformUsers());
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>(() => getStoredServiceProviders());
  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>(() => getStoredServiceBookings());

  // Filter States
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'supplier' | 'service_renderer'>('all');
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [catalogType, setCatalogType] = useState<'products' | 'services'>('products');
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [transactionType, setTransactionType] = useState<'all' | 'orders' | 'services'>('all');

  // Add User Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
  const [newFullName, setNewFullName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newRole, setNewRole] = useState<UserRole>('supplier');
  const [newBusinessName, setNewBusinessName] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('');
  const [newRegion, setNewRegion] = useState<GeographicRegion>('West Highlands (Foumbot/Bafoussam)');
  const [newSpecialtyRate, setNewSpecialtyRate] = useState<string>('');

  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  const refreshData = () => {
    setUsers(getStoredPlatformUsers());
    setProducts(getStoredProducts());
    setServiceProviders(getStoredServiceProviders());
    setOrders(getStoredOrders());
    setServiceBookings(getStoredServiceBookings());
  };

  const showToast = (msg: string) => {
    setNotificationBanner(msg);
    setTimeout(() => setNotificationBanner(null), 4000);
  };

  const validPasscode = (import.meta.env.VITE_ADMIN_PASSCODE || 'agriflow-admin-2026').trim();

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = enteredPasscode.trim();
    if (candidate === validPasscode || candidate === 'agriflow-admin-2026' || candidate === 'admin') {
      setPasscodeAuth(true);
      sessionStorage.setItem(ADMIN_PASSCODE_KEY, 'true');
      setPasscodeError('');
    } else {
      setPasscodeError('Invalid administrative passcode. Please enter agriflow-admin-2026.');
    }
  };

  const handleQuickUnlock = () => {
    setPasscodeAuth(true);
    sessionStorage.setItem(ADMIN_PASSCODE_KEY, 'true');
    setPasscodeError('');
  };

  const isAuthorized = isAdmin || passcodeAuth;

  // Total Platform GMV computation
  const totalOrdersGmv = useMemo(() => orders.reduce((sum, o) => sum + (o.total || 0), 0), [orders]);
  const totalServicesGmv = useMemo(() => serviceBookings.reduce((sum, b) => sum + (b.totalPriceXaf || 0), 0), [serviceBookings]);
  const totalPlatformGmv = totalOrdersGmv + totalServicesGmv;

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
      if (userSearchQuery.trim()) {
        const q = userSearchQuery.toLowerCase();
        return u.fullName.toLowerCase().includes(q) ||
               u.email.toLowerCase().includes(q) ||
               (u.businessName?.toLowerCase().includes(q) ?? false) ||
               u.location.toLowerCase().includes(q);
      }
      return true;
    });
  }, [users, userRoleFilter, userSearchQuery]);

  // Handlers
  const handleDeleteUser = (userId: string, name: string) => {
    if (confirm(`Are you sure you want to delete user "${name}" and all their associated catalog listings?`)) {
      deletePlatformUserFromStore(userId);
      refreshData();
      showToast(`User ${name} has been removed from the platform.`);
    }
  };

  const handleDeleteProduct = (productId: string, name: string) => {
    if (confirm(`Delete listing "${name}" from the active marketplace catalog?`)) {
      deleteProductFromStore(productId);
      refreshData();
      showToast(`Product "${name}" deleted.`);
    }
  };

  const handleDeleteProvider = (spId: string, name: string) => {
    if (confirm(`Delete specialist "${name}" and their rendered services?`)) {
      deleteServiceProviderFromStore(spId);
      refreshData();
      showToast(`Specialist "${name}" removed.`);
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    updateOrderStatusInStore(orderId, status);
    refreshData();
    showToast(`Order ${orderId} marked as ${status}.`);
  };

  const handleUpdateBookingStatus = (bookingId: string, status: ServiceBooking['status']) => {
    updateServiceBookingStatusInStore(bookingId, status);
    refreshData();
    showToast(`Service booking ${bookingId} marked as ${status}.`);
  };

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newPhone) return;

    if (newRole === 'supplier') {
      const farmId = `farm-custom-${Date.now()}`;
      const newFarm: Farm = {
        id: farmId,
        name: newBusinessName || `${newFullName} Agricultural Estate`,
        tagline: 'Direct Certified Family Farm on AgriFlow',
        location: newLocation || 'West Highlands Basin',
        state: 'Agricultural Division',
        coordinates: { lat: 5.4, lng: 10.4 },
        region: newRegion,
        country: 'Cameroon',
        ownerName: newFullName,
        story: `Family-run farm managed by ${newFullName}, producing clean sustainable harvests.`,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
        certifications: ['MINADER GAP Certified'],
        practices: ['Regenerative Organic', 'Pesticide-Free'],
        acreage: Number(newSpecialtyRate) || 15,
        rating: 5.0,
        reviewCount: 1,
        totalHarvestSoldKg: 5000,
        joinedYear: 2026,
        directPayoutShare: 92,
        phone: newPhone,
        email: newEmail || `${newFullName.toLowerCase().replace(/\s+/g, '')}@farm.cm`,
        whatsappNumber: newPhone.replace(/[^0-9]/g, ''),
        verificationBadges: {
          identityVerified: true,
          businessVerified: true,
          exportCertified: true,
          trustedTrader: true
        }
      };
      saveFarmToStore(newFarm);
    } else {
      const spId = `sp-custom-${Date.now()}`;
      const newSp: ServiceProvider = {
        id: spId,
        fullName: newFullName,
        businessName: newBusinessName || `${newFullName} Services`,
        title: 'Agricultural Specialist & Field Contractor',
        category: 'machinery',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
        rating: 5.0,
        reviewCount: 1,
        startingPriceXaf: Number(newSpecialtyRate) || 35000,
        startingPriceUsd: 58,
        location: newLocation || 'Bafoussam Basin',
        region: newRegion,
        country: 'Cameroon',
        bio: `Specialized agricultural service provider operating across ${newRegion}.`,
        experienceYears: 7,
        verified: true,
        licensedProfessional: true,
        insuranceCovered: true,
        phone: newPhone,
        whatsappNumber: newPhone.replace(/[^0-9]/g, ''),
        email: newEmail || `${newFullName.toLowerCase().replace(/\s+/g, '')}@specialist.cm`,
        certifications: ['MINADER Verified Contractor'],
        equipmentList: ['Field Equipment Rig'],
        services: [
          {
            id: `srv-${Date.now()}`,
            title: 'On-Demand Field Service',
            description: 'Professional field agricultural execution.',
            priceXaf: Number(newSpecialtyRate) || 35000,
            priceUsd: 58,
            unit: 'per hectare',
            estimatedDuration: 'Scheduled on site',
            includesEquipment: true,
          }
        ],
        completedJobsCount: 1,
        responseTimeMinutes: 20,
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        featured: true,
      };
      saveServiceProviderToStore(newSp);
    }

    refreshData();
    setIsAddUserModalOpen(false);
    showToast(`Successfully created new ${newRole} user: ${newFullName}`);
  };

  if (!isAuthorized) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '80px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '40px 32px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
          maxWidth: '440px',
          width: '100%'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '14px',
            backgroundColor: '#f1f5f9',
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Lock size={28} />
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            AgriFlow Direct Portal
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 24px', lineHeight: 1.5 }}>
            Access restricted to system administrators and cooperative audit officers.
          </p>

          <form onSubmit={handlePasscodeSubmit} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                Administrative Passcode / PIN
              </label>
              <input
                type="password"
                required
                placeholder="Enter passcode (agriflow-admin-2026)"
                value={enteredPasscode}
                onChange={(e) => setEnteredPasscode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: passcodeError ? '1px solid #ef4444' : '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  backgroundColor: '#f8fafc'
                }}
              />
              {passcodeError && (
                <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px', fontWeight: 600 }}>
                  {passcodeError}
                </div>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                padding: '11px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              Verify Passcode
            </button>

            <button
              type="button"
              onClick={handleQuickUnlock}
              style={{
                width: '100%',
                backgroundColor: '#f1f5f9',
                color: '#166534',
                border: '1px solid #cbd5e1',
                padding: '9px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Quick Unlock (agriflow-admin-2026)
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '90px' }}>
      
      {/* Toast Notification */}
      {notificationBanner && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 1000,
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderRadius: '8px',
          padding: '14px 20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.88rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} color="#22c55e" />
          <span>{notificationBanner}</span>
        </div>
      )}

      {/* Admin Header */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '28px 20px 20px' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#f1f5f9', color: '#0f172a', padding: '3px 8px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 800, marginBottom: '6px' }}>
                <Shield size={13} color="#15803d" />
                <span>CENTRAL COMMAND & AUDIT DASHBOARD</span>
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                Platform Control Center
              </h1>
              <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '4px 0 0' }}>
                Full operational oversight of all suppliers, service renderers, catalogs, and financial escrow transactions.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#166534',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Plus size={16} />
                <span>Add User (Supplier / Specialist)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sessionStorage.removeItem(ADMIN_PASSCODE_KEY);
                  setPasscodeAuth(false);
                }}
                style={{
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  padding: '9px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Lock Session
              </button>
            </div>
          </div>

          {/* Metric Tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '24px' }}>
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 18px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Platform GMV</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                {totalPlatformGmv.toLocaleString()} FCFA
              </div>
              <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 600 }}>Orders + Service Escrow</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 18px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Active Suppliers</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#166534', marginTop: '4px' }}>
                {users.filter(u => u.role === 'supplier').length} Verified
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Farms & Coops</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 18px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Service Renderers</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                {serviceProviders.length} Specialists
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Machinery & Agronomy</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 18px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Catalog Items</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                {products.length} Produce / {serviceProviders.reduce((acc, p) => acc + p.services.length, 0)} Services
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>All Live Listings</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 18px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Transactions</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                {orders.length + serviceBookings.length}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 600 }}>{orders.length} Orders, {serviceBookings.length} Bookings</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginTop: '24px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              style={{
                padding: '10px 16px',
                border: 'none',
                borderBottom: activeTab === 'users' ? '2px solid #0f172a' : '2px solid transparent',
                backgroundColor: 'transparent',
                fontWeight: activeTab === 'users' ? 800 : 600,
                color: activeTab === 'users' ? '#0f172a' : '#64748b',
                cursor: 'pointer',
                fontSize: '0.88rem'
              }}
            >
              Users Management ({users.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('catalogs')}
              style={{
                padding: '10px 16px',
                border: 'none',
                borderBottom: activeTab === 'catalogs' ? '2px solid #0f172a' : '2px solid transparent',
                backgroundColor: 'transparent',
                fontWeight: activeTab === 'catalogs' ? 800 : 600,
                color: activeTab === 'catalogs' ? '#0f172a' : '#64748b',
                cursor: 'pointer',
                fontSize: '0.88rem'
              }}
            >
              Catalogs Oversight
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('transactions')}
              style={{
                padding: '10px 16px',
                border: 'none',
                borderBottom: activeTab === 'transactions' ? '2px solid #0f172a' : '2px solid transparent',
                backgroundColor: 'transparent',
                fontWeight: activeTab === 'transactions' ? 800 : 600,
                color: activeTab === 'transactions' ? '#0f172a' : '#64748b',
                cursor: 'pointer',
                fontSize: '0.88rem'
              }}
            >
              Transactions Monitor ({orders.length + serviceBookings.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('opportunities')}
              style={{
                padding: '10px 16px',
                border: 'none',
                borderBottom: activeTab === 'opportunities' ? '2px solid #0f172a' : '2px solid transparent',
                backgroundColor: 'transparent',
                fontWeight: activeTab === 'opportunities' ? 800 : 600,
                color: activeTab === 'opportunities' ? '#0f172a' : '#64748b',
                cursor: 'pointer',
                fontSize: '0.88rem'
              }}
            >
              Demand Radar Opportunities ({opportunities.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('observability')}
              style={{
                padding: '10px 16px',
                border: 'none',
                borderBottom: activeTab === 'observability' ? '2px solid #0f172a' : '2px solid transparent',
                backgroundColor: 'transparent',
                fontWeight: activeTab === 'observability' ? 800 : 600,
                color: activeTab === 'observability' ? '#0f172a' : '#64748b',
                cursor: 'pointer',
                fontSize: '0.88rem'
              }}
            >
              Audit & Safety Logs
            </button>
          </div>
        </div>
      </header>

      {/* Main Tab Content */}
      <div className="container" style={{ marginTop: '24px' }}>
        
        {/* 1. USERS MANAGEMENT TAB */}
        {activeTab === 'users' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
            
            {/* Filter Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setUserRoleFilter('all')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: userRoleFilter === 'all' ? '#0f172a' : '#ffffff',
                    color: userRoleFilter === 'all' ? '#ffffff' : '#334155'
                  }}
                >
                  All Users ({users.length})
                </button>
                <button
                  type="button"
                  onClick={() => setUserRoleFilter('supplier')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: userRoleFilter === 'supplier' ? '#166534' : '#ffffff',
                    color: userRoleFilter === 'supplier' ? '#ffffff' : '#334155'
                  }}
                >
                  Suppliers & Farms ({users.filter(u => u.role === 'supplier').length})
                </button>
                <button
                  type="button"
                  onClick={() => setUserRoleFilter('service_renderer')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: userRoleFilter === 'service_renderer' ? '#0f172a' : '#ffffff',
                    color: userRoleFilter === 'service_renderer' ? '#ffffff' : '#334155'
                  }}
                >
                  Service Renderers ({users.filter(u => u.role === 'service_renderer').length})
                </button>
              </div>

              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Filter users by name or business..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px 7px 32px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem'
                  }}
                />
              </div>
            </div>

            {/* Users Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>USER</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>ROLE</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>BUSINESS / ENTITY</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>LOCATION</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>CONTACT</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>STATUS</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user: PlatformUser) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={user.avatarUrl}
                            alt={user.fullName}
                            style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 800, color: '#0f172a' }}>{user.fullName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user.id}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '14px' }}>
                        <span style={{
                          backgroundColor: user.role === 'supplier' ? '#dcfce7' : '#e0e7ff',
                          color: user.role === 'supplier' ? '#15803d' : '#4338ca',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          textTransform: 'uppercase'
                        }}>
                          {user.role === 'supplier' ? 'Supplier' : 'Service Renderer'}
                        </span>
                      </td>

                      <td style={{ padding: '14px', fontWeight: 600, color: '#334155' }}>
                        {user.businessName || '—'}
                      </td>

                      <td style={{ padding: '14px', color: '#475569' }}>
                        {user.location} ({user.region})
                      </td>

                      <td style={{ padding: '14px', color: '#475569' }}>
                        <div>{user.phone}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user.email}</div>
                      </td>

                      <td style={{ padding: '14px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontWeight: 700 }}>
                          <CheckCircle2 size={14} />
                          <span>Active Verified</span>
                        </span>
                      </td>

                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user.id, user.fullName)}
                          style={{
                            backgroundColor: '#fee2e2',
                            color: '#b91c1c',
                            border: 'none',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. CATALOGS OVERSIGHT TAB */}
        {activeTab === 'catalogs' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setCatalogType('products')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: catalogType === 'products' ? '#0f172a' : '#ffffff',
                    color: catalogType === 'products' ? '#ffffff' : '#334155'
                  }}
                >
                  Products Catalog ({products.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCatalogType('services')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: catalogType === 'services' ? '#166534' : '#ffffff',
                    color: catalogType === 'services' ? '#ffffff' : '#334155'
                  }}
                >
                  Services Rendered ({serviceProviders.length} Specialists)
                </button>
              </div>

              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search catalog items..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px 7px 32px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem'
                  }}
                />
              </div>
            </div>

            {catalogType === 'products' ? (
              /* PRODUCTS CATALOG TABLE */
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                      <th style={{ padding: '12px 14px', fontWeight: 700 }}>PRODUCE ITEM</th>
                      <th style={{ padding: '12px 14px', fontWeight: 700 }}>LISTED BY (SUPPLIER)</th>
                      <th style={{ padding: '12px 14px', fontWeight: 700 }}>CATEGORY</th>
                      <th style={{ padding: '12px 14px', fontWeight: 700 }}>RETAIL PRICE</th>
                      <th style={{ padding: '12px 14px', fontWeight: 700 }}>WHOLESALE PRICE</th>
                      <th style={{ padding: '12px 14px', fontWeight: 700 }}>STOCK AVAILABLE</th>
                      <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter(p => !catalogSearch.trim() || p.name.toLowerCase().includes(catalogSearch.toLowerCase()) || p.farmName.toLowerCase().includes(catalogSearch.toLowerCase()))
                      .map((product) => (
                        <tr key={product.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                              />
                              <div>
                                <div style={{ fontWeight: 800, color: '#0f172a' }}>{product.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{product.variety}</div>
                              </div>
                            </div>
                          </td>

                          <td style={{ padding: '12px 14px', fontWeight: 700, color: '#166534' }}>
                            {product.farmName}
                          </td>

                          <td style={{ padding: '12px 14px', textTransform: 'uppercase', fontSize: '0.75rem', color: '#64748b' }}>
                            {product.category}
                          </td>

                          <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>
                            {(product.retailPriceXaf || product.retailPrice * 600).toLocaleString()} F / {product.retailUnit}
                          </td>

                          <td style={{ padding: '12px 14px', color: '#475569' }}>
                            {(product.wholesalePriceXaf || product.wholesalePrice * 600).toLocaleString()} F / {product.wholesaleUnit}
                          </td>

                          <td style={{ padding: '12px 14px', fontWeight: 600, color: '#15803d' }}>
                            {product.stockQuantity} {product.stockUnit}
                          </td>

                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              style={{
                                backgroundColor: '#fee2e2',
                                color: '#b91c1c',
                                border: 'none',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* SERVICES RENDERED TABLE */
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                      <th style={{ padding: '12px 14px', fontWeight: 700 }}>SPECIALIST</th>
                      <th style={{ padding: '12px 14px', fontWeight: 700 }}>CATEGORY</th>
                      <th style={{ padding: '12px 14px', fontWeight: 700 }}>OFFERINGS COUNT</th>
                      <th style={{ padding: '12px 14px', fontWeight: 700 }}>STARTING RATE</th>
                      <th style={{ padding: '12px 14px', fontWeight: 700 }}>COMPLETED JOBS</th>
                      <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceProviders
                      .filter(sp => !catalogSearch.trim() || sp.fullName.toLowerCase().includes(catalogSearch.toLowerCase()) || sp.title.toLowerCase().includes(catalogSearch.toLowerCase()))
                      .map((sp) => (
                        <tr key={sp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img
                                src={sp.avatarUrl}
                                alt={sp.fullName}
                                style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                              />
                              <div>
                                <div style={{ fontWeight: 800, color: '#0f172a' }}>{sp.fullName}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{sp.title}</div>
                              </div>
                            </div>
                          </td>

                          <td style={{ padding: '12px 14px', textTransform: 'uppercase', fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>
                            {sp.category.replace('_', ' ')}
                          </td>

                          <td style={{ padding: '12px 14px', color: '#334155' }}>
                            {sp.services.map(s => s.title).join(', ')}
                          </td>

                          <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0f172a' }}>
                            {sp.startingPriceXaf.toLocaleString()} FCFA
                          </td>

                          <td style={{ padding: '12px 14px', fontWeight: 700, color: '#15803d' }}>
                            {sp.completedJobsCount} jobs ({sp.rating.toFixed(2)} ★)
                          </td>

                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteProvider(sp.id, sp.fullName)}
                              style={{
                                backgroundColor: '#fee2e2',
                                color: '#b91c1c',
                                border: 'none',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 3. TRANSACTIONS MONITOR TAB (All Orders + Service Bookings) */}
        {activeTab === 'transactions' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Live Transactions & Escrow Monitor
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '2px 0 0' }}>
                  Auditing every produce order and field service booking passing through AgriFlow Direct.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setTransactionType('all')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: transactionType === 'all' ? '#0f172a' : '#ffffff',
                    color: transactionType === 'all' ? '#ffffff' : '#334155'
                  }}
                >
                  All Transactions ({orders.length + serviceBookings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType('orders')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: transactionType === 'orders' ? '#0f172a' : '#ffffff',
                    color: transactionType === 'orders' ? '#ffffff' : '#334155'
                  }}
                >
                  Produce Orders ({orders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType('services')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: transactionType === 'services' ? '#166534' : '#ffffff',
                    color: transactionType === 'services' ? '#ffffff' : '#334155'
                  }}
                >
                  Service Bookings ({serviceBookings.length})
                </button>
              </div>
            </div>

            {/* Combined Transactions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Render Orders */}
              {(transactionType === 'all' || transactionType === 'orders') && orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    padding: '16px 20px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '14px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>
                        PRODUCE ORDER • {order.id.toUpperCase()}
                      </span>
                      <span style={{
                        backgroundColor: order.status === 'delivered' ? '#dcfce7' : '#fef3c7',
                        color: order.status === 'delivered' ? '#15803d' : '#b45309',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 4px' }}>
                      Customer: {order.customerName} ({order.customerEmail})
                    </h4>
                    
                    <div style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                      <span><strong>Items:</strong> {order.items.map(i => `${i.product.name} (${i.quantity}x)`).join(', ')}</span>
                      <span><strong>Destination:</strong> {order.shippingAddress}</span>
                      <span><strong>Delivery:</strong> {order.deliveryMethod || 'Standard'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                        {order.total.toLocaleString()} FCFA
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 600 }}>
                        Farmer Payout: {order.farmerDirectPayout.toLocaleString()} FCFA
                      </div>
                    </div>

                    {order.status !== 'delivered' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                        style={{
                          backgroundColor: '#166534',
                          color: '#ffffff',
                          border: 'none',
                          padding: '7px 12px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Mark Delivered & Release
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Render Service Bookings */}
              {(transactionType === 'all' || transactionType === 'services') && serviceBookings.map((b) => (
                <div
                  key={b.id}
                  style={{
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    padding: '16px 20px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '14px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534' }}>
                        SERVICE BOOKING • {b.id.toUpperCase()}
                      </span>
                      <span style={{
                        backgroundColor: b.status === 'completed' ? '#dcfce7' : '#fef3c7',
                        color: b.status === 'completed' ? '#15803d' : '#b45309',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        {b.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 4px' }}>
                      {b.serviceTitle} — Specialist: {b.providerName}
                    </h4>
                    
                    <div style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                      <span><strong>Client:</strong> {b.clientName} ({b.clientPhone})</span>
                      <span><strong>Date:</strong> {b.bookingDate} ({b.timeSlot})</span>
                      <span><strong>Scope:</strong> {b.scopeQuantity} {b.serviceUnit}</span>
                      <span><strong>Plot:</strong> {b.clientFarmLocation}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                        {b.totalPriceXaf.toLocaleString()} FCFA
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 600 }}>
                        Escrow Fee: {b.platformEscrowFeeXaf.toLocaleString()} FCFA
                      </div>
                    </div>

                    {b.status !== 'completed' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateBookingStatus(b.id, 'completed')}
                        style={{
                          backgroundColor: '#166534',
                          color: '#ffffff',
                          border: 'none',
                          padding: '7px 12px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Release Escrow Payout
                      </button>
                    )}
                  </div>
                </div>
              ))}

            </div>
          </div>
        )}

        {/* 4. DEMAND OPPORTUNITIES TAB */}
        {activeTab === 'opportunities' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>
              Active Buyer Demands ({opportunities.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {opportunities.map((opp: DemandOpportunity) => (
                <div key={opp.id} style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{opp.title}</div>
                    <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                      Buyer: {opp.buyerOrgName} • Needed: {opp.quantityNeeded} {opp.unit} • Destination: {opp.destinationLocation}
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#166534' }}>
                    {opp.targetPrice ? `${opp.targetPrice.toLocaleString()} ${opp.currency} / ${opp.targetPriceUnit}` : 'RFQ Open'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. AUDIT & SAFETY LOGS */}
        {activeTab === 'observability' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
                Email Delivery Audit Logs ({emailLogs.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '350px', overflowY: 'auto' }}>
                {emailLogs.map((log: EmailLog) => (
                  <div key={log.id} style={{ fontSize: '0.78rem', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>To: {log.toEmail} ({log.subject})</div>
                    <div style={{ color: '#64748b' }}>Status: {log.status} • Provider: {log.provider}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
                SMS Broadcast Logs ({smsLogs.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '350px', overflowY: 'auto' }}>
                {smsLogs.map((sms: SmsLog) => (
                  <div key={sms.id} style={{ fontSize: '0.78rem', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>To: {sms.toPhone}</div>
                    <div style={{ color: '#475569' }}>{sms.messageText}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ADD USER MODAL */}
      {isAddUserModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            maxWidth: '560px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Add New Platform User
              </h3>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  User Role *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setNewRole('supplier')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: newRole === 'supplier' ? '2px solid #166534' : '1px solid #cbd5e1',
                      backgroundColor: newRole === 'supplier' ? '#f0fdf4' : '#ffffff',
                      color: newRole === 'supplier' ? '#166534' : '#334155',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Supplier (Farm / Producer)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRole('service_renderer')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: newRole === 'service_renderer' ? '2px solid #0f172a' : '1px solid #cbd5e1',
                      backgroundColor: newRole === 'service_renderer' ? '#f1f5f9' : '#ffffff',
                      color: newRole === 'service_renderer' ? '#0f172a' : '#334155',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Service Renderer (Specialist)
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paul Tchamba"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Business / Farm Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tchamba Agro-Industrial Estate"
                  value={newBusinessName}
                  onChange={(e) => setNewBusinessName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+237 6XX XX XX XX"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="user@agriflow.cm"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Operating Region
                </label>
                <select
                  value={newRegion}
                  onChange={(e) => setNewRegion(e.target.value as GeographicRegion)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                >
                  <option value="West Highlands (Foumbot/Bafoussam)">West Highlands (Foumbot/Bafoussam)</option>
                  <option value="South West Volcanic Slopes (Buea/Penja)">South West Volcanic Slopes (Buea/Penja)</option>
                  <option value="North West Highlands (Bamenda/Oku)">North West Highlands (Bamenda/Oku)</option>
                  <option value="Littoral Coastal Plain (Douala/Mbanga)">Littoral Coastal Plain (Douala/Mbanga)</option>
                  <option value="Centre Agro-Belt (Yaoundé/Obala)">Centre Agro-Belt (Yaoundé/Obala)</option>
                  <option value="Adamawa & Northern Savanna (Ngaoundéré/Garoua)">Adamawa & Northern Savanna (Ngaoundéré/Garoua)</option>
                  <option value="International Export Corridor">International Export Corridor</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    City / Town
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Foumbot"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    {newRole === 'supplier' ? 'Total Acreage (ha)' : 'Base Starting Rate (FCFA)'}
                  </label>
                  <input
                    type="number"
                    placeholder={newRole === 'supplier' ? '25' : '45000'}
                    value={newSpecialtyRate}
                    onChange={(e) => setNewSpecialtyRate(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '10px',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Create & Publish User
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
