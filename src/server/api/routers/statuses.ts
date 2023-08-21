import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";

export const statusesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const statuses = await prisma.status.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        position: "asc",
      },
    });

    return statuses;
  }),
});
