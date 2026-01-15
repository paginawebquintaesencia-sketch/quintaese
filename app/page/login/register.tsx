"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/app/components/ui/alert";

type Mode = "login" | "register";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function resetMessages() {
    setError("");
    setSuccess("");
  }

  function handleModeChange(nextMode: Mode) {
    setMode(nextMode);
    resetMessages();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();

    if (!email || !password || (mode === "register" && !name)) {
      setError("Por favor completa todos los campos requeridos.");
      return;
    }

    if (mode === "register") {
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (mode === "login") {
        setSuccess("Inicio de sesión simulado correctamente.");
      } else {
        setSuccess("Registro simulado correctamente.");
      }
    } catch {
      setError("Ha ocurrido un error inesperado. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="relative hidden h-screen w-1/2 md:block">
        <Image
          src="/login.png"
          alt="Imagen de bienvenida Quintaesencia"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="flex min-h-screen w-full items-center justify-center px-4 md:w-1/2">
        <div className="w-full max-w-md">
          <div key={mode} className="space-y-6 fade-slide">
            <div className="mb-2 text-center">
              <div className="flex justify-center">
                <Image
                  src="/logo.png"
                  alt="Logo Quintaesencia"
                  width={280}
                  height={90}
                  priority
                />
              </div>
              <h1 className="mt-4 text-2xl font-semibold text-neutral-900">
                {mode === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta"}
              </h1>
              <p className="mt-2 text-sm text-neutral-500">
                {mode === "login"
                  ? "Ingresa tus credenciales para acceder."
                  : "Regístrate para vivir la experiencia completa de Quintaesencia."}
              </p>
            </div>

            <div className="mb-2 grid grid-cols-2 rounded-full bg-neutral-100 p-1 text-sm">
              <button
                type="button"
                onClick={() => handleModeChange("login")}
                className={`rounded-full px-4 py-2 transition-colors ${
                  mode === "login"
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("register")}
                className={`rounded-full px-4 py-2 transition-colors ${
                  mode === "register"
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Crear cuenta
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                {mode === "register" && (
                  <div className="space-y-1">
                    <label
                      htmlFor="name"
                      className="block text-xs font-medium text-neutral-600"
                    >
                      Nombre completo
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/60"
                      placeholder="Tu nombre y apellidos"
                      autoComplete="name"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-neutral-600"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/60"
                    placeholder="ejemplo@correo.com"
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-neutral-600"
                  >
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/60"
                    placeholder={
                      mode === "login" ? "Tu contraseña" : "Mínimo 6 caracteres"
                    }
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                  />
                </div>

                {mode === "register" && (
                  <div className="space-y-1">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-xs font-medium text-neutral-600"
                    >
                      Confirmar contraseña
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/60"
                      placeholder="Repite tu contraseña"
                      autoComplete="new-password"
                    />
                  </div>
                )}
              </div>

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

              <button
                type="submit"
                disabled={loading}
                className="primary-button flex w-full items-center justify-center rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-neutral-700"
              >
                {loading
                  ? "Procesando..."
                  : mode === "login"
                  ? "Iniciar sesión"
                  : "Crear cuenta"}
              </button>
            </form>

            <p className="mt-2 text-center text-xs text-neutral-400">
              Quintaesencia es una galería de arte virtual donde puedes explorar
              artistas, acceder a cursos y inscribirte a nuevas experiencias
              creativas.
            </p>
            <p className="mt-1 flex items-center justify-center gap-1 text-[10px] text-neutral-400">
              <Image
                src="/logo.svg"
                alt="MetaWeb Dev Solutions logo"
                width={14}
                height={14}
                className="opacity-80"
              />
              <span>Created by MetaWeb Dev Solutions</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
