import { TRPCError } from "@trpc/server"
import { z } from "zod"
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc"

export const parkingReviewRouter = createTRPCRouter({
  getParkingReviewByParkingId: publicProcedure
    .input(z.object({ parkingId: z.string() }))
    .query(async ({ ctx, input }) => {
      const aggregate = await ctx.prisma.parkingReview.aggregate({
        where: { parkingId: input.parkingId },
        _avg: { rating: true },
      })
      if (!aggregate) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Parking not found" })
      }
      return aggregate
    }),
  getAllById: publicProcedure
    .input(
      z.object({
        parkingId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.prisma.parkingReview.findMany({
        where: { parkingId: input.parkingId },
      })
      if (!reviews) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No parking was found matching the parking id given",
        })
      }
      return reviews
    }),
  create: privateProcedure
    .input(
      z.object({
        parkingId: z.string(),
        rating: z.number(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const aggregate = await ctx.prisma.parkingReview.aggregate({
        where: {
          parkingId: input.parkingId,
        },
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
      })
      const average = aggregate._avg.rating
        ? (
            (aggregate._avg.rating * aggregate._count.rating + input.rating) /
            (aggregate._count.rating + 1)
          ).toFixed(1)
        : (5).toFixed(1)
      const parking = await ctx.prisma.parkingSpot.update({
        where: {
          id: input.parkingId,
        },
        data: {
          rating: Number(average),
        },
      })
      if (!parking) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" })
      }
      const review = await ctx.prisma.parkingReview.create({
        data: {
          profileId: ctx.userId,
          parkingId: input.parkingId,
          rating: input.rating,
          content: input.content,
        },
      })

      if (!review) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "It wasn't possible to create your review, try again later",
        })
      }
      return review
    }),
  update: privateProcedure
    .input(
      z.object({
        parkingId: z.string(),
        reviewerId: z.string(),
        reviewId: z.string(),
        rating: z.number(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.userId !== input.reviewerId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update this review",
        })
      }
      const review = await ctx.prisma.parkingReview.update({
        where: {
          id: input.reviewId,
        },
        data: {
          rating: input.rating,
          content: input.content,
        },
      })
      if (!review) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Parking not found",
        })
      }
      const aggregate = await ctx.prisma.parkingReview.aggregate({
        where: {
          parkingId: input.parkingId,
        },
        _avg: {
          rating: true,
        },
      })
      const parking = await ctx.prisma.parkingSpot.update({
        where: {
          id: input.parkingId,
        },
        data: {
          rating: Number(aggregate._avg.rating?.toFixed(1)),
        },
      })
      if (!parking) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Parking not found" })
      }

      return review
    }),
  delete: privateProcedure
    .input(z.object({ profileId: z.string(), reviewId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.userId !== input.profileId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete this review",
        })
      }
      const review = await ctx.prisma.parkingReview.delete({
        where: { id: input.reviewId },
      })
      if (!review) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Review not found" })
      }
      return review
    }),
})
