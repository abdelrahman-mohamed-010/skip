"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className=" w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <nav className="h-16 mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2  p-2">
          <Image src="/logo.svg" alt="Logo" width={32} height={32} />
          <span className="xl:text-lg 2xl:text-xl font-bold text-primary">
            SKIP<span className="text-blue-700">LEGAL</span>.ai
          </span>
        </Link>
        <div className="flex items-center space-x-3">
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
      </nav>
    </div>
  );
};

export default Navbar;
