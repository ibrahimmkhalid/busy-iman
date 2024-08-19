import React from "react";
import Canvas from "~/components/canvas";
import CurrentPrayer from "~/components/currentPrayer";
import PrayerCounter from "~/components/prayerCounter";
import { api } from "~/trpc/server";

const now = new Date().toISOString();
export default async function App() {
  const data = await api.prayer.getPrayerTimings({
    date: now,
    long: -122.0085,
    lat: 37.5339,
    elevation: 0,
    tz: -7,
    asr2: false,
    fajrAngle: 15,
    ishaAngle: 15,
  });

  return (
    <Canvas>
      <CurrentPrayer prayerTimings={data} />
      <PrayerCounter prayerTimings={data} />
    </Canvas>
  );
}
