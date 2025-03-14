"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import {
  Menu,
  X,
  Home,
  HelpCircle,
  Lock,
  Shield,
  ChevronDown,
} from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export interface NavItem {
  itemType: "link" | "title";
  text: string;
  link?: string;
  subItems?: SubItem[];
}

export interface SubItem {
  text: string;
  link: string;
}

export interface NavigationData {
  title: string;
  items: NavItem[];
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([]);
  const [navigation, setNavigation] = useState<NavigationData | null>(null);

  useEffect(() => {
    const fetchNavigation = async () => {
      const result = await client.fetch<NavigationData>(`
        *[_type == "navigation"][0] {
          title,
          items[] {
            itemType,
            text,
            link,
            subItems[] {
              text,
              link
            }
          }
        }
      `);
      if (result) setNavigation(result);
    };

    fetchNavigation();
  }, []);

  const toggleSubMenu = (title: string) => {
    setOpenSubMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const footerLinks = [
    { title: "About", path: "/about", icon: HelpCircle },
    { title: "Terms", path: "/terms", icon: Lock },
    { title: "Privacy", path: "/privacy", icon: Shield },
  ];

  return (
    <>
      <div className="fixed w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <nav className="h-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 capitalize">
          <div className="flex justify-between items-center h-full">
            <Link href="/" className="flex items-center space-x-2 shrink-0 p-2">
              <Image src="/logo.svg" alt="Logo" width={32} height={32} />
              <span className="xl:text-lg 2xl:text-xl font-bold text-primary">
                SKIP<span className=" text-blue-700">LEGAL</span>.ai
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden xl:flex items-center">
              {navigation?.items.map((item) => (
                <div key={item.text} className="relative group px-1.5">
                  <div className="relative">
                    <Link
                      href={item.link || "#"}
                      className="flex items-center xl:text-[13px] 2xl:text-[15px] py-2 px-2.5 rounded-md text-secondary hover:text-primary hover:bg-gray-50 transition-all duration-200"
                    >
                      <span className="font-medium">{item.text}</span>
                      {item.subItems && (
                        <ChevronDown className="w-4 h-4 ml-0.5 transition-transform group-hover:rotate-180" />
                      )}
                    </Link>
                    {item.subItems && (
                      <div className="absolute left-0 mt-1 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.text}
                            href={subItem.link}
                            className="block px-4 py-2 xl:text-xs 2xl:text-sm text-secondary hover:bg-gray-50 hover:text-primary transition-colors duration-200"
                          >
                            {subItem.text}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3 ml-0 pl-2 border-l border-gray-200 max-xl:hidden">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 xl:text-xs 2xl:text-sm font-medium text-secondary hover:text-primary transition-colors">
                    Log in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 xl:text-xs 2xl:text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-md transition-colors">
                    Sign up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="xl:hidden p-1.5 rounded-md text-secondary hover:text-primary"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 xl:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[340px] bg-white z-50 xl:hidden
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full overflow-y-auto">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-3"
              onClick={() => setIsOpen(false)}
            >
              <Home className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-primary">SkipLegal</span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 -mr-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5 text-secondary" />
            </button>
          </div>

          {/* Mobile Menu Items */}
          <div className="py-4 px-4">
            {navigation?.items.map((item) => (
              <div key={item.text} className="mb-2">
                {item.subItems ? (
                  <div>
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.link || "#"}
                        className="flex-1 p-3 rounded-md text-secondary hover:text-primary hover:bg-gray-50"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="font-medium">{item.text}</span>
                      </Link>
                      <button
                        onClick={() => toggleSubMenu(item.text)}
                        className="p-3 rounded-md text-secondary hover:text-primary hover:bg-gray-50"
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-200 
                            ${openSubMenus.includes(item.text) ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                    <div
                      className={`
                        overflow-hidden transition-all duration-200 ease-in-out
                        ${
                          openSubMenus.includes(item.text)
                            ? "max-h-[1000px] opacity-100"
                            : "max-h-0 opacity-0"
                        }
                      `}
                    >
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.text}
                            href={subItem.link}
                            className="block pl-6 pr-3 py-2.5 text-sm text-secondary hover:text-primary hover:bg-gray-50 rounded-md"
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.text}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.link || "#"}
                    className="flex items-center space-x-3 p-3 rounded-md text-secondary hover:text-primary hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="font-medium">{item.text}</span>
                  </Link>
                )}
              </div>
            ))}

            {/* Auth Buttons in Mobile Menu */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="flex items-center w-full p-3 mb-2 rounded-md text-secondary hover:text-primary hover:bg-gray-50">
                    <span className="font-medium">Log in</span>
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="flex items-center w-full p-3 rounded-md text-white bg-blue-700 hover:bg-blue-800">
                    <span className="font-medium">Sign up</span>
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center justify-center py-4">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              {footerLinks.map((item) => (
                <Link
                  key={item.title}
                  href={item.path}
                  className="flex items-center space-x-3 p-3 rounded-md text-secondary hover:text-primary hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
