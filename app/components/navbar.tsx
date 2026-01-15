"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <nav className="w-full bg-[#14172A] text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-[0.3em]">
              QUINTAESENCIA
            </span>
            <span className="h-2 w-2 rounded-full bg-white" />
          </div>

          <div className="hidden items-center gap-10 text-sm md:flex">
            <div className="flex items-center gap-8">
              <Link
                href="#"
                className="border-b-2 border-white pb-1 font-medium"
              >
                Inicio
              </Link>
              <Link
                href="#"
                className="text-white/70 transition-colors hover:text-white"
              >
                Galería
              </Link>
              <Link
                href="#"
                className="text-white/70 transition-colors hover:text-white"
              >
                Artistas
              </Link>
              <Link
                href="#"
                className="text-white/70 transition-colors hover:text-white"
              >
                Nosotros
              </Link>
              <Link
                href="#"
                className="text-white/70 transition-colors hover:text-white"
              >
                Contacto
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="#"
                className="rounded-full bg-[#FF6A3D] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#ff825f]"
              >
                Calendario
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 rounded-full bg-[#9B5CFF] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#b37aff]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.33 0-6 1.34-6 3v1h12v-1c0-1.66-2.67-3-6-3z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span>Iniciar sesión</span>
              </Link>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full p-2 text-white hover:bg-white/10 md:hidden"
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Abrir menú</span>
            <span className="flex h-5 w-5 flex-col justify-between">
              <span className="h-[2px] w-full rounded bg-current" />
              <span className="h-[2px] w-full rounded bg-current" />
              <span className="h-[2px] w-full rounded bg-current" />
            </span>
          </button>
        </div>

        {open && (
          <div className="space-y-4 border-t border-white/10 py-4 text-sm md:hidden">
            <div className="flex flex-col gap-3">
              <Link href="#" className="font-medium">
                Inicio
              </Link>
              <Link
                href="#"
                className="text-white/80 transition-colors hover:text-white"
              >
                Galería
              </Link>
              <Link
                href="#"
                className="text-white/80 transition-colors hover:text-white"
              >
                Artistas
              </Link>
              <Link
                href="#"
                className="text-white/80 transition-colors hover:text-white"
              >
                Nosotros
              </Link>
              <Link
                href="#"
                className="text-white/80 transition-colors hover:text-white"
              >
                Contacto
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="#"
                className="flex justify-center rounded-full bg-[#FF6A3D] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#ff825f]"
              >
                Calendario
              </Link>
              <Link
                href="#"
                className="flex items-center justify-center gap-2 rounded-full bg-[#9B5CFF] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#b37aff]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.33 0-6 1.34-6 3v1h12v-1c0-1.66-2.67-3-6-3z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span>Iniciar sesión</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
