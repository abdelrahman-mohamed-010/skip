"use client";

import { Shield, Lock, Clock } from "lucide-react";

const CaseIntroSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-white to-slate-50 pt-24">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-light">
            Get Your{" "}
            <span className="text-primary font-normal">Legal Analysis</span> in
            Minutes
          </h2>

          <p className="text-xl text-gray-600 leading-relaxed mx-auto max-w-2xl">
            Our AI-powered system will analyze your case instantly and provide
            personalized guidance.
          </p>

          <div className="flex flex-wrap justify-center gap-8 py-8">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-primary" />
              <span className="text-gray-700">100% Secure</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-gray-700">Private Processing</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-gray-700">Instant Results</span>
            </div>
          </div>

          <button
            onClick={() => (window.location.href = "#apply-form")}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all transform hover:scale-105"
          >
            Start Your Case Analysis Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default CaseIntroSection;
