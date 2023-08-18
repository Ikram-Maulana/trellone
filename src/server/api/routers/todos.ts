import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { type Todos } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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

  moveTodo: protectedProcedure
    .input(
      z.object({
        todo: z.object({
          id: z.string(),
          title: z.string(),
          statusId: z.string(),
          image: z.string().nullable(),
          userId: z.string(),
          createdAt: z.date(),
          updatedAt: z.date(),
        }),
        columnId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { todo, columnId } = input;
      const { id } = ctx.session.user;

      const statudId = await prisma.status.findUnique({
        where: {
          name: columnId,
        },
        select: {
          id: true,
        },
      });

      if (!statudId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Status not found",
        });
      }

      const updatedTodo = await prisma.todos.update({
        where: {
          id: todo.id,
          userId: id,
        },
        data: {
          statusId: statudId.id,
        },
      });

      return {
        error: null,
        data: updatedTodo,
      };
    }),

  deleteTodo: protectedProcedure
    .input(
      z.object({
        todoId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { todoId } = input;
      const { id } = ctx.session.user;

      const deletedTodo = await prisma.todos.delete({
        where: {
          id: todoId,
          userId: id,
        },
      });

      return {
        error: null,
        data: {
          deletedTodo,
        },
      };
    }),
});
