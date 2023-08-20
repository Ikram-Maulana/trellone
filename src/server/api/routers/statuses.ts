import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";

export const statusesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async () => {
    const statuses = await prisma.status.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return statuses;
  }),
});
