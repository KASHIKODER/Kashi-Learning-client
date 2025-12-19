'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
} from "recharts";
import Loader from "../../Loader/Loader";
import { useGetCoursesAnalyticsQuery } from '@/redux/features/analytics/analyticsApi';
import { styles } from '@/app/styles/style';

const CourseAnalytics = () => {
  const { data, isLoading } = useGetCoursesAnalyticsQuery({});

  const analyticsData =
    data?.courses?.last12Months?.map((item: any) => ({
      name: item.month,
      uv: item.count,
    })) || [];

  const minValue = 0;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <div className="mt-6 text-center md:text-left">
            <h1 className={`${styles.title} px-5 text-gray-900 dark:text-white`}>
              📊 Course Analytics
            </h1>
            <p className={`${styles.label} px-5 text-gray-600 dark:text-gray-400 ml-10`}>
              Insights from the last 12 months
            </p>
          </div>

          {/* Chart */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={analyticsData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ccc"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#8884d8' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[minValue, 'auto']}
                    tick={{ fill: '#8884d8' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      borderRadius: '10px',
                      border: 'none',
                      color: '#fff',
                    }}
                    cursor={{ fill: 'rgba(59,130,246,0.1)' }}
                  />
                  <Bar
                    dataKey="uv"
                    fill="url(#colorUv)"
                    radius={[12, 12, 0, 0]}
                    barSize={45}
                  >
                    <LabelList dataKey="uv" position="top" fill="#fff" />
                  </Bar>

                  {/* Gradient Fill */}
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.9} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseAnalytics;
