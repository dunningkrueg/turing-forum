"use client"

import { useTheme } from "@/components/theme-provider"
import { Menu, Transition } from "@headlessui/react"
import { 
  MoonIcon, 
  SunIcon, 
  UserCircleIcon,
  MagnifyingGlassIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  BookmarkIcon,
  HomeIcon
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { Fragment, useState } from "react"

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Discussions", href: "/discussions", icon: ChatBubbleLeftRightIcon },
  { name: "Bookmarks", href: "/bookmarks", icon: BookmarkIcon },
]

export function TopNavigation() {
  const { theme, setTheme } = useTheme()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
              <span className="text-primary">Turing</span> Forum
          </Link>

            <div className="hidden md:flex md:items-center md:gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative hidden flex-1 max-w-md px-4 md:block">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="search"
              placeholder="Search discussions..."
              className="w-full rounded-full border bg-accent/50 pl-10 text-sm focus:bg-background"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              title="Search"
              aria-label="Search discussions"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            <button
              className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              title="Notifications"
              aria-label="View notifications"
            >
              <BellIcon className="h-5 w-5" />
            </button>

            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? (
                <MoonIcon className="h-5 w-5" />
              ) : (
                <SunIcon className="h-5 w-5" />
              )}
            </button>

            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 rounded-full p-2 hover:bg-accent">
                <UserCircleIcon className="h-5 w-5" />
                <span className="hidden text-sm font-medium md:block">Account</span>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="p-2">
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Sign in to participate
                    </div>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-accent text-accent-foreground" : "text-foreground"
                          } flex w-full items-center rounded-md px-2 py-1.5 text-sm`}
                        >
                          Sign In
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-accent text-accent-foreground" : "text-foreground"
                          } flex w-full items-center rounded-md px-2 py-1.5 text-sm`}
                        >
                          Register
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        {isSearchOpen && (
          <div className="border-t py-3 md:hidden">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="search"
                placeholder="Search discussions..."
                className="w-full rounded-full border bg-accent/50 pl-10 text-sm focus:bg-background"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 