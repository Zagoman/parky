import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const parkingRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.parkingSpot.findMany();
    }),

    getShort: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.parkingSpot.findMany({
            select: {
                _count: {
                    select: { Booking: true }
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
                geolocation: true,
            },
        })
    }),
    getParkingById: publicProcedure.input(z.object({ id: z.string() }))
        .query(({ ctx, input }) => {
            return ctx.prisma.parkingSpot.findFirst({ where: { id: input.id } })
        }),

    create: privateProcedure.input(z.object({
        address: z.string().min(3).max(255),
        imageURL: z.optional(z.string()),
        price: z.number(),
        availableStart: z.string().datetime(),
        availableEnd: z.string().datetime(),
        features: z.object({
            features: z.string().array()
        }),
        geolocation: z.object({
            location: z.string()
        }),
        description: z.string().min(3).max(255),
        dimensions: z.enum(["XSMALL", "SMALL", "MEDIUM", "LARGE", "XLARGE"]),
    })).mutation(async ({ ctx, input }) => {
        const parking = await ctx.prisma.parkingSpot.create({
            data: {
                rating: 5.0,
                profileId: ctx.userId,
                ...input,
            }
        })
        return parking
    }
    ),

    update: privateProcedure.input(z.object({
        id: z.string(),
        address: z.string().min(3).max(255),
        imageURL: z.optional(z.string()),
        price: z.number(),
        availableStart: z.string().datetime(),
        availableEnd: z.string().datetime(),
        features: z.object({
            features: z.string().array()
        }),
        geolocation: z.object({
            location: z.string()
        }),
        description: z.string().min(3).max(255),
        dimensions: z.enum(["XSMALL", "SMALL", "MEDIUM", "LARGE", "XLARGE"]),
    })).mutation(async ({ ctx, input }) => {
        const profile = await ctx.prisma.profile.update({
            where: { id: ctx.userId },
            include: {
                ParkingSpot: { where: { id: input.id } }
            },
            data: {
                ParkingSpot: {
                    update: {
                        where: { id: input.id },
                        data: {
                            address: input.address,
                            imageURL: input.imageURL,
                            price: input.price,
                            availableStart: input.availableStart,
                            availableEnd: input.availableEnd,
                            features: input.features,
                            geolocation: input.geolocation,
                            description: input.description,
                            dimensions: input.dimensions
                        }
                    }
                }
            }
        })
        if (!profile) throw new TRPCError({ code: "NOT_FOUND" })
        return profile.ParkingSpot[0]
    }),

    delete: privateProcedure.input(z.object({
        id: z.string()
    })).mutation(async ({ ctx, input }) => {
        const parking = await ctx.prisma.parkingSpot.delete({ where: { id: input.id } })
        if (!parking) {
            throw new TRPCError({ code: "NOT_FOUND" })
        }
        return parking

    })

});
