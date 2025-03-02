/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function CookieConsent() {
  const pathname = usePathname();
  const isStudio = pathname.startsWith("/studio");
  const [showConsent, setShowConsent] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true and disabled
    analytics: false,
    marketing: false,
  });
  const [showDetails, setShowDetails] = useState(false);

  // Don't render in studio
  if (isStudio) return null;

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowConsent(true);
    } else {
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
      } catch (e: any) {
        setShowConsent(true);
      }
    }
  }, []);

  const acceptAllCookies = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem("cookieConsent", JSON.stringify(allAccepted));
    setShowConsent(false);
  };

  const savePreferences = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    setShowConsent(false);
  };

  const declineCookies = () => {
    const allDeclined = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem("cookieConsent", JSON.stringify(allDeclined));
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 p-6 border-t border-gray-200"
    >
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">
              Cookie Preferences
            </h3>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            We value your privacy. We use cookies to enhance your browsing
            experience, analyze site traffic, and provide personalized content.
            Please read our{" "}
            <a
              href="/privacy"
              className="text-blue-600 hover:text-blue-700 underline decoration-blue-600/30 transition-colors"
            >
              Privacy Policy
            </a>
            .
          </p>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm w-fit group transition-colors"
          >
            <span className="underline decoration-blue-600/30">
              {showDetails ? "Hide Details" : "Show Details"}
            </span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                showDetails ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 bg-gray-50/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200"
            >
              {[
                {
                  title: "Necessary Cookies",
                  description: "Required for the website to function properly",
                  checked: true,
                  disabled: true,
                },
                {
                  title: "Analytics Cookies",
                  description: "Help us improve our website",
                  checked: preferences.analytics,
                  onChange: (e: any) =>
                    setPreferences({
                      ...preferences,
                      analytics: e.target.checked,
                    }),
                },
                {
                  title: "Marketing Cookies",
                  description: "Used for personalized advertising",
                  checked: preferences.marketing,
                  onChange: (e: any) =>
                    setPreferences({
                      ...preferences,
                      marketing: e.target.checked,
                    }),
                },
              ].map((cookie, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{cookie.title}</p>
                    <p className="text-sm text-gray-600">
                      {cookie.description}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookie.checked}
                      onChange={cookie.onChange}
                      disabled={cookie.disabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 justify-end pt-2">
          <button
            onClick={declineCookies}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
          >
            Decline All
          </button>
          {showDetails && (
            <button
              onClick={savePreferences}
              className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-600"
            >
              Save Preferences
            </button>
          )}
          <button
            onClick={acceptAllCookies}
            className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-600/25"
          >
            Accept All
          </button>
        </div>
      </div>
    </motion.div>
  );
}
