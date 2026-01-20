"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || "User");
        setUserEmail(user.email || "");
        setUserPhoto(user.photoURL);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (pathname === "/" || pathname?.startsWith("/onboarding")) {
    return null;
  }

  return (
    <header className="flex h-20 items-center justify-between border-b border-[#EAEAEA] bg-white px-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-xl font-bold text-[#222C47]">
         Regresaste, {userName.split(" ")[0]}! 👋
        </h1>
        <p className="text-xs text-[#222C47]/50">
          Tu espacio de arte virtual
        </p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden w-[500px] md:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#449EEE]">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by property, location, or client"
            className="w-full rounded-lg border border-[#EAEAEA] bg-[#F9FAFB] py-2.5 pl-10 pr-4 text-sm text-[#222C47] outline-none transition-colors placeholder:text-[#222C47]/40 focus:border-[#449EEE] focus:bg-white"
          />
        </div>



        {/* Notification */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#EAEAEA] text-[#222C47]/70 transition-colors hover:bg-[#F9FAFB] hover:text-[#222C47]">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#DD43A8] ring-2 ring-white"></span>
        </button>

        {/* Profile */}
        <div className="relative flex items-center gap-3 border-l border-[#EAEAEA] pl-6">
          {userPhoto ? (
            <img
              src={userPhoto}
              alt={userName}
              className="h-10 w-10 rounded-full object-cover border border-[#EAEAEA]"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#AB5CC9]/10 text-sm font-bold text-[#AB5CC9] border border-[#AB5CC9]/30">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="hidden flex-col md:flex">
            <span className="text-sm font-bold text-[#222C47]">
              {userName}
            </span>
            <span className="text-xs text-[#222C47]/50">
              {userEmail}
            </span>
          </div>
          <button 
            className="text-[#449EEE] hover:text-[#222C47] focus:outline-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
             <svg 
               viewBox="0 0 24 24" 
               className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
               fill="none" 
               stroke="currentColor" 
               strokeWidth="2"
             >
                <path d="m6 9 6 6 6-6"/>
             </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsDropdownOpen(false)} 
              />
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-[#EAEAEA] bg-white shadow-lg py-1 z-50">
                <button 
                   onClick={() => {
                     setIsDropdownOpen(false);
                     router.push('/onboarding');
                   }} 
                   className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[#222C47] hover:bg-[#F9FAFB] transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#449EEE]" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Modificar Perfil
                </button>
                <div className="h-px bg-[#EAEAEA] my-1" />
                <button 
                   onClick={handleSignOut} 
                   className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[#FC5E33] hover:bg-[#FFF5F5] transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
