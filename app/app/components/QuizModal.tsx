"use client";

import {
  BookOpenCheck,
  ChevronRight,
  ArrowLeft,
  HelpCircle,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface QuizModalProps {
  onOptionSelect: (takeQuiz: boolean, data?: QuizAnswer) => void;
}

interface QuizAnswer {
  helpType?: "permanent" | "temporary";
  isCitizen?: boolean;
  userType?: "petitioner" | "beneficiary";
  maritalStatus?: "single" | "married" | "divorced";
}

type AnswerValue = string | boolean;

const QuizModal = ({ onOptionSelect }: QuizModalProps) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showExplanation, setShowExplanation] = useState<{
    [key: string]: boolean;
  }>({});

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswer = (question: number, answer: AnswerValue) => {
    const newAnswers = { ...answers };

    switch (question) {
      case 0:
        newAnswers.helpType = answer as "permanent" | "temporary";
        break;
      case 1:
        newAnswers.isCitizen = answer as boolean;
        break;
      case 2:
        newAnswers.userType = answer as "petitioner" | "beneficiary";
        break;
      case 3:
        newAnswers.maritalStatus = answer as "single" | "married" | "divorced";
        break;
    }

    setAnswers(newAnswers); // If all questions answered, show loading and complete the quiz
    if (currentQuestion === 3) {
      setIsLoading(true);
      // Simulate processing delay - show completion message instead of navigating to app
      setTimeout(() => {
        setIsLoading(false);
        setShowCompletion(true);
      }, 2000);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      // Return to the initial screen when at first question
      setQuizStarted(false);
    }
  };

  const toggleExplanation = (questionIndex: number, optionIndex?: string) => {
    const key = optionIndex ? `${questionIndex}-${optionIndex}` : questionIndex;
    setShowExplanation((prev) => {
      // If clicking the same explanation that's already open, close it
      if (prev[key]) {
        return {};
      }
      // Otherwise, close all others and open this one
      return { [key]: true };
    });
  };

  // Close explanations when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".explanation-container") &&
        !target.closest(".help-icon")
      ) {
        setShowExplanation({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderProgressBar = () => {
    const progress = (currentQuestion / 4) * 100;

    return (
      <div className="w-full mb-6">
        <div className="flex justify-between mb-1 text-sm text-gray-500">
          <span>Question {currentQuestion + 1} of 4</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderQuizQuestion = () => {
    switch (currentQuestion) {
      case 0:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-2xl font-bold text-center mb-8">
              What can we help you with today?
            </h3>

            <div className="grid gap-4 max-w-lg mx-auto">
              <div className="relative">
                <button
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest(".help-icon")) {
                      toggleExplanation(0, "permanent");
                    } else {
                      handleAnswer(0, "permanent");
                    }
                  }}
                  className="w-full border rounded-xl p-6 text-left hover:border-blue-500 transition-colors group relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-medium pr-12">
                      Permanent US Immigration
                    </span>
                    <div
                      className="help-icon absolute right-2 top-0 h-full w-12 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100 rounded-r-xl"
                      title="Explain more"
                    >
                      <HelpCircle size={38} />
                    </div>
                  </div>
                </button>

                {showExplanation["0-permanent"] && (
                  <div className="explanation-container absolute top-full left-0 right-0 mt-2 z-10 animate-slideIn">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-semibold text-sm">
                            Permanent US Immigration
                          </h4>
                          <button
                            onClick={() => toggleExplanation(0, "permanent")}
                            className="text-white/80 hover:text-white transition-colors"
                          >
                            <ChevronUp size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Includes green cards, family-based petitions,
                          employment-based immigration, marriage-based
                          petitions, and other paths to permanent residency in
                          the United States.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest(".help-icon")) {
                      toggleExplanation(0, "temporary");
                    } else {
                      handleAnswer(0, "temporary");
                    }
                  }}
                  className="w-full border rounded-xl p-6 text-left hover:border-blue-500 transition-colors group relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-medium pr-12">
                      Temporary Visiting the US
                    </span>
                    <div
                      className="help-icon absolute right-2 top-0 h-full w-12 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100 rounded-r-xl"
                      title="Explain more"
                    >
                      <HelpCircle size={38} />
                    </div>
                  </div>
                </button>

                {showExplanation["0-temporary"] && (
                  <div className="explanation-container absolute top-full left-0 right-0 mt-2 z-10 animate-slideIn">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-semibold text-sm">
                            Temporary Visiting the US
                          </h4>
                          <button
                            onClick={() => toggleExplanation(0, "temporary")}
                            className="text-white/80 hover:text-white transition-colors"
                          >
                            <ChevronUp size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Covers tourist visas (B-2), business visas (B-1),
                          student visas (F-1, M-1), work visas (H-1B, L-1,
                          etc.), and other temporary stays with specific
                          purposes and durations.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Are you a US citizen?
            </h3>
            <div className="grid gap-4 max-w-lg mx-auto">
              <button
                onClick={() => handleAnswer(1, true)}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">Yes</span>
              </button>
              <button
                onClick={() => handleAnswer(1, false)}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">No</span>
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-2xl font-bold text-center mb-8">
              Select what describes you
            </h3>

            <div className="grid gap-4 max-w-lg mx-auto">
              <div className="relative">
                <button
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest(".help-icon")) {
                      toggleExplanation(2, "petitioner");
                    } else {
                      handleAnswer(2, "petitioner");
                    }
                  }}
                  className="w-full border rounded-xl p-6 text-left hover:border-blue-500 transition-colors group relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-medium pr-12">
                      I am a petitioner
                    </span>
                    <div
                      className="help-icon absolute right-2 top-0 h-full w-12 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100 rounded-r-xl"
                      title="Explain more"
                    >
                      <HelpCircle size={38} />
                    </div>
                  </div>
                </button>

                {showExplanation["2-petitioner"] && (
                  <div className="explanation-container absolute top-full left-0 right-0 mt-2 z-10 animate-slideIn">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-semibold text-sm">
                            Petitioner
                          </h4>
                          <button
                            onClick={() => toggleExplanation(2, "petitioner")}
                            className="text-white/80 hover:text-white transition-colors"
                          >
                            <ChevronUp size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-600 text-sm leading-relaxed">
                          The person who files the immigration petition or
                          application. Usually a US citizen or permanent
                          resident sponsoring a family member, or an employer
                          sponsoring an employee.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest(".help-icon")) {
                      toggleExplanation(2, "beneficiary");
                    } else {
                      handleAnswer(2, "beneficiary");
                    }
                  }}
                  className="w-full border rounded-xl p-6 text-left hover:border-blue-500 transition-colors group relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-medium pr-12">
                      I am a beneficiary
                    </span>
                    <div
                      className="help-icon absolute right-2 top-0 h-full w-12 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100 rounded-r-xl"
                      title="Explain more"
                    >
                      <HelpCircle size={38} />
                    </div>
                  </div>
                </button>

                {showExplanation["2-beneficiary"] && (
                  <div className="explanation-container absolute top-full left-0 right-0 mt-2 z-10 animate-slideIn">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-semibold text-sm">
                            Beneficiary
                          </h4>
                          <button
                            onClick={() => toggleExplanation(2, "beneficiary")}
                            className="text-white/80 hover:text-white transition-colors"
                          >
                            <ChevronUp size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-600 text-sm leading-relaxed">
                          The person who will benefit from the immigration
                          petition. The person seeking to immigrate or visit the
                          US, such as a sponsored family member or employee.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-2xl font-bold mb-6 text-center">
              What&apos;s your marital status?
            </h3>
            <div className="grid gap-4 max-w-lg mx-auto">
              <button
                onClick={() => handleAnswer(3, "single")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">Single</span>
              </button>
              <button
                onClick={() => handleAnswer(3, "married")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">Married</span>
              </button>
              <button
                onClick={() => handleAnswer(3, "divorced")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">Divorced</span>
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  const renderLoadingScreen = () => {
    return (
      <div className="animate-fadeIn text-center py-12">
        <div className="mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
        </div>
        <h3 className="text-2xl font-bold mb-4">Processing your answers...</h3>
        <p className="text-gray-600 text-lg">
          We&apos;re analyzing your responses to provide the best
          recommendations.
        </p>
      </div>
    );
  };

  const renderCompletionScreen = () => {
    return (
      <div className="animate-fadeIn text-center py-12">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <BookOpenCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-3xl font-bold mb-4 text-green-700">Great News!</h3>
        <p className="text-xl text-gray-700 mb-6">
          Based on your responses, you appear to be eligible for immigration
          assistance.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
          <p className="text-gray-600 text-lg leading-relaxed">
            Our platform is currently being enhanced to provide you with the
            best possible experience. We&apos;ll notify you as soon as
            we&apos;re ready to help you with your immigration case.
          </p>
        </div>{" "}
        <div className="space-y-4">
          <button
            onClick={() => {
              setShowCompletion(false);
              setQuizStarted(false);
              setCurrentQuestion(0);
              setAnswers({});
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-full text-lg transition-colors"
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/20 text-gray-800 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl max-w-4xl w-full mx-4 overflow-hidden shadow-xl">
        <div className="p-10">
          {!quizStarted ? (
            <>
              <h2 className="text-4xl font-bold text-center mb-10">
                How would you like to begin?
              </h2>

              <div className="relative grid md:grid-cols-2 gap-6">
                <div className="border rounded-xl p-6 flex flex-col items-center hover:border-blue-500 transition-colors">
                  <div className="mb-4 w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full">
                    <BookOpenCheck className="w-8 h-8 stroke-blue-500" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Take the Quiz</h3>
                  <p className="text-xl text-gray-500 text-center mb-8">
                    Quickly find out if you&apos;re eligible in 1 minute
                  </p>
                  <button
                    onClick={startQuiz}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-full text-xl w-full max-w-xs transition-colors"
                  >
                    Start Quiz
                  </button>
                </div>

                <div className="md:absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white px-4 py-2 hidden md:block">
                  <span className="text-gray-500 text-lg font-medium">or</span>
                </div>

                <div className="border rounded-xl p-6 flex flex-col items-center hover:border-gray-400 transition-colors">
                  <div className="mb-4 w-16 h-16 flex items-center justify-center bg-gray-50 rounded-full">
                    <div className="relative flex">
                      <ChevronRight className="w-8 h-8 stroke-2 text-gray-600" />
                      <ChevronRight className="w-8 h-8 stroke-2 text-gray-600 -ml-4" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Skip the Quiz</h3>
                  <p className="text-xl text-center mb-8 text-gray-500 ">
                    Skip quiz if you already know what you need!
                  </p>
                  <button
                    onClick={() => onOptionSelect(false)}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-3 px-8 rounded-full text-xl w-full max-w-xs transition-colors"
                  >
                    Continue without Quiz
                  </button>
                </div>
              </div>
            </>
          ) : isLoading ? (
            renderLoadingScreen()
          ) : showCompletion ? (
            renderCompletionScreen()
          ) : (
            <div className="max-w-3xl mx-auto">
              {/* Back button */}
              <button
                onClick={goBack}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                <span>Back</span>
              </button>

              {renderProgressBar()}
              {renderQuizQuestion()}

              <div className="mt-8 text-center">
                <button
                  onClick={() => onOptionSelect(false)}
                  className="text-blue-900 hover:text-blue-900/90 transition-all font-semibold "
                >
                  Skip quiz and continue filling legal information
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 text-center text-gray-500 text-sm">
            Disclaimer: Please note that this information is general in nature
            and does not constitute legal advice.{" "}
            <Link href="#" className="text-gray-500 underline">
              Read full terms here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
