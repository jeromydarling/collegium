import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowRight, Clock, ShieldCheck, MessageCircle } from "lucide-react";

export function InterviewBegin() {
  const navigate = useNavigate();
  return (
    <div className="collegium-theme bg-[hsl(var(--c-cream))] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 collegium-safe-bottom">
        <Link
          to="/auxilium"
          className="text-xs collegium-link mb-6 inline-flex items-center gap-1"
        >
          <ChevronLeft size={12} /> Back
        </Link>

        <p className="collegium-latin text-sm text-[hsl(var(--c-wine))] mb-2">
          Colloquium — A conversation
        </p>
        <h1 className="collegium-display text-3xl sm:text-4xl mb-4 leading-tight">
          Before you do anything else, let's talk.
        </h1>
        <p className="text-base sm:text-lg text-[hsl(var(--c-slate))] leading-relaxed mb-6">
          For the next 10 to 15 minutes, an AI interviewer will ask you about
          what's happening — the way a calm legal-aid lawyer would in a first
          intake. One question at a time. Plain English.
        </p>
        <p className="text-sm sm:text-base text-[hsl(var(--c-slate-soft))] leading-relaxed mb-8 sm:mb-10">
          When we're done, you'll have a personalized matter file: your story
          in your own words, a timeline, possible defenses worth exploring,
          a document checklist tailored to <em>your</em> situation, and a list
          of questions to ask a real lawyer. You can walk into one hour of a
          real attorney's time with all of that already in hand.
        </p>

        <div className="space-y-4 mb-8 sm:mb-10">
          <Row
            icon={MessageCircle}
            title="It's a conversation, not a form"
            body="You can answer in your own words. The interviewer follows up on what you say."
          />
          <Row
            icon={Clock}
            title="About 10–15 minutes"
            body="You can pause and come back. Your answers are saved on your device."
          />
          <Row
            icon={ShieldCheck}
            title="Information, not advice"
            body="The AI doesn't tell you what to do. It gathers your story so a real lawyer can."
          />
        </div>

        <div className="collegium-card-warm p-5 mb-8">
          <h3 className="collegium-display text-lg mb-2 leading-tight">
            A note on privacy
          </h3>
          <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed">
            Your answers stay on this device. They don't travel to a server we
            control until <em>you</em> choose to share your matter file with a
            clinic or attorney. You can delete everything at any time.
          </p>
        </div>

        <button
          onClick={() => navigate("/auxilium/interview")}
          className="collegium-btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto text-base"
        >
          Begin the interview <ArrowRight size={18} />
        </button>

        <p className="text-xs text-[hsl(var(--c-slate-soft))] mt-5 leading-relaxed">
          We start with eviction and housing — the most time-sensitive matter
          we handle. Other matter types (benefits, debt collection, family,
          immigration) will get their own interviews in the coming weeks.
        </p>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Clock;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-[hsl(var(--c-wine)/0.08)] flex items-center justify-center text-[hsl(var(--c-wine))] shrink-0">
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <h3 className="collegium-display text-lg leading-tight mb-1">
          {title}
        </h3>
        <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed">
          {body}
        </p>
      </div>
    </div>
  );
}
