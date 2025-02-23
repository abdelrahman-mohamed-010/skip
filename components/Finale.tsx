"use client";

interface FinaleProps {
  title: string;
  subtitle: string;
  description: string;
  backgroundImageUrl?: string;
  cta?: {
    text: string;
    link: string;
  };
}

export default function Finale({
  title,
  subtitle,
  description,
  backgroundImageUrl,
  cta,
}: FinaleProps) {
  return (
    <div className="relative py-12 my-7 mt-12">
      {backgroundImageUrl && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.1,
          }}
        />
      )}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center ">
        <h2 className="text-4xl font-bold text-primary mb-4">{title}</h2>
        <p className="text-xl text-muted-foreground mb-6">{subtitle}</p>
        <p className="text-lg text-muted-foreground mb-12">{description}</p>
        {cta && (
          <a
            href={cta.link}
            className="inline-block px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            {cta.text}
          </a>
        )}
      </div>
    </div>
  );
}
