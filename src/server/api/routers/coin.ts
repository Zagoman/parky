import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc"

export const coinRouter = createTRPCRouter({
  addCoin: privateProcedure
    .input(
      z.object({
        amount: z.number().min(0).max(100_000),
        toAccountId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.update({
        where: { id: input.toAccountId },
        data: {
          balance: {
            increment: input.amount,
          },
        },
      })

      const order = await ctx.prisma.coinOrder.create({
        data: {
          profileId: input.toAccountId,
          amount: input.amount,
        },
      })

      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" })
      }
      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Transaction incomplete",
        })
      }
      return { profile, order }
    }),
  subtractCoin: privateProcedure
    .input(
      z.object({
        amount: z.number().min(0).max(100_000),
        fromAccountId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const balance = await ctx.prisma.profile.findUnique({
        where: { id: input.fromAccountId },
        select: {
          balance: true,
        },
      })

      const profile =
        balance?.balance && balance.balance >= input.amount
          ? await ctx.prisma.profile.update({
              where: { id: input.fromAccountId },
              data: {
                balance: {
                  decrement: input.amount,
                },
              },
            })
          : null

      const order = profile
        ? await ctx.prisma.coinOrder.create({
            data: {
              profileId: input.fromAccountId,
              amount: -input.amount,
            },
          })
        : null

      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" })
      }
      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Transaction incomplete",
        })
      }
      return { profile, order }
    }),
})
