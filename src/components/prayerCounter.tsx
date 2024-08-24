"use client";
import React from "react";
import { type DTPrayerTime, type DTAllPrayers } from "~/server/api/routers/prayer";
import PrayerCard from "./prayerCard";

interface PrayerCounterProps {
  prayerTimings: DTAllPrayers;
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
        <PrayerCard datum={datum} key={datum.name} />
      ))}
    </div>
  );
}
