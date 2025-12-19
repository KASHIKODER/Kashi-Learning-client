'use client';
import React from "react";
import {
  ComposedChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  Area,
} from "recharts";
import Loader from "../../Loader/Loader";
import { useGetUsersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { styles } from "@/app/styles/style";

// Define types for the analytics data
interface UserAnalyticsDataPoint {
  month: string;
  count: number;
}

interface AnalyticsData {
  name: string;
  uv: number;
}

interface UsersAnalyticsResponse {
  users: {
    last12Months: UserAnalyticsDataPoint[];
  };
}

interface UserAnalyticsProps {
  isDashboard?: boolean;
}

const UserAnalytics = ({ isDashboard = false }: UserAnalyticsProps) => {
  const { data, isLoading } = useGetUsersAnalyticsQuery({});
  const analyticsData: AnalyticsData[] = [];

  data &&
    (data as UsersAnalyticsResponse).users?.last12Months?.forEach((item: UserAnalyticsDataPoint) => {
      analyticsData.push({ name: item.month, uv: item.count });
    });

  const minValue = 0;

  // If it's dashboard mode, show a simplified version
  if (isDashboard) {
    return (
      <div className="h-full w-full">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={analyticsData}>
              <CartesianGrid
                strokeDasharray="3 3"
                strokeOpacity={0.3}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6B7280", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[minValue, "auto"]}
                tick={{ fill: "#6B7280", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="uv"
                stroke="#f59e0b"
                strokeWidth={1}
                fill="url(#areaGradient)"
                fillOpacity={0.2}
              />
              <Bar
                dataKey="uv"
                barSize={25}
                radius={[6, 6, 0, 0]}
                fill="url(#barGradient)"
              >
                <LabelList dataKey="uv" position="top" fill="#374151" fontSize={10} />
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  }

  // Original full version for non-dashboard use
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-start py-10 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 transition-all duration-300">
          {/* Heading */}
          <div className="w-full text-center mb-10">
            <h1 className={`${styles.title} text-4xl font-extrabold text-gray-800 dark:text-white`}>
              👥 User Analytics
            </h1>
            <p
              className={`${styles.label} text-gray-600 dark:text-gray-400 mt-2 md:ml-10 text-sm md:text-base`}
            >
              User growth insights from the last 12 months
            </p>
          </div>

          {/* Chart Container */}
          <div className="w-[95%] md:w-[85%] h-[70vh] bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-5 md:p-10 border border-gray-100 dark:border-gray-800">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={analyticsData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  strokeOpacity={0.3}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6B7280", fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[minValue, "auto"]}
                  tick={{ fill: "#6B7280", fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />

                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <Area
                  type="monotone"
                  dataKey="uv"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#areaGradient)"
                  fillOpacity={0.2}
                />
                <Bar
                  dataKey="uv"
                  barSize={35}
                  radius={[12, 12, 0, 0]}
                  fill="url(#barGradient)"
                >
                  <LabelList dataKey="uv" position="top" fill="#374151" />
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default UserAnalytics;