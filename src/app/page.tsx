import React from "react";
import Canvas from "~/components/canvas";
import CurrentPrayer from "~/components/currentPrayer";
import { api } from "~/trpc/server";

export default async function App() {
  const data = await api.prayer.getPrayerTimings({
    date: new Date().toISOString(),
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
    </Canvas>
  );
}
