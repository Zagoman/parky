import { TRPCError } from "@trpc/server"
import { throws } from "assert"
import { z } from "zod"
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc"

export const bookingRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        parkingId: z.string(),
        driverId: z.string(),
        start: z.string().datetime(),
        end: z.string().datetime(),
        price: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.update({
        where: { id: ctx.userId },
        data: {
          balance: { decrement: input.price },
        },
      })
      if (!profile) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You must signin first",
        })
      }
      const parking = await ctx.prisma.parkingSpot.update({
        where: { id: input.parkingId },
        data: {
          profile: {
            update: {
              balance: { increment: input.price },
            },
          },
        },
      })
      if (!parking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sorry, we couldn't find the parking spot",
        })
      }
      const booking = await ctx.prisma.booking.create({
        data: {
          bookingNumber: String(Date.now()),
          end: new Date(input.end),
          start: new Date(input.start),
          price: input.price,
          profileId: input.driverId,
          parkingId: input.parkingId,
          status: "fulfilled",
        },
        select: {
          bookingNumber: true,
          end: true,
          parkingId: true,
          start: true,
          id: true,
          price: true,
          profileId: true,
          profile: {
            select: {
              id: true,
              balance: true,
              username: true,
              lastName: true,
              firstName: true,
            },
          },
          parking: {
            select: {
              id: true,
              address: true,
              features: true,
              latitude: true,
              longitude: true,
              price: true,
              description: true,
              availableEnd: true,
              availableStart: true,
            },
          },
        },
      })

      if (!booking) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "The booking has not been completed",
        })
      }
      return booking
    }),
  cancelBooking: privateProcedure
    .input(
      z.object({
        bookingNumber: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.prisma.booking.findUnique({
        where: { bookingNumber: input.bookingNumber },
        select: {
          price: true,
          profileId: true,
          parking: {
            select: {
              profileId: true,
            },
          },
        },
      })
      if (!booking) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" })
      }
      const driver = await ctx.prisma.profile.update({
        where: { id: booking.profileId },
        data: {
          balance: {
            increment: booking.price,
          },
        },
      })
      if (!driver) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" })
      }
      const owner = await ctx.prisma.profile.update({
        where: { id: booking.parking.profileId },
        data: {
          balance: {
            increment: booking.price,
          },
        },
      })

      if (!owner) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" })
      }
      return await ctx.prisma.booking.update({
        where: { bookingNumber: input.bookingNumber },
        data: {
          status: "canceled",
        },
        select: {
          status: true,
          bookingNumber: true,
          price: true,
        },
      })
    }),
})
