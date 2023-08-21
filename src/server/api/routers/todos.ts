import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { type Todos } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { blurhashFromURL, type IOutput } from "blurhash-from-url";

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
      orderBy: {
        position: "asc",
      },
      where: {
        userId: ctx.session.user.id,
      },
    });

    if (!todos || todos.length === 0) {
      await prisma.status.createMany({
        data: [
          {
            name: "todo",
            position: 0,
            userId: ctx.session.user.id,
          },
          {
            name: "inprogress",
            position: 1,
            userId: ctx.session.user.id,
          },
          {
            name: "done",
            position: 2,
            userId: ctx.session.user.id,
          },
        ],
      });

      const newTodos = await prisma.status.findMany({
        select: {
          id: true,
          name: true,
          todos: {
            where: {
              userId: ctx.session.user.id,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
        where: {
          userId: ctx.session.user.id,
        },
      });

      const todosMap = newTodos.reduce((map, todo) => {
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
    } else {
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
    }
  }),

  addTodo: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        status: z.string(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { title, status, image } = input;
      const { id } = ctx.session.user;

      const [statusId, lastTodoItem] = await prisma.$transaction([
        prisma.status.findUnique({
          where: {
            name_userId: {
              name: status,
              userId: id,
            },
          },
          select: {
            id: true,
          },
        }),
        prisma.todos.findFirst({
          orderBy: {
            position: "desc",
          },
          where: {
            status: {
              name: status,
            },
            userId: id,
          },
        }),
      ]);

      if (!statusId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Status not found",
        });
      }

      let blurhashImage: IOutput | null = null;
      if (image) {
        blurhashImage = await blurhashFromURL(image);
        const newTodo = await prisma.todos.create({
          data: {
            title,
            image,
            blurHash: blurhashImage.encoded,
            statusId: statusId.id,
            position: lastTodoItem ? lastTodoItem.position + 1 : 0,
            userId: id,
          },
        });
        return {
          error: null,
          data: {
            statusName: status,
            newTodo,
          },
        };
      }

      const newTodo = await prisma.todos.create({
        data: {
          title,
          statusId: statusId.id,
          position: lastTodoItem ? lastTodoItem.position + 1 : 0,
          userId: id,
        },
      });

      return {
        error: null,
        data: {
          statusName: status,
          newTodo,
        },
      };
    }),

  moveTodoSameColumn: protectedProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          newPosition: z.number(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.$transaction(
        input.map((todo) =>
          prisma.todos.update({
            where: {
              id: todo.id,
              userId: ctx.session.user.id,
            },
            data: {
              position: todo.newPosition,
            },
          }),
        ),
      );
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
          id: columnId,
          userId: id,
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

  moveBoard: protectedProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          newPosition: z.number(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.$transaction(
        input.map((status) =>
          prisma.status.update({
            where: {
              id: status.id,
              userId: ctx.session.user.id,
            },
            data: {
              position: status.newPosition,
            },
          }),
        ),
      );
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
