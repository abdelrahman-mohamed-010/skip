"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { client } from "@/sanity/lib/client";

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
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          {/* Company Info */}
          <div className="space-y-4 max-w-xs">
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
                      className="p-2 rounded-full bg-primary/5 text-primary hover:bg-primary hover:text-white transition-colors duration-200"
                    >
                      <Icon />
                    </Link>
                  );
                }
              )}
              <a
                href={`mailto:${footerData.contactInfo?.email || ""}`}
                className="p-2 rounded-full bg-primary/5 text-primary hover:bg-primary hover:text-white transition-colors duration-200"
              >
                <Mail size={18} />
              </a>
              <a
                href={`tel:${footerData.contactInfo?.phone || ""}`}
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

        {/* New Resources row inserted between columns and bottom bar */}
        <div className="mb-8">
          <div className="flex items-center">
            <span className="text-lg text-primary relative after:bg-primary/30 after:-mb-1 block">
              Resources
            </span>
            <ul className="flex space-x-10 ml-6">
              <li>
                <Link
                  href="/immigration-blog"
                  className="text-secondary/80 hover:text-primary transition-colors duration-200"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/immigration-guide"
                  className="text-secondary/80 hover:text-primary transition-colors duration-200"
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/latest-immigration-news"
                  className="text-secondary/80 hover:text-primary transition-colors duration-200"
                >
                  News
                </Link>
              </li>
              <li>
                <Link
                  href="/asylum"
                  className="text-secondary/80 hover:text-primary transition-colors duration-200"
                >
                  asylum
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-secondary/80 hover:text-primary transition-colors duration-200"
                >
                  About
                </Link>
              </li>
            </ul>
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
