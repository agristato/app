"use client";

import { DuplicateEmailModal } from "@/components/DuplicateEmailModal";
import { SuccessModal } from "@/components/SuccessModal";
import { SurveyModal } from "@/components/SurveyModal";
import { ThankYouModal } from "@/components/ThankYouModal";
import { api } from "@/lib/api";
import { EmailFormData, emailSchema, SurveyFormData } from "@/lib/validations";
import { User } from "@/types/survey";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, UseFormRegister } from "react-hook-form";
import posthog from "posthog-js";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function IconEmail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  );
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ─── Soil Core — hero signature element ────────────────────────────────────
// A vertical horizon profile, the way an auger sample actually reads: dark
// humus on top, oxidized clay and pale saprolite below. Each band carries a
// real measurement, in the same units a laudo would print.

const HORIZON_BANDS = [
  { code: "A", label: "Amostra bruta", reading: "pH 4,8 · Al³⁺ 0,9", bg: "#1a130d", fg: "#f1e6d4" },
  { code: "B1", label: "Diagnóstico", reading: "V1 42% · CTC 8,4", bg: "#5a3420", fg: "#f1e6d4" },
  { code: "B2", label: "Prescrição", reading: "V2 65% · PRNT 90%", bg: "#93602b", fg: "#241a10" },
  { code: "C", label: "Dose calculada", reading: "3,62 t/ha calcítico", bg: "#c1663f", fg: "#241a10" },
  { code: "R", label: "Plano de safra", reading: "Ca/Mg ideal · 3 safras", bg: "#dba54c", fg: "#241a10" },
] as const;

function SoilCore() {
  return (
    <div className="w-full max-w-md border border-white/15 rounded-lg overflow-hidden shadow-xl shadow-black/30">
      {HORIZON_BANDS.map((band, i) => (
        <div
          key={band.code}
          data-reveal="left"
          data-delay={String(i + 1)}
          className="grid grid-cols-[44px_1fr_auto] items-center gap-3 px-4 py-3.5 sm:py-4"
          style={{ backgroundColor: band.bg, color: band.fg }}
        >
          <span className="font-data text-xs opacity-70">{band.code}</span>
          <span className="font-display text-sm sm:text-base">{band.label}</span>
          <span className="font-data text-[11px] sm:text-xs opacity-85 text-right whitespace-nowrap">
            {band.reading}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Soil Analysis Interactive Mock ───────────────────────────────────────────

const SOIL_FIELDS = [
  { id: "A-01", ph: 5.2, ctc: 6.4, v1: 48, ca: 28, mg: 12 },
  { id: "A-02", ph: 4.8, ctc: 8.1, v1: 35, ca: 18, mg: 8 },
  { id: "B-01", ph: 6.1, ctc: 5.8, v1: 72, ca: 52, mg: 22 },
] as const;

function SoilAnalysisMock() {
  const [activeTab, setActiveTab] = useState(0);
  const [v2, setV2] = useState(65);
  const field = SOIL_FIELDS[activeTab];
  const dose = Math.max(0, ((v2 - field.v1) * field.ctc) / 0.9 / 100);

  return (
    <div className="bg-sand rounded-lg border border-parchment-75 p-5 space-y-3 w-full">
      {/* Talhão tabs */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-parchment-100 text-[10px] font-sans uppercase tracking-wider">
          Talhão
        </span>
        <div className="flex gap-1.5" role="tablist" aria-label="Selecionar talhão">
          {SOIL_FIELDS.map((f, i) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={i === activeTab}
              onClick={() => setActiveTab(i)}
              className={`px-3 py-1 rounded-md text-xs font-semibold font-sans border transition-all ${
                i === activeTab
                  ? "bg-humus text-white border-humus shadow-sm"
                  : "bg-white text-parchment-100 border-parchment-75 hover:border-parchment-100"
              }`}
            >
              {f.id}
            </button>
          ))}
        </div>
      </div>

      {/* Soil metrics row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "pH", value: String(field.ph) },
          { label: "CTC", value: `${field.ctc}` },
          { label: "V1%", value: `${field.v1}%` },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-md p-3 border border-parchment-75 text-center">
            <div className="text-parchment-100 text-[10px] font-sans uppercase tracking-wider mb-1">
              {item.label}
            </div>
            <div className="text-humus font-bold font-data text-xl">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Ca / Mg */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Ca inicial", value: field.ca },
          { label: "Mg inicial", value: field.mg },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-md p-3 border border-parchment-75">
            <div className="text-parchment-100 text-[10px] font-sans uppercase tracking-wider mb-1">
              {item.label}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-humus font-bold font-data text-xl">{item.value}</span>
              <span className="text-parchment-100 text-[10px] font-sans">mmolc/dm³</span>
            </div>
          </div>
        ))}
      </div>

      {/* V2% selector */}
      <div className="bg-white rounded-md p-3 border border-parchment-75">
        <div className="text-parchment-100 text-[10px] font-sans uppercase tracking-wider mb-2">
          V2% desejado
        </div>
        <div className="flex gap-1.5">
          {[60, 65, 70, 75].map((v) => (
            <button
              key={v}
              onClick={() => setV2(v)}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold font-data border transition-all ${
                v2 === v
                  ? "bg-humus text-white border-humus"
                  : "bg-parchment text-parchment-100 border-parchment-75 hover:border-parchment-100"
              }`}
            >
              {v}%
            </button>
          ))}
        </div>
      </div>

      {/* Dose result */}
      <div
        className={`rounded-md p-4 border transition-all ${dose > 0 ? "bg-clay/10 border-clay/30" : "bg-parchment-75/30 border-parchment-75"}`}
      >
        <div className="text-rust text-[10px] font-sans uppercase tracking-wider mb-1">
          {dose > 0 ? "Dose recomendada de calcário" : "Sem necessidade de calagem"}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-humus font-bold font-data text-3xl">{dose.toFixed(2)}</span>
          <span className="text-rust text-sm font-sans font-semibold">t/ha</span>
        </div>
        {dose > 0 && (
          <div className="mt-2 h-1.5 bg-white/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-clay rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (dose / 6) * 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard Interactive Mock ────────────────────────────────────────────────

const DASHBOARD_FIELDS = [
  { id: "A-01", ca: 45.2, mg: 18.4, crop: "Soja", dose: 2.4, caS: "ideal", mgS: "ideal" },
  { id: "A-02", ca: 18.1, mg: 3.8, crop: "Milho", dose: 4.8, caS: "restritivo", mgS: "restritivo" },
  { id: "B-01", ca: 62.3, mg: 24.1, crop: "Soja", dose: 0, caS: "ideal", mgS: "ideal" },
  { id: "B-02", ca: 22.4, mg: 5.2, crop: "Trigo", dose: 3.1, caS: "aceitável", mgS: "aceitável" },
] as const;

const STATUS_STYLE = {
  ideal: { pill: "bg-sprout/20 border-sprout/30 text-sprout", bar: "#8fae7c" },
  "aceitável": { pill: "bg-ochre/20 border-ochre/30 text-ochre", bar: "#dba54c" },
  restritivo: { pill: "bg-alert/20 border-alert/30 text-[#e08a7d]", bar: "#a3372a" },
} as const;

function DashboardMock() {
  const [selected, setSelected] = useState(0);
  const field = DASHBOARD_FIELDS[selected];

  return (
    <div className="space-y-3 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-parchment/60 text-xs font-sans uppercase tracking-wider">
          Dashboard · Talhões
        </span>
        <span className="text-ochre/70 text-xs font-sans">Após calagem · Safra 2026</span>
      </div>

      {/* Field cards */}
      <div className="grid grid-cols-4 gap-2" role="tablist" aria-label="Selecionar talhão do dashboard">
        {DASHBOARD_FIELDS.map((f, i) => {
          const s = STATUS_STYLE[f.caS];
          const active = i === selected;
          return (
            <button
              key={f.id}
              role="tab"
              aria-selected={active}
              onClick={() => setSelected(i)}
              className={`rounded-md p-3 border text-left transition-all ${
                active
                  ? "bg-white/15 border-white/30 shadow-md"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <div className={`text-xs font-bold font-data mb-2 ${active ? "text-white" : "text-parchment/60"}`}>
                {f.id}
              </div>
              <span className={`text-[9px] font-bold font-sans px-1.5 py-0.5 rounded-full border ${s.pill}`}>
                {f.caS}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      <div className="bg-white/8 rounded-md border border-white/12 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-white font-bold font-display text-lg">
            {field.id} — {field.crop}
          </span>
          {field.dose > 0 && (
            <span className="text-ochre text-xs font-data bg-ochre/15 border border-ochre/25 px-2.5 py-1 rounded-full font-semibold">
              {field.dose} t/ha calcário
            </span>
          )}
        </div>

        {/* Ca / Mg cards */}
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { label: "Ca após calagem", value: field.ca, max: 80, status: field.caS },
              { label: "Mg após calagem", value: field.mg, max: 40, status: field.mgS },
            ] as const
          ).map((item) => {
            const s = STATUS_STYLE[item.status];
            return (
              <div key={item.label} className={`rounded-md p-3 border ${s.pill}`}>
                <div className="text-[10px] font-sans uppercase tracking-wider mb-1 opacity-80">
                  {item.label}
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-white font-bold font-data text-2xl">{item.value.toFixed(1)}</span>
                  <span className="text-white/50 text-[10px] font-sans">mmolc</span>
                </div>
                <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (item.value / item.max) * 100)}%`, backgroundColor: s.bar }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Threshold legend */}
        <div className="flex gap-4 pt-1">
          {(["ideal", "aceitável", "restritivo"] as const).map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_STYLE[s].bar }} />
              <span className="text-parchment/40 text-[10px] font-sans capitalize">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Plot-boundary divider ─────────────────────────────────────────────────
// Replaces the generic wave-SVG divider with the same vocabulary as a
// talhão boundary line — the polygon data the product already stores for
// every field — rather than a decorative blob.

function PlotDivider({ className }: { className?: string }) {
  return (
    <div className={`plot-divider ${className ?? ""}`} aria-hidden>
      <svg viewBox="0 0 1440 28" preserveAspectRatio="none">
        <path d="M0,14 L120,9 L260,17 L410,6 L560,15 L720,10 L900,18 L1060,7 L1220,14 L1440,10" />
      </svg>
    </div>
  );
}

// ─── Numbered step (used within each module block) ─────────────────────────

function StepRow({ steps }: { steps: { n: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 font-data text-xs sm:text-sm">
      {steps.map((s, i) => (
        <span key={s.n} className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5">
            <span className="opacity-60">{s.n}</span>
            <span>{s.label}</span>
          </span>
          {i < steps.length - 1 && <span className="opacity-40">→</span>}
        </span>
      ))}
    </div>
  );
}

// ─── Email Form (reusable) ─────────────────────────────────────────────────────

function EmailForm({
  onSubmit,
  isLoading,
  errors,
  register,
  variant = "dark",
}: {
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  errors: { email?: { message?: string } };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  variant?: "dark" | "light";
}) {
  const isDark = variant === "dark";
  return (
    <form onSubmit={onSubmit} className="space-y-3 w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div
          className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-md border ${
            isDark ? "bg-white/10 border-white/20 text-white" : "bg-white border-parchment-75 text-ink"
          }`}
        >
          <IconEmail className={`w-4 h-4 flex-shrink-0 ${isDark ? "text-parchment/60" : "text-parchment-100"}`} />
          <input
            {...register("email")}
            type="email"
            placeholder="Seu melhor email"
            className={`flex-1 bg-transparent border-none outline-none text-sm font-sans min-w-0 placeholder:opacity-60 ${
              isDark ? "text-white placeholder:text-parchment" : "text-ink placeholder:text-parchment-100"
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-3 font-semibold font-sans rounded-md text-sm whitespace-nowrap disabled:opacity-60 transition-all duration-200 ${
            isDark ? "bg-clay text-white hover:bg-rust" : "bg-rust text-white hover:bg-clay"
          }`}
        >
          {isLoading ? "Enviando..." : "Entrar na lista de espera"}
        </button>
      </div>
      {errors.email && (
        <p className={`text-sm text-center ${isDark ? "text-[#e08a7d]" : "text-alert"}`}>
          {errors.email.message}
        </p>
      )}
      <p className={`text-xs text-center ${isDark ? "text-parchment/50" : "text-parchment-100"}`}>
        Ao continuar você concorda com a nossa{" "}
        <Link
          href="/privacy-policy"
          className={`underline ${isDark ? "text-parchment/70 hover:text-parchment" : "text-rust hover:text-humus"}`}
        >
          Política de Privacidade
        </Link>
      </p>
    </form>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [showDuplicateEmailModal, setShowDuplicateEmailModal] = useState(false);
  const [duplicateEmail, setDuplicateEmail] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userCount, setUserCount] = useState(0);
  const [isLoadingCount, setIsLoadingCount] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const ctaRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Scroll-reveal via IntersectionObserver
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Parallax on hero
  const onScroll = useCallback(() => {
    if (heroRef.current) {
      heroRef.current.style.setProperty("--parallax-y", `${window.scrollY * 0.35}px`);
    }
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const updateUserCount = async () => {
    try {
      setIsLoadingCount(true);
      const count = await api.getUserCount();
      setUserCount(count + 189);
    } catch {
      setUserCount(189);
    } finally {
      setIsLoadingCount(false);
    }
  };

  useEffect(() => {
    updateUserCount();
  }, []);

  // Separate form instances prevent errors bleeding between Hero and CTA forms
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormData>({ resolver: zodResolver(emailSchema) });

  const {
    register: registerCta,
    handleSubmit: handleSubmitCta,
    formState: { errors: errorsCta },
    reset: resetCta,
  } = useForm<EmailFormData>({ resolver: zodResolver(emailSchema) });

  const resetAll = () => {
    reset();
    resetCta();
  };

  const onEmailSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      const user = await api.createUser(data.email);
      if (user) {
        setCurrentUser(user);
        posthog.capture("email_captured", { source: "hero" });
        posthog.alias(user.id);
        posthog.identify(user.id, { email: data.email });
        setShowSuccessModal(true);
        resetAll();
      }
    } catch (error) {
      if (error instanceof Error && error.message === "Email já cadastrado") {
        setDuplicateEmail(data.email);
        setShowDuplicateEmailModal(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setCurrentUser(null);
    resetAll();
    updateUserCount();
  };

  const handleCloseSurveyModal = () => {
    setShowSurveyModal(false);
    setCurrentUser(null);
    resetAll();
    updateUserCount();
  };

  const handleCloseThankYouModal = () => {
    setShowThankYouModal(false);
    setCurrentUser(null);
    resetAll();
    updateUserCount();
  };

  const handleSurveyComplete = async (surveyData: SurveyFormData) => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const updatedUser = await api.updateUserResults(currentUser.id, {
        ...surveyData,
        completedAt: new Date().toISOString(),
      });
      if (updatedUser) {
        posthog.capture("survey_completed", {
          user_profile: surveyData.userProfile,
          farm_size: surveyData.farmSize,
          main_crops: surveyData.mainCrops,
          current_software: surveyData.currentSoftware,
          pilot_interest: surveyData.pilotInterest,
        });
        setShowSurveyModal(false);
        setShowThankYouModal(true);
      }
    } catch (error) {
      console.error("Error updating survey results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToCta = () => {
    ctaRef.current?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-parchment text-ink overflow-x-hidden">
      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-parchment/90 nav-blur border-b border-parchment-75">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="Agristato" width={32} height={32} className="w-8 h-8" />
            <span className="font-display font-semibold text-xl text-rust tracking-tight">
              Agristato
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/60">
            <a href="#metodologia" className="hover:text-ink transition-colors">Metodologia</a>
            <a href="#resultados" className="hover:text-ink transition-colors">Resultados</a>
            <a href="#validacao" className="hover:text-ink transition-colors">Validação</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={scrollToCta}
              className="px-5 py-2 bg-rust text-white text-sm font-semibold rounded-md hover:bg-clay transition-colors"
            >
              Entrar na lista
            </button>
          </div>

          <button
            className="md:hidden p-2 text-ink"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-parchment border-t border-parchment-75 px-6 py-4 space-y-3">
            <a href="#metodologia" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-ink/70 hover:text-ink">
              Metodologia
            </a>
            <a href="#resultados" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-ink/70 hover:text-ink">
              Resultados
            </a>
            <a href="#validacao" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-ink/70 hover:text-ink">
              Validação
            </a>
            <button
              onClick={scrollToCta}
              className="w-full mt-2 py-3 bg-rust text-white text-sm font-semibold rounded-md hover:bg-clay transition-colors"
            >
              Entrar na lista
            </button>
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 00 — CAPA (hero)                                                    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative bg-humus overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none parallax-hero-bg" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-humus to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — text */}
            <div className="space-y-8">
              <div data-reveal className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="font-data text-[11px] text-ochre uppercase tracking-wider">
                  Laudo técnico 001 · Pré-lançamento
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-clay/15 border border-clay/25 rounded-full">
                  <div className="w-1 h-1 bg-clay rounded-full" />
                  <span className="font-data text-clay text-xs tracking-wider">31 Julho, 2026</span>
                </span>
              </div>

              <div data-reveal data-delay="1" className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-display font-medium text-white leading-[1.08] tracking-tight">
                  Da amostra ao talhão, <span className="italic text-ochre">em uma dose só.</span>
                </h1>
                <p className="text-lg text-parchment/70 leading-relaxed font-sans max-w-lg">
                  Calagem, gessagem e adubação calculadas com as fórmulas do{" "}
                  <span className="text-parchment font-semibold">Boletim IAC 100</span> e da{" "}
                  <span className="text-parchment font-semibold">EMBRAPA Cerrados</span>, para até{" "}
                  <span className="font-data text-ochre">20 mil</span> talhões de uma vez.
                </p>
              </div>

              <EmailForm onSubmit={handleSubmit(onEmailSubmit)} isLoading={isLoading} errors={errors} register={register} variant="dark" />

              <div className="flex items-center gap-4 pt-2">
                {isLoadingCount ? (
                  <div className="w-20 h-5 bg-white/10 rounded animate-pulse" />
                ) : (
                  <p className="text-white font-sans">
                    <span className="font-bold text-ochre font-data text-2xl">{userCount}</span>{" "}
                    <span className="text-lg">fazendas já na lista</span>
                  </p>
                )}
              </div>
            </div>

            {/* Right — soil core */}
            <div className="hidden lg:flex justify-end">
              <SoilCore />
            </div>
          </div>

          {/* Mobile soil core */}
          <div className="lg:hidden mt-12">
            <SoilCore />
          </div>
        </div>
      </section>

      <PlotDivider className="bg-humus text-parchment-75" />

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 01 — DIAGNÓSTICO                                                    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section id="diagnostico" className="py-24 px-6 bg-parchment">
        <div className="max-w-7xl mx-auto space-y-14">
          <div data-reveal className="max-w-3xl space-y-4">
            <span className="font-data text-xs text-rust uppercase tracking-wider">01 · Diagnóstico</span>
            <h2 className="text-3xl lg:text-5xl font-display font-medium text-ink leading-tight">
              O problema não é falta de dado. <span className="italic text-rust">É excesso de planilha.</span>
            </h2>
            <p className="text-ink/60 text-lg font-sans leading-relaxed">
              Agrônomos e produtores perdem horas por safra copiando laudos, recalculando doses talhão a
              talhão e montando planos em planilhas paralelas — uma para cada laboratório, uma para cada
              cliente.
            </p>
          </div>

          {/* Before / After */}
          <div className="grid gap-3">
            {[
              { before: "Copia e cola laudo do laboratório na planilha", after: "Upload do arquivo — dados prontos em segundos" },
              { before: "Calcula dose de calcário manualmente, talhão a talhão", after: "O sistema aplica a fórmula V% para até 20 mil talhões por vez" },
              { before: "Sem visibilidade do Ca e Mg após a colheita", after: "Dashboard projeta o saldo de nutrientes por safra" },
              { before: "Consulta preço do CEASA em planilhas separadas", after: "Radar de Cotação cruza preço, tendência e janela de plantio" },
            ].map((row, i) => (
              <div key={row.before} data-reveal data-delay={String((i % 4) + 1)} className="grid md:grid-cols-2 gap-3">
                <div className="bg-alert/5 border border-alert/20 rounded-md p-4">
                  <div className="font-data text-alert text-[10px] mb-1.5 uppercase tracking-wider">Antes</div>
                  <p className="text-ink/70 text-sm leading-relaxed font-sans">{row.before}</p>
                </div>
                <div className="bg-moss/8 border border-moss/25 rounded-md p-4">
                  <div className="font-data text-moss text-[10px] mb-1.5 uppercase tracking-wider">Com Agristato</div>
                  <p className="text-ink text-sm leading-relaxed font-sans">{row.after}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Verifiable facts, not marketing stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-6 border-t border-parchment-75">
            {[
              { value: "20.000", label: "Amostras por lote" },
              { value: "268", label: "Testes automatizados" },
              { value: "27", label: "Culturas cadastradas" },
              { value: "18", label: "Meses de planejamento" },
            ].map((stat, i) => (
              <div key={stat.label} data-reveal data-delay={String(i + 1)} className="space-y-1">
                <div className="text-3xl lg:text-4xl font-data font-semibold text-rust">{stat.value}</div>
                <div className="text-ink/50 text-sm font-sans">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 02 — METODOLOGIA                                                    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-parchment">
        <div className="max-w-7xl mx-auto space-y-16">
          <div data-reveal className="max-w-3xl space-y-4">
            <span className="font-data text-xs text-rust uppercase tracking-wider">02 · Metodologia</span>
            <h2 className="text-3xl lg:text-5xl font-display font-medium text-ink leading-tight">
              Duas ferramentas, <span className="italic text-rust">o vocabulário que você já usa.</span>
            </h2>
            <p className="text-ink/60 text-lg font-sans leading-relaxed">
              Nada de jargão de startup. Cada número na tela é um termo que você já vê no laudo do
              laboratório ou no boletim da CEASA.
            </p>
          </div>

          {/* ── Módulo 01 — Análise de Solo ─────────────────────────────── */}
          <div id="analise-solo" className="space-y-8">
            <div data-reveal className="flex items-center gap-3">
              <span className="font-data text-[11px] text-parchment-100 uppercase tracking-wider">Módulo 01</span>
              <div className="flex-1 h-px bg-parchment-75" />
            </div>

            <div data-reveal className="grid lg:grid-cols-2 gap-10 items-start">
              <div className="space-y-5">
                <h3 className="text-2xl font-display font-medium text-ink">
                  Calagem, gessagem e adubação — com fonte citada
                </h3>
                <p className="text-ink/60 text-sm leading-relaxed font-sans">
                  V1% e V2%, CTC, PRNT, NC por saturação, alumínio ou o máximo entre os dois — pela
                  metodologia IAC ou Cerrados. Tipo de calcário recomendado (calcítico ou dolomítico),
                  gessagem por textura de solo (Sousa &amp; Lobato, EMBRAPA Cerrados 2004) e adubação de
                  P e K (ERP/CFSEMG) para 27 culturas cadastradas.
                </p>
                <StepRow
                  steps={[
                    { n: "01", label: "Importe o CSV/XLSX" },
                    { n: "02", label: "Defina a timeline de 18 meses" },
                    { n: "03", label: "Receba dose, custo e trilha auditável" },
                  ]}
                />
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    { label: "Calagem", available: true },
                    { label: "Macronutrientes P e K", available: true },
                    { label: "Gessagem", available: true },
                    { label: "Rateio por safra", available: true },
                    { label: "Mapa de fertilidade", available: false },
                    { label: "Micronutrientes", available: false },
                  ].map((pill) => (
                    <span
                      key={pill.label}
                      className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${
                        pill.available
                          ? "bg-moss/10 border-moss/30 text-moss"
                          : "bg-parchment-75/40 border-parchment-75 text-parchment-100"
                      }`}
                    >
                      {pill.label} · {pill.available ? "disponível" : "em breve"}
                    </span>
                  ))}
                </div>
              </div>
              <SoilAnalysisMock />
            </div>
          </div>

          {/* ── Módulo 02 — Radar de Cotação ─────────────────────────────── */}
          <div id="radar" data-reveal className="bg-humus rounded-lg border border-white/10 p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3">
                <span className="font-data text-[11px] text-parchment/50 uppercase tracking-wider">Módulo 02</span>
                <span className="px-2 py-0.5 bg-clay/20 border border-clay/30 text-ochre text-[10px] font-bold rounded-full uppercase tracking-wide font-sans">
                  Novo
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <div className="grid lg:grid-cols-2 gap-10 items-start">
                <div className="space-y-5">
                  <h3 className="text-2xl font-display font-medium text-white">
                    Preço, tendência e janela de plantio — cruzados automaticamente
                  </h3>
                  <p className="text-parchment/60 text-sm leading-relaxed font-sans">
                    Preços diários da CEASA desde 2015 (46 unidades, 48 produtos) e volumes mensais do
                    SIMAB desde 2021 (30 unidades, 530 produtos). O ranking de oportunidades cruza
                    produto, mercado e data de plantio — e mostra o motivo de cada posição.
                  </p>
                  <StepRow
                    steps={[
                      { n: "01", label: "Selecione produto e região" },
                      { n: "02", label: "Veja o ranking de oportunidades" },
                      { n: "03", label: "Compare e decida" },
                    ]}
                  />
                  <div className="flex flex-wrap gap-2 pt-2">
                    {["Cotações CEASA", "Projeção de preços", "Ranking de oportunidades", "Comparação justificada"].map(
                      (label) => (
                        <span
                          key={label}
                          className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide bg-ochre/15 border-ochre/30 text-ochre"
                        >
                          {label} · disponível
                        </span>
                      ),
                    )}
                  </div>
                </div>

                {/* Price mock */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-clay/10 border border-clay/25 rounded-md p-5 flex items-start gap-4">
                    <div className="w-8 h-8 rounded bg-clay/25 flex items-center justify-center flex-shrink-0 font-data text-ochre text-sm">
                      #1
                    </div>
                    <div>
                      <div className="text-ochre text-xs font-bold uppercase tracking-wider font-sans mb-1">
                        Tomate · CEAGESP
                      </div>
                      <div className="text-white font-bold font-data text-lg">R$ 4,80/kg · alta</div>
                      <div className="text-parchment/60 text-sm font-sans mt-1">
                        Maior preço esperado e tendência de alta clara, mesmo com risco médio.
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-md p-4 border border-white/10">
                      <div className="text-parchment/50 text-xs font-sans mb-1">Batata · CEASA MG</div>
                      <div className="text-white font-bold font-data text-xl">R$ 2,90/kg</div>
                      <div className="text-sprout text-xs font-data mt-1 font-semibold">+3,2% vs. média</div>
                    </div>
                    <div className="bg-white/5 rounded-md p-4 border border-white/10">
                      <div className="text-parchment/50 text-xs font-sans mb-1">Tomate · CEAGESP</div>
                      <div className="text-white font-bold font-data text-xl">R$ 4,80/kg</div>
                      <div className="text-[#e08a7d] text-xs font-data mt-1 font-semibold">−1,1% vs. média</div>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-md p-4 border border-white/10">
                    <div className="text-parchment/50 text-xs font-sans mb-2 uppercase tracking-wider">
                      Comparação
                    </div>
                    <div className="text-parchment/80 text-sm font-sans leading-relaxed">
                      Tomate em CEAGESP à frente: maior preço esperado e tendência de alta clara. Para
                      menor risco, Batata em CEASA MG é a opção mais estável do trio.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PlotDivider className="bg-parchment text-humus" />

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 03 — LEITURA DE RESULTADOS                                          */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section id="resultados" className="py-24 px-6 bg-humus relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto space-y-14">
          <div data-reveal className="max-w-3xl space-y-4">
            <span className="font-data text-xs text-ochre uppercase tracking-wider">03 · Leitura de resultados</span>
            <h2 className="text-3xl lg:text-5xl font-display font-medium text-white leading-tight">
              Dashboard completo, <span className="italic text-ochre">por talhão.</span>
            </h2>
            <p className="text-parchment/60 text-lg leading-relaxed font-sans">
              Tabela por talhão com V1%, CTC, as três leituras de NC e a dose recomendada. Saldo de Ca e
              Mg projetado safra a safra, ranking de custo por ponto de nutriente e a trilha auditável de
              cada termo da fórmula.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-3">
                {[
                  "Saldo de Ca e Mg projetado por safra, cultura a cultura",
                  "Tabela por talhão: V1%, CTC, NC (3 métodos) e dose",
                  "Ranking de custo por ponto de nutriente entre 8 fertilizantes",
                  "Trilha auditável de cada termo calculado",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-ochre/20 flex items-center justify-center flex-shrink-0">
                      <IconCheck className="w-3 h-3 text-ochre" />
                    </div>
                    <span className="text-parchment/80 text-sm font-sans">{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={scrollToCta}
                className="inline-flex px-6 py-3.5 bg-clay text-white text-sm font-semibold rounded-md hover:bg-ochre hover:text-humus transition-colors font-sans"
              >
                Garantir acesso antecipado →
              </button>
            </div>

            <div className="space-y-4">
              <DashboardMock />
              <div className="relative rounded-md overflow-hidden border border-white/10">
                <Image
                  src="/app-example.png"
                  alt="Tela do dashboard do Agristato mostrando talhões, doses e status de Ca/Mg"
                  width={600}
                  height={375}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <PlotDivider className="bg-humus text-parchment-75" />

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 04 — VALIDAÇÃO                                                      */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section id="validacao" className="py-24 px-6 bg-parchment">
        <div className="max-w-7xl mx-auto space-y-14">
          <div data-reveal className="max-w-3xl space-y-4">
            <span className="font-data text-xs text-rust uppercase tracking-wider">04 · Validação</span>
            <h2 className="text-3xl lg:text-5xl font-display font-medium text-ink leading-tight">
              Por que confiar <span className="italic text-rust">no número que a tela mostra.</span>
            </h2>
            <p className="text-ink/60 text-lg font-sans leading-relaxed">
              Nenhuma constante é arbitrária. Cada cálculo aponta para uma fonte — e o sistema é testado
              como qualquer software de produção precisa ser.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-parchment-75 border border-parchment-75 rounded-lg overflow-hidden">
            {[
              { value: "268", label: "Testes automatizados", sub: "domínio, aplicação e API" },
              { value: "IAC 100", label: "Metodologia de calagem", sub: "Boletim IAC 100 e EMBRAPA Cerrados" },
              { value: "4", label: "Algoritmos de previsão", sub: "validados contra numpy/statsmodels" },
              { value: "2015", label: "Dados CEASA desde", sub: "46 unidades, 48 produtos" },
              { value: "20.000", label: "Amostras por lote", sub: "em uma única chamada" },
            ].map((item, i) => (
              <div key={item.label} data-reveal data-delay={String((i % 5) + 1)} className="bg-sand p-6 space-y-2">
                <div className="text-2xl font-data font-semibold text-rust">{item.value}</div>
                <div className="text-ink text-sm font-sans font-semibold">{item.label}</div>
                <div className="text-ink/45 text-xs font-sans leading-snug">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 05 — PRESCRIÇÃO                                                     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section ref={ctaRef} id="lista-espera" className="py-24 px-6 bg-loam relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
          <span className="font-data text-xs text-ochre uppercase tracking-wider">05 · Prescrição</span>
          <h2 data-reveal data-delay="1" className="text-3xl lg:text-5xl font-display font-medium text-white leading-tight">
            Reserve sua vaga para a <span className="italic text-ochre">primeira prescrição.</span>
          </h2>
          <p data-reveal data-delay="2" className="text-parchment/70 text-lg font-sans leading-relaxed">
            Seja um dos primeiros a usar o Agristato. Quem entra na lista de espera recebe acesso
            prioritário e condições especiais de lançamento.
          </p>

          <div className="max-w-xl mx-auto">
            <EmailForm onSubmit={handleSubmitCta(onEmailSubmit)} isLoading={isLoading} errors={errorsCta} register={registerCta} variant="dark" />
          </div>

          <div className="flex items-center justify-center gap-3">
            {isLoadingCount ? (
              <div className="w-32 h-4 bg-white/10 rounded animate-pulse" />
            ) : (
              <p className="text-parchment/60 text-sm font-sans">
                <span className="font-bold text-ochre text-lg font-data">{userCount}</span>{" "}
                fazendas já garantiram seu lugar
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-loam border-t border-white/10 py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <Image src="/logo-white.svg" alt="Agristato" width={32} height={32} className="w-8 h-8" />
                <span className="font-display font-semibold text-lg text-white tracking-tight">Agristato</span>
              </div>
              <p className="text-parchment/50 text-sm leading-relaxed font-sans max-w-xs">
                Análise de solo e inteligência de mercado para agricultura de precisão — com fórmulas
                citadas, não caixas-pretas.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-clay/10 border border-clay/25 rounded-full">
                <div className="w-1.5 h-1.5 bg-clay rounded-full" />
                <span className="font-data text-ochre text-xs">Lançamento 31 Julho, 2026</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white text-sm font-semibold font-sans">Plataforma</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Análise de Solo", href: "#analise-solo" },
                  { label: "Radar de Cotação", href: "#radar" },
                  { label: "Validação", href: "#validacao" },
                  { label: "Lista de espera", href: "#lista-espera" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-parchment/50 text-sm hover:text-parchment/80 transition-colors font-sans">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-white text-sm font-semibold font-sans">Legal</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/privacy-policy" className="text-parchment/50 text-sm hover:text-parchment/80 transition-colors font-sans">
                    Política de Privacidade
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-parchment/40 text-sm font-sans">© 2026 Agristato. Todos os direitos reservados.</p>
            <p className="text-parchment/30 text-xs font-sans">Feito com precisão para o agronegócio brasileiro</p>
          </div>
        </div>
      </footer>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        onContinue={() => {
          setShowSuccessModal(false);
          posthog.capture("survey_opened");
          setShowSurveyModal(true);
        }}
        userCount={userCount}
      />
      <SurveyModal isOpen={showSurveyModal} onClose={handleCloseSurveyModal} onComplete={handleSurveyComplete} />
      <ThankYouModal isOpen={showThankYouModal} onClose={handleCloseThankYouModal} />
      <DuplicateEmailModal isOpen={showDuplicateEmailModal} onClose={() => setShowDuplicateEmailModal(false)} email={duplicateEmail} />
    </div>
  );
}
