"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  ChevronDown,
  Menu,
  Moon,
  Sun,
  X,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";

import { useTheme } from "next-themes";

import {
  onAuthStateChanged,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";

import logo from "../../public/logo.png";

export default function Navbar() {
  const { setTheme } = useTheme();

  const router = useRouter();
  const pathname = usePathname();

  // ============================================
  // STATE
  // ============================================

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [mobileAboutOpen, setMobileAboutOpen] =
    useState(false);

  const [user, setUser] =
    useState<FirebaseUser | null>(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  // ============================================
  // CURRENT PAGE
  // ============================================

  const isDashboard = pathname === "/dashboard";

  // ============================================
  // FIREBASE AUTH STATE
  // ============================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setAuthLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ============================================
  // CLOSE MOBILE MENU WHEN ROUTE CHANGES
  // ============================================

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileAboutOpen(false);
  }, [pathname]);

  // ============================================
  // HOME / DASHBOARD SWITCH
  // ============================================

  const handleSwitchToggle = (checked: boolean) => {
    if (checked) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  // ============================================
  // CLOSE MOBILE MENU
  // ============================================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileAboutOpen(false);
  };

  // ============================================
  // LOGOUT
  // ============================================

  const handleLogout = async () => {
    try {
      await signOut(auth);

      toast.success("Logged out successfully", {
        description: "See you again!",
      });

      router.replace("/");
    } catch (error) {
      console.error(error);

      toast.error("Logout failed", {
        description:
          "Something went wrong. Please try again.",
      });
    }
  };

  // ============================================
  // USER NAME
  // ============================================

  const getUserName = () => {
    if (!user) return "User";

    if (user.displayName) {
      return user.displayName;
    }

    if (user.email) {
      return user.email.split("@")[0];
    }

    return "User";
  };

  // ============================================
  // USER INITIAL
  // ============================================

  const getUserInitial = () => {
    const name = getUserName();

    return name
      .charAt(0)
      .toUpperCase();
  };

  // ============================================
  // AVATAR COMPONENT
  // ============================================

  const UserAvatar = () => {
    return (
      <div
        className="
          relative
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-full
          border
          border-border
          bg-muted
          text-sm
          font-semibold
          text-foreground
          transition-all
          hover:ring-2
          hover:ring-primary/30
        "
      >
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt={getUserName()}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>
            {getUserInitial()}
          </span>
        )}
      </div>
    );
  };

  // ============================================
  // AUTH DROPDOWN
  // ============================================

  const UserDropdown = () => {
    if (!user) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              aria-label="Open user menu"
              className="
                rounded-full
                outline-none
                transition-all
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
              "
            />
          }
        >
          <UserAvatar />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="
            w-64
            rounded-xl
            border-border
            bg-popover
            p-2
            text-popover-foreground
            shadow-lg
          "
        >
          {/* USER INFO */}
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold">
              {getUserName()}
            </p>

            {user.email && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>

          <DropdownMenuSeparator />

          {/* PROFILE */}
          <DropdownMenuItem
            onClick={() => router.push("/profile")}
            className="cursor-pointer rounded-lg"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>

          {/* DASHBOARD */}
          <DropdownMenuItem
            onClick={() =>
              router.push("/dashboard")
            }
            className="cursor-pointer rounded-lg"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* LOGOUT */}
          <DropdownMenuItem
            onClick={handleLogout}
            className="
              cursor-pointer
              rounded-lg
              text-red-500
              focus:text-red-500
            "
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <header className="w-full bg-background p-2 sm:p-4">
      <nav
        className="
          relative
          mx-auto
          flex
          w-full
          max-w-6xl
          flex-col
          rounded-2xl
          border
          border-border
          bg-card/80
          px-4
          py-3
          backdrop-blur-md
          transition-colors
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        {/* =====================================================
            TOP BAR
        ====================================================== */}

        <div className="flex w-full items-center justify-between md:w-auto">

          {/* LOGO */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2.5"
          >
            <Image
              src={logo}
              alt="Logo"
              width={36}
              height={36}
              priority
              className="rounded-full"
            />
          </Link>

          {/* =====================================================
              MOBILE CONTROLS
          ====================================================== */}

          <div className="flex items-center gap-1 md:hidden">

            {/* MOBILE THEME */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Change theme"
                  />
                }
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />

                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />

                <span className="sr-only">
                  Change theme
                </span>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                >
                  Light
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                >
                  Dark
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setTheme("system")}
                >
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* MOBILE USER AVATAR */}

            {!authLoading && user && (
              <UserDropdown />
            )}

            {/* MOBILE MENU BUTTON */}

            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setMobileMenuOpen((prev) => !prev)
              }
              aria-label={
                mobileMenuOpen
                  ? "Close menu"
                  : "Open menu"
              }
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}

        <div
          className="
            hidden
            items-center
            gap-8
            text-sm
            font-medium
            text-muted-foreground
            md:flex
          "
        >

          {/* HOME / DASHBOARD SWITCH */}

          <div className="flex items-center gap-2">

            <Label
              htmlFor="page-toggle-desktop"
              className="cursor-pointer text-sm font-medium"
            >
              {isDashboard
                ? "Dashboard"
                : "Home"}
            </Label>
          </div>

          {/* =====================================================
              DESKTOP ABOUT DROPDOWN
          ====================================================== */}

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="
                    group
                    flex
                    items-center
                    gap-1
                    py-2
                    outline-none
                    transition-colors
                    hover:text-foreground
                  "
                />
              }
            >
              About

              <ChevronDown
                className="
                  h-4
                  w-4
                  text-muted-foreground
                  transition-transform
                  duration-200
                  group-data-[state=open]:rotate-180
                "
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              sideOffset={8}
              className="
                min-w-[170px]
                rounded-xl
                border-border
                bg-popover
                p-1
                text-popover-foreground
                shadow-md
              "
            >
              <DropdownMenuItem
                onClick={() =>
                  router.push("/about/history")
                }
              >
                History
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  router.push("/about/teachers")
                }
              >
                Our Teachers
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* NOTICE */}

          <Link
            href="/notice"
            className="transition-colors hover:text-foreground"
          >
            Notice
          </Link>

          {/* CONTACT */}

          <Link
            href="/contact"
            className="transition-colors hover:text-foreground"
          >
            Contact Us
          </Link>
        </div>

        {/* =====================================================
            DESKTOP RIGHT ACTIONS
        ====================================================== */}

        <div className="hidden items-center gap-3 md:flex">

          {/* DESKTOP THEME */}

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Change theme"
                />
              }
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />

              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />

              <span className="sr-only">
                Change theme
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setTheme("light")}
              >
                Light
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setTheme("dark")}
              >
                Dark
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setTheme("system")}
              >
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* =====================================================
              AUTH AREA
          ====================================================== */}

          {authLoading ? (
            // Prevent Sign in / Get started flash
            <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />
          ) : user ? (
            // LOGGED IN
            <UserDropdown />
          ) : (
            // LOGGED OUT
            <>
              <Link
                href="/login"
                className="
                  px-2
                  text-sm
                  font-medium
                  text-muted-foreground
                  transition-colors
                  hover:text-foreground
                "
              >
                Sign in
              </Link>

              <Button
                nativeButton={false}
                render={<Link href="/signup" />}
                className="
                  rounded-xl
                  bg-primary
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-primary-foreground
                  shadow-sm
                  transition-all
                  hover:bg-primary/90
                "
              >
                Get started
              </Button>
            </>
          )}
        </div>

        {/* =====================================================
            MOBILE MENU
        ====================================================== */}

        {mobileMenuOpen && (
          <div
            className="
              mt-3
              w-full
              border-t
              border-border
              pt-4
              md:hidden
            "
          >
            <div className="flex flex-col gap-1">

              {/* HOME / DASHBOARD */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  rounded-lg
                  px-2
                  py-2
                "
              >
                <Label
                  htmlFor="page-toggle-mobile"
                  className="
                    cursor-pointer
                    font-medium
                    text-foreground
                  "
                >
                  {isDashboard
                    ? "Dashboard"
                    : "Home"}
                </Label>
              </div>

              {/* =================================================
                  MOBILE ABOUT
              ================================================== */}

              <div className="mt-1">

                <button
                  type="button"
                  onClick={() =>
                    setMobileAboutOpen(
                      (prev) => !prev
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-lg
                    px-2
                    py-2
                    text-left
                    text-sm
                    font-medium
                    text-muted-foreground
                    transition-colors
                    hover:bg-muted
                    hover:text-foreground
                  "
                >
                  <span>About</span>

                  <ChevronDown
                    className={`
                      h-4
                      w-4
                      transition-transform
                      duration-200
                      ${
                        mobileAboutOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />
                </button>

                {/* ABOUT SUB MENU */}

                {mobileAboutOpen && (
                  <div
                    className="
                      ml-3
                      mt-1
                      flex
                      flex-col
                      gap-1
                      border-l
                      border-border
                      pl-3
                    "
                  >
                    <Link
                      href="/about/history"
                      onClick={closeMobileMenu}
                      className="
                        rounded-lg
                        px-3
                        py-2
                        text-sm
                        text-muted-foreground
                        transition-colors
                        hover:bg-muted
                        hover:text-foreground
                      "
                    >
                      History
                    </Link>

                    <Link
                      href="/about/teachers"
                      onClick={closeMobileMenu}
                      className="
                        rounded-lg
                        px-3
                        py-2
                        text-sm
                        text-muted-foreground
                        transition-colors
                        hover:bg-muted
                        hover:text-foreground
                      "
                    >
                      Our Teachers
                    </Link>
                  </div>
                )}
              </div>

              {/* NOTICE */}

              <Link
                href="/notice"
                onClick={closeMobileMenu}
                className="
                  rounded-lg
                  px-2
                  py-2
                  text-sm
                  font-medium
                  text-muted-foreground
                  transition-colors
                  hover:bg-muted
                  hover:text-foreground
                "
              >
                Notice
              </Link>

              {/* CONTACT */}

              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className="
                  rounded-lg
                  px-2
                  py-2
                  text-sm
                  font-medium
                  text-muted-foreground
                  transition-colors
                  hover:bg-muted
                  hover:text-foreground
                "
              >
                Contact Us
              </Link>

              {/* =================================================
                  MOBILE AUTH
              ================================================== */}

              {!authLoading && (
                <div
                  className="
                    mt-3
                    border-t
                    border-border
                    pt-3
                  "
                >
                  {user ? (
                    <div className="px-2">

                      {/* USER INFO */}

                      <div className="mb-3 flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                        <UserAvatar />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {getUserName()}
                          </p>

                          {user.email && (
                            <p className="truncate text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* PROFILE */}

                      <button
                        type="button"
                        onClick={() => {
                          router.push("/profile");
                          closeMobileMenu();
                        }}
                        className="
                          flex
                          w-full
                          items-center
                          rounded-xl
                          px-3
                          py-2.5
                          text-sm
                          font-medium
                          transition-colors
                          hover:bg-muted
                        "
                      >
                        <User className="mr-3 h-4 w-4" />
                        Profile
                      </button>

                      {/* DASHBOARD */}

                      <button
                        type="button"
                        onClick={() => {
                          router.push("/dashboard");
                          closeMobileMenu();
                        }}
                        className="
                          flex
                          w-full
                          items-center
                          rounded-xl
                          px-3
                          py-2.5
                          text-sm
                          font-medium
                          transition-colors
                          hover:bg-muted
                        "
                      >
                        <LayoutDashboard className="mr-3 h-4 w-4" />
                        Dashboard
                      </button>

                      {/* LOGOUT */}

                      <button
                        type="button"
                        onClick={() => {
                          handleLogout();
                          closeMobileMenu();
                        }}
                        className="
                          flex
                          w-full
                          items-center
                          rounded-xl
                          px-3
                          py-2.5
                          text-sm
                          font-medium
                          text-red-500
                          transition-colors
                          hover:bg-red-500/10
                        "
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="
                        block
                        rounded-xl
                        px-3
                        py-2
                        text-center
                        text-sm
                        font-medium
                        text-foreground
                        transition-colors
                        hover:bg-muted
                      "
                    >
                      Sign in
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}