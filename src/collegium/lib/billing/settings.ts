/**
 * Stripe configuration store — Payment Links per plan + Connect setup.
 *
 * Two integration surfaces live here:
 *
 * 1. **Stripe Payment Links** — one URL per pricing plan. User creates the
 *    plans + prices in their Stripe dashboard, copies the Payment Link URL
 *    for each, pastes them here. The Subscribe buttons just open the URL.
 *    No backend required.
 *
 * 2. **Stripe Connect** — the low-bono transaction handshake. User provides
 *    their publishable key + the connected-accounts setup. When real, each
 *    tenant onboards as a Connect Express account and we route client
 *    payments through it.
 *
 * All values live in localStorage; nothing leaves the browser until the
 * user hits an actual Stripe URL or API endpoint.
 */

import type { PlanTier } from "../../data/tenants";

const KEYS = {
  paymentLinks: "collegium.billing.payment_links.v1",
  publishableKey: "collegium.billing.publishable_key.v1",
  connectAccountId: "collegium.billing.connect_account_id.v1",
} as const;

export type PaymentLinkMap = Partial<Record<PlanTier, string>>;

export function getPaymentLinks(): PaymentLinkMap {
  try {
    const raw = localStorage.getItem(KEYS.paymentLinks);
    if (!raw) return {};
    return JSON.parse(raw) as PaymentLinkMap;
  } catch {
    return {};
  }
}

export function setPaymentLink(plan: PlanTier, url: string): void {
  const current = getPaymentLinks();
  if (url.trim() === "") {
    delete current[plan];
  } else {
    current[plan] = url.trim();
  }
  try {
    localStorage.setItem(KEYS.paymentLinks, JSON.stringify(current));
  } catch {
    /* silent */
  }
}

export function clearPaymentLinks(): void {
  try {
    localStorage.removeItem(KEYS.paymentLinks);
  } catch {
    /* silent */
  }
}

export function getPublishableKey(): string | null {
  try {
    return localStorage.getItem(KEYS.publishableKey);
  } catch {
    return null;
  }
}

export function setPublishableKey(key: string): void {
  try {
    if (key.trim() === "") {
      localStorage.removeItem(KEYS.publishableKey);
    } else {
      localStorage.setItem(KEYS.publishableKey, key.trim());
    }
  } catch {
    /* silent */
  }
}

export function hasStripeConfigured(): boolean {
  const links = getPaymentLinks();
  return Object.keys(links).length > 0;
}

export function hasPaymentLink(plan: PlanTier): boolean {
  return !!getPaymentLinks()[plan];
}

export const STRIPE_DEMO_LINKS: PaymentLinkMap = {
  "personal-pro": "https://buy.stripe.com/test_personal_pro_demo",
  chapter: "https://buy.stripe.com/test_chapter_demo",
  network: "https://buy.stripe.com/test_network_demo",
  institution: "https://buy.stripe.com/test_institution_demo",
  enterprise: "https://buy.stripe.com/test_enterprise_demo",
};
