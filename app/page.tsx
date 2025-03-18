/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Hero from "@/components/home/components/Hero";
import Features from "@/components/home/components/Features";
import Services from "@/components/home/components/Services";
import Process from "@/components/home/components/Process";
import News from "@/components/home/components/News";
import Navigation from "@/components/Navigation";
// Import the client wrapper component
import { client } from "../sanity/lib/client";

// Fetch landing page sections
async function getData() {
  try {
    const data = await client.fetch(`*[_type == "landing"][0]{ 
      sections
    }`);
    return data ?? { sections: [] };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return { sections: [] };
  }
}

export default async function Home() {
  const data = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {data.sections.map((section: any) => {
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
      
      {/* API Test Button */}
      <div className="w-full max-w-5xl mt-10 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Debug Tools</h2>
        <p className="mb-4">Use this button to test if the chat API is working correctly.</p>
      </div>
    </div>
  );
}
