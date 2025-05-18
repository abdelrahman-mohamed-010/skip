"use client";

import { Upload, FileSearch, MessagesSquare, FileCheck } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Upload className="w-6 h-6 text-primary" />,
      title: "Upload Documents",
      description: "Securely upload your legal documents",
    },
    {
      icon: <FileSearch className="w-6 h-6 text-primary" />,
      title: "AI Analysis",
      description: "Get instant document analysis",
    },
    {
      icon: <MessagesSquare className="w-6 h-6 text-primary" />,
      title: "Smart Insights",
      description: "Receive clear explanations and guidance",
    },
    {
      icon: <FileCheck className="w-6 h-6 text-primary" />,
      title: "Take Action",
      description: "Follow recommendations or consult experts",
    },
  ];

  return (
    <section className="py-24 max-sm:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight max-w-3xl mx-auto">
            Legal Documents Made{" "}
            <span className="text-primary font-normal">Simple</span>
          </h2>
          <p className="mt-6 text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Our AI-powered platform simplifies complex legal documents,
            providing actionable insights in four easy steps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group bg-white p-8 rounded-2xl hover:shadow-lg transition-all duration-300 relative"
            >
              {/* Step number */}
              <span className="text-8xl font-bold text-slate-50 absolute -top-4 right-4 select-none group-hover:text-slate-100 transition-colors">
                {(index + 1).toString().padStart(2, "0")}
              </span>

              {/* Content */}
              <div className="relative">
                <div className="bg-slate-50 p-3 rounded-xl w-fit mb-6 group-hover:bg-primary/5 transition-colors">
                  {step.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
