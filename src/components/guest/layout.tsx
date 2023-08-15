import Navbar from "@/components/navbar";
import { SiteMetadata } from "@/data/metadata";
import Head from "next/head";
import React from "react";

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
}

export default function Layout({ title, children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>
          {title ? `${title} | ${SiteMetadata.name}` : SiteMetadata.title}
        </title>
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

      <Navbar />
      <main>{children}</main>
    </>
  );
}
