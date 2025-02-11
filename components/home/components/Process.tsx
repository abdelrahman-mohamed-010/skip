import React from "react";
import { CheckSquare, ClipboardCheck, FileCheck } from "lucide-react";

interface ProcessData {
  sectionTitle: string;
  description: string;
  steps: {
    title: string;
    description: string;
  }[];
}

const Process = ({ data }: { data: ProcessData }) => {
  const icons = [CheckSquare, ClipboardCheck, FileCheck];

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-primary/5 via-white to-white">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="px-4 py-1.5 bg-primary/5 text-primary rounded-full text-sm font-medium">
            How It Works
          </span>
          <h2 className="text-4xl font-bold max-sm:text-3xl text-primary mt-4">
            {data.sectionTitle}
          </h2>
          <p className="mt-4 max-sm:mt-2 text-lg text-secondary/80 max-w-2xl max-sm:text-sm mx-auto">
            {data.description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {data.steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-primary/10 hover:border-primary/20 transition-all duration-300"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <span className="absolute -top-4 right-4 text-5xl font-bold text-primary/5">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="relative">
                {React.createElement(icons[index % icons.length], {
                  className: "w-10 h-10 text-primary mb-6",
                })}
                <h3 className="text-xl font-semibold text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-secondary/80 leading-relaxed">
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
