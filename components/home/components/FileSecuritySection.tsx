"use client";

import { Shield, Lock, Zap } from "lucide-react";
import Image from "next/image";

const FileSecuritySection = () => {
  return (
    <section className="py-24 max-sm:py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center relative">
          {/* Content Side */}
          <div>
            <div className="w-20 h-1 bg-primary rounded-full mb-8" />
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Secure Your Legal Journey with{" "}
              <span className="text-primary font-normal">AI-Powered</span>{" "}
              Protection
            </h2>
            <p className="text-xl text-gray-600 font-light leading-relaxed mb-12">
              Our platform employs enterprise-grade security to safeguard your
              legal documents while providing intelligent, AI-driven insights.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                <div className="bg-primary/10 p-3 w-fit rounded-xl mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  End-to-End Encryption
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Bank-level security to protect your sensitive documents
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                <div className="bg-primary/10 p-3 w-fit rounded-xl mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Private Processing
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Automated AI analysis without human intervention
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                <div className="bg-primary/10 p-3 w-fit rounded-xl mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Fast Response
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Get instant insights and recommendations
                </p>
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative lg:-mr-16">
            <div className="aspect-square relative rounded-3xl overflow-hidden">
              <Image
                src="/smilerobot.png"
                alt="AI Legal Assistant"
                fill
                className="object-contain"
                priority
              />
              {/* Decorative gradient blob */}
              <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FileSecuritySection;
