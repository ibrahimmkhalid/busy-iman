"use client";
import React, { useState, useEffect, type ReactNode, createContext } from "react";

const TimeFormatContext = createContext<{ is24Hour: boolean; toggle: () => void }>({
  is24Hour: true,
  toggle: () => {
    // no-op
  },
});

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
  const [is24Hour, setIs24Hour] = useState(true);

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

  useEffect(() => {
    const saved = sessionStorage.getItem("timeFormat");
    if (saved !== null) {
      setIs24Hour(saved === "24");
    }
  }, []);

  const toggleFormat = () => {
    const newVal = !is24Hour;
    setIs24Hour(newVal);
    sessionStorage.setItem("timeFormat", newVal ? "24" : "12");
  };

  return (
    <TimeFormatContext.Provider value={{ is24Hour, toggle: toggleFormat }}>
      <main className="gradient-background flex min-h-screen flex-col text-white">
        <nav className="flex items-center justify-between px-4 py-4">
          <div className="flex gap-8">
            <a href="/timer" className="text-lg font-medium hover:underline">
              Timer
            </a>
            <a href="/timeline" className="text-lg font-medium hover:underline">
              Timeline
            </a>
          </div>
          <button onClick={toggleFormat} className="text-lg font-medium hover:underline">
            {is24Hour ? "24H" : "12H"}
          </button>
        </nav>
        <div className="flex flex-1 flex-col items-center justify-center gap-12 px-4 py-16">{children}</div>
      </main>
    </TimeFormatContext.Provider>
  );
}

export { TimeFormatContext };
