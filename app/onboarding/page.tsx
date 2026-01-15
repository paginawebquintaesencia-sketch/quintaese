"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-neutral-500">Cargando tu experiencia...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className={`w-full ${step === 6 ? "" : "max-w-md"}`}>
        <div className="space-y-6 fade-slide">
          {step !== 6 && (
            <div className="mb-2 text-center">
            <div className="flex justify-center">
              <Image
                src="/logo.png"
                alt="Logo Quintaesencia"
                width={220}
                height={70}
                priority
              />
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-neutral-900">
              Queremos conocerte mejor
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Responde algunas preguntas rápidas para personalizar tu experiencia.
            </p>
            </div>
          )}

          {step !== 6 && (
            <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
              <span
                className={`h-1.5 w-6 rounded-full ${
                  step >= 0 ? "bg-neutral-900" : "bg-neutral-200"
                }`}
              />
              <span
                className={`h-1.5 w-6 rounded-full ${
                  step >= 1 ? "bg-neutral-900" : "bg-neutral-200"
                }`}
              />
              <span
                className={`h-1.5 w-6 rounded-full ${
                  step >= 2 ? "bg-neutral-900" : "bg-neutral-200"
                }`}
              />
              <span
                className={`h-1.5 w-6 rounded-full ${
                  step >= 3 ? "bg-neutral-900" : "bg-neutral-200"
                }`}
              />
              <span
                className={`h-1.5 w-6 rounded-full ${
                  step >= 4 ? "bg-neutral-900" : "bg-neutral-200"
                }`}
              />
              <span
                className={`h-1.5 w-6 rounded-full ${
                  step >= 5 ? "bg-neutral-900" : "bg-neutral-200"
                }`}
              />
              <span
                className={`h-1.5 w-6 rounded-full ${
                  step >= 6 ? "bg-neutral-900" : "bg-neutral-200"
                }`}
              />
            </div>
          )}

          <div className="space-y-6 rounded-3xl border border-neutral-100 bg-white p-5 shadow-sm">
              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-neutral-900">
                    ¿Cuál rol te describe mejor como artista en Quintaesencia?
                  </h2>
                  <div className="grid gap-2">
                    <button
                      type="button"
                      onClick={() => setArtistRole("artista-formador")}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        artistRole === "artista-formador"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Artista Formador</span>
                      <span className="text-[10px] text-neutral-400">
                        Quiero impartir talleres, clases o cursos.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setArtistRole("artista-quintaesencia")}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        artistRole === "artista-quintaesencia"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Artista Quintaesencia</span>
                      <span className="text-[10px] text-neutral-400">
                        Deseo formar parte activa de la galería y exposiciones.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setArtistRole("artista-colaborador")}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        artistRole === "artista-colaborador"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Artista Colaborador</span>
                      <span className="text-[10px] text-neutral-400">
                        Prefiero participar en eventos o contenidos puntuales.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setArtistRole("combinacion-roles")}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        artistRole === "combinacion-roles"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Combinación de roles</span>
                      <span className="text-[10px] text-neutral-400">
                        Por ejemplo, formador y colaborador.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setArtistRole("explorador-apreciador")}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        artistRole === "explorador-apreciador"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Apreciador / Explorador</span>
                      <span className="text-[10px] text-neutral-400">
                        Solo exploro como apreciador por ahora.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setArtistRole("otro-rol")}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        artistRole === "otro-rol"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Otro rol</span>
                      <span className="text-[10px] text-neutral-400">
                        Por ejemplo, mentor o coleccionista.
                      </span>
                    </button>
                  </div>
                  {artistRole === "otro-rol" && (
                    <div className="pt-2">
                      <input
                        type="text"
                        value={otherRole}
                        onChange={(event) => setOtherRole(event.target.value)}
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/60"
                        placeholder="Especifica tu rol (mentor, coleccionista, etc.)"
                      />
                    </div>
                  )}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-neutral-900">
                    ¿Cómo te gustaría contribuir principalmente a la comunidad?
                  </h2>
                  <div className="grid gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setContribution("formador-talleres-mentorias")
                      }
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        contribution === "formador-talleres-mentorias"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Compartiendo conocimiento</span>
                      <span className="text-[10px] text-neutral-400">
                        A través de talleres y mentorías.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setContribution("quintaesencia-exhibir-vender")
                      }
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        contribution === "quintaesencia-exhibir-vender"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Exhibiendo y vendiendo obras</span>
                      <span className="text-[10px] text-neutral-400">
                        En la galería virtual.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setContribution("colaborador-proyectos-especificos")
                      }
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        contribution === "colaborador-proyectos-especificos"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Colaborando puntualmente</span>
                      <span className="text-[10px] text-neutral-400">
                        En proyectos o eventos específicos.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setContribution("formador-cursos-extensos")
                      }
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        contribution === "formador-cursos-extensos"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Cursos y sesiones personalizadas</span>
                      <span className="text-[10px] text-neutral-400">
                        Ofreciendo procesos formativos más profundos.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setContribution("quintaesencia-exposiciones-mensuales")
                      }
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        contribution === "quintaesencia-exposiciones-mensuales"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Exposiciones y ventas continuas</span>
                      <span className="text-[10px] text-neutral-400">
                        Participando en exposiciones mensuales.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setContribution("colaborador-contenido-puntual")
                      }
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        contribution === "colaborador-contenido-puntual"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Creando contenido puntual</span>
                      <span className="text-[10px] text-neutral-400">
                        Para redes o eventos específicos.
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-neutral-900">
                    ¿Qué tipo de convenio te interesa más para unirte?
                  </h2>
                  <div className="grid gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setAgreement("convenio-taller-mentoria")
                      }
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        agreement === "convenio-taller-mentoria"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Por taller o mentoría</span>
                      <span className="text-[10px] text-neutral-400">
                        Ideal para artistas formadores.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAgreement("convenio-exhibicion-venta")
                      }
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        agreement === "convenio-exhibicion-venta"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Por exhibición y venta</span>
                      <span className="text-[10px] text-neutral-400">
                        De obras físicas o digitales por 3-12 meses.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAgreement("convenio-colaboracion-puntual")
                      }
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        agreement === "convenio-colaboracion-puntual"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Colaboración puntual</span>
                      <span className="text-[10px] text-neutral-400">
                        En contenidos o proyectos específicos.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAgreement("convenio-mixto-mentoria-exposicion")
                      }
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        agreement === "convenio-mixto-mentoria-exposicion"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Mezcla de mentoría y exposición</span>
                      <span className="text-[10px] text-neutral-400">
                        Combina formación y presencia en galería.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAgreement("convenio-solo-eventos")
                      }
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        agreement === "convenio-solo-eventos"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Solo eventos</span>
                      <span className="text-[10px] text-neutral-400">
                        Presenciales o virtuales.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAgreement("sin-convenio-suscripcion")
                      }
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        agreement === "sin-convenio-suscripcion"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Sin convenio por ahora</span>
                      <span className="text-[10px] text-neutral-400">
                        Prefiero suscribirme primero y explorar opciones.
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-neutral-900">
                    ¿En qué actividades te ves participando activamente?
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Puedes elegir una o varias opciones.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleActivity("actividad-clases-talleres")}
                      className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                        activities.includes("actividad-clases-talleres")
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      Impartiendo clases o talleres
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        toggleActivity("actividad-galeria-exposiciones")
                      }
                      className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                        activities.includes("actividad-galeria-exposiciones")
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      Galería virtual y exposiciones mensuales
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        toggleActivity("actividad-colaboraciones-contenido")
                      }
                      className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                        activities.includes("actividad-colaboraciones-contenido")
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      Colaborando en eventos o contenidos
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        toggleActivity("actividad-mentorías-personalizadas")
                      }
                      className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                        activities.includes("actividad-mentorías-personalizadas")
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      Mentorías personalizadas y pedidos
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        toggleActivity("actividad-ventas-largo-plazo")
                      }
                      className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                        activities.includes("actividad-ventas-largo-plazo")
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      Ventas con contratos a largo plazo
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        toggleActivity("actividad-proyectos-puntuales")
                      }
                      className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                        activities.includes("actividad-proyectos-puntuales")
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      Proyectos creativos puntuales
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-neutral-900">
                    ¿Qué beneficios buscas al unirte como artista?
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Puedes elegir una o varias opciones.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        toggleBenefit("beneficio-compartir-expertise")
                      }
                      className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                        benefits.includes("beneficio-compartir-expertise")
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      Compartir mi expertise enseñando
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        toggleBenefit("beneficio-visibilidad-ventas")
                      }
                      className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                        benefits.includes("beneficio-visibilidad-ventas")
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      Visibilidad y ventas continuas
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        toggleBenefit("beneficio-colaboraciones-esporadicas")
                      }
                      className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                        benefits.includes("beneficio-colaboraciones-esporadicas")
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      Colaboraciones esporádicas en eventos
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        toggleBenefit("beneficio-difusion-cursos")
                      }
                      className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                        benefits.includes("beneficio-difusion-cursos")
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      Difusión de cursos y talleres
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        toggleBenefit("beneficio-exposicion-comunidad")
                      }
                      className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                        benefits.includes("beneficio-exposicion-comunidad")
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      Exposición mensual y comunidad activa
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        toggleBenefit("beneficio-flexibilidad-proyectos")
                      }
                      className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                        benefits.includes("beneficio-flexibilidad-proyectos")
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      Flexibilidad para proyectos puntuales
                    </button>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-neutral-900">
                    ¿Cómo describirías tu enfoque artístico en relación a los roles?
                  </h2>
                  <div className="grid gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setArtisticFocus("enfoque-educacion-conocimiento")
                      }
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        artisticFocus === "enfoque-educacion-conocimiento"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Educación y transmisión de conocimiento</span>
                      <span className="text-[10px] text-neutral-400">
                        Enfoque en talleres, cursos y mentorías.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setArtisticFocus("enfoque-creacion-exhibicion")
                      }
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        artisticFocus === "enfoque-creacion-exhibicion"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Creación y exhibición permanente</span>
                      <span className="text-[10px] text-neutral-400">
                        Centrado en obras y presencia en galería.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setArtisticFocus("enfoque-colaboraciones-temporales")
                      }
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        artisticFocus === "enfoque-colaboraciones-temporales"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Colaboraciones temporales y específicas</span>
                      <span className="text-[10px] text-neutral-400">
                        Más orientado a proyectos puntuales.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setArtisticFocus("enfoque-combinado-ensenanza-exposicion")
                      }
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        artisticFocus === "enfoque-combinado-ensenanza-exposicion"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Combinado: enseñanza y exposición</span>
                      <span className="text-[10px] text-neutral-400">
                        Mezcla de formación y exhibición.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setArtisticFocus("enfoque-ventas-galerias")
                      }
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        artisticFocus === "enfoque-ventas-galerias"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Principalmente ventas y galerías</span>
                      <span className="text-[10px] text-neutral-400">
                        Enfoque en comercialización y presencia digital.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setArtisticFocus("enfoque-flexible-eventos")
                      }
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition ${
                        artisticFocus === "enfoque-flexible-eventos"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <span>Flexible para eventos y contenidos</span>
                      <span className="text-[10px] text-neutral-400">
                        Adaptable a proyectos y colaboraciones ad hoc.
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-neutral-900">
                    Tu perfil en Quintaesencia
                  </h2>
                  <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-6 text-center">
                    <p className="text-sm font-medium text-neutral-900">
                      ¡Todo listo!
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-neutral-700">
                      {`Según tus respuestas, te identificamos como `}
                      <span className="font-bold text-neutral-900">{getArtistRoleLabel(artistRole)}</span>
                      {getArtisticFocusLabel(artisticFocus) && (
                        <>
                          {` con enfoque en `}
                          <span className="font-bold text-neutral-900">{getArtisticFocusLabel(artisticFocus)}</span>
                        </>
                      )}
                      {`.`}
                    </p>
                    <p className="mt-4 text-[10px] text-neutral-500">
                      Hemos personalizado tu experiencia en la plataforma basándonos en este perfil.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert variant="success">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={previousStep}
                disabled={isFirstStep || saving}
                className="text-xs text-neutral-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isFirstStep ? "" : "Atrás"}
              </button>

              <div className="flex gap-2">
                {!isLastStep && (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={saving}
                    className="primary-button rounded-full bg-neutral-900 px-5 py-2 text-xs font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-neutral-700"
                  >
                    Siguiente
                  </button>
                )}

                {isLastStep && (
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="primary-button rounded-full bg-neutral-900 px-5 py-2 text-xs font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-neutral-700"
                  >
                    {saving ? "Guardando..." : "Guardar mi perfil"}
                  </button>
                )}
              </div>
            </div>
          </div>
          {step !== 6 && (
            <p className="mt-2 text-center text-[11px] text-neutral-400">
              Usaremos estas respuestas para recomendarte cursos, artistas y obras
              que se adapten a tu perfil.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
