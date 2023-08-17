import Column from "@/components/column";
import Layout from "@/components/guest/layout";
import { getServerAuthSession } from "@/server/auth";
import { useBoardStore } from "@/store/board-store";
import { api } from "@/utils/api";
import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import {
  DragDropContext,
  type DropResult,
  Droppable,
} from "react-beautiful-dnd";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session?.user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default function Board() {
  const { data: sessionData } = useSession();
  const { board, setBoardState } = useBoardStore();
  const {
    data: boardData,
    isLoading: isLoadingBoardData,
    isError: isErrorBoardData,
    refetch: refetchBoardData,
  } = api.todos.getBoardByStatus.useQuery(undefined, {
    enabled: !!sessionData?.user,
    onSuccess: (data) => {
      setBoardState(data);
    },
  });

  const { mutate: moveTodo } = api.todos.moveTodo.useMutation({
    onSuccess: async () => {
      await refetchBoardData();
    },
  });

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    if (type === "column") {
      const entries = Array.from(board?.columns.entries());
      const [removed] = entries.splice(source.index, 1);

      if (!removed) {
        return;
      }

      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);

      setBoardState({
        ...board,
        columns: rearrangedColumns,
      });
    }

    const columns = Array.from(board?.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    if (!startColIndex || !finishColIndex) {
      return;
    }

    const startCol = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };

    const finishCol = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };

    if (!startCol || !finishCol) {
      return;
    }

    if (source.index === destination.index && startCol === finishCol) {
      return;
    }

    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    if (!todoMoved) {
      return;
    }

    if (startCol.id === finishCol.id) {
      // Same column
      newTodos.splice(destination.index, 0, todoMoved);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      const newColumns = new Map(columns);
      newColumns.set(newCol.id, newCol);

      setBoardState({
        ...board,
        columns: newColumns,
      });
    } else {
      // Different column
      const finishTodos = finishCol.todos;
      finishTodos.splice(destination.index, 0, todoMoved);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      const newColumns = new Map(columns);

      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });

      moveTodo({
        todo: todoMoved,
        columnId: finishCol.id,
      });

      setBoardState({
        ...board,
        columns: newColumns,
      });
    }
  };

  return (
    <section id="board" className="container">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="py-12 md:py-20">
          {isLoadingBoardData && <p>Loading...</p>}
          {isErrorBoardData && <p>Error</p>}
          {!isLoadingBoardData && !isErrorBoardData && !boardData && (
            <p>Empty</p>
          )}
          {!isLoadingBoardData && !isErrorBoardData && board && (
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable
                droppableId="board"
                direction="horizontal"
                type="column"
              >
                {(provided) => (
                  <div
                    className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {Array.from(board?.columns.entries()).map(
                      ([id, column], index) => (
                        <Column
                          key={id}
                          id={id}
                          todos={column.todos}
                          index={index}
                        />
                      ),
                    )}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>
    </section>
  );
}

Board.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout title="Board">{page}</Layout>;
};
