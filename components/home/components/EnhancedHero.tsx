"use client";

import { useState } from "react";
import LawyerBot from "./LawyerBot";
import CallButton from "@/components/CallButton";
import AttorneyHelpModal from "@/components/AttorneyHelpModal";
import { UserPlus, Shield, FileCheck, Bot } from "lucide-react";

interface HeroProps {
  heroData: {
    journeyTitle: string;
    startsText: string;
    ctaNumber: string;
  };
}

const EnhancedHero = ({ heroData }: HeroProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative min-h-screen py-16 lg:py-20 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-white via-primary/5 to-white">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col space-y-6">
            <div className="inline-flex px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold">
              <span>AI-POWERED LEGAL ASSISTANT</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 animate-fadeIn">
              <span className="block text-primary/90 leading-tight">
                {heroData.journeyTitle}
              </span>
              <span className="relative inline-block text-4xl sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary">
                {heroData.startsText}
                <div className="absolute -bottom-2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              </span>
            </h1>

            <p className="text-lg text-gray-700 mt-4">
              Upload your legal documents securely and get instant insights,
              guidance, and answers from our AI-powered legal assistant.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="bg-white p-2 rounded-full shadow-md">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium">
                  Bank-level document security
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="bg-white p-2 rounded-full shadow-md">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium">
                  AI-powered legal assistant
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="bg-white p-2 rounded-full shadow-md">
                  <FileCheck className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium">
                  Document analysis & guidance
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 text-white bg-primary border-2 border-primary hover:bg-white hover:text-primary rounded-full transition-all shadow-lg hover:shadow-xl font-medium transform hover:scale-100 duration-300"
              >
                <UserPlus className="w-5 h-5" />
                <span>Get Attorney Help</span>
              </button>

              <CallButton
                phoneNumber="8444754753"
                source="hero-section"
                showIcon
                className="inline-flex items-center px-6 py-3 text-lg font-medium text-primary bg-transparent border-2 border-primary hover:bg-primary hover:text-white rounded-full transition-colors shadow-lg hover:shadow-xl"
              >
                Call Us Now
              </CallButton>
            </div>
          </div>

          <div className="mt-8 lg:mt-0 bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
            <LawyerBot />
          </div>
        </div>
      </div>

      {/* Abstract shapes */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-accent/5 rounded-full filter blur-3xl -z-10"></div>

      {/* Attorney Help Modal */}
      <AttorneyHelpModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default EnhancedHero;
