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

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconLeaf({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.716.607 5.18 1.64" />
    </svg>
  );
}

function IconBarChart({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function IconBolt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

function IconUpload({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  );
}

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

function IconTrendUp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}

function IconMap({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m-3-9.375l-3-2.625-3 2.625V18.75l3-2.625 3 2.625 3-2.625V6.375l-3 2.625z" />
    </svg>
  );
}

function IconFlask({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.3 24.3 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15a2.25 2.25 0 01.207 1.68l-.793 3.174A2.25 2.25 0 0117.023 21H6.977a2.25 2.25 0 01-2.19-1.746l-.794-3.174A2.25 2.25 0 014.2 15h15.6z" />
    </svg>
  );
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
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

// ─── Wave Divider ──────────────────────────────────────────────────────────────

function Wave({ className }: { className?: string }) {
  return (
    <div className={`wave-divider ${className ?? ""}`} aria-hidden>
      <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="h-14">
        <path d="M0,28 C240,56 480,0 720,28 C960,56 1200,0 1440,28 L1440,56 L0,56 Z" fill="currentColor" />
      </svg>
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
        <div className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border ${
          isDark
            ? "bg-white/10 border-white/20 text-white"
            : "bg-white border-beige-75 text-ink"
        }`}>
          <IconEmail className={`w-4 h-4 flex-shrink-0 ${isDark ? "text-zest/60" : "text-beige-100"}`} />
          <input
            {...register("email")}
            type="email"
            placeholder="Seu melhor email"
            className={`flex-1 bg-transparent border-none outline-none text-sm font-outfit min-w-0 placeholder:opacity-60 ${
              isDark ? "text-white placeholder:text-zest" : "text-ink placeholder:text-beige-100"
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-3 font-semibold font-outfit rounded-xl text-sm whitespace-nowrap disabled:opacity-60 transition-all duration-200 ${
            isDark
              ? "bg-lime text-forest hover:bg-zest"
              : "bg-brand text-white hover:bg-brand-hover"
          }`}
        >
          {isLoading ? "Enviando..." : "Entrar na lista de espera"}
        </button>
      </div>
      {errors.email && (
        <p className={`text-sm text-center ${isDark ? "text-red-300" : "text-red-600"}`}>
          {errors.email.message}
        </p>
      )}
      <p className={`text-xs text-center ${isDark ? "text-zest/50" : "text-beige-100"}`}>
        Ao continuar você concorda com a nossa{" "}
        <Link
          href="/privacy-policy"
          className={`underline ${isDark ? "text-zest/70 hover:text-zest" : "text-olive hover:text-forest"}`}
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
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Text-reveal spans
  useEffect(() => {
    const els = document.querySelectorAll(".text-reveal-inner");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
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

  const resetAll = () => { reset(); resetCta(); };

  const onEmailSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      const user = await api.createUser(data.email);
      if (user) {
        setCurrentUser(user);
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
    <div className="min-h-screen bg-beige text-ink overflow-x-hidden">

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-beige/90 nav-blur border-b border-beige-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="Agristato" width={32} height={32} className="w-8 h-8" />
            <span className="logo font-bold text-xl text-forest tracking-tight">Agristato</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-forest/60">
            <a href="#analise-solo" className="hover:text-forest transition-colors">Análise de Solo</a>
            <a href="#radar" className="hover:text-forest transition-colors flex items-center gap-1.5">
              Radar de Cotação
              <span className="px-1.5 py-0.5 bg-lime/20 text-olive text-[10px] font-bold rounded uppercase tracking-wide font-outfit">Novo</span>
            </a>
            <a href="#sobre" className="hover:text-forest transition-colors">Sobre</a>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={scrollToCta}
              className="px-5 py-2 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-hover transition-colors"
            >
              Entrar na lista
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-forest"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-beige border-t border-beige-50 px-6 py-4 space-y-3">
            <a href="#analise-solo" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-forest/70 hover:text-forest">Análise de Solo</a>
            <a href="#radar" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-forest/70 hover:text-forest flex items-center gap-1.5">
              Radar de Cotação
              <span className="px-1.5 py-0.5 bg-lime/20 text-olive text-[10px] font-bold rounded uppercase tracking-wide font-outfit">Novo</span>
            </a>
            <a href="#sobre" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-forest/70 hover:text-forest">Sobre</a>
            <button
              onClick={scrollToCta}
              className="w-full mt-2 py-3 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-hover transition-colors"
            >
              Entrar na lista
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative bg-forest overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none parallax-hero-bg" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-forest to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — text */}
            <div className="space-y-8">
              <div data-reveal className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-lime/15 border border-lime/25 rounded-full">
                <span className="text-lime text-xs font-bold tracking-wider font-outfit uppercase">Lançamento</span>
                <div className="w-1 h-1 bg-lime rounded-full" />
                <span className="text-lime text-xs font-bold tracking-wider font-outfit">3 Mai, 2026</span>
              </div>

              <div data-reveal data-delay="1" className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-domine text-white leading-[1.1] tracking-tight">
                  Uma plataforma para quem toma{" "}
                  <span className="text-lime">decisões no campo</span>
                </h1>
                <p className="text-lg text-zest/70 leading-relaxed font-outfit max-w-lg">
                  Do cálculo de calagem ao radar de preços do CEASA —{" "}
                  <span className="text-zest font-semibold">análise de solo</span>,{" "}
                  <span className="text-zest font-semibold">planejamento de safra</span> e{" "}
                  <span className="text-zest font-semibold">inteligência de mercado</span> em um só lugar.
                </p>
              </div>

              <EmailForm
                onSubmit={handleSubmit(onEmailSubmit)}
                isLoading={isLoading}
                errors={errors}
                register={register}
                variant="dark"
              />

              {/* Waitlist counter */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-2">
                  {["#61881e","#003a0b","#a5e119","#09cf58"].map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-forest flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: color }}
                    >
                      {["F","A","Z","E"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  {isLoadingCount ? (
                    <div className="w-20 h-5 bg-white/10 rounded animate-pulse" />
                  ) : (
                    <p className="text-white text-sm font-outfit">
                      <span className="font-bold text-lime font-domine text-lg">{userCount}</span>
                      {" "}fazendas já na lista
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right — screenshot */}
            <div className="hidden lg:flex justify-end">
              <div className="relative">
                <div className="absolute -inset-4 bg-lime/10 rounded-3xl blur-2xl" />
                <Image
                  src="/example.png"
                  alt="Agristato Dashboard"
                  width={600}
                  height={375}
                  className="relative rounded-2xl shadow-2xl shadow-black/40 border border-white/10 w-full max-w-[600px]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Wave className="bg-forest text-moss" />

      {/* ── Stats bar ──────────────────────────────────────────────────────── */}
      <section className="bg-moss py-10 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: isLoadingCount ? "..." : `${userCount}+`, label: "Fazendas na lista" },
            { value: "7+", label: "Ferramentas integradas" },
            { value: "3 Mai", label: "Data de lançamento" },
            { value: "Zero", label: "Planilhas manuais" },
          ].map((stat, i) => (
            <div key={stat.label} data-reveal data-delay={String(i + 1)} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold font-domine text-lime">{stat.value}</div>
              <div className="text-zest/60 text-sm mt-1 font-outfit">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <Wave className="bg-moss text-beige-50" />

      {/* ── Platform Overview ───────────────────────────────────────────────── */}
      <section id="plataforma" className="py-20 px-6 bg-beige-50">
        <div className="max-w-4xl mx-auto">
          <div data-reveal className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-lime/15 border border-lime/25 rounded-full">
              <span className="text-olive text-xs font-bold tracking-wider uppercase font-outfit">O que o Agristato faz</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold font-domine text-forest">
              Ferramentas que{" "}
              <span className="text-olive">transformam dados em decisões</span>
            </h2>
            <p className="text-beige-100 text-base font-outfit max-w-lg mx-auto">
              Cada ferramenta resolve um problema real — juntas formam o núcleo de gestão da sua operação.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Card A — Análise de Solo */}
            <div data-reveal data-delay="1" className="bg-white border border-lime/20 rounded-2xl p-8 hover:border-lime/40 transition-colors flex flex-col gap-5">
              <div>
                <div className="inline-flex p-3 rounded-xl bg-lime/15 text-olive border border-lime/15 mb-4">
                  <IconLeaf className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-domine text-forest mb-2">Análise de Solo</h3>
                <p className="text-beige-100 text-sm font-outfit leading-relaxed">
                  Calagem, fertilidade, exportação de nutrientes e mapas interpolados. Do laudo CSV ao plano de manejo completo.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 flex-1">
                {[
                  { label: "Calagem", available: true },
                  { label: "Macronutrientes P e K", available: false },
                  { label: "Mapa de fertilidade", available: false },
                  { label: "Micronutrientes", available: false },
                ].map((pill) => (
                  <span
                    key={pill.label}
                    className={`text-xs font-outfit px-2.5 py-1 rounded-full border ${
                      pill.available
                        ? "bg-lime/15 border-lime/25 text-olive"
                        : "bg-beige-50 border-beige-75 text-beige-100"
                    }`}
                  >
                    {pill.label} · {pill.available ? "disponível" : "em breve"}
                  </span>
                ))}
              </div>
              <a href="#analise-solo" className="text-sm font-semibold font-outfit text-forest hover:text-olive transition-colors">
                Ver módulo ↓
              </a>
            </div>

            {/* Card B — Radar de Cotação */}
            <div data-reveal data-delay="2" className="bg-forest border border-white/10 rounded-2xl p-8 relative overflow-hidden flex flex-col gap-5">
              <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />
              <div className="relative z-10 flex flex-col gap-5 h-full">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex p-3 rounded-xl bg-lime/15 text-lime border border-lime/15">
                      <IconTrendUp className="w-6 h-6" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-lime/15 border border-lime/25 rounded-full">
                      <div className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse" />
                      <span className="text-lime text-[10px] font-bold uppercase tracking-wider font-outfit">Novo</span>
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-domine text-white mb-2">Radar de Cotação</h3>
                  <p className="text-zest/60 text-sm font-outfit leading-relaxed">
                    Preços CEASA em tempo real, 4 algoritmos de projeção e calculadora de lucratividade por hectare.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 flex-1">
                  {[
                    { label: "Cotações CEASA", available: true },
                    { label: "4 Algoritmos", available: true },
                    { label: "Recomendação IA", available: true },
                    { label: "Lucratividade", available: true },
                  ].map((pill) => (
                    <span
                      key={pill.label}
                      className="text-xs font-outfit px-2.5 py-1 rounded-full border bg-lime/15 border-lime/25 text-lime"
                    >
                      {pill.label} · disponível
                    </span>
                  ))}
                </div>
                <a href="#radar" className="text-sm font-semibold font-outfit text-lime hover:text-zest transition-colors">
                  Ver módulo ↓
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* MÓDULO 01 — ANÁLISE DE SOLO                                          */}
      {/* ══════════════════════════════════════════════════════════════════════ */}

      {/* ── Análise de Solo — intro + features ─────────────────────────────── */}
      <section id="analise-solo" className="py-24 px-6 bg-beige">
        <div className="max-w-7xl mx-auto space-y-14">

          {/* Module header */}
          <div data-reveal className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-lime/15 border border-lime/25 rounded-full">
              <IconLeaf className="w-3.5 h-3.5 text-olive" />
              <span className="text-olive text-xs font-bold tracking-wider uppercase font-outfit">Análise de Solo</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold font-domine text-forest leading-tight">
              Do laudo de solo ao plano de{" "}
              <span className="text-olive">manejo completo</span>
            </h2>
            <p className="text-beige-100 text-lg font-outfit leading-relaxed">
              Sete ferramentas integradas que eliminam planilhas e entregam recomendações precisas — da calagem ao mapa interpolado de fertilidade do solo.
            </p>
          </div>

          {/* Feature 1 — Hero card: Calagem */}
          <div data-reveal className="bg-white rounded-2xl border border-lime/20 p-8 lg:p-10 grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="inline-flex p-3 rounded-xl bg-lime/15 text-olive border border-lime/15">
                  <IconLeaf className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 bg-lime/20 text-olive text-xs font-bold rounded-full uppercase tracking-wide font-outfit">
                  Disponível agora
                </span>
              </div>
              <h3 className="text-2xl font-bold font-domine text-forest">Calagem — Método V%</h3>
              <p className="text-beige-100 text-sm leading-relaxed font-outfit">
                Calcule a dose exata de calcário por talhão com base em pH, CTC, V1% e V2%. Parâmetros globais editáveis pelo agrônomo. Sem fórmulas manuais, sem erros de arredondamento.
              </p>
              <ul className="space-y-2.5">
                {[
                  "Método V% homologado (IAC/Embrapa)",
                  "V2% e PRNT% globais configuráveis",
                  "Dashboard de Ca e Mg por talhão",
                  "Timeline de culturas com 18 meses de planejamento",
                  "Importação CSV/XLSX de qualquer laboratório",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-forest/80 font-outfit">
                    <div className="w-4 h-4 rounded-full bg-lime/20 flex items-center justify-center flex-shrink-0">
                      <IconCheck className="w-2.5 h-2.5 text-olive" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden md:block relative">
              <div className="absolute -inset-3 bg-lime/5 rounded-2xl blur-xl" />
              <Image
                src="/example.png"
                alt="Dashboard de Calagem Agristato"
                width={560}
                height={350}
                className="relative rounded-xl border border-beige-75 shadow-lg shadow-forest/5 w-full"
              />
            </div>
          </div>

          {/* Features 2-7 — Roadmap grid */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-lg font-bold font-domine text-forest">Roadmap do módulo</h3>
              <div className="flex-1 h-px bg-beige-75" />
              <span className="text-beige-100 text-xs font-outfit">6 funcionalidades em desenvolvimento</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  icon: <IconLeaf className="w-5 h-5" />,
                  title: "Fertilidade — Macronutrientes P e K",
                  description: "Recomendação de adubação de manutenção e correção de fósforo e potássio por cultura e produtividade esperada.",
                },
                {
                  icon: <IconUpload className="w-5 h-5" />,
                  title: "Exportação de Nutrientes",
                  description: "Calcule a exportação de Ca, Mg, P e K por tonelada colhida — integrado automaticamente ao plano de safra.",
                },
                {
                  icon: <IconCalendar className="w-5 h-5" />,
                  title: "Rateio Nutricional por Cultura",
                  description: "Distribua a necessidade nutricional ao longo da timeline de safra de forma otimizada e auditável.",
                },
                {
                  icon: <IconMap className="w-5 h-5" />,
                  title: "Mapa Interpolado de Fertilidade",
                  description: "Visualize o teor nutricional com interpolação geoespacial — identifique manchas críticas e zonas de manejo.",
                },
                {
                  icon: <IconBarChart className="w-5 h-5" />,
                  title: "Custo do Ponto do Nutriente",
                  description: "Compare fertilizantes pelo custo real por kg de nutriente. Calcule a opção mais econômica por talhão.",
                },
                {
                  icon: <IconFlask className="w-5 h-5" />,
                  title: "Fertilidade — Micronutrientes",
                  description: "Análise de B, Cu, Fe, Mn e Zn. Recomendações para culturas exigentes em micronutrição.",
                },
              ].map((feature, i) => (
                <div
                  key={feature.title}
                  data-reveal
                  data-delay={String((i % 3) + 1)}
                  className="bg-beige-50 border border-beige-75 rounded-xl p-5 hover:bg-white hover:border-beige-100 transition-colors"
                >
                  <div className="inline-flex p-2.5 rounded-lg bg-beige-75/60 text-beige-100 mb-4">
                    {feature.icon}
                  </div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-bold font-domine text-forest/70 leading-snug">{feature.title}</h4>
                    <span className="flex-shrink-0 text-[10px] font-outfit font-bold uppercase tracking-wide px-2 py-0.5 bg-beige-75 text-beige-100 rounded-full">
                      Em breve
                    </span>
                  </div>
                  <p className="text-beige-100 text-xs leading-relaxed font-outfit">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Wave className="bg-beige text-forest" />

      {/* ── Product Showcase (Análise de Solo) ─────────────────────────────── */}
      <section className="py-24 px-6 bg-forest relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div data-reveal className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-lime/15 border border-lime/25 rounded-full">
                <IconLeaf className="w-3.5 h-3.5 text-lime" />
                <span className="text-lime text-xs font-bold tracking-wider uppercase font-outfit">Análise de Solo · Dashboard</span>
              </div>
              <h2 data-reveal data-delay="1" className="text-3xl lg:text-5xl font-bold font-domine text-white leading-tight">
                Dashboard completo{" "}
                <span className="text-lime">por talhão</span>
              </h2>
              <p data-reveal data-delay="2" className="text-zest/70 text-lg leading-relaxed font-outfit">
                Visualize a saúde do solo de cada talhão em tempo real. Snapshots de Ca e Mg após cada colheita mostram exatamente quando e quanto corrigir.
              </p>

              <div className="space-y-3.5">
                {[
                  "Projeção de Ca e Mg após calagem",
                  "Simulação pós-colheita cultura a cultura",
                  "Status de cada talhão com alertas coloridos",
                  "Exportação e compartilhamento do plano",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-lime/20 flex items-center justify-center flex-shrink-0">
                      <IconCheck className="w-3 h-3 text-lime" />
                    </div>
                    <span className="text-zest/80 text-sm font-outfit">{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={scrollToCta}
                className="inline-flex px-6 py-3.5 bg-lime text-forest text-sm font-semibold rounded-xl hover:bg-zest transition-colors font-outfit"
              >
                Garantir acesso antecipado →
              </button>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 bg-lime/8 rounded-3xl blur-3xl" />
              <Image
                src="/example.png"
                alt="Dashboard Agristato"
                width={640}
                height={400}
                className="relative rounded-2xl shadow-2xl shadow-black/50 border border-white/10 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <Wave className="bg-forest text-beige" />

      {/* ── Como funciona — Análise de Solo ────────────────────────────────── */}
      <section id="como-funciona" className="py-24 px-6 bg-beige">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-lime/15 border border-lime/25 rounded-full">
              <IconLeaf className="w-3.5 h-3.5 text-olive" />
              <span className="text-olive text-xs font-bold tracking-wider uppercase font-outfit">Análise de Solo · Como funciona</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold font-domine text-forest">
              Do CSV ao plano de manejo{" "}
              <span className="text-olive">em minutos</span>
            </h2>
            <p className="text-beige-100 text-lg max-w-2xl mx-auto font-outfit">
              Três etapas simples para transformar a análise do seu solo em ações concretas de manejo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-beige-75 pointer-events-none" />

            {[
              {
                step: "01",
                icon: <IconUpload className="w-6 h-6" />,
                title: "Importe a análise do solo",
                description: "Faça upload do CSV ou XLSX com os dados de análise do solo. O Agristato reconhece automaticamente colunas de pH, CTC, Ca, Mg e V%.",
                color: "bg-lime/15 text-olive border-lime/20",
                stepColor: "bg-forest text-white",
              },
              {
                step: "02",
                icon: <IconCalendar className="w-6 h-6" />,
                title: "Defina a timeline de culturas",
                description: "Monte o calendário agrícola dos próximos 18 meses. Atribua culturas e produtividades esperadas a cada talhão e época de plantio.",
                color: "bg-moss/10 text-forest border-moss/15",
                stepColor: "bg-moss text-white",
              },
              {
                step: "03",
                icon: <IconBolt className="w-6 h-6" />,
                title: "Receba as recomendações",
                description: "O sistema calcula automaticamente a dose de calcário, projeta o balanço de Ca e Mg após cada colheita e gera o dashboard de monitoramento.",
                color: "bg-olive/10 text-olive border-olive/20",
                stepColor: "bg-olive text-white",
              },
            ].map((item, i) => (
              <div key={item.step} data-reveal data-delay={String(i + 1)} className="relative">
                <div className={`inline-flex w-10 h-10 rounded-full items-center justify-center text-sm font-bold mb-6 ${item.stepColor}`}>
                  {item.step}
                </div>
                <div className={`p-2.5 rounded-xl border inline-flex mb-4 ${item.color}`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold font-domine text-forest mb-3">{item.title}</h3>
                <p className="text-beige-100 text-sm leading-relaxed font-outfit">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* MÓDULO 02 — RADAR DE COTAÇÃO                                         */}
      {/* ══════════════════════════════════════════════════════════════════════ */}

      {/* ── Radar de Cotação — intro ────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-beige-50">
        <div className="max-w-7xl mx-auto space-y-4">
          <div data-reveal className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-lime/15 border border-lime/25 rounded-full">
            <div className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse" />
            <span className="text-olive text-xs font-bold tracking-wider uppercase font-outfit">Radar de Cotação</span>
            <span className="px-1.5 py-0.5 bg-lime/20 text-olive text-[10px] font-bold rounded uppercase tracking-wide font-outfit">Novo</span>
          </div>
          <h2 data-reveal data-delay="1" className="text-3xl lg:text-5xl font-bold font-domine text-forest leading-tight max-w-2xl">
            Saiba o melhor momento{" "}
            <span className="text-olive">para colher e vender</span>
          </h2>
          <p data-reveal data-delay="2" className="text-beige-100 text-lg font-outfit leading-relaxed max-w-2xl">
            Cotações CEASA, 4 algoritmos de projeção e recomendação inteligente — tudo em um painel integrado ao seu planejamento de safra.
          </p>
        </div>
      </section>

      {/* ── Radar de Cotação — Showcase ─────────────────────────────────────── */}
      <section id="radar" className="py-16 px-6 bg-beige-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern-light pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Price cards mock — left side */}
            <div className="order-2 lg:order-1 grid grid-cols-1 gap-4">
              {/* Recommendation card */}
              <div data-reveal className="bg-lime/10 border border-lime/25 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-lime/20 flex items-center justify-center flex-shrink-0">
                  <IconCheck className="w-5 h-5 text-olive" />
                </div>
                <div>
                  <div className="text-olive text-xs font-bold uppercase tracking-wider font-outfit mb-1">Recomendação</div>
                  <div className="text-forest font-bold font-domine text-lg">Excelente momento para colher</div>
                  <div className="text-beige-100 text-sm font-outfit mt-1">Preço projetado próximo ao topo histórico dos últimos 5 anos.</div>
                </div>
              </div>

              {/* Price trend row */}
              <div data-reveal data-delay="1" className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-4 border border-beige-75">
                  <div className="text-beige-100 text-xs font-outfit mb-1">Soja · CEASA SP</div>
                  <div className="text-forest font-bold font-domine text-xl">R$ 148,20</div>
                  <div className="text-olive text-xs font-outfit mt-1 font-semibold">+3,2% vs. mês anterior</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-beige-75">
                  <div className="text-beige-100 text-xs font-outfit mb-1">Milho · CEASA MG</div>
                  <div className="text-forest font-bold font-domine text-xl">R$ 68,50</div>
                  <div className="text-red-400 text-xs font-outfit mt-1 font-semibold">−1,1% vs. mês anterior</div>
                </div>
              </div>

              {/* Algorithm selector mock */}
              <div data-reveal data-delay="2" className="bg-white rounded-xl p-5 border border-beige-75">
                <div className="text-beige-100 text-xs font-outfit mb-3 uppercase tracking-wider">Algoritmo de projeção</div>
                <div className="flex flex-wrap gap-2">
                  {["Sazonal", "Regressão Linear", "Holt-Winters", "ARIMA"].map((alg, i) => (
                    <span
                      key={alg}
                      className={`px-3 py-1 rounded-lg text-xs font-outfit font-semibold border ${
                        i === 0
                          ? "bg-forest text-white border-forest"
                          : "bg-beige-50 text-beige-100 border-beige-75"
                      }`}
                    >
                      {alg}
                    </span>
                  ))}
                </div>
                <div className="mt-3 h-2 bg-beige-50 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-to-r from-forest to-lime rounded-full" />
                </div>
                <div className="text-beige-100 text-xs font-outfit mt-1">Projeção: R$ 152,40 em 30 dias</div>
              </div>
            </div>

            {/* Text — right side */}
            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-5">
                {[
                  { label: "Cotações CEASA", desc: "Preços médios por unidade e produto, atualizados periodicamente." },
                  { label: "4 algoritmos de projeção", desc: "Sazonal, regressão linear, Holt-Winters e ARIMA — você escolhe o modelo." },
                  { label: "Recomendação inteligente", desc: "\"Excelente momento\", \"Neutro\" ou \"Atenção\" — com justificativa baseada em dados históricos." },
                  { label: "Calculadora de lucratividade", desc: "Simule o lucro por hectare com base no preço projetado e seu custo de produção." },
                ].map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-lime/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <IconCheck className="w-3 h-3 text-olive" />
                    </div>
                    <div>
                      <span className="text-forest font-semibold text-sm font-outfit">{item.label}</span>
                      <span className="text-beige-100 text-sm font-outfit"> — {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Como funciona — Radar de Cotação ────────────────────────────────── */}
      <section className="py-24 px-6 bg-beige">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div data-reveal className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-lime/15 border border-lime/25 rounded-full">
              <IconTrendUp className="w-3.5 h-3.5 text-olive" />
              <span className="text-olive text-xs font-bold tracking-wider uppercase font-outfit">Radar de Cotação · Como funciona</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold font-domine text-forest">
              Do produto ao preço ideal{" "}
              <span className="text-olive">em três cliques</span>
            </h2>
            <p className="text-beige-100 text-lg max-w-2xl mx-auto font-outfit">
              Consulte, projete e decida — tudo em um painel integrado à sua operação.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-beige-75 pointer-events-none" />

            {[
              {
                step: "01",
                icon: <IconSearch className="w-6 h-6" />,
                title: "Selecione produto e região",
                description: "Escolha a cultura (soja, milho, trigo...) e o CEASA de referência. O sistema carrega as cotações históricas automaticamente.",
                color: "bg-lime/15 text-olive border-lime/20",
                stepColor: "bg-forest text-white",
              },
              {
                step: "02",
                icon: <IconBarChart className="w-6 h-6" />,
                title: "Escolha o algoritmo",
                description: "Selecione entre Sazonal, Regressão Linear, Holt-Winters ou ARIMA. Cada modelo exibe a projeção de preço para os próximos 30 dias.",
                color: "bg-moss/10 text-forest border-moss/15",
                stepColor: "bg-moss text-white",
              },
              {
                step: "03",
                icon: <IconBolt className="w-6 h-6" />,
                title: "Receba a recomendação",
                description: "O sistema classifica o momento como Excelente, Neutro ou Atenção — com justificativa baseada em dados históricos e tendência calculada.",
                color: "bg-olive/10 text-olive border-olive/20",
                stepColor: "bg-olive text-white",
              },
            ].map((item, i) => (
              <div key={item.step} data-reveal data-delay={String(i + 1)} className="relative">
                <div className={`inline-flex w-10 h-10 rounded-full items-center justify-center text-sm font-bold mb-6 ${item.stepColor}`}>
                  {item.step}
                </div>
                <div className={`p-2.5 rounded-xl border inline-flex mb-4 ${item.color}`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold font-domine text-forest mb-3">{item.title}</h3>
                <p className="text-beige-100 text-sm leading-relaxed font-outfit">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Agristato ──────────────────────────────────────────────────── */}
      <section id="sobre" className="py-24 px-6 bg-beige-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div data-reveal className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-lime/15 border border-lime/25 rounded-full">
                <span className="text-olive text-xs font-bold tracking-wider uppercase font-outfit">Por que Agristato</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold font-domine text-forest leading-tight">
                Chega de planilhas.<br />
                <span className="text-olive">Mais tempo no campo.</span>
              </h2>
              <p className="text-beige-100 text-lg leading-relaxed font-outfit">
                Agrônomos e produtores perdem horas por safra consolidando laudos, recalculando doses e montando planos em planilhas. O Agristato automatiza tudo isso — com rigor técnico e resultados auditáveis.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                {[
                  { metric: "−80%", desc: "Tempo em planilhas" },
                  { metric: "100%", desc: "Talhões monitorados" },
                  { metric: "Zero", desc: "Erros de cálculo" },
                  { metric: "+18", desc: "Meses de planejamento" },
                ].map((item) => (
                  <div key={item.desc} className="space-y-1">
                    <div className="text-3xl font-bold font-domine text-forest">{item.metric}</div>
                    <div className="text-sm text-beige-100 font-outfit">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  before: "Copia e cola laudo do laboratório na planilha",
                  after: "Upload do arquivo → dados prontos em segundos",
                },
                {
                  before: "Calcula dose de calcário manualmente por talhão",
                  after: "Sistema aplica fórmula V% automaticamente",
                },
                {
                  before: "Sem visibilidade do Ca e Mg após a colheita",
                  after: "Dashboard projeta nutrientes para cada safra",
                },
                {
                  before: "Consulta preço do CEASA em planilhas separadas",
                  after: "Radar de Cotação indica o melhor momento para vender",
                },
              ].map((row, i) => (
                <div key={row.before} data-reveal data-delay={String(i + 1)} className="grid grid-cols-2 gap-3">
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                    <div className="text-red-400 text-xs font-bold mb-1.5 font-outfit uppercase tracking-wider">Antes</div>
                    <p className="text-red-700 text-sm leading-relaxed font-outfit">{row.before}</p>
                  </div>
                  <div className="bg-lime/10 border border-lime/20 rounded-xl p-4">
                    <div className="text-olive text-xs font-bold mb-1.5 font-outfit uppercase tracking-wider">Com Agristato</div>
                    <p className="text-forest text-sm leading-relaxed font-outfit">{row.after}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Wave className="bg-beige-50 text-moss" />

      {/* ── CTA Final ──────────────────────────────────────────────────────── */}
      <section ref={ctaRef} id="lista-espera" className="py-24 px-6 bg-moss relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
          <div data-reveal className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-lime/15 border border-lime/25 rounded-full">
            <span className="text-lime text-xs font-bold tracking-wider uppercase font-outfit">Lista de espera</span>
          </div>
          <h2 data-reveal data-delay="1" className="text-3xl lg:text-5xl font-bold font-domine text-white leading-tight">
            Garanta seu acesso{" "}
            <span className="text-lime">antecipado</span>
          </h2>
          <p data-reveal data-delay="2" className="text-zest/70 text-lg font-outfit leading-relaxed">
            Seja um dos primeiros a usar o Agristato. Quem entra na lista de espera recebe acesso prioritário e condições especiais de lançamento.
          </p>

          <div className="max-w-xl mx-auto">
            <EmailForm
              onSubmit={handleSubmitCta(onEmailSubmit)}
              isLoading={isLoading}
              errors={errorsCta}
              register={registerCta}
              variant="dark"
            />
          </div>

          <div className="flex items-center justify-center gap-3">
            {isLoadingCount ? (
              <div className="w-32 h-4 bg-white/10 rounded animate-pulse" />
            ) : (
              <p className="text-zest/60 text-sm font-outfit">
                <span className="font-bold text-lime text-lg font-domine">{userCount}</span>
                {" "}fazendas já garantiram seu lugar
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-moss border-t border-lime/20 py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-lime rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image src="/logo.svg" alt="Agristato" width={20} height={20} className="w-5 h-5" />
                </div>
                <span className="logo font-bold text-lg text-white tracking-tight">Agristato</span>
              </div>
              <p className="text-zest/50 text-sm leading-relaxed font-outfit max-w-xs">
                Plataforma de análise de solo e inteligência de mercado para agricultura de precisão.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-lime/10 border border-lime/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse" />
                <span className="text-lime text-xs font-outfit font-medium">Lançamento 3 Mai, 2026</span>
              </div>
            </div>

            {/* Platform */}
            <div className="space-y-4">
              <h4 className="text-white text-sm font-semibold font-outfit">Plataforma</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Análise de Solo", href: "#analise-solo" },
                  { label: "Radar de Cotação", href: "#radar" },
                  { label: "Por que Agristato", href: "#sobre" },
                  { label: "Lista de espera", href: "#lista-espera" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-zest/50 text-sm hover:text-zest/80 transition-colors font-outfit">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-white text-sm font-semibold font-outfit">Legal</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/privacy-policy" className="text-zest/50 text-sm hover:text-zest/80 transition-colors font-outfit">
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-zest/50 text-sm hover:text-zest/80 transition-colors font-outfit">Termos de Uso</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-zest/40 text-sm font-outfit">
              © 2026 Agristato. Todos os direitos reservados.
            </p>
            <p className="text-zest/30 text-xs font-outfit">
              Feito com precisão para o agronegócio brasileiro
            </p>
          </div>
        </div>
      </footer>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        onContinue={() => {
          setShowSuccessModal(false);
          setShowSurveyModal(true);
        }}
        userCount={userCount}
      />
      <SurveyModal
        isOpen={showSurveyModal}
        onClose={handleCloseSurveyModal}
        onComplete={handleSurveyComplete}
      />
      <ThankYouModal isOpen={showThankYouModal} onClose={handleCloseThankYouModal} />
      <DuplicateEmailModal
        isOpen={showDuplicateEmailModal}
        onClose={() => setShowDuplicateEmailModal(false)}
        email={duplicateEmail}
      />
    </div>
  );
}
