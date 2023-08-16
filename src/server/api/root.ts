import { todosRouter } from "@/server/api/routers/todos";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  todos: todosRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
