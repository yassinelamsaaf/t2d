"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import AnimatedBackground from "@/components/AnimatedBackground";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  User,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isDark } = useTheme();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
        isDark ? "bg-black" : "bg-white"
      }`}
    >
      {/* Animated background */}
      <AnimatedBackground isDark={isDark} />

      <div className="relative z-10">
        <Header />

        <div className="flex items-center justify-center p-4 pt-16">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-block p-3 rounded-full bg-purple-500/10 mb-4">
                <Image
                  src="/t2d-logo.png"
                  alt="Think To Deploy"
                  width={70}
                  height={70}
                  className="mx-auto"
                />
              </div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                Join T2D 2026
              </h1>
              <p className="text-gray-500">
                Create an account to get your ticket
              </p>
            </div>

            {/* Register Form */}
            <div
              className={`backdrop-blur-sm border rounded-2xl p-8 ${
                isDark
                  ? "bg-gray-900/60 border-purple-500/20"
                  : "bg-white/80 border-purple-300/40"
              }`}
            >
              <h2
                className={`text-xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Register
              </h2>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
                  <CheckCircle size={16} />
                  Registration successful! Redirecting...
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label
                    htmlFor="username"
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    Username
                  </label>
                  <div className="relative">
                    <User
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:border-purple-500 transition-all ${
                        isDark
                          ? "bg-black/50 border-purple-500/20 text-white placeholder-gray-600"
                          : "bg-white border-purple-300/40 text-gray-900 placeholder-gray-400"
                      }`}
                      placeholder="Your username"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:border-purple-500 transition-all ${
                        isDark
                          ? "bg-black/50 border-purple-500/20 text-white placeholder-gray-600"
                          : "bg-white border-purple-300/40 text-gray-900 placeholder-gray-400"
                      }`}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={`w-full pl-12 pr-12 py-3 rounded-xl border focus:outline-none focus:border-purple-500 transition-all ${
                        isDark
                          ? "bg-black/50 border-purple-500/20 text-white placeholder-gray-600"
                          : "bg-white border-purple-300/40 text-gray-900 placeholder-gray-400"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                        isDark
                          ? "text-gray-500 hover:text-gray-400"
                          : "text-gray-400 hover:text-gray-600"
                      } transition-colors`}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className={`w-full pl-12 pr-12 py-3 rounded-xl border focus:outline-none focus:border-purple-500 transition-all ${
                        isDark
                          ? "bg-black/50 border-purple-500/20 text-white placeholder-gray-600"
                          : "bg-white border-purple-300/40 text-gray-900 placeholder-gray-400"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                        isDark
                          ? "text-gray-500 hover:text-gray-400"
                          : "text-gray-400 hover:text-gray-600"
                      } transition-colors`}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-fuchsia-500 transition-all duration-300 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : success ? (
                    "Success!"
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
