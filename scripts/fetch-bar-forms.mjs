#!/usr/bin/env node
/**
 * Fetch the canonical bar-form PDFs from government / bar-association
 * sources. Writes them into `assets/bar-forms/` where the build-time
 * code (Vite static asset serving) can hand them to `pdf-lib` for
 * filling at runtime.
 *
 * Usage:
 *   npm run forms:fetch
 *
 * Skips any URL that's null in the catalog (portal-handoff jurisdictions
 * don't have a downloadable artifact).
 *
 * Why a build-time fetch rather than committing the PDFs:
 *   - They're updated on the courts' own cadence; a fetch-on-demand
 *     keeps the repo from drifting stale.
 *   - The Florida URL rotates by Bar year (2025-2026 → 2026-2027 → ...);
 *     a small URL-resolver knows the pattern.
 *
 * Works in CI (GitHub Actions runner) and on dev laptops with unrestricted
 * outbound. In sandboxed environments with allowlists, the fetch will
 * fail — that's expected; commit the result from elsewhere.
 */

import { promises as fs } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..");
const OUTPUT_DIR = resolve(REPO_ROOT, "public/assets/bar-forms");

const FORMS = [
  {
    code: "US-NY",
    filename: "us-ny-affidavit.pdf",
    url: "https://ww2.nycourts.gov/ATTORNEYS/probono/AppForAdmission_Pro-BonoReq_Fillable.pdf",
    fallback: "https://www.nybarexam.org/admission/50Hour_ProBonoCertification_3.4.2020.pdf",
  },
  {
    code: "US-MA",
    filename: "us-ma-honor-roll.pdf",
    // SJC publishes the form at a mass.gov/doc/.../download URL that rotates
    // annually. The portal landing page exposes the live link; we use a
    // stable redirect when possible.
    url: "https://www.mass.gov/doc/sjc-pro-bono-honor-roll-certification-form-for-individual-attorneys/download",
    fallback: null,
  },
  {
    code: "US-NJ",
    filename: "us-nj-madden.pdf",
    url: "https://www.njcourts.gov/sites/default/files/forms/12100_voluntary_pro_bono_certification.pdf",
    fallback: null,
  },
  {
    code: "US-FL",
    filename: "us-fl-trust-probono.pdf",
    // FL Bar URL rotates by cycle year. Resolver tries the current and
    // prior cycles.
    url: resolveFloridaUrl(),
    fallback:
      "https://www-media.floridabar.org/uploads/2024/04/Trust-Acct-and-Pro-Bono-form-2024-2025-RE.pdf",
  },
];

function resolveFloridaUrl() {
  const now = new Date();
  const yearStart =
    now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
  const yearEnd = yearStart + 1;
  return `https://www-media.floridabar.org/uploads/${yearStart}/07/Trust-Acct-and-Pro-Bono-form-${yearStart}-${yearEnd}-ADA-RE-1.pdf`;
}

async function fetchOne(form) {
  const out = resolve(OUTPUT_DIR, form.filename);
  for (const url of [form.url, form.fallback].filter(Boolean)) {
    try {
      console.log(`  ${form.code} → ${url}`);
      const response = await fetch(url, {
        headers: {
          "user-agent":
            "Mozilla/5.0 (compatible; CollegiumBarFormsBot/1.0; +https://collegium.network)",
          accept: "application/pdf,*/*",
        },
        redirect: "follow",
      });
      if (!response.ok) {
        console.log(`    ✗ HTTP ${response.status}`);
        continue;
      }
      const buf = Buffer.from(await response.arrayBuffer());
      // Sanity check: PDFs start with %PDF
      if (buf.length < 1024 || !buf.subarray(0, 4).toString().startsWith("%PDF")) {
        console.log(`    ✗ Response was not a PDF (${buf.length} bytes)`);
        continue;
      }
      await fs.writeFile(out, buf);
      console.log(`    ✓ Saved ${(buf.length / 1024).toFixed(1)} KB → ${out}`);
      return true;
    } catch (err) {
      console.log(`    ✗ ${err.message}`);
    }
  }
  return false;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  console.log(`Fetching ${FORMS.length} official bar-form PDFs into ${OUTPUT_DIR}`);
  console.log("");
  let ok = 0;
  let failed = 0;
  for (const form of FORMS) {
    const success = await fetchOne(form);
    if (success) ok++;
    else failed++;
    console.log("");
  }

  console.log(`Done. ${ok} of ${FORMS.length} fetched successfully.`);
  if (failed > 0) {
    console.log("");
    console.log("If any failed, the bar may have moved the URL. Update");
    console.log("scripts/fetch-bar-forms.mjs and re-run. Portal-handoff");
    console.log("jurisdictions (CA, MD, IL, DC, TX) don't need fetched PDFs —");
    console.log("they're rendered fresh by the app each time.");
  }
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
