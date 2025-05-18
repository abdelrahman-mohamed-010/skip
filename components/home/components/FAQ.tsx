"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "How secure is the document upload process?",
      answer:
        "We use bank-level AES-256 bit encryption for all document uploads and storage. Our platform is SOC 2 compliant and follows strict security protocols to ensure your documents remain confidential and protected at all times.",
    },
    {
      question: "Can your AI understand complex legal terms?",
      answer:
        "Yes, our AI has been specifically trained on extensive legal datasets and can understand complex legal terminology, particularly in immigration contexts. It can analyze legal documents, identify key information, and provide relevant guidance based on current laws and regulations.",
    },
    {
      question: "How accurate is the document analysis?",
      answer:
        "Our document analysis has a high accuracy rate, typically above 95% for standard immigration documents. The system is constantly learning and improving. For complex cases, we recommend having an attorney review the AI's analysis for complete assurance.",
    },
    {
      question: "Can I speak with a real attorney if needed?",
      answer:
        "Absolutely. While our AI handles many questions efficiently, we offer options to connect with licensed immigration attorneys for complex matters. You can request attorney assistance directly through our platform.",
    },
    {
      question: "What types of documents can the system process?",
      answer:
        "Our system can process a wide range of immigration-related documents including USCIS forms (such as I-130, I-485, I-765), supporting documentation, RFEs, approval notices, and more. The system is continuously trained to recognize new document types.",
    },
    {
      question: "How long does document processing take?",
      answer:
        "Document analysis typically takes between 30 seconds to 2 minutes, depending on document complexity and length. This is significantly faster than manual review which can take hours or days.",
    },
    {
      question: "Is there a limit to how many documents I can upload?",
      answer:
        "Document limits depend on your subscription plan. Basic plans include up to 10 documents per month, Professional plans include up to 50, and Enterprise plans offer unlimited document uploads.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, all our subscription plans can be canceled at any time. You'll continue to have access until the end of your billing period. We also offer a 14-day money-back guarantee for new subscribers.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
            <span>COMMON QUESTIONS</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Get answers to common questions about our AI-powered legal document
            processing platform.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-100 last:border-b-0"
              >
                <button
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <span className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-5 text-gray-700">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-700 mb-4">
              Still have questions? We're here to help.
            </p>
            <button className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
