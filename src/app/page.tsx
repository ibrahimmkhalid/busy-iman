"use client";
import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react";

const colorCodes = {
  valid: "text-green-500",
  busy: "text-red-500",
  critical: "text-black",
};

const colorCode = colorCodes.valid;

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

const now = new Date();

function getCurrentGradient(): DTGradient {
  const hours = now.getHours();
  if (hours < 5) {
    return gradients[0]!;
  }
  if (hours < 11) {
    return gradients[1]!;
  }
  if (hours < 18) {
    return gradients[2]!;
  }
  return gradients[3]!;
}

export default function HomePage() {
  const [gradient, setGradient] = useState(getCurrentGradient());

  const { data: prayerTimings, isLoading } = api.prayer.getPrayerTimings.useQuery({
    date: now.toISOString(),
    long: 37.5339,
    lat: -122.0085,
    elevation: 0,
    tz: -7,
    asr2: true,
    fajrAngle: 15,
    ishaAngle: 15,
  });

  function getCurrentPrayer() {
    if (prayerTimings === undefined) return "invalid";
    console.log(JSON.stringify(prayerTimings).replaceAll("},", "},\n"));
    return "pqoiwe";
  }

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
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="rounded-full bg-white/10 px-16 py-8 text-5xl font-extrabold tracking-tight text-white hover:bg-white/20 sm:text-[5rem]">
          {isLoading ? (
            <span className={colorCode}>loading...</span>
          ) : (
            <span className={colorCode}>{getCurrentPrayer()}</span>
          )}
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
