import LawyerBot from "./LawyerBot";

const Hero = () => {
  return (
    <section className="relative md:min-h-screen py-24 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-white via-primary/5 to-primary/10">
      {/* Geometric shapes */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />

        {/* Decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      <div className="max-w-7xl mx-auto text-center relative">
        {/* Accent decoration */}
        {/* <div className="absolute max-sm:hidden top-0 left-1/2 -translate-x-1/2 w-40 h-1.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent" /> */}

        <span className="inline-flex lg:mt-6 items-center max-sm:mt-12 px-4 py-1.5 bg-white/80 backdrop-blur-sm text-primary rounded-full text-sm max-sm:text-xs font-medium mb-8 max-sm:mb-6 animate-float border border-primary/10 shadow-sm">
          <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
          Welcome to SkipLegal
        </span>

        <div className="space-y-4 sm:space-y-6 relative">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight animate-fadeIn max-sm:leading-tight">
            <span className="block text-primary/90 leading-tight max-sm:text-2xl">
              Your Journey to U.S. Immigration
            </span>

            <span className="relative inline-block mt-2 sm:mt-4 text-3xl sm:text-5xl lg:text-6xl max-sm:text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary">
              Starts Here
              <div className="absolute -bottom-2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </span>
          </h1>

          <div className="mt-8 sm:mt-12 max-w-4xl mx-auto animate-fadeIn">
            <LawyerBot />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

