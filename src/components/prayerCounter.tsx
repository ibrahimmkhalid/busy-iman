"use client";
import React from "react";
import { type DTPrayerTime, type DTAllPrayers } from "~/server/api/routers/prayer";

interface PrayerCounterProps {
  prayerTimings: DTAllPrayers;
}

// const defaultPrayer: DTPrayerTime = {
//   time: 0,
//   type: "forbidden",
//   name: "invalid",
// };
//

function convertHourToTime(hour: number): string {
  const H = Math.floor(hour);
  const m = Math.round((hour - H) * 60);
  return `${H}:${m}`;
}

export default function PrayerCounter({ prayerTimings }: PrayerCounterProps) {
  const iter: DTPrayerTime[] = [
    prayerTimings.fajr,
    prayerTimings.shuruq,
    prayerTimings.doha,
    prayerTimings.dhuhar,
    prayerTimings.asr,
    prayerTimings.maghrib,
    prayerTimings.isha,
    prayerTimings.midnight,
  ];
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {iter.map((datum) => (
        <div
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
          key={datum.name}
        >
          {datum.name} at {convertHourToTime(datum.time)}. It is {datum.type}
        </div>
      ))}
    </div>
  );
}
