import Column from "@/components/column";
import Layout from "@/components/guest/layout";
import { getServerAuthSession } from "@/server/auth";
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
  const {
    data: board,
    isLoading: isLoadingBoard,
    isError: isErrorBoard,
  } = api.todos.getBoardByStatus.useQuery(undefined, {
    enabled: !!sessionData?.user,
  });

  const handleOnDragEnd = (result: DropResult) => {};

  return (
    <section id="board" className="container">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="py-12 md:py-20">
          {isLoadingBoard && <p>Loading...</p>}
          {isErrorBoard && <p>Error</p>}
          {!isLoadingBoard && !isErrorBoard && board && (
            <>
              <p>{JSON.stringify(board)}</p>

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
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

Board.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout title="Board">{page}</Layout>;
};
