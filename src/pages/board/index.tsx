import Layout from "@/components/guest/layout";
import { getServerAuthSession } from "@/server/auth";
import { type GetServerSideProps } from "next";

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
    <div className="container max-w-7xl">
      <h1>Hello Board</h1>
    </div>
  );
}

Board.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout title="Board">{page}</Layout>;
};
