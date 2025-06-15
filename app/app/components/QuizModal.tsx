"use client";

import { BookOpenCheck, ChevronRight, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface QuizModalProps {
  onOptionSelect: (takeQuiz: boolean, data?: QuizAnswer) => void;
}

interface QuizAnswer {
  petitionerStatus?: "US_CITIZEN" | "PERMANENT_RESIDENT" | "OTHER";
  beneficiaryLocation?: "IN_US" | "OUTSIDE_US";
  maritalStatus?: "MARRIED" | "UNMARRIED";
  petitionerAge?: "UNDER_18" | "18_TO_20" | "OVER_21";
  relationship?: "SPOUSE" | "PARENT" | "SIBLING" | "FIANCE" | "CHILD";
  age?: "UNDER_21" | "OVER_21";
}

const QuizModal = ({ onOptionSelect }: QuizModalProps) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
  };

  // Fix handleAnswer function to align with Quiz component
  const handleAnswer = (question: number, answer: string) => {
    const newAnswers = { ...answers };
    switch (question) {
      case 0:
        newAnswers.petitionerStatus = answer as
          | "US_CITIZEN"
          | "PERMANENT_RESIDENT"
          | "OTHER";
        setCurrentQuestion(1);
        break;
      case 1:
        newAnswers.beneficiaryLocation = answer as "IN_US" | "OUTSIDE_US";
        setCurrentQuestion(2);
        break;
      case 2:
        newAnswers.maritalStatus = answer as "MARRIED" | "UNMARRIED";
        setCurrentQuestion(3);
        break;
      case 3:
        newAnswers.petitionerAge = answer as
          | "UNDER_18"
          | "18_TO_20"
          | "OVER_21";
        setCurrentQuestion(4);
        break;
      case 4:
        newAnswers.relationship = answer as
          | "SPOUSE"
          | "PARENT"
          | "SIBLING"
          | "FIANCE"
          | "CHILD";
        if (answer === "CHILD") {
          setCurrentQuestion(5);
        } else {
          // Complete quiz for non-child relationships
          setAnswers(newAnswers);
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
            setShowCompletion(true);
          }, 2000);
          return;
        }
        break;
      case 5:
        if (newAnswers.relationship === "CHILD") {
          newAnswers.age = answer as "UNDER_21" | "OVER_21";
          setCurrentQuestion(6);
        }
        break;
      case 6:
        if (newAnswers.relationship === "CHILD") {
          newAnswers.maritalStatus = answer as "MARRIED" | "UNMARRIED";
          setAnswers(newAnswers);
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
            setShowCompletion(true);
          }, 2000);
          return;
        }
        break;
    }
    setAnswers(newAnswers);
  };

  // Use the exact same getRequiredForms function from visaUtils
  const getRequiredForms = (
    petitionerStatus: string,
    isInUS: boolean,
    isSpouse: boolean,
    relationship: string,
    age: string,
    maritalStatus: string,
    petitionerAge: string
  ): {
    immediate: string[];
    whenCurrent: string[];
    requiredDocuments?: string[];
    fianceNote?: string;
  } => {
    const immediate: string[] = [];
    const whenCurrent: string[] = [];
    const requiredDocuments: string[] = [];
    let fianceNote: string | undefined = undefined;

    // Fiance logic
    if (petitionerStatus === "US_CITIZEN" && relationship === "FIANCE") {
      if (isInUS) {
        // Not eligible to file anything as a fiance in the US
        return { immediate: [], whenCurrent: [] };
      } else {
        immediate.push("I-129F");
        whenCurrent.push("I-864");
        whenCurrent.push(
          "I-864A (contract between sponsor and household member, needed in certain cases)"
        );
        whenCurrent.push("I-485");
        whenCurrent.push("I-765 (Optional - for work authorization)");
        whenCurrent.push(
          "I-131 (Optional - for international travel while case is pending)"
        );
        whenCurrent.push(
          "I-693 (Medical Examination - requires USCIS Civil Surgeon)"
        );
        fianceNote =
          "Once the K-1 visa is approved, the beneficiary must travel to the US, get married within 90 days, and then file these forms to adjust status.";
        return { immediate, whenCurrent, ...(fianceNote && { fianceNote }) };
      }
    }

    // Check eligibility based on petitioner status, relationship, and age
    const isEligible =
      // US Citizen cases
      (petitionerStatus === "US_CITIZEN" &&
        // Spouse - petitioner must be 18+
        ((isSpouse && petitionerAge !== "UNDER_18") ||
          // Children - no age requirement for petitioner
          (relationship === "CHILD" &&
            (age === "UNDER_21" || age === "OVER_21")) ||
          (relationship === "CHILD" &&
            age === "OVER_21" &&
            maritalStatus === "UNMARRIED") ||
          (relationship === "CHILD" &&
            age === "OVER_21" &&
            maritalStatus === "MARRIED") ||
          // Parents and Siblings - petitioner must be 21+
          ((relationship === "SIBLING" || relationship === "PARENT") &&
            petitionerAge === "OVER_21"))) ||
      // Permanent Resident cases
      (petitionerStatus === "PERMANENT_RESIDENT" &&
        // Spouse - petitioner must be 18+
        ((isSpouse && petitionerAge !== "UNDER_18") ||
          // Children - only unmarried children
          (relationship === "CHILD" &&
            (age === "UNDER_21" || age === "OVER_21") &&
            maritalStatus === "UNMARRIED")));

    if (isEligible) {
      // Everyone eligible can file I-130
      immediate.push("I-130");

      // Additional forms based on relationship and location
      if (isSpouse) {
        immediate.push("I-130A");
      }

      // Required documents for parent petitions
      if (relationship === "PARENT") {
        requiredDocuments.push(
          "Birth certificate showing your name and your parent's name",
          "Certificate of Naturalization or U.S. passport (if you were not born in the United States)"
        );

        // Additional documents for father petitions
        if (maritalStatus === "MARRIED") {
          requiredDocuments.push("Parents' civil marriage certificate");
        }
      }

      // Forms required when priority date becomes current
      whenCurrent.push(
        "I-864 (Affidavit of Support)",
        "I-864A (contract between sponsor and household member, needed in certain cases)",
        "DS-260 (Immigrant Visa Application)"
      );

      // Additional forms for beneficiaries in the US
      if (isInUS) {
        whenCurrent.push(
          "I-485 (Adjustment of Status)",
          "I-765 (Optional - for work authorization)",
          "I-131 (Optional - for international travel while case is pending)",
          "I-693 (Medical Examination - requires USCIS Civil Surgeon)"
        );
      }
    }

    return {
      immediate,
      whenCurrent,
      ...(requiredDocuments.length > 0 && { requiredDocuments }),
    };
  };

  const getIneligibilityReason = () => {
    if (
      answers.petitionerStatus !== "US_CITIZEN" &&
      answers.petitionerStatus !== "PERMANENT_RESIDENT"
    ) {
      return "You must be a U.S. citizen or lawful permanent resident to file Form I-130.";
    }

    if (
      answers.relationship === "SPOUSE" &&
      answers.petitionerAge === "UNDER_18"
    ) {
      return "You must be at least 18 years old to sponsor a spouse.";
    }

    if (
      (answers.relationship === "PARENT" ||
        answers.relationship === "SIBLING") &&
      answers.petitionerAge !== "OVER_21"
    ) {
      return "You must be at least 21 years old to sponsor a parent or sibling.";
    }

    return "The relationship does not qualify for I-130 filing.";
  };

  const generateDetailedResults = () => {
    const isInUS = answers.beneficiaryLocation === "IN_US";
    const isSpouse = answers.relationship === "SPOUSE";
    const isFiance = answers.relationship === "FIANCE";

    const { immediate, whenCurrent, fianceNote } = getRequiredForms(
      answers.petitionerStatus || "",
      isInUS,
      isSpouse,
      answers.relationship || "",
      answers.age || "",
      answers.maritalStatus || "",
      answers.petitionerAge || ""
    );

    // Handle special cases first
    if (immediate.length === 0 && isFiance && isInUS) {
      return {
        isEligible: false,
        specialMessage:
          "If you are engaged and your fiancé(e) is already in the United States, you cannot file a fiancé(e) petition. Please proceed as a spouse once you are married.",
      };
    }

    if (immediate.length === 0) {
      return {
        isEligible: false,
        reason: getIneligibilityReason(),
      };
    }

    // Generate document lists based on form type
    let petitionerDocs: string[] = [];
    let beneficiaryDocs: string[] = [];

    if (isFiance && !isInUS) {
      // I-129F documents
      petitionerDocs = [
        "US passport",
        "Birth certificate or naturalization certificate",
        "Passport size photos",
        "Evidence of genuine relationship (photos, correspondence)",
        "Fiance(e) Letter of Intent",
      ];
      beneficiaryDocs = [
        "Valid passport",
        "Birth certificate",
        "Marriage certificate (if applicable) / divorce or death certificate for previous marriage (if applicable)",
        "If beneficiary has children, then birth certificates of children",
        "Passport size photos",
        "Fiance(e) Letter of Intent",
      ];
    } else {
      // I-130 documents
      petitionerDocs = [
        "US passport",
        "Birth certificate or naturalization certificate",
        "Passport size photos",
        "Evidence of genuine relationship (photos, correspondence)",
      ];
      if (isSpouse) {
        petitionerDocs.push(
          "Evidence of genuine relationship (joint accounts if filing for spouse)"
        );
      }

      beneficiaryDocs = [
        "Valid passport",
        "Birth certificate",
        "Marriage certificate (if applicable) / divorce or death certificate for previous marriage (if applicable)",
        "If beneficiary has children, then birth certificates of children",
        "Passport size photos",
      ];
      if (isInUS) {
        beneficiaryDocs.push(
          "Copy of US visa used to enter the country",
          "I-94"
        );
      }
    }

    return {
      isEligible: true,
      immediateForms: immediate,
      whenCurrentForms: whenCurrent,
      petitionerDocs,
      beneficiaryDocs,
      fianceNote,
      isFiance,
      isInUS,
      isSpouse,
    };
  };

  const renderDetailedResults = () => {
    const results = generateDetailedResults();

    return (
      <div className="animate-fadeIn py-6 max-h-96 overflow-y-auto">
        {!results.isEligible ? (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-red-600">
              {results.specialMessage
                ? "No Application at This Point"
                : "Not Eligible for I-130 Filing"}
            </h2>
            <p className="text-lg text-gray-700">
              {results.specialMessage || results.reason}
            </p>
            {!results.specialMessage && (
              <p className="mt-4 text-gray-700">
                Please consult with an immigration attorney to explore other
                potential immigration options.
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                Forms You Can File Now
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                {results.immediateForms?.map((form) => (
                  <li key={form} className="text-lg">
                    {form}
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-700">
                  {results.isFiance && !results.isInUS
                    ? "After filing these forms, USCIS will review your petition. Once approved your fiancé(e) can apply for a K-1 visa at the U.S. Consulate in their home country."
                    : "After filing these forms, USCIS will review your petition. Once approved and when your priority date is current, your case will be sent to the National Visa Center (NVC) for further processing."}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                Documents Needed for{" "}
                {results.isFiance && !results.isInUS ? "I-129F" : "I-130"}
              </h2>
              <div className="mb-4">
                <h3 className="font-semibold">Petitioner:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {results.petitionerDocs?.map((doc, index) => (
                    <li key={index} className="text-sm">
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold">Beneficiary:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {results.beneficiaryDocs?.map((doc, index) => (
                    <li key={index} className="text-sm">
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {results.fianceNote && (
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                <p className="text-yellow-700">{results.fianceNote}</p>
              </div>
            )}

            {results.whenCurrentForms &&
              results.whenCurrentForms.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">
                    {results.isFiance
                      ? "Forms Required After K-1 Entry and Marriage in the US"
                      : "Forms Required When Your I-130 is Approved and Your Priority Date is Current"}
                  </h2>
                  <ul className="list-disc pl-5 space-y-2">
                    {results.whenCurrentForms.map((form, index) => (
                      <li key={index} className="text-sm">
                        {form.includes("I-693") ? (
                          <>
                            {form.split(" (")[0]} (medical examination){" "}
                            <a
                              href="https://www.uscis.gov/tools/find-a-civil-surgeon"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-800 underline hover:text-blue-900"
                            >
                              (find a USCIS civil surgeon)
                            </a>
                          </>
                        ) : (
                          form
                        )}
                      </li>
                    ))}
                  </ul>
                  {!results.isFiance && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-blue-700 text-sm">
                        To check when your priority date will become current,
                        visit the{" "}
                        <a
                          href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/current-visa-bulletin.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-800 underline hover:text-blue-900"
                        >
                          Department of State Visa Bulletin
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              )}

            {results.isSpouse && (
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  Important Note for Spouses:
                </h3>
                <p className="text-yellow-700 text-sm">
                  If you have been married for less than two years when your
                  spouse's green card is approved, they will receive conditional
                  permanent residence. You will need to file Form I-751 to
                  remove these conditions prior to the expiration of the
                  conditional green card.
                </p>
              </div>
            )}
          </>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Important Notes:</h3>
          <p className="text-blue-700 text-sm">
            Processing times may vary. Check current processing times on the{" "}
            <a
              href="https://egov.uscis.gov/processing-times/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 underline hover:text-blue-900"
            >
              USCIS website
            </a>
          </p>
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
              Are you (the petitioner)?
            </h3>
            <div className="grid gap-4 max-w-lg mx-auto">
              <button
                onClick={() => handleAnswer(0, "US_CITIZEN")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">US Citizen</span>
              </button>
              <button
                onClick={() => handleAnswer(0, "PERMANENT_RESIDENT")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">
                  Permanent Resident / Green card holder
                </span>
              </button>
              <button
                onClick={() => handleAnswer(0, "OTHER")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">Other</span>
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
                onClick={() => handleAnswer(1, "IN_US")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">
                  a. In the United States
                </span>
              </button>
              <button
                onClick={() => handleAnswer(1, "OUTSIDE_US")}
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
            <h3 className="text-2xl font-bold text-center mb-8">
              What is your marital status?
            </h3>
            <div className="grid gap-4 max-w-lg mx-auto">
              <button
                onClick={() => handleAnswer(2, "MARRIED")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">Married</span>
              </button>
              <button
                onClick={() => handleAnswer(2, "UNMARRIED")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">Unmarried</span>
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-2xl font-bold text-center mb-8">
              What is your age?
            </h3>
            <div className="grid gap-4 max-w-lg mx-auto">
              <button
                onClick={() => handleAnswer(3, "OVER_21")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">Over 21</span>
              </button>
              <button
                onClick={() => handleAnswer(3, "18_TO_20")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">18 to 20</span>
              </button>
              <button
                onClick={() => handleAnswer(3, "UNDER_18")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">Under 18</span>
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-2xl font-bold text-center mb-8">
              Are you applying for a greencard for?
            </h3>
            <div className="grid gap-4 max-w-lg mx-auto">
              {answers.maritalStatus === "MARRIED" && (
                <button
                  onClick={() => handleAnswer(4, "SPOUSE")}
                  className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
                >
                  <span className="text-xl font-medium">a. Spouse</span>
                </button>
              )}
              <button
                onClick={() => handleAnswer(4, "PARENT")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">b. Parent</span>
              </button>
              <button
                onClick={() => handleAnswer(4, "SIBLING")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">c. Sibling</span>
              </button>
              <button
                onClick={() => handleAnswer(4, "FIANCE")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">d. Fiance</span>
              </button>
              <button
                onClick={() => handleAnswer(4, "CHILD")}
                className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-medium">e. Child</span>
              </button>
            </div>
          </div>
        );
      case 5:
        if (answers.relationship === "CHILD") {
          return (
            <div className="animate-fadeIn">
              <h3 className="text-2xl font-bold text-center mb-8">
                What is the age of the child?
              </h3>
              <div className="grid gap-4 max-w-lg mx-auto">
                <button
                  onClick={() => handleAnswer(5, "UNDER_21")}
                  className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
                >
                  <span className="text-xl font-medium">Under 21</span>
                </button>
                <button
                  onClick={() => handleAnswer(5, "OVER_21")}
                  className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
                >
                  <span className="text-xl font-medium">Over 21</span>
                </button>
              </div>
            </div>
          );
        }
        return null;
      case 6:
        if (answers.relationship === "CHILD") {
          return (
            <div className="animate-fadeIn">
              <h3 className="text-2xl font-bold text-center mb-8">
                What is the marital status of the child?
              </h3>
              <div className="grid gap-4 max-w-lg mx-auto">
                <button
                  onClick={() => handleAnswer(6, "MARRIED")}
                  className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
                >
                  <span className="text-xl font-medium">Married</span>
                </button>
                <button
                  onClick={() => handleAnswer(6, "UNMARRIED")}
                  className="border rounded-xl p-6 text-left hover:border-blue-500 transition-colors"
                >
                  <span className="text-xl font-medium">Unmarried</span>
                </button>
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
      <div className="animate-fadeIn py-6">
        <h3 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Your Detailed Results
        </h3>
        <div className="max-h-[60vh] overflow-y-auto">
          {renderDetailedResults()}
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setShowCompletion(false);
              setQuizStarted(false);
              setCurrentQuestion(0);
              setAnswers({});
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-full text-lg transition-colors mr-4"
          >
            Take Quiz Again
          </button>
          <button
            onClick={() =>
              window.open(
                "https://skiplegal.ai/family-based-greencard-signup",
                "_blank"
              )
            }
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-full text-lg transition-colors"
          >
            Join Waitlist
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
