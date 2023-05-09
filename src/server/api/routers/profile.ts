import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.profile.findMany();
    }),
    create: privateProcedure.input(z.object({
        firstName: z.string().min(3).max(255),
        lastName: z.string().min(3).max(255),
        role: z.enum(["DRIVER", "OWNER"]),
        phoneNumber: z.optional(z.string().min(8).max(16)),
        username: z.string().min(3).max(255),
        vehicleSize: z.enum(["XSMALL", "SMALL", "MEDIUM", "LARGE", "XLARGE"]),
    })
    ).mutation(async ({ ctx, input }) => {
        const userId = ctx.userId
        const profile = await ctx.prisma.profile.create({
            data: {
                ...input,
                userId: userId,
                balance: 1,
                rating: 5
            }
        })
        return profile
    })
});
