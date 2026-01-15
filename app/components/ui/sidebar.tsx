"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

// Iconos SVG inline para evitar dependencias externas
const Icons = {
  Search: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  Dashboard: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  ),
  Analytics: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
  Transactions: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  ),
  Invoices: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  ),
  Recurring: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  ),
  Subscriptions: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M12 20.94c1.61 0 3.11-.26 4.5-.75" />
      <path d="M22 13.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9" />
      <path d="M2 13h20" />
      <path d="M19 16v6" />
      <path d="M16 19h6" />
    </svg>
  ),
  Feedback: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Settings: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Help: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  ),
  Logout: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  ),
  Crown: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  ),
};

type SidebarItem = {
  href: string;
  label: string;
  icon: () => ReactNode;
  badge?: string;
};

type SidebarSection = {
  title?: string;
  items: SidebarItem[];
};

const sections: SidebarSection[] = [
  {
    title: "MENÚ PRINCIPAL",
    items: [
      {
        href: "/bienvenidos",
        label: "Inicio",
        icon: Icons.Dashboard,
      },
      {
        href: "/galeria",
        label: "Galería",
        icon: Icons.Analytics,
        badge: "0",
      },
      {
        href: "/artistas",
        label: "Artistas",
        icon: Icons.Transactions,
      },
      {
        href: "/cursos",
        label: "Cursos",
        icon: Icons.Invoices,
      },
    ],
  },
  {
    title: "CARACTERÍSTICAS",
    items: [
      {
        href: "/suscripciones",
        label: "Suscripciones",
        icon: Icons.Recurring,
        badge: "0",
      },
      {
        href: "/comunidad",
        label: "Comunidad",
        icon: Icons.Subscriptions,
      },
      {
        href: "/feedback",
        label: "Feedback",
        icon: Icons.Feedback,
      },
    ],
  },
  {
    title: "GENERAL",
    items: [
      {
        href: "/configuracion",
        label: "Configuración",
        icon: Icons.Settings,
      },
      {
        href: "/ayuda",
        label: "Ayuda",
        icon: Icons.Help,
      },
      {
        href: "/",
        label: "Cerrar sesión",
        icon: Icons.Logout,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  // Ocultar sidebar en login y onboarding
  if (pathname === "/" || pathname?.startsWith("/onboarding")) {
    return null;
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] flex-col border-r border-neutral-200 bg-white md:flex">
      {/* Search Bar */}
      <div className="p-4 pb-2">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-10 text-sm text-neutral-800 outline-none transition-colors focus:border-neutral-300 focus:bg-white"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="flex items-center justify-center rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">
              ⌘ K
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-neutral-200 hover:scrollbar-thumb-neutral-300">
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            {section.title && (
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/20"
                        : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? "text-white" : "text-neutral-400 group-hover:text-neutral-600"}>
                        <item.icon />
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                          isActive
                            ? "bg-white text-neutral-900"
                            : "bg-neutral-100 text-neutral-600 group-hover:bg-white"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Upgrade Card */}
      <div className="p-4 pt-2">
        <div className="relative overflow-hidden rounded-2xl bg-neutral-50 p-4 border border-neutral-100">
          <div className="relative z-10">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD700]/20 text-[#FFD700]">
              <span className="text-lg">👑</span>
            </div>
            <h4 className="mb-1 text-sm font-bold text-neutral-900">
              Hazte Mecenas
            </h4>
            <p className="mb-3 text-xs text-neutral-500 leading-relaxed">
              Apoya a los artistas y obtén acceso exclusivo a nuevas colecciones.
            </p>
            <div className="flex gap-2">
              <button className="flex-1 rounded-lg bg-[#15803d] py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#166534] shadow-sm shadow-green-900/20">
                Mejorar
              </button>
              <button className="flex-1 rounded-lg bg-white py-1.5 text-xs font-semibold text-neutral-600 border border-neutral-200 transition-colors hover:bg-neutral-50">
                Más info
              </button>
            </div>
          </div>
          {/* Decorative background blur */}
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-green-500/10 blur-2xl" />
        </div>
      </div>
    </aside>
  );
}
