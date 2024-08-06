"use client";
import React, { useState, useEffect } from "react";

const prayers: string[] = ["Fajr", "Shuruq", "Doha", "Dhuhr", "Asr", "Maghrib", "Isha", "Tahajjud"];

const colorCodes = {
  valid: "text-green-500",
  busy: "text-red-500",
  critical: "text-black",
};

const colorCode = colorCodes.valid;
const prayerName = prayers[4];

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

function getCurrentGradient(): DTGradient {
  return gradients[1]!;
}

export default function HomePage() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount((count + 1) % 4);
    setGradient(gradients[count]!);
  };

  const [gradient, setGradient] = useState(getCurrentGradient());

  useEffect(() => {
    const interval = setInterval(() => {
      setGradient(getCurrentGradient());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--gradient-from", gradient.from);
    document.documentElement.style.setProperty("--gradient-to", gradient.to);
  }, [gradient]);

  return (
    <main className="gradient-background flex min-h-screen flex-col items-center justify-center text-white">
      <button onClick={increment}>next</button>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="rounded-full border bg-white p-8 text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className={colorCode}>{prayerName}</span>
        </h1>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
            <div className="text-lg">Fajr in 00:00</div>
          </div>
        </div>
      </div>
    </main>
  );
}
