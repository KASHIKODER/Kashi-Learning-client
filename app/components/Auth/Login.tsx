'use client';
import React, { FC, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import { styles } from '../../../app/styles/style';
import { useFormik } from 'formik';
import { useLoginMutation } from '@/redux/features/auth/authApi';
import { toast } from 'react-hot-toast';
import { signIn } from "next-auth/react";

type Props = {
  setOpen: (open: boolean) => void;
  setRoute?: (route: string) => void;
};

const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Please enter your email!'),
  password: Yup.string().required('Please enter your password!').min(6),
});

const Login: FC<Props> = ({ setRoute , setOpen }) => {
  const [show, setShow] = useState(false);
  const [login , {isSuccess , error, data}] = useLoginMutation();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      setLoading(true);
      await login({email , password})
      // fake delay for realism
      await new Promise((res) => setTimeout(res, 1500));
      setLoading(false);
    },
  });

   // ✅ Handle mutation result (success & error)
  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data.message || 'Login Successfully!');
      setOpen(false);
    }

    if (error && 'data' in error) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || 'Something went wrong!');
    }
  }, [isSuccess, error, data, setOpen, setRoute]);

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <motion.div
      className="w-full backdrop-blur-md bg-white/40 dark:bg-slate-800/40 p-6 rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className={`${styles.title}`}>Login with <span className="text-[#2190ff]">ELearning</span></h1>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Email */}
        <div>
          <label className={`${styles.label}`} htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            id="email"
            placeholder="loginmail@gmail.com"
            className={`${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'} ${styles.input}`}
          />
          {errors.email && touched.email && (
            <span className="text-red-500 pt-2 block text-sm">{errors.email}</span>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <label className={`${styles.label}`} htmlFor="password">
            Enter Your Password
          </label>
          <input
            type={!show ? 'password' : 'text'}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="••••••••"
            className={`${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'} ${styles.input}`}
          />
          <div
            className="absolute right-3 top-[42px] cursor-pointer text-gray-600 dark:text-gray-300 hover:text-[#2190ff] transition-all"
            onClick={() => setShow(!show)}
          >
            {show ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
          </div>
          {errors.password && touched.password && (
            <span className="text-red-500 pt-2 block text-sm">{errors.password}</span>
          )}
        </div>

        {/* Remember me + Forgot */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <input type="checkbox" className="accent-[#2190ff]" />
            Remember me
          </label>
          <button
            type="button"
            className="text-[#2190ff] hover:underline"
            onClick={() => setRoute?.('Forgot-Password')}
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`${styles.button} transition-all duration-300 hover:bg-[#1a7ae0] disabled:opacity-70`}
        >
          {loading ? (
            <motion.div
              className="flex items-center justify-center gap-2"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Logging in...
            </motion.div>
          ) : (
            'Login'
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center justify-center mt-6">
          <div className="h-[1px] w-1/3 bg-gray-300 dark:bg-gray-600" />
          <span className="px-2 text-gray-500 dark:text-gray-400 text-sm">OR</span>
          <div className="h-[1px] w-1/3 bg-gray-300 dark:bg-gray-600" />
        </div>

        {/* Social Login */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer bg-white dark:bg-slate-700 rounded-full shadow p-2"
            onClick={() => signIn("google")}
          >
            <FcGoogle size={28} 
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer bg-white dark:bg-slate-700 rounded-full shadow p-2"
          >
            <AiFillGithub size={28} className="text-black dark:text-white" onClick={()=> signIn("github")}/>
          </motion.div>
        </div>

        {/* Signup link */}
        <p className="text-center text-sm text-gray-700 dark:text-gray-300 mt-6">
          Don’t have an account?{' '}
          <span
            className="text-[#2190ff] hover:underline cursor-pointer"
            onClick={() => setRoute?.('Signup')}
          >
            Sign up
          </span>
        </p>
      </form>
    </motion.div>
  );
};

export default Login;
