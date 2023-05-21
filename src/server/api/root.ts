import { createTRPCRouter } from "~/server/api/trpc"
import { profileRouter } from "~/server/api/routers/profile"
import { parkingRouter } from "~/server/api/routers/parking"
import { coinRouter } from "./routers/coin"
import { bookingRouter } from "./routers/booking"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  profile: profileRouter,
  parking: parkingRouter,
  coin: coinRouter,
  booking: bookingRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
