export interface AssistantRequest {
  message: string;
  language: 'en' | 'pcm';
  context: {
    productCount: number;
    opportunityCount: number;
    unreadNotificationCount: number;
  };
}

export async function askAgriFlowAssistant(request: AssistantRequest): Promise<{ message: string; provider?: string }> {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || 'AI assistant is not configured.');
  }

  return payload as { message: string; provider?: string };
}
