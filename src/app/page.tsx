"use client";

import { SuccessModal } from "@/components/SuccessModal";
import { SurveyModal } from "@/components/SurveyModal";
import { ThankYouModal } from "@/components/ThankYouModal";
import { api } from "@/lib/api";
import { EmailFormData, emailSchema, SurveyFormData } from "@/lib/validations";
import { User } from "@/types/survey";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userCount, setUserCount] = useState(0);
  const [isLoadingCount, setIsLoadingCount] = useState(true);

  const updateUserCount = async () => {
    try {
      setIsLoadingCount(true);
      const count = await api.getUserCount();
      setUserCount(count + 189);
    } catch (error) {
      console.error("Error updating user count:", error);

      setUserCount(189);
    } finally {
      setIsLoadingCount(false);
    }
  };

  useEffect(() => {
    updateUserCount();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const onEmailSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      const user = await api.createUser(data.email);
      if (user) {
        setCurrentUser(user);
        setShowSuccessModal(true);
        reset();
      }
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setCurrentUser(null);
    reset();
    updateUserCount();
  };

  const handleCloseSurveyModal = () => {
    setShowSurveyModal(false);
    setCurrentUser(null);
    reset();
    updateUserCount();
  };

  const handleCloseThankYouModal = () => {
    setShowThankYouModal(false);
    setCurrentUser(null);
    reset();
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

  return (
    <div className="min-h-screen w-full relative bg-Background-Base overflow-hidden">
      <Image
        className="absolute inset-0 w-full h-full object-cover"
        src="/background.jpg"
        alt="Background"
        fill
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white/0" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="w-full p-4 md:p-8 lg:p-12">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <Image
                src="/logo.svg"
                alt="Agristato Logo"
                width={50}
                height={50}
                className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
              />
            </div>
            <div className="text-green-700 text-xl md:text-2xl lg:text-4xl font-bold font-sen">
              Agristato
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-4xl lg:max-w-7xl bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-20 flex flex-col lg:flex-row gap-6 lg:gap-20 items-center">
            <div className="flex-1 w-full space-y-4 md:space-y-6 lg:space-y-12">
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-700/10 rounded-full">
                <span className="text-green-700 text-sm md:text-base font-bold font-outfit">
                  LANÇAMENTO
                </span>
                <div className="w-1 h-1 bg-green-700 rounded-full" />
                <span className="text-green-700 text-sm md:text-base font-bold font-outfit">
                  3 OUT, 2025
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold font-domine leading-tight">
                  <span className="text-black">Transforme dados do solo em decisões </span>
                  <span className="text-green-700">inteligentes</span>
                </h1>

                <p className="text-base md:text-lg lg:text-xl font-outfit leading-relaxed text-gray-600">
                  Revolucione o manejo da sua fazenda com cálculos automáticos de{" "}
                  <span className="font-semibold text-black">balanço de nutrientes</span> e{" "}
                  <span className="font-semibold text-black">dosagens precisas</span> de
                  fertilizantes.
                </p>
              </div>

              {/* Formulário */}
              <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-100 rounded-lg">
                    <svg
                      className="w-4 h-4 text-gray-400 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="matheus@agristato.com"
                      className="flex-1 bg-transparent border-none outline-none text-black text-sm md:text-base font-outfit min-w-0"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 md:px-6 py-3 bg-green-700 text-white text-sm md:text-base font-semibold font-outfit rounded-lg hover:bg-green-800 transition-colors whitespace-nowrap disabled:opacity-50"
                  >
                    {isLoading ? "Carregando..." : "Entrar na lista de espera"}
                  </button>
                </div>

                {errors.email && (
                  <p className="text-red-500 text-sm font-outfit text-center">
                    {errors.email.message}
                  </p>
                )}

                <p className="text-xs text-gray-500 font-outfit text-center">
                  Ao clicar em &quot;Entrar na lista de espera&quot; você concorda com a nossa{" "}
                  <Link href="/privacy-policy" className="text-green-700 underline cursor-pointer">
                    Política de Privacidade
                  </Link>
                </p>
              </form>

              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold font-domine text-green-700">
                  {isLoadingCount ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 border-4 border-green-200 border-t-green-700"></div>
                    </div>
                  ) : (
                    userCount
                  )}
                </div>
                <div className="text-base md:text-lg lg:text-2xl text-gray-600 font-outfit">
                  Fazendas na lista de espera
                </div>
              </div>
            </div>

            <div className="hidden lg:flex flex-1">
              <Image
                className="w-full object-cover rounded-2xl shadow-[0px_2px_8px_0px_rgba(0,0,0,0.15)]"
                src="/example.png"
                alt="Agristato Dashboard"
                width={599}
                height={374}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
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
    </div>
  );
}
