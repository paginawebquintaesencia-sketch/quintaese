"use client";

import { LateralBar } from "@/app/components/lateral";
import { Topbar } from "@/app/components/topbar";
import { useState } from "react";

// Definición de colores simples (texto/borde)
const CATEGORY_COLORS: Record<string, string> = {
  "Pintura": "text-[#AB5CC9] border-[#AB5CC9] bg-[#AB5CC9]/10",
  "Dibujo": "text-[#DD43A8] border-[#DD43A8] bg-[#DD43A8]/10",
  "Fotografía": "text-[#449EEE] border-[#449EEE] bg-[#449EEE]/10",
  "Artesanía": "text-[#FC5E33] border-[#FC5E33] bg-[#FC5E33]/10"
};

const ARTISTS = [
  {
    id: 1,
    name: "Elena Martinez",
    pseudonym: "Elemart",
    roles: ["Pintura", "Dibujo"],
    bio: "Explorando la intersección entre la naturaleza y la geometría sagrada a través del óleo.",
    initials: "EM"
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    pseudonym: "WoodMaster",
    roles: ["Artesanía"],
    bio: "Creando formas imposibles en madera tallada, desafiando la gravedad y la materia.",
    initials: "CR"
  },
  {
    id: 3,
    name: "Sofia Lopez",
    pseudonym: "SofiLuz",
    roles: ["Fotografía", "Dibujo"],
    bio: "Capturando la esencia del movimiento y la luz en entornos urbanos olvidados.",
    initials: "SL"
  },
  {
    id: 4,
    name: "Miguel Angel",
    pseudonym: "MikelArt",
    roles: ["Dibujo", "Pintura"],
    bio: "Narrativas visuales que mezclan el folclore tradicional con estéticas futuristas.",
    initials: "MA"
  },
  {
    id: 5,
    name: "Ana Vega",
    pseudonym: "Avega",
    roles: ["Pintura"],
    bio: "Transformando espacios grises en lienzos vivos que cuentan historias de comunidad.",
    initials: "AV"
  },
  {
    id: 6,
    name: "David Klein",
    pseudonym: "PixelDK",
    roles: ["Fotografía"],
    bio: "Fotografía experimental que traduce datos ambientales en experiencias visuales.",
    initials: "DK"
  },
  {
    id: 7,
    name: "Lucia Perez",
    pseudonym: "LuPe",
    roles: ["Artesanía", "Pintura"],
    bio: "Diálogo táctil con la tierra, creando piezas de cerámica funcionales con alma escultórica.",
    initials: "LP"
  },
  {
    id: 8,
    name: "Javier Ortiz",
    pseudonym: "Javo",
    roles: ["Dibujo"],
    bio: "Experimentación con dibujo digital y técnicas tradicionales de bocetado.",
    initials: "JO"
  },
  {
    id: 9,
    name: "Roberto Gomez",
    pseudonym: "RobGo",
    roles: ["Pintura"],
    bio: "Abstracción lírica que busca representar las emociones humanas a través del color puro.",
    initials: "RG"
  },
  {
    id: 10,
    name: "Marina Silva",
    pseudonym: "MarSea",
    roles: ["Fotografía", "Artesanía"],
    bio: "Documentación visual de la vida marina y costera con un enfoque conservacionista.",
    initials: "MS"
  },
  {
    id: 11,
    name: "Tomas Eduardo",
    pseudonym: "TomEd",
    roles: ["Dibujo"],
    bio: "Ilustración botánica detallada con un toque surrealista y fantástico.",
    initials: "TE"
  },
  {
    id: 12,
    name: "Valentina Paz",
    pseudonym: "ValP",
    roles: ["Artesanía"],
    bio: "Tejidos ancestrales reinterpretados con materiales contemporáneos y sostenibles.",
    initials: "VP"
  },
  {
    id: 13,
    name: "Gabriel Torres",
    pseudonym: "GaboT",
    roles: ["Pintura", "Fotografía"],
    bio: "Muralismo urbano que transforma espacios públicos en galerías abiertas.",
    initials: "GT"
  }
];

const CATEGORIES = ["Todos", "Pintura", "Dibujo", "Fotografía", "Artesanía"];

export default function ArtistasPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredArtists = selectedCategory === "Todos" 
    ? ARTISTS 
    : ARTISTS.filter(artist => artist.roles.includes(selectedCategory));

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <LateralBar />
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl">
            {/* Header Simple */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  Nuestros Artistas
                </h1>
                <p className="mt-1 text-gray-500">
                  Conoce a los creadores y sus cursos disponibles.
                </p>
            </div>

            {/* Filtros Básicos */}
            <div className="mb-8 flex flex-wrap gap-4 border-b border-gray-200 pb-4">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-sm font-medium transition-colors hover:text-gray-900
                    ${selectedCategory === category 
                      ? "text-gray-900 underline underline-offset-4" 
                      : "text-gray-500"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Lista Simple */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArtists.map((artist) => {
                    const primaryRole = artist.roles[0];
                    const colorClass = CATEGORY_COLORS[primaryRole] || "text-gray-500 border-gray-200 bg-gray-50";
                    const borderColor = colorClass.split(' ')[1]; // Extract border color class
                    
                    const buttonBgColor = primaryRole === 'Pintura' ? 'bg-[#AB5CC9] hover:bg-[#9A4BB8]' 
                        : primaryRole === 'Dibujo' ? 'bg-[#DD43A8] hover:bg-[#C93297]' 
                        : primaryRole === 'Fotografía' ? 'bg-[#449EEE] hover:bg-[#338DDD]' 
                        : 'bg-[#FC5E33] hover:bg-[#EB4D22]';
                    
                    return (
                        <div 
                          key={artist.id} 
                          className={`flex flex-col p-6 border rounded-xl hover:shadow-md transition-shadow bg-white ${borderColor}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    {/* Avatar Simple */}
                                    <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-lg border border-gray-200">
                                        {artist.initials}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{artist.name}</h3>
                                        <p className="text-sm font-medium text-gray-500">"{artist.pseudonym}"</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-end max-w-[40%]">
                                    {artist.roles.map((role) => {
                                        const roleColorClass = CATEGORY_COLORS[role] || "text-gray-500 border-gray-200 bg-gray-50";
                                        return (
                                            <span key={role} className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${roleColorClass}`}>
                                                {role}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex-1">
                                <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                                    {artist.bio}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 mt-auto">
                                <button className="w-full py-2 px-4 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Ver más sobre el artista
                                </button>
                                <button className={`w-full py-2 px-4 rounded-lg text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2 ${buttonBgColor}`}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    Ver cursos impartidos
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Estado Vacío */}
            {filteredArtists.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                No hay artistas en esta categoría.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
