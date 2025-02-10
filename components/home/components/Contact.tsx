
import { Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <section className="py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold text-primary mb-6">Get in Touch</h2>
            <p className="text-secondary mb-8">
              Have questions about immigration? Our experts are here to help you navigate through the process.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Phone className="w-6 h-6 text-accent" />
                <span className="text-secondary">1-800-SKIPLEGAL</span>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="w-6 h-6 text-accent" />
                <span className="text-secondary">Find a Lawyer Near You</span>
              </div>
            </div>
          </div>
          <div className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            <form className="bg-white p-8 rounded-lg shadow-sm">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
