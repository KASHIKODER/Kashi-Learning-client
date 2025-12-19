'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  alpha,
  Grid
} from '@mui/material';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  BookOpen,
  DollarSign,
  Activity
} from 'lucide-react';
import { useTheme as useNextTheme } from 'next-themes';
import UserAnalytics from '../Analytics/UserAnalytics';
import { useGetAllUsersQuery } from '@/redux/features/user/userApi';
import { useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi';
import { useGetAllOrdersQuery } from '@/redux/features/orders/ordersApi';
import Loader from '../../Loader/Loader';

// Define proper TypeScript interfaces
interface Order {
  _id: string;
  courseId: string;
}

interface Course {
  _id: string;
  price: number;
}

interface User {
  _id: string;
}

interface UsersData {
  users?: User[];
}

interface CoursesData {
  courses?: Course[];
}

interface OrdersData {
  orders?: Order[];
}

const DashboardWidgets = () => {
  const { theme } = useNextTheme();
  const isDark = theme === 'dark';

  // Data queries with proper typing
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: coursesData, isLoading: coursesLoading } = useGetAllCoursesQuery({});
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersQuery({});

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalOrders: 0,
    totalRevenue: 0,
    userGrowth: 0,
    revenueGrowth: 0
  });

  useEffect(() => {
    if (usersData && coursesData && ordersData) {
      const typedUsersData = usersData as UsersData;
      const typedCoursesData = coursesData as CoursesData;
      const typedOrdersData = ordersData as OrdersData;

      const revenue = typedOrdersData.orders?.reduce((total: number, order: Order) => {
        const course = typedCoursesData.courses?.find((c: Course) => c._id === order.courseId);
        return total + (course?.price || 0);
      }, 0) || 0;

      setStats({
        totalUsers: typedUsersData.users?.length || 0,
        totalCourses: typedCoursesData.courses?.length || 0,
        totalOrders: typedOrdersData.orders?.length || 0,
        totalRevenue: revenue,
        userGrowth: 12.5,
        revenueGrowth: 8.3
      });
    }
  }, [usersData, coursesData, ordersData]);

  // Define IconComponent type
  type IconComponent = React.ComponentType<{
    size: number;
    color: string;
  }>;

  interface StatCardProps {
    title: string;
    value: number | string;
    icon: IconComponent;
    growth?: number;
    color: string;
  }

  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    growth,
    color
  }) => (
    <Card
      sx={{
        borderRadius: 3,
        background: isDark
          ? `linear-gradient(135deg, ${alpha(color, 0.2)} 0%, ${alpha(color, 0.05)} 100%)`
          : `linear-gradient(135deg, ${alpha(color, 0.15)} 0%, ${alpha(color, 0.02)} 100%)`,
        border: `1px solid ${alpha(color, 0.3)}`,
        backdropFilter: 'blur(20px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: `0 25px 50px ${alpha(color, 0.25)}`,
          border: `1px solid ${alpha(color, 0.5)}`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.5)})`,
        }
      }}
    >
      <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: '800',
                background: isDark
                  ? `linear-gradient(135deg, #fff 30%, ${color} 100%)`
                  : `linear-gradient(135deg, #1f2937 30%, ${color} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                fontSize: { xs: '1.75rem', sm: '2.25rem' }
              }}
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: isDark ? 'grey.300' : 'grey.600',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              {title}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: isDark
                ? `linear-gradient(135deg, ${alpha(color, 0.4)} 0%, ${alpha(color, 0.1)} 100%)`
                : `linear-gradient(135deg, ${alpha(color, 0.3)} 0%, ${alpha(color, 0.05)} 100%)`,
              border: `1px solid ${alpha(color, 0.3)}`,
              ml: 2
            }}
          >
            <Icon size={28} color={color} />
          </Box>
        </Box>
        {growth !== undefined && (
          <Chip
            icon={<TrendingUp size={14} />}
            label={`${growth >= 0 ? '+' : ''}${growth}%`}
            size="medium"
            sx={{
              background: `linear-gradient(135deg, ${alpha(color, 0.3)} 0%, ${alpha(color, 0.1)} 100%)`,
              color: color,
              fontWeight: '700',
              fontSize: '0.8rem',
              border: `1px solid ${alpha(color, 0.3)}`,
              height: '32px'
            }}
          />
        )}
      </CardContent>
    </Card>
  );

  interface AnalyticsCardProps {
    title: string;
    children: React.ReactNode;
    height?: number;
    icon?: IconComponent;
  }

  const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, children, height = 500, icon: Icon }) => (
    <Card
      sx={{
        borderRadius: 3,
        background: isDark
          ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.5) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'}`,
        backdropFilter: 'blur(20px)',
        p: 3,
        boxShadow: isDark 
          ? '0 20px 40px rgba(0, 0, 0, 0.3)'
          : '0 20px 40px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: isDark 
            ? '0 25px 50px rgba(0, 0, 0, 0.4)'
            : '0 25px 50px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        {Icon && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: isDark
                ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
                : 'linear-gradient(135deg, #3b82f6, #6366f1)',
            }}
          >
            <Icon size={20} color="white" />
          </Box>
        )}
        <Typography
          variant="h4"
          sx={{
            fontWeight: '700',
            background: isDark
              ? 'linear-gradient(135deg, #fff 0%, #60a5fa 100%)'
              : 'linear-gradient(135deg, #1f2937 0%, #3b82f6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.5rem'
          }}
        >
          {title}
        </Typography>
      </Box>
      <Box sx={{ height, minHeight: height }}>
        {children}
      </Box>
    </Card>
  );

  if (usersLoading || coursesLoading || ordersLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: isDark 
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <Loader />
      </Box>
    );
  }

  return (
    <Box sx={{
      height: '100vh',
      background: isDark
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      overflowY: 'auto',
      overflowX: 'hidden',
      scrollBehavior: 'smooth'
    }}
    >
      <Box sx={{ 
        p: { xs: 3, md: 4, lg: 6 },
        maxWidth: '100%',
        margin: '0 auto'
      }}>
        {/* Header */}
        <Box sx={{ mb: 8, textAlign: { xs: 'center', lg: 'left' } }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: '900',
              background: isDark
                ? 'linear-gradient(135deg, #fff 0%, #60a5fa 50%, #a78bfa 100%)'
                : 'linear-gradient(135deg, #1f2937 0%, #3b82f6 50%, #6366f1 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
              lineHeight: 1.1
            }}
          >
            Dashboard Overview
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: isDark ? 'grey.400' : 'grey.600',
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.25rem' },
              maxWidth: '600px',
              mx: { xs: 'auto', lg: 0 }
            }}
          >
            Real-time insights and analytics for your platform performance
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={Users}
              growth={stats.userGrowth}
              color="#3b82f6"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Total Courses"
              value={stats.totalCourses}
              icon={BookOpen}
              growth={5.2}
              color="#10b981"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={ShoppingCart}
              growth={15.7}
              color="#f59e0b"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              growth={stats.revenueGrowth}
              color="#ef4444"
            />
          </Grid>
        </Grid>

        {/* Main Analytics Section */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <AnalyticsCard title="User Analytics" height={600} icon={Users}>
              <UserAnalytics isDashboard={true} />
            </AnalyticsCard>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <AnalyticsCard title="Performance Metrics" height={600} icon={Activity}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, height: '100%', py: 2 }}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <CircularProgress
                      variant="determinate"
                      value={75}
                      size={120}
                      thickness={4}
                      sx={{
                        color: '#3b82f6',
                        mb: 2
                      }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h4" sx={{ fontWeight: '800', color: isDark ? 'white' : '#1f2937' }}>
                        75%
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: '700', mb: 1, color: isDark ? 'white' : '#1f2937' }}>
                    Performance Score
                  </Typography>
                  <Typography variant="body1" sx={{ color: isDark ? 'grey.400' : 'grey.600' }}>
                    Target achievement rate
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {[
                    { label: 'Active Users', value: '1.2K', color: 'primary' as const },
                    { label: 'Conversion Rate', value: '4.5%', color: 'success' as const },
                    { label: 'Avg. Order Value', value: '$89', color: 'warning' as const },
                    { label: 'Customer Satisfaction', value: '94%', color: 'info' as const },
                    { label: 'Monthly Growth', value: '+12%', color: 'secondary' as const }
                  ].map((item, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        p: 3, 
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        borderRadius: 3,
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                          transform: 'translateX(4px)'
                        }
                      }}
                    >
                      <Typography variant="body1" sx={{ 
                        fontWeight: '600',
                        color: isDark ? 'grey.300' : 'grey.700'
                      }}>
                        {item.label}
                      </Typography>
                      <Chip 
                        label={item.value} 
                        size="medium" 
                        color={item.color}
                        sx={{ 
                          fontWeight: '700',
                          fontSize: '0.9rem'
                        }} 
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </AnalyticsCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardWidgets;