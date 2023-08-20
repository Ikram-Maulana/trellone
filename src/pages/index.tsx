import BlurImage from "@/components/blur-image";
import Layout from "@/components/guest/layout";
import Link from "next/link";

export default function Home() {
  return (
    <section id="hero" className="container">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="mx-auto max-w-4xl pb-10 text-center md:pb-16">
            <h1 className="mb-6 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Trellone Brings All Your Tasks, Todos, and Tools Together
            </h1>
            <div className="mx-auto max-w-3xl">
              <p className="text-xl text-gray-600 dark:text-zinc-400">
                Trellone is a simple version of Trello clone built with Next.js,
                TRPC, and TailwindCSS. This project uses the template from{" "}
                <Link
                  href="https://create.t3.gg/"
                  className="underline decoration-emerald-500 decoration-dotted underline-offset-2 dark:decoration-emerald-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  T3 Stack
                </Link>
                . Please sign in to use this app.
              </p>
            </div>
          </div>
          <div className="relative m-auto max-w-5xl overflow-hidden rounded-xl">
            <BlurImage
              src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=930&q=80"
              alt="Thought Catalog"
              height={620}
              width={930}
              className="mx-auto h-auto w-full rounded-xl bg-zinc-100 object-cover"
              unoptimized
              blurDataURL="00E.IY"
              placeholder="blur"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 60vw"
              loader={({ src }) => src}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout title="Home">{page}</Layout>;
};
