"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  // MapPin,
} from "lucide-react";
import { client } from "@/sanity/lib/client";

const query = `*[_type == "footer"][0]{
  companyInfo{
    description,
    socialLinks[]{
      platform,
      url
    }
  },
  quickLinks[]{
    text,
    url
  },
  ourServices[]{
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
    <footer className="bg-gradient-to-b from-white to-primary/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
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
                    facebook: Facebook,
                    twitter: Twitter,
                    instagram: Instagram,
                    linkedin: Linkedin,
                  };
                  const Icon = icons[link.platform];
                  return (
                    <Link
                      key={i}
                      href={link.url || "3"}
                      className="p-2 rounded-full bg-primary/5 text-primary hover:bg-primary hover:text-white transition-colors duration-200"
                    >
                      <Icon size={18} />
                    </Link>
                  );
                }
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-primary mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {footerData.quickLinks?.map(
                (item: { text: string; url: string | null }, i: number) => (
                  <li key={i}>
                    <Link
                      href={item.url || "3"}
                      className="text-secondary/80 hover:text-primary transition-colors duration-200"
                    >
                      {item.text}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="text-lg font-semibold text-primary mb-6">
              Our Services
            </h4>
            <ul className="space-y-3">
              {footerData.ourServices?.map(
                (item: { text: string; url: string | null }, i: number) => (
                  <li key={i}>
                    <Link
                      href={item.url || "3"}
                      className="text-secondary/80 hover:text-primary transition-colors duration-200"
                    >
                      {item.text}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-primary mb-6">
              Get in Touch
            </h4>
            <div className="space-y-3">
              <a
                href={`mailto:${footerData.contactInfo?.email || ""}`}
                className="flex items-center space-x-3 px-4 py-2.5 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors duration-200"
              >
                <Mail size={18} className="text-primary" />
                <span className=" text-primary">
                  {footerData.contactInfo?.email}
                </span>
              </a>
              <a
                href={`tel:${footerData.contactInfo?.phone || ""}`}
                className="flex items-center space-x-3 px-4 py-2.5 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors duration-200"
              >
                <Phone size={18} className="text-primary" />
                <span className=" text-primary">
                  {footerData.contactInfo?.phone}
                </span>
              </a>
              {/* <div className="flex items-center space-x-3 px-4 py-2.5 bg-primary/5 rounded-xl">
                <MapPin size={18} className="text-primary" />
                <span className=" text-primary">
                  {footerData.contactInfo?.address}
                </span>
              </div> */}
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
