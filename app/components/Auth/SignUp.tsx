'use client';

import React, { FC, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { styles } from '../../../app/styles/style';
import { useFormik } from 'formik';
import { useRegisterMutation } from '@/redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { userRegistration } from '@/redux/features/auth/authSlice';
import toast from 'react-hot-toast';

type Props = { setRoute: (route: string) => void };

const schema = Yup.object().shape({
  name: Yup.string().required('Please enter your name!'),
  email: Yup.string().email('Invalid email').required('Please enter your email!'),
  password: Yup.string().required('Please enter your password!').min(6, 'Password must be at least 6 characters'),
});

const Signup: FC<Props> = ({ setRoute }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [register, { data, error, isSuccess, isLoading }] = useRegisterMutation();

  // Handle registration response
  useEffect(() => {
    if (isSuccess && data) {
      if (data.success) {
        toast.success(data.message || 'Registration successful');
        if (data.activationToken) {
          localStorage.setItem('token', data.activationToken);
          dispatch(userRegistration({ token: data.activationToken }));
          setTimeout(() => setRoute('Verification'), 1500);
        } else toast.error('Activation token missing');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    }

    if (error) {
      // TIMEOUT / NETWORK / BACKEND errors
      if ('status' in error && error.status === 'TIMEOUT_ERROR') {
        toast.error('Server is waking up, please wait 30-60s and try again');
      } else if ('status' in error && error.status === 'FETCH_ERROR') {
        toast.error('Cannot connect to server. Check your network or server URL');
      } else if ('data' in error && error.data) {
        const errData = error.data as any;
        toast.error(errData.message || 'Registration failed');
        if (errData.activationToken) {
          localStorage.setItem('token', errData.activationToken);
          dispatch(userRegistration({ token: errData.activationToken }));
          setTimeout(() => setRoute('Verification'), 1500);
        }
      } else {
        toast.error('Registration failed');
      }
    }
  }, [isSuccess, data, error, dispatch, setRoute]);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema: schema,
    onSubmit: async (values) => {
      await register(values);
    },
  });

  const { values, errors, touched, handleChange, handleSubmit } = formik;

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

      <form onSubmit={handleSubmit}>
        <div className="mt-4">
          <label className={`${styles.label}`}>Enter Your Name</label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            className={`${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'} ${styles.input}`}
          />
          {errors.name && touched.name && <span className="text-red-500 text-sm">{errors.name}</span>}
        </div>

        <div className="mt-4">
          <label className={`${styles.label}`}>Email Address</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            className={`${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'} ${styles.input}`}
          />
          {errors.email && touched.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>

        <div className="mt-4 relative">
          <label className={`${styles.label}`}>Password</label>
          <input
            type={show ? 'text' : 'password'}
            name="password"
            value={values.password}
            onChange={handleChange}
            className={`${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'} ${styles.input}`}
          />
          <div className="absolute right-3 top-10 cursor-pointer text-gray-600" onClick={() => setShow(!show)}>
            {show ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
          </div>
          {errors.password && touched.password && <span className="text-red-500 text-sm">{errors.password}</span>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`${styles.button} w-full mt-6 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Signing up...
            </span>
          ) : (
            'Sign Up'
          )}
        </button>

        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => setRoute('Login')}>
            Sign In
          </span>
        </div>
      </form>
    </motion.div>
  );
};

export default Signup;
