"use client";
import React, { useEffect, useState } from "react";
import { type DTPrayerTime } from "~/server/api/routers/prayer";

interface PrayerCardProps {
  datum: DTPrayerTime;
}

export default function PrayerCard({ datum }: PrayerCardProps) {
  const [text, setText] = useState(`${datum.name} is in 00:00`);

  useEffect(() => {
    function convertToReadable() {
      const { time, name } = datum;
      const now = new Date();
      const prayerTime = new Date();
      const H = Math.floor(time);
      const m = Math.round((time - H) * 60);
      const s = Math.round((time - H - m / 60) * 3600);
      prayerTime.setHours(H, m, s);
      const diff = (prayerTime.getTime() - now.getTime()) / (1000 * 3600);
      const hour = Math.floor(diff);
      const min = Math.round((diff - hour) * 60);
      const sec = Math.round((diff - hour - min / 60) * 3600);
      if (diff < 1) {
        if (diff <= 0) {
          setText(`${name} is in 00:00`);
        }
        setText(`${name} is in ${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`);
      } else {
        setText(`${name} is in ${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`);
      }
    }

    convertToReadable();
    const interval = setInterval(convertToReadable, 1000);
    return () => clearInterval(interval);
  }, [datum]);

  return (
    <div
      className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
      key={datum.name}
    >
      {text}
    </div>
  );
}
