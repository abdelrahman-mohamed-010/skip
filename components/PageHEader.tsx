import { Clock4, HandHeart, ShieldCheck } from 'lucide-react';
import React from 'react'

const PageHEader = () => {
  return (
    <section className="pt-24 max-w-[1160px] mx-auto">
      <div className="hidden md:grid md:grid-cols-4 gap-8 px-4">
        <div className="flex flex-col items-center text-center p-6 rounded-xl">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Clock4 className="w-10 h-10 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
          <p className="text-gray-600 text-sm">Your data is safe with us</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-xl">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Always Available</h3>
          <p className="text-gray-600 text-sm">24/7 Support & Service</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-xl">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <HandHeart className="w-10 h-10 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Smart Solutions</h3>
          <p className="text-gray-600 text-sm">AI-Powered Expertise</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-xl">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Free Consultation</h3>
          <p className="text-gray-600 text-sm">No Hidden Charges</p>
        </div>
      </div>

      {/* Mobile version */}
      <div className="md:hidden px-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center text-center p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <Clock4 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Secure & Private</h3>
            <p className="text-gray-600 text-xs">Your data is safe with us</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Always Available</h3>
            <p className="text-gray-600 text-xs">24/7 Support & Service</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <HandHeart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Smart Solutions</h3>
            <p className="text-gray-600 text-xs">AI-Powered Expertise</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Free Consultation</h3>
            <p className="text-gray-600 text-xs">No Hidden Charges</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PageHEader
