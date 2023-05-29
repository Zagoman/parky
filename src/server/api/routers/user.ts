import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc"

export const userRouter = createTRPCRouter({
  getUserId: publicProcedure.query(({ ctx }) => {
    return ctx.userId
  }),
})
