import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "";

// Configure Neon HTTP fetchEndpoint to support cluster subdomains (e.g. .c-7.us-east-2.aws.neon.tech)
neonConfig.fetchEndpoint = (host: string) => {
  return `https://${host}/sql`;
};

// Neon HTTP serverless connection
const sql = neon(connectionString);

export const db = drizzle(sql, { schema });
export * from "./schema";
