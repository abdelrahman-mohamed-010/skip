/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import QuizModal from "@/app/app/components/QuizModal";
import WorkspaceLayout from "@/app/app/components/WorkspaceLayout";

const Page = () => {
  const [showModal, setShowModal] = useState(true);
  const [quizChoice, setQuizChoice] = useState<boolean | null>(null);
  const [quizData, setQuizData] = useState<any>(null);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  const handleOptionSelect = (takeQuiz: boolean, data?: any) => {
    setQuizChoice(takeQuiz);
    if (data) {
      setQuizData(data);
    }
    setShowModal(false);
  };

  return (
    <div className="bg-blue-900/50 h-full">
      {showModal && <QuizModal onOptionSelect={handleOptionSelect} />}
      <WorkspaceLayout />
    </div>
  );
};

export default Page;
