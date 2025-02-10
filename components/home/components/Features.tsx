import { Scale, Clock, Award, HeartHandshake } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "Legal Excellence",
      description:
        "Premium immigration services backed by years of expertise and proven success.",
      icon: Scale,
      gradient: "from-primary/80 to-purple-500",
    },
    {
      title: "Swift Processing",
      description:
        "Streamlined procedures and efficient case management for faster results.",
      icon: Clock,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Dedicated Support",
      description:
        "Personal attention and round-the-clock assistance throughout your journey.",
      icon: HeartHandshake,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Proven Success",
      description:
        "Outstanding track record with numerous successful immigration cases.",
      icon: Award,
      gradient: "from-primary to-blue-500",
    },
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
            Why Choose SkipLegal
          </h2>
          <p className="mt-4 text-lg max-sm:text-sm max-sm:mt-2 text-secondary/80 max-w-2xl mx-auto">
            Experience the difference with our comprehensive immigration
            services
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-primary/10 hover:border-primary/20 transition-all duration-300"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white rounded-2xl transition-opacity duration-300 group-hover:opacity-0" />

              <div className={`relative flex flex-col max-sm:items-center max-sm:text-center h-full`}>
                <div
                  className={`bg-gradient-to-br ${feature.gradient} p-3 rounded-xl w-fit mb-6`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-primary mb-3">
                  {feature.title}
                </h3>

                <p className="text-secondary/80 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
