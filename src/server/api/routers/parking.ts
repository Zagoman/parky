import { ParkingSpot } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc"

const METER_UNIT = 0.00001
export const featuresSchema = z
  .union([
    z.literal("camera"),
    z.literal("charging"),
    z.literal("gate"),
    z.literal("garage"),
    z.literal("24/7"),
    z.literal("cctv"),
    z.literal("lights"),
    z.literal("roof"),
    z.literal("instant"),
  ])
  .array()
const createSchema = z.object({
  address: z.string().min(3).max(255),
  imageURL: z.optional(z.string()),
  price: z.number().multipleOf(0.00001),
  availableStart: z.string().datetime(),
  availableEnd: z.string().datetime(),
  features: featuresSchema,
  latitude: z.number(),
  longitude: z.number(),
  description: z.string().min(3).max(255),
  dimensions: z.enum(["XSMALL", "SMALL", "MEDIUM", "LARGE", "XLARGE"]),
})
const updateSchema = createSchema.extend({ id: z.string() })
export const parkingRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.parkingSpot.findMany()
  }),
  getShort: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.parkingSpot.findMany({
      select: {
        _count: {
          select: { Booking: true },
        },
        availableEnd: true,
        availableStart: true,
        price: true,
        imageURL: true,
        id: true,
        address: true,
        rating: true,
        features: true,
        dimensions: true,
        latitude: true,
        longitude: true,
      },
    })
  }),
  getParkingWithinRange: publicProcedure
    .input(
      z.object({
        current: z.object({ latitude: z.number(), longitude: z.number() }),
        range: z.number().min(15).max(100_000), //Range in meters
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.parkingSpot.findMany({
        where: {
          latitude: {
            lt: input.current.latitude + input.range * METER_UNIT,
            gt: input.current.latitude - input.range * METER_UNIT,
          },
          longitude: {
            lt: input.current.longitude + input.range * METER_UNIT,
            gt: input.current.longitude - input.range * METER_UNIT,
          },
        },
        select: {
          _count: {
            select: { Booking: true },
          },
          availableEnd: true,
          availableStart: true,
          price: true,
          imageURL: true,
          id: true,
          address: true,
          rating: true,
          features: true,
          dimensions: true,
          latitude: true,
          longitude: true,
          description: true,
        },
      })
    }),
  getParkingById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const parking = await ctx.prisma.parkingSpot.findFirst({
        where: { id: input.id },
        select: {
          availableEnd: true,
          availableStart: true,
          price: true,
          imageURL: true,
          id: true,
          address: true,
          features: true,
          dimensions: true,
          latitude: true,
          longitude: true,
          description: true,
        },
      })

      if (!parking) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Parking not found" })
      }
      return {
        ...parking,
        availableStart: parking.availableStart.toISOString().slice(0, 16),
        availableEnd: parking.availableEnd.toISOString().slice(0, 16),
        longitude: String(parking.longitude),
        latitude: String(parking.latitude),
      }
    }),

  create: privateProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      const parking = await ctx.prisma.parkingSpot.create({
        data: {
          rating: 5.0,
          profileId: ctx.userId,
          ...input,
          availableEnd: new Date(input.availableEnd),
          availableStart: new Date(input.availableStart),
        },
      })
      return parking
    }),

  update: privateProcedure
    .input(updateSchema)
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.update({
        where: { id: ctx.userId },
        include: {
          ParkingSpot: { where: { id: input.id } },
        },
        data: {
          ParkingSpot: {
            update: {
              where: { id: input.id },
              data: {
                address: input.address,
                imageURL: input.imageURL,
                price: input.price,
                availableStart: new Date(input.availableStart),
                availableEnd: new Date(input.availableEnd),
                features: input.features,
                description: input.description,
                dimensions: input.dimensions,
                latitude: input.latitude,
                longitude: input.longitude,
              },
            },
          },
        },
      })
      if (!profile) throw new TRPCError({ code: "NOT_FOUND" })
      return profile.ParkingSpot[0]
    }),

  delete: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const parking = await ctx.prisma.parkingSpot.delete({
        where: { id: input.id },
      })
      if (!parking) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }
      return parking
    }),
})
