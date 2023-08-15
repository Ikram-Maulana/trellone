/* eslint-disable @typescript-eslint/no-misused-promises */
import GoogleAuthButton from "@/components/google-auth-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { NavbarItem } from "@/data/navbar";
import { cn } from "@/lib/utils";
import { ExitIcon, ReloadIcon } from "@radix-ui/react-icons";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const NavbarMobile = ({ session }: { session: Session | null }) => {
  const [isLoadingLogout, setIsLoadingLogout] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoadingLogout(true);
      await signOut({
        callbackUrl: "/",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLogout(false);
    }
  };

  return (
    <div className="container fixed inset-0 top-[72px] z-50 mx-auto grid h-[calc(100vh-4rem)] max-w-7xl grid-flow-row auto-rows-max overflow-auto px-8 py-6 pb-32 animate-in slide-in-from-bottom-80 md:hidden">
      <div className="relative z-20 grid gap-6 rounded-md bg-background/90 p-4 shadow-lg outline outline-1 outline-background backdrop-blur-sm">
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {NavbarItem.map((item) => (
            <Link
              key={`mobileNav-${item.name}`}
              href={item.url}
              className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
            >
              {item.name}
            </Link>
          ))}

          <>
            <div className="py-3">
              <Separator />
            </div>
            {!session ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className={cn("mt-2")}>Login</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Welcome Back</DialogTitle>
                    <DialogDescription>
                      Please sign in using your google account to continue.
                    </DialogDescription>
                  </DialogHeader>
                  <GoogleAuthButton />
                </DialogContent>
              </Dialog>
            ) : (
              <Button
                variant="destructive"
                className={cn("mt-2")}
                onClick={handleSignOut}
              >
                {isLoadingLogout ? (
                  <>
                    <ReloadIcon className="mr-2 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <ExitIcon className="mr-2" />
                    Logout
                  </>
                )}
              </Button>
            )}
          </>
        </nav>
      </div>
    </div>
  );
};

export default NavbarMobile;
