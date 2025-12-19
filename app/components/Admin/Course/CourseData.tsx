'use client';
import { styles } from '@/app/styles/style';
import React, { FC, ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import { AiOutlinePlusCircle } from 'react-icons/ai';

type Benefit = {
  title: string;
};

type Prerequisite = {
  title: string;
};

type Props = {
  benefits: Benefit[];
  setBenefits: (benefits: Benefit[]) => void;
  prerequisites: Prerequisite[];
  setPrerequisites: (prerequisites: Prerequisite[]) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseData: FC<Props> = ({
  benefits,
  setBenefits,
  prerequisites,
  setPrerequisites,
  active,
  setActive,
}) => {
  const handleBenefitChange = (index: number, value: string) => {
    const updatedBenefits = [...benefits];
    updatedBenefits[index].title = value;
    setBenefits(updatedBenefits);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, { title: '' }]);
  };

  const handlePrerequisitesChange = (index: number, value: string) => {
    const updatedPrerequisites = [...prerequisites];
    updatedPrerequisites[index].title = value;
    setPrerequisites(updatedPrerequisites);
  };

  const handleAddPrerequisite = () => {
    setPrerequisites([...prerequisites, { title: '' }]);
  };

  const prevButton = () => setActive(active - 1);

  const handleOptions = () => {
    if (
      benefits[benefits.length - 1]?.title !== '' &&
      prerequisites[prerequisites.length - 1]?.title !== ''
    ) {
      setActive(active + 1);
    } else {
      toast.error('Please fill all fields to proceed!');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 p-6 bg-white dark:bg-[#111827] rounded-2xl shadow-lg transition-all">
      {/* Benefits Section */}
      <div className="mb-8">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          What are the benefits for students in this course?
        </h3>
        {benefits.map((benefit: Benefit, index: number) => (
          <input
            type="text"
            key={index}
            placeholder="You will be able to build a full stack LMS Platform..."
            value={benefit.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleBenefitChange(index, e.target.value)}
            className={`${styles.input} w-full my-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
          />
        ))}
        <button
          type="button"
          onClick={handleAddBenefit}
          className="flex items-center gap-2 mt-2 text-blue-500 font-medium hover:text-blue-600 transition"
        >
          <AiOutlinePlusCircle size={24} /> Add More Benefits
        </button>
      </div>

      {/* Prerequisites Section */}
      <div className="mb-8">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          What are the prerequisites for starting this course?
        </h3>
        {prerequisites.map((pre: Prerequisite, index: number) => (
          <input
            type="text"
            key={index}
            placeholder="You need basic knowledge of MERN stack"
            value={pre.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handlePrerequisitesChange(index, e.target.value)}
            className={`${styles.input} w-full my-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
          />
        ))}
        <button
          type="button"
          onClick={handleAddPrerequisite}
          className="flex items-center gap-2 mt-2 text-blue-500 font-medium hover:text-blue-600 transition"
        >
          <AiOutlinePlusCircle size={24} /> Add More Prerequisites
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mt-6">
        <button
          onClick={prevButton}
          className="flex-1 py-3 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          Prev
        </button>
        <button
          onClick={handleOptions}
          className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-lg font-medium hover:opacity-90 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CourseData;