import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.startsWith("file:")) {
    return envUrl;
  }

  // If running on Vercel or serverless environment with read-only filesystem
  if (process.env.VERCEL) {
    const tmpDbPath = path.join("/tmp", "dev.db");
    if (!fs.existsSync(tmpDbPath)) {
      const possibleLocations = [
        path.join(process.cwd(), "prisma", "dev.db"),
        path.join(process.cwd(), "dev.db"),
        path.join(__dirname, "..", "..", "prisma", "dev.db"),
        path.join(__dirname, "..", "prisma", "dev.db"),
      ];
      for (const loc of possibleLocations) {
        if (fs.existsSync(loc)) {
          try {
            fs.copyFileSync(loc, tmpDbPath);
            break;
          } catch (e) {
            console.error("Failed to copy db to /tmp:", e);
          }
        }
      }
    }
    return `file:${tmpDbPath}`;
  }

  return envUrl || "file:./dev.db";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

export const prisma = db;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
