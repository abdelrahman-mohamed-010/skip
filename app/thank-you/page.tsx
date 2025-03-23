"use client";

import React from "react";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ThankYouPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-4xl font-bold text-primary mb-4">Thank You!</h1>

            <div className="w-32 h-1 bg-accent mx-auto mb-6 rounded-full"></div>

            <p className="text-lg text-secondary mb-8">
              Your submission has been received. We appreciate your interest and
              will be in touch with you shortly.
            </p>

            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
