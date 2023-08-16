import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { type Todos } from "@prisma/client";

export const todosRouter = createTRPCRouter({
  getBoardByStatus: protectedProcedure.query(async ({ ctx }) => {
    const todos = await prisma.status.findMany({
      select: {
        id: true,
        name: true,
        todos: {
          where: {
            userId: ctx.session.user.id,
          },
        },
      },
    });

    const todosMap = todos.reduce((map, todo) => {
      map.set(todo.name, {
        id: todo.id,
        todos: todo.todos,
      });

      return map;
    }, new Map<string, { id: string; todos: Todos[] }>());

    const board = {
      columns: todosMap,
    };

    return board;
  }),
});
