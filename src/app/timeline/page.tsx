"use client";
import React, { useContext } from "react";
import Canvas from "~/components/canvas";
import { TimeFormatContext } from "~/components/canvas";
import { api } from "~/trpc/react";

const now = new Date().toISOString();
export default function App() {
  const { is24Hour } = useContext(TimeFormatContext);
  const { data } = api.prayer.getPrayerTimings.useQuery({
    date: now,
    long: -122.0085,
    lat: 37.5339,
    elevation: 0,
    tz: -7,
    asr2: false,
    fajrAngle: 15,
    ishaAngle: 15,
  });

  if (!data)
    return (
      <Canvas>
        <div>Loading...</div>
      </Canvas>
    );

  const prayers = [data.fajr, data.shuruq, data.doha, data.dhuhar, data.asr, data.maghrib, data.isha, data.midnight];

  const formatTime = (time: number, name: string) => {
    let H = Math.floor(time);
    let m = Math.round((time - H) * 60);
    let period = "";

    if (name === "Midnight") {
      const adjustedTime = time % 24;
      H = Math.floor(adjustedTime);
      m = Math.round((adjustedTime - H) * 60);
      if (!is24Hour) {
        period = H >= 12 ? " PM" : " AM";
        if (H === 0) H = 12;
        else if (H > 12) H -= 12;
      }
      return `→ ${H.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}${period}`;
    }

    if (!is24Hour) {
      period = H >= 12 ? " PM" : " AM";
      if (H === 0) H = 12;
      else if (H > 12) H -= 12;
    }

    return `${H.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}${period}`;
  };

  return (
    <Canvas>
      <h1 className="mb-8 text-4xl font-bold">Prayer Timeline</h1>
      <div className="w-full max-w-md">
        {prayers.map((prayer) => (
          <div key={prayer.name} className="flex items-center gap-4 py-2">
            <div className="w-16 text-sm opacity-80">{formatTime(prayer.time, prayer.name)}</div>
            <div className="flex-1 text-lg">{prayer.name}</div>
            <div className="text-sm opacity-60">{prayer.type}</div>
          </div>
        ))}
      </div>
    </Canvas>
  );
}
