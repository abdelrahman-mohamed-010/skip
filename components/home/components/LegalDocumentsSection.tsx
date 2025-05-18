import React from "react";
import { FileText, Search, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

const LegalDocumentsSection = () => {
  const steps = [
    {
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: "Upload Documents",
      description:
        "Simply upload your legal documents through our secure platform",
    },
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: "AI Analysis",
      description:
        "Our AI system analyzes and processes your documents instantly",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
      title: "Get Insights",
      description: "Receive clear, actionable insights and explanations",
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Quick Results",
      description: "Get your simplified document breakdown in minutes",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute left-0 top-1/2 w-80 h-80 bg-primary/5 rounded-full -translate-x-1/3 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/5 rounded-full translate-x-1/4 translate-y-1/4" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
            <span>HOW IT WORKS</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Legal Documents Made Simple
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Our AI-powered platform simplifies complex legal documents,
            providing actionable insights in four easy steps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative"
            >
              <div className="mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
              <div className="absolute top-6 right-6 text-4xl font-bold text-gray-100 group-hover:text-primary/10 transition-colors">
                {index + 1}
              </div>
            </div>
          ))}
        </div>{" "}
        {/* Apply Now button */}
        <div className="flex justify-center mt-16">
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 px-8 py-3 text-white bg-primary border-2 border-primary hover:bg-white hover:text-primary rounded-full transition-all shadow-lg hover:shadow-xl font-medium transform hover:scale-105 duration-300"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LegalDocumentsSection;
