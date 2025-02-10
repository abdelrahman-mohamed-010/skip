/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from 'react';

interface Image {
  url: string;
  alt: string;
}

interface ImageSliderProps {
  images: Image[];
  displayType?: 'slider' | 'grid';
}

const ImageSlider = ({ images, displayType = 'slider' }: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  if (!images || images.length === 0) return null;

  if (displayType === 'grid') {
    const gridColumns = images.length === 1 ? 'grid-cols-1' : 
                       images.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                       'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    
    return (
      <div className={`grid ${gridColumns} gap-6`}>
        {images.map((image, index) => (
          <div 
            key={index} 
            className={`relative rounded-lg overflow-hidden ${
              images.length === 1 ? 'aspect-video w-3/4 mx-auto' : images.length === 2 ? " aspect-video" :  'aspect-square'
            }`}
          >
            <img
              src={image.url}
              alt={image.alt || ''}
              className="w-full h-full object-cover object-top rounded-lg"
            />
          </div>
        ))}
      </div>
    );
  }

  // Slider view (default)
  return (
    <div className="relative w-full max-w-4xl mx-auto px-4"> {/* Removed md:px-14 */}
      <div className="relative h-[250px] md:h-[380px]  mx-auto  rounded-lg">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.url}
              alt={image.alt || ''}
              className="w-full h-full object-cover object-top rounded-lg"
            />
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-2 md:-left-20 top-1/2 -translate-y-1/2 p-2 rounded-full text-primary hover:scale-110 transition-transform  z-10"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="34" 
            height="34" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="rotate-180"
          >
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-2 md:-right-20 top-1/2 -translate-y-1/2 p-2 rounded-full text-primary hover:scale-110 transition-transform  z-10"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="34" 
            height="34" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>

      <div className="flex justify-center  mt-4 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 mt-5 h-3 rounded-full ${
              index === currentIndex ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
