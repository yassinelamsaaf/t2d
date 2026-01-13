"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import AnimatedBackground from "@/components/AnimatedBackground";
import { createClient } from "@/lib/supabase";
import {
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Ticket,
  Camera,
  XCircle,
  User,
  Mail,
  Calendar,
  ScanLine,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Html5Qrcode } from "html5-qrcode";

const ADMIN_EMAIL = "t2d-admin@gmail.com";

interface TicketData {
  id: string;
  ticket_number: string;
  qr_code_data: string;
  qr_code_image: string;
  checked_in: boolean;
  created_at: string;
}

interface VerificationResult {
  approved: boolean;
  alreadyCheckedIn?: boolean;
  error?: string;
  ticketInfo?: {
    ticketNumber: string;
    username: string;
    email: string;
    generatedAt: string;
    checkedInAt: string;
  };
}

export default function DashboardPage() {
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [scanError, setScanError] = useState("");
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const router = useRouter();
  const { isDark } = useTheme();

  useEffect(() => {
    checkAuthAndFetchTicket();
    return () => {
      stopScanning();
    };
  }, []);

  const checkAuthAndFetchTicket = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Check if admin
      if (user.email === ADMIN_EMAIL) {
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      await fetchTicket();
    } catch (err) {
      router.push("/login");
    }
  };

  const fetchTicket = async () => {
    try {
      const res = await fetch("/api/ticket");

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (res.status === 404) {
        setTicket(null);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setTicket(data.ticket);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateTicket = async () => {
    setGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/ticket", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate ticket");
      }

      setTicket(data.ticket);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const downloadTicket = () => {
    if (!ticket?.qr_code_image) return;

    const link = document.createElement("a");
    link.href = ticket.qr_code_image;
    link.download = `${ticket.ticket_number}.png`;
    link.click();
  };

  // Admin QR Scanner Functions
  const startScanning = async () => {
    try {
      setScanError("");
      setVerificationResult(null);
      setScanning(true);
      
      // Small delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;
      
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          await html5QrCode.stop();
          html5QrCodeRef.current = null;
          setScanning(false);
          await verifyTicket(decodedText);
        },
        () => {
          // QR code not found, continue scanning
        }
      );
    } catch (err: any) {
      setScanning(false);
      setScanError(err.message || "Could not access camera. Please allow camera permissions.");
    }
  };

  const stopScanning = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (err) {
        // Already stopped
      }
      html5QrCodeRef.current = null;
    }
    setScanning(false);
  };

  const verifyTicket = async (qrData: string) => {
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrData }),
      });
      const data = await res.json();
      setVerificationResult(data);
    } catch (err) {
      setScanError("Failed to verify ticket");
    }
  };

  const resetScan = () => {
    setVerificationResult(null);
    setScanError("");
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-black" : "bg-white"
        }`}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Admin Scanner UI
  if (isAdmin) {
    return (
      <div
        className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
          isDark ? "bg-black" : "bg-white"
        }`}
      >
        <AnimatedBackground isDark={isDark} />

        <div className="relative z-10">
          <Header />

          <div className="max-w-2xl mx-auto p-6 pt-10">
            <div
              className={`backdrop-blur-sm border rounded-2xl p-8 ${
                isDark
                  ? "bg-gray-900/60 border-purple-500/20"
                  : "bg-white/80 border-purple-300/40"
              }`}
            >
              <div className="text-center mb-6">
                <div className="inline-block p-3 rounded-full bg-purple-500/10 mb-4">
                  <ScanLine size={40} className="text-purple-500" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Admin Scanner
                </h2>
                <p
                  className={`text-sm mt-2 ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Scan attendee QR codes to verify entry
                </p>
              </div>

              {scanError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {scanError}
                </div>
              )}

              {/* QR Reader Container */}
              {scanning && !verificationResult && (
                <div className="mb-6">
                  <div 
                    id="qr-reader" 
                    className="rounded-xl overflow-hidden bg-black min-h-[300px]"
                    style={{ width: '100%' }}
                  />
                  <button
                    onClick={stopScanning}
                    className="w-full mt-4 py-3 bg-red-500/20 text-red-400 font-semibold rounded-xl border border-red-500/30 hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} />
                    Stop Scanning
                  </button>
                </div>
              )}

              {/* Verification Result */}
              {verificationResult && (
                <div className="mb-6">
                  {verificationResult.approved ? (
                    <div
                      className={`rounded-xl p-6 ${
                        verificationResult.alreadyCheckedIn
                          ? "bg-yellow-500/10 border border-yellow-500/30"
                          : "bg-green-500/10 border border-green-500/30"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-4">
                        {verificationResult.alreadyCheckedIn ? (
                          <>
                            <AlertCircle
                              size={28}
                              className="text-yellow-400"
                            />
                            <span className="text-xl font-bold text-yellow-400">
                              Already Checked In
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle size={28} className="text-green-400" />
                            <span className="text-xl font-bold text-green-400">
                              Approved
                            </span>
                          </>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div
                          className={`flex items-center gap-3 p-3 rounded-xl ${
                            isDark ? "bg-black/30" : "bg-white/50"
                          }`}
                        >
                          <User size={18} className="text-purple-400" />
                          <div>
                            <p
                              className={`text-xs ${
                                isDark ? "text-gray-500" : "text-gray-600"
                              }`}
                            >
                              Username
                            </p>
                            <p
                              className={`font-semibold ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {verificationResult.ticketInfo?.username}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`flex items-center gap-3 p-3 rounded-xl ${
                            isDark ? "bg-black/30" : "bg-white/50"
                          }`}
                        >
                          <Mail size={18} className="text-purple-400" />
                          <div>
                            <p
                              className={`text-xs ${
                                isDark ? "text-gray-500" : "text-gray-600"
                              }`}
                            >
                              Email
                            </p>
                            <p
                              className={`font-semibold ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {verificationResult.ticketInfo?.email}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`flex items-center gap-3 p-3 rounded-xl ${
                            isDark ? "bg-black/30" : "bg-white/50"
                          }`}
                        >
                          <Ticket size={18} className="text-purple-400" />
                          <div>
                            <p
                              className={`text-xs ${
                                isDark ? "text-gray-500" : "text-gray-600"
                              }`}
                            >
                              Ticket Number
                            </p>
                            <p
                              className={`font-mono text-sm font-semibold ${
                                isDark ? "text-purple-400" : "text-purple-600"
                              }`}
                            >
                              {verificationResult.ticketInfo?.ticketNumber}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`flex items-center gap-3 p-3 rounded-xl ${
                            isDark ? "bg-black/30" : "bg-white/50"
                          }`}
                        >
                          <Calendar size={18} className="text-purple-400" />
                          <div>
                            <p
                              className={`text-xs ${
                                isDark ? "text-gray-500" : "text-gray-600"
                              }`}
                            >
                              Checked In At
                            </p>
                            <p
                              className={`font-semibold ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {new Date(
                                verificationResult.ticketInfo?.checkedInAt || ""
                              ).toLocaleString("fr-FR")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl p-6 bg-red-500/10 border border-red-500/30">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <XCircle size={28} className="text-red-400" />
                        <span className="text-xl font-bold text-red-400">
                          Not Approved
                        </span>
                      </div>
                      <p className="text-center text-red-400/80">
                        {verificationResult.error ||
                          "Invalid or unrecognized ticket"}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={resetScan}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-fuchsia-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Camera size={18} />
                    Scan Another
                  </button>
                </div>
              )}

              {/* Start Scan Button */}
              {!scanning && !verificationResult && (
                <button
                  onClick={startScanning}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-fuchsia-500 transition-all shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2"
                >
                  <Camera size={20} />
                  Start Scanning
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

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

        <div className="max-w-5xl mx-auto p-6 pt-10">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Ticket Display or Generate */}
          {ticket ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: QR Code */}
              <div
                className={`backdrop-blur-sm border rounded-2xl p-8 ${
                  isDark
                    ? "bg-gray-900/60 border-purple-500/20"
                    : "bg-white/80 border-purple-300/40"
                }`}
              >
                <h2 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Your Event Ticket
                </h2>
                <p
                  className={`text-center mb-6 text-sm ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Present this QR code at the event entrance
                </p>

                <div className="bg-white p-4 rounded-xl shadow-2xl shadow-purple-500/20 mb-6">
                  <img
                    src={ticket.qr_code_image}
                    alt="QR Code"
                    className="w-full"
                  />
                </div>

                <button
                  onClick={downloadTicket}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-fuchsia-500 transition-all duration-300 shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  Download QR Code
                </button>
              </div>

              {/* Right: Ticket Details */}
              <div className="space-y-4">
                <div
                  className={`backdrop-blur-sm border rounded-2xl p-6 ${
                    isDark
                      ? "bg-gray-900/60 border-purple-500/20"
                      : "bg-white/80 border-purple-300/40"
                  }`}
                >
                  <h3
                    className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <Ticket
                      size={20}
                      className={isDark ? "text-purple-400" : "text-purple-600"}
                    />
                    Ticket Information
                  </h3>

                  <div className="space-y-3">
                    <div
                      className={`flex justify-between items-center p-3 rounded-xl ${
                        isDark ? "bg-purple-500/10" : "bg-purple-100/50"
                      }`}
                    >
                      <span
                        className={isDark ? "text-gray-400" : "text-gray-700"}
                      >
                        Ticket Number
                      </span>
                      <span
                        className={`font-mono text-sm font-bold ${
                          isDark ? "text-purple-400" : "text-purple-600"
                        }`}
                      >
                        {ticket.ticket_number}
                      </span>
                    </div>

                    <div
                      className={`flex justify-between items-center p-3 rounded-xl ${
                        isDark ? "bg-purple-500/10" : "bg-purple-100/50"
                      }`}
                    >
                      <span
                        className={isDark ? "text-gray-400" : "text-gray-700"}
                      >
                        Status
                      </span>
                      <span
                        className={`font-semibold flex items-center gap-2 ${
                          ticket.checked_in
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {ticket.checked_in ? (
                          <>
                            <CheckCircle size={16} />
                            Checked In
                          </>
                        ) : (
                          <>
                            <Clock size={16} />
                            Not Used
                          </>
                        )}
                      </span>
                    </div>

                    <div
                      className={`flex justify-between items-center p-3 rounded-xl ${
                        isDark ? "bg-purple-500/10" : "bg-purple-100/50"
                      }`}
                    >
                      <span
                        className={isDark ? "text-gray-400" : "text-gray-700"}
                      >
                        Generated
                      </span>
                      <span
                        className={isDark ? "text-gray-300" : "text-gray-900"}
                      >
                        {new Date(ticket.created_at).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`border rounded-2xl p-6 ${
                    isDark
                      ? "bg-gradient-to-br from-purple-900/30 to-fuchsia-900/20 border-purple-500/20"
                      : "bg-gradient-to-br from-purple-100/40 to-fuchsia-100/30 border-purple-300/40"
                  }`}
                >
                  <h3
                    className={`font-bold mb-3 flex items-center gap-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <AlertCircle
                      size={18}
                      className={isDark ? "text-purple-400" : "text-purple-600"}
                    />
                    Important Information
                  </h3>
                  <ul
                    className={`space-y-2 text-sm ${
                      isDark ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                      Save your QR code on your phone or print it
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                      Present it at the event entrance for scanning
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                      Each ticket can only be used once
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                      Keep your ticket confidential
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`max-w-xl mx-auto backdrop-blur-sm border rounded-2xl p-10 text-center ${
                isDark
                  ? "bg-gray-900/60 border-purple-500/20"
                  : "bg-white/80 border-purple-300/40"
              }`}
            >
              <div className="inline-block p-3 rounded-full bg-purple-500/10 mb-6">
                <Image
                  src="/t2d-logo.png"
                  alt="Think To Deploy"
                  width={80}
                  height={80}
                  className="mx-auto"
                />
              </div>
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                Welcome to T2D 2026!
              </h2>
              <p
                className={`mb-8 max-w-md mx-auto ${
                  isDark ? "text-gray-400" : "text-gray-700"
                }`}
              >
                Generate your event ticket to receive a unique QR code for
                entry. You'll need to present this at the event entrance.
              </p>
              <button
                onClick={generateTicket}
                disabled={generating}
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-fuchsia-500 transition-all duration-300 shadow-xl shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
              >
                {generating ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Ticket size={20} />
                    Generate My Ticket
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
