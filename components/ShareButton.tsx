"use client";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";
import { Twitter, Facebook, Linkedin } from "lucide-react";

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
          <Twitter size={iconSize} />
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
