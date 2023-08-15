import Layout from "@/components/guest/layout";
import { getServerAuthSession } from "@/server/auth";
import { type GetServerSideProps } from "next";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

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
  return (
    <section id="board" className="container">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* <DragDropContext>
            <Droppable
              droppableId="board"
              direction="horizontal"
              type="column"
            >
              {(provided) => (
                // Rendering All the Column
              )}
            </Droppable>
          </DragDropContext> */}
        </div>
      </div>
    </section>
  );
}

Board.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout title="Board">{page}</Layout>;
};
