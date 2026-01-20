"use client";

import { LateralBar } from "@/app/components/lateral";
import { Topbar } from "@/app/components/topbar";

export default function GaleriaPage() {
  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden">
      <LateralBar />
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#222C47]">Galería de Arte Virtual</h1>
                <p className="text-[#222C47]/60">Explora nuestra colección de obras de artistas Quintaesencia, disponibles para su 
adquisición. </p>
            </div>
            
            {/* Grid de ejemplo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Items placeholder */}
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div key={item} className="bg-white rounded-xl border border-[#EAEAEA] overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                        <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-300 group-hover:bg-gray-200 transition-colors">
                            <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="1">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                        </div>
                        <div className="p-4">
                            <div className="h-4 w-3/4 bg-gray-100 rounded mb-2"></div>
                            <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
      </div>
    </div>
  );
}
