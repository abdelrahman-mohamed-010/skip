"use client";

import { useState } from "react";
import LawyerBot from "./LawyerBot";
import CallButton from "@/components/CallButton";
import AttorneyHelpModal from "@/components/AttorneyHelpModal";
import { UserPlus } from "lucide-react";

interface HeroProps {
  heroData: {
    journeyTitle: string;
    startsText: string;
    ctaNumber: string;
  };
}

const Hero = ({ heroData }: HeroProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative md:min-h-screen py-24  max-sm:pb-12 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-white via-primary/5 to-primary/10">
      <div className="max-w-7xl mx-auto text-center relative">
        <span className="inline-flex lg:mt-6 items-center max-sm:mt-3 px-4 py-1.5 bg-white/80 backdrop-blur-sm text-primary rounded-full text-sm max-sm:text-sm font-medium mb-8 max-sm:mb-6 animate-float border border-primary/10 shadow-sm">
          <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
          Welcome to SkipLegal
        </span>

        <div className="space-y-4 sm:space-y-6 relative">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight animate-fadeIn max-sm:leading-tight">
            <span className="block text-primary/90 leading-tight max-sm:text-3xl">
              {heroData.journeyTitle}
            </span>

            <span className="relative inline-block mt-2 sm:mt-4 text-3xl sm:text-5xl lg:text-6xl max-sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary">
              {heroData.startsText}
              <div className="absolute -bottom-2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </span>
          </h1>

          {/* Enhanced Attorney Help Section */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8 px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-md border border-primary/10 flex items-center md:mr-3">
              <span className="text-primary/90 font-medium text-sm md:text-base">
                Need personalized legal advice?{" "}
                <span className="font-semibold block md:inline">
                  Our attorneys are ready to help.
                </span>
              </span>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-3 text-white bg-primary border-2 border-primary hover:bg-white hover:text-primary rounded-full transition-all shadow-lg hover:shadow-xl font-medium transform hover:scale-100 duration-300"
            >
              <UserPlus className="w-5 h-5" />
              <span>Get Attorney Help</span>
            </button>
          </div>

          <div className="mt-8 sm:mt-12 max-w-4xl mx-auto animate-fadeIn">
            <LawyerBot />
          </div>
        </div>
        <div className="group relative inline-block">
          <CallButton
            phoneNumber="8444754753"
            source="hero-section"
            showIcon
            className="inline-flex items-center px-12 max-sm:px-8 py-3 mt-12 text-lg max-sm:text-base font-medium text-white bg-primary border-2 border-primary hover:bg-white hover:text-primary rounded-full transition-colors shadow-lg hover:shadow-xl"
          >
            Call Us Now
          </CallButton>
          <div className="absolute left-0 right-0 top-full mt-2 hidden group-hover:block w-max">
            <div className="bg-white shadow-lg rounded-md p-3 whitespace-nowrap border border-gray-200">
              <p className="text-primary text-sm">
                Call Us @ 844-4-SKIPLEGAL (844-475-4753)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attorney Help Modal */}
      <AttorneyHelpModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default Hero;
