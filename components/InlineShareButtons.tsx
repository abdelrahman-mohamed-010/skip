/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";
import { Facebook, Linkedin } from "lucide-react";

interface InlineShareButtonsProps {
  url: string;
  title: string;
  showCounts?: boolean;
}

interface ShareButtonConfig {
  Button:
    | typeof TwitterShareButton
    | typeof FacebookShareButton
    | typeof LinkedinShareButton;
  Icon:
    | typeof Facebook
    | typeof Linkedin
    | React.ComponentType<{ size: number; strokeWidth: number }>;
  label: string;
  color: string;
  count: string;
  platform: string;
}

export default function InlineShareButtons({
  url,
  title,
  showCounts = false,
}: InlineShareButtonsProps) {
  // Ensure we have a valid URL
  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");
  const shareTitle = title || document.title;

  const shareButtons: ShareButtonConfig[] = [
    {
      Button: TwitterShareButton,
      Icon: ({ size }: { size: number }) => (
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <path
            fill="currentColor"
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          />
        </svg>
      ),
      label: "Post",
      color: "bg-black hover:bg-gray-900",
      count: "1.2K",
      platform: "twitter",
    },
    {
      Button: FacebookShareButton,
      Icon: Facebook,
      label: "Share",
      color: "bg-[#4267B2] hover:bg-[#365899]",
      count: "892",
      platform: "facebook",
    },
    {
      Button: LinkedinShareButton,
      Icon: Linkedin,
      label: "Post",
      color: "bg-[#0077b5] hover:bg-[#006399]",
      count: "654",
      platform: "linkedin",
    },
  ];

  if (!shareUrl) {
    return null; // Don't render if no valid URL
  }

  return (
    <div className="flex flex-col items-center gap-4 bg-white ">
      <h3 className="text-xl font-semibold text-gray-700">
        Share this article
      </h3>
      <div className="flex gap-4">
        {shareButtons.map(({ Button, Icon, label, color, count, platform }) => (
          <Button
            key={platform}
            url={shareUrl}
            title={shareTitle}
            className="focus:outline-none"
          >
            <div
              className={`
                flex items-center gap-3 px-5 py-2.5
                rounded-lg transition-all duration-200
                ${color} border border-transparent
                text-white/90 hover:text-white
                shadow-sm hover:shadow-md
                transform hover:-translate-y-0.5
              `}
            >
              <Icon size={20} strokeWidth={2.5} />
              <span className="font-medium text-sm">{label}</span>
              {showCounts && (
                <span className="text-xs opacity-90 font-light">({count})</span>
              )}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
