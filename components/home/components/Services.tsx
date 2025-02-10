import {
  FileSearch,
  GraduationCap,
  Building2,
  ArrowRight,
  Book,
} from "lucide-react";
import Link from "next/link";

const Services = () => {
  const services = [
    {
      title: "Immigration Visas",
      description:
        "Comprehensive assistance with all types of visa applications including work, family, and business visas.",
      icon: Book,
      progress: "95%",
      gradient: "from-blue-500 via-primary to-purple-500",
      link: "/visas",
    },
    {
      title: "Student Services",
      description:
        "Specialized support for international students seeking to study in the United States.",
      icon: GraduationCap,
      progress: "90%",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      link: "/student-services",
    },
    {
      title: "Business Immigration",
      description:
        "Expert guidance for companies and entrepreneurs looking to establish or expand in the US.",
      icon: Building2,
      progress: "88%",
      gradient: "from-primary via-cyan-500 to-blue-500",
      link: "/business-immigration",
    },
    {
      title: "Legal Consultation",
      description:
        "Professional legal advice and strategy planning for your immigration journey.",
      icon: FileSearch,
      progress: "92%",
      gradient: "from-rose-500 via-primary to-purple-500",
      link: "/consultation",
    },
  ];

  return (
    <section className="py-12 sm:py-24 relative overflow-hidden bg-gradient-to-br from-white via-primary/5 to-primary/10">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-gradient-to-br from-white via-primary/5 to-primary/10 rounded-full filter blur-3xl" />
        <div className="absolute left-0 top-0 w-1/3 h-1/2 bg-gradient-to-b from-purple-500/5 to-transparent rounded-full filter blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-16">
          <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-primary/5 text-primary rounded-full text-sm font-medium">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mt-3 sm:mt-4">
            Comprehensive Immigration Solutions
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-secondary/80 max-w-2xl mx-auto px-2 sm:px-0">
            Expert guidance through every step of your immigration journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {services.map((service) => (
            <Link
              href={service.link}
              key={service.title}
              className="group relative p-1 rounded-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Gradient Border */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${service.gradient} rounded-2xl opacity-20 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative bg-white/80 backdrop-blur-sm p-4 sm:p-8 rounded-2xl">
                <div className="flex items-start gap-3 sm:gap-6">
                  <div
                    className={`bg-gradient-to-br ${service.gradient} p-2 sm:p-3 rounded-xl shrink-0`}
                  >
                    <service.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-primary mb-1 sm:mb-2 flex items-center justify-between">
                      {service.title}
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary/50 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                    </h3>
                    <p className="text-sm sm:text-base text-secondary/80 leading-relaxed mb-3 sm:mb-4">
                      {service.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex-1 h-1 sm:h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${service.gradient} transition-all duration-500`}
                          style={{ width: service.progress }}
                        />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-primary">
                        {service.progress}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
