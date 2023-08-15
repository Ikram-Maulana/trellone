/* eslint-disable @typescript-eslint/no-misused-promises */
import BurgerButton from "@/components/burger-button";
import GoogleAuthButton from "@/components/google-auth-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { toast } from "@/components/ui/use-toast";
import { NavbarItem } from "@/data/navbar";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ExitIcon, ReloadIcon } from "@radix-ui/react-icons";
import initials from "initials";
import { type Session } from "next-auth";
import { getSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FC } from "react";
import { useToggle, useWindowSize } from "usehooks-ts";

const Navbar: FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingLogout, setIsLoadingLogout] = useState(false);
  const [value, toggle, setValue] = useToggle();
  const { width } = useWindowSize();

  useEffect(() => {
    const gettingSession = async () => {
      const session = await getSession();
      setSession(session);
    };

    gettingSession()
      .then()
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to get session. Please try again later",
          variant: "destructive",
        });
      });
  }, []);

  useEffect(() => {
    if (width < 768 && value) {
      setValue(false);
    }
  }, [width, value, setValue]);

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
      setValue(false);
      setIsLoadingLogout(false);
    }
  };

  return (
    <header
      className="sticky top-0 z-40 mx-auto w-full flex-none bg-background transition-all duration-100 ease-in md:bg-background/90 md:backdrop-blur-sm"
      id="header"
    >
      <div className="container mx-auto w-full max-w-7xl py-6 md:flex md:items-center md:justify-between">
        <div className="flex items-center justify-between md:block">
          <Link href="/">
            <Image
              priority
              src="/lipsum.webp"
              width={126}
              height={36}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 60vw"
              alt="Logo Ipsum"
              className="pr-4"
            />
          </Link>
          <div className="flex items-center gap-2 md:hidden">
            <BurgerButton session={session} />
          </div>
        </div>
        <NavigationMenu className={cn("hidden md:flex")}>
          <NavigationMenuList className={cn("mr-2")}>
            {NavbarItem.map((item) => (
              <NavigationMenuItem key={`nav-${item.name}`}>
                <Link href={item.url} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {item.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>

          {!session ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button>Login</Button>
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
            <DropdownMenu open={value} onOpenChange={setValue}>
              <DropdownMenuTrigger onClick={toggle}>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage
                      src={
                        session.user.image ??
                        "https://eu.ui-avatars.com/api/?name=Daunnesia&size=250"
                      }
                      alt={session.user.name ?? "Daunnesia"}
                      width={40}
                      height={40}
                    />
                    <AvatarFallback>
                      {initials(session.user.name ?? "DA")}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-sm font-semibold">
                    {session.user.name ?? "Daunnesia"}
                  </h2>
                  {value ? (
                    <ChevronDownIcon className="h-4 w-4 rotate-180 transform transition-all" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4 transition-all" />
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {session.user.email ?? "daunnesia@gmail.com"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className={cn("hover:cursor-pointer")}
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
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Navbar;
