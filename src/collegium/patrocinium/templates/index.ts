import type { TemplateDefinition } from "./TemplateRunner";
import { evictionAnswerTemplate } from "./evictionAnswer";
import { sealingPetitionTemplate } from "./sealingPetition";
import { ssiReconsiderationTemplate } from "./ssiReconsideration";
import { voucherPreservationTemplate } from "./voucherPreservation";

/**
 * Registry of guided templates. Adding a new template = drop the
 * definition file here and import it.
 */
export const templateRegistry: Record<string, TemplateDefinition> = {
  [evictionAnswerTemplate.slug]: evictionAnswerTemplate,
  [sealingPetitionTemplate.slug]: sealingPetitionTemplate,
  [ssiReconsiderationTemplate.slug]: ssiReconsiderationTemplate,
  [voucherPreservationTemplate.slug]: voucherPreservationTemplate,
};

export function getTemplate(slug: string): TemplateDefinition | null {
  return templateRegistry[slug] ?? null;
}

export function isGuidedTemplate(slug: string): boolean {
  return slug in templateRegistry;
}

export { TemplateRunner } from "./TemplateRunner";
export type { TemplateDefinition, TemplateAnswers } from "./TemplateRunner";
