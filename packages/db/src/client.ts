import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import * as schema from "./schema";

// eslint-disable-next-line unicorn/prevent-abbreviations
export const db = drizzle(sql, { schema });
