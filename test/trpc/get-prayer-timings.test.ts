import { expect, it } from "vitest";

import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { type RouterOutputs, type RouterInputs } from "~/trpc/react";

it("should calculate the correct times of prayer for jakarta", async () => {
  const ctx = createInnerTRPCContext();
  const caller = appRouter.createCaller(ctx);

  // data from: https://radhifadlillah.com/blog/2020-09-06-calculating-prayer-times/
  const input: RouterInputs["prayer"]["getPrayerTimings"] = {
    date: "2020-09-06T12:00:00Z",
    long: 106.816667,
    lat: -6.2,
    tz: 7,
    asr2: false,
    fajrAngle: 20,
    ishaAngle: 18,
    elevation: 8,
  };
  const output: RouterOutputs["prayer"]["getPrayerTimings"] = {
    fajr: {
      time: 4.5493,
      type: "fard",
    },
    shuruq: {
      time: 5.8332,
      type: "forbidden",
    },
    doha: {
      time: 6.1665,
      type: "nafl",
    },
    dhuhar: {
      time: 11.8839,
      type: "fard",
    },
    asr: {
      time: 15.1324,
      type: "fard",
    },
    maghrib: {
      time: 17.8681,
      type: "fard",
    },
    isha: {
      time: 19.0175,
      type: "fard",
    },
    midnight: undefined,
  };

  const result = await caller.prayer.getPrayerTimings(input);

  const margin = 1 / 60; // each calculated time should be within x minutes of expected time (x/60)

  expect(result.fajr.time).toBeGreaterThanOrEqual(output.fajr.time - margin);
  expect(result.fajr.time).toBeLessThanOrEqual(output.fajr.time + margin);
  expect(result.shuruq.time).toBeGreaterThanOrEqual(output.shuruq.time - margin);
  expect(result.shuruq.time).toBeLessThanOrEqual(output.shuruq.time + margin);
  expect(result.doha.time).toBeGreaterThanOrEqual(output.doha.time - margin);
  expect(result.doha.time).toBeLessThanOrEqual(output.doha.time + margin);
  expect(result.dhuhar.time).toBeGreaterThanOrEqual(output.dhuhar.time - margin);
  expect(result.dhuhar.time).toBeLessThanOrEqual(output.dhuhar.time + margin);
  expect(result.asr.time).toBeGreaterThanOrEqual(output.asr.time - margin);
  expect(result.asr.time).toBeLessThanOrEqual(output.asr.time + margin);
  expect(result.maghrib.time).toBeGreaterThanOrEqual(output.maghrib.time - margin);
  expect(result.maghrib.time).toBeLessThanOrEqual(output.maghrib.time + margin);
  expect(result.isha.time).toBeGreaterThanOrEqual(output.isha.time - margin);
  expect(result.isha.time).toBeLessThanOrEqual(output.isha.time + margin);
});

it("should calculate the correct times of prayer for fremont", async () => {
  const ctx = createInnerTRPCContext();
  const caller = appRouter.createCaller(ctx);

  const input: RouterInputs["prayer"]["getPrayerTimings"] = {
    date: "2024-08-18T12:00:00Z",
    long: -122.00859756619661,
    lat: 37.53391851116302,
    tz: -7,
    asr2: false,
    fajrAngle: 15,
    ishaAngle: 15,
    elevation: 8,
  };

  // times collected from "MAWAQIT" app using ISNA settings
  const output: RouterOutputs["prayer"]["getPrayerTimings"] = {
    fajr: {
      time: 5 + 9 / 60,
      type: "fard",
    },
    shuruq: {
      time: 6 + 27 / 60,
      type: "forbidden",
    },
    doha: {
      time: 6 + 47 / 60,
      type: "nafl",
    },
    dhuhar: {
      time: 13 + 13 / 60,
      type: "fard",
    },
    asr: {
      time: 16 + 56 / 60,
      type: "fard",
    },
    maghrib: {
      time: 19 + 56 / 60,
      type: "fard",
    },
    isha: {
      time: 21 + 13 / 60,
      type: "fard",
    },
    midnight: undefined,
  };

  const result = await caller.prayer.getPrayerTimings(input);

  const margin = 1.5 / 60; // each calculated time should be within x minutes of expected time (x/60)

  expect(result.fajr.time).toBeGreaterThanOrEqual(output.fajr.time - margin);
  expect(result.fajr.time).toBeLessThanOrEqual(output.fajr.time + margin);
  expect(result.shuruq.time).toBeGreaterThanOrEqual(output.shuruq.time - margin);
  expect(result.shuruq.time).toBeLessThanOrEqual(output.shuruq.time + margin);
  expect(result.doha.time).toBeGreaterThanOrEqual(output.doha.time - margin);
  expect(result.doha.time).toBeLessThanOrEqual(output.doha.time + margin);
  expect(result.dhuhar.time).toBeGreaterThanOrEqual(output.dhuhar.time - margin);
  expect(result.dhuhar.time).toBeLessThanOrEqual(output.dhuhar.time + margin);
  expect(result.asr.time).toBeGreaterThanOrEqual(output.asr.time - margin);
  expect(result.asr.time).toBeLessThanOrEqual(output.asr.time + margin);
  expect(result.maghrib.time).toBeGreaterThanOrEqual(output.maghrib.time - margin);
  expect(result.maghrib.time).toBeLessThanOrEqual(output.maghrib.time + margin);
  expect(result.isha.time).toBeGreaterThanOrEqual(output.isha.time - margin);
  expect(result.isha.time).toBeLessThanOrEqual(output.isha.time + margin);
});
