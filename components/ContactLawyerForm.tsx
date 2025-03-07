"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { client } from "../sanity/lib/client";

interface FooterData {
  legalAssistanceTitle?: string;
  legalAssistanceDescription?: string;
}

const ContactLawyerForm = () => {
  const [footerData, setFooterData] = useState<FooterData | null>(null);

  useEffect(() => {
    async function fetchMeta() {
      const data = await client.fetch(
        `*[_type == "contactFormMeta"][0]{ legalAssistanceTitle, legalAssistanceDescription }`
      );
      setFooterData(data);
    }
    fetchMeta();
  }, []);

  return (
    <section
      id="contact-lawyer-form"
      className="py-16 max-sm:py-8 pt-0 bg-gradient-to-b mt-12 from-white to-primary/5"
    >
      <div className="max-w-4xl mx-auto px-4 max-sm:px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-sm:mb-6">
          <h2 className="text-3xl max-sm:text-2xl font-bold text-primary mb-4 max-sm:mb-2">
            {footerData?.legalAssistanceTitle || "Get Legal Assistance"}
          </h2>
          <p className="text-secondary/80 max-w-2xl mx-auto max-sm:text-sm">
            {footerData?.legalAssistanceDescription ||
              "Connect with our experienced immigration lawyers for personalized guidance on your journey"}
          </p>
        </div>

        {/* HubSpot Embedded Form */}
        <Script
          src="https://js.hsforms.net/forms/embed/48301226.js"
          strategy="afterInteractive"
          defer
        />
        <div
          className="hs-form-frame"
          data-region="na1"
          data-form-id="ee3448e0-9779-44b2-ae23-638918c34575"
          data-portal-id="48301226"
        />
      </div>
    </section>
  );
};

export default ContactLawyerForm;
