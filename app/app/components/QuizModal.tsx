/* eslint-disable prefer-const */
"use client";

import { BookOpenCheck, ChevronRight, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface QuizModalProps {
  onOptionSelect: (takeQuiz: boolean, data?: QuizAnswer) => void;
}

// Updated answers interface
interface QuizAnswer {
  petitionerStatus?: "usCitizen" | "greenCard" | "other";
  beneficiaryLocation?: "inUS" | "outsideUS";
  maritalStatus?: "married" | "unmarried";
  ageStatus?: "over21" | "under21";
  greencardFor?: "spouse" | "parent" | "sibling" | "fiance" | "child";
  spouseDuration?: "<2" | ">2";
  childAdditional?: {
    maritalStatus?: "married" | "unmarried";
    ageStatus?: "over21" | "under21";
    stepchild?: boolean;
    adopter?: boolean;
  };
  // ...existing properties if any...
}

const QuizModal = ({ onOptionSelect }: QuizModalProps) => {
  // Replace previous state with new quiz flow state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  // New local states for multi-select steps
  const [personalStatusSelection, setPersonalStatusSelection] = useState<{
    maritalStatus?: "married" | "unmarried";
    ageStatus?: "over21" | "under21";
  }>({});
  const [childStatusSelection, setChildStatusSelection] = useState<{
    maritalStatus?: "married" | "unmarried";
    ageStatus?: "over21" | "under21";
    stepchild?: boolean;
    adopter?: boolean;
  }>({});

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
  };

  // Modified answer handler for simple questions
  const handleAnswer = (question: number, answer: string | boolean) => {
    const newAnswers = { ...answers };
    switch (question) {
      case 0:
        newAnswers.petitionerStatus = answer as
          | "usCitizen"
          | "greenCard"
          | "other";
        break;
      case 1:
        newAnswers.beneficiaryLocation = answer as "inUS" | "outsideUS";
        break;
      case 3:
        newAnswers.greencardFor = answer as
          | "spouse"
          | "parent"
          | "sibling"
          | "fiance"
          | "child";
        break;
      case 4:
        if (answers.greencardFor === "spouse") {
          newAnswers.spouseDuration = answer as "<2" | ">2";
        }
        break;
      default:
        break;
    }
    setAnswers(newAnswers);
    // Advance conditionally:
    if (question === 3) {
      // if greencardFor is spouse or child, require an extra question step
      if (answer === "spouse" || answer === "child") {
        setCurrentQuestion(currentQuestion + 1);
        return;
      }
    }
    // Final step if on last question
    if (
      question === 4 ||
      (question === 3 && answer !== "spouse" && answer !== "child")
    ) {
      // simulate processing and show results
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setShowCompletion(true);
      }, 2000);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Function to compute eligibility based on answers (placeholder using provided table)
  const computeEligibility = () => {
    let eligibility = {
      category: "N/A",
      relationship: "N/A",
      forms: "N/A",
      documents: "N/A",
    };

    // NEW category logic
    if (answers.petitionerStatus === "usCitizen") {
      if (answers.greencardFor === "spouse") {
        if (answers.spouseDuration === ">2") {
          eligibility.category = "IR-1";
          eligibility.relationship = "Spouse of U.S. citizen (>2 yrs)";
          eligibility.forms = "I-130, I-485, I-864";
          eligibility.documents =
            "Marriage cert, I-485, I-864, passport, I-94, photos, medical";
        } else {
          eligibility.category = "CR-1";
          eligibility.relationship = "Spouse of U.S. citizen (<2 yrs)";
          eligibility.forms = "I-130, I-485, I-864, I-751 (later)";
          eligibility.documents = "Same as IR-1 + I-751 to remove conditions";
        }
      } else if (answers.greencardFor === "child") {
        if (answers.childAdditional?.ageStatus === "under21") {
          eligibility.category = "IR-2";
          eligibility.relationship = "Unmarried child (<21) of U.S. citizen";
          eligibility.forms = "I-130, I-485, I-864";
          eligibility.documents = "Birth cert, passport, I-94, medical, I-864";
        } else {
          eligibility.category = "F3";
          eligibility.relationship =
            "Married son/daughter of U.S. citizen or child 21+";
          eligibility.forms = "I-130, then DS-260/I-485 if PD current";
          eligibility.documents =
            "Marriage & birth certs, I-864, other supporting docs";
        }
      } else if (answers.greencardFor === "fiance") {
        eligibility.category = "K1";
        eligibility.relationship = "Fiancé(e) of U.S. citizen";
        eligibility.forms = "I-129F, DS-160, then I-485 after marriage";
        eligibility.documents =
          "Proof of relationship, passport, marriage docs, I-864 after marriage";
      } else if (answers.greencardFor === "parent") {
        eligibility.category = "IR-5";
        eligibility.relationship = "Parent of U.S. citizen (petitioner 21+)";
        eligibility.forms = "I-130, I-485, I-864";
        eligibility.documents =
          "Proof of relationship (petitioner birth cert), passport, I-94, medical";
      } else if (answers.greencardFor === "sibling") {
        eligibility.category = "F4";
        eligibility.relationship = "Sibling of U.S. citizen";
        eligibility.forms = "I-130, then DS-260/I-485 if PD current";
        eligibility.documents =
          "Birth certs showing shared parent, I-864, other supporting docs";
      } else {
        eligibility.category = "N/A";
      }
    } else if (answers.petitionerStatus === "greenCard") {
      if (
        answers.greencardFor === "spouse" ||
        (answers.greencardFor === "child" &&
          answers.childAdditional?.ageStatus === "under21")
      ) {
        eligibility.category = "F2A";
        eligibility.relationship = "Spouse or unmarried child (<21) of LPR";
        eligibility.forms = "I-130, DS-260/I-485, I-864";
        eligibility.documents =
          "Marriage cert or birth cert, passport, proof of LPR status, medical";
      } else if (answers.greencardFor === "child") {
        eligibility.category = "F2B";
        eligibility.relationship = "Unmarried sons/daughters (21+) of LPR";
        eligibility.forms = "I-130, DS-260/I-485, I-864";
        eligibility.documents =
          "Birth cert, proof of relationship, passport, I-94 if inside U.S.";
      } else {
        eligibility.category = "N/A";
      }
    } else {
      eligibility.category = "N/A";
    }

    return eligibility.category === "N/A" ? (
      <div className="bg-red-50 border border-red-300 p-8 rounded-xl text-center">
        <h3 className="text-3xl font-bold text-red-700 mb-4">Heads Up!</h3>
        <p className="text-lg mb-6">
          We could not find a matching category for your situation. Please see
          other resources or consult an attorney.
        </p>
      </div>
    ) : (
      <div className="bg-green-50 border border-green-300 p-8 rounded-xl text-center">
        <h3 className="text-3xl font-bold text-green-700 mb-4">
          Congratulations!
        </h3>
        <p className="text-lg mb-6">
          Based on your responses, you are eligible for the{" "}
          <span className="font-semibold">{eligibility.category}</span>{" "}
          category.
        </p>
        <div className="text-left bg-white p-4 rounded shadow-md inline-block">
          <p>
            <span className="font-semibold">Relationship:</span>{" "}
            {eligibility.relationship}
          </p>
          <p>
            <span className="font-semibold">Required Forms:</span>{" "}
            {eligibility.forms}
          </p>
          <p>
            <span className="font-semibold">Documents Needed:</span>{" "}
            {eligibility.documents}
          </p>
        </div>
      </div>
    );
  };

  // Render question based on currentQuestion index
  const renderQuizQuestion = () => {
    switch (currentQuestion) {
      case 0:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-2xl font-bold text-center mb-8">
              Are you (the petitioner)?
            </h3>
            <div className="grid gap-4 max-w-lg mx-auto">
              {/* Option a */}
              <button
                onClick={() => handleAnswer(0, "usCitizen")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">a. US Citizen</span>
              </button>
              {/* Option b */}
              <button
                onClick={() => handleAnswer(0, "greenCard")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">
                  b. Permanent Resident / Green card holder
                </span>
              </button>
              {/* Option c */}
              <button
                onClick={() => handleAnswer(0, "other")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">c. Other</span>
              </button>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-2xl font-bold text-center mb-8">
              Is the person you are applying for (the beneficiary)
            </h3>
            <div className="grid gap-4 max-w-lg mx-auto">
              <button
                onClick={() => handleAnswer(1, "inUS")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">
                  a. In the United States
                </span>
              </button>
              <button
                onClick={() => handleAnswer(1, "outsideUS")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">
                  b. Outside the United States
                </span>
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-2xl font-bold text-center mb-6">Are you?</h3>
            <div className="max-w-lg mx-auto space-y-6">
              <div>
                <p className="text-xl mb-2">Marital Status:</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() =>
                      setPersonalStatusSelection((prev) => ({
                        ...prev,
                        maritalStatus: "married",
                      }))
                    }
                    className={`border rounded-xl p-6 text-center transition-colors ${personalStatusSelection.maritalStatus === "married" ? "border-blue-500" : ""}`}
                  >
                    Married
                  </button>
                  <button
                    onClick={() =>
                      setPersonalStatusSelection((prev) => ({
                        ...prev,
                        maritalStatus: "unmarried",
                      }))
                    }
                    className={`border rounded-xl p-6 text-center transition-colors ${personalStatusSelection.maritalStatus === "unmarried" ? "border-blue-500" : ""}`}
                  >
                    Unmarried
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xl mb-2">Age:</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() =>
                      setPersonalStatusSelection((prev) => ({
                        ...prev,
                        ageStatus: "over21",
                      }))
                    }
                    className={`border rounded-xl p-6 text-center transition-colors ${personalStatusSelection.ageStatus === "over21" ? "border-blue-500" : ""}`}
                  >
                    Over 21
                  </button>
                  <button
                    onClick={() =>
                      setPersonalStatusSelection((prev) => ({
                        ...prev,
                        ageStatus: "under21",
                      }))
                    }
                    className={`border rounded-xl p-6 text-center transition-colors ${personalStatusSelection.ageStatus === "under21" ? "border-blue-500" : ""}`}
                  >
                    Under 21
                  </button>
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={() => {
                    if (
                      personalStatusSelection.maritalStatus &&
                      personalStatusSelection.ageStatus
                    ) {
                      setAnswers({
                        ...answers,
                        maritalStatus: personalStatusSelection.maritalStatus,
                        ageStatus: personalStatusSelection.ageStatus,
                      });
                      setCurrentQuestion(currentQuestion + 1);
                    }
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-full text-lg transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-2xl font-bold text-center mb-8">
              Are you applying for a greencard for?
            </h3>
            <div className="grid gap-4 max-w-lg mx-auto">
              <button
                onClick={() => handleAnswer(3, "spouse")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">a. Spouse</span>
              </button>
              <button
                onClick={() => handleAnswer(3, "parent")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">b. Parent</span>
              </button>
              <button
                onClick={() => handleAnswer(3, "sibling")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">c. Sibling</span>
              </button>
              <button
                onClick={() => handleAnswer(3, "fiance")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">d. Fiance</span>
              </button>
              <button
                onClick={() => handleAnswer(3, "child")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">e. Child</span>
              </button>
            </div>
          </div>
        );
      case 4:
        // Conditional question based on greencardFor choice
        if (answers.greencardFor === "spouse") {
          return (
            <div className="animate-fadeIn">
              <h3 className="text-2xl font-bold text-center mb-8">
                How long have you been married for?
              </h3>
              <div className="grid gap-4 max-w-lg mx-auto">
                <button
                  onClick={() => handleAnswer(4, "<2")}
                  className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
                >
                  <span className="text-xl font-medium">&lt;2 years</span>
                </button>
                <button
                  onClick={() => handleAnswer(4, ">2")}
                  className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
                >
                  <span className="text-xl font-medium">More than 2 years</span>
                </button>
              </div>
            </div>
          );
        } else if (answers.greencardFor === "child") {
          return (
            <div className="animate-fadeIn">
              <h3 className="text-2xl font-bold text-center mb-6">
                Please specify details for the child:
              </h3>
              <div className="max-w-lg mx-auto space-y-6">
                <div>
                  <p className="text-xl mb-2">Marital Status:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() =>
                        setChildStatusSelection((prev) => ({
                          ...prev,
                          maritalStatus: "married",
                        }))
                      }
                      className={`border rounded-xl p-6 text-center transition-colors ${childStatusSelection.maritalStatus === "married" ? "border-blue-500" : ""}`}
                    >
                      Married
                    </button>
                    <button
                      onClick={() =>
                        setChildStatusSelection((prev) => ({
                          ...prev,
                          maritalStatus: "unmarried",
                        }))
                      }
                      className={`border rounded-xl p-6 text-center transition-colors ${childStatusSelection.maritalStatus === "unmarried" ? "border-blue-500" : ""}`}
                    >
                      Unmarried
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xl mb-2">Age:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() =>
                        setChildStatusSelection((prev) => ({
                          ...prev,
                          ageStatus: "over21",
                        }))
                      }
                      className={`border rounded-xl p-6 text-center transition-colors ${childStatusSelection.ageStatus === "over21" ? "border-blue-500" : ""}`}
                    >
                      Over 21
                    </button>
                    <button
                      onClick={() =>
                        setChildStatusSelection((prev) => ({
                          ...prev,
                          ageStatus: "under21",
                        }))
                      }
                      className={`border rounded-xl p-6 text-center transition-colors ${childStatusSelection.ageStatus === "under21" ? "border-blue-500" : ""}`}
                    >
                      Under 21
                    </button>
                  </div>
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() =>
                      setChildStatusSelection((prev) => ({
                        ...prev,
                        stepchild: !prev.stepchild,
                      }))
                    }
                    className={`border rounded-xl p-4 transition-colors ${childStatusSelection.stepchild ? "border-blue-500" : ""}`}
                  >
                    Stepchild
                  </button>
                  <button
                    onClick={() =>
                      setChildStatusSelection((prev) => ({
                        ...prev,
                        adopter: !prev.adopter,
                      }))
                    }
                    className={`border rounded-xl p-4 transition-colors ${childStatusSelection.adopter ? "border-blue-500" : ""}`}
                  >
                    Adopter
                  </button>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => {
                      setAnswers({
                        ...answers,
                        childAdditional: childStatusSelection,
                      });
                      setCurrentQuestion(currentQuestion + 1);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-full text-lg transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          );
        }
        return null;
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
        {computeEligibility()}
        <div className="mt-8">
          <button
            onClick={() => {
              setShowCompletion(false);
              setQuizStarted(false);
              setCurrentQuestion(0);
              setAnswers({});
              setPersonalStatusSelection({});
              setChildStatusSelection({});
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-full text-lg transition-colors"
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  };
  // // Close explanations when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     const target = event.target as HTMLElement;
  //     if (
  //       !target.closest(".explanation-container") &&
  //       !target.closest(".help-icon")
  //     ) {
  //       setShowExplanation({});
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

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
                onClick={() =>
                  setCurrentQuestion(
                    currentQuestion > 0 ? currentQuestion - 1 : 0
                  )
                }
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                <span>Back</span>
              </button>
              {/* Optionally show progress bar */}
              {/* ...existing progress bar code... */}
              {renderQuizQuestion()}
              <div className="mt-8 text-center">
                <button
                  onClick={() => onOptionSelect(false)}
                  className="text-blue-900 hover:text-blue-900/90 transition-all font-semibold"
                >
                  Skip quiz and continue filling legal information
                </button>
              </div>
            </div>
          )}
          <div className="mt-8 text-center text-gray-500 text-sm">
            Disclaimer: Please note that this information is general in nature
            and does not constitute legal advice.{" "}
            <a href="#" className="text-gray-500 underline">
              Read full terms here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
