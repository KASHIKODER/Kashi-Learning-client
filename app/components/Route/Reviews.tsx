import { styles } from '@/app/styles/style';
import Image from 'next/image';
import React, { useState } from 'react';
import ReviewCard from "../Review/ReviewCard";
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

type Props = object;

export const reviews = [
    {
        name: "Gene Bates",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        profession: "Student | Cambridge University",
        comment: "This platform transformed my learning journey! The courses are incredibly well-structured and the instructors are top-notch. I landed my dream job after completing the Full Stack Development program.",
        rating: 5,
        course: "Full Stack Development"
    },
    {
        name: "Verna Santos",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        profession: "Full Stack Developer | TechCorp",
        comment: "The quality of content exceeded my expectations. The hands-on projects and real-world scenarios helped me transition from beginner to professional developer in just 6 months.",
        rating: 5,
        course: "React Masterclass"
    },
    {
        name: "Alex Johnson",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        profession: "Data Scientist | AI Solutions",
        comment: "Outstanding learning platform! The AI and Machine Learning courses are comprehensive and up-to-date with industry standards. The community support is incredible.",
        rating: 4,
        course: "Machine Learning Pro"
    },
    {
        name: "Sarah Chen",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        profession: "UX Designer | DesignStudio",
        comment: "As a designer, I found the UI/UX courses incredibly valuable. The practical assignments and portfolio projects helped me showcase my skills effectively.",
        rating: 5,
        course: "UI/UX Design"
    },
    {
        name: "Mike Rodriguez",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg",
        profession: "DevOps Engineer | CloudTech",
        comment: "The DevOps curriculum is perfectly structured. From Docker to Kubernetes, every concept is explained with practical implementations. Highly recommended!",
        rating: 4,
        course: "DevOps Engineering"
    },
    {
        name: "Emily Watson",
        avatar: "https://randomuser.me/api/portraits/women/6.jpg",
        profession: "Mobile Developer | AppWorks",
        comment: "The mobile development courses are fantastic! I built my first app within weeks and now I'm working on complex projects. The mentorship program is exceptional.",
        rating: 5,
        course: "React Native"
    }
];

const Reviews = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredReviews = activeFilter === 'all' 
        ? reviews 
        : reviews.filter(review => 
            activeFilter === '5-stars' ? review.rating === 5 : review.rating === 4
        );

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 py-16">
            {/* Animated Background Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-float"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>

            <div className="relative w-[90%] 800px:w-[85%] m-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 mb-6"
                    >
                        <div className="flex items-center gap-1 text-yellow-500">
                            {[1,2,3,4,5].map((star) => (
                                <FaStar key={star} className="fill-current" size={16} />
                            ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Trusted by 10,000+ Students
                        </span>
                    </motion.div>

                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl 800px:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
                    >
                        What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Students</span> Say
                    </motion.h2>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
                    >
                        Don't just take our word for it. Hear from thousands of students who transformed their careers through our platform.
                    </motion.p>
                </div>

                {/* Stats Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
                >
                    {[
                        { number: '4.9/5', label: 'Average Rating' },
                        { number: '10K+', label: 'Students' },
                        { number: '95%', label: 'Completion Rate' },
                        { number: '24/7', label: 'Support' }
                    ].map((stat, index) => (
                        <div key={index} className="text-center p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                                {stat.number}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Filter Buttons */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="flex flex-wrap justify-center gap-4 mb-8"
                >
                    {[
                        { key: 'all', label: 'All Reviews' },
                        { key: '5-stars', label: '5 Stars' },
                        { key: '4-stars', label: '4 Stars' }
                    ].map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setActiveFilter(filter.key)}
                            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                                activeFilter === filter.key
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:shadow-md'
                            }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </motion.div>

                {/* Reviews Grid */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12"
                >
                    {filteredReviews.map((review, index) => (
                        <ReviewCard key={index} item={review} index={index} />
                    ))}
                </motion.div>

                {/* CTA Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                    
                    <h3 className="text-2xl 800px:text-3xl font-bold mb-4">
                        Ready to Start Your Journey?
                    </h3>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Join thousands of successful students and transform your career today.
                    </p>
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-lg">
                        Get Started Now
                    </button>
                </motion.div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

export default Reviews;