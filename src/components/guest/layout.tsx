import Navbar from "@/components/guest/navbar";
import { SiteMetadata } from "@/lib/metadata";
import Head from "next/head";

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

      <Navbar />
      <main>{children}</main>
    </>
  );
}
