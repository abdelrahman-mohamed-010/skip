"use client";
import { Share } from "lucide-react";

interface ShareButtonProps {
  title?: string;
  url?: string;
  className?: string;
}

export default function ShareButton({
  title,
  url,
  className = "text-gray-600 hover:text-gray-800",
}: ShareButtonProps) {
  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");
  const shareTitle =
    title || (typeof window !== "undefined" ? document.title : "");

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareTitle}\n${shareUrl}`);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 
        transition-all duration-200 hover:bg-gray-100 ${className}`}
      title="Share this page"
    >
      <Share size={18} />
      <span>Share</span>
    </button>
  );
}
