'use client';
import { styles } from '@/app/styles/style';
import { useEditLayoutMutation, useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineDelete, AiOutlineSave } from 'react-icons/ai';
import { IoMdAddCircleOutline } from 'react-icons/io';
import Loader from '../../Loader/Loader';

// Define types for category
interface Category {
  _id: string;
  title: string;
  description: string;
}

interface LayoutData {
  layout: {
    categories: Category[];
  };
}

type Props = object;

const EditCategories = (props: Props) => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess: layoutSuccess, error, isLoading: isSaving }] = useEditLayoutMutation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [savedStates, setSavedStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (data) {
      const layoutData = data as LayoutData;
      setCategories(layoutData.layout.categories || []);
    }
    if (layoutSuccess) {
      toast.success("Categories updated successfully");
      const savedState: { [key: string]: boolean } = {};
      categories.forEach(cat => {
        savedState[cat._id] = true;
      });
      setSavedStates(savedState);
      setTimeout(() => setSavedStates({}), 2000);
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

  const handleCategoryChange = (id: string, field: keyof Category, value: string) => {
    setCategories(prev =>
      prev.map(cat => (cat._id === id ? { ...cat, [field]: value } : cat))
    );
    setSavedStates(prev => ({ ...prev, [id]: false }));
  };

  const newCategoryHandler = () => {
    setCategories([
      ...categories,
      {
        _id: Date.now().toString(),
        title: "",
        description: "",
      },
    ]);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(item => item._id !== id));
    setSavedStates(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const areCategoriesUnchanged = (original: Category[], updated: Category[]) =>
    JSON.stringify(original) === JSON.stringify(updated);

  const isAnyCategoryEmpty = (categories: Category[]) =>
    categories.some(cat => cat.title.trim() === "" || cat.description.trim() === "");

  const handleEdit = async () => {
    if (data) {
      const layoutData = data as LayoutData;
      if (
        !areCategoriesUnchanged(layoutData.layout.categories, categories) &&
        !isAnyCategoryEmpty(categories)
      ) {
        await editLayout({
          type: "Categories",
          categories: categories,
        });
      }
    }
  };

  const canSave = data ? 
    !areCategoriesUnchanged((data as LayoutData).layout.categories || [], categories) &&
    !isAnyCategoryEmpty(categories)
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
              Edit Categories
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
              Manage your course categories and their details
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 space-y-6">
            {categories.map((cat: Category, index: number) => (
              <div
                key={cat._id || index}
                className={`bg-gray-50 dark:bg-gray-800 rounded-xl p-6 transition-all duration-300 hover:shadow-lg border-2 ${
                  savedStates[cat._id]
                    ? 'ring-2 ring-green-500 ring-opacity-50'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  {/* Category Number */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>

                  {/* Category Details */}
                  <div className="flex-1 space-y-4">
                    {/* Title Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category Title
                      </label>
                      <input
                        className={`w-full text-lg font-semibold bg-transparent border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg px-4 py-3 transition-all duration-200 ${
                          savedStates[cat._id]
                            ? 'text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
                            : 'dark:text-white text-black'
                        }`}
                        value={cat.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleCategoryChange(cat._id, 'title', e.target.value)
                        }
                        placeholder="Enter category title..."
                      />
                    </div>

                    {/* Description Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        className={`w-full bg-transparent border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg px-4 py-3 transition-all duration-200 resize-none min-h-[100px] ${
                          savedStates[cat._id]
                            ? 'text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                        value={cat.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          handleCategoryChange(cat._id, 'description', e.target.value)
                        }
                        placeholder="Enter category description..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    {savedStates[cat._id] && (
                      <span className="text-green-500 text-sm font-medium flex items-center gap-1 whitespace-nowrap">
                        <AiOutlineSave className="text-base" />
                        Saved
                      </span>
                    )}

                    <button
                      className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl"
                      onClick={() => deleteCategory(cat._id)}
                    >
                      <AiOutlineDelete className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Category Button */}
            <button
              className="w-full mt-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              onClick={newCategoryHandler}
            >
              <IoMdAddCircleOutline className="text-2xl" />
              Add New Category
            </button>

            {/* Save Button */}
            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform shadow-2xl ${
                  canSave && !isSaving
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 hover:shadow-2xl cursor-pointer'
                    : 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed'
                } ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                  'Save All Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditCategories;