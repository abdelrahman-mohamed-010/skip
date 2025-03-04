import LawyerBot from "./LawyerBot";
import { Phone } from "lucide-react";

interface HeroProps {
  heroData: {
    journeyTitle: string;
    startsText: string;
    ctaNumber: string;
  };
}

const Hero = ({ heroData }: HeroProps) => {
  return (
    <section className="relative md:min-h-screen py-24 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-white via-primary/5 to-primary/10">
      <div className="max-w-7xl mx-auto text-center relative">
        <span className="inline-flex lg:mt-6 items-center max-sm:mt-3 px-4 py-1.5 bg-white/80 backdrop-blur-sm text-primary rounded-full text-sm max-sm:text-sm font-medium mb-8 max-sm:mb-6 animate-float border border-primary/10 shadow-sm">
          <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
          Welcome to SkipLegal
        </span>

        <div className="space-y-4 sm:space-y-6 relative">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight animate-fadeIn max-sm:leading-tight">
            <span className="block text-primary/90 leading-tight max-sm:text-3xl">
              {heroData.journeyTitle}
            </span>

            <span className="relative inline-block mt-2 sm:mt-4 text-3xl sm:text-5xl lg:text-6xl max-sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary">
              {heroData.startsText}
              <div className="absolute -bottom-2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </span>
          </h1>

          <div className="mt-8 sm:mt-12 max-w-4xl mx-auto animate-fadeIn">
            <LawyerBot />
          </div>
        </div>
        <div className="group relative inline-block">
          <a
            href="tel:9444754753"
            className="inline-flex items-center px-12 max-sm:px-8 py-3 mt-12 text-lg max-sm:text-base font-medium text-white bg-primary border-2 border-primary hover:bg-white hover:text-primary rounded-full transition-colors shadow-lg hover:shadow-xl"
          >
            <Phone className="w-5 h-5 mr-2 max-sm:w-4 max-sm:h-4" />
            Call Us Now
          </a>
          <div className="absolute left-0 right-0 top-full mt-2 hidden group-hover:block w-max">
            <div className="bg-white shadow-lg rounded-md p-3 whitespace-nowrap border border-gray-200">
              <p className="text-primary text-sm">
                Call Us @ 944-4-SKIPLEGAL (944-475-4753)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
