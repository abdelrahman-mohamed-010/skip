"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { X } from "lucide-react";
import { logUserEvent } from "@/lib/logger";

interface AttorneyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AttorneyHelpModal = ({ isOpen, onClose }: AttorneyHelpModalProps) => {
  // Track if the form has been loaded
  const [isFormLoaded, setIsFormLoaded] = useState(false);

  useEffect(() => {
    // If modal is opened, reset the form loaded state
    if (isOpen && !isFormLoaded) {
      setIsFormLoaded(true);
    }

    // Listen for HubSpot form submission
    const handleFormSubmit = (event: MessageEvent) => {
      if (
        event.data.type === "hsFormCallback" &&
        event.data.eventName === "onFormSubmit"
      ) {
        try {
          logUserEvent("form_submit", {
            formId: "ee3448e0-9779-44b2-ae23-638918c34575",
            portalId: "48301226",
            source: "attorney-help-modal",
            email: event?.target?.querySelector('input[type="email"]')?.value,
          });

          // Auto-close the modal after successful submission (with a delay)
          setTimeout(() => {
            onClose();
          }, 2000);
        } catch (error) {
          console.error("Failed to log form submission:", error);
        }
      }
    };

    // Lock body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("message", handleFormSubmit);
    }

    return () => {
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = "";
      window.removeEventListener("message", handleFormSubmit);
    };
  }, [isOpen, isFormLoaded, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Semi-transparent backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal container with single scrolling mechanism */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 py-8">
          {/* Modal content */}
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-primary">
                Get Attorney Help
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal content - no overflow here */}
            <div className="p-4">
              <p className="text-gray-700 mb-4">
                Fill out this form to connect with our experienced immigration
                attorneys who will guide you through your immigration journey.
              </p>

              <Script
                src="https://js.hsforms.net/forms/embed/48301226.js"
                strategy="afterInteractive"
                defer
              />

              <div
                className="hs-form-frame"
                data-region="na1"
                data-form-id="ee3448e0-9779-44b2-ae23-638918c34575"
                data-portal-id="48301226"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttorneyHelpModal;
