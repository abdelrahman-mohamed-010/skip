import React from "react";

interface FeaturesData {
  sectionTitle: string;
  description: string;
  featuresList: {
    title: string;
    description: string;
  }[];
}

const Features = ({ data }: { data: FeaturesData }) => {
  return (
    <section className="py-24 relative overflow-hidden bg-primary">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute right-0 top-1/2 w-1/3 h-1/2 bg-white/10 rounded-full filter blur-3xl" />
        <div className="absolute left-0 bottom-0 w-1/4 h-1/2 bg-white/10 rounded-full filter blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative">
          <h2 className="text-4xl max-sm:text-2xl font-bold text-white mt-8">
            {data.sectionTitle}
          </h2>
          <p className="mt-4 text-lg max-sm:text-sm max-sm:mt-2 text-white/80 max-w-2xl mx-auto">
            {data.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.featuresList.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent -translate-y-1/2 translate-x-1/2 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

              <div className="relative p-8">
                <span className="absolute top-4 right-4 text-4xl font-bold text-white/10 select-none">
                  {(index + 1).toString().padStart(2, "0")}
                </span>

                <div className="relative space-y-4">
                  <div className="h-1 w-12 bg-gradient-to-r from-white/80 to-white/20 rounded-full" />
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
