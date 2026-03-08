"use client";
import { MenuIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Logo from "@/assets/svg/logo";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Link from "next/link";

type NavigationItem = {
  title: string;
  href: string;
}[];

const fallbackNavigationData: NavigationItem = [
  { title: "Home", href: "/" },
  { title: "Products", href: "/products" },
  { title: "Users", href: "/users" },
  { title: "Admin", href: "/admin" },
];

const Navbar = ({ navigationData }: { navigationData?: NavigationItem }) => {
  const menuItems = navigationData ?? fallbackNavigationData;

  return (
    <header className="bg-background sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-7 sm:px-6">
        <div className="text-muted-foreground flex flex-1 items-center gap-8 font-medium md:justify-center lg:gap-16">
          <Link href="/" className="hover:text-primary max-md:hidden">
            Home
          </Link>
          <Link href="/products" className="hover:text-primary max-md:hidden">
            Products
          </Link>
          <Link href="/">
            <Logo className="text-foreground gap-3" />
          </Link>
          <Link href="/users" className="hover:text-primary max-md:hidden">
            Users
          </Link>
          <Link href="/admin" className="hover:text-primary max-md:hidden">
            Admin
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <ModeToggle />
          <Button variant="ghost" size="icon">
            <SearchIcon />
            <span className="sr-only">Search</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="md:hidden" asChild>
              <Button variant="outline" size="icon">
                <MenuIcon />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                {menuItems.map((item, index) => (
                  <DropdownMenuItem key={index} asChild>
                    <Link href={item.href} className="w-full">
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
