"use client";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";
import { Facebook, Linkedin } from "lucide-react";

interface ShareButtonProps {
  title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const iconSize = 20;

  return (
    <div className="flex gap-2">
      <TwitterShareButton url={url} title={title}>
        <div className="w-8 h-8 p-1.5 text-gray-600 hover:bg-gray-100">
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              fill="currentColor"
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            />
          </svg>
        </div>
      </TwitterShareButton>

      <FacebookShareButton url={url} title={title}>
        <div className="w-8 h-8 p-1.5 text-gray-600 hover:bg-gray-100">
          <Facebook size={iconSize} />
        </div>
      </FacebookShareButton>

      <LinkedinShareButton url={url} title={title}>
        <div className="w-8 h-8 p-1.5 text-gray-600 hover:bg-gray-100">
          <Linkedin size={iconSize} />
        </div>
      </LinkedinShareButton>
    </div>
  );
}
