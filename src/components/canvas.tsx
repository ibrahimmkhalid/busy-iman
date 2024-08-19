"use client";
import React, { useState, useEffect, type ReactNode } from "react";

interface DTGradient {
  from: string;
  to: string;
}

const gradients: DTGradient[] = [
  { from: "#012459", to: "#001322" },
  { from: "#fee154", to: "#a3dec6" },
  { from: "#f18448", to: "#ffd364" },
  { from: "#5b2c83", to: "#d1628b" },
];

interface CanvasProps {
  children: ReactNode;
}

export default function Canvas({ children }: CanvasProps) {
  const [gradient, setGradient] = useState(gradients[0]);

  useEffect(() => {
    function getCurrentGradient() {
      const now = new Date();
      const hour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
      if (hour < 5) {
        setGradient(gradients[0]);
      } else if (hour < 11) {
        setGradient(gradients[1]);
      } else if (hour < 18) {
        setGradient(gradients[2]);
      } else {
        setGradient(gradients[3]);
      }
    }

    getCurrentGradient();
    const interval = setInterval(getCurrentGradient, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (gradient === undefined) return;
    document.documentElement.style.setProperty("--gradient-from", gradient.from);
    document.documentElement.style.setProperty("--gradient-to", gradient.to);
  }, [gradient]);

  return (
    <main className="gradient-background flex min-h-screen flex-col items-center justify-center text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">{children}</div>
    </main>
  );
}
