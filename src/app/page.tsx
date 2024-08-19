"use client";
import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { type DTPrayerTime } from "~/server/api/routers/prayer";

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

const defaultPrayer: DTPrayerTime = {
  time: 0,
  type: "forbidden",
  name: "invalid",
};

export default function HomePage() {
  const [gradient, setGradient] = useState(gradients[0]);
  const [currentPrayer, setCurrentPrayer] = useState<DTPrayerTime>(defaultPrayer);

  const { data: prayerTimings, isLoading } = api.prayer.getPrayerTimings.useQuery({
    date: new Date().toISOString(),
    long: -122.0085,
    lat: 37.5339,
    elevation: 0,
    tz: -7,
    asr2: false,
    fajrAngle: 15,
    ishaAngle: 15,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
      if (hour < 5 && hour >= 0) {
        setGradient(gradients[0]);
      }
      if (hour < 11 && hour >= 5) {
        setGradient(gradients[1]);
      }
      if (hour < 18 && hour >= 11) {
        setGradient(gradients[2]);
      }
      if (hour >= 18) {
        setGradient(gradients[3]);
      }

      if (prayerTimings === undefined) {
        setCurrentPrayer(defaultPrayer);
      } else {
        if (hour >= prayerTimings.fajr.time && hour < prayerTimings.shuruq.time) setCurrentPrayer(prayerTimings.fajr);
        if (hour >= prayerTimings.shuruq.time && hour < prayerTimings.dhuhar.time)
          setCurrentPrayer(prayerTimings.shuruq);
        if (hour >= prayerTimings.dhuhar.time && hour < prayerTimings.asr.time) setCurrentPrayer(prayerTimings.dhuhar);
        if (hour >= prayerTimings.asr.time && hour < prayerTimings.maghrib.time) setCurrentPrayer(prayerTimings.asr);
        if (hour >= prayerTimings.maghrib.time && hour < prayerTimings.isha.time)
          setCurrentPrayer(prayerTimings.maghrib);
        if (hour >= prayerTimings.isha.time) setCurrentPrayer(prayerTimings.isha);
      }
    }, 60000);
    return () => clearInterval(interval);
  });

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
            <span className={colorCode}>{currentPrayer.name}</span>
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
