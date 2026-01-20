"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  badge?: number;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const itemColors: Record<string, string> = {
  Dashboard: "#FC5E33",
  Galeria: "#449EEE",
  Artistas: "#AB5CC9",
  Calendario: "#DD43A8",
  "Mis Cursos": "#222C47",
  "Cursos Guardados": "#449EEE",
  Insignia: "#AB5CC9",
  Momentos: "#DD43A8",
};

const sections: NavSection[] = [
  {
    title: "Menu",
    items: [
      { label: "Dashboard", href: "/bienvenidos" },
      { label: "Galeria", href: "#" },
      { label: "Artistas", href: "#" },
      { label: "Calendario", href: "#" },
      { label: "Mis Cursos", href: "#" },
      { label: "Cursos Guardados", href: "#" },
      { label: "Insignia", href: "#" },
      { label: "Momentos", href: "#" },
    ],
  },
];

function ItemIcon({ label, isActive: _isActive }: { label: string; isActive: boolean }) {
  const colorClass = "text-white";

  if (label === "Dashboard") {
    return (
      <svg className={`h-5 w-5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    );
  }
  if (label === "Galeria") {
    return (
      <svg className={`h-5 w-5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="5" width="14" height="12" rx="2" />
        <path d="M8 13l2-2 2 2 3-3" />
        <circle cx="9" cy="9" r="1" />
      </svg>
    );
  }
  if (label === "Artistas") {
    return (
      <svg className={`h-5 w-5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="3" />
        <path d="M6 19c1.5-3 3.5-4.5 6-4.5s4.5 1.5 6 4.5" />
      </svg>
    );
  }
  if (label === "Calendario") {
    return (
      <svg className={`h-5 w-5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M9 3v4" />
        <path d="M15 3v4" />
        <path d="M4 10h16" />
        <path d="M9 14h2" />
        <path d="M13 14h2" />
      </svg>
    );
  }
  if (label === "Mis Cursos") {
    return (
      <svg className={`h-5 w-5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="5" width="14" height="12" rx="2" />
        <path d="M9 9h6" />
        <path d="M9 13h4" />
      </svg>
    );
  }
  if (label === "Cursos Guardados") {
    return (
      <svg className={`h-5 w-5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 4h12v16l-6-4-6 4z" />
      </svg>
    );
  }
  if (label === "Insignia") {
    return (
      <svg className={`h-5 w-5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="10" r="3" />
        <path d="M7 4h10l-1 7a5 5 0 0 1-8 0z" />
        <path d="M9 17l-1 4 4-2 4 2-1-4" />
      </svg>
    );
  }
  if (label === "Momentos") {
    return (
      <svg className={`h-5 w-5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="7" />
        <path d="M12 9v4l2 2" />
      </svg>
    );
  }
  return (
    <svg className={`h-5 w-5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export function LateralBar() {
  const pathname = usePathname();

  if (pathname === "/" || pathname?.startsWith("/onboarding")) {
    return null;
  }

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-white border-r border-[#EAEAEA] text-[#222C47]">
      {/* Brand */}
      <div className="flex items-center justify-center px-6 py-8">
        <Image
          src="/logo.png"
          alt="QuintaEsencia"
          width={150}
          height={50}
          className="h-auto w-auto object-contain"
          priority
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-6">
        {sections.map((section) => (
          <div key={section.title} className="mb-8">
            <p className="mb-4 px-2 text-xs font-medium text-[#222C47]/50 uppercase tracking-wider">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  item.href !== "#" && pathname?.startsWith(item.href);
                const accent = itemColors[item.label] ?? "#FC5E33";

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#F9FAFB]"
                        : "text-[#222C47]/70 hover:bg-[#F9FAFB] hover:text-[#222C47]"
                    }`}
                    style={isActive ? { color: accent } : undefined}
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: accent }}
                    >
                      <ItemIcon label={item.label} isActive={isActive} />
                    </div>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
