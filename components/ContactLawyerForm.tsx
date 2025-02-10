"use client";

import { useState } from "react";
import { Send } from "lucide-react";

const ContactLawyerForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="py-16 max-sm:py-8 pt-0 bg-gradient-to-b from-white to-primary/5">
      <div className="max-w-7xl mx-auto px-4 max-sm:px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-sm:mb-6">
          <h2 className="text-3xl max-sm:text-2xl font-bold text-primary mb-4 max-sm:mb-2">
            Get Legal Assistance
          </h2>
          <p className="text-secondary/80 max-w-2xl mx-auto max-sm:text-sm">
            Connect with our experienced immigration lawyers for personalized
            guidance on your journey
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white rounded-2xl max-sm:rounded-xl shadow-md p-8 max-sm:p-4"
          suppressHydrationWarning
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-sm:gap-4 mb-8 max-sm:mb-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm max-sm:text-xs font-medium text-secondary mb-2 max-sm:mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 max-sm:px-3 py-3 max-sm:py-2 rounded-xl max-sm:rounded-lg border border-primary/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-primary/5 max-sm:text-sm"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                suppressHydrationWarning
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm max-sm:text-xs font-medium text-secondary mb-2 max-sm:mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 max-sm:px-3 py-3 max-sm:py-2 rounded-xl max-sm:rounded-lg border border-primary/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-primary/5 max-sm:text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                suppressHydrationWarning
              />
            </div>
          </div>

          <div className="mb-8 max-sm:mb-4">
            <label
              htmlFor="phone"
              className="block text-sm max-sm:text-xs font-medium text-secondary mb-2 max-sm:mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="w-full px-4 max-sm:px-3 py-3 max-sm:py-2 rounded-xl max-sm:rounded-lg border border-primary/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-primary/5 max-sm:text-sm"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              suppressHydrationWarning
            />
          </div>

          <div className="mb-8 max-sm:mb-4">
            <label
              htmlFor="message"
              className="block text-sm max-sm:text-xs font-medium text-secondary mb-2 max-sm:mb-1"
            >
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              className="w-full px-4 max-sm:px-3 py-3 max-sm:py-2 rounded-xl max-sm:rounded-lg border border-primary/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none bg-primary/5 max-sm:text-sm"
              placeholder="How can we help you?"
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-primary text-white px-6 max-sm:px-4 py-4 max-sm:py-2.5 rounded-xl max-sm:rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium max-sm:text-sm"
            suppressHydrationWarning
          >
            <span>Send Message</span>
            <Send size={18} className="max-sm:w-4 max-sm:h-4" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactLawyerForm;
