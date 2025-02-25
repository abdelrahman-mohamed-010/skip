import React from "react";
import { Star, StarIcon } from "lucide-react";

interface ProcessData {
  sectionTitle: string;
  description: string;
  steps: {
    title: string;
    description: string;
  }[];
}

const Process = ({ data }: { data: ProcessData }) => {
  return (
    <section className="py-32 relative bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_800px_at_50%_-100px,#3b82f6,transparent)]" />
        <div className="stars absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <Star
              key={i}
              className="absolute text-white/10 animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center relative mb-24 max-sm:mb-12">
          <StarIcon className="w-12 h-12 mx-auto mb-6 text-blue-400 animate-pulse" />
          <div className="inline-block">
            <h2 className="text-5xl font-bold text-white mb-6 relative max-sm:text-2xl">
              {data.sectionTitle}
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            </h2>
          </div>
          <p className="text-xl text-blue-200/70 max-w-2xl mx-auto max-sm:text-base">
            {data.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.steps.map((step, index) => (
            <div
              key={index}
              className="group bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 rounded-lg transition-all duration-300"
            >
              <div className="p-8 max-sm:p-4">
                <div className="flex items-center gap-4 mb-6 max-sm:mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                  <span className="text-blue-400/80 text-sm font-medium max-sm:text-xs">
                    Step {index + 1}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-blue-500/50 via-blue-500/50 to-transparent" />
                </div>

                <h3 className="text-white text-xl font-semibold tracking-tight mb-4 max-sm:text-lg max-sm:mb-2">
                  {step.title}
                </h3>

                <p className="text-gray-400 leading-relaxed max-sm:text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
