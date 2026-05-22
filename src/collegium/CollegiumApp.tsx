import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "./components/PublicLayout";
import { AppLayout } from "./components/AppLayout";

import { Landing } from "./pages/Landing";
import { Manifesto } from "./pages/Manifesto";
import { About } from "./pages/About";
import { Modules } from "./pages/Modules";
import { FormationMarketing } from "./pages/FormationMarketing";
import { Pricing } from "./pages/Pricing";
import { Contact } from "./pages/Contact";
import { DemoGate } from "./pages/DemoGate";
import { WhyProBono } from "./pages/WhyProBono";
import { Checkout } from "./pages/Checkout";
import { Onboarding } from "./pages/Onboarding";

import { Dashboard } from "./app/Dashboard";
import { ChaptersList, ChapterDetail } from "./app/Chapters";
import { Mentorship } from "./app/Mentorship";
import { Service } from "./app/Service";
import { NetworkInbox } from "./app/NetworkInbox";
import { Formation } from "./app/Formation";
import { Advancement } from "./app/Advancement";
import { NRIPulse } from "./app/NRIPulse";
import { DailyOffice } from "./app/DailyOffice";
import { CalendarPage } from "./app/Calendar";
import { CommunioDirectory, CommunioPeer } from "./app/Communio";
import { IntakeAssist } from "./app/IntakeAssist";
import { JusticeGapInsights } from "./app/JusticeGapInsights";
import { PracticeHub } from "./app/PracticeHub";
import { HoursDashboard } from "./app/HoursDashboard";
import { TenantRevenue } from "./app/TenantRevenue";

import { AuxiliumLanding } from "./auxilium/AuxiliumLanding";
import { MatterPicker } from "./auxilium/MatterPicker";
import { MatterGuide } from "./auxilium/MatterGuide";
import { FindHelp } from "./auxilium/FindHelp";
import { InterviewBegin } from "./auxilium/InterviewBegin";
import { Interview } from "./auxilium/Interview";
import { MatterFile } from "./auxilium/MatterFile";

import { JusticeGapLanding } from "./justicegap/Landing";
import { MapView as JusticeGapMap } from "./justicegap/MapView";
import { EssayView as JusticeGapEssay } from "./justicegap/EssayView";
import {
  StoriesView as JusticeGapStories,
  NewsView as JusticeGapNews,
  SolutionView as JusticeGapSolution,
} from "./justicegap/StubViews";

import { PatrociniumLanding } from "./patrocinium/PatrociniumLanding";
import { CaseBrowser } from "./patrocinium/CaseBrowser";
import { CaseDetail } from "./patrocinium/CaseDetail";
import { MyProBono } from "./patrocinium/MyProBono";
import { TemplatePage } from "./patrocinium/TemplatePage";

import "./styles.css";

// Vite injects the base URL at build time (e.g. "/" locally, "/collegium/" on
// GitHub Pages). React Router uses it as the basename so all internal routes
// work in both environments.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

function ScrollToTopOnNav() {
  // Re-mounting via key on Outlet handles most cases. This is a no-op fallback.
  return null;
}

export default function CollegiumApp() {
  return (
    <BrowserRouter basename={basename === "/" ? undefined : basename}>
      <ScrollToTopOnNav />
      <Routes>
        {/* Public marketing */}
        <Route element={<PublicLayout />}>
          <Route index element={<Landing />} />
          <Route path="manifesto" element={<Manifesto />} />
          <Route path="about" element={<About />} />
          <Route path="modules" element={<Modules />} />
          <Route path="formation" element={<FormationMarketing />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="contact" element={<Contact />} />
          <Route path="why-pro-bono" element={<WhyProBono />} />
          <Route path="demo" element={<DemoGate />} />
        </Route>

        {/* Checkout + onboarding live outside the marketing PublicLayout so
            they get their own focused chrome. */}
        <Route path="checkout" element={<Checkout />} />
        <Route path="onboarding" element={<Onboarding />} />

        {/* Auxilium — second front door. Plain English, public-facing. */}
        <Route path="auxilium" element={<AuxiliumLanding />} />
        <Route path="auxilium/begin" element={<InterviewBegin />} />
        <Route path="auxilium/interview" element={<Interview />} />
        <Route path="auxilium/matter-file" element={<MatterFile />} />
        <Route path="auxilium/start" element={<MatterPicker />} />
        <Route path="auxilium/matter/:slug" element={<MatterGuide />} />
        <Route path="auxilium/find-help" element={<FindHelp />} />

        {/* Justice Gap — third front door. Polemic + data viz. */}
        <Route path="justicegap" element={<JusticeGapLanding />} />
        <Route path="justicegap/map" element={<JusticeGapMap />} />
        <Route path="justicegap/map/:chapter" element={<JusticeGapMap />} />
        <Route path="justicegap/essay" element={<JusticeGapEssay />} />
        <Route path="justicegap/stories" element={<JusticeGapStories />} />
        <Route path="justicegap/news" element={<JusticeGapNews />} />
        <Route path="justicegap/solution" element={<JusticeGapSolution />} />

        {/* Patrocinium — fourth front door. Advocate-facing: where lawyers
            see pre-vetted pro bono matters and accept what fits their week. */}
        <Route path="patrocinium" element={<PatrociniumLanding />} />
        <Route path="patrocinium/cases" element={<CaseBrowser />} />
        <Route path="patrocinium/cases/:id" element={<CaseDetail />} />
        <Route
          path="patrocinium/cases/:id/template/:slug"
          element={<TemplatePage />}
        />
        <Route path="patrocinium/me" element={<MyProBono />} />

        {/* Demo app */}
        <Route path="app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="chapters" element={<ChaptersList />} />
          <Route path="chapters/:slug" element={<ChapterDetail />} />
          <Route path="mentorship" element={<Mentorship />} />
          <Route path="service" element={<Service />} />
          <Route path="service/inbox" element={<NetworkInbox />} />
          <Route path="communio" element={<CommunioDirectory />} />
          <Route path="communio/:slug" element={<CommunioPeer />} />
          <Route path="formation" element={<Formation />} />
          <Route path="advancement" element={<Advancement />} />
          <Route path="pulse" element={<NRIPulse />} />
          <Route path="insights" element={<JusticeGapInsights />} />
          <Route path="practice" element={<PracticeHub />} />
          <Route path="hours" element={<HoursDashboard />} />
          <Route path="revenue" element={<TenantRevenue />} />
          <Route path="intake-assist" element={<IntakeAssist />} />
          <Route path="office" element={<DailyOffice />} />
          <Route path="calendar" element={<CalendarPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
