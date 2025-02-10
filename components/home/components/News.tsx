import { ArrowRight } from "lucide-react";
import Link from "next/link";

const News = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-white via-primary/5 to-primary/10 mb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">
            Latest Immigration News
          </h2>
          <Link
            href="/latest-immigration-news"
            className="text-accent hover:text-accent/80 transition-colors duration-200 inline-flex items-center self-start sm:self-auto"
          >
            View All
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((_, index) => (
            <article
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 animate-fadeIn"
              style={{ animationDelay: `${0.2 * index}s` }}
            >
              <div className="aspect-video bg-muted" />
              <div className="p-6">
                <span className="text-sm text-accent">Immigration Updates</span>
                <h3 className="text-xl font-semibold text-primary mt-2 mb-3">
                  Latest Changes in Immigration Policy
                </h3>
                <p className="text-secondary mb-4 line-clamp-2">
                  Stay informed about the most recent updates and changes in
                  U.S. immigration policies and procedures.
                </p>
                <Link
                  href="/latest-immigration-news"
                  className="inline-flex items-center text-primary hover:text-accent transition-colors duration-200"
                >
                  Read More
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
