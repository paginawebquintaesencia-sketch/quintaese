"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function Topbar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || "User");
        setUserEmail(user.email || "");
      }
    });
    return () => unsubscribe();
  }, []);

  if (pathname === "/" || pathname?.startsWith("/onboarding")) {
    return null;
  }

  return (
    <header className="flex h-20 items-center justify-between border-b border-[#EAEAEA] bg-white px-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-xl font-bold text-[#222C47]">
          Welcome back, {userName.split(" ")[0]}! 👋
        </h1>
        <p className="text-xs text-[#222C47]/50">
          Get a clear view of your real estate portfolio.
        </p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden w-96 md:block">
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

        {/* Add Property Button */}
        <button className="flex items-center gap-2 rounded-lg bg-[#FC5E33] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#FC5E33]/20 transition-colors hover:bg-[#E04F2A]">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span>Add Property</span>
        </button>

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
        <div className="flex items-center gap-3 border-l border-[#EAEAEA] pl-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#AB5CC9]/10 text-sm font-bold text-[#AB5CC9] border border-[#AB5CC9]/30">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden flex-col md:flex">
            <span className="text-sm font-bold text-[#222C47]">
              {userName}
            </span>
            <span className="text-xs text-[#222C47]/50">
              {userEmail}
            </span>
          </div>
          <button className="text-[#449EEE] hover:text-[#222C47]">
             <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6"/>
             </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
