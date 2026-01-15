"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function BienvenidosPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

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

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EAEAEA]">
        <p className="text-sm text-[#222C47]/50">Preparando tu espacio...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#EAEAEA] text-[#222C47] px-4">
      <div className="w-full max-w-xl text-center space-y-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#222C47]/50">
          Bienvenido a Quintaesencia
        </p>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">
          Hola{user?.displayName ? `, ${user.displayName}` : ""}.
          <br />
          Este es tu punto de partida.
        </h1>
        <p className="text-sm md:text-base text-[#222C47]/70 max-w-md mx-auto">
          Desde aquí podrás explorar la galería, conectar con nuevas
          experiencias y continuar construyendo tu presencia artística dentro de
          la comunidad.
        </p>
        <div className="flex flex-col items-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push("/onboarding")}
            className="rounded-full bg-[#222C47] px-8 py-3 text-sm md:text-base font-semibold text-white shadow-lg hover:bg-[#1a2136] hover:scale-[1.03] transition-all"
          >
            Ver o ajustar mi perfil de artista
          </button>
        </div>
      </div>
    </div>
  );
}

