"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LateralBar } from "@/app/components/lateral";
import { Topbar } from "@/app/components/topbar";

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
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <p className="text-sm text-[#222C47]/50">Preparando tu espacio...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden">
      <LateralBar />
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar />
        <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#222C47] text-center">
              Bienvenido a QuintaEsencia
            </h1>
            <p className="mt-4 text-[#222C47]/60 text-center max-w-md">
              Hola{user?.displayName ? `, ${user.displayName}` : ""}. <br/>
              Selecciona una opción del menú lateral para comenzar.
            </p>
        </main>
      </div>
    </div>
  );
}
