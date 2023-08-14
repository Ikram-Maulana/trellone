import { cn } from "@/lib/utils";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className={cn("motion-safe:scroll-smooth")}>
      <Head />
      <body className="bg-background min-h-screen antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
