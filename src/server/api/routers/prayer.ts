import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "~/server/api/trpc";

export interface DTPrayerTime {
  time: number;
  type: "fard" | "nafl" | "forbidden";
  name: string;
}

export interface DTAllPrayers {
  fajr: DTPrayerTime;
  shuruq: DTPrayerTime;
  doha: DTPrayerTime;
  dhuhar: DTPrayerTime;
  asr: DTPrayerTime;
  maghrib: DTPrayerTime;
  isha: DTPrayerTime;
  midnight: { time: number; today: boolean };
}

function deg2rad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function rad2deg(rad: number): number {
  return rad * (180 / Math.PI);
}

function HourAngleFromSunAltitude(SA: number, LAT: number, DELTA: number): number {
  return rad2deg(
    Math.acos(
      (Math.sin(deg2rad(SA)) - Math.sin(deg2rad(LAT)) * Math.sin(deg2rad(DELTA))) /
        (Math.cos(deg2rad(LAT)) * Math.cos(deg2rad(DELTA))),
    ),
  );
}

const PrayerInputSchema = z.object({
  date: z.string().datetime(),
  long: z.number(),
  lat: z.number(),
  elevation: z.number().nullish(),
  tz: z.number(),
  asr2: z.boolean(),
  fajrAngle: z.number(),
  ishaAngle: z.number(),
});

type DTPrayerInput = z.infer<typeof PrayerInputSchema>;

function calculateTimingsForGivenDate(datetime: Date, input: DTPrayerInput): DTAllPrayers {
  let Y = datetime.getFullYear();
  let M = datetime.getMonth() + 1;
  const D = datetime.getDate();
  const H = datetime.getHours();
  const HHHH = input.elevation ?? 0;
  const m = datetime.getMinutes();
  const s = datetime.getSeconds();
  const Z = input.tz;
  const LONG = input.long;
  const LAT = input.lat;
  const FAJR_ANGLE = input.fajrAngle;
  const ISHA_ANGLE = input.ishaAngle;
  const SF = input.asr2 ? 2 : 1;

  if (M <= 2) {
    M += 12;
    Y -= 1;
  }

  const A = Math.floor(Y / 100);
  const B = 2 + Math.floor(A / 4) - A;

  const JD =
    1720994.5 +
    Math.floor(365.25 * Y) +
    Math.floor(30.6001 * (M + 1)) +
    B +
    D +
    (H * 3600 + m * 60 + s) / 86400 -
    Z / 24;

  const T = (2 * Math.PI * (JD - 2451545)) / 365.25;

  const DELTA =
    0.37877 +
    23.264 * Math.sin(deg2rad(57.297 * T - 79.547)) +
    0.3812 * Math.sin(deg2rad(2 * 57.297 * T - 82.682)) +
    0.17132 * Math.sin(deg2rad(3 * 57.297 * T - 59.722));

  const U = (JD - 2451545) / 36525;
  const L0 = 280.46607 + 36000.7698 * U;
  const ET1000 =
    -(1789 + 237 * U) * Math.sin(deg2rad(L0)) -
    (7146 - 62 * U) * Math.cos(deg2rad(L0)) +
    (9934 - 14 * U) * Math.sin(deg2rad(2 * L0)) -
    (29 + 5 * U) * Math.cos(deg2rad(2 * L0)) +
    (74 + 10 * U) * Math.sin(deg2rad(3 * L0)) +
    (320 - 4 * U) * Math.cos(deg2rad(3 * L0)) -
    212 * Math.sin(deg2rad(4 * L0));
  const ET = ET1000 / 1000;

  const TT = 12 + Z - LONG / 15 - ET / 60;

  const SA_FAJR = -FAJR_ANGLE;
  const SA_SUNRISE = -0.8333 - 0.0347 * Math.sqrt(HHHH);
  const SA_ASR = rad2deg(Math.atan(1 / (SF + Math.tan(deg2rad(Math.abs(DELTA - LAT))))));
  const SA_MAGHRIB = SA_SUNRISE;
  const SA_ISHA = -ISHA_ANGLE;

  const HA_FAJR = HourAngleFromSunAltitude(SA_FAJR, LAT, DELTA);
  const HA_SUNRISE = HourAngleFromSunAltitude(SA_SUNRISE, LAT, DELTA);
  const HA_ASR = HourAngleFromSunAltitude(SA_ASR, LAT, DELTA);
  const HA_MAGHRIB = HourAngleFromSunAltitude(SA_MAGHRIB, LAT, DELTA);
  const HA_ISHA = HourAngleFromSunAltitude(SA_ISHA, LAT, DELTA);

  const FAJR = TT - HA_FAJR / 15;
  const SUNRISE = TT - HA_SUNRISE / 15;
  const ZUHR = TT + 2 / 60;
  const ASR = TT + HA_ASR / 15;
  const MAGHRIB = TT + HA_MAGHRIB / 15;
  const ISHA = TT + HA_ISHA / 15;

  return {
    fajr: {
      time: FAJR,
      type: "fard",
      name: "Fajr",
    },
    shuruq: {
      time: SUNRISE,
      type: "forbidden",
      name: "Shuruq",
    },
    doha: {
      time: SUNRISE + 1 / 3,
      type: "nafl",
      name: "Doha",
    },
    dhuhar: {
      time: ZUHR,
      type: "fard",
      name: "Dhuhr",
    },
    asr: {
      time: ASR,
      type: "fard",
      name: "Asr",
    },
    maghrib: {
      time: MAGHRIB,
      type: "fard",
      name: "Maghrib",
    },
    isha: {
      time: ISHA,
      type: "fard",
      name: "Isha",
    },
    midnight: {
      time: 0,
      today: false,
    },
  } as DTAllPrayers;
}

export const prayerRouter = createTRPCRouter({
  getPrayerTimings: publicProcedure.input(PrayerInputSchema).query(({ input }) => {
    const datetime = new Date(input.date);
    const todayTimings = calculateTimingsForGivenDate(datetime, input);
    datetime.setDate(datetime.getDate() + 1);
    const tmrwTimings = calculateTimingsForGivenDate(datetime, input);
    const todayMaghrib = todayTimings.maghrib.time;
    const tmrwFajr = tmrwTimings.fajr.time + 24;
    const midnight = (todayMaghrib + tmrwFajr) / 2;
    todayTimings.midnight = {
      time: midnight,
      today: midnight < 24,
    };

    return todayTimings;
  }),
});
