"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { auth, db } from "@/lib/firebase";

type ArtistRole =
  | "artista-formador"
  | "artista-quintaesencia"
  | "artista-colaborador"
  | "combinacion-roles"
  | "explorador-apreciador"
  | "otro-rol";

type ContributionOption =
  | "formador-talleres-mentorias"
  | "quintaesencia-exhibir-vender"
  | "colaborador-proyectos-especificos"
  | "formador-cursos-extensos"
  | "quintaesencia-exposiciones-mensuales"
  | "colaborador-contenido-puntual";

type AgreementOption =
  | "convenio-taller-mentoria"
  | "convenio-exhibicion-venta"
  | "convenio-colaboracion-puntual"
  | "convenio-mixto-mentoria-exposicion"
  | "convenio-solo-eventos"
  | "sin-convenio-suscripcion";

type ActivityOption =
  | "actividad-clases-talleres"
  | "actividad-galeria-exposiciones"
  | "actividad-colaboraciones-contenido"
  | "actividad-mentorías-personalizadas"
  | "actividad-ventas-largo-plazo"
  | "actividad-proyectos-puntuales";

type BenefitOption =
  | "beneficio-compartir-expertise"
  | "beneficio-visibilidad-ventas"
  | "beneficio-colaboraciones-esporadicas"
  | "beneficio-difusion-cursos"
  | "beneficio-exposicion-comunidad"
  | "beneficio-flexibilidad-proyectos";

type ArtisticFocusOption =
  | "enfoque-educacion-conocimiento"
  | "enfoque-creacion-exhibicion"
  | "enfoque-colaboraciones-temporales"
  | "enfoque-combinado-ensenanza-exposicion"
  | "enfoque-ventas-galerias"
  | "enfoque-flexible-eventos";

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const PALETTE = [
  "#FC5E33", // Naranja
  "#449EEE", // Azul claro
  "#DD43A8", // Rosa
  "#AB5CC9", // Morado
];

export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState<Step>(0);
  const [artistRole, setArtistRole] = useState<ArtistRole | null>(null);
  const [otherRole, setOtherRole] = useState("");
  const [contribution, setContribution] = useState<ContributionOption | null>(
    null,
  );
  const [agreement, setAgreement] = useState<AgreementOption | null>(null);
  const [activities, setActivities] = useState<ActivityOption[]>([]);
  const [benefits, setBenefits] = useState<BenefitOption[]>([]);
  const [artisticFocus, setArtisticFocus] =
    useState<ArtisticFocusOption | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/");
        return;
      }

      setUser(currentUser);
      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, [router]);

  function getArtistRoleLabel(role: ArtistRole | null) {
    if (role === "artista-formador") {
      return "Artista Formador";
    }
    if (role === "artista-quintaesencia") {
      return "Artista Quintaesencia";
    }
    if (role === "artista-colaborador") {
      return "Artista Colaborador";
    }
    if (role === "combinacion-roles") {
      return "Artista con combinación de roles";
    }
    if (role === "explorador-apreciador") {
      return "Apreciador y explorador de arte";
    }
    if (role === "otro-rol") {
      return "Artista con rol personalizado";
    }
    return "Artista de la comunidad";
  }

  function getArtisticFocusLabel(value: ArtisticFocusOption | null) {
    if (value === "enfoque-educacion-conocimiento") {
      return "educación y transmisión de conocimiento";
    }
    if (value === "enfoque-creacion-exhibicion") {
      return "creación y exhibición permanente";
    }
    if (value === "enfoque-colaboraciones-temporales") {
      return "colaboraciones temporales y específicas";
    }
    if (value === "enfoque-combinado-ensenanza-exposicion") {
      return "enseñanza combinada con exposición";
    }
    if (value === "enfoque-ventas-galerias") {
      return "ventas y presencia en galerías virtuales";
    }
    if (value === "enfoque-flexible-eventos") {
      return "flexibilidad para eventos y contenidos ad hoc";
    }
    return "";
  }

  function toggleActivity(option: ActivityOption) {
    setActivities((current) =>
      current.includes(option)
        ? current.filter((value) => value !== option)
        : [...current, option],
    );
  }

  function toggleBenefit(option: BenefitOption) {
    setBenefits((current) =>
      current.includes(option)
        ? current.filter((value) => value !== option)
        : [...current, option],
    );
  }

  function nextStep() {
    if (step === 0) {
      if (!artistRole) {
        setError("Elige el rol que mejor te describe.");
        return;
      }
      if (artistRole === "otro-rol" && !otherRole.trim()) {
        setError("Especifica tu otro rol para continuar.");
        return;
      }
    }

    if (step === 1 && !contribution) {
      setError("Elige cómo te gustaría contribuir.");
      return;
    }

    if (step === 2 && !agreement) {
      setError("Elige el tipo de convenio que te interesa.");
      return;
    }

    if (step === 3 && activities.length === 0) {
      setError("Elige al menos una actividad en la que te ves participando.");
      return;
    }

    if (step === 4 && benefits.length === 0) {
      setError("Elige al menos un beneficio que estés buscando.");
      return;
    }

    if (step === 5 && !artisticFocus) {
      setError("Elige tu enfoque artístico.");
      return;
    }

    setError("");
    setStep((current) => (current < 6 ? ((current + 1) as Step) : current));
  }

  function previousStep() {
    setError("");
    setStep((current) => (current > 0 ? ((current - 1) as Step) : current));
  }

  async function handleSave() {
    if (!user) {
      setError("No se encontró usuario autenticado.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await setDoc(
        doc(db, "userProfiles", user.uid),
        {
          artistRole,
          artistRoleOther:
            artistRole === "otro-rol" ? otherRole.trim() || null : null,
          primaryContribution: contribution,
          agreementPreference: agreement,
          activeActivities: activities,
          desiredBenefits: benefits,
          artisticFocus,
          onboardingCompleted: true,
        },
        { merge: true },
      );

      setSuccess("Gracias, tu perfil ha sido guardado correctamente.");
    } catch (errorObject) {
      console.error("Error al guardar el onboarding:", errorObject);
      setError("No pudimos guardar tus respuestas. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  const isFirstStep = step === 0;
  const isLastStep = step === 6;

  const getColor = (index: number) => PALETTE[index % PALETTE.length];

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EAEAEA]">
        <p className="text-sm text-[#222C47]/50">Cargando tu experiencia...</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen flex-col bg-[#EAEAEA] text-[#222C47] overflow-hidden font-sans selection:bg-[#222C47] selection:text-white">
      {/* Stories-like Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 flex gap-1.5 p-4 sm:p-6">
        {[0, 1, 2, 3, 4, 5, 6].map((s) => (
          <div key={s} className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#222C47]/10 backdrop-blur-sm">
            <div
              className={`h-full transition-all duration-500 ease-out ${
                s <= step ? "w-full" : "w-0"
              }`}
              style={{ backgroundColor: s <= step ? getColor(s) : 'transparent' }}
            />
          </div>
        ))}
      </div>

      {/* Main Content Area - Full Screen Centered */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 relative z-10 w-full max-w-7xl mx-auto h-full pb-20 pt-10">
          
          {/* Animated Container for Steps */}
          <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
              
              {step === 0 && (
                <div className="space-y-6 text-center md:text-left h-full flex flex-col justify-center">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#222C47] leading-[0.9]">
                    ¿Cuál rol te <br/><span className="opacity-50">describe mejor</span>?
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { id: "artista-formador", label: "Artista Formador", desc: "Quiero impartir talleres." },
                      { id: "artista-quintaesencia", label: "Artista Quintaesencia", desc: "Parte activa de la galería." },
                      { id: "artista-colaborador", label: "Artista Colaborador", desc: "Eventos puntuales." },
                      { id: "combinacion-roles", label: "Combinación de roles", desc: "Formador, colaborador..." },
                      { id: "explorador-apreciador", label: "Apreciador / Explorador", desc: "Solo exploro." },
                      { id: "otro-rol", label: "Otro rol", desc: "Mentor, coleccionista..." }
                    ].map((option, index) => {
                      const color = getColor(index);
                      const isSelected = artistRole === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setArtistRole(option.id as ArtistRole)}
                          style={
                            {
                              backgroundColor: isSelected ? color : undefined,
                              borderColor: isSelected ? color : undefined,
                              color: isSelected ? "white" : "#222C47",
                              boxShadow: isSelected
                                ? `0 16px 40px -16px ${color}99`
                                : "0 8px 20px -12px rgba(0, 0, 0, 0.12)",
                              animationDelay: `${index * 50}ms`,
                              "--theme-color": color,
                            } as CSSProperties & { ["--theme-color"]?: string }
                          }
                          className={`
                            group relative flex flex-col items-start justify-center px-3.5 py-2.5 md:px-4 md:py-3 rounded-2xl transition-all duration-150 border-2
                            bg-white/80 border-[#222C47]/5 backdrop-blur-sm shadow-sm
                            hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]
                            animate-in fade-in zoom-in-50 fill-mode-backwards
                            hover:border-[var(--theme-color)]
                          `}
                        >
                          <span
                            className={`text-sm md:text-base font-bold tracking-tight mb-0.5 text-left leading-tight group-hover:text-[var(--theme-color)] transition-colors ${isSelected ? "!text-white" : ""}`}
                          >
                            {option.label}
                          </span>
                          <span
                            className={`text-[11px] md:text-xs font-medium text-left leading-tight opacity-80 group-hover:opacity-100 ${isSelected ? "text-white/90" : "text-[#222C47]/60"}`}
                          >
                            {option.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {artistRole === "otro-rol" && (
                    <input
                      type="text"
                      value={otherRole}
                      onChange={(event) => setOtherRole(event.target.value)}
                      className="w-full text-xl md:text-2xl font-bold bg-transparent border-b-2 border-[#222C47]/30 focus:border-[#222C47] outline-none py-2 placeholder:text-[#222C47]/30 transition-colors text-[#222C47]"
                      placeholder="Escribe tu rol aquí..."
                      autoFocus
                    />
                  )}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6 text-center md:text-left h-full flex flex-col justify-center">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#222C47] leading-[0.9]">
                    ¿Cómo quieres <br/><span className="opacity-50">contribuir</span>?
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                     {[
                        { id: "formador-talleres-mentorias", label: "Compartir", desc: "Talleres y mentorías." },
                        { id: "quintaesencia-exhibir-vender", label: "Exhibir", desc: "Galería virtual." },
                        { id: "colaborador-proyectos-especificos", label: "Colaborar", desc: "Proyectos específicos." },
                        { id: "formador-cursos-extensos", label: "Formar", desc: "Cursos extensos." },
                        { id: "quintaesencia-exposiciones-mensuales", label: "Vender", desc: "Exposiciones mensuales." },
                        { id: "colaborador-contenido-puntual", label: "Crear", desc: "Redes o eventos." }
                      ].map((option, index) => {
                        const color = getColor(index);
                        const isSelected = contribution === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              setContribution(option.id as ContributionOption)
                            }
                            style={
                              {
                                backgroundColor: isSelected ? color : undefined,
                                borderColor: isSelected ? color : undefined,
                                color: isSelected ? "white" : "#222C47",
                                boxShadow: isSelected
                                  ? `0 16px 40px -16px ${color}99`
                                  : "0 8px 20px -12px rgba(0, 0, 0, 0.12)",
                                animationDelay: `${index * 50}ms`,
                                "--theme-color": color,
                              } as CSSProperties & {
                                ["--theme-color"]?: string;
                              }
                            }
                            className={`
                              group relative flex flex-col items-start justify-center px-3.5 py-2.5 md:px-4 md:py-3 rounded-2xl transition-all duration-150 border-2
                            bg-white/80 border-[#222C47]/5 backdrop-blur-sm shadow-sm
                              hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]
                              animate-in fade-in zoom-in-50 fill-mode-backwards
                              hover:border-[var(--theme-color)]
                            `}
                          >
                            <span
                              className={`text-sm md:text-base font-bold tracking-tight mb-0.5 text-left leading-tight group-hover:text-[var(--theme-color)] transition-colors ${isSelected ? "!text-white" : ""}`}
                            >
                              {option.label}
                            </span>
                            <span
                              className={`text-[11px] md:text-xs font-medium text-left leading-tight opacity-80 group-hover:opacity-100 ${isSelected ? "text-white/90" : "text-[#222C47]/60"}`}
                            >
                              {option.desc}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 text-center md:text-left h-full flex flex-col justify-center">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#222C47] leading-[0.9]">
                    Elige tu tipo de <br/><span className="opacity-50">convenio</span>
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                     {[
                        { id: "convenio-taller-mentoria", label: "Taller / Mentoría", desc: "Ideal para formadores." },
                        { id: "convenio-exhibicion-venta", label: "Exhibición / Venta", desc: "Obras físicas/digitales." },
                        { id: "convenio-colaboracion-puntual", label: "Colaboración", desc: "Proyectos puntuales." },
                        { id: "convenio-mixto-mentoria-exposicion", label: "Mixto", desc: "Formación + Galería." },
                        { id: "convenio-solo-eventos", label: "Solo Eventos", desc: "Presenciales/virtuales." },
                        { id: "sin-convenio-suscripcion", label: "Sin convenio", desc: "Solo explorar." }
                      ].map((option, index) => {
                        const color = getColor(index);
                        const isSelected = agreement === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              setAgreement(option.id as AgreementOption)
                            }
                            style={
                              {
                                backgroundColor: isSelected ? color : undefined,
                                borderColor: isSelected ? color : undefined,
                                color: isSelected ? "white" : "#222C47",
                                boxShadow: isSelected
                                  ? `0 16px 40px -16px ${color}99`
                                  : "0 8px 20px -12px rgba(0, 0, 0, 0.12)",
                                animationDelay: `${index * 50}ms`,
                                "--theme-color": color,
                              } as CSSProperties & {
                                ["--theme-color"]?: string;
                              }
                            }
                            className={`
                              group relative flex flex-col items-start justify-center px-3.5 py-2.5 md:px-4 md:py-3 rounded-2xl transition-all duration-150 border-2
                            bg-white/80 border-[#222C47]/5 backdrop-blur-sm shadow-sm
                              hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]
                              animate-in fade-in zoom-in-50 fill-mode-backwards
                              hover:border-[var(--theme-color)]
                            `}
                          >
                            <span
                              className={`text-sm md:text-base font-bold tracking-tight mb-0.5 text-left leading-tight group-hover:text-[var(--theme-color)] transition-colors ${isSelected ? "!text-white" : ""}`}
                            >
                              {option.label}
                            </span>
                            <span
                              className={`text-[11px] md:text-xs font-medium text-left leading-tight opacity-80 group-hover:opacity-100 ${isSelected ? "text-white/90" : "text-[#222C47]/60"}`}
                            >
                              {option.desc}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 text-center md:text-left h-full flex flex-col justify-center">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#222C47] leading-[0.9]">
                    Actividades de <br/><span className="opacity-50">interés</span>
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { id: "actividad-clases-talleres", label: "Impartir clases" },
                      { id: "actividad-galeria-exposiciones", label: "Exposiciones" },
                      { id: "actividad-colaboraciones-contenido", label: "Colaboraciones" },
                      { id: "actividad-mentorías-personalizadas", label: "Mentorías" },
                      { id: "actividad-ventas-largo-plazo", label: "Ventas" },
                      { id: "actividad-proyectos-puntuales", label: "Proyectos" }
                    ].map((option, index) => {
                      const color = getColor(index);
                      const isSelected = activities.includes(
                        option.id as ActivityOption,
                      );
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            toggleActivity(option.id as ActivityOption)
                          }
                          style={
                            {
                              backgroundColor: isSelected ? color : undefined,
                              borderColor: isSelected ? color : undefined,
                              color: isSelected ? "white" : "#222C47",
                              boxShadow: isSelected
                                ? `0 16px 40px -16px ${color}99`
                                : "0 8px 20px -12px rgba(0, 0, 0, 0.12)",
                              animationDelay: `${index * 50}ms`,
                              "--theme-color": color,
                            } as CSSProperties & {
                              ["--theme-color"]?: string;
                            }
                          }
                          className={`
                            group relative rounded-2xl px-3.5 py-2.5 md:px-4 md:py-3 text-sm md:text-base font-bold transition-all duration-300 border-2 flex items-center justify-center text-center
                            bg-white/80 border-[#222C47]/5 backdrop-blur-sm shadow-sm
                            hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]
                            animate-in fade-in zoom-in-50 fill-mode-backwards
                            hover:border-[var(--theme-color)]
                          `}
                        >
                          <span
                            className={`group-hover:text-[var(--theme-color)] transition-colors ${isSelected ? "!text-white" : ""}`}
                          >
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 4 && (
                 <div className="space-y-6 text-center md:text-left h-full flex flex-col justify-center">
                   <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#222C47] leading-[0.9]">
                     Define tus <br/><span className="opacity-50">beneficios</span>
                   </h2>
                   <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        { id: "beneficio-compartir-expertise", label: "Expertise", desc: "Enseñar a otros." },
                        { id: "beneficio-visibilidad-ventas", label: "Visibilidad", desc: "Llegar a más." },
                        { id: "beneficio-colaboraciones-esporadicas", label: "Colaborar", desc: "Proyectos." },
                        { id: "beneficio-difusion-cursos", label: "Difusión", desc: "Promocionar." },
                        { id: "beneficio-exposicion-comunidad", label: "Exposición", desc: "Networking." },
                        { id: "beneficio-flexibilidad-proyectos", label: "Flexibilidad", desc: "A medida." }
                      ].map((option, index) => {
                        const color = getColor(index);
                        const isSelected = benefits.includes(
                          option.id as BenefitOption,
                        );
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              toggleBenefit(option.id as BenefitOption)
                            }
                            style={
                              {
                                backgroundColor: isSelected ? color : undefined,
                                borderColor: isSelected ? color : undefined,
                                color: isSelected ? "white" : "#222C47",
                                boxShadow: isSelected
                                  ? `0 16px 40px -16px ${color}99`
                                  : "0 8px 20px -12px rgba(0, 0, 0, 0.12)",
                                animationDelay: `${index * 50}ms`,
                                "--theme-color": color,
                              } as CSSProperties & {
                                ["--theme-color"]?: string;
                              }
                            }
                            className={`
                              group relative flex flex-col items-start justify-center px-3.5 py-2.5 md:px-4 md:py-3 rounded-2xl transition-all duration-150 border-2
                            bg-white/80 border-[#222C47]/5 backdrop-blur-sm shadow-sm
                              hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]
                              animate-in fade-in zoom-in-50 fill-mode-backwards
                              hover:border-[var(--theme-color)]
                            `}
                          >
                            <div className="flex w-full justify-between items-center mb-0.5">
                              <span
                                className={`text-sm md:text-base font-bold tracking-tight text-left leading-tight group-hover:text-[var(--theme-color)] transition-colors ${isSelected ? "!text-white" : ""}`}
                              >
                                {option.label}
                              </span>
                              {isSelected && (
                                <svg
                                  className="w-5 h-5 text-white flex-shrink-0 ml-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                            <span
                              className={`text-[11px] md:text-xs font-medium text-left leading-tight opacity-80 group-hover:opacity-100 ${isSelected ? "text-white/90" : "text-[#222C47]/60"}`}
                            >
                              {option.desc}
                            </span>
                          </button>
                        );
                      })}
                   </div>
                 </div>
              )}

              {step === 5 && (
                <div className="space-y-6 text-center md:text-left h-full flex flex-col justify-center">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#222C47] leading-[0.9]">
                    Tu enfoque <br/><span className="opacity-50">artístico</span>
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                     {[
                        { id: "enfoque-educacion-conocimiento", label: "Educación", desc: "Dominio técnico." },
                        { id: "enfoque-creacion-exhibicion", label: "Creación", desc: "Exploración nuevas ideas." },
                        { id: "enfoque-colaboraciones-temporales", label: "Colaboración", desc: "Arte para el cambio." },
                        { id: "enfoque-combinado-ensenanza-exposicion", label: "Mixto", desc: "Ventas y tendencias." },
                        { id: "enfoque-ventas-galerias", label: "Ventas", desc: "Enseñanza y transmisión." },
                        { id: "enfoque-flexible-eventos", label: "Flexible", desc: "Adaptable a todo." }
                      ].map((option, index) => {
                        const color = getColor(index);
                        const isSelected = artisticFocus === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              setArtisticFocus(option.id as ArtisticFocusOption)
                            }
                            style={
                              {
                                backgroundColor: isSelected ? color : undefined,
                                borderColor: isSelected ? color : undefined,
                                color: isSelected ? "white" : "#222C47",
                                boxShadow: isSelected
                                  ? `0 16px 40px -16px ${color}99`
                                  : "0 8px 20px -12px rgba(0, 0, 0, 0.12)",
                                animationDelay: `${index * 50}ms`,
                                "--theme-color": color,
                              } as CSSProperties & {
                                ["--theme-color"]?: string;
                              }
                            }
                            className={`
                              group relative flex flex-col items-start justify-center px-3.5 py-2.5 md:px-4 md:py-3 rounded-2xl transition-all duration-150 border-2
                              bg-white/80 border-[#222C47]/5 backdrop-blur-sm shadow-sm
                              hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]
                              animate-in fade-in zoom-in-50 fill-mode-backwards
                              hover:border-[var(--theme-color)]
                            `}
                          >
                            <span
                              className={`text-sm md:text-base font-bold tracking-tight mb-0.5 text-left leading-tight group-hover:text-[var(--theme-color)] transition-colors ${isSelected ? "!text-white" : ""}`}
                            >
                              {option.label}
                            </span>
                            <span
                              className={`text-[11px] md:text-xs font-medium text-left leading-tight opacity-80 group-hover:opacity-100 ${isSelected ? "text-white/90" : "text-[#222C47]/60"}`}
                            >
                              {option.desc}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="flex flex-col items-center justify-center text-center animate-in zoom-in duration-700 h-full relative z-10">
                    {/* Background Elements */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none opacity-20">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FC5E33] rounded-full blur-[100px] animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#449EEE] rounded-full blur-[100px] animate-pulse delay-700"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#DD43A8] rounded-full blur-[100px] animate-pulse delay-300"></div>
                    </div>

                    <div className="relative z-10 w-full max-w-2xl">
                        <div className="mb-8 md:mb-12">
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#222C47]/50 mb-2">Tu Perfil Digital</p>
                            <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-[#222C47] leading-[0.9] mb-4">
                              {getArtistRoleLabel(artistRole)}
                            </h2>
                            <div className="h-1 w-24 bg-[#222C47] mx-auto rounded-full"></div>
                        </div>

                        <div className="space-y-8 md:space-y-12">
                            <div>
                                <p className="text-xl md:text-3xl font-medium text-[#222C47] leading-tight max-w-xl mx-auto">
                                  Tu enfoque se centra en <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#AB5CC9] to-[#DD43A8]">{getArtisticFocusLabel(artisticFocus) || "la creatividad"}</span>.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-lg mx-auto">
                                <div className="text-center p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-[#222C47]/5">
                                    <p className="text-[10px] md:text-xs text-[#222C47]/50 uppercase font-bold tracking-wider mb-2">Tu Aporte</p>
                                    <p className="font-bold text-[#222C47] text-base md:text-lg leading-tight capitalize">
                                        {contribution?.replace(/-/g, " ") || "N/A"}
                                    </p>
                                </div>
                                <div className="text-center p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-[#222C47]/5">
                                    <p className="text-[10px] md:text-xs text-[#222C47]/50 uppercase font-bold tracking-wider mb-2">Buscas</p>
                                    <p className="font-bold text-[#222C47] text-base md:text-lg leading-tight capitalize">
                                      {benefits.length > 0 
                                        ? benefits[0].replace("beneficio-", "").replace(/-/g, " ")
                                        : "N/A"}
                                    </p>
                                    {benefits.length > 1 && (
                                        <p className="text-xs text-[#222C47]/40 font-medium mt-1">
                                            y {benefits.length - 1} más
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-xs mx-auto mt-12 relative z-20">
                        <button
                          type="button"
                          onClick={handleSave}
                          disabled={saving}
                          className="w-full rounded-full bg-[#222C47] px-7 py-3 text-base md:text-lg font-bold text-white shadow-lg hover:bg-[#1a2136] hover:scale-[1.03] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                          {saving ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Guardando...
                              </>
                          ) : (
                              <>
                                Confirmar Perfil
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              </>
                          )}
                        </button>
                        <button
                           type="button"
                           onClick={previousStep}
                           disabled={saving}
                           className="text-sm font-medium text-[#222C47]/50 hover:text-[#222C47] transition-colors py-2"
                        >
                          Volver a editar
                        </button>
                    </div>
                </div>
              )}
          </div>

          {/* Navigation Controls (Bottom) */}
          {step !== 6 && (
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#EAEAEA] via-[#EAEAEA]/80 to-transparent z-40 flex justify-between items-center max-w-7xl mx-auto w-full pointer-events-none">
               <button
                  type="button"
                  onClick={previousStep}
                  disabled={isFirstStep || saving}
                  className={`pointer-events-auto flex items-center justify-center w-12 h-12 rounded-full bg-white border border-[#222C47]/10 text-[#222C47] hover:bg-[#EAEAEA] transition-all shadow-sm ${isFirstStep ? "opacity-0" : "opacity-100"}`}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
               </button>

               {!isLastStep && (
                 <button
                    type="button"
                    onClick={nextStep}
                    disabled={saving}
                    className="pointer-events-auto flex items-center gap-2 rounded-full bg-[#222C47] px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-[#1a2136] hover:scale-105 transition-all disabled:cursor-not-allowed disabled:bg-[#222C47]/50"
                 >
                    Siguiente
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                 </button>
               )}
            </div>
          )}
      </div>
    </div>
  );
}
