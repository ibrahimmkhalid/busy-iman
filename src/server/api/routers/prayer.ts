import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "~/server/api/trpc";

interface DTPrayerTime {
  time: EpochTimeStamp;
  type: "fard" | "nafl" | "forbidden";
}

interface DTAllPrayers {
  fajr: DTPrayerTime;
  shuruq: DTPrayerTime;
  doha: DTPrayerTime;
  dhuhar: DTPrayerTime;
  asr: DTPrayerTime;
  maghrib: DTPrayerTime;
  isha: DTPrayerTime;
  midnight: DTPrayerTime;
}

export const prayerRouter = createTRPCRouter({
  getPrayerTimings: publicProcedure
    .input(
      z.object({
        date: z.string().date(),
        long: z.number(),
        lat: z.number(),
        elevation: z.number().nullish(),
        tz: z.number(),
        asr2: z.boolean(),
        fajrAngle: z.number(),
        ishaAngle: z.number(),
      }),
    )
    .query(({ input }) => {
      console.log(input.tz);
      ////TODO: Actual implementation
      const tmp: DTPrayerTime[] = [
        {
          time: 1230487123,
          type: "fard",
        },
      ];

      return tmp;
    }),
});
