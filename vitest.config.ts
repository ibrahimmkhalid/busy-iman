import { join } from "path";
import { loadEnvFile } from "process";
import { defineConfig } from "vitest/config";

loadEnvFile();

export default defineConfig({
  resolve: {
    alias: {
      "~/": join(__dirname, "./src/"),
    },
  },
});
