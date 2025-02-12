/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Users2, Briefcase, Globe } from "lucide-react";

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
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pt-24 ">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-5xl font-bold tracking-tight text-primary">{title}</h1>
        <p className="text-xl text-muted-foreground">{subtitle}</p>
      </div>

      <div className="max-w-3xl mx-auto mb-24">
        <p className="text-lg text-muted-foreground text-center">
          {description}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {cards.map((card, index) => {
          const Icon = iconMap[card.icon] || Users2;
          return (
            <div
              key={index}
              className={`rounded-lg p-8 shadow-lg text-center ${
                card.isHighlighted ? "bg-[#1e1b4b] text-white" : "bg-white"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  card.isHighlighted ? "bg-white/10" : "bg-gray-100"
                }`}
              >
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">{card.title}</h3>
              <p
                className={
                  card.isHighlighted ? "text-gray-200" : "text-muted-foreground"
                }
              >
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
