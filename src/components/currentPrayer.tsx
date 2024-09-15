"use client";
import React, { useState, useEffect } from "react";
import { type DTPrayerTime, type DTAllPrayers } from "~/server/api/routers/prayer";

interface CurrentPrayerProps {
  prayerTimings: DTAllPrayers;
}

const defaultPrayer: DTPrayerTime = {
  time: 0,
  end: 0,
  type: "forbidden",
  name: "loading...",
};

export default function CurrentPrayer({ prayerTimings }: CurrentPrayerProps) {
  const [currentPrayer, setCurrentPrayer] = useState<DTPrayerTime>(defaultPrayer);

  useEffect(() => {
    function getCurrentPrayer() {
      const now = new Date();
      const hour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;

      if (prayerTimings === undefined) {
        setCurrentPrayer(defaultPrayer);
      } else {
        if (hour >= prayerTimings.fajr.time && hour < prayerTimings.shuruq.time)
          return setCurrentPrayer(prayerTimings.fajr);
        if (hour >= prayerTimings.shuruq.time && hour < prayerTimings.doha.time)
          return setCurrentPrayer(prayerTimings.shuruq);
        if (hour >= prayerTimings.doha.time && hour < prayerTimings.dhuhar.time)
          return setCurrentPrayer(prayerTimings.doha);
        if (hour >= prayerTimings.dhuhar.time && hour < prayerTimings.asr.time)
          return setCurrentPrayer(prayerTimings.dhuhar);
        if (hour >= prayerTimings.asr.time && hour < prayerTimings.maghrib.time)
          return setCurrentPrayer(prayerTimings.asr);
        if (hour >= prayerTimings.maghrib.time && hour < prayerTimings.isha.time)
          return setCurrentPrayer(prayerTimings.maghrib);
        if (hour >= prayerTimings.isha.time && hour < prayerTimings.midnight.time)
          return setCurrentPrayer(prayerTimings.isha);
        return setCurrentPrayer(prayerTimings.midnight);
      }
    }

    getCurrentPrayer();
    const interval = setInterval(getCurrentPrayer, 1000);
    return () => clearInterval(interval);
  }, [prayerTimings]);

  return (
    <h1 className="rounded-full bg-white/10 px-16 py-8 text-5xl font-extrabold tracking-tight text-white hover:bg-white/20 sm:text-[5rem]">
      <span>{currentPrayer.name}</span>
    </h1>
  );
}
