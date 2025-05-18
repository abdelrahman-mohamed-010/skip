"use client";

import { FileSearch } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
            <span>POWERFUL FEATURES</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need For{" "}
            <span className="text-primary">Legal Document Processing</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our platform combines AI technology with legal expertise to provide
            comprehensive document processing and guidance.
          </p>
        </div>

        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 md:p-12 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                Smart Document Analysis
              </h3>
              <p className="text-white/90 mb-8 text-lg">
                Our AI can detect document types, extract key information,
                identify missing elements, and provide recommendations - all in
                seconds.
              </p>

              <ul className="space-y-4">
                {[
                  "Automatic document classification and analysis",
                  "Key information extraction and summarization",
                  "Identification of missing or incorrect information",
                  "Side-by-side comparison of documents",
                  "Intelligent recommendations based on document content",
                  "Historical tracking of document changes",
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-4">
                    <span className="w-3 h-3 bg-white rounded-full"></span>
                    <span className="text-white/90 text-lg">{item}</span>
                  </li>
                ))}
              </ul>

              <button className="mt-10 px-8 py-4 bg-white text-primary font-semibold rounded-full shadow-lg hover:bg-opacity-90 transition-colors text-lg">
                Learn More About Our Technology
              </button>
            </div>

            <div className="relative lg:h-auto min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/30">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4">
                  <div className="bg-white/95 p-8 rounded-2xl shadow-2xl">
                    <div className="flex items-center mb-6">
                      <FileSearch className="w-10 h-10 text-primary mr-4" />
                      <h4 className="text-2xl font-bold text-primary">
                        Document Analysis
                      </h4>
                    </div>

                    <div className="space-y-4">
                      <div className="h-3 bg-slate-100 rounded-full w-full"></div>
                      <div className="h-3 bg-slate-100 rounded-full w-5/6"></div>
                      <div className="h-3 bg-slate-100 rounded-full w-4/6"></div>
                    </div>

                    <div className="mt-8 p-4 bg-slate-50 rounded-xl">
                      <p className="text-base text-gray-700">
                        <span className="font-semibold text-primary">
                          Processing Document:
                        </span>{" "}
                        I-130 Petition for Alien Relative
                      </p>
                    </div>

                    <div className="mt-4 p-4 bg-green-50 rounded-xl">
                      <p className="text-base text-green-700 font-medium">
                        Analysis complete - 3 insights found
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
