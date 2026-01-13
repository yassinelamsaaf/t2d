"use client";

import { useState, useEffect } from "react";

interface Orb {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

export default function AnimatedBackground({
  isDark = true,
}: {
  isDark?: boolean;
}) {
  const [orbs, setOrbs] = useState<Orb[]>([]);

  useEffect(() => {
    const generateOrbs = () => {
      const colors = isDark
        ? [
            "bg-purple-600/10",
            "bg-fuchsia-600/10",
            "bg-purple-500/5",
            "bg-violet-600/10",
          ]
        : [
            "bg-purple-400/20",
            "bg-fuchsia-400/20",
            "bg-purple-300/15",
            "bg-violet-400/20",
          ];

      const newOrbs: Orb[] = [];
      for (let i = 0; i < 5; i++) {
        newOrbs.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 200 + 150,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 2,
          duration: Math.random() * 3 + 4,
        });
      }
      setOrbs(newOrbs);
    };

    generateOrbs();

    // Regenerate orb positions periodically
    const interval = setInterval(() => {
      setOrbs((prev) =>
        prev.map((orb) => ({
          ...orb,
          x: Math.random() * 100,
          y: Math.random() * 100,
        }))
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [isDark]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          isDark
            ? "bg-gradient-to-br from-purple-950/30 via-black to-fuchsia-950/20"
            : "bg-gradient-to-br from-purple-100 via-white to-fuchsia-100"
        }`}
      />
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className={`absolute ${orb.color} rounded-full blur-3xl transition-all ease-in-out`}
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            transform: "translate(-50%, -50%)",
            animation: `pulse ${orb.duration}s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
            transitionDuration: "3s",
          }}
        />
      ))}
    </div>
  );
}
