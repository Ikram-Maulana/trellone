import Layout from "@/components/guest/layout";

export default function Home() {
  return (
    <div className="container max-w-7xl">
      <h1>Hello World</h1>
    </div>
  );
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout title="Home">{page}</Layout>;
};
