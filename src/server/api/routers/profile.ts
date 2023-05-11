import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.profile.findMany();
    }),
    create: privateProcedure.input(z.object({
        firstName: z.string().min(3).max(255),
        lastName: z.string().min(3).max(255),
        username: z.string().min(3).max(255),
        phoneNumber: z.optional(z.string().min(8).max(16)),
        isDriver: z.boolean(),
        isOwner: z.boolean(),
        vehicleSize: z.enum(["XSMALL", "SMALL", "MEDIUM", "LARGE", "XLARGE"]),
    })
    ).mutation(async ({ ctx, input }) => {
        const profile = await ctx.prisma.profile.create({
            data: {
                ...input,
                id: ctx.userId,
            }
        })
        return profile
    }),
    updateDriver: privateProcedure.input(z.object({
        id: z.string(),
        firstName: z.string().min(3).max(255),
        lastName: z.string().min(3).max(255),
        username: z.string().min(3).max(255),
        phoneNumber: z.optional(z.string().min(8).max(16)),
        vehicleSize: z.enum(["XSMALL", "SMALL", "MEDIUM", "LARGE", "XLARGE"]),
        vehicleModel: z.string(),
        licensePlate: z.string(),
    })
    ).mutation(async ({ ctx, input }) => {
        const profile = await ctx.prisma.profile.update({
            where: {
                id: input.id
            },
            data: {
                firstName: input.firstName,
                lastName: input.lastName,
                phoneNumber: input.phoneNumber,
                username: input.username,
                vehicleSize: input.vehicleSize
            }
        })
        if (!profile) throw new TRPCError({ code: "NOT_FOUND" })
        return profile
    }),
    updateOwner: privateProcedure.input(z.object({
        id: z.string(),
        firstName: z.string().min(3).max(255),
        lastName: z.string().min(3).max(255),
        username: z.string().min(3).max(255),
        phoneNumber: z.optional(z.string().min(8).max(16)),
    })
    ).mutation(async ({ ctx, input }) => {
        const profile = await ctx.prisma.profile.update({
            where: {
                id: input.id
            },
            data: {
                firstName: input.firstName,
                lastName: input.lastName,
                username: input.username,
                phoneNumber: input.phoneNumber,
            }
        })
        if (!profile) throw new TRPCError({ code: "NOT_FOUND" })
        return profile
    }),
    delete: privateProcedure.input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const profile = await ctx.prisma.profile.delete({ where: { id: input.id } })
            if (!profile) throw new TRPCError({ code: "NOT_FOUND" })
            return profile
        })
});
