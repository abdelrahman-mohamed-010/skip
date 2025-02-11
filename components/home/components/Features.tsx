import React from "react";
import { Scale, Clock, Award, HeartHandshake } from "lucide-react";

interface FeaturesData {
  sectionTitle: string;
  description: string;
  featuresList: {
    title: string;
    description: string;
  }[];
}

const Features = ({ data }: { data: FeaturesData }) => {
  const icons = [Scale, Clock, HeartHandshake, Award];
  const gradients = [
    "from-primary/80 to-purple-500",
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-primary to-blue-500",
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute right-0 top-1/2 w-1/3 h-1/2 bg-primary/5 rounded-full filter blur-3xl" />
        <div className="absolute left-0 bottom-0 w-1/4 h-1/2 bg-purple-500/5 rounded-full filter blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative">
          <h2 className="text-4xl max-sm:text-2xl font-bold text-primary mt-8">
            {data.sectionTitle}
          </h2>
          <p className="mt-4 text-lg max-sm:text-sm max-sm:mt-2 text-secondary/80 max-w-2xl mx-auto">
            {data.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.featuresList.map((feature, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                key={feature.title}
                className="group relative bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-primary/10 hover:border-primary/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white rounded-2xl transition-opacity duration-300 group-hover:opacity-0" />

                <div
                  className={`relative flex flex-col max-sm:items-center max-sm:text-center h-full`}
                >
                  <div
                    className={`bg-gradient-to-br ${gradients[index % gradients.length]} p-3 rounded-xl w-fit mb-6`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-secondary/80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
