import { env } from "@/env.mjs";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="container mx-auto flex max-w-7xl items-center justify-center">
      <div className="py-6 md:flex md:items-center md:justify-center md:py-8">
        <div className="text-center text-gray-600 dark:text-zinc-400">
          Made by{" "}
          <Link
            className="underline decoration-emerald-500 decoration-dotted underline-offset-2 dark:decoration-emerald-400"
            href={env.NEXT_PUBLIC_IKRAM_WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Ikram Maulana
          </Link>{" "}
          · All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
