import GoogleAuthButton from "@/components/google-auth-button";
import { Button } from "@/components/ui/button";
import { SiteMetadata } from "@/data/metadata";
import { getServerAuthSession } from "@/server/auth";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { type GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { type FC } from "react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (session?.user) {
    return {
      redirect: {
        destination: "/board",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

const Login: FC = () => {
  return (
    <>
      <Head>
        <title>Login | ${SiteMetadata.name}</title>
        <meta name="description" content={SiteMetadata.description} />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="application-name" content={SiteMetadata.applicationName} />
        {SiteMetadata.keywords.length > 0 && (
          <meta name="keywords" content={SiteMetadata.keywords.join(",")} />
        )}
        {SiteMetadata.authors.length > 0 &&
          SiteMetadata.authors.map((author, index) => (
            <>
              <link rel="author" href={author.url} key={`author-${index}`} />
              <meta
                name="author"
                content={author.name}
                key={`author-${index}`}
              />
            </>
          ))}
        <meta name="theme-color" content={SiteMetadata.themeColor} />
        <meta name="creator" content={SiteMetadata.creator} />
      </Head>

      <div className="container absolute inset-0 mx-auto flex h-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full max-w-lg flex-col justify-center space-y-6">
          <div className="flex flex-col items-center gap-6 text-center">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ChevronLeftIcon className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div className="mx-auto max-w-4xl pb-10 text-center md:pb-16">
              <h1 className="mb-6 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Welcome Back
              </h1>
              <div className="mx-auto max-w-3xl">
                <p className="mb-6 max-w-prose text-center text-base text-gray-600 sm:text-lg">
                  Please sign in using your google account to continue.
                </p>
              </div>

              <GoogleAuthButton className="w-fit" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
