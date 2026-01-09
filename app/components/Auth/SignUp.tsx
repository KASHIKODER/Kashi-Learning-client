'use client';

import React, { FC, useEffect, useState, useCallback } from 'react';
import * as Yup from 'yup';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { styles } from '@/app/styles/style';
import { useFormik } from 'formik';
import { useRegisterMutation } from '@/redux/features/auth/authApi';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setToken } from '@/redux/features/auth/authSlice';

type Props = {
  setOpen: (open: boolean) => void;
  setRoute?: (route: string) => void;
};

const schema = Yup.object().shape({
  name: Yup.string().required('Please enter your name!'),
  email: Yup.string().email('Invalid email').required('Please enter your email!'),
  password: Yup.string()
    .required('Please enter your password!')
    .min(6, 'Password must be at least 6 characters'),
});

const Signup: FC<Props> = ({ setOpen, setRoute }) => {
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [register, { data, error, isLoading: rtkLoading }] = useRegisterMutation();
  const dispatch = useDispatch();

  // Clear old tokens on mount
  useEffect(() => {
    localStorage.removeItem('pending_email');
    sessionStorage.removeItem('temp_activation_token');
  }, []);

  // Handle registration response
  useEffect(() => {
    console.log('🔄 Signup useEffect triggered:', { 
      hasData: !!data, 
      hasError: !!error, 
      isLoading: rtkLoading 
    });

    if (data && data.activationToken) {
      console.log('✅ Registration successful. Token:', data.activationToken.substring(0, 30) + '...');
      
      // 1. Store in Redux (immediate)
      dispatch(setToken(data.activationToken));
      
      // 2. Store in localStorage (persistent)
      localStorage.setItem('activation_token', data.activationToken);
      
      // 3. Store email for reference
      const formEmail = localStorage.getItem('pending_email');
      if (formEmail) {
        localStorage.setItem('pending_email', formEmail);
      }
      
      // 4. Store in sessionStorage (session-only)
      sessionStorage.setItem('temp_activation_token', data.activationToken);
      
      toast.success(data.message || 'Registration successful! Check your email.');
      
      // Navigate to verification after short delay
      const timer = setTimeout(() => {
        if (setRoute) {
          setRoute('Verification');
        }
        setOpen(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }

    if (error) {
      console.error('🔴 Registration error:', error);
      setIsSubmitting(false);
      
      let errorMsg = 'Registration failed!';
      
      if ('status' in error) {
        if (error.status === 'TIMEOUT') {
          errorMsg = 'Request timed out. Please try again.';
        } else if (error.status === 'FETCH_ERROR') {
          errorMsg = 'Network error. Check your connection.';
        } else if (error.data && typeof error.data === 'object') {
          const errorData = error.data as any;
          errorMsg = errorData.message || errorData.error || errorMsg;
        }
      } else if ('data' in error && error.data) {
        const errorData = error.data as any;
        errorMsg = errorData.message || errorMsg;
      }
      
      toast.error(errorMsg);
    }
  }, [data, error, rtkLoading, dispatch, setRoute, setOpen]);

  // ✅ FIXED: Handle form submission
  const handleSubmit = useCallback(async (values: { name: string; email: string; password: string }) => {
    setIsSubmitting(true);
    
    // Clear any previous tokens
    localStorage.removeItem('activation_token');
    sessionStorage.removeItem('temp_activation_token');
    
    // Store email for reference
    localStorage.setItem('pending_email', values.email);
    
    console.log('🔄 Submitting registration for:', values.email);
    
    try {
      // Create a promise that rejects after 20 seconds
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Registration timeout after 20 seconds')), 20000);
      });

      // ✅ FIX: Properly call register with .unwrap()
      const registrationPromise = register({
        name: values.name,
        email: values.email,
        password: values.password,
      }).unwrap(); // This is CRITICAL!

      // Race the promises
      await Promise.race([
        registrationPromise,
        timeoutPromise
      ]);

      console.log('✅ Registration completed successfully');
      
    } catch (err: any) {
      console.error('🔴 Registration submission error:', err);
      
      // Check if it's a timeout error
      if (err.message === 'Registration timeout after 20 seconds') {
        toast.error('Registration taking too long. Please try again.');
        setIsSubmitting(false);
      }
      // Other errors are handled in the useEffect above
    }
  }, [register]);

  // Formik setup
  const formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema: schema,
    onSubmit: handleSubmit,
  });

  const { errors, touched, values, handleChange, handleSubmit: formikSubmit } = formik;
  
  // Combine loading states
  const loading = rtkLoading || isSubmitting;

  return (
    <motion.div
      className="w-full backdrop-blur-md bg-white/40 dark:bg-slate-800/40 p-6 rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className={`${styles.title}`}>
        Join to <span className="text-[#2190ff]">ELearning</span>
      </h1>

      <form onSubmit={formikSubmit} className="mt-4 space-y-4">
        {/* Name */}
        <div>
          <label className={`${styles.label}`} htmlFor="name">
            Enter Your Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={values.name}
            onChange={handleChange}
            disabled={loading}
            placeholder="Your Good Name"
            className={`${styles.input} ${
              errors.name && touched.name 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-[#2190ff] focus:ring-[#2190ff]'
            } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
          {errors.name && touched.name && (
            <span className="text-red-500 text-sm block mt-1">{errors.name}</span>
          )}
        </div>

        {/* Email */}
        <div>
          <label className={`${styles.label}`} htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={values.email}
            onChange={handleChange}
            disabled={loading}
            placeholder="Mail@gmail.com"
            className={`${styles.input} ${
              errors.email && touched.email 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-[#2190ff] focus:ring-[#2190ff]'
            } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
          {errors.email && touched.email && (
            <span className="text-red-500 text-sm block mt-1">{errors.email}</span>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <label className={`${styles.label}`} htmlFor="password">
            Password
          </label>
          <input
            type={show ? 'text' : 'password'}
            name="password"
            id="password"
            value={values.password}
            onChange={handleChange}
            disabled={loading}
            placeholder="••••••••"
            className={`${styles.input} ${
              errors.password && touched.password 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-[#2190ff] focus:ring-[#2190ff]'
            } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            disabled={loading}
            className="absolute right-3 top-[42px] text-gray-600 dark:text-gray-300 hover:text-[#2190ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
          </button>
          {errors.password && touched.password && (
            <span className="text-red-500 text-sm block mt-1">{errors.password}</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`${styles.button} w-full h-12 font-medium ${
            loading 
              ? 'opacity-70 cursor-not-allowed' 
              : 'hover:bg-[#1a7ae0] active:scale-[0.98] transition-transform'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Signing up...
            </div>
          ) : (
            'Sign Up'
          )}
        </button>

        {/* Status Info */}
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
          <p className="font-medium mb-1">Status:</p>
          <div className="space-y-1">
            <p className={loading ? 'text-yellow-600' : data ? 'text-green-600' : 'text-gray-600'}>
              {loading ? '⏳ Processing...' : data ? '✅ Registration successful' : '🟢 Ready to submit'}
            </p>
            {data?.activationToken && (
              <p className="text-green-600 text-xs">
                Token received ({data.activationToken.length} chars)
              </p>
            )}
            {error && (
              <p className="text-red-600 text-xs">
                Error: {('status' in error ? error.status : 'Unknown error')}
              </p>
            )}
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default Signup;