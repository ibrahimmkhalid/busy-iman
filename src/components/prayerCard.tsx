"use client";
import React, { useEffect, useState, useContext } from "react";
import { type DTPrayerTime } from "~/server/api/routers/prayer";
import { TimeFormatContext } from "./canvas";

interface PrayerCardProps {
  datum: DTPrayerTime;
}

export default function PrayerCard({ datum }: PrayerCardProps) {
  const [countdown, setCountdown] = useState("00:00");
  const [isCurrent, setIsCurrent] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const { is24Hour } = useContext(TimeFormatContext);

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

  useEffect(() => {
    function updateCard() {
      const { time, end } = datum;
      const now = new Date();
      const currentHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;

      const ended = currentHour >= end;
      const current = currentHour >= time && currentHour < end;

      setIsCurrent(current);
      setIsEnded(ended);

      const prayerTime = new Date();
      const H = Math.floor(time);
      const m = Math.round((time - H) * 60);
      const s = Math.round((time - H - m / 60) * 3600);
      prayerTime.setHours(H, m, s);
      const diff = (prayerTime.getTime() - now.getTime()) / (1000 * 3600);
      const hour = Math.floor(diff);
      const min = Math.floor((diff - hour) * 60);
      const sec = Math.round((diff - hour - min / 60) * 3600);

      if (ended) {
        setCountdown("Ended");
      } else if (diff <= 0) {
        setCountdown("Now");
      } else if (diff < 1) {
        setCountdown(`${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`);
      } else {
        setCountdown(`${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`);
      }
    }

    updateCard();
    const interval = setInterval(updateCard, 1000);
    return () => clearInterval(interval);
  }, [datum]);

  return (
    <div
      className={`flex max-w-xs flex-col gap-2 rounded-xl p-4 text-white transition-all duration-300 ${
        isCurrent
          ? "border-2 border-white/50 bg-white/30 shadow-lg"
          : isEnded
            ? "bg-white/5 opacity-60"
            : "bg-white/10 hover:bg-white/20"
      }`}
    >
      <div className="text-lg font-semibold">{datum.name}</div>
      <div className="text-sm opacity-80">{formatTime(datum.time, datum.name)}</div>
      <div className="text-sm">{countdown}</div>
    </div>
  );
}
