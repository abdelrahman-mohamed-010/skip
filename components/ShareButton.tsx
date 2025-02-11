"use client";

interface ShareButtonProps {
  title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href });
    }
  };

  return (
    <button
      onClick={handleShare}
      className="text-gray-600 hover:text-gray-800"
      title="Share this page"
    >
      🔗
    </button>
  );
}
