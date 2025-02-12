"use client";
import { usePathname } from "next/navigation";

export default function CanonicalLink() {
  const pathname = usePathname();
  const safePath = pathname || "/";
  const canonicalPath = safePath.split("?")[0];
  const canonicalUrl = `https://skiplegal.ai${canonicalPath}`;
  return <link rel="canonical" href={canonicalUrl} />;
}
