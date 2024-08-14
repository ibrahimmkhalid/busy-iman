import { publicProcedure, createTRPCRouter } from "~/server/api/trpc";

export const prayerRouter = createTRPCRouter({
  getCurrentPrayer: publicProcedure.query(() => "Asr"),
});
