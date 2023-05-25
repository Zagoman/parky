import { TRPCError } from "@trpc/server"
import { filterUserForClient } from "utils/user"
import { z } from "zod"

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc"
const createSchema = z.object({
  firstName: z.string().min(3).max(255),
  lastName: z.string().min(3).max(255),
  username: z.string().min(3).max(255),
  phoneNumber: z.optional(z.string().min(8).max(16)),
  isDriver: z.boolean(),
  isOwner: z.boolean(),
  licensePlate: z.optional(z.string()),
  vehicleModel: z.optional(z.string()),
  vehicleSize: z.optional(
    z.union([
      z.literal("XSMALL"),
      z.literal("SMALL"),
      z.literal("MEDIUM"),
      z.literal("LARGE"),
      z.literal("XLARGE"),
    ])
  ),
})
const updateSchema = createSchema.extend({ username: z.string() })
export const profileRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.profile.findMany()
  }),
  getProfileById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { id: input.id },
      })
      return profile ? filterUserForClient(profile) : null
    }),
  getProfileByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { username: input.username },
      })

      return profile ? filterUserForClient(profile) : null
    }),
  getProfileReviews: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.profileReview.findMany({ where: { id: input.id } })
    }),
  create: privateProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.create({
        data: {
          ...input,
          id: ctx.userId,
        },
      })
      return filterUserForClient(profile)
    }),
  update: privateProcedure
    .input(updateSchema)
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.update({
        where: { username: input.username },
        data: {
          lastName: input.lastName,
          firstName: input.firstName,
          isOwner: input.isOwner,
          isDriver: input.isDriver,
          vehicleSize: input.vehicleSize || null,
          licensePlate: input.licensePlate || null,
          vehicleModel: input.vehicleModel || null,
        },
      })
      return filterUserForClient(profile)
    }),
  updateDriver: privateProcedure
    .input(
      z.object({
        id: z.string(),
        firstName: z.string().min(3).max(255),
        lastName: z.string().min(3).max(255),
        username: z.string().min(3).max(255),
        phoneNumber: z.optional(z.string().min(8).max(16)),
        vehicleSize: z.optional(
          z.union([
            z.literal("XSMALL"),
            z.literal("SMALL"),
            z.literal("MEDIUM"),
            z.literal("LARGE"),
            z.literal("XLARGE"),
          ])
        ),
        vehicleModel: z.string(),
        licensePlate: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.update({
        where: {
          id: input.id,
        },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          phoneNumber: input.phoneNumber,
          username: input.username,
          vehicleSize: input.vehicleSize,
        },
      })
      if (!profile) throw new TRPCError({ code: "NOT_FOUND" })
      return filterUserForClient(profile)
    }),
  updateOwner: privateProcedure
    .input(
      z.object({
        id: z.string(),
        firstName: z.string().min(3).max(255),
        lastName: z.string().min(3).max(255),
        username: z.string().min(3).max(255),
        phoneNumber: z.optional(z.string().min(8).max(16)),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.update({
        where: {
          id: input.id,
        },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          username: input.username,
          phoneNumber: input.phoneNumber,
        },
      })
      if (!profile) throw new TRPCError({ code: "NOT_FOUND" })
      return filterUserForClient(profile)
    }),
  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.delete({
        where: { id: input.id },
      })
      if (!profile) throw new TRPCError({ code: "NOT_FOUND" })
      return filterUserForClient(profile)
    }),
})
