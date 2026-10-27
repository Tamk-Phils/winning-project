import React, { useState, useMemo } from 'react';
import { 
  Wrench, 
  Search, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  Plus, 
  Phone, 
  MessageSquare, 
  ArrowRight, 
  X, 
  Award, 
  Tractor, 
  Plane, 
  Droplet, 
  Truck, 
  Activity, 
  FileCheck2, 
  Users, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import type { 
  ServiceProvider, 
  ServiceBooking, 
  ServiceCategory, 
  ServiceOffering, 
  GeographicRegion 
} from '../types';
import { 
  getStoredServiceProviders, 
  saveServiceProvider, 
  getStoredServiceBookings, 
  saveServiceBooking, 
  updateServiceBookingStatus 
} from '../lib/services';

interface ServiceHubViewProps {
  onNavigateMarketplace?: () => void;
  onOpenLiveChat?: () => void;
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
  onNavigateMarketplace,
  onOpenLiveChat,
}) => {
  const [providers, setProviders] = useState<ServiceProvider[]>(() => getStoredServiceProviders());
  const [bookings, setBookings] = useState<ServiceBooking[]>(() => getStoredServiceBookings());

  // View state
  const [activeTab, setActiveTab] = useState<'browse' | 'my_bookings'>('browse');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc' | 'jobs'>('rating');

  // Modals
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [bookingModalProvider, setBookingModalProvider] = useState<ServiceProvider | null>(null);
  const [selectedServiceOffering, setSelectedServiceOffering] = useState<ServiceOffering | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState<'morning' | 'afternoon' | 'full_day'>('morning');
  const [scopeQuantity, setScopeQuantity] = useState<number>(1);
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientFarmLocation, setClientFarmLocation] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [bookingSuccessId, setBookingSuccessId] = useState<string | null>(null);

  // Provider Registration Form State
  const [regFullName, setRegFullName] = useState<string>('');
  const [regBusinessName, setRegBusinessName] = useState<string>('');
  const [regTitle, setRegTitle] = useState<string>('');
  const [regCategory, setRegCategory] = useState<ServiceCategory>('agronomy');
  const [regLocation, setRegLocation] = useState<string>('');
  const [regRegion, setRegRegion] = useState<string>('West Highlands (Foumbot/Bafoussam)');
  const [regPriceXaf, setRegPriceXaf] = useState<number>(35000);
  const [regPhone, setRegPhone] = useState<string>('');
  const [regWhatsapp, setRegWhatsapp] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regBio, setRegBio] = useState<string>('');
  const [regExpYears, setRegExpYears] = useState<number>(5);
  const [regCertifications, setRegCertifications] = useState<string>('MINADER Certified, GAP Fellow');
  const [regEquipment, setRegEquipment] = useState<string>('Professional Field Kit');
  const [regServiceName, setRegServiceName] = useState<string>('Standard On-Site Farm Service');
  const [regServiceUnit, setRegServiceUnit] = useState<string>('per day');
  const [regServiceDesc, setRegServiceDesc] = useState<string>('Full in-person evaluation, diagnostic and on-field execution with verified tools.');

  // Filtered & sorted providers
  const filteredProviders = useMemo(() => {
    return providers.filter(p => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchRegion = selectedRegion === 'all' || p.region === selectedRegion;
      const query = searchQuery.toLowerCase().trim();
      const matchQuery = !query || 
        p.fullName.toLowerCase().includes(query) ||
        (p.businessName && p.businessName.toLowerCase().includes(query)) ||
        p.title.toLowerCase().includes(query) ||
        p.bio.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.services.some(s => s.title.toLowerCase().includes(query) || s.description.toLowerCase().includes(query));
      return matchCat && matchRegion && matchQuery;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price_asc') return a.startingPriceXaf - b.startingPriceXaf;
      if (sortBy === 'price_desc') return b.startingPriceXaf - a.startingPriceXaf;
      if (sortBy === 'jobs') return b.completedJobsCount - a.completedJobsCount;
      return 0;
    });
  }, [providers, selectedCategory, selectedRegion, searchQuery, sortBy]);

  const handleOpenBooking = (provider: ServiceProvider, service?: ServiceOffering) => {
    setBookingModalProvider(provider);
    setSelectedServiceOffering(service || (provider.services.length > 0 ? provider.services[0] : null));
    setScopeQuantity(1);
    setBookingSuccessId(null);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModalProvider || !selectedServiceOffering) return;

    if (!clientName.trim() || !clientPhone.trim() || !clientFarmLocation.trim()) {
      alert('Please fill in your name, contact phone number, and farm location.');
      return;
    }

    const unitPrice = selectedServiceOffering.priceXaf;
    const subtotal = unitPrice * scopeQuantity;
    const platformFee = Math.round(subtotal * 0.05); // 5% escrow protection
    const total = subtotal + platformFee;

    const newBooking: ServiceBooking = {
      id: `bk-${Date.now()}`,
      providerId: bookingModalProvider.id,
      providerName: bookingModalProvider.fullName,
      providerTitle: bookingModalProvider.title,
      providerAvatar: bookingModalProvider.avatarUrl,
      providerPhone: bookingModalProvider.phone,
      providerWhatsapp: bookingModalProvider.whatsappNumber,
      serviceId: selectedServiceOffering.id,
      serviceTitle: selectedServiceOffering.title,
      serviceUnit: selectedServiceOffering.unit,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      clientFarmLocation: clientFarmLocation.trim(),
      bookingDate,
      timeSlot,
      scopeQuantity,
      unitPriceXaf: unitPrice,
      subtotalXaf: subtotal,
      platformEscrowFeeXaf: platformFee,
      totalPriceXaf: total,
      specialInstructions: specialInstructions.trim() || undefined,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    const updated = saveServiceBooking(newBooking);
    setBookings(updated);
    setBookingSuccessId(newBooking.id);

    // Show top notification
    setNotificationMsg(`Service booked with ${bookingModalProvider.fullName}! Booking Ref: #${newBooking.id.slice(-6).toUpperCase()}`);
    setTimeout(() => setNotificationMsg(null), 6000);
  };

  const handleRegisterProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regTitle.trim() || !regPhone.trim() || !regLocation.trim()) {
      alert('Please fill out all required fields (Name, Title, Phone, Location).');
      return;
    }

    const newProvider: ServiceProvider = {
      id: `sp-${Date.now()}`,
      fullName: regFullName.trim(),
      businessName: regBusinessName.trim() || undefined,
      title: regTitle.trim(),
      category: regCategory,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,
      bannerUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
      rating: 5.0,
      reviewCount: 1,
      startingPriceXaf: regPriceXaf,
      startingPriceUsd: Math.round(regPriceXaf / 600),
      location: regLocation.trim(),
      region: regRegion,
      country: 'Cameroon',
      bio: regBio.trim() || 'Experienced agricultural specialist dedicated to high-yield sustainable and regenerative farm services.',
      experienceYears: regExpYears,
      verified: true,
      licensedProfessional: true,
      insuranceCovered: true,
      phone: regPhone.trim(),
      whatsappNumber: regWhatsapp.trim().replace(/[^0-9]/g, '') || regPhone.trim().replace(/[^0-9]/g, ''),
      email: regEmail.trim() || 'contact@agriflow-provider.cm',
      certifications: regCertifications.split(',').map(c => c.trim()).filter(Boolean),
      equipmentList: regEquipment.split(',').map(e => e.trim()).filter(Boolean),
      completedJobsCount: 1,
      responseTimeMinutes: 20,
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      featured: true,
      services: [
        {
          id: `srv-${Date.now()}`,
          title: regServiceName.trim() || 'Standard On-Site Farm Service',
          description: regServiceDesc.trim(),
          priceXaf: regPriceXaf,
          priceUsd: Math.round(regPriceXaf / 600),
          unit: regServiceUnit.trim() || 'per day',
          estimatedDuration: 'Scheduled on-site session',
          includesEquipment: true,
        }
      ]
    };

    const updated = saveServiceProvider(newProvider);
    setProviders(updated);
    setIsRegisterModalOpen(false);
    setSelectedCategory('all');
    setNotificationMsg(`Welcome to the network, ${newProvider.fullName}! Your profile is now live.`);
    setTimeout(() => setNotificationMsg(null), 6000);
  };

  const handleUpdateStatus = (bookingId: string, status: ServiceBooking['status']) => {
    const updated = updateServiceBookingStatus(bookingId, status);
    setBookings(updated);
  };

  return (
    <div className="service-hub-container" style={{ paddingBottom: '80px' }}>
      
      {/* Toast Notification */}
      {notificationMsg && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 1400,
          backgroundColor: 'var(--primary-900)',
          color: '#ffffff',
          padding: '14px 20px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          border: '1px solid rgba(255,255,255,0.2)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <CheckCircle2 size={20} color="#86efac" />
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{notificationMsg}</span>
          <button 
            type="button" 
            onClick={() => setNotificationMsg(null)}
            style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', marginLeft: '8px' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Hero Header */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary-950) 0%, #0d3822 50%, var(--primary-900) 100%)',
        color: '#ffffff',
        padding: '56px 20px 48px',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
            <div style={{ maxWidth: '720px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(52, 211, 153, 0.15)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                color: '#6ee7b7',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}>
                <Sparkles size={14} />
                <span>On-Demand Agricultural Specialist Network</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.02em',
                marginBottom: '16px'
              }}>
                AgriFlow Service Booking Hub
              </h1>

              <p style={{
                fontSize: '1.05rem',
                color: '#d1fae5',
                lineHeight: 1.6,
                marginBottom: '28px',
                opacity: 0.95
              }}>
                Book verified agronomists, heavy tractor operators, drone spraying pilots, cold-chain refrigerated haulers, and experienced harvest brigades. All jobs backed by escrow protection and transparent rate cards.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('browse')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 22px',
                    backgroundColor: 'var(--primary-500)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  <Search size={18} />
                  <span>Browse Specialists</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 22px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <Plus size={18} />
                  <span>Join as Service Provider</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('my_bookings')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 22px',
                    backgroundColor: activeTab === 'my_bookings' ? '#ffffff' : 'transparent',
                    color: activeTab === 'my_bookings' ? 'var(--primary-950)' : '#a7f3d0',
                    border: '1px solid rgba(167, 243, 208, 0.4)',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer'
                  }}
                >
                  <Calendar size={18} />
                  <span>My Bookings</span>
                  <span style={{
                    backgroundColor: activeTab === 'my_bookings' ? 'var(--primary-700)' : 'var(--primary-500)',
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem'
                  }}>
                    {bookings.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '14px',
              minWidth: '280px',
              maxWidth: '380px'
            }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>{providers.length}+</div>
                <div style={{ fontSize: '0.82rem', color: '#d1fae5', opacity: 0.85 }}>Verified Specialists</div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24' }}>100%</div>
                <div style={{ fontSize: '0.82rem', color: '#d1fae5', opacity: 0.85 }}>Escrow Protected</div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#60a5fa' }}>20 min</div>
                <div style={{ fontSize: '0.82rem', color: '#d1fae5', opacity: 0.85 }}>Avg Response Time</div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f472b6' }}>14.2k ha</div>
                <div style={{ fontSize: '0.82rem', color: '#d1fae5', opacity: 0.85 }}>Farmland Serviced</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="container" style={{ maxWidth: '1280px', margin: '32px auto 0', padding: '0 20px' }}>
        
        {/* Navigation Tabs (Browse vs My Bookings) */}
        <div style={{
          display: 'flex',
          borderBottom: '2px solid var(--border-color)',
          gap: '24px',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('browse')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '1rem',
              color: activeTab === 'browse' ? 'var(--primary-800)' : 'var(--text-muted)',
              borderBottom: activeTab === 'browse' ? '3px solid var(--primary-600)' : '3px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Wrench size={18} />
            <span>Find & Book Services ({filteredProviders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('my_bookings')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '1rem',
              color: activeTab === 'my_bookings' ? 'var(--primary-800)' : 'var(--text-muted)',
              borderBottom: activeTab === 'my_bookings' ? '3px solid var(--primary-600)' : '3px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Calendar size={18} />
            <span>My Bookings Tracker ({bookings.length})</span>
          </button>
        </div>

        {/* TAB 1: BROWSE SPECIALISTS */}
        {activeTab === 'browse' && (
          <div>
            {/* Search & Filter Toolbar */}
            <div className="glass-card" style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '20px 24px',
              marginBottom: '28px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                {/* Search Bar */}
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gridColumn: 'span 2'
                }}>
                  <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px' }} />
                  <input
                    type="search"
                    placeholder="Search by specialist, skill, tractor, drone, irrigation, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 42px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.92rem',
                      outline: 'none',
                      backgroundColor: 'var(--bg-page)'
                    }}
                  />
                  {searchQuery && (
                    <button 
                      type="button" 
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Region Selector */}
                <div>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.9rem',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all">All Regions & Corridors</option>
                    {REGIONS.map((reg) => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.9rem',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="jobs">Most Jobs Completed</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Category Filter Chips */}
              <div style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '4px',
                scrollbarWidth: 'none'
              }}>
                {CATEGORY_CHIPS.map((chip) => {
                  const isActive = selectedCategory === chip.id;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => setSelectedCategory(chip.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        border: isActive ? '1px solid var(--primary-600)' : '1px solid var(--border-color)',
                        backgroundColor: isActive ? 'var(--primary-800)' : '#ffffff',
                        color: isActive ? '#ffffff' : 'var(--text-main)',
                      }}
                    >
                      {chip.icon}
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Providers Grid */}
            {filteredProviders.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '64px 20px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-color)'
              }}>
                <Wrench size={40} color="var(--text-faint)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-950)', marginBottom: '8px' }}>
                  No matching service providers found
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 20px' }}>
                  Try resetting your category or region filters, or be the first professional to register your services in this area.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => { setSelectedCategory('all'); setSelectedRegion('all'); setSearchQuery(''); }}
                    className="btn btn-secondary"
                  >
                    Clear Filters
                  </button>
                  {onNavigateMarketplace && (
                    <button
                      type="button"
                      onClick={onNavigateMarketplace}
                      className="btn btn-secondary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <ShoppingBag size={15} />
                      <span>Explore Produce Shop</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="btn btn-primary"
                  >
                    Register as Provider
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '24px'
              }}>
                {filteredProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className="glass-card"
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid var(--border-color)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                  >
                    {/* Card Banner */}
                    <div style={{
                      height: '110px',
                      backgroundImage: `url(${provider.bannerUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))'
                      }} />
                      {provider.verified && (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          backgroundColor: 'rgba(5, 27, 17, 0.85)',
                          color: '#86efac',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          backdropFilter: 'blur(4px)',
                          border: '1px solid rgba(134, 239, 172, 0.3)'
                        }}>
                          <ShieldCheck size={13} />
                          <span>VERIFIED PRO</span>
                        </div>
                      )}
                    </div>

                    {/* Card Header & Avatar */}
                    <div style={{ padding: '0 20px', marginTop: '-36px', display: 'flex', gap: '14px', alignItems: 'flex-end', position: 'relative' }}>
                      <img
                        src={provider.avatarUrl}
                        alt={provider.fullName}
                        style={{
                          width: '72px',
                          height: '72px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '3px solid #ffffff',
                          boxShadow: 'var(--shadow-md)',
                          backgroundColor: '#ffffff'
                        }}
                      />
                      <div style={{ paddingBottom: '4px', minWidth: 0, flex: 1 }}>
                        <h3 style={{
                          fontSize: '1.15rem',
                          fontWeight: 800,
                          color: 'var(--primary-950)',
                          margin: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {provider.fullName}
                        </h3>
                        {provider.businessName && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                            {provider.businessName}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Title & Category Badge */}
                      <div style={{ marginBottom: '10px' }}>
                        <span style={{
                          display: 'inline-block',
                          backgroundColor: 'var(--primary-50)',
                          color: 'var(--primary-800)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          marginBottom: '6px'
                        }}>
                          {provider.category.toUpperCase().replace('_', ' ')}
                        </span>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
                          {provider.title}
                        </div>
                      </div>

                      {/* Location & Rating */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.82rem',
                        color: 'var(--text-muted)',
                        marginBottom: '12px',
                        paddingBottom: '12px',
                        borderBottom: '1px solid var(--border-subtle)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} color="var(--primary-600)" />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px' }}>
                            {provider.location}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: 'var(--primary-900)' }}>
                          <Star size={14} fill="#f59e0b" color="#f59e0b" />
                          <span>{provider.rating.toFixed(1)}</span>
                          <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>({provider.reviewCount})</span>
                        </div>
                      </div>

                      {/* Bio snippet */}
                      <p style={{
                        fontSize: '0.84rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.5,
                        marginBottom: '16px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        flex: 1
                      }}>
                        {provider.bio}
                      </p>

                      {/* Available Service Highlights */}
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: '6px' }}>
                          Key Service Packages:
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {provider.services.slice(0, 2).map((srv) => (
                            <div 
                              key={srv.id}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.8rem',
                                backgroundColor: 'var(--bg-subtle)',
                                padding: '6px 10px',
                                borderRadius: 'var(--radius-sm)'
                              }}
                            >
                              <span style={{ fontWeight: 600, color: 'var(--primary-950)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                                {srv.title}
                              </span>
                              <span style={{ fontWeight: 800, color: 'var(--primary-700)' }}>
                                {srv.priceXaf.toLocaleString()} FCFA
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pricing & Footer Actions */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-color)',
                        gap: '10px'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>Starting from</div>
                          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                            {provider.startingPriceXaf.toLocaleString()} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>FCFA</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => setSelectedProvider(provider)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border-color)',
                              backgroundColor: '#ffffff',
                              color: 'var(--primary-900)',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Details
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenBooking(provider)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 16px',
                              borderRadius: 'var(--radius-md)',
                              border: 'none',
                              backgroundColor: 'var(--primary-600)',
                              color: '#ffffff',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: 'var(--shadow-sm)'
                            }}
                          >
                            <span>Book Now</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY BOOKINGS TRACKER */}
        {activeTab === 'my_bookings' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-950)', margin: 0 }}>
                  Active & Scheduled Farm Service Bookings
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                  Track your booked agronomists, machinery operators, drone flights, and logistics dispatches.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                {onOpenLiveChat && (
                  <button
                    type="button"
                    onClick={onOpenLiveChat}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '9px 16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#ffffff',
                      color: 'var(--primary-900)',
                      border: '1px solid var(--border-color)',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                  >
                    <MessageSquare size={16} />
                    <span>Support & Inquiries</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setActiveTab('browse')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary-800)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} />
                  <span>Book Another Service</span>
                </button>
              </div>
            </div>

            {bookings.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-color)'
              }}>
                <Calendar size={44} color="var(--text-faint)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-950)', marginBottom: '8px' }}>
                  No bookings yet
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 20px' }}>
                  Browse our specialist catalog to hire machinery, soil experts, or spray drones for your farm plots.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('browse')}
                  className="btn btn-primary"
                >
                  Explore Services
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {bookings.map((booking) => {
                  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
                    confirmed: { bg: '#dcfce7', text: '#15803d', label: 'Confirmed (Scheduled)' },
                    pending: { bg: '#fef3c7', text: '#b45309', label: 'Pending Specialist Confirmation' },
                    in_progress: { bg: '#e0f2fe', text: '#0369a1', label: 'In Progress On-Site' },
                    completed: { bg: '#f3f4f6', text: '#4b5563', label: 'Completed & Inspected' },
                    cancelled: { bg: '#fee2e2', text: '#b91c1c', label: 'Cancelled' }
                  };
                  const color = statusColors[booking.status] || statusColors.confirmed;

                  return (
                    <div
                      key={booking.id}
                      className="glass-card"
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-color)',
                        padding: '20px 24px',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}>
                        {/* Provider Header */}
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                          <img
                            src={booking.providerAvatar}
                            alt={booking.providerName}
                            style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-950)', margin: 0 }}>
                                {booking.serviceTitle}
                              </h4>
                              <span style={{
                                backgroundColor: color.bg,
                                color: color.text,
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-full)'
                              }}>
                                {color.label}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--primary-800)', fontWeight: 600, marginTop: '2px' }}>
                              Specialist: {booking.providerName} ({booking.providerTitle})
                            </div>
                          </div>
                        </div>

                        {/* Booking Ref & Date */}
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>Booking Ref: #{booking.id.slice(-6).toUpperCase()}</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-950)' }}>
                            {booking.totalPriceXaf.toLocaleString()} FCFA
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Includes 5% Escrow Protection</div>
                        </div>
                      </div>

                      {/* Booking Details Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '12px',
                        backgroundColor: 'var(--bg-subtle)',
                        padding: '14px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.84rem'
                      }}>
                        <div>
                          <span style={{ color: 'var(--text-faint)' }}>Scheduled Date: </span>
                          <strong style={{ color: 'var(--primary-950)' }}>{booking.bookingDate}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-faint)' }}>Time Slot: </span>
                          <strong style={{ color: 'var(--primary-950)', textTransform: 'capitalize' }}>
                            {booking.timeSlot.replace('_', ' ')}
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-faint)' }}>Service Scope: </span>
                          <strong style={{ color: 'var(--primary-950)' }}>
                            {booking.scopeQuantity} {booking.serviceUnit}
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-faint)' }}>Farm Location: </span>
                          <strong style={{ color: 'var(--primary-950)' }}>{booking.clientFarmLocation}</strong>
                        </div>
                      </div>

                      {booking.specialInstructions && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          "{booking.specialInstructions}"
                        </div>
                      )}

                      {/* Action Bar */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px',
                        paddingTop: '8px'
                      }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <a
                            href={`https://wa.me/${booking.providerWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${booking.providerName}, reaching out regarding my AgriFlow service booking #${booking.id.slice(-6).toUpperCase()} for ${booking.serviceTitle} on ${booking.bookingDate}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 14px',
                              backgroundColor: '#25D366',
                              color: '#ffffff',
                              borderRadius: 'var(--radius-md)',
                              textDecoration: 'none',
                              fontSize: '0.82rem',
                              fontWeight: 700
                            }}
                          >
                            <MessageSquare size={14} />
                            <span>WhatsApp Specialist</span>
                          </a>

                          <a
                            href={`tel:${booking.providerPhone}`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 14px',
                              backgroundColor: '#ffffff',
                              color: 'var(--primary-950)',
                              border: '1px solid var(--border-color)',
                              borderRadius: 'var(--radius-md)',
                              textDecoration: 'none',
                              fontSize: '0.82rem',
                              fontWeight: 700
                            }}
                          >
                            <Phone size={14} />
                            <span>Call ({booking.providerPhone})</span>
                          </a>
                        </div>

                        {/* Status Change Buttons */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {booking.status === 'confirmed' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(booking.id, 'in_progress')}
                              style={{
                                padding: '8px 12px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)',
                                backgroundColor: '#ffffff',
                                color: 'var(--primary-800)',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Mark In-Progress
                            </button>
                          )}

                          {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(booking.id, 'completed')}
                              style={{
                                padding: '8px 14px',
                                borderRadius: 'var(--radius-md)',
                                border: 'none',
                                backgroundColor: 'var(--primary-600)',
                                color: '#ffffff',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Confirm Job Completed
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* MODAL 1: PROVIDER FULL PROFILE DETAILS */}
      {selectedProvider && (
        <div 
          className="modal-backdrop"
          onClick={() => setSelectedProvider(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(5, 27, 17, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            padding: '20px'
          }}
        >
          <div
            className="modal-content glass-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-color)'
            }}
          >
            {/* Header Banner */}
            <div style={{
              height: '160px',
              backgroundImage: `url(${selectedProvider.bannerUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              padding: '16px'
            }}>
              <button
                type="button"
                onClick={() => setSelectedProvider(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#ffffff',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Intro */}
            <div style={{ padding: '0 24px 24px' }}>
              <div style={{ marginTop: '-45px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                <img
                  src={selectedProvider.avatarUrl}
                  alt={selectedProvider.fullName}
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '4px solid #ffffff',
                    boxShadow: 'var(--shadow-lg)',
                    backgroundColor: '#ffffff'
                  }}
                />

                <button
                  type="button"
                  onClick={() => {
                    const prov = selectedProvider;
                    setSelectedProvider(null);
                    handleOpenBooking(prov);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary-600)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  <Calendar size={16} />
                  <span>Book This Specialist</span>
                </button>
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-950)', margin: '0 0 4px' }}>
                {selectedProvider.fullName}
              </h2>
              {selectedProvider.businessName && (
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-700)', marginBottom: '8px' }}>
                  {selectedProvider.businessName}
                </div>
              )}
              <div style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '12px' }}>
                {selectedProvider.title}
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#dcfce7', color: '#15803d', fontSize: '0.78rem', fontWeight: 700, padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                  <ShieldCheck size={14} />
                  <span>Verified Identity & Background Checked</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '0.78rem', fontWeight: 700, padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                  <Award size={14} />
                  <span>{selectedProvider.experienceYears} Years Field Experience</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#fef3c7', color: '#b45309', fontSize: '0.78rem', fontWeight: 700, padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  <span>{selectedProvider.rating.toFixed(1)} ({selectedProvider.reviewCount} Reviews)</span>
                </span>
              </div>

              {/* Bio */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-950)', marginBottom: '6px' }}>
                  Professional Profile & Background
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {selectedProvider.bio}
                </p>
              </div>

              {/* Certifications & Equipment */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary-900)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Certifications & Accreditations:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {selectedProvider.certifications.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary-900)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Deployment Equipment:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {selectedProvider.equipmentList.map((eq, i) => (
                      <li key={i}>{eq}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Available Services List */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-950)', marginBottom: '12px' }}>
                  Available Service Packages & Rates
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedProvider.services.map((srv) => (
                    <div
                      key={srv.id}
                      style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}
                    >
                      <div style={{ maxWidth: '420px' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-950)' }}>
                          {srv.title}
                        </div>
                        <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {srv.description}
                        </div>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', color: 'var(--text-faint)', marginTop: '6px' }}>
                          <span>⏱ {srv.estimatedDuration}</span>
                          <span>•</span>
                          <span>{srv.includesEquipment ? '✓ Equipment Included' : 'Client Supplies Tool'}</span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                          {srv.priceXaf.toLocaleString()} FCFA
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>{srv.unit}</div>
                        <button
                          type="button"
                          onClick={() => {
                            const prov = selectedProvider;
                            setSelectedProvider(null);
                            handleOpenBooking(prov, srv);
                          }}
                          style={{
                            marginTop: '8px',
                            padding: '6px 14px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--primary-600)',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Book Package
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: BOOK SERVICE MODAL */}
      {bookingModalProvider && selectedServiceOffering && (
        <div
          className="modal-backdrop"
          onClick={() => { setBookingModalProvider(null); setBookingSuccessId(null); }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(5, 27, 17, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            padding: '20px'
          }}
        >
          <div
            className="modal-content glass-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-color)',
              padding: '28px'
            }}
          >
            {bookingSuccessId ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-950)', marginBottom: '8px' }}>
                  Service Booking Confirmed!
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
                  Your booking for <strong>{selectedServiceOffering.title}</strong> with <strong>{bookingModalProvider.fullName}</strong> has been secured in escrow.
                </p>
                <div style={{
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '24px',
                  textAlign: 'left',
                  fontSize: '0.85rem'
                }}>
                  <div><strong>Booking Reference:</strong> #{bookingSuccessId.slice(-6).toUpperCase()}</div>
                  <div><strong>Date:</strong> {bookingDate} ({timeSlot})</div>
                  <div><strong>Location:</strong> {clientFarmLocation}</div>
                  <div><strong>Specialist Phone:</strong> {bookingModalProvider.phone}</div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingModalProvider(null);
                      setBookingSuccessId(null);
                      setActiveTab('my_bookings');
                    }}
                    className="btn btn-primary"
                  >
                    View in My Bookings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingModalProvider(null);
                      setBookingSuccessId(null);
                    }}
                    className="btn btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-950)', margin: 0 }}>
                      Schedule Service Booking
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      with {bookingModalProvider.fullName}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBookingModalProvider(null)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Selected Package Info */}
                <div style={{
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '18px',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--primary-950)' }}>
                    {selectedServiceOffering.title}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {selectedServiceOffering.description}
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--primary-700)', fontSize: '0.95rem', marginTop: '6px' }}>
                    Rate: {selectedServiceOffering.priceXaf.toLocaleString()} FCFA ({selectedServiceOffering.unit})
                  </div>
                </div>

                {/* Date & Time Slot */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                      Time Window *
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.88rem',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <option value="morning">Morning (08:00 - 12:00)</option>
                      <option value="afternoon">Afternoon (13:00 - 17:00)</option>
                      <option value="full_day">Full Day (08:00 - 17:00)</option>
                    </select>
                  </div>
                </div>

                {/* Scope / Quantity */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Scope Quantity ({selectedServiceOffering.unit}) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={scopeQuantity}
                    onChange={(e) => setScopeQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                {/* Farm Location */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Farm Site / Dispatch Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Foumbot Volcanic Plot Sector 4, West Region"
                    value={clientFarmLocation}
                    onChange={(e) => setClientFarmLocation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                {/* Contact Name & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Michel Kuate"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g., +237 670 12 34 56"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Email Address (For Escrow Receipt)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g., michel@agriflow.cm"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                {/* Special Instructions */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Special Field Notes or Access Directions
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Tractor access is via the lower gate. Soil is dry enough for tillage."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                {/* Cost Calculation Box */}
                <div style={{
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span>Service Subtotal ({scopeQuantity} x {selectedServiceOffering.priceXaf.toLocaleString()} FCFA):</span>
                    <strong>{(selectedServiceOffering.priceXaf * scopeQuantity).toLocaleString()} FCFA</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <span>Platform Quality & Escrow Guarantee (5%):</span>
                    <span>{Math.round(selectedServiceOffering.priceXaf * scopeQuantity * 0.05).toLocaleString()} FCFA</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: 'var(--primary-950)',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--border-color)'
                  }}>
                    <span>Total Amount (Escrowed):</span>
                    <span style={{ color: 'var(--primary-700)' }}>
                      {(selectedServiceOffering.priceXaf * scopeQuantity + Math.round(selectedServiceOffering.priceXaf * scopeQuantity * 0.05)).toLocaleString()} FCFA
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: 'var(--primary-600)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  Confirm & Reserve Service
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: JOIN AS SERVICE PROVIDER */}
      {isRegisterModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsRegisterModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(5, 27, 17, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            padding: '20px'
          }}
        >
          <div
            className="modal-content glass-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              width: '100%',
              maxWidth: '640px',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-color)',
              padding: '30px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-950)', margin: 0 }}>
                  Create Service Provider Profile
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Offer your agronomy, tractor, drone, logistics, or field services on AgriFlow.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRegisterProvider}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Dr. Albertine Ngo"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Business / Cooperative Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Highland AgroTech Lab"
                    value={regBusinessName}
                    onChange={(e) => setRegBusinessName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Professional Title / Specialty *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Senior Soil Diagnostic Specialist"
                    value={regTitle}
                    onChange={(e) => setRegTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Primary Category *
                  </label>
                  <select
                    value={regCategory}
                    onChange={(e) => setRegCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.88rem', backgroundColor: '#ffffff' }}
                  >
                    <option value="agronomy">Agronomy & Soil</option>
                    <option value="machinery">Heavy Machinery & Tillage</option>
                    <option value="drone_tech">Precision Ag Drones</option>
                    <option value="irrigation_solar">Solar & Irrigation</option>
                    <option value="cold_chain">Cold-Chain Fleet</option>
                    <option value="veterinary">Veterinary & Health</option>
                    <option value="certification">Certification & Audits</option>
                    <option value="harvest_labor">Harvest Brigades</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Base Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Foumbot & Bafoussam"
                    value={regLocation}
                    onChange={(e) => setRegLocation(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Region Covered *
                  </label>
                  <select
                    value={regRegion}
                    onChange={(e) => setRegRegion(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.88rem', backgroundColor: '#ffffff' }}
                  >
                    {REGIONS.map(reg => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+237 6..."
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+237 6..."
                    value={regWhatsapp}
                    onChange={(e) => setRegWhatsapp(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={regExpYears}
                    onChange={(e) => setRegExpYears(parseInt(e.target.value) || 1)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. contact@agrobio.cm"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                  Certifications (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., MINADER Certified, GlobalG.A.P. Fellow"
                  value={regCertifications}
                  onChange={(e) => setRegCertifications(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                  Equipment & Tools (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., John Deere 5075E 4WD, 4-Disc Plough, Rotary Tiller"
                  value={regEquipment}
                  onChange={(e) => setRegEquipment(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                  Bio & Professional Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="Detail your agricultural background, machinery fleet capabilities, or agronomic certifications..."
                  value={regBio}
                  onChange={(e) => setRegBio(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                />
              </div>

              {/* Initial Service Package Setup */}
              <div style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '10px' }}>
                  Default Service Package Listing:
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>Package Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Full Hectare Disc Tillage"
                      value={regServiceName}
                      onChange={(e) => setRegServiceName(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>Rate (FCFA) *</label>
                    <input
                      type="number"
                      required
                      value={regPriceXaf}
                      onChange={(e) => setRegPriceXaf(parseInt(e.target.value) || 0)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>Unit (e.g. per hectare, per day, per session)</label>
                  <input
                    type="text"
                    value={regServiceUnit}
                    onChange={(e) => setRegServiceUnit(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>Package Description</label>
                  <input
                    type="text"
                    value={regServiceDesc}
                    onChange={(e) => setRegServiceDesc(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: 'var(--primary-700)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                Publish Service Profile
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
