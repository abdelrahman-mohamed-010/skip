"use client";

import { logUserEvent } from "@/lib/logger";
import { Phone } from "lucide-react";

interface CallButtonProps {
  phoneNumber: string;
  source: string;
  className?: string;
  children: React.ReactNode;
  showIcon?: boolean;
}

export default function CallButton({
  phoneNumber,
  source,
  className,
  children,
  showIcon,
}: CallButtonProps) {
  const handleClick = async () => {
    try {
      await logUserEvent("call_click", {
        phoneNumber,
        source,
        buttonType: "call",
      });
    } catch (error) {
      console.error("Failed to log call event:", error);
    }
  };

  return (
    <div className="group relative inline-block">
      <a
        href={`tel:${phoneNumber}`}
        className={className}
        onClick={handleClick}
      >
        {showIcon && <Phone className="w-5 h-5 mr-2 max-sm:w-4 max-sm:h-4" />}
        {children}
      </a>
      <div className="absolute left-0 right-0 top-full mt-2 hidden group-hover:block w-max">
        <div className="bg-white shadow-lg rounded-md p-3 whitespace-nowrap border border-gray-200">
          <p className="text-primary text-sm">
            Call Us @ 844-4-SKIPLEGAL (844-475-4753)
          </p>
        </div>
      </div>
    </div>
  );
}
