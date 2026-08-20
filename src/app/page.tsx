"use client";

import { DuplicateEmailModal } from "@/components/DuplicateEmailModal";
import { SuccessModal } from "@/components/SuccessModal";
import { SurveyModal } from "@/components/SurveyModal";
import { ThankYouModal } from "@/components/ThankYouModal";
import { api } from "@/lib/api";
import { EmailFormData, emailSchema, SurveyFormData } from "@/lib/validations";
import { User } from "@/types/survey";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Mail, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm, UseFormRegister } from "react-hook-form";
import posthog from "posthog-js";

// ─── Talhão Mosaic — hero signature element ────────────────────────────────
// The logo is three diagonal green rows. This extends that exact geometry
// into a full aerial mosaic of plots, at the same skew — the same shape
// the product's own field map draws, just abstracted into a hero visual.

const MOSAIC_TILES = [
  { c: "#39833c" }, { c: "#2c6b2e" }, { c: "#39833c" }, { c: "#f2c14e", badge: "V% 68" },
  { c: "#5fa662" }, { c: "#39833c" }, { c: "#2c6b2e" }, { c: "#39833c" },
  { c: "#6b4633" }, { c: "#39833c" }, { c: "#2c6b2e" }, { c: "#5fa662" },
  { c: "#39833c" }, { c: "#f2994a" }, { c: "#39833c" }, { c: "#2c6b2e" },
  { c: "#f2c14e", badge: "3,1 t/ha" }, { c: "#39833c" }, { c: "#5fa662" }, { c: "#39833c" },
  { c: "#2c6b2e" }, { c: "#e6eee9" }, { c: "#39833c" }, { c: "#2c6b2e" },
] as const;

function TalhaoMosaic() {
  return (
    <div className="w-full max-w-md">
      <div className="-skew-x-6 grid grid-cols-6 gap-1.5 border border-white/10 rounded-2xl p-3 bg-forest-night/60 shadow-2xl shadow-black/40">
        {MOSAIC_TILES.map((tile, i) => (
          <div
            key={i}
            data-reveal="scale"
            data-delay={String((i % 6) + 1)}
            className="relative aspect-square rounded-sm flex items-center justify-center"
            style={{ backgroundColor: tile.c }}
          >
            {"badge" in tile && (
              <span className="skew-x-6 font-data text-[8px] sm:text-[9px] font-bold text-ink leading-none text-center px-0.5">
                {tile.badge}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Furrow divider — a diagonal wedge between sections, the logo's own ────
// angle, alternating direction down the page, with a gold seam at the cut.

function FurrowDivider({ from, to, flip = false }: { from: string; to: string; flip?: boolean }) {
  const fromTri = flip ? "0,0 1440,0 1440,96" : "0,0 1440,0 0,96";
  const toTri = flip ? "0,0 1440,96 0,96" : "1440,0 1440,96 0,96";
  const seam = flip ? "M0,0 L1440,96" : "M1440,0 L0,96";
  return (
    <div className="furrow-divider" aria-hidden>
      <svg viewBox="0 0 1440 96" preserveAspectRatio="none">
        <polygon points={fromTri} fill={from} />
        <polygon points={toTri} fill={to} />
        <path d={seam} stroke="#f2c14e" strokeWidth="2" opacity="0.7" />
      </svg>
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
    <div className="bg-white rounded-2xl border border-parchment-300 p-5 space-y-3 w-full shadow-xl shadow-forest/5">
      {/* Talhão tabs */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-ink/40 text-[10px] font-sans uppercase tracking-wider">
          Talhão
        </span>
        <div className="flex gap-1.5" role="tablist" aria-label="Selecionar talhão">
          {SOIL_FIELDS.map((f, i) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={i === activeTab}
              onClick={() => setActiveTab(i)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold font-sans border transition-all ${
                i === activeTab
                  ? "bg-forest text-white border-forest shadow-sm"
                  : "bg-white text-ink/40 border-parchment-300 hover:border-forest/40"
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
          <div key={item.label} className="bg-parchment-200 rounded-lg p-3 border border-parchment-300 text-center">
            <div className="text-ink/40 text-[10px] font-sans uppercase tracking-wider mb-1">
              {item.label}
            </div>
            <div className="text-ink font-bold font-data text-xl">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Ca / Mg */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Ca inicial", value: field.ca },
          { label: "Mg inicial", value: field.mg },
        ].map((item) => (
          <div key={item.label} className="bg-parchment-200 rounded-lg p-3 border border-parchment-300">
            <div className="text-ink/40 text-[10px] font-sans uppercase tracking-wider mb-1">
              {item.label}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-ink font-bold font-data text-xl">{item.value}</span>
              <span className="text-ink/40 text-[10px] font-sans">mmolc/dm³</span>
            </div>
          </div>
        ))}
      </div>

      {/* V2% selector */}
      <div className="bg-parchment-200 rounded-lg p-3 border border-parchment-300">
        <div className="text-ink/40 text-[10px] font-sans uppercase tracking-wider mb-2">
          V2% desejado
        </div>
        <div className="flex gap-1.5">
          {[60, 65, 70, 75].map((v) => (
            <button
              key={v}
              onClick={() => setV2(v)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold font-data border transition-all ${
                v2 === v
                  ? "bg-forest text-white border-forest"
                  : "bg-white text-ink/40 border-parchment-300 hover:border-forest/40"
              }`}
            >
              {v}%
            </button>
          ))}
        </div>
      </div>

      {/* Dose result */}
      <div
        className={`rounded-lg p-4 border transition-all ${dose > 0 ? "bg-gold/12 border-gold/40" : "bg-parchment-200 border-parchment-300"}`}
      >
        <div className="text-gold-deep text-[10px] font-sans uppercase tracking-wider mb-1 font-semibold">
          {dose > 0 ? "Dose recomendada de calcário" : "Sem necessidade de calagem"}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-forest font-bold font-data text-3xl">{dose.toFixed(2)}</span>
          <span className="text-gold-deep text-sm font-sans font-semibold">t/ha</span>
        </div>
        {dose > 0 && (
          <div className="mt-2 h-1.5 bg-parchment-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-forest to-gold rounded-full transition-all duration-500"
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
  ideal: { pill: "bg-status-good/20 border-status-good/40 text-[#7fd19f]", bar: "#1f8a4c" },
  "aceitável": { pill: "bg-status-warn/20 border-status-warn/40 text-[#f7bd8a]", bar: "#f2994a" },
  restritivo: { pill: "bg-status-bad/20 border-status-bad/40 text-[#ef8a95]", bar: "#b41c2b" },
} as const;

function DashboardMock() {
  const [selected, setSelected] = useState(0);
  const field = DASHBOARD_FIELDS[selected];

  return (
    <div className="space-y-3 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-white/50 text-xs font-sans uppercase tracking-wider">
          Dashboard, talhões
        </span>
        <span className="text-gold/80 text-xs font-sans">Após calagem, safra 2026</span>
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
              className={`rounded-lg p-3 border text-left transition-all ${
                active
                  ? "bg-white/15 border-white/30 shadow-md"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <div className={`text-xs font-bold font-data mb-2 ${active ? "text-white" : "text-white/50"}`}>
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
      <div className="bg-white/8 rounded-lg border border-white/12 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-white font-bold font-display text-lg">
            {field.id}, {field.crop}
          </span>
          {field.dose > 0 && (
            <span className="text-gold text-xs font-data bg-gold/15 border border-gold/30 px-2.5 py-1 rounded-full font-semibold">
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
              <div key={item.label} className={`rounded-lg p-3 border ${s.pill}`}>
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
              <span className="text-white/40 text-[10px] font-sans capitalize">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Plain sequence (used within each module block — a real ordered process,
// not a decorative "Step 1 / Step 2" label) ─────────────────────────────────

function StepRow({ steps, onDark = false }: { steps: string[]; onDark?: boolean }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-2 font-sans text-sm ${onDark ? "text-white/60" : "text-ink/50"}`}>
      {steps.map((s, i) => (
        <span key={s} className="flex items-center gap-2">
          <span>{s}</span>
          {i < steps.length - 1 && <span className={`font-bold ${onDark ? "text-gold" : "text-gold-deep"}`}>/</span>}
        </span>
      ))}
    </div>
  );
}

// ─── Email Form (reusable) ─────────────────────────────────────────────────────
// Always used on a forest-green background — button inverts to a clean
// white-on-forest CTA rather than competing with the brand hue.

function EmailForm({
  onSubmit,
  isLoading,
  errors,
  register,
}: {
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  errors: { email?: { message?: string } };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-3 w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border bg-white/10 border-white/20 text-white">
          <Mail className="w-4 h-4 flex-shrink-0 text-white/50" strokeWidth={1.5} />
          <input
            {...register("email")}
            type="email"
            placeholder="Seu melhor email"
            className="flex-1 bg-transparent border-none outline-none text-sm font-sans min-w-0 placeholder:opacity-60 text-white placeholder:text-white/60"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 font-semibold font-sans rounded-xl text-sm whitespace-nowrap disabled:opacity-60 transition-all duration-200 bg-white text-forest hover:bg-gold hover:text-ink"
        >
          {isLoading ? "Enviando" : "Entrar na lista"}
        </button>
      </div>
      {errors.email && <p className="text-sm text-center text-[#f4a5ac]">{errors.email.message}</p>}
      <p className="text-xs text-center text-white/50">
        Ao continuar você concorda com a nossa{" "}
        <Link href="/privacy-policy" className="underline text-white/70 hover:text-white">
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

  // Scroll-reveal via IntersectionObserver (never a raw scroll listener)
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
    document.getElementById("lista-espera")?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-parchment text-ink overflow-x-hidden">
      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-parchment/90 nav-blur border-b border-parchment-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="Agristato" width={32} height={32} className="w-8 h-8" />
            <span className="font-logo font-bold text-xl text-forest tracking-tight">
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
              className="px-5 py-2 bg-forest text-white text-sm font-semibold rounded-lg hover:bg-forest-deep transition-colors"
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
            {mobileMenuOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-parchment border-t border-parchment-300 px-6 py-4 space-y-3">
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
              className="w-full mt-2 py-3 bg-forest text-white text-sm font-semibold rounded-lg hover:bg-forest-deep transition-colors"
            >
              Entrar na lista
            </button>
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* HERO                                                                */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-forest-night overflow-hidden">
        <div className="absolute inset-0 bg-furrow-pattern pointer-events-none" />
        <div
          className="absolute -top-32 -right-32 w-[36rem] h-[36rem] rounded-full pointer-events-none opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, #f2c14e 0%, transparent 70%)" }}
        />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-forest-night to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — text */}
            <div className="space-y-8">
              <div data-reveal className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/15 border border-gold/30 rounded-full">
                <span className="font-data text-gold text-xs tracking-wide">
                  Pré-lançamento, 31 Julho 2026
                </span>
              </div>

              <div data-reveal data-delay="1" className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-[3.1rem] font-display font-extrabold text-white leading-[1.08] tracking-tight">
                  Da amostra ao talhão,<br />
                  <span className="text-gold">em uma dose só.</span>
                </h1>
                <p className="text-lg text-white/70 leading-relaxed font-sans max-w-lg">
                  Calagem, gessagem e adubação com as fórmulas do Boletim IAC 100 e da EMBRAPA
                  Cerrados, para até 20 mil talhões.
                </p>
              </div>

              <div className="space-y-3">
                <EmailForm onSubmit={handleSubmit(onEmailSubmit)} isLoading={isLoading} errors={errors} register={register} />
                {isLoadingCount ? (
                  <div className="w-40 h-4 bg-white/10 rounded animate-pulse" />
                ) : (
                  <p className="text-white/50 text-sm font-sans">
                    <span className="font-bold text-gold font-data">{userCount}</span> fazendas já na lista
                  </p>
                )}
              </div>
            </div>

            {/* Right — talhão mosaic */}
            <div className="hidden lg:flex justify-end">
              <TalhaoMosaic />
            </div>
          </div>

          {/* Mobile mosaic */}
          <div className="lg:hidden mt-12 flex justify-center">
            <TalhaoMosaic />
          </div>
        </div>
      </section>

      <FurrowDivider from="#0e2213" to="#fbfdfc" />

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* DIAGNÓSTICO                                                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section id="diagnostico" className="py-24 px-6 bg-parchment">
        <div className="max-w-7xl mx-auto space-y-14">
          <div data-reveal className="max-w-3xl space-y-4">
            <h2 className="text-3xl lg:text-5xl font-display font-extrabold text-ink leading-tight">
              O problema não é falta de dado. <span className="text-forest">É excesso de planilha.</span>
            </h2>
            <p className="text-ink/55 text-lg font-sans leading-relaxed">
              Agrônomos e produtores perdem horas por safra copiando laudos, recalculando doses
              talhão a talhão e montando planos em planilhas paralelas, uma para cada laboratório,
              uma para cada cliente.
            </p>
          </div>

          {/* Before / After */}
          <div className="grid gap-3">
            {[
              { before: "Copia e cola laudo do laboratório na planilha", after: "Upload do arquivo, dados prontos em segundos" },
              { before: "Calcula dose de calcário manualmente, talhão a talhão", after: "O sistema aplica a fórmula V% para até 20 mil talhões por vez" },
              { before: "Sem visibilidade do Ca e Mg após a colheita", after: "Dashboard projeta o saldo de nutrientes por safra" },
              { before: "Consulta preço do CEASA em planilhas separadas", after: "Radar de Cotação cruza preço, tendência e janela de plantio" },
            ].map((row, i) => (
              <div key={row.before} data-reveal data-delay={String((i % 4) + 1)} className="grid md:grid-cols-2 gap-3">
                <div className="bg-status-bad/5 border border-status-bad/20 rounded-xl p-4">
                  <div className="font-data text-status-bad text-[10px] mb-1.5 uppercase tracking-wider font-bold">Antes</div>
                  <p className="text-ink/60 text-sm leading-relaxed font-sans">{row.before}</p>
                </div>
                <div className="bg-status-good/8 border border-status-good/25 rounded-xl p-4">
                  <div className="font-data text-status-good text-[10px] mb-1.5 uppercase tracking-wider font-bold">Com Agristato</div>
                  <p className="text-ink text-sm leading-relaxed font-sans">{row.after}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Verifiable facts, not marketing stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t-2 border-gold/30">
            {[
              { value: "20.000", label: "Amostras por lote" },
              { value: "268", label: "Testes automatizados" },
              { value: "27", label: "Culturas cadastradas" },
              { value: "18", label: "Meses de planejamento" },
            ].map((stat, i) => (
              <div key={stat.label} data-reveal data-delay={String(i + 1)} className="space-y-1">
                <div className="text-3xl lg:text-4xl font-data font-bold text-forest">{stat.value}</div>
                <div className="text-ink/50 text-sm font-sans">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* METODOLOGIA                                                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section id="metodologia" className="py-24 px-6 bg-parchment">
        <div className="max-w-7xl mx-auto space-y-16">
          <div data-reveal className="max-w-3xl space-y-4">
            <h2 className="text-3xl lg:text-5xl font-display font-extrabold text-ink leading-tight">
              Duas ferramentas, <span className="text-forest">o vocabulário que você já usa.</span>
            </h2>
            <p className="text-ink/55 text-lg font-sans leading-relaxed">
              Nada de jargão de startup. Cada número na tela é um termo que você já vê no laudo do
              laboratório ou no boletim da CEASA.
            </p>
          </div>

          {/* ── Análise de Solo ─────────────────────────────── */}
          <div id="analise-solo" className="space-y-8">
            <div data-reveal className="grid lg:grid-cols-2 gap-10 items-start">
              <div className="space-y-5">
                <h3 className="text-2xl font-display font-extrabold text-ink">
                  Análise de Solo: calagem, gessagem e adubação com fonte citada
                </h3>
                <p className="text-ink/55 text-sm leading-relaxed font-sans">
                  V1% e V2%, CTC, PRNT, NC por saturação, alumínio ou o máximo entre os dois, pela
                  metodologia IAC ou Cerrados. Tipo de calcário recomendado (calcítico ou dolomítico),
                  gessagem por textura de solo (Sousa e Lobato, EMBRAPA Cerrados 2004) e adubação de
                  P e K (ERP/CFSEMG) para 27 culturas cadastradas.
                </p>
                <StepRow steps={["Importe o CSV/XLSX", "Defina a timeline de 18 meses", "Receba dose, custo e trilha auditável"]} />
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
                          ? "bg-status-good/10 border-status-good/30 text-status-good"
                          : "bg-parchment-200 border-parchment-300 text-ink/40"
                      }`}
                    >
                      {pill.label}, {pill.available ? "disponível" : "em breve"}
                    </span>
                  ))}
                </div>
              </div>
              <SoilAnalysisMock />
            </div>
          </div>

          {/* ── Radar de Cotação ─────────────────────────────── */}
          <div id="radar" data-reveal className="bg-forest-night rounded-2xl border border-white/10 p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-furrow-pattern pointer-events-none" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-start">
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-display font-extrabold text-white">
                    Radar de Cotação: preço, tendência e janela de plantio
                  </h3>
                  <span className="px-2 py-0.5 bg-gold/20 border border-gold/40 text-gold text-[10px] font-bold rounded-full uppercase tracking-wide font-sans">
                    Novo
                  </span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed font-sans">
                  Preços diários da CEASA desde 2015 (46 unidades, 48 produtos) e volumes mensais do
                  SIMAB desde 2021 (30 unidades, 530 produtos). O ranking de oportunidades cruza
                  produto, mercado e data de plantio, e mostra o motivo de cada posição.
                </p>
                <StepRow onDark steps={["Selecione produto e região", "Veja o ranking de oportunidades", "Compare e decida"]} />
                <div className="flex flex-wrap gap-2 pt-2">
                  {["Cotações CEASA", "Projeção de preços", "Ranking de oportunidades", "Comparação justificada"].map(
                    (label) => (
                      <span
                        key={label}
                        className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide bg-white/10 border-white/20 text-white/80"
                      >
                        {label}, disponível
                      </span>
                    ),
                  )}
                </div>
              </div>

              {/* Price mock */}
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gold/10 border border-gold/30 rounded-xl p-5 flex items-start gap-4">
                  <div className="w-8 h-8 rounded bg-gold/25 flex items-center justify-center flex-shrink-0 font-data text-gold text-sm font-bold">
                    1
                  </div>
                  <div>
                    <div className="text-gold text-xs font-bold uppercase tracking-wider font-sans mb-1">
                      Tomate, CEAGESP
                    </div>
                    <div className="text-white font-bold font-data text-lg">R$ 4,80/kg, alta</div>
                    <div className="text-white/50 text-sm font-sans mt-1">
                      Maior preço esperado e tendência de alta clara, mesmo com risco médio.
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-white/50 text-xs font-sans mb-1">Batata, CEASA MG</div>
                    <div className="text-white font-bold font-data text-xl">R$ 2,90/kg</div>
                    <div className="text-[#7fd19f] text-xs font-data mt-1 font-semibold">+3,2% vs média</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-white/50 text-xs font-sans mb-1">Tomate, CEAGESP</div>
                    <div className="text-white font-bold font-data text-xl">R$ 4,80/kg</div>
                    <div className="text-[#ef8a95] text-xs font-data mt-1 font-semibold">-1,1% vs média</div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-white/50 text-xs font-sans mb-2 uppercase tracking-wider">
                    Comparação
                  </div>
                  <div className="text-white/70 text-sm font-sans leading-relaxed">
                    Tomate em CEAGESP à frente: maior preço esperado e tendência de alta clara. Para
                    menor risco, Batata em CEASA MG é a opção mais estável do trio.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FurrowDivider from="#fbfdfc" to="#0e2213" flip />

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* RESULTADOS — full-width showcase, not a text/visual split          */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section id="resultados" className="py-24 px-6 bg-forest-night relative overflow-hidden">
        <div className="absolute inset-0 bg-furrow-pattern pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto space-y-12">
          <div data-reveal className="max-w-3xl space-y-4">
            <h2 className="text-3xl lg:text-5xl font-display font-extrabold text-white leading-tight">
              Dashboard completo, <span className="text-gold">por talhão.</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed font-sans">
              Tabela por talhão com V1%, CTC, as três leituras de NC e a dose recomendada. Saldo de
              Ca e Mg projetado safra a safra, ranking de custo por ponto de nutriente e a trilha
              auditável de cada termo da fórmula.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "Saldo de Ca e Mg por safra, cultura a cultura",
              "Tabela por talhão: V1%, CTC, NC e dose",
              "Ranking de custo entre 8 fertilizantes",
              "Trilha auditável de cada termo calculado",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-white/80 text-sm font-sans">{item}</span>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <DashboardMock />
            <div className="relative rounded-xl overflow-hidden border border-white/10">
              <Image
                src="/app-example.png"
                alt="Tela do dashboard do Agristato mostrando talhões, doses e status de Ca/Mg"
                width={600}
                height={375}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={scrollToCta}
              className="inline-flex px-6 py-3.5 bg-white text-forest text-sm font-semibold rounded-xl hover:bg-gold hover:text-ink transition-colors font-sans"
            >
              Garantir acesso antecipado
            </button>
          </div>
        </div>
      </section>

      <FurrowDivider from="#0e2213" to="#fbfdfc" />

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* VALIDAÇÃO                                                           */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section id="validacao" className="py-24 px-6 bg-parchment">
        <div className="max-w-7xl mx-auto space-y-14">
          <div data-reveal className="max-w-3xl space-y-4">
            <h2 className="text-3xl lg:text-5xl font-display font-extrabold text-ink leading-tight">
              Por que confiar <span className="text-forest">no número que a tela mostra.</span>
            </h2>
            <p className="text-ink/55 text-lg font-sans leading-relaxed">
              Nenhuma constante é arbitrária. Cada cálculo aponta para uma fonte, e o sistema é
              testado como qualquer software de produção precisa ser.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-parchment-300 border border-parchment-300 rounded-2xl overflow-hidden">
            {[
              { value: "268", label: "Testes automatizados", sub: "domínio, aplicação e API" },
              { value: "IAC 100", label: "Metodologia de calagem", sub: "Boletim IAC 100 e EMBRAPA Cerrados" },
              { value: "4", label: "Algoritmos de previsão", sub: "validados contra numpy/statsmodels" },
              { value: "2015", label: "Dados CEASA desde", sub: "46 unidades, 48 produtos" },
              { value: "20.000", label: "Amostras por lote", sub: "em uma única chamada" },
            ].map((item, i) => (
              <div
                key={item.label}
                data-reveal
                data-delay={String((i % 5) + 1)}
                className="bg-white p-6 space-y-2 border-t-2 border-gold"
              >
                <div className="text-2xl font-data font-bold text-forest">{item.value}</div>
                <div className="text-ink text-sm font-sans font-semibold">{item.label}</div>
                <div className="text-ink/40 text-xs font-sans leading-snug">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FurrowDivider from="#fbfdfc" to="#1a3320" flip />

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* PRESCRIÇÃO                                                          */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section id="lista-espera" className="py-24 px-6 bg-forest-deep relative overflow-hidden">
        <div className="absolute inset-0 bg-furrow-pattern pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
          <h2 data-reveal className="text-3xl lg:text-5xl font-display font-extrabold text-white leading-tight">
            Reserve sua vaga para a <span className="text-gold">primeira prescrição.</span>
          </h2>
          <p data-reveal data-delay="1" className="text-white/70 text-lg font-sans leading-relaxed">
            Seja um dos primeiros a usar o Agristato. Quem entra na lista de espera recebe acesso
            prioritário e condições especiais de lançamento.
          </p>

          <div className="max-w-xl mx-auto space-y-3">
            <EmailForm onSubmit={handleSubmitCta(onEmailSubmit)} isLoading={isLoading} errors={errorsCta} register={registerCta} />
            {isLoadingCount ? (
              <div className="w-48 h-4 bg-white/10 rounded animate-pulse mx-auto" />
            ) : (
              <p className="text-white/50 text-sm font-sans">
                <span className="font-bold text-gold font-data">{userCount}</span> fazendas já garantiram seu lugar
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-forest-deep border-t border-white/10 py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <Image src="/logo-white.svg" alt="Agristato" width={32} height={32} className="w-8 h-8" />
                <span className="font-logo font-bold text-lg text-white tracking-tight">Agristato</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed font-sans max-w-xs">
                Análise de solo e inteligência de mercado para agricultura de precisão, com fórmulas
                citadas, não caixas-pretas.
              </p>
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
                    <a href={item.href} className="text-white/50 text-sm hover:text-white transition-colors font-sans">
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
                  <Link href="/privacy-policy" className="text-white/50 text-sm hover:text-white transition-colors font-sans">
                    Política de Privacidade
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm font-sans">© 2026 Agristato. Todos os direitos reservados.</p>
            <p className="text-white/40 text-xs font-sans">Feito com precisão para o agronegócio brasileiro</p>
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
