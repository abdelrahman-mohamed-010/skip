"use client";

import React, { useState } from "react";
import { Laptop } from "lucide-react";
import TutorialModal from "./TutorialModal";
import MainWorkflow from "./MainWorkflow";

const MainWorkspaceContent = () => {
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const [isTutorialCompleted, setIsTutorialCompleted] = useState(false);

  const openTutorialModal = () => {
    setIsTutorialModalOpen(true);
  };

  const closeTutorialModal = () => {
    setIsTutorialModalOpen(false);
  };

  const handleTutorialComplete = () => {
    setIsTutorialCompleted(true);
    setIsTutorialModalOpen(false);
  };

  const handleSkipTutorial = () => {
    setIsTutorialCompleted(true);
  };

  return (
    <div className="flex-1  bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center min-h-full">
      {!isTutorialCompleted ? (
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md border border-slate-200/60 p-12 backdrop-blur-sm bg-white/80">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl shadow-inner mb-2">
              <Laptop className="text-blue-600 drop-shadow-sm" size={40} />
            </div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Welcome to your workspace!
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              Here you can upload your documents, fill out forms and ask
              immigration-related questions to
              <span className="font-semibold text-blue-600"> SkipGenius</span>,
              our AI immigration assistant.
            </p>
            <div className="flex flex-col items-center gap-4 pt-4">
              {" "}
              <button
                onClick={openTutorialModal}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 rounded-xl font-medium transition-all duration-200 transform shadow-md hover:shadow-xl"
              >
                Take the Workspace Tutorial
              </button>
              <button
                onClick={handleSkipTutorial}
                className="text-sm text-slate-500 hover:text-blue-600 hover:underline transition-colors bg-transparent border-none cursor-pointer p-0"
              >
                Skip the Tutorial
              </button>
            </div>{" "}
          </div>
        </div>
      ) : (
        <MainWorkflow />
      )}

      {/* Tutorial Modal */}
      <TutorialModal
        isOpen={isTutorialModalOpen}
        onClose={closeTutorialModal}
        onComplete={handleTutorialComplete}
      />
    </div>
  );
};

export default MainWorkspaceContent;
