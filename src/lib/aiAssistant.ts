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
  type: 'navigate' | 'search' | 'open_cart' | 'open_notifications' | 'open_supabase' | 'block_admin';
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

  // 1. Admin Portal Guardrail (Assistant MUST NEVER open the Admin Portal)
  if (lower.includes('admin') || lower.includes('security dashboard') || lower.includes('command center') || lower.includes('moderation')) {
    return { type: 'block_admin', label: 'Admin access restricted' };
  }

  // 2. Services Hub / Specialist Booking
  if (lower.includes('service') || lower.includes('tractor') || lower.includes('tillage') || lower.includes('agronomist') || lower.includes('drone') || lower.includes('hire') || lower.includes('veterinary') || lower.includes('book a') || lower.includes('irrigation engineer')) {
    return { type: 'navigate', target: 'services', label: 'Opened Service Booking Hub' };
  }

  // 3. Supplier & Farmer Dashboard / Portal
  if (lower.includes('supplier dashboard') || lower.includes('supplier portal') || lower.includes('farmer dashboard') || lower.includes('farmer portal') || lower.includes('my farm') || lower.includes('list harvest') || lower.includes('add produce') || lower.includes('farmer hub') || lower.includes('open supplier')) {
    return { type: 'navigate', target: 'farmer_portal', label: 'Opened Supplier & Farmer Portal' };
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

  if (action?.type === 'block_admin') {
    replyText = isPcm
      ? "Ah, I no get permission to open di Admin Portal from here. For security, make you just type /admin directly for your browser address bar."
      : "I can't open the admin portal from here for security reasons. You can get straight to it by typing /admin into your browser's address bar.";
  } else if (action?.type === 'navigate') {
    if (action.target === 'services') {
      replyText = isPcm
        ? "Here is di Service Hub! You fit find tractor operators, soil specialists, drone sprayers, and cold trucks here."
        : "Here's the Service Hub! You'll find tractor operators, agronomists, drone pilots, and transport trucks listed here.";
    } else if (action.target === 'marketplace') {
      replyText = isPcm
        ? `Welcome to di marketplace! We get about ${request.context.productCount || 8} fresh harvest batches ready for order right now.`
        : `Here's the marketplace! We've got ${request.context.productCount || 8} fresh batches ready from local farms right now.`;
    } else if (action.target === 'demand_radar') {
      replyText = isPcm
        ? `Check out Demand Radar! We get ${request.context.opportunityCount || 12} active buyer requests and tenders open today.`
        : `Here's the Demand Radar. There are ${request.context.opportunityCount || 12} buyer requests and tenders open right now.`;
    } else if (action.target === 'farmer_portal') {
      replyText = isPcm
        ? "Here be your farmer portal! You fit post a new harvest batch, check your cold storage, or see who wan buy from you."
        : "Here's your farmer portal! You can list a new batch, check on your storage, or see incoming buyer bids.";
    } else {
      replyText = isPcm
        ? `No wahala, I don take you go ${action.label}!`
        : `Sure thing! Taking you over to ${action.label} now.`;
    }
  } else if (action?.type === 'open_cart') {
    replyText = isPcm
      ? "Here is your cart! Check your items make sure everything correct before you checkout."
      : "Here's your cart! You can review what you've picked and head to checkout when you're ready.";
  } else if (action?.type === 'open_notifications') {
    replyText = isPcm
      ? `You get ${request.context.unreadNotificationCount || 0} new alert${request.context.unreadNotificationCount === 1 ? '' : 's'}. Make I open dem for you.`
      : `You have ${request.context.unreadNotificationCount || 0} unread notification${request.context.unreadNotificationCount === 1 ? '' : 's'}. Opening them up for you now.`;
  } else if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
    replyText = isPcm
      ? "Plantains dey go around 400 to 450 FCFA per kilo, Penja white pepper is roughly 24,000 FCFA/kg, and plum tomatoes dey about 450 FCFA/kg. Farmers dey keep about 88% of di sale directly. You wan make I open di market for you?"
      : "Plantains are currently going for around 400 to 450 FCFA/kg, Penja white pepper is about 24,000 FCFA/kg, and plum tomatoes are at 450 FCFA/kg. Farmers take home about 88% directly. Want me to open the marketplace?";
  } else if (lower.includes('tractor') || lower.includes('plough') || lower.includes('tillage') || lower.includes('service')) {
    replyText = isPcm
      ? "If you need tractor work, Jean-Luc Ngassa get a strong 75HP John Deere tractor for tillage at 45,000 FCFA per hectare in West region. You fit book a date with him straight from our Service Hub!"
      : "For tractor work, Jean-Luc Ngassa has a 75HP tractor with a disc plough available at 45,000 FCFA per hectare in the West region. You can book an open date slot with him in the Service Hub.";
  } else if (lower.includes('pest') || lower.includes('disease') || lower.includes('fungus') || lower.includes('fertilizer')) {
    replyText = isPcm
      ? "For bugs or pests, spray some cold-pressed neem oil mixed with small mild soap and water (like 5ml per liter) early in the morning or when sun go down so leaves no go burn. For worms or caterpillars, Bt powder dey work well. If you need someone to inspect your farm, Dr. Jean-Paul Mvogo dey available for our Service Hub."
      : "For natural pest control, spray cold-pressed neem oil mixed with a little mild liquid soap and water (about 5ml per liter) early in the morning or at dusk so the sun doesn't scorch the leaves. For caterpillars, Bt works great. If you want an expert to check your fields in person, Dr. Jean-Paul Mvogo is available in our Service Hub.";
  } else {
    replyText = isPcm
      ? "I dey hear you! Whether you wan check crop prices, find buyers, or get someone to help with tractor work, I dey here. Wetin we go look first?"
      : "Got it! Whether you're checking crop prices, looking for buyers, or booking a tractor for your fields, I can help you out. What's on your mind?";
  }

  return {
    message: replyText,
    provider: 'agriflow-assistant',
    action
  };
}
