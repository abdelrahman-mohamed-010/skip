"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const TutorialModal = ({ isOpen, onClose, onComplete }: TutorialModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Welcome to your Workspace",
      description:
        "This is your personal workspace where you can manage your immigration journey. Let us guide you through the key features.",
      placeholderContent: (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="h-20 bg-gray-300 rounded-md"></div>
            <div className="h-20 bg-gray-300 rounded-md"></div>
            <div className="h-20 bg-gray-300 rounded-md"></div>
            <div className="h-20 bg-gray-300 rounded-md"></div>
          </div>
          <div className="w-3/4 h-2 bg-gray-300 rounded-full mx-auto"></div>
        </>
      ),
    },
    {
      title: "Document Management",
      description:
        "Upload and organize your important immigration documents securely in one place. We support all major file formats.",
      placeholderContent: (
        <>
          <div className="w-full h-8 bg-gray-300 rounded-md mb-4"></div>
          <div className="flex justify-between mb-4">
            <div className="w-1/4 h-20 bg-gray-300 rounded-md"></div>
            <div className="w-1/2 h-20 bg-gray-300 rounded-md"></div>
          </div>
          <div className="w-3/4 mx-auto h-12 bg-gray-300 rounded-md"></div>
        </>
      ),
    },
    {
      title: "AI Document Analysis",
      description:
        "Our AI can review your documents and provide insights, suggestions, and identify potential issues.",
      placeholderContent: (
        <>
          <div className="w-full h-6 bg-gray-300 rounded-md mb-4"></div>
          <div className="w-full h-32 bg-gray-300 rounded-md mb-4"></div>
          <div className="flex justify-end">
            <div className="w-1/3 h-8 bg-gray-300 rounded-md"></div>
          </div>
        </>
      ),
    },
    {
      title: "SkipGenius Assistant",
      description:
        "Ask questions anytime and get immigration guidance from our specialized AI assistant.",
      placeholderContent: (
        <>
          <div className="flex flex-col items-end mb-3">
            <div className="w-3/5 h-10 bg-gray-400 rounded-lg mb-2"></div>
            <div className="w-2/5 h-10 bg-gray-400 rounded-lg"></div>
          </div>
          <div className="flex flex-col items-start">
            <div className="w-3/5 h-10 bg-gray-300 rounded-lg mb-2"></div>
            <div className="w-4/5 h-10 bg-gray-300 rounded-lg"></div>
          </div>
          <div className="w-full h-10 bg-gray-200 rounded-lg mt-4"></div>
        </>
      ),
    },
  ];

  const goToNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      {/* Modal container */}{" "}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-4xl animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close tutorial"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          {/* Step content */}
          <div className="p-8 pt-16">
            {" "}
            <div className="flex flex-col items-center text-center space-y-6">
              <h2 className="text-2xl font-semibold text-slate-800">
                {tutorialSteps[currentStep].title}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-2">
                {tutorialSteps[currentStep].description}
              </p>
              {/* Screenshot placeholder */}{" "}
              <div className="w-full max-w-xl h-72 bg-gray-200 rounded-lg flex items-center justify-center mt-2 mb-4 border border-gray-300">
                <p className="text-sm text-gray-500 italic">
                  Screenshot placeholder
                </p>
              </div>
              {/* Step indicators */}
              <div className="flex space-x-2 pt-2">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2.5 h-2.5 rounded-full ${
                      index === currentStep ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="border-t border-gray-100 p-4 flex justify-between">
            <button
              onClick={goToPreviousStep}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                currentStep === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <button
              onClick={goToNextStep}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>
                {currentStep === tutorialSteps.length - 1 ? "Finish" : "Next"}
              </span>
              {currentStep === tutorialSteps.length - 1 ? null : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TutorialModal;
