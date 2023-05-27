import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc"
import { toDatetimeLocal } from "~/utils/datetime-local"

export const bookingRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        parkingId: z.string(),
        driverId: z.string(),
        start: z.string().datetime({ offset: true }),
        end: z.string().datetime({ offset: true }),
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
      const parking =
        profile &&
        (await ctx.prisma.parkingSpot.update({
          where: { id: input.parkingId },
          data: {
            profile: {
              update: {
                balance: { increment: input.price },
              },
            },
          },
        }))
      const booking =
        parking &&
        (await ctx.prisma.booking.create({
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
        }))

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
      const owner =
        driver &&
        (await ctx.prisma.profile.update({
          where: { id: booking.parking.profileId },
          data: {
            balance: {
              increment: booking.price,
            },
          },
        }))

      if (!owner) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" })
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
  getBookingsByUserId: privateProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const bookings = await ctx.prisma.booking.findMany({
        where: { profileId: input.userId },
      })
      if (!bookings) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bookings not found",
        })
      }
      return bookings.map((booking) => {
        return {
          ...booking,
          end: toDatetimeLocal(booking.end),
          start: toDatetimeLocal(booking.start),
        }
      })
    }),
})
