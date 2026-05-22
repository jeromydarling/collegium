import { Link, useParams } from "react-router-dom";
import { getTemplate, TemplateRunner } from "./templates";
import { getCase } from "./data/cases";

/**
 * Generic route for guided templates. Resolves the matter + the template
 * definition by URL params and hands off to TemplateRunner.
 */
export function TemplatePage() {
  const { id, slug } = useParams<{ id: string; slug: string }>();
  const c = id ? getCase(id) : null;
  const template = slug ? getTemplate(slug) : null;

  if (!c || !template) {
    return (
      <div className="collegium-theme min-h-screen bg-[hsl(var(--c-cream))]">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center text-sm text-[hsl(var(--c-slate-soft))]">
          {!c ? "Case" : "Template"} not found.{" "}
          <Link to="/patrocinium/cases" className="collegium-link">
            Back to cases
          </Link>
          .
        </div>
      </div>
    );
  }

  return <TemplateRunner template={template} case={c} />;
}
