'use client';
import { styles } from '@/app/styles/style';
import { useEditLayoutMutation, useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineDelete, AiOutlineSave } from 'react-icons/ai';
import { HiMinus, HiPlus } from 'react-icons/hi';
import { IoMdAddCircleOutline } from 'react-icons/io';
import Loader from '../../Loader/Loader';

// Define types for FAQ
interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  active?: boolean; // Added for UI state
}

interface LayoutData {
  layout: {
    faq: FAQItem[];
  };
}

type Props = object;

const EditFaq = (props: Props) => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess: layoutSuccess, error, isLoading: isSaving }] =
    useEditLayoutMutation();
  const [questions, setQuestions] = useState<FAQItem[]>([]);
  const [savedStates, setSavedStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (data) {
      const layoutData = data as LayoutData;
      setQuestions(layoutData.layout.faq.map((q: FAQItem) => ({ ...q, active: false })));
    }
    if (layoutSuccess) {
      toast.success("FAQ updated successfully");
      const savedState: { [key: string]: boolean } = {};
      questions.forEach((q) => {
        savedState[q._id] = true;
      });
      setSavedStates(savedState);
      setTimeout(() => {
        setSavedStates({});
      }, 2000);
      refetch();
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as { data?: { message?: string } };
        toast.error(errorData.data?.message || "An error occurred");
      } else {
        toast.error("An error occurred");
      }
    }
  }, [data, layoutSuccess, error]);

  const toggleQuestion = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q._id === id ? { ...q, active: !q.active } : q))
    );
  };

  const handleQuestionChange = (id: string, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q._id === id ? { ...q, question: value } : q))
    );
    setSavedStates((prev) => ({ ...prev, [id]: false }));
  };

  const handleAnswerChange = (id: string, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q._id === id ? { ...q, answer: value } : q))
    );
    setSavedStates((prev) => ({ ...prev, [id]: false }));
  };

  const newFaqHandler = () => {
    setQuestions([
      ...questions,
      {
        _id: Date.now().toString(),
        question: "",
        answer: "",
        active: true,
      },
    ]);
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((item) => item._id !== id));
    setSavedStates((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const areQuestionsUnchanged = (original: FAQItem[], updated: FAQItem[]) => {
    // Remove 'active' property before comparison since it's UI state only
    const cleanOriginal = original.map(({ active, ...rest }) => rest);
    const cleanUpdated = updated.map(({ active, ...rest }) => rest);
    return JSON.stringify(cleanOriginal) === JSON.stringify(cleanUpdated);
  };

  const isAnyQuestionEmpty = (questions: FAQItem[]) =>
    questions.some((q) => q.question.trim() === "" || q.answer.trim() === "");

  const handleEdit = async () => {
    if (data) {
      const layoutData = data as LayoutData;
      if (
        !areQuestionsUnchanged(layoutData.layout.faq, questions) &&
        !isAnyQuestionEmpty(questions)
      ) {
        // Remove 'active' property before sending to API
        const faqToSend = questions.map(({ active, ...rest }) => rest);
        await editLayout({
          type: "FAQ",
          faq: faqToSend,
        });
      }
    }
  };

  const canSave = data ? 
    !areQuestionsUnchanged((data as LayoutData).layout.faq || [], questions) &&
    !isAnyQuestionEmpty(questions)
    : false;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div
          className="w-[90%] 800px:w-[80%] max-w-6xl m-auto mt-8 py-8 overflow-y-auto max-h-[calc(100vh-100px)] scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Edit FAQ Section
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
              Manage your frequently asked questions
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800">
            <div className="space-y-6">
              {questions.map((q: FAQItem, index: number) => (
                <div
                  key={q._id || index}
                  className={`bg-gray-50 dark:bg-gray-800 rounded-xl p-6 transition-all duration-300 hover:shadow-lg border-2 ${
                    q.active
                      ? "border-blue-500 dark:border-blue-600"
                      : "border-transparent"
                  } ${
                    savedStates[q._id]
                      ? "ring-2 ring-green-500 ring-opacity-50"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                        <input
                          className={`flex-1 text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-3 transition-all duration-200 ${
                            styles.input
                          } ${
                            savedStates[q._id]
                              ? "text-green-600 dark:text-green-400"
                              : "dark:text-white text-black"
                          }`}
                          value={q.question}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleQuestionChange(q._id, e.target.value)
                          }
                          placeholder="Enter your question..."
                        />

                        <div className="flex items-center gap-2">
                          {savedStates[q._id] && (
                            <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                              <AiOutlineSave className="text-base" />
                              Saved
                            </span>
                          )}

                          <button
                            className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl"
                            onClick={() => toggleQuestion(q._id)}
                          >
                            {q.active ? (
                              <HiMinus className="h-5 w-5" />
                            ) : (
                              <HiPlus className="h-5 w-5" />
                            )}
                          </button>

                          <button
                            className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl"
                            onClick={() => deleteQuestion(q._id)}
                          >
                            <AiOutlineDelete className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {q.active && (
                        <div className="pl-2 border-l-4 border-blue-500 ml-3">
                          <textarea
                            className={`w-full text-gray-700 dark:text-gray-300 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-3 transition-all duration-200 resize-none min-h-[100px] ${
                              styles.input
                            } ${
                              savedStates[q._id]
                                ? "text-green-600 dark:text-green-400"
                                : ""
                            }`}
                            value={q.answer}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                              handleAnswerChange(q._id, e.target.value)
                            }
                            placeholder="Enter your answer..."
                            rows={3}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="w-full mt-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              onClick={newFaqHandler}
            >
              <IoMdAddCircleOutline className="text-2xl" />
              Add New FAQ
            </button>

            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform shadow-2xl ${
                  canSave && !isSaving
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 hover:shadow-2xl cursor-pointer"
                    : "bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed"
                } ${isSaving ? "opacity-70 cursor-not-allowed" : ""}`}
                disabled={!canSave || isSaving}
                onClick={handleEdit}
              >
                <AiOutlineSave className="text-xl" />
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  "Save All Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditFaq;