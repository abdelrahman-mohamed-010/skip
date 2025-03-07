"use client";

import { usePathname } from "next/navigation";
import CookieConsent from "./CookieConsent";
import Footer from "./Footer";
import ContactLawyerForm from "./ContactLawyerForm";

export default function ConditionalFooterComponents() {
  const pathname = usePathname();
  const isStudioRoute = pathname.includes("/studio");

  if (isStudioRoute) {
    return null;
  }

  return (
    <>
      <CookieConsent />
      <ContactLawyerForm />
      <Footer />
    </>
  );
}
