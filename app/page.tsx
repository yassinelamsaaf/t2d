"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import AnimatedBackground from "@/components/AnimatedBackground";
import {
  Rocket,
  Users,
  Trophy,
  ArrowRight,
  Sparkles,
  Ticket,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkAuth();
  }, []);

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

        <main className="max-w-6xl mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-8 relative inline-block">
              <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full" />
              <Image
                src="/t2d-logo.png"
                alt="Think To Deploy"
                width={120}
                height={120}
                className="mx-auto relative z-10 drop-shadow-2xl"
              />
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-600 bg-clip-text text-transparent">
                THINK TO DEPLOY
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 font-light mb-4 tracking-wide">
              DÉROULEMENT DE L'ÉVÉNEMENT
            </p>

            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Un{" "}
              <span className="text-purple-400 font-medium">
                challenge technologique
              </span>{" "}
              orienté vers le{" "}
              <span className="text-purple-400 font-medium">
                déploiement réel
              </span>{" "}
              de solutions Data & IA dans l'industrie.
            </p>
          </div>

          {/* Event Steps - Right after DÉROULEMENT */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Step 1 */}
            <div
              className={`group relative backdrop-blur-sm border rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                isDark
                  ? "bg-gradient-to-br from-gray-900/80 to-gray-950/80 border-purple-500/20 hover:shadow-purple-500/10"
                  : "bg-gradient-to-br from-white to-purple-50/30 border-purple-300/40 hover:shadow-purple-300/20"
              }`}
            >
              <div className="absolute top-4 right-4">
                <Rocket
                  className={`w-6 h-6 transition-colors duration-300 ${
                    isDark
                      ? "text-purple-500/30 group-hover:text-purple-400"
                      : "text-purple-400/40 group-hover:text-purple-500"
                  }`}
                />
              </div>
              <div
                className={`text-6xl font-black mb-4 ${
                  isDark ? "text-purple-500/20" : "text-purple-400/30"
                }`}
              >
                01
              </div>
              <h3
                className={`text-lg font-bold mb-4 uppercase tracking-wider ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Lancement de la Problématique
              </h3>
              <ul
                className={`space-y-3 text-sm ${
                  isDark ? "text-gray-400" : "text-gray-700"
                }`}
              >
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <span>
                    L'entreprise et l'équipe de jurys soumet une problématique
                    détaillée
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <span>Les équipes candidatent</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <span>15 jours pour soumettre les propositions</span>
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div
              className={`group relative backdrop-blur-sm border rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                isDark
                  ? "bg-gradient-to-br from-gray-900/80 to-gray-950/80 border-purple-500/20 hover:shadow-purple-500/10"
                  : "bg-gradient-to-br from-white to-purple-50/30 border-purple-300/40 hover:shadow-purple-300/20"
              }`}
            >
              <div className="absolute top-4 right-4">
                <Users
                  className={`w-6 h-6 transition-colors duration-300 ${
                    isDark
                      ? "text-purple-500/30 group-hover:text-purple-400"
                      : "text-purple-400/40 group-hover:text-purple-500"
                  }`}
                />
              </div>
              <div
                className={`text-6xl font-black mb-4 ${
                  isDark ? "text-purple-500/20" : "text-purple-400/30"
                }`}
              >
                02
              </div>
              <h3
                className={`text-lg font-bold mb-4 uppercase tracking-wider ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Présélection et Immersion
              </h3>
              <ul
                className={`space-y-3 text-sm ${
                  isDark ? "text-gray-400" : "text-gray-700"
                }`}
              >
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <span>5 équipes sont sélectionnées</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <span>Visite sur site chez l'entreprise</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <span>20 jours pour l'adaptation des solutions</span>
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div
              className={`group relative backdrop-blur-sm border rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                isDark
                  ? "bg-gradient-to-br from-gray-900/80 to-gray-950/80 border-purple-500/20 hover:shadow-purple-500/10"
                  : "bg-gradient-to-br from-white to-purple-50/30 border-purple-300/40 hover:shadow-purple-300/20"
              }`}
            >
              <div className="absolute top-4 right-4">
                <Trophy
                  className={`w-6 h-6 transition-colors duration-300 ${
                    isDark
                      ? "text-purple-500/30 group-hover:text-purple-400"
                      : "text-purple-400/40 group-hover:text-purple-500"
                  }`}
                />
              </div>
              <div
                className={`text-6xl font-black mb-4 ${
                  isDark ? "text-purple-500/20" : "text-purple-400/30"
                }`}
              >
                03
              </div>
              <h3
                className={`text-lg font-bold mb-4 uppercase tracking-wider ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Soutenances Finales
              </h3>
              <ul
                className={`space-y-3 text-sm ${
                  isDark ? "text-gray-400" : "text-gray-700"
                }`}
              >
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <span>Les 5 finalistes présentent leurs solutions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <span>L'équipe gagnante est recrutée en stage</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mb-20">
            <Link href={isLoggedIn ? "/dashboard" : "/register"}>
              <button className="group relative px-10 py-4 text-lg font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-600 text-white rounded-xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60">
                <span className="flex items-center gap-3">
                  {isLoggedIn ? <Ticket size={20} /> : <Sparkles size={20} />}
                  {isLoggedIn ? "See Your Ticket" : "Claim Your Ticket Now"}
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </button>
            </Link>
          </div>

          {/* T2D Explanation */}
          <div
            className={`relative border rounded-2xl p-10 md:p-14 mb-16 overflow-hidden ${
              isDark
                ? "bg-gradient-to-br from-purple-900/30 via-gray-900/50 to-fuchsia-900/20 border-purple-500/20"
                : "bg-gradient-to-br from-purple-100/40 via-white to-fuchsia-100/30 border-purple-300/40"
            }`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.08),transparent_60%)]" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black mb-8 bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                T2D ?
              </h2>

              <div className="space-y-6 text-left max-w-4xl mx-auto">
                <p
                  className={`text-base md:text-lg leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  <span
                    className={
                      isDark
                        ? "text-white font-bold"
                        : "text-gray-900 font-bold"
                    }
                  >
                    THINK TO DEPLOY (T2D)
                  </span>{" "}
                  EST UN{" "}
                  <span className="text-purple-400 font-bold">
                    CHALLENGE TECHNOLOGIQUE
                  </span>{" "}
                  ORIENTÉ VERS LE DÉPLOIEMENT RÉEL DE SOLUTIONS DATA & IA DANS
                  L'INDUSTRIE.
                </p>

                <p
                  className={`text-base md:text-lg leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  CONTRAIREMENT AUX HACKATHONS CLASSIQUES QUI SE LIMITENT À DES
                  PROTOTYPES, T2D PLACE LA{" "}
                  <span
                    className={
                      isDark
                        ? "text-white font-bold"
                        : "text-gray-900 font-bold"
                    }
                  >
                    FAISABILITÉ
                  </span>
                  ,{" "}
                  <span
                    className={
                      isDark
                        ? "text-white font-bold"
                        : "text-gray-900 font-bold"
                    }
                  >
                    L'INTÉGRATION
                  </span>{" "}
                  ET LE{" "}
                  <span
                    className={
                      isDark
                        ? "text-white font-bold"
                        : "text-gray-900 font-bold"
                    }
                  >
                    POTENTIEL DE DÉPLOIEMENT
                  </span>{" "}
                  AU CŒUR DE LA COMPÉTITION.
                </p>

                <p
                  className={`text-base md:text-lg leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  UNE{" "}
                  <span
                    className={
                      isDark
                        ? "text-white font-bold"
                        : "text-gray-900 font-bold"
                    }
                  >
                    ENTREPRISE PARTENAIRE
                  </span>{" "}
                  PROPOSE UNE PROBLÉMATIQUE CONCRÈTE ET LES ÉTUDIANTS ONT POUR
                  MISSION DE PROPOSER UNE{" "}
                  <span className="text-purple-400 font-bold">
                    SOLUTION TECHNIQUE INNOVANTE, APPLICABLE ET DÉPLOYABLE
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
