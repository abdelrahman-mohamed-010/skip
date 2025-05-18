"use client";

import { Star } from "lucide-react";
import Marquee from "react-fast-marquee";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Michael Johnson",
      role: "H1B Visa Applicant",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "The document analysis feature saved me countless hours. The AI identified issues with my application before submission that would have caused delays.",
      rating: 5,
    },
    {
      name: "Sarah Chen",
      role: "Family-Based Immigration",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "The chat bot helped me understand complex immigration forms and guided me through the entire process. I always got clear answers to my questions.",
      rating: 5,
    },
    {
      name: "David Rodriguez",
      role: "Green Card Applicant",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      text: "Having my documents securely stored and accessible while getting AI-powered insights made my application process so much smoother.",
      rating: 4,
    },
    {
      name: "Aisha Patel",
      role: "DACA Recipient",
      image: "https://randomuser.me/api/portraits/women/63.jpg",
      text: "The document analysis tool caught mistakes in my renewal application that I completely missed. The AI suggestions were incredibly helpful.",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
            <span>SUCCESS STORIES</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            What Our Users Are Saying
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Real people with real immigration success stories powered by our AI
            legal assistant.
          </p>
        </div>

        {/* Desktop/Tablet View - Continuous marquee */}
        <div className="hidden sm:block mx-auto">
          <Marquee gradient={false} speed={50}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="mx-4 flex-shrink-0"
                style={{ width: "450px" }}
              >
                <div className="bg-white rounded-2xl p-6 border border-gray-100 h-[280px] flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-primary/20">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-primary font-medium">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-5 h-5 ${
                          j < testimonial.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="relative flex-1">
                    <div className="text-6xl text-primary/10 font-serif absolute -top-6 -left-2">
                      &ldquo;
                    </div>
                    <p className="text-lg text-gray-700 relative z-10 italic line-clamp-3">
                      {testimonial.text}
                    </p>
                    <div className="text-6xl text-primary/10 font-serif absolute bottom-0 right-0">
                      &rdquo;
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden mx-auto">
          <Marquee gradient={false} speed={40}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="mx-2 flex-shrink-0"
                style={{ width: "300px" }}
              >
                <div className="bg-white rounded-2xl p-5 border border-gray-100 h-[240px] flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden mr-3 border-2 border-primary/20">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {testimonial.name}
                      </h3>
                      <p className="text-xs text-primary font-medium">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-4 h-4 ${
                          j < testimonial.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="relative flex-1">
                    <div className="text-4xl text-primary/10 font-serif absolute -top-4 -left-1">
                      &ldquo;
                    </div>
                    <p className="text-base text-gray-700 relative z-10 italic px-2 line-clamp-3">
                      {testimonial.text}
                    </p>
                    <div className="text-4xl text-primary/10 font-serif absolute bottom-0 right-0">
                      &rdquo;
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
