import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ServicesData {
  sectionTitle: string;
  description: string;
}

const Services = ({ data }: { data: ServicesData }) => {
  return (
    <section className="py-24 max-sm:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <div className="order-2 lg:order-1">
            <div className="w-20 h-1 bg-primary rounded-full mb-8" />
            <h1 className="text-6xl font-light max-sm:text-4xl text-gray-900 mb-8 leading-tight">
              {data.sectionTitle}
            </h1>
            <p className="text-xl max-sm:text-base text-gray-600 font-light leading-relaxed mb-12">
              {data.description}
            </p>
            <div className="flex gap-6">
              <div className="group relative inline-block">
                <a
                  href="tel:9444754753"
                  className="px-8 py-4 bg-primary hover:bg-white hover:text-primary border-primary border-2 max-sm:px-5 max-sm:py-3 max-sm:text-sm text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center"
                >
                  Call Us Now
                </a>
                <div className="absolute left-0 right-0 top-full mt-2 hidden group-hover:block w-max">
                  <div className="bg-white shadow-lg rounded-md p-3 whitespace-nowrap border border-gray-200">
                    <p className="text-primary text-sm">
                      Call Us @ 844-4-SKIPLEGAL (844-475-4753)
                    </p>
                  </div>
                </div>
              </div>
              <Link
                href="/immigration"
                className="px-8 py-4 border border-gray-200 max-sm:px-5 max-sm:py-3 max-sm:text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative h-[300px] md:h-[600px] rounded-2xl overflow-hidden">
              <Image
                src="/lawyer.jpg"
                alt="Legal Excellence"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
