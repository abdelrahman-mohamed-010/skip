"use client";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";
import { Twitter, Facebook, Linkedin } from "lucide-react";

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
  Icon: typeof Twitter | typeof Facebook | typeof Linkedin;
  label: string;
  color: string;
  count: string;
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
      Icon: Twitter,
      label: "Tweet",
      color: "bg-[#1DA1F2] hover:bg-[#1a8cd8]",
      count: "1.2K",
    },
    {
      Button: FacebookShareButton,
      Icon: Facebook,
      label: "Share",
      color: "bg-[#4267B2] hover:bg-[#365899]",
      count: "892",
    },
    {
      Button: LinkedinShareButton,
      Icon: Linkedin,
      label: "Post",
      color: "bg-[#0077b5] hover:bg-[#006399]",
      count: "654",
    },
  ];

  if (!shareUrl) {
    return null; // Don't render if no valid URL
  }

  return (
    <div className="flex flex-col items-center gap-4 mb-12">
      <h3 className="text-xl font-semibold text-gray-700">
        Share this article
      </h3>
      <div className="flex gap-4">
        {shareButtons.map(({ Button, Icon, label, color, count }) => (
          <Button
            key={label}
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
