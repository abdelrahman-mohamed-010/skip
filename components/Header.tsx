/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Users2, Briefcase, Globe } from "lucide-react";
import Link from "next/link";

const iconMap: { [key: string]: any } = {
  Users2,
  Briefcase,
  Globe,
};

interface CardProps {
  title: string;
  description: string;
  icon: string;
  isHighlighted?: boolean;
  link?: string;
}

interface HeaderProps {
  title: string;
  subtitle: string;
  description: string;
  cards: CardProps[];
}

export default function Header({
  title,
  subtitle,
  description,
  cards,
}: HeaderProps) {
  const isTwoCards = cards.length === 2;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pt-24 ">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-5xl font-bold tracking-tight text-primary">
          {title}
        </h1>
        <p className="text-xl text-muted-foreground">{subtitle}</p>
      </div>

      <div className="max-w-3xl mx-auto mb-24">
        <p className="text-lg text-muted-foreground text-center">
          {description}
        </p>
      </div>

      <div
        className={`grid ${
          isTwoCards ? "md:grid-cols-2 max-w-4xl mx-auto" : "md:grid-cols-3"
        } gap-8`}
      >
        {cards.map((card, index) => {
          const Icon = iconMap[card.icon] || Users2;
          // Modified logic to highlight middle card for both 2 and 3 card layouts
          const isMiddleCard =
            (isTwoCards && index === 1) || (!isTwoCards && index === 1);

          const CardContent = (
            <>
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  isMiddleCard ? "bg-white/10" : "bg-gray-100"
                }`}
              >
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">{card.title}</h3>
              <p
                className={
                  isMiddleCard ? "text-gray-200" : "text-muted-foreground"
                }
              >
                {card.description}
              </p>
            </>
          );

          const cardClasses = `rounded-lg p-8 shadow-lg text-center transition-all duration-300 hover:shadow-xl ${
            isMiddleCard
              ? "bg-[#1e1b4b] text-white hover:brightness-110"
              : "bg-white hover:bg-gray-50"
          }`;

          return card.link ? (
            <Link href={card.link} key={index} className={cardClasses}>
              {CardContent}
            </Link>
          ) : (
            <div key={index} className={cardClasses}>
              {CardContent}
            </div>
          );
        })}
      </div>
    </div>
  );
}
