import { TRPCError } from "@trpc/server"
import { z } from "zod"
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc"

export const profileReviewRouter = createTRPCRouter({
  getProfileReviewByProfileId: publicProcedure
    .input(z.object({ profileId: z.string() }))
    .query(async ({ ctx, input }) => {
      const aggregate = await ctx.prisma.profileReview.aggregate({
        where: { profileId: input.profileId },
        _avg: { rating: true },
      })
      if (!aggregate) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Profile not found" })
      }
      return aggregate
    }),
  getAllById: publicProcedure
    .input(
      z.object({
        profileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.prisma.profileReview.findMany({
        where: { profileId: input.profileId },
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
        profileId: z.string(),
        parkingId: z.string(),
        rating: z.number(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const aggregate = await ctx.prisma.profileReview.aggregate({
        where: {
          profileId: input.profileId,
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
      const profile = await ctx.prisma.profile.update({
        where: {
          id: input.profileId,
        },
        data: {
          rating: Number(average),
        },
      })
      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" })
      }
      const review = await ctx.prisma.profileReview.create({
        data: {
          issuedFromParkingId: input.parkingId,
          profileId: input.profileId,
          content: input.content,
          rating: input.rating,
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
        profileId: z.string(),
        reviewId: z.string(),
        rating: z.number(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.prisma.profileReview.update({
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
          message: "Review not found",
        })
      }
      const aggregate = await ctx.prisma.profileReview.aggregate({
        where: {
          profileId: input.profileId,
        },
        _avg: {
          rating: true,
        },
      })
      const profile = await ctx.prisma.profile.update({
        where: {
          id: input.profileId,
        },
        data: {
          rating: Number(aggregate._avg.rating?.toFixed(1)),
        },
      })
      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" })
      }

      return review
    }),
  delete: privateProcedure
    .input(z.object({ reviewId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.prisma.profileReview.delete({
        where: { id: input.reviewId },
      })
      if (!review) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Review not found" })
      }
      return review
    }),
})
