import React from "react";
import Navigation from "@/components/Navigation";
import FileSecuritySection from "@/components/home/components/FileSecuritySection";
import LegalDocumentsSection from "@/components/home/components/LegalDocumentsSection";
import TestimonialsSection from "@/components/home/components/TestimonialsSection";
import VideoShowcaseSection from "@/components/home/components/VideoShowcaseSection";
import FAQ from "@/components/home/components/FAQ";
import CallToActionSection from "@/components/home/components/CallToActionSection";
import Hero from "@/components/home/components/Hero";
import News from "@/components/home/components/News";

export default async function Home() {
  // Mock data for hero - in production, you would fetch this from Sanity
  const heroData = {
    journeyTitle: "Your Immigration Journey",
    startsText: "Starts Here",
    ctaNumber: "844-475-4753",
  };
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero heroData={heroData} />
     
      <FileSecuritySection />
      <VideoShowcaseSection />
      <LegalDocumentsSection /> <News />
      <TestimonialsSection />
      <FAQ />
      <CallToActionSection />
    </div>
  );
}
