import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { certifications, examDomains } from "./schema";
import { DEFAULT_CERTIFICATION_TRACKS } from "../admin-certifications";

async function seedDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("No DATABASE_URL found in .env.local");
    process.exit(1);
  }

  console.log("Connecting to Neon PostgreSQL...");
  const sql = neon(connectionString);
  const db = drizzle(sql);

  console.log("Seeding Certification Tracks...");
  for (const track of DEFAULT_CERTIFICATION_TRACKS) {
    await db
      .insert(certifications)
      .values({
        id: track.id,
        code: track.code,
        name: track.title,
        description: track.shortDescription,
        totalQuestions: track.totalQuestions,
        examDurationMinutes: track.durationMinutes,
        passingScorePercentage: track.passingPercentage,
        isActive: track.status === "active",
      })
      .onConflictDoNothing();

    console.log(`✓ Seeded Certification: ${track.code} (${track.title})`);

    for (let i = 0; i < track.domains.length; i++) {
      const domain = track.domains[i];
      await db
        .insert(examDomains)
        .values({
          id: `${track.id}-${domain.slug}`,
          certificationId: track.id,
          slug: domain.slug,
          title: domain.name,
          weightPercentage: domain.weight,
          orderIndex: i + 1,
        })
        .onConflictDoNothing();
    }
  }

  console.log("✓ Seeding completed successfully!");
}

seedDatabase().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
