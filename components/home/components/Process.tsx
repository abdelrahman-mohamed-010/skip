import { CheckSquare, ClipboardCheck, FileCheck } from "lucide-react";

const Process = () => {
  const steps = [
    {
      step: "01",
      title: "Initial Consultation",
      description: "Free evaluation of your case with our immigration experts.",
      icon: CheckSquare,
    },
    {
      step: "02",
      title: "Document Preparation",
      description:
        "Professional assistance in gathering and preparing all required documentation.",
      icon: ClipboardCheck,
    },
    {
      step: "03",
      title: "Application Filing",
      description:
        "Careful submission of your application with continued progress tracking.",
      icon: FileCheck,
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-primary/5 via-white to-white">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 ">
          <span className="px-4 py-1.5 bg-primary/5 text-primary rounded-full text-sm font-medium">
            How It Works
          </span>
          <h2 className="text-4xl font-bold max-sm:text-3xl text-primary mt-4">
            Simple 3-Step Process
          </h2>
          <p className="mt-4 max-sm:mt-2 text-lg text-secondary/80 max-w-2xl max-sm:text-sm mx-auto">
            We ve streamlined the immigration process to make it easy for you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className="relative bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-primary/10 hover:border-primary/20 transition-all duration-300"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <span className="absolute -top-4 right-4 text-5xl font-bold text-primary/5">
                {step.step}
              </span>
              <div className="relative">
                <step.icon className="w-10 h-10 text-primary mb-6" />
                <h3 className="text-xl font-semibold text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-secondary/80 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
