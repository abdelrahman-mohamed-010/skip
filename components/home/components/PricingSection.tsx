"use client";

import { Check } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Basic",
      description: "Perfect for individuals with simple immigration needs",
      price: 19.99,
      features: [
        "AI Document Analysis",
        "Basic Legal Guidance",
        "Up to 10 Document Uploads",
        "Email Support",
        "Standard Response Time",
      ],
      isPopular: false,
      btnClass:
        "bg-white text-primary border border-primary hover:bg-primary hover:text-white",
    },
    {
      name: "Professional",
      description: "Ideal for those with complex immigration cases",
      price: 39.99,
      features: [
        "Everything in Basic",
        "Advanced Document Analysis",
        "Priority AI Assistance",
        "Up to 50 Document Uploads",
        "Chat Support",
        "Fast Response Time",
        "Document Comparison",
      ],
      isPopular: true,
      btnClass: "bg-primary text-white hover:bg-primary/90",
    },
    {
      name: "Enterprise",
      description: "For immigration attorneys and legal firms",
      price: 99.99,
      features: [
        "Everything in Professional",
        "Unlimited Document Uploads",
        "API Access",
        "White-labeling Options",
        "Advanced Analytics",
        "Priority Support",
        "Custom Integrations",
        "Team Management",
      ],
      isPopular: false,
      btnClass:
        "bg-white text-primary border border-primary hover:bg-primary hover:text-white",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
            <span>PRICING PLANS</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose the Right Plan for{" "}
            <span className="text-primary">Your Needs</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Affordable options to access our AI-powered legal document
            processing platform. All plans include our core security features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${
                plan.isPopular
                  ? "border-2 border-primary"
                  : "border border-gray-100"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 inset-x-0 bg-primary text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className={`p-8 ${plan.isPopular ? "pt-12" : ""}`}>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 ml-1">/month</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-full text-center text-base font-semibold transition-colors ${plan.btnClass}`}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto text-center">
          <div className="bg-primary/5 rounded-xl p-8 border border-primary/20">
            <h3 className="text-xl font-bold text-primary mb-4">
              Need a custom solution?
            </h3>
            <p className="text-gray-700 mb-6">
              Contact us for custom enterprise solutions designed for your
              specific needs. We offer tailored packages for law firms and
              organizations.
            </p>
            <button className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
