"use client";

import { ArrowRight } from "lucide-react";
import CallButton from "@/components/CallButton";

const CallToActionSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-primary to-primary/90 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="p-8 md:p-12 lg:pl-16">
              <div className="space-y-6 max-w-xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Start Using AI-Powered Legal Document Processing Today
                </h2>

                <p className="text-white/90 text-lg">
                  Join thousands of users who are simplifying their legal
                  document processing with our secure, AI-powered platform. Get
                  started in minutes.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <button className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary rounded-full font-medium hover:bg-opacity-90 transition-colors shadow-lg">
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <CallButton
                    phoneNumber="8444754753"
                    source="cta-section"
                    showIcon
                    className="inline-flex items-center px-8 py-3 text-white bg-transparent border-2 border-white hover:bg-white hover:text-primary rounded-full transition-colors shadow-lg hover:shadow-xl"
                  >
                    Call Us Now
                  </CallButton>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block h-full">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/95 p-8 rounded-xl shadow-2xl max-w-md transform -translate-x-10">
                    <div className="space-y-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold text-primary">
                            Faster Processing
                          </h4>
                          <p className="text-gray-600">
                            AI analyzes documents in seconds
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold text-primary">
                            Secure Platform
                          </h4>
                          <p className="text-gray-600">
                            Bank-level data protection
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold text-primary">
                            Expert Guidance
                          </h4>
                          <p className="text-gray-600">
                            AI insights with attorney backup
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* Stats grid instead of steps */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100">
            <div className="inline-flex mb-4 p-3 bg-primary/10 rounded-full">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-primary mb-2">Instant</h3>
            <p className="text-gray-700">
              AI-powered document processing and analysis
            </p>
          </div>

          <div className="text-center bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100">
            <div className="inline-flex mb-4 p-3 bg-primary/10 rounded-full">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-primary mb-2">Secured</h3>
            <p className="text-gray-700">
              Enterprise-grade protection for your legal documents
            </p>
          </div>

          <div className="text-center bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100">
            <div className="inline-flex mb-4 p-3 bg-primary/10 rounded-full">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-primary mb-2">Smart</h3>
            <p className="text-gray-700">
              Advanced AI that understands complex legal documents
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
