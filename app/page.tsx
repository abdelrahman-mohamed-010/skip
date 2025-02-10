import Hero from "@/components/home/components/Hero";
import Features from "@/components/home/components/Features";
import Services from "@/components/home/components/Services";
import Process from "@/components/home/components/Process";
import News from "@/components/home/components/News";
import ChatBot from "@/components/ChatBot";
import Navigation from "@/components/Navigation";
import ContactLawyerForm from "@/components/ContactLawyerForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <Features />
      <Services />
      <Process />
      <News />
      <ChatBot />
      <ContactLawyerForm />
      <Footer />
    </div>
  );
}
