// Ensure DATABASE_URL is set before the shared Prisma client initializes.
// Imports are hoisted, so this must run via Next.js env config (see next.config.ts).
export { prisma } from "../../../src/lib/prisma";
