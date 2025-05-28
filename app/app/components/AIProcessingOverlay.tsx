"use client";

import React from "react";
import { Bot, CheckCircle, Loader2 } from "lucide-react";

interface AIProcessingOverlayProps {
  isVisible: boolean;
  progress: number; // 0-100
  currentStep: string;
  onCancel?: () => void;
}

const AIProcessingOverlay: React.FC<AIProcessingOverlayProps> = ({
  isVisible,
  progress,
  currentStep,
  onCancel,
}) => {
  if (!isVisible) return null;

  const steps = [
    { id: 1, name: "Analyzing documents", completed: progress > 20 },
    { id: 2, name: "Extracting information", completed: progress > 40 },
    { id: 3, name: "Processing data", completed: progress > 60 },
    { id: 4, name: "Filling forms", completed: progress > 80 },
    { id: 5, name: "Finalizing", completed: progress >= 100 },
  ];
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4">
        {" "}
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            AI Auto Fill in Progress
          </h2>
          <p className="text-gray-600">
            Please wait while we process your documents
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Progress */}
          <div>
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Current Step */}
            <div className="mb-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-blue-900 font-medium">{currentStep}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Steps List */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Processing Steps
            </h3>
            <div className="space-y-2">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      step.completed
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-medium">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      step.completed ? "text-green-700" : "text-gray-600"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Cancel Button */}
        {onCancel && (
          <div className="text-center">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel Process
            </button>
          </div>
        )}
        {/* Completion Message */}
        {progress >= 100 && (
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-green-700 font-medium">
              AI Auto Fill Completed!
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Your forms have been automatically filled. Please review the
              results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIProcessingOverlay;
