"use client";

import { usePathname } from "next/navigation";
import CookieConsent from "./CookieConsent";
import Footer from "./Footer";
import ContactLawyerForm from "./ContactLawyerForm";

export default function ConditionalFooterComponents() {
  const pathname = usePathname();
  const isStudioRoute = pathname.includes("/studio");
  const isThankYouPage = pathname.includes("/thank-you");
  const isAppRoute = pathname.includes("/app");

  if (isStudioRoute || isThankYouPage || isAppRoute) {
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
