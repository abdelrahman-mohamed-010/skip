/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Hero from "@/components/home/components/Hero";
import Features from "@/components/home/components/Features";
import Services from "@/components/home/components/Services";
import Process from "@/components/home/components/Process";
import News from "@/components/home/components/News";
import Navigation from "@/components/Navigation";
import ContactLawyerForm from "@/components/ContactLawyerForm";
import Footer from "@/components/Footer";
import { client } from "../sanity/lib/client";

// Fetch landing page with sections (hero included)
async function getLandingData() {
  const data = await client.fetch(`*[_type == "landing"][0]{ 
    sections,
    footer
  }`);
  return data ?? { sections: [], footer: {} };
}

export default async function Home() {
  const landingData = await getLandingData();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {landingData.sections.map((section: any) => {
        // Render section based on its _type.
        switch (section._type) {
          case "hero":
            return <Hero heroData={section} key={section._id || "hero"} />;
          case "features":
            return <Features key="features" data={section} />;
          case "services":
            return <Services key="services" data={section} />;
          case "process":
            return <Process key="process" data={section} />;
          default:
            return null;
        }
      })}
      <News />
      <ContactLawyerForm footerData={landingData.footer} />
      <Footer />
    </div>
  );
}
