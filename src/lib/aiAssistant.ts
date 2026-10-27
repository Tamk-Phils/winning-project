import type { AppView, VoiceLanguage } from '../types';

export interface AssistantRequest {
  message: string;
  language: VoiceLanguage;
  context: {
    productCount: number;
    opportunityCount: number;
    unreadNotificationCount: number;
    serviceProviderCount?: number;
    activeView?: AppView;
  };
}

export interface AssistantAction {
  type: 'navigate' | 'search' | 'open_cart' | 'open_notifications' | 'open_supabase';
  target?: AppView;
  query?: string;
  label: string;
}

export interface AssistantResponse {
  message: string;
  provider?: string;
  action?: AssistantAction;
}

export function detectActionFromMessage(text: string): AssistantAction | undefined {
  const lower = text.toLowerCase().trim();

  // 1. Admin Dashboard
  if (lower.includes('admin') || lower.includes('security dashboard') || lower.includes('command center') || lower.includes('moderation')) {
    return { type: 'navigate', target: 'admin_dashboard', label: 'Opened Admin Dashboard' };
  }

  // 2. Services Hub / Specialist Booking
  if (lower.includes('service') || lower.includes('tractor') || lower.includes('tillage') || lower.includes('agronomist') || lower.includes('drone') || lower.includes('hire') || lower.includes('veterinary') || lower.includes('book a') || lower.includes('irrigation engineer')) {
    return { type: 'navigate', target: 'services', label: 'Opened Service Booking Hub' };
  }

  // 3. Marketplace & Produce Search
  if (lower.startsWith('search for') || lower.startsWith('find produce') || lower.startsWith('look for')) {
    const query = lower.replace(/^(search for|find produce|look for)\s+/i, '').trim();
    return { type: 'search', query, label: `Searched for "${query}"` };
  }

  if (lower.includes('shop') || lower.includes('marketplace') || lower.includes('buy produce') || lower.includes('vegetable') || lower.includes('plantain') || lower.includes('tomato')) {
    return { type: 'navigate', target: 'marketplace', label: 'Opened Produce Marketplace' };
  }

  // 4. Demand Radar & Buyers
  if (lower.includes('demand') || lower.includes('buyer') || lower.includes('rfq') || lower.includes('who wants to buy') || lower.includes('tender')) {
    return { type: 'navigate', target: 'demand_radar', label: 'Opened Demand Radar' };
  }

  // 5. Farmer Command Portal
  if (lower.includes('farmer portal') || lower.includes('my farm') || lower.includes('list harvest') || lower.includes('add produce') || lower.includes('farmer hub')) {
    return { type: 'navigate', target: 'farmer_portal', label: 'Opened Farmer Portal' };
  }

  // 6. Family Farms Showcase
  if (lower.includes('farm story') || lower.includes('connect with farms') || lower.includes('verified farms') || lower.includes('meet farmers')) {
    return { type: 'navigate', target: 'farms', label: 'Opened Verified Farms' };
  }

  // 7. CSA Boxes
  if (lower.includes('csa') || lower.includes('subscription') || lower.includes('bounty box') || lower.includes('weekly basket')) {
    return { type: 'navigate', target: 'csa_boxes', label: 'Opened CSA Subscriptions' };
  }

  // 8. Wholesale Hub
  if (lower.includes('wholesale') || lower.includes('b2b') || lower.includes('bulk purchase') || lower.includes('commercial portal')) {
    return { type: 'navigate', target: 'wholesale_hub', label: 'Opened Wholesale Portal' };
  }

  // 9. Logistics & Fleet
  if (lower.includes('logistics') || lower.includes('cold room') || lower.includes('fleet') || lower.includes('cold chain') || lower.includes('transport')) {
    return { type: 'navigate', target: 'logistics', label: 'Opened Logistics & Cold-Chain' };
  }

  // 10. Orders
  if (lower.includes('order') || lower.includes('track') || lower.includes('dispatch') || lower.includes('delivery status')) {
    return { type: 'navigate', target: 'orders', label: 'Opened Live Order Tracker' };
  }

  // 11. Sell / Onboarding
  if (lower.includes('sell on agriflow') || lower.includes('join as farmer') || lower.includes('farmer onboarding') || lower.includes('register farm')) {
    return { type: 'navigate', target: 'onboarding', label: 'Opened Farmer Onboarding' };
  }

  // 12. Impact
  if (lower.includes('impact') || lower.includes('soil health') || lower.includes('sustainability') || lower.includes('regenerative')) {
    return { type: 'navigate', target: 'impact', label: 'Opened Soil & Impact Report' };
  }

  // 13. Live Chat
  if (lower.includes('live chat') || lower.includes('message') || lower.includes('inbox') || lower.includes('talk to supplier')) {
    return { type: 'navigate', target: 'live_chat', label: 'Opened Live Chat' };
  }

  // 14. Cart
  if (lower.includes('cart') || lower.includes('checkout') || lower.includes('my basket')) {
    return { type: 'open_cart', label: 'Opened Shopping Cart' };
  }

  // 15. Notifications
  if (lower.includes('notification') || lower.includes('alert')) {
    return { type: 'open_notifications', label: 'Opened Notifications' };
  }

  // 16. Supabase / Database
  if (lower.includes('database') || lower.includes('supabase') || lower.includes('schema') || lower.includes('sql')) {
    return { type: 'open_supabase', label: 'Opened Database Config' };
  }

  return undefined;
}

export async function askAgriFlowAssistant(request: AssistantRequest): Promise<AssistantResponse> {
  const action = detectActionFromMessage(request.message);

  // Try calling the LLM backend first
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (response.ok) {
      const payload = await response.json();
      if (payload && payload.message) {
        return {
          message: payload.message,
          provider: payload.provider || 'llm',
          action
        };
      }
    }
  } catch {
    // If backend endpoint is unavailable, fall through to client-side reasoning engine
  }

  // Intelligent Context-Aware Agentic Fallback
  const lower = request.message.toLowerCase();
  const isPcm = request.language === 'pcm';

  let replyText = '';

  if (action?.type === 'navigate') {
    if (action.target === 'admin_dashboard') {
      replyText = isPcm
        ? "I don open di Admin Dashboard for you right away. You fit enter passcode 'agriflow-admin-2026' or click quick unlock make you see system telemetry, demand radar, and disputes."
        : "Navigated to the Admin Dashboard for you. You can enter passcode 'agriflow-admin-2026' or use Quick Unlock to inspect live crawler telemetry, demand matches, and security logs.";
    } else if (action.target === 'services') {
      replyText = isPcm
        ? "I don switch to di Service Booking Hub. You fit browse certified agronomists, heavy tractor operators, spray drone pilots, or register your own service profile!"
        : "Opened the Agricultural Service Booking Hub for you. You can browse certified agronomists, tractor tillage contractors, spray drone pilots, and refrigerated cold-chain haulers.";
    } else if (action.target === 'marketplace') {
      replyText = isPcm
        ? `I don carry you go Marketplace! We get ${request.context.productCount || 8} verified farm harvest batches wey ready for order.`
        : `Opened the Produce Marketplace. There are currently ${request.context.productCount || 8} fresh harvest batches available directly from certified regenerative growers.`;
    } else if (action.target === 'demand_radar') {
      replyText = isPcm
        ? `Demand Radar opened! We get ${request.context.opportunityCount || 12} active buyer request and commercial RFQ wey you fit supply.`
        : `Switched to Demand Radar. Currently tracking ${request.context.opportunityCount || 12} verified buyer contracts, hotel tenders, and international export RFQs.`;
    } else if (action.target === 'farmer_portal') {
      replyText = isPcm
        ? "Farmer Portal opened. You fit add new harvest batch, check price trends, or review incoming wholesale inquiries."
        : "Navigated to the Farmer Command Hub. Here you can publish new harvest batches, monitor cold storage telemetry, and review direct buyer bids.";
    } else {
      replyText = isPcm
        ? `I don navigate to ${action.label} in di background for you!`
        : `Navigated to ${action.label} in the background.`;
    }
  } else if (action?.type === 'open_cart') {
    replyText = isPcm
      ? "I don open your cart drawer make you see your items and proceed to escrow checkout."
      : "Opened your shopping cart drawer. You can review items, select delivery preferences, and proceed to escrow checkout.";
  } else if (action?.type === 'open_notifications') {
    replyText = isPcm
      ? `You get ${request.context.unreadNotificationCount || 0} unread notification dem. I don open di notification panel for you.`
      : `You have ${request.context.unreadNotificationCount || 0} unread notifications. Opened the notification drawer for you.`;
  } else if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
    replyText = isPcm
      ? "Market prices for AgriFlow dey follow direct farmer rates: Giant French Horn Plantains dey around 400 - 450 FCFA/kg, Penja White Pepper Grade A+ dey 24,000 FCFA/kg, and Foumbot Plum Tomatoes dey 450 FCFA/kg. You wan make I open di marketplace?"
      : "Current benchmark rates on AgriFlow: Fresh French Horn Plantains at 400-450 FCFA/kg, authentic PGI Penja White Pepper at 24,000 FCFA/kg, and Volcanic Plum Tomatoes at 450 FCFA/kg. Direct farm-gate payouts average 88.6%. Would you like me to open the marketplace?";
  } else if (lower.includes('tractor') || lower.includes('plough') || lower.includes('tillage') || lower.includes('service')) {
    replyText = isPcm
      ? "For tractor and tillage services, Jean-Luc Ngassa dey provide John Deere 75HP tractor with deep disc plough at 45,000 FCFA per hectare in West region. You fit book am directly for our Service Hub!"
      : "For heavy mechanization, verified contractor Jean-Luc Ngassa provides 75HP 4WD tractor tillage and disc ploughing at 45,000 FCFA/hectare. You can book an available date slot in our Service Hub.";
  } else if (lower.includes('pest') || lower.includes('disease') || lower.includes('fungus') || lower.includes('fertilizer')) {
    replyText = isPcm
      ? "For organic pest control, you fit spray cold-pressed neem oil (5ml per liter water with mild potassium soap) or fermented compost tea. Make you avoid synthetic organophosphates if you wan sell for export grade!"
      : "For regenerative pest management: apply cold-pressed neem oil emulsified with mild liquid castile soap (5ml/L water) in early morning or dusk, or apply Bacillus thuringiensis (Bt) for caterpillars. Dr. Jean-Paul Mvogo is also available for in-field soil & pest consultations in our Service Hub.";
  } else {
    replyText = isPcm
      ? `I hear you clearly: "${request.message}". As your AgriFlow AI Copilot, I fit help you check buyer requests, book tractors or agronomists, open pages for you, or find fresh harvest. Wetin you need?`
      : `I understood: "${request.message}". As your AgriFlow Copilot, I can navigate pages instantly, help you book field specialists, check active buyer demands, or verify harvest pricing. What would you like to explore next?`;
  }

  return {
    message: replyText,
    provider: 'agriflow-copilot',
    action
  };
}
