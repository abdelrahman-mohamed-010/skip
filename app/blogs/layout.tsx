import ContactLawyerForm from "@/components/ContactLawyerForm";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import PageCTA from "@/components/PageCTA";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      {children}
      <ContactLawyerForm />
      <Footer />
      <PageCTA />
    </div>
  );
}
