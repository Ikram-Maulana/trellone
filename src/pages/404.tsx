import { Button } from "@/components/ui/button";
import { SiteMetadata } from "@/data/metadata";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Head from "next/head";
import Link from "next/link";
import React from "react";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 Not Found | {SiteMetadata.name}</title>
        <meta name="description" content={SiteMetadata.description} />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="application-name" content={SiteMetadata.applicationName} />
        {SiteMetadata.keywords.length > 0 && (
          <meta name="keywords" content={SiteMetadata.keywords.join(",")} />
        )}
        {SiteMetadata.authors.length > 0 &&
          SiteMetadata.authors.map((author, index) => (
            <React.Fragment key={`author-${index}`}>
              <link rel="author" href={author.url} />
              <meta name="author" content={author.name} />
            </React.Fragment>
          ))}
        <meta name="theme-color" content={SiteMetadata.themeColor} />
        <meta name="creator" content={SiteMetadata.creator} />
      </Head>

      <section className="container mx-auto flex h-screen max-w-7xl flex-col items-center justify-center text-center dark:text-zinc-50">
        <h1 className="mb-6 scroll-m-20 text-8xl font-extrabold tracking-tight text-primary lg:text-9xl">
          404
        </h1>
        <h2 className="mb-6 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Page Not Found
        </h2>
        <div className="mx-auto max-w-3xl">
          <p className="mb-6 text-xl text-gray-600 dark:text-zinc-400">
            The page you&apos;re looking for does not exist or an other error
            occurred, please go back to the homepage.
          </p>
        </div>
        <Button asChild>
          <Link href="/">
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
      </section>
    </>
  );
}
