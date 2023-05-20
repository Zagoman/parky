import { createTRPCRouter } from "~/server/api/trpc";
import { profileRouter } from "~/server/api/routers/profile";
import { parkingRouter } from "~/server/api/routers/parking";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    profile: profileRouter,
    parking: parkingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
