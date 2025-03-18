"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { client } from "@/sanity/lib/client";

// Update the query to include column4
const query = `*[_type == "footer"][0]{
  companyInfo{
    description,
    socialLinks[]{
      platform,
      url
    }
  },
  column1[]{
    text,
    url
  },
  column2[]{
    text,
    url
  },
  column3[]{
    text,
    url
  },
  column4[]{
    text,
    url
  },
  contactInfo{
    email,
    phone,
    address
  },
  bottomLinks[]{
    text,
    url
  }
}`;

const Footer = ({ footerData: initialFooterData }: { footerData?: any }) => {
  const [footerData, setFooterData] = useState<any>(initialFooterData);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (!footerData) {
      (async () => {
        try {
          const data = await client.fetch(query);
          setFooterData(data);
        } catch (error) {
          console.error("Error fetching footer:", error);
        }
      })();
    }
  }, [footerData]);

  if (!footerData) return null;

  return (
    <footer className="bg-gradient-to-b from-[#ffffff] to-[#eaeaea] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col space-y-12">
          {/* Combined grid for all columns */}
          <div className="grid grid-cols-1 md:grid-cols-[320px_repeat(3,1fr)] gap-12">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">SkipLegal</h3>
              <p className="text-secondary/80 leading-relaxed">
                {footerData.companyInfo?.description}
              </p>
              <div className="flex items-center space-x-4">
                {footerData.companyInfo?.socialLinks?.map(
                  (link: any, i: number) => {
                    const icons: any = {
                      facebook: () => <Facebook size={18} />,
                      twitter: () => (
                        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
                          <path
                            fill="currentColor"
                            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                          />
                        </svg>
                      ),
                      instagram: () => <Instagram size={18} />,
                      linkedin: () => <Linkedin size={18} />,
                    };
                    const Icon = icons[link.platform];
                    return (
                      <Link
                        key={i}
                        href={link.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-primary/5 text-primary hover:bg-primary hover:text-white transition-colors duration-200"
                      >
                        <Icon />
                      </Link>
                    );
                  }
                )}
                <a
                  href={`mailto:${footerData.contactInfo?.email || ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-primary/5 text-primary hover:bg-primary hover:text-white transition-colors duration-200"
                >
                  <Mail size={18} />
                </a>
                <a
                  href={`tel:${footerData.contactInfo?.phone || ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-primary/5 text-primary hover:bg-primary hover:text-white transition-colors duration-200"
                >
                  <Phone size={18} />
                </a>
              </div>
            </div>

            {/* Column 1 */}
            <div>
              <ul className="space-y-3">
                {footerData.column1?.map(
                  (item: { text: string; url: string | null }, i: number) => (
                    <li key={i}>
                      <Link
                        href={item.url || "#"}
                        className={`${
                          i === 0
                            ? "text-lg text-primary relative after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-primary/30 after:-mb-1 pb-2 block"
                            : "text-secondary/80 hover:text-primary"
                        } transition-colors duration-200`}
                      >
                        {item.text}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <ul className="space-y-3">
                {footerData.column2?.map(
                  (item: { text: string; url: string | null }, i: number) => (
                    <li key={i}>
                      <Link
                        href={item.url || "#"}
                        className={`${
                          i === 0
                            ? "text-lg text-primary relative after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-primary/30 after:-mb-1 pb-2 block"
                            : "text-secondary/80 hover:text-primary"
                        } transition-colors duration-200`}
                      >
                        {item.text}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <ul className="space-y-3">
                {footerData.column3?.map(
                  (item: { text: string; url: string | null }, i: number) => (
                    <li key={i}>
                      <Link
                        href={item.url || "#"}
                        className={`${
                          i === 0
                            ? "text-lg text-primary relative after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-primary/30 after:-mb-1 pb-2 block"
                            : "text-secondary/80 hover:text-primary"
                        } transition-colors duration-200`}
                      >
                        {item.text}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Bottom section using same grid */}
          <div className="grid grid-cols-1 md:grid-cols-[320px_repeat(3,1fr)] gap-12 pb-10">
            {/* Empty cell for alignment */}
            <div className="hidden md:block"></div>

            {/* Information Hub using 2 columns space */}
            <div className="md:col-span-2">
              <span className="text-lg text-primary relative after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-primary/30 after:-mb-1 pb-2 block">
                Information Hub
              </span>
              <div className="mt-4 grid grid-cols-2 gap-x-12 gap-y-2">
                <Link
                  href="/immigration-blog"
                  className="text-secondary/80 hover:text-primary transition-colors duration-200"
                >
                  Blog
                </Link>
                <Link
                  href="/latest-immigration-news"
                  className="text-secondary/80 hover:text-primary transition-colors duration-200"
                >
                  News
                </Link>
                <Link
                  href="/immigration-guide"
                  className="text-secondary/80 hover:text-primary transition-colors duration-200"
                >
                  Guides
                </Link>
                <Link
                  href="/about-us"
                  className="text-secondary/80 hover:text-primary transition-colors duration-200"
                >
                  About
                </Link>
              </div>
            </div>

            {/* Column 4 */}
            <div>
              <span className="text-lg text-primary relative after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-primary/30 after:-mb-1 pb-2 block">
                {footerData.column4?.[0]?.text || "Additional Links"}
              </span>
              <ul className="mt-4 space-y-3">
                {footerData.column4
                  ?.slice(1)
                  .map(
                    (item: { text: string; url: string | null }, i: number) => (
                      <li key={i}>
                        <Link
                          href={item.url || "#"}
                          className="text-secondary/80 hover:text-primary transition-colors duration-200"
                        >
                          {item.text}
                        </Link>
                      </li>
                    )
                  )}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary/10 ">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-secondary/60 text-sm">
              © {currentYear} SkipLegal. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              {footerData.bottomLinks?.map(
                (item: { text: string; url: string | null }, i: number) => (
                  <Link
                    key={i}
                    href={item.url || "3"}
                    className="text-secondary/60 hover:text-primary text-sm"
                  >
                    {item.text}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
