import type { 
  Product, 
  Farm, 
  DemandOpportunity, 
  OpportunityMatch, 
  MatchFactor,
  ContactPermissionStatus 
} from '../types';
import { INITIAL_DEMAND_OPPORTUNITIES } from '../data/mockData';
import { getSupabase } from './supabase';

const STORAGE_KEY_DEMAND = 'agriflow_demand_opportunities_v1';
const STORAGE_KEY_LAST_SCAN = 'agriflow_last_discovery_scan';

// -------------------------------------------------------------
// STORAGE & RETRIEVAL
// -------------------------------------------------------------

export async function fetchDemandOpportunities(): Promise<DemandOpportunity[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('demand_opportunities')
        .select('*')
        .order('discoveryTimestamp', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as DemandOpportunity[];
      }
    } catch (e) {
      console.warn('Supabase fetchDemandOpportunities fallback to local', e);
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_DEMAND);
    if (!raw) return INITIAL_DEMAND_OPPORTUNITIES;
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMAND_OPPORTUNITIES;
  }
}

export function saveDemandOpportunities(opportunities: DemandOpportunity[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_DEMAND, JSON.stringify(opportunities));
  } catch (e) {
    console.error('Failed to save demand opportunities to localStorage', e);
  }
}

export function getLastScanTimestamp(): string {
  return localStorage.getItem(STORAGE_KEY_LAST_SCAN) || '2026-10-21T08:00:00Z';
}

export function setLastScanTimestamp(isoDate: string): void {
  localStorage.setItem(STORAGE_KEY_LAST_SCAN, isoDate);
}

// -------------------------------------------------------------
// INTELLIGENT MATCHING ENGINE
// -------------------------------------------------------------

export function calculateOpportunityMatches(
  products: Product[],
  opportunities: DemandOpportunity[]
): OpportunityMatch[] {
  const matches: OpportunityMatch[] = [];

  for (const opp of opportunities) {
    for (const prod of products) {
      const factors: MatchFactor[] = [];
      const missingInfo: string[] = [];
      let score = 0;

      // 1. Category & Product Name Compatibility (Max 35 pts)
      const oppQuery = (opp.productSought + ' ' + opp.title).toLowerCase();
      const prodQuery = (prod.name + ' ' + prod.variety + ' ' + prod.description).toLowerCase();

      const words = opp.productSought.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const matchesWord = words.some(w => prodQuery.includes(w) || oppQuery.includes(prod.variety.toLowerCase()));
      const categoryMatch = opp.category === prod.category;

      if (matchesWord) {
        score += 35;
        factors.push({
          factor: 'Produce & Cultivar Match',
          match: true,
          details: `Direct match with listing cultivar: "${prod.variety}"`
        });
      } else if (categoryMatch) {
        score += 20;
        factors.push({
          factor: 'Category Alignment',
          match: true,
          details: `Same category (${opp.category}), but verify specific cultivar specifications.`
        });
      } else {
        factors.push({
          factor: 'Product Compatibility',
          match: false,
          details: `Different botanical category.`
        });
      }

      // 2. Quantity & Supply Feasibility (Max 25 pts)
      // Convert opp quantity to approx kg if needed
      let oppKg = opp.quantityNeeded;
      if (opp.unit.toLowerCase().includes('mt') || opp.unit.toLowerCase().includes('ton')) {
        oppKg = opp.quantityNeeded * 1000;
      }

      if (prod.stockQuantity >= oppKg) {
        score += 25;
        factors.push({
          factor: 'Volume & Capacity Feasibility',
          match: true,
          details: `Supplier available inventory (${prod.stockQuantity} ${prod.stockUnit}) fully covers the requested ${opp.quantityNeeded} ${opp.unit}.`
        });
      } else if (prod.stockQuantity >= oppKg * 0.4) {
        score += 15;
        factors.push({
          factor: 'Partial Volume Capacity',
          match: true,
          details: `Supplier has ${prod.stockQuantity} ${prod.stockUnit} (approx ${Math.round((prod.stockQuantity / oppKg) * 100)}% of requested volume). Multi-farm aggregation possible.`
        });
      } else {
        factors.push({
          factor: 'Volume Capacity',
          match: false,
          details: `Requested volume (${opp.quantityNeeded} ${opp.unit}) exceeds single-farm spot stock. Requires cooperative pooling.`
        });
        missingInfo.push('Cooperative aggregation agreement required for full volume');
      }

      // 3. Quality & Certification Standard (Max 20 pts)
      if (opp.qualityGrade.toLowerCase().includes('export') || opp.qualityGrade.toLowerCase().includes('grade a')) {
        if (prod.grade.includes('Grade A') || prod.grade.includes('Export Quality')) {
          score += 20;
          factors.push({
            factor: 'Quality Grade & Certifications',
            match: true,
            details: `Certified ${prod.grade}. Matches buyer requirement for ${opp.qualityGrade}.`
          });
        } else {
          score += 10;
          factors.push({
            factor: 'Quality Standard',
            match: false,
            details: `Listing is ${prod.grade}; buyer requested ${opp.qualityGrade}.`
          });
          missingInfo.push('Phytosanitary inspection certificate required');
        }
      } else {
        score += 15;
        factors.push({
          factor: 'Commercial Quality',
          match: true,
          details: 'Standard grade sufficient for requested processing.'
        });
      }

      // 4. Logistics & Destination Feasibility (Max 20 pts)
      if (opp.destinationCountry === 'Cameroon') {
        score += 20;
        factors.push({
          factor: 'Domestic Transit Feasibility',
          match: true,
          details: `Direct domestic transit from ${prod.farmLocation} to ${opp.destinationLocation}.`
        });
      } else if (prod.exportReady || prod.grade === 'Export Quality') {
        score += 20;
        factors.push({
          factor: 'Export Transit & Port Clearance',
          match: true,
          details: `Supplier is export-cleared for international destination (${opp.destinationCountry}).`
        });
      } else {
        score += 10;
        factors.push({
          factor: 'International Logistics',
          match: false,
          details: `Destination is ${opp.destinationCountry}; supplier requires export agency forwarding.`
        });
        missingInfo.push('Export documentation / freight forwarder assignment');
      }

      // Check threshold for match suggestion (>= 60%)
      if (score >= 60) {
        // Automated contact decision
        const contactDecision = evaluateContactDecision(opp, score);

        matches.push({
          id: `match-${opp.id}-${prod.id}`,
          opportunityId: opp.id,
          opportunityTitle: opp.title,
          opportunity: opp,
          productId: prod.id,
          product: prod,
          supplierId: prod.farmId,
          supplierName: prod.farmName,
          compatibilityScore: Math.min(score, 99),
          matchReasonSummary: `High compatibility on ${prod.name} with verified demand in ${opp.destinationCountry}.`,
          detailedFactors: factors,
          missingInfo,
          automatedContactPermitted: contactDecision.permitted,
          contactDecisionReason: contactDecision.reason,
          status: 'suggested',
          createdAt: new Date().toISOString()
        });
      }
    }
  }

  // Sort by highest compatibility score first
  return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}

// -------------------------------------------------------------
// CONTACT DECISION ENGINE
// -------------------------------------------------------------

export function evaluateContactDecision(
  opportunity: DemandOpportunity,
  compatibilityScore: number
): { permitted: boolean; status: ContactPermissionStatus; reason: string } {
  // Prohibited or opted-out
  if (opportunity.contactPermissionStatus === 'prohibited_opt_out') {
    return {
      permitted: false,
      status: 'prohibited_opt_out',
      reason: 'Recipient has opted out of automated contact or channel prohibits unsolicited inquiries.'
    };
  }

  // Manual review required
  if (opportunity.contactPermissionStatus === 'manual_review_required') {
    return {
      permitted: false,
      status: 'manual_review_required',
      reason: 'Source requires formal RFP submission through official portal or buyer requested manual pre-qualification.'
    };
  }

  // If score is too low, do not auto-contact
  if (compatibilityScore < 75) {
    return {
      permitted: false,
      status: 'manual_review_required',
      reason: `Compatibility score (${compatibilityScore}%) is below the safe threshold (75%) for direct outreach. Manual review advised.`
    };
  }

  // Check source credibility
  if (opportunity.sourceCredibilityScore < 80) {
    return {
      permitted: false,
      status: 'manual_review_required',
      reason: 'Source credibility score is under review. Supplier should verify contact authenticity before sending.'
    };
  }

  return {
    permitted: true,
    status: 'direct_outreach_permitted',
    reason: 'Verified public buyer request with explicit contact permission. Pre-formatted reviewable introduction permitted.'
  };
}

// -------------------------------------------------------------
// WHATSAPP URL GENERATOR & MESSAGE BUILDER
// -------------------------------------------------------------

export function formatWhatsAppUrl(phoneNumber: string, messageText: string): string {
  // Clean phone number (remove spaces, parentheses, dashes, leading +)
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(messageText);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

export function generateIntroductionWhatsAppMessage(
  opportunity: DemandOpportunity,
  product: Product,
  farm: Farm
): string {
  return `Hello ${opportunity.buyerOrgName},

I am writing from ${farm.name} via the AgriFlow Agricultural Exchange. 
We reviewed your verified request on ${opportunity.sourceName} for ${opportunity.quantityNeeded} ${opportunity.unit} of ${opportunity.productSought}.

Our farm in ${farm.location} currently has ${product.stockQuantity} ${product.stockUnit} of certified ${product.name} (${product.grade}) ready for dispatch.

• Origin: ${farm.location}, ${farm.country || 'Cameroon'}
• Variety: ${product.variety}
• Direct Wholesale Offer: ${product.wholesalePrice} ${opportunity.currency === 'XAF' ? 'FCFA' : 'USD'} / ${product.wholesaleUnit}
• Certifications: ${product.certifications.join(', ') || 'GAP Standard'}

You can inspect our verified farm provenance and lab certificates here on AgriFlow:
https://winning-project.vercel.app/

Would you like us to provide an official quotation and sample dispatch for your destination in ${opportunity.destinationLocation}?

Best regards,
${farm.ownerName}
${farm.name}`;
}
