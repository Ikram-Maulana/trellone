import NavbarMobile from "@/components/navbar-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ChevronDownIcon,
  Cross2Icon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import initials from "initials";
import { type Session } from "next-auth";
import { useEffect } from "react";
import { useLockedBody, useToggle, useWindowSize } from "usehooks-ts";

const BurgerButton = ({ session }: { session: Session | null }) => {
  const [value, toggle, setValue] = useToggle();
  const [locked, setLocked] = useLockedBody(false, "root");
  const { width } = useWindowSize();

  const hamburgerClickHandler = () => {
    toggle();
    setLocked(!locked);
  };

  useEffect(() => {
    if (width >= 768 && value) {
      setValue(false);
      setLocked(false);
    }
  }, [width, value, setValue, setLocked]);

  return (
    <>
      {!session ? (
        <Button
          className="block px-3 lg:hidden"
          variant="outline"
          onClick={hamburgerClickHandler}
          aria-label="Toggle menu"
        >
          {value ? (
            <Cross2Icon className="h-4 w-4" />
          ) : (
            <HamburgerMenuIcon className="h-4 w-4" />
          )}
        </Button>
      ) : (
        <div className="flex items-center space-x-2">
          <Avatar onClick={hamburgerClickHandler}>
            <AvatarImage
              src={
                session.user.image ??
                "https://eu.ui-avatars.com/api/?name=Daunnesia&size=250"
              }
              alt={session.user.name ?? "Daunnesia"}
              width={36}
              height={36}
            />
            <AvatarFallback>
              {initials(session.user.name ?? "DA")}
            </AvatarFallback>
          </Avatar>

          {value ? (
            <ChevronDownIcon className="h-4 w-4 rotate-180 transform transition-all" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 transition-all" />
          )}
        </div>
      )}
      {value && <NavbarMobile session={session} />}
    </>
  );
};

export default BurgerButton;
