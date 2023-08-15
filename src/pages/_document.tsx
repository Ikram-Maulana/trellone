import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className={cn("motion-safe:scroll-smooth")}>
      <Head />
      <body className="min-h-screen bg-background antialiased">
        <Main />
        <Toaster />
        <NextScript />
      </body>
    </Html>
  );
}
