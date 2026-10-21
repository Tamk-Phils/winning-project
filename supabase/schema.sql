-- AgriFlow database schema
-- Run this file in Supabase Dashboard -> SQL Editor -> New query.
-- This creates empty tables. It does not insert mock or sample records.

create table if not exists public.farms (
  id text primary key,
  name text not null,
  tagline text,
  location text not null,
  state text,
  coordinates jsonb,
  region text,
  country text default 'Cameroon',
  "ownerName" text,
  story text,
  avatar text,
  "bannerImage" text,
  certifications text[],
  practices text[],
  acreage numeric,
  rating numeric default 0,
  "reviewCount" int default 0,
  "totalHarvestSoldKg" numeric default 0,
  "joinedYear" int,
  "directPayoutShare" numeric default 0,
  phone text,
  email text,
  "whatsappNumber" text,
  "privacySettings" jsonb default '{"showPhonePublicly":false,"showEmailPublicly":false,"showExactAddress":false,"allowWhatsAppDirect":false,"preferredContactMethod":"live_chat"}',
  "verificationBadges" jsonb default '{"identityVerified":false,"businessVerified":false,"exportCertified":false,"trustedTrader":false}',
  "minaderRegNumber" text,
  created_at timestamptz default now()
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
  variety text,
  "farmId" text references public.farms(id) on delete set null,
  "farmName" text not null,
  "farmLocation" text,
  "farmAvatar" text,
  description text,
  "imageUrl" text not null,
  "galleryUrls" text[],
  "retailPrice" numeric not null,
  "retailPriceXaf" numeric,
  "retailUnit" text not null,
  "wholesalePrice" numeric not null,
  "wholesalePriceXaf" numeric,
  "wholesaleUnit" text not null,
  "wholesaleMinOrder" numeric default 10,
  "stockQuantity" numeric not null,
  "stockUnit" text not null,
  "harvestDate" text,
  "harvestAgeHours" int default 0,
  "shelfLifeDays" int default 0,
  "coldChainTemp" text,
  grade text,
  certifications text[],
  practices text[],
  "nutritionalNotes" text[],
  "flavorProfile" text,
  "isOrganic" boolean default false,
  "isRegenerative" boolean default false,
  "inSeason" boolean default true,
  featured boolean default false,
  rating numeric default 0,
  "reviewsCount" int default 0,
  "originCountry" text,
  "exportReady" boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.demand_opportunities (
  id text primary key,
  title text not null,
  "productSought" text not null,
  category text not null,
  "quantityNeeded" numeric not null,
  unit text not null,
  "qualityGrade" text,
  "targetPrice" numeric,
  "targetPriceUnit" text,
  currency text default 'XAF',
  "destinationLocation" text not null,
  "destinationCountry" text not null,
  "deadlineDate" text,
  "buyerOrgName" text not null,
  "buyerType" text not null,
  "buyerContactMethod" text default 'rfq_portal',
  "buyerContactInfo" text,
  "originalSourceUrl" text not null,
  "sourceName" text not null,
  "sourceCredibilityScore" numeric default 0,
  "discoveryTimestamp" timestamptz default now(),
  "lastVerificationTimestamp" timestamptz default now(),
  status text default 'active_request',
  "contactPermissionStatus" text default 'manual_review_required',
  "extractionConfidence" numeric default 0,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.conversations (
  id text primary key,
  "buyerId" text not null,
  "buyerName" text not null,
  "buyerAvatar" text,
  "buyerLocation" text,
  "supplierId" text not null,
  "supplierName" text not null,
  "supplierAvatar" text,
  "relatedOpportunityId" text,
  "relatedProductId" text,
  subject text not null,
  "lastMessageText" text,
  "lastMessageTimestamp" timestamptz default now(),
  "unreadCountSupplier" int default 0,
  "unreadCountBuyer" int default 0,
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists public.chat_messages (
  id text primary key,
  "conversationId" text references public.conversations(id) on delete cascade,
  "senderId" text not null,
  "senderRole" text not null,
  "senderName" text not null,
  "messageText" text not null,
  "attachmentUrl" text,
  "attachmentType" text,
  timestamp timestamptz default now(),
  read boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.notifications (
  id text primary key,
  "userId" text,
  type text not null,
  title text not null,
  message text not null,
  timestamp timestamptz default now(),
  "isRead" boolean default false,
  "targetView" text,
  "targetId" text,
  "actionLabel" text,
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id text primary key,
  items jsonb not null,
  "customerName" text not null,
  "customerEmail" text not null,
  "customerPhone" text,
  "buyerType" text not null,
  "shippingAddress" text not null,
  "deliverySlot" text,
  "deliveryMethod" text,
  "tipPercentage" numeric default 0,
  subtotal numeric not null,
  "deliveryFee" numeric not null,
  "tipAmount" numeric not null,
  "farmerDirectPayout" numeric not null,
  "platformFee" numeric not null,
  total numeric not null,
  currency text default 'XAF',
  status text default 'confirmed',
  timeline jsonb,
  "createdAt" timestamptz default now()
);

create table if not exists public.bulk_rfqs (
  id text primary key,
  "companyName" text not null,
  "contactPerson" text not null,
  email text not null,
  phone text,
  "produceNeeded" text not null,
  category text,
  "volumeNeeded" text not null,
  frequency text not null,
  "deliveryLocation" text not null,
  "targetPriceRange" text,
  "coldChainRequired" boolean default true,
  "additionalNotes" text,
  status text default 'Pending Review',
  "createdAt" timestamptz default now()
);

create table if not exists public.disputes (
  id text primary key,
  "reporterName" text not null,
  "reporterRole" text not null,
  "reporterContact" text,
  "reportedEntityName" text not null,
  reason text not null,
  details text not null,
  status text default 'open_investigation',
  created_at timestamptz default now()
);

create table if not exists public.email_logs (
  id text primary key,
  "toEmail" text not null,
  "recipientName" text not null,
  subject text not null,
  template text not null,
  "bodyHtml" text not null,
  "bodyText" text not null,
  status text not null,
  provider text not null,
  timestamp timestamptz default now(),
  "errorMessage" text
);

create table if not exists public.sms_logs (
  id text primary key,
  "toPhone" text not null,
  "messageText" text not null,
  status text not null,
  provider text not null,
  timestamp timestamptz default now(),
  note text not null
);

alter table public.farms enable row level security;
alter table public.products enable row level security;
alter table public.demand_opportunities enable row level security;
alter table public.conversations enable row level security;
alter table public.chat_messages enable row level security;
alter table public.notifications enable row level security;
alter table public.orders enable row level security;
alter table public.bulk_rfqs enable row level security;
alter table public.disputes enable row level security;
alter table public.email_logs enable row level security;
alter table public.sms_logs enable row level security;

-- Public catalogue data only.
create policy "Public read farms" on public.farms for select using (true);
create policy "Public read products" on public.products for select using (true);
create policy "Public read demand opportunities" on public.demand_opportunities for select using (true);

-- Initial prototype insert policies. Tighten these with Supabase Auth user IDs before production.
create policy "Insert products" on public.products for insert to authenticated with check (true);
create policy "Insert farms" on public.farms for insert to authenticated with check (true);
create policy "Update farms" on public.farms for update to authenticated using (true) with check (true);
create policy "Delete products" on public.products for delete to authenticated using (true);
create policy "Insert orders" on public.orders for insert to anon, authenticated with check (true);
create policy "Insert RFQs" on public.bulk_rfqs for insert to anon, authenticated with check (true);
create policy "Insert disputes" on public.disputes for insert to authenticated with check (true);
create policy "Insert conversations" on public.conversations for insert to authenticated with check (true);
create policy "Insert messages" on public.chat_messages for insert to authenticated with check (true);
create policy "Insert notifications" on public.notifications for insert to authenticated with check (true);
create policy "Insert email logs" on public.email_logs for insert to authenticated with check (true);
create policy "Insert sms logs" on public.sms_logs for insert to authenticated with check (true);

-- Private tables are intentionally not publicly readable.
create policy "Participant read conversations" on public.conversations for select to authenticated using (auth.uid()::text = "buyerId" or auth.uid()::text = "supplierId");
create policy "Participant read messages" on public.chat_messages for select to authenticated using (exists (select 1 from public.conversations c where c.id = "conversationId" and (auth.uid()::text = c."buyerId" or auth.uid()::text = c."supplierId")));
create policy "Owner read notifications" on public.notifications for select to authenticated using (auth.uid()::text = "userId");

-- Enable Supabase Realtime for authenticated chat and notification clients.
do $$
begin
  alter publication supabase_realtime add table public.conversations;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.chat_messages;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.notifications;
exception when duplicate_object then null;
end $$;
