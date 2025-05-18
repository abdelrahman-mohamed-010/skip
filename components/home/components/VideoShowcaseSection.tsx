"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import Link from "next/link";

const VideoShowcaseSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full -translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
            <span>SEE IT IN ACTION</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Transform Your Legal Document Processing
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Watch how our AI legal assistant analyzes documents, extracts key
            information, and provides actionable guidance - all while
            maintaining the highest security standards.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-slate-900">
            {isPlaying ? (
              <iframe
                src={videoUrl}
                className="absolute inset-0 w-full h-full"
                title="SkipLegal AI Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div
                className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=90&w=2940')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <button
                    onClick={handlePlayVideo}
                    className="group relative w-24 h-24 rounded-full bg-white/95 flex items-center justify-center shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <div className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                    <Play className="w-12 h-12 text-primary ml-1 group-hover:scale-110 transition-transform" />
                  </button>
                  <h3 className="mt-6 text-2xl text-white font-bold text-shadow-lg">
                    Watch Demo Video
                  </h3>
                </div>
              </div>
            )}
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-primary">90%</div>
                  <p className="text-gray-600">Faster Processing</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-primary">99.9%</div>
                  <p className="text-gray-600">Security Rating</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <p className="text-gray-600">AI Assistance</p>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Apply Now button */}
          <div className="flex justify-center mt-12">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-8 py-3 text-white bg-primary border-2 border-primary hover:bg-white hover:text-primary rounded-full transition-all shadow-lg hover:shadow-xl font-medium transform hover:scale-105 duration-300"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcaseSection;
