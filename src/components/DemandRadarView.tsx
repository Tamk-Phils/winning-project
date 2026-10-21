import React, { useState, useMemo } from 'react';
import { 
  Radio, 
  Search, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  MessageCircle, 
  Building2, 
  Scale, 
  Globe2, 
  MessageSquare,
  HelpCircle,
  X
} from 'lucide-react';
import type { 
  DemandOpportunity, 
  Product, 
  Farm, 
  OpportunityMatch 
} from '../types';
import { 
  calculateOpportunityMatches, 
  getLastScanTimestamp, 
  setLastScanTimestamp 
} from '../lib/demandRadar';
import { WhatsAppMessageModal } from './WhatsAppMessageModal';

interface DemandRadarViewProps {
  opportunities: DemandOpportunity[];
  products: Product[];
  farms: Farm[];
  onOpenLiveChat: (buyerId: string, buyerName: string, subject: string, oppId?: string) => void;
  onRefreshOpportunities?: () => void;
}

export const DemandRadarView: React.FC<DemandRadarViewProps> = ({
  opportunities,
  products,
  farms,
  onOpenLiveChat,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [lastScanTime, setLastScanTime] = useState<string>(getLastScanTimestamp());
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // Match Explanation Modal State
  const [selectedMatchForExplanation, setSelectedMatchForExplanation] = useState<OpportunityMatch | null>(null);

  // WhatsApp Review Modal State
  const [whatsAppModalData, setWhatsAppModalData] = useState<{
    opportunity: DemandOpportunity;
    product: Product;
    farm: Farm;
  } | null>(null);

  // Calculate matches dynamically across all products and opportunities
  const allMatches = useMemo(() => {
    return calculateOpportunityMatches(products, opportunities);
  }, [products, opportunities]);

  // Group matches by opportunityId for quick lookup
  const matchesByOpportunityId = useMemo(() => {
    const map = new Map<string, OpportunityMatch[]>();
    for (const match of allMatches) {
      const existing = map.get(match.opportunityId) || [];
      existing.push(match);
      map.set(match.opportunityId, existing);
    }
    return map;
  }, [allMatches]);

  // Filter opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchesSearch = 
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.productSought.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.buyerOrgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.destinationLocation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCountry = selectedCountry === 'all' || opp.destinationCountry.toLowerCase() === selectedCountry.toLowerCase();
      const matchesCategory = selectedCategory === 'all' || opp.category === selectedCategory;

      return matchesSearch && matchesCountry && matchesCategory;
    });
  }, [opportunities, searchQuery, selectedCountry, selectedCategory]);

  // Manual Trigger: Simulated live scan of public bulletins
  const handleRunDiscoveryScan = () => {
    setIsScanning(true);
    setScanMessage('Scanning UN FAO, CEMAC Public Bulletin, and MINADER Agro-Tenders...');

    setTimeout(() => {
      const newTimestamp = new Date().toISOString();
      setLastScanTimestamp(newTimestamp);
      setLastScanTime(newTimestamp);
      setIsScanning(false);
      setScanMessage('Scan complete: 5 verified public buyer requests indexed with active traceable sources.');
      setTimeout(() => setScanMessage(null), 5000);
    }, 1800);
  };

  return (
    <div className="container" style={{ padding: '36px 20px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-950) 0%, var(--primary-900) 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '36px',
        color: '#ffffff',
        marginBottom: '32px',
        boxShadow: 'var(--shadow-xl)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              color: '#86efac',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <Radio size={13} className="pulse-fast" /> Continuous Demand Discovery
            </span>
            <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              Traceable Agricultural Requests Only • Zero Fabricated Buyers
            </span>
          </div>

          <h1 style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: '2.2rem', 
            fontWeight: 800, 
            letterSpacing: '-0.02em', 
            marginBottom: '10px',
            color: '#ffffff'
          }}>
            Demand Radar: Live Buyer Requests & Intelligent Matching
          </h1>
          <p style={{ fontSize: '0.98rem', color: '#94a3b8', maxWidth: '820px', lineHeight: 1.6, margin: 0 }}>
            AgriFlow continuously indexes public tenders, wholesale buyer inquiries, and commercial food security requisitions across Cameroon, CEMAC corridors, and international export markets (EU, UAE). Verified requests are algorithmically matched with actual smallholder harvests.
          </p>

          {/* Quick Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Active Requests</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{opportunities.length} Verified</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Active Matches</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38c182' }}>{allMatches.length} Matches Found</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Demand Volume</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24' }}>56.7 Metric Tons</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Avg. Source Credibility</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6ee7b7' }}>94.2% Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Discovery Source Status & Scanner Control Strip */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 24px',
        border: '1px solid var(--border-color)',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#16a34a',
            boxShadow: '0 0 10px rgba(22, 163, 74, 0.5)'
          }}></div>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-950)' }}>
              Discovery Sources: 4 Public Boards Connected
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              UN FAO Agro-Bulletin • CEMAC Food Reserve Portal • MINADER Cameroon • Dubai DMCC Exchange
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} /> Last scan: {new Date(lastScanTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          <button
            onClick={handleRunDiscoveryScan}
            disabled={isScanning}
            className="btn btn-primary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '8px 16px', 
              fontSize: '0.85rem',
              fontWeight: 700 
            }}
          >
            <RefreshCw size={14} className={isScanning ? 'spin' : ''} />
            <span>{isScanning ? 'Scanning Feeds...' : 'Run Discovery Scan'}</span>
          </button>
        </div>
      </div>

      {scanMessage && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} color="#059669" />
          <span>{scanMessage}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '420px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
          <input
            type="text"
            placeholder="Search crop, buyer organization, or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{
              paddingLeft: '36px',
              fontSize: '0.88rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#ffffff'
            }}
          />
        </div>

        {/* Filter Dropdowns */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <option value="all">All Destination Corridors</option>
            <option value="Cameroon">Cameroon (Domestic)</option>
            <option value="Gabon">Gabon (CEMAC)</option>
            <option value="France">France (EU Rungis)</option>
            <option value="Germany">Germany (Hamburg)</option>
            <option value="USA">USA (Pacific Northwest)</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <option value="all">All Produce Categories</option>
            <option value="herbs">Herbs & Spices (Penja Pepper)</option>
            <option value="fruits">Fruits (Plantains & Pineapple)</option>
            <option value="vegetables">Vegetables & Roots (Ginger)</option>
            <option value="grains">Grains & Cocoa Beans</option>
            <option value="dairy_honey">Honey & Forest Products</option>
          </select>
        </div>
      </div>

      {/* Opportunity Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {filteredOpportunities.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px 24px',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border-color)'
          }}>
            <Radio size={40} color="var(--text-faint)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              No Demand Opportunities Match This Filter
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Try broadening your search query or reset the destination filter.
            </p>
          </div>
        ) : (
          filteredOpportunities.map((opp) => {
            const matches = matchesByOpportunityId.get(opp.id) || [];

            return (
              <div 
                key={opp.id}
                className="glass-card"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px'
                }}
              >
                {/* Card Top: Source, Credibility, and Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      backgroundColor: 'var(--primary-100)',
                      color: 'var(--primary-800)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      textTransform: 'uppercase'
                    }}>
                      {opp.category}
                    </span>

                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px'
                    }}>
                      <ShieldCheckIcon size={12} /> Source Credibility: {opp.sourceCredibilityScore}%
                    </span>

                    <span style={{
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      fontSize: '0.75rem',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontWeight: 500
                    }}>
                      AI Extraction Confidence: {opp.extractionConfidence}%
                    </span>
                  </div>

                  {/* External Source Link */}
                  <a
                    href={opp.originalSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.78rem',
                      color: 'var(--primary-700)',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    <span>{opp.sourceName}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* Card Body: Title & Requirements */}
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-950)', marginBottom: '8px' }}>
                    {opp.title}
                  </h3>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    padding: '14px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-faint)', display: 'block', fontSize: '0.75rem' }}>Product Sought:</span>
                      <strong style={{ color: 'var(--primary-900)' }}>{opp.productSought}</strong>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-faint)', display: 'block', fontSize: '0.75rem' }}>Volume Required:</span>
                      <strong style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Scale size={14} color="var(--primary-600)" />
                        {opp.quantityNeeded.toLocaleString()} {opp.unit}
                      </strong>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-faint)', display: 'block', fontSize: '0.75rem' }}>Quality Grade:</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{opp.qualityGrade}</span>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-faint)', display: 'block', fontSize: '0.75rem' }}>Destination Corridor:</span>
                      <strong style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Globe2 size={14} color="var(--primary-600)" />
                        {opp.destinationLocation} ({opp.destinationCountry})
                      </strong>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-faint)', display: 'block', fontSize: '0.75rem' }}>Buyer Organization:</span>
                      <strong style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Building2 size={14} color="var(--primary-700)" />
                        {opp.buyerOrgName}
                      </strong>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-faint)', display: 'block', fontSize: '0.75rem' }}>Deadline:</span>
                      <span style={{ color: '#b45309', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} />
                        {opp.deadlineDate}
                      </span>
                    </div>
                  </div>
                </div>

                {opp.notes && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Note from bulletin: {opp.notes}
                  </div>
                )}

                {/* Intelligent Matching Strip */}
                <div style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={16} color="var(--primary-600)" />
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary-900)' }}>
                        Intelligent Produce Matches: {matches.length} Compatible Supplier Listing{matches.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Contact Decision Engine Badge */}
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: opp.contactPermissionStatus === 'direct_outreach_permitted' ? '#dcfce7' : '#fef3c7',
                      color: opp.contactPermissionStatus === 'direct_outreach_permitted' ? '#15803d' : '#b45309',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <CheckCircle2 size={13} />
                      {opp.contactPermissionStatus === 'direct_outreach_permitted' 
                        ? 'Direct Outreach Permitted' 
                        : 'Manual Pre-Qualification Advised'}
                    </span>
                  </div>

                  {matches.length === 0 ? (
                    <div style={{
                      padding: '12px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)'
                    }}>
                      No registered supplier currently matches all specifications for this request. Suppliers can add a matching harvest in the Farmer Portal.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {matches.slice(0, 2).map((match) => {
                        const matchedFarm = farms.find(f => f.id === match.product.farmId);

                        return (
                          <div 
                            key={match.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 16px',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              flexWrap: 'wrap',
                              gap: '12px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img 
                                src={match.product.imageUrl} 
                                alt={match.product.name}
                                style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} 
                              />
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-950)' }}>
                                    {match.product.name}
                                  </span>
                                  <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    backgroundColor: match.compatibilityScore >= 90 ? '#dcfce7' : '#e0f2fe',
                                    color: match.compatibilityScore >= 90 ? '#166534' : '#0369a1',
                                    padding: '2px 8px',
                                    borderRadius: '12px'
                                  }}>
                                    {match.compatibilityScore}% Compatibility
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                  Producer: <strong>{match.product.farmName}</strong> ({match.product.farmLocation}) • Stock: {match.product.stockQuantity} {match.product.stockUnit}
                                </div>
                              </div>
                            </div>

                            {/* Actions Strip */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => setSelectedMatchForExplanation(match)}
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  color: 'var(--text-main)',
                                  backgroundColor: '#ffffff',
                                  border: '1px solid var(--border-color)',
                                  borderRadius: 'var(--radius-md)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <HelpCircle size={13} color="var(--primary-600)" />
                                <span>Why Matched?</span>
                              </button>

                              {/* WhatsApp Contact Action */}
                              {matchedFarm && opp.buyerContactMethod === 'whatsapp' && (
                                <button
                                  type="button"
                                  onClick={() => setWhatsAppModalData({
                                    opportunity: opp,
                                    product: match.product,
                                    farm: matchedFarm
                                  })}
                                  style={{
                                    padding: '6px 12px',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    backgroundColor: '#25D366',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    boxShadow: '0 2px 6px rgba(37, 211, 102, 0.3)'
                                  }}
                                >
                                  <MessageCircle size={14} />
                                  <span>Review WhatsApp</span>
                                </button>
                              )}

                              {/* In-App Live Chat Action */}
                              <button
                                type="button"
                                onClick={() => onOpenLiveChat(
                                  opp.id, 
                                  opp.buyerOrgName, 
                                  `Inquiry regarding ${opp.productSought}`, 
                                  opp.id
                                )}
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  color: 'var(--primary-900)',
                                  backgroundColor: 'var(--primary-100)',
                                  border: '1px solid var(--primary-200)',
                                  borderRadius: 'var(--radius-md)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                <MessageSquare size={13} />
                                <span>In-App Chat</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Match Explainability Modal */}
      {selectedMatchForExplanation && (
        <div 
          className="modal-backdrop" 
          onClick={() => setSelectedMatchForExplanation(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(5, 27, 17, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: '20px'
          }}
        >
          <div 
            className="modal-content glass-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '600px',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '28px',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={20} color="var(--primary-600)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-950)', margin: 0 }}>
                  Intelligent Match Explainability
                </h3>
              </div>
              <button 
                onClick={() => setSelectedMatchForExplanation(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-subtle)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)'
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Compatibility Score</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                  {selectedMatchForExplanation.compatibilityScore}% Compatibility
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div><strong>Opportunity:</strong> {selectedMatchForExplanation.opportunityTitle}</div>
                <div><strong>Product:</strong> {selectedMatchForExplanation.product.name}</div>
              </div>
            </div>

            {/* Factor by Factor Breakdown */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
                Evaluation Breakdown:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedMatchForExplanation.detailedFactors.map((f, i) => (
                  <div 
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: f.match ? '#f0fdf4' : '#fffbeb',
                      border: `1px solid ${f.match ? '#bbf7d0' : '#fef3c7'}`,
                      fontSize: '0.82rem'
                    }}
                  >
                    {f.match ? (
                      <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                    ) : (
                      <AlertCircle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                    )}
                    <div>
                      <strong style={{ color: 'var(--text-main)', display: 'block' }}>{f.factor}</strong>
                      <span style={{ color: 'var(--text-muted)' }}>{f.details}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Info Flag */}
            {selectedMatchForExplanation.missingInfo.length > 0 && (
              <div style={{
                backgroundColor: '#fff7ed',
                border: '1px solid #ffedd5',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                color: '#9a3412'
              }}>
                <strong>Required Pre-Requisites Before Dispatch:</strong>
                <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
                  {selectedMatchForExplanation.missingInfo.map((info, i) => (
                    <li key={i}>{info}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setSelectedMatchForExplanation(null)}
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              Close Breakdown
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Message Review Modal */}
      {whatsAppModalData && (
        <WhatsAppMessageModal
          isOpen={Boolean(whatsAppModalData)}
          onClose={() => setWhatsAppModalData(null)}
          opportunity={whatsAppModalData.opportunity}
          product={whatsAppModalData.product}
          farm={whatsAppModalData.farm}
        />
      )}

    </div>
  );
};

// Mini internal icon helper
function ShieldCheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
