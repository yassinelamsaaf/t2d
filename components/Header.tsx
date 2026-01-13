"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, ChevronDown, Ticket, Sun, Moon, ScanLine } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useTheme } from "@/context/ThemeContext";

export default function Header() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    checkUser();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const checkUser = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setUser({ email: user.email });
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header
      className={`border-b border-purple-500/10 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-300 ${
        isDark ? "bg-black/90" : "bg-white/95"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-4 hover:opacity-80 transition-opacity duration-300"
          >
            <Image
              src="/t2d-logo.png"
              alt="Think To Deploy"
              width={45}
              height={45}
              className="object-contain"
            />
            <div className="hidden md:block">
              <h1
                className={`text-lg font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Think To Deploy
              </h1>
              <p
                className={`text-xs ${
                  isDark ? "text-gray-500" : "text-gray-600"
                }`}
              >
                T2D Challenge 2026
              </p>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all duration-300 ${
                isDark
                  ? "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20"
                  : "bg-purple-100 border-purple-300 hover:bg-purple-200"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Moon size={18} className="text-purple-400" />
              ) : (
                <Sun size={18} className="text-yellow-500" />
              )}
            </button>

            {loading ? (
              <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all duration-300 ${
                    isDark
                      ? "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20"
                      : "bg-purple-100 border-purple-300 hover:bg-purple-200"
                  }`}
                >
                  <User
                    size={18}
                    className={isDark ? "text-purple-400" : "text-purple-600"}
                  />
                  <span
                    className={`text-sm hidden sm:block max-w-[150px] truncate ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {user.email}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    } ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48 border border-purple-500/30 rounded-xl shadow-2xl shadow-purple-500/20 overflow-hidden ${
                      isDark ? "bg-gray-900" : "bg-white"
                    }`}
                  >
                    <Link
                      href="/dashboard"
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        isDark
                          ? "text-gray-300 hover:bg-purple-500/10"
                          : "text-gray-700 hover:bg-purple-100"
                      }`}
                      onClick={() => setDropdownOpen(false)}
                    >
                        {user.email === "t2d-admin@gmail.com" ? (
                          <>
                            <ScanLine
                              size={16}
                              className={isDark ? "text-purple-400" : "text-purple-600"}
                            />
                            Scanner
                          </>
                        ) : (
                          <>
                            <Ticket
                              size={16}
                              className={isDark ? "text-purple-400" : "text-purple-600"}
                            />
                            My Ticket
                          </>
                        )}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 transition-colors border-t ${
                        isDark
                          ? "hover:bg-red-500/10 border-purple-500/20"
                          : "hover:bg-red-50 border-purple-200"
                      }`}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className={`px-5 py-2.5 text-sm border rounded-xl transition-all duration-300 ${
                    isDark
                      ? "text-gray-300 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50"
                      : "text-gray-700 border-purple-300 hover:bg-purple-100 hover:border-purple-400"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 text-sm bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-xl hover:from-purple-500 hover:to-fuchsia-500 transition-all duration-300 shadow-lg shadow-purple-500/30"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
