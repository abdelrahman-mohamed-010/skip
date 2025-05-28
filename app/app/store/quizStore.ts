import { create } from "zustand";
import { persist } from "zustand/middleware";

interface QuizState {
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer?: string;
  }>;
  answers: Record<string, string>;
  currentQuestionIndex: number;
  score: number;
  quizCompleted: boolean;
  // Actions
  setQuestions: (questions: QuizState["questions"]) => void;
  setAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  calculateScore: () => void;
  resetQuiz: () => void;
  setQuizCompleted: (completed: boolean) => void;
}

// Create a custom storage object
const customStorage = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    return JSON.parse(str);
  },
  setItem: (name: string, value: unknown) => {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(name, serializedValue);
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      questions: [],
      answers: {},
      currentQuestionIndex: 0,
      score: 0,
      quizCompleted: false,

      setQuestions: (questions) => set({ questions }),

      setAnswer: (questionId, answer) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: answer,
          },
        })),

      nextQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.min(
            state.currentQuestionIndex + 1,
            state.questions.length - 1
          ),
        })),

      previousQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
        })),

      calculateScore: () => {
        const { questions, answers } = get();
        let score = 0;

        questions.forEach((q) => {
          if (q.correctAnswer && answers[q.id] === q.correctAnswer) {
            score += 1;
          }
        });

        set({
          score,
          quizCompleted: true,
        });
      },

      resetQuiz: () =>
        set({
          answers: {},
          currentQuestionIndex: 0,
          score: 0,
          quizCompleted: false,
        }),

      setQuizCompleted: (completed) => set({ quizCompleted: completed }),
    }),
    {
      name: "quiz-storage",
      storage: customStorage,
    }
  )
);
