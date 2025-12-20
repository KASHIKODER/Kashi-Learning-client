'use client';
import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
} from "recharts";
import Loader from "../../Loader/Loader";
import { useGetOrdersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { styles } from "@/app/styles/style";

// Define proper types
interface OrderAnalyticsItem {
  month: string;
  count: number;
}

interface ChartDataItem {
  name: string;
  uv: number;
}

const OrdersAnalytics = () => {
  const { data, isLoading } = useGetOrdersAnalyticsQuery({});
  const analyticsData: ChartDataItem[] = [];

  if (data && data.orders?.last12Months) {
    data.orders.last12Months.forEach((item: OrderAnalyticsItem) => {
      analyticsData.push({ name: item.month, uv: item.count });
    });
  }

  const minValue = 0;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-start py-10 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 transition-all duration-300">
          {/* Heading */}
          <div className="w-full text-center mb-10">
            <h1 className={`${styles.title} text-4xl font-extrabold text-gray-800 dark:text-white`}>
              🛒 Order Analytics
            </h1>
            <p
              className={`${styles.label} text-gray-600 dark:text-gray-400 mt-2 md:ml-10 text-sm md:text-base`}
            >
              Order performance over the past year
            </p>
          </div>

          {/* Chart Container */}
          <div className="w-[95%] md:w-[85%] h-[70vh] bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-5 md:p-10 border border-gray-100 dark:border-gray-800">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
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
                  cursor={{ strokeDasharray: "3 3", stroke: "#3b82f6" }}
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />

                {/* Gradient fill under the line */}
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>

                {/* Area under the line */}
                <Area
                  type="monotone"
                  dataKey="uv"
                  stroke="none"
                  fill="url(#lineGradient)"
                  fillOpacity={1}
                />

                {/* Smooth line */}
                <Line
                  type="monotone"
                  dataKey="uv"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#3b82f6" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersAnalytics;