import React, { useState, useMemo, useEffect } from 'react';
import { 
  Wrench, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  Plus, 
  MessageCircle, 
  ArrowRight, 
  X, 
  Tractor, 
  Plane, 
  Droplet, 
  Truck, 
  Activity, 
  FileCheck2, 
  Users, 
  Sparkles,
  Clock
} from 'lucide-react';
import type { 
  ServiceProvider, 
  ServiceBooking, 
  ServiceCategory, 
  GeographicRegion 
} from '../types';
import { 
  getStoredServiceProviders, 
  saveServiceProviderToStore, 
  getStoredServiceBookings, 
  updateServiceBookingStatusInStore 
} from '../lib/agriflowStore';

interface ServiceHubViewProps {
  onNavigateMarketplace?: () => void;
  onOpenLiveChat?: () => void;
  onSelectProvider?: (providerId: string) => void;
}

const CATEGORY_CHIPS: { id: ServiceCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All Services', icon: <Wrench size={15} /> },
  { id: 'agronomy', label: 'Agronomy & Soil', icon: <Sparkles size={15} /> },
  { id: 'machinery', label: 'Heavy Machinery & Tillage', icon: <Tractor size={15} /> },
  { id: 'drone_tech', label: 'Precision Ag Drones', icon: <Plane size={15} /> },
  { id: 'irrigation_solar', label: 'Solar & Irrigation', icon: <Droplet size={15} /> },
  { id: 'cold_chain', label: 'Refrigerated Fleet', icon: <Truck size={15} /> },
  { id: 'veterinary', label: 'Veterinary & Herd', icon: <Activity size={15} /> },
  { id: 'certification', label: 'Audits & PGI Certs', icon: <FileCheck2 size={15} /> },
  { id: 'harvest_labor', label: 'Harvest Brigades', icon: <Users size={15} /> },
];

const REGIONS: GeographicRegion[] = [
  'West Highlands (Foumbot/Bafoussam)',
  'Littoral & Coastal',
  'Centre & Yaoundé',
  'Southwest & Mt. Cameroon',
  'Northwest & Grassfields',
  'North & Adamawa',
  'Pacific West',
  'California Central Valley',
  'Midwest Prairies',
  'Sunbelt South',
  'International Export Corridor'
];

export const ServiceHubView: React.FC<ServiceHubViewProps> = ({
  onNavigateMarketplace: _onNavigateMarketplace,
  onOpenLiveChat: _onOpenLiveChat,
  onSelectProvider,
}) => {
  const [providers, setProviders] = useState<ServiceProvider[]>(() => getStoredServiceProviders());
  const [bookings, setBookings] = useState<ServiceBooking[]>(() => getStoredServiceBookings());

  // Listen for centralized updates
  useEffect(() => {
    const handleUpdate = () => {
      setProviders(getStoredServiceProviders());
      setBookings(getStoredServiceBookings());
    };
    window.addEventListener('agriflow-data-updated', handleUpdate);
    return () => window.removeEventListener('agriflow-data-updated', handleUpdate);
  }, []);

  // View state
  const [activeTab, setActiveTab] = useState<'browse' | 'my_bookings'>('browse');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc' | 'jobs'>('rating');

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // New Provider Form state
  const [regFullName, setRegFullName] = useState<string>('');
  const [regBusinessName, setRegBusinessName] = useState<string>('');
  const [regTitle, setRegTitle] = useState<string>('');
  const [regCategory, setRegCategory] = useState<ServiceCategory>('machinery');
  const [regLocation, setRegLocation] = useState<string>('');
  const [regRegion, setRegRegion] = useState<GeographicRegion>('West Highlands (Foumbot/Bafoussam)');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regExperience, setRegExperience] = useState<number>(5);
  const [regStartingPrice, setRegStartingPrice] = useState<number>(35000);
  const [regBio, setRegBio] = useState<string>('');
  const [regCertifications, setRegCertifications] = useState<string>('MINADER Certified Operator');
  const [regEquipment, setRegEquipment] = useState<string>('Heavy Tractor & Disc Plough');
  const [regServiceTitle, setRegServiceTitle] = useState<string>('Full Farm Mechanized Preparation');
  const [regServiceDesc, setRegServiceDesc] = useState<string>('Deep disc ploughing and furrow forming.');
  const [regServiceUnit, setRegServiceUnit] = useState<string>('per hectare');

  // Filtered & Sorted Providers
  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (selectedRegion !== 'all' && p.region !== selectedRegion) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.fullName.toLowerCase().includes(query) || (p.businessName?.toLowerCase().includes(query) ?? false);
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesLocation = p.location.toLowerCase().includes(query);
        const matchesServices = p.services.some(s => s.title.toLowerCase().includes(query) || s.description.toLowerCase().includes(query));
        if (!matchesName && !matchesTitle && !matchesLocation && !matchesServices) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'jobs') return b.completedJobsCount - a.completedJobsCount;
      if (sortBy === 'price_asc') return a.startingPriceXaf - b.startingPriceXaf;
      if (sortBy === 'price_desc') return b.startingPriceXaf - a.startingPriceXaf;
      return 0;
    });
  }, [providers, selectedCategory, selectedRegion, searchQuery, sortBy]);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName || !regTitle || !regPhone) return;

    const newProvider: ServiceProvider = {
      id: `sp-${Date.now()}`,
      fullName: regFullName,
      businessName: regBusinessName || `${regFullName} Agricultural Services`,
      title: regTitle,
      category: regCategory,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
      rating: 5.0,
      reviewCount: 1,
      startingPriceXaf: Number(regStartingPrice),
      startingPriceUsd: Math.round(Number(regStartingPrice) / 600),
      location: regLocation || 'Foumbot Agricultural Basin',
      region: regRegion,
      country: 'Cameroon',
      bio: regBio || 'Verified agricultural contractor on AgriFlow Direct.',
      experienceYears: Number(regExperience),
      verified: true,
      licensedProfessional: true,
      insuranceCovered: true,
      phone: regPhone,
      whatsappNumber: regPhone.replace(/[^0-9]/g, ''),
      email: regEmail || `${regFullName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      certifications: regCertifications.split(',').map(s => s.trim()).filter(Boolean),
      equipmentList: regEquipment.split(',').map(s => s.trim()).filter(Boolean),
      services: [
        {
          id: `srv-${Date.now()}`,
          title: regServiceTitle,
          description: regServiceDesc,
          priceXaf: Number(regStartingPrice),
          priceUsd: Math.round(Number(regStartingPrice) / 600),
          unit: regServiceUnit,
          estimatedDuration: 'Scheduled on site',
          includesEquipment: true,
        }
      ],
      completedJobsCount: 1,
      responseTimeMinutes: 20,
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      featured: true,
    };

    saveServiceProviderToStore(newProvider);
    setIsRegisterModalOpen(false);
    setNotificationMsg(`Your profile as ${newProvider.fullName} is now published in the Service Hub & Admin Dashboard!`);
    setTimeout(() => setNotificationMsg(null), 5000);
  };

  const handleUpdateBookingStatus = (id: string, status: ServiceBooking['status']) => {
    updateServiceBookingStatusInStore(id, status);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '90px' }}>
      
      {/* Subtle Toast Notification */}
      {notificationMsg && (
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
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Header Section (Restrained, Clean Professional Style) */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '40px 20px 28px' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#f1f5f9', color: '#166534', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '8px' }}>
                <ShieldCheck size={14} />
                <span>Agricultural Specialist Network & Field Machinery Hub</span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                Service Booking Hub
              </h1>
              <p style={{ fontSize: '0.94rem', color: '#64748b', margin: 0, maxWidth: '640px' }}>
                Book vetted tractor operators, agronomists, drone sprayers, solar irrigation technicians, and cold-chain haulers across Cameroon.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#166534',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 18px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
              >
                <Plus size={16} />
                <span>List Your Service</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'browse' ? 'my_bookings' : 'browse')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: activeTab === 'my_bookings' ? '#0f172a' : '#f1f5f9',
                  color: activeTab === 'my_bookings' ? '#ffffff' : '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Clock size={16} />
                <span>My Bookings ({bookings.length})</span>
              </button>
            </div>
          </div>

          {/* Category Chips Bar */}
          {activeTab === 'browse' && (
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '24px 0 4px', scrollbarWidth: 'none' }}>
              {CATEGORY_CHIPS.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: isActive ? '1px solid #166534' : '1px solid #e2e8f0',
                      backgroundColor: isActive ? '#166534' : '#ffffff',
                      color: isActive ? '#ffffff' : '#334155',
                      fontSize: '0.84rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container" style={{ marginTop: '24px' }}>
        
        {activeTab === 'browse' ? (
          <>
            {/* Search, Region & Sort Filter Bar */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '14px 18px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              
              {/* Search input */}
              <div style={{ position: 'relative', flexGrow: 1, minWidth: '240px' }}>
                <Search size={17} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search specialists by name, service (e.g. tillage, drone, soil test)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 38px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    backgroundColor: '#f8fafc'
                  }}
                />
              </div>

              {/* Region Filter */}
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                style={{
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  color: '#334155',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  fontWeight: 600
                }}
              >
                <option value="all">All Operating Regions</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  color: '#334155',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  fontWeight: 600
                }}
              >
                <option value="rating">Highest Rated</option>
                <option value="jobs">Most Jobs Completed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>

              <div style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>
                {filteredProviders.length} Specialists Available
              </div>
            </div>

            {/* Providers Grid */}
            {filteredProviders.length === 0 ? (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '60px 20px',
                textAlign: 'center',
                color: '#64748b'
              }}>
                <Wrench size={40} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                  No service specialists match your filter
                </h3>
                <p style={{ fontSize: '0.88rem', margin: '0 0 16px' }}>
                  Try resetting your category or search query to view all 20+ verified specialists.
                </p>
                <button
                  type="button"
                  onClick={() => { setSelectedCategory('all'); setSelectedRegion('all'); setSearchQuery(''); }}
                  style={{
                    backgroundColor: '#166534',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {filteredProviders.map((provider) => (
                  <div
                    key={provider.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#94a3b8';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    
                    {/* Card Header & Avatar */}
                    <div style={{ padding: '20px 20px 14px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                        <img
                          src={provider.avatarUrl}
                          alt={provider.fullName}
                          style={{
                            width: '58px',
                            height: '58px',
                            borderRadius: '12px',
                            objectFit: 'cover',
                            border: '1px solid #cbd5e1'
                          }}
                        />
                        <div style={{ flexGrow: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                              {provider.category.replace('_', ' ')}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                              <Star size={13} color="#eab308" fill="#eab308" />
                              <span>{provider.rating.toFixed(2)}</span>
                              <span style={{ color: '#94a3b8', fontWeight: 500 }}>({provider.reviewCount})</span>
                            </span>
                          </div>

                          <h3
                            onClick={() => onSelectProvider?.(provider.id)}
                            style={{
                              fontSize: '1.05rem',
                              fontWeight: 800,
                              color: '#0f172a',
                              margin: '2px 0 2px',
                              cursor: 'pointer'
                            }}
                          >
                            {provider.fullName}
                          </h3>
                          <div style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>
                            {provider.title}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b', marginTop: '10px' }}>
                        <MapPin size={13} color="#15803d" />
                        <span>{provider.location}</span>
                      </div>
                    </div>

                    {/* Services Summary */}
                    <div style={{ padding: '14px 20px', flexGrow: 1 }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
                        PRIMARY SERVICES ({provider.services.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {provider.services.slice(0, 2).map((srv) => (
                          <div
                            key={srv.id}
                            style={{
                              backgroundColor: '#f8fafc',
                              padding: '8px 10px',
                              borderRadius: '6px',
                              fontSize: '0.82rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <span style={{ fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                              {srv.title}
                            </span>
                            <span style={{ fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap' }}>
                              {srv.priceXaf.toLocaleString()} F
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Equipment preview */}
                      {provider.equipmentList.length > 0 && (
                        <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '10px' }}>
                          <span style={{ fontWeight: 700, color: '#334155' }}>Equipment: </span>
                          <span>{provider.equipmentList.slice(0, 2).join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Footer Actions */}
                    <div style={{
                      padding: '12px 20px',
                      backgroundColor: '#f8fafc',
                      borderTop: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Starting from</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                          {provider.startingPriceXaf.toLocaleString()} FCFA
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => onSelectProvider?.(provider.id)}
                          style={{
                            backgroundColor: '#0f172a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 14px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>View Profile & Book</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* MY BOOKINGS TRACKER */
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Active Service Bookings & Escrow Monitor
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0' }}>
                  Track field status, direct communication with your specialist, and escrow release.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                style={{
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '8px 14px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                + Book Another Service
              </button>
            </div>

            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                <Clock size={36} style={{ margin: '0 auto 10px', color: '#94a3b8' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>No bookings placed yet</h4>
                <p style={{ fontSize: '0.85rem' }}>Browse specialists to book machinery, agronomy, or cold-chain transit.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {bookings.map((booking) => {
                  const getStatusBadge = (status: ServiceBooking['status']) => {
                    switch (status) {
                      case 'confirmed':
                        return { bg: '#dcfce7', text: '#15803d', label: 'Confirmed & Escrow Secured' };
                      case 'in_progress':
                        return { bg: '#fef3c7', text: '#b45309', label: 'Specialist In Field' };
                      case 'completed':
                        return { bg: '#e0e7ff', text: '#4338ca', label: 'Job Completed & Escrow Released' };
                      case 'cancelled':
                        return { bg: '#fee2e2', text: '#b91c1c', label: 'Cancelled / Refunded' };
                      default:
                        return { bg: '#f1f5f9', text: '#475569', label: 'Pending Review' };
                    }
                  };
                  const badge = getStatusBadge(booking.status);

                  return (
                    <div
                      key={booking.id}
                      style={{
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        padding: '18px 20px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b' }}>
                            {booking.id.toUpperCase()}
                          </span>
                          <span style={{
                            backgroundColor: badge.bg,
                            color: badge.text,
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}>
                            {badge.label}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 4px' }}>
                          {booking.serviceTitle}
                        </h4>
                        
                        <div style={{ fontSize: '0.84rem', color: '#475569', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                          <span><strong>Specialist:</strong> {booking.providerName}</span>
                          <span><strong>Date:</strong> {booking.bookingDate} ({booking.timeSlot})</span>
                          <span><strong>Scope:</strong> {booking.scopeQuantity} {booking.serviceUnit}</span>
                          <span><strong>Location:</strong> {booking.clientFarmLocation}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                            {booking.totalPriceXaf.toLocaleString()} FCFA
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 600 }}>
                            Escrow Protection Active
                          </div>
                        </div>

                        {/* Status Toggle for User / Farmer */}
                        {booking.status === 'confirmed' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}
                            style={{
                              backgroundColor: '#166534',
                              color: '#ffffff',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Mark Completed & Release Escrow
                          </button>
                        )}

                        <a
                          href={`https://wa.me/${booking.providerWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${booking.providerName}, regarding AgriFlow booking ${booking.id}...`)}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            backgroundColor: '#22c55e',
                            color: '#ffffff',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            textDecoration: 'none',
                            fontSize: '0.8rem',
                            fontWeight: 700
                          }}
                        >
                          <MessageCircle size={14} />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* REGISTER AS SERVICE PROVIDER MODAL */}
      {isRegisterModalOpen && (
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
            maxWidth: '620px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  List Your Agricultural Service
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '2px 0 0' }}>
                  Register as a specialist to receive client bookings and escrow payouts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jean-Luc Ngassa"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Business / Cooperative Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Highland Mechanization Ltd"
                    value={regBusinessName}
                    onChange={(e) => setRegBusinessName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Professional Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Tractor Operator"
                    value={regTitle}
                    onChange={(e) => setRegTitle(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Category *
                  </label>
                  <select
                    value={regCategory}
                    onChange={(e) => setRegCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  >
                    <option value="machinery">Heavy Machinery & Tillage</option>
                    <option value="agronomy">Agronomy & Soil Health</option>
                    <option value="drone_tech">Precision Ag Drones</option>
                    <option value="irrigation_solar">Solar & Irrigation Hydraulics</option>
                    <option value="cold_chain">Cold Storage & Chilled Fleet</option>
                    <option value="harvest_labor">Harvest Brigades & Labor</option>
                    <option value="certification">Certification & Packhouse</option>
                    <option value="soil_testing">Soil Chemistry & Pathology</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    City / Division *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Foumbot & Bafoussam"
                    value={regLocation}
                    onChange={(e) => setRegLocation(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Operating Region *
                  </label>
                  <select
                    value={regRegion}
                    onChange={(e) => setRegRegion(e.target.value as any)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  >
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+237 6XX XX XX XX"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Base Starting Rate (FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="35000"
                    value={regStartingPrice}
                    onChange={(e) => setRegStartingPrice(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="specialist@agriflow.cm"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Years of Field Experience
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="45"
                    value={regExperience}
                    onChange={(e) => setRegExperience(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Primary Offering Title
                  </label>
                  <input
                    type="text"
                    value={regServiceTitle}
                    onChange={(e) => setRegServiceTitle(e.target.value)}
                    placeholder="e.g. Mechanized Tillage & Ridge Prep"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Billing Unit
                  </label>
                  <input
                    type="text"
                    value={regServiceUnit}
                    onChange={(e) => setRegServiceUnit(e.target.value)}
                    placeholder="per hectare"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Service Description
                </label>
                <input
                  type="text"
                  value={regServiceDesc}
                  onChange={(e) => setRegServiceDesc(e.target.value)}
                  placeholder="e.g. Deep tractor ploughing, harrowing, and seedbed preparation."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Certifications & Accreditations (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. MINADER Certified Operator, IRAD Soil Consultant"
                  value={regCertifications}
                  onChange={(e) => setRegCertifications(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Equipment & Machinery (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Deere 75HP Tractor, 4-Disc Plough, Rotary Tiller"
                  value={regEquipment}
                  onChange={(e) => setRegEquipment(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Professional Bio & Experience
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your agricultural track record, machines, and response radius..."
                  value={regBio}
                  onChange={(e) => setRegBio(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '8px',
                  backgroundColor: '#166534',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Publish Profile to AgriFlow Hub
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
