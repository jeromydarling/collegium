/**
 * Tenant model — every paying entity is a tenant.
 *
 * Tenants own members, branding, plan tier, usage counters, and (for
 * scholarship-funded tenants) sponsor attribution. The same shape covers
 * every customer type: solo attorneys, chapters, dioceses, law firms,
 * Catholic Charities affiliates, foundations.
 *
 * The Communio module already assumes multi-tenant; this module makes the
 * tenant a first-class concept in the data layer. When Stripe wires up,
 * the tenant id is the foreign key that ties subscription to product.
 */

export type PlanTier =
  | "free"
  | "personal-pro"
  | "chapter"
  | "network"
  | "institution"
  | "enterprise"
  | "underwriter"
  | "scholarship";

export type TenantType =
  | "individual"
  | "chapter"
  | "diocese"
  | "law-firm"
  | "catholic-charities"
  | "law-school"
  | "national-affiliate"
  | "foundation";

export type BillingState = "active" | "trialing" | "past-due" | "canceled" | "scholarship";

export interface PlanLimits {
  /** Max active members. null = unlimited. */
  maxMembers: number | null;
  /** Monthly AI intake-assist run allowance. null = at-cost+ unlimited. */
  monthlyAIRuns: number | null;
  /** Monthly SMS allowance. null = at-cost+ unlimited. */
  monthlySMS: number | null;
  /** Bar-format pro bono export available for paid jurisdictions. */
  barFormatExport: boolean;
  /** Custom branding (subdomain + logo). */
  customBranding: boolean;
  /** White-label option (no Collegium attribution). */
  whiteLabel: boolean;
  /** API access. */
  apiAccess: boolean;
  /** SSO. */
  sso: boolean;
  /** Patrocinium publishing rights — can post matters to the pro bono pool. */
  patrociniumPublishing: boolean;
  /** Communio peer-network publishing. */
  communioPublishing: boolean;
  /** Dedicated success contact. */
  dedicatedSuccess: boolean;
  /** Sponsorship pool — funds N scholarship accounts. 0 = no sponsorship. */
  sponsorshipPoolSeats: number;
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free: {
    maxMembers: 1,
    monthlyAIRuns: 5,
    monthlySMS: 0,
    barFormatExport: false,
    customBranding: false,
    whiteLabel: false,
    apiAccess: false,
    sso: false,
    patrociniumPublishing: false,
    communioPublishing: false,
    dedicatedSuccess: false,
    sponsorshipPoolSeats: 0,
  },
  "personal-pro": {
    maxMembers: 1,
    monthlyAIRuns: 50,
    monthlySMS: 0,
    barFormatExport: true,
    customBranding: false,
    whiteLabel: false,
    apiAccess: false,
    sso: false,
    patrociniumPublishing: false,
    communioPublishing: false,
    dedicatedSuccess: false,
    sponsorshipPoolSeats: 0,
  },
  chapter: {
    maxMembers: 10,
    monthlyAIRuns: 250,
    monthlySMS: 500,
    barFormatExport: true,
    customBranding: false,
    whiteLabel: false,
    apiAccess: false,
    sso: false,
    patrociniumPublishing: true,
    communioPublishing: false,
    dedicatedSuccess: false,
    sponsorshipPoolSeats: 0,
  },
  network: {
    maxMembers: 50,
    monthlyAIRuns: 1000,
    monthlySMS: 2500,
    barFormatExport: true,
    customBranding: true,
    whiteLabel: false,
    apiAccess: false,
    sso: false,
    patrociniumPublishing: true,
    communioPublishing: true,
    dedicatedSuccess: false,
    sponsorshipPoolSeats: 0,
  },
  institution: {
    maxMembers: 200,
    monthlyAIRuns: 5000,
    monthlySMS: 10000,
    barFormatExport: true,
    customBranding: true,
    whiteLabel: false,
    apiAccess: true,
    sso: true,
    patrociniumPublishing: true,
    communioPublishing: true,
    dedicatedSuccess: true,
    sponsorshipPoolSeats: 0,
  },
  enterprise: {
    maxMembers: null,
    monthlyAIRuns: null,
    monthlySMS: null,
    barFormatExport: true,
    customBranding: true,
    whiteLabel: true,
    apiAccess: true,
    sso: true,
    patrociniumPublishing: true,
    communioPublishing: true,
    dedicatedSuccess: true,
    sponsorshipPoolSeats: 0,
  },
  underwriter: {
    maxMembers: null,
    monthlyAIRuns: null,
    monthlySMS: null,
    barFormatExport: true,
    customBranding: true,
    whiteLabel: true,
    apiAccess: true,
    sso: true,
    patrociniumPublishing: true,
    communioPublishing: true,
    dedicatedSuccess: true,
    sponsorshipPoolSeats: 10,
  },
  scholarship: {
    // Scholarship tenants inherit the limits of whatever tier their sponsor
    // is funding — for the demo, default to network-equivalent.
    maxMembers: 50,
    monthlyAIRuns: 1000,
    monthlySMS: 2500,
    barFormatExport: true,
    customBranding: true,
    whiteLabel: false,
    apiAccess: false,
    sso: false,
    patrociniumPublishing: true,
    communioPublishing: true,
    dedicatedSuccess: false,
    sponsorshipPoolSeats: 0,
  },
};

export const PLAN_LABEL: Record<PlanTier, string> = {
  free: "Free",
  "personal-pro": "Personal Pro",
  chapter: "Chapter",
  network: "Network",
  institution: "Institution",
  enterprise: "Enterprise",
  underwriter: "Underwriter",
  scholarship: "Scholarship",
};

export const PLAN_MONTHLY_USD: Record<PlanTier, number> = {
  free: 0,
  "personal-pro": 9,
  chapter: 29,
  network: 99,
  institution: 299,
  enterprise: 999,
  underwriter: 1499,
  scholarship: 0, // pay-what-you-can; sponsor covers
};

export interface TenantBranding {
  /** Vanity subdomain segment, e.g. "arlington" → arlington.collegium.network. */
  subdomain: string;
  displayName: string;
  /** Latin micro-label shown in the tenant's app header. */
  latin?: string;
  /** Accent hue (HSL hue 0–360). Defaults to wine. */
  accentHue?: number;
}

export interface TenantUsage {
  /** Counts since the start of the current billing month. */
  aiRunsThisMonth: number;
  smsSentThisMonth: number;
  /** Lifetime totals — useful for grant reporting. */
  totalHoursLogged: number;
  totalMattersClosed: number;
}

export interface SponsorInfo {
  /** Tenant id of the underwriter funding this scholarship account. */
  underwriterTenantId: string;
  /** When the sponsorship started (ISO). */
  since: string;
  /** "Sponsored by X" attribution shown in UI. */
  attributionText: string;
}

export interface Tenant {
  id: string;
  type: TenantType;
  /** Plan tier — drives limits + branding privileges. */
  plan: PlanTier;
  billing: BillingState;
  /** Renewal date for paid plans (ISO). */
  renewsOn?: string;
  branding: TenantBranding;
  usage: TenantUsage;
  /** Member ids — references into the people/users space. */
  memberIds: string[];
  /** Set when this tenant is funded by an underwriter. */
  sponsor?: SponsorInfo;
  /** For underwriters: tenant ids they're sponsoring. */
  sponsoredTenantIds?: string[];
  /** Region for filtering / matching. */
  region?: string;
  /** Bar jurisdictions where members report pro bono hours. */
  jurisdictions: string[];
  /** When the tenant was created (ISO). */
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/* Demo tenants — the same five chapters from demo.ts, now as tenants */
/* ------------------------------------------------------------------ */

export const tenants: Tenant[] = [
  {
    id: "t-stm-boston",
    type: "chapter",
    plan: "chapter",
    billing: "active",
    renewsOn: "2026-06-15",
    branding: {
      subdomain: "stm-boston",
      displayName: "St. Thomas More Society of Boston",
      latin: "Capitulum Bostoniense",
      accentHue: 350,
    },
    usage: {
      aiRunsThisMonth: 47,
      smsSentThisMonth: 12,
      totalHoursLogged: 1247,
      totalMattersClosed: 41,
    },
    memberIds: ["p-coyle", "p-ohara", "p-falconio", "p-chen"],
    region: "Boston, MA",
    jurisdictions: ["MA", "NY"],
    createdAt: "2024-09-01",
  },
  {
    id: "t-clg-chicago",
    type: "diocese",
    plan: "institution",
    billing: "active",
    renewsOn: "2026-07-01",
    branding: {
      subdomain: "clg-chicago",
      displayName: "Catholic Lawyers Guild of Chicago",
      latin: "Collegium Iuristarum Catholicorum",
      accentHue: 350,
    },
    usage: {
      aiRunsThisMonth: 312,
      smsSentThisMonth: 489,
      totalHoursLogged: 4521,
      totalMattersClosed: 168,
    },
    memberIds: ["p-ruiz", "p-lally", "p-kelly", "p-park"],
    region: "Chicago, IL",
    jurisdictions: ["IL", "IN", "WI"],
    createdAt: "2024-03-15",
  },
  {
    id: "t-jp2-cua",
    type: "law-school",
    plan: "chapter",
    billing: "active",
    renewsOn: "2026-08-01",
    branding: {
      subdomain: "jp2-cua",
      displayName: "Saint John Paul II Guild — CUA Law",
      latin: "Capitulum Iohannis Pauli",
      accentHue: 350,
    },
    usage: {
      aiRunsThisMonth: 28,
      smsSentThisMonth: 4,
      totalHoursLogged: 312,
      totalMattersClosed: 8,
    },
    memberIds: ["p-velasquez", "p-owens", "p-hartmann"],
    sponsor: {
      underwriterTenantId: "t-jones-day",
      since: "2025-09",
      attributionText: "Sponsored by Jones Day",
    },
    region: "Washington, DC",
    jurisdictions: ["DC", "MD", "VA"],
    createdAt: "2025-09-10",
  },
  {
    id: "t-cbf-toronto",
    type: "national-affiliate",
    plan: "network",
    billing: "active",
    renewsOn: "2026-09-01",
    branding: {
      subdomain: "clf-toronto",
      displayName: "Christian Legal Fellowship — Toronto",
      accentHue: 350,
    },
    usage: {
      aiRunsThisMonth: 87,
      smsSentThisMonth: 134,
      totalHoursLogged: 892,
      totalMattersClosed: 27,
    },
    memberIds: ["p-mwangi-stone", "p-tanner", "p-lim"],
    region: "Toronto, ON",
    jurisdictions: ["ON"],
    createdAt: "2024-11-22",
  },
  {
    id: "t-doc-arlington",
    type: "diocese",
    plan: "institution",
    billing: "active",
    renewsOn: "2026-05-30",
    branding: {
      subdomain: "cba-arlington",
      displayName: "Catholic Bar Association — Arlington",
      latin: "Iuristae Arlingtonienses",
      accentHue: 350,
    },
    usage: {
      aiRunsThisMonth: 156,
      smsSentThisMonth: 78,
      totalHoursLogged: 678,
      totalMattersClosed: 21,
    },
    memberIds: ["p-brennan", "p-roy", "p-cale"],
    region: "Arlington, VA",
    jurisdictions: ["VA", "DC", "MD"],
    createdAt: "2025-01-08",
  },
  {
    id: "t-jones-day",
    type: "law-firm",
    plan: "underwriter",
    billing: "active",
    renewsOn: "2026-08-15",
    branding: {
      subdomain: "jones-day",
      displayName: "Jones Day Pro Bono Practice",
      latin: "Patrocinium",
      accentHue: 220,
    },
    usage: {
      aiRunsThisMonth: 1247,
      smsSentThisMonth: 0,
      totalHoursLogged: 18420,
      totalMattersClosed: 412,
    },
    memberIds: [],
    sponsoredTenantIds: ["t-jp2-cua"],
    region: "National",
    jurisdictions: ["CA", "NY", "IL", "TX", "DC", "MA", "OH", "DC"],
    createdAt: "2024-08-15",
  },
];

/* ------------------------------------------------------------------ */
/* Selectors                                                            */
/* ------------------------------------------------------------------ */

export function getTenant(id: string): Tenant | null {
  return tenants.find((t) => t.id === id) ?? null;
}

export function tenantBySubdomain(subdomain: string): Tenant | null {
  return tenants.find((t) => t.branding.subdomain === subdomain) ?? null;
}

/** Tenants this tenant is sponsoring (only meaningful for underwriters). */
export function getSponsoredTenants(underwriterId: string): Tenant[] {
  const u = getTenant(underwriterId);
  if (!u?.sponsoredTenantIds) return [];
  return u.sponsoredTenantIds
    .map((id) => getTenant(id))
    .filter((t): t is Tenant => t !== null);
}

/** The underwriter funding this tenant, if any. */
export function getSponsorTenant(beneficiaryId: string): Tenant | null {
  const b = getTenant(beneficiaryId);
  if (!b?.sponsor) return null;
  return getTenant(b.sponsor.underwriterTenantId);
}

/** Limits effective for this tenant — handles scholarship inheriting sponsor tier. */
export function effectiveLimits(t: Tenant): PlanLimits {
  return PLAN_LIMITS[t.plan];
}

/** Active demo tenant — what the steward app currently represents. */
export const DEFAULT_TENANT_ID = "t-stm-boston";

/** Returns the tenant the demo viewer is "logged in as." */
export function defaultTenant(): Tenant {
  return getTenant(DEFAULT_TENANT_ID) ?? tenants[0];
}
