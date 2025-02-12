"use client";

import { Share2 } from "lucide-react";

export default function ShareBtnInner() {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ url: window.location.href });
    }
  };

  return (
    <div className="  flex justify-center mb-20 mt-7">
      <button
        onClick={handleShare}
        className={
          "text-white p-3 px-12 rounded-full font-bold bg-primary flex items-center justify-center gap-4"
        }
        title="Share this page"
      >
        Share Page<Share2 className=" w-5 h-5" />
      </button>
    </div>
  );
}
