'use client';
import { styles } from '@/app/styles/style';
import React, { FC, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { VscWorkspaceTrusted } from 'react-icons/vsc';
import { useActivationMutation } from '@/redux/features/auth/authApi';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setToken } from '@/redux/features/auth/authSlice';

type Props = {
  setRoute: (route: string) => void;
};

type VerifyNumber = {
  '0': string;
  '1': string;
  '2': string;
  '3': string;
};

const Verification: FC<Props> = ({ setRoute }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const [activation, { isSuccess, error, isLoading }] = useActivationMutation();
  const [invalidError, setInvalidError] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: '',
    1: '',
    2: '',
    3: '',
  });

  // Check if token exists when component mounts
  useEffect(() => {
    if (token && token.trim() !== '') {
      console.log('✅ Token found in Redux:', token.substring(0, 20) + '...');
      setCheckingToken(false);
    } else {
      // Try to get token from localStorage as fallback
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        console.log('🔍 Token found in localStorage, updating Redux...');
        dispatch(setToken(storedToken));
        setCheckingToken(false);
      } else {
        toast.error("No verification token found. Please sign up again.");
        setRoute('Signup');
      }
    }
  }, [token, dispatch, setRoute]);

  // Handle activation response
  useEffect(() => {
    if (isSuccess) {
      toast.success("Account Activated Successfully");
      setRoute("Login");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data?.message || 'Something went wrong!');
        setInvalidError(true);
      } else {
        toast.error('An error occurred');
      }
    }
  }, [isSuccess, error, setRoute]);

  const getVerifyNumberKey = (index: number): keyof VerifyNumber => {
    return index.toString() as keyof VerifyNumber;
  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);

    // Allow only numeric input
    const numericValue = value.replace(/\D/g, '');

    const key = getVerifyNumberKey(index);
    const newVerifyNumber = { ...verifyNumber, [key]: numericValue };
    setVerifyNumber(newVerifyNumber);

    // Auto move focus
    if (numericValue === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (numericValue.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && verifyNumber[getVerifyNumberKey(index)] === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const verificationHandler = async () => {
    const verificationCode = Object.values(verifyNumber).join("");
    
    // Debug logs
    console.log('🔍 Verification Code:', verificationCode);
    console.log('🔍 Current Token:', token);
    
    if (verificationCode.length !== 4) {
      setInvalidError(true);
      toast.error("Please enter a 4-digit verification code");
      return;
    }

    if (!token || token.trim() === '') {
      toast.error("No activation token found. Please sign up again.");
      setRoute('Signup');
      return;
    }

    console.log('🚀 Sending activation request with token:', token.substring(0, 20) + '...');
    
    try {
      await activation({
        activation_token: token,
        activation_code: verificationCode,
      }).unwrap();
    } catch (err: any) {
      console.error('Activation error:', err);
      // Error is already handled in the useEffect above
    }
  };

  // Show loading while checking token
  if (checkingToken) {
    return (
      <div className="w-full max-w-md mx-auto backdrop-blur-lg bg-white/30 dark:bg-slate-800/30 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2190ff] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading verification...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-md mx-auto backdrop-blur-lg bg-white/30 dark:bg-slate-800/30 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className={`${styles.title} text-center`}>
        Verify Your <span className="text-[#2190ff]">Account</span>
      </h1>

      <div className="w-full flex items-center justify-center mt-6">
        <motion.div
          className="w-[85px] h-[85px] rounded-full bg-[#2190ff] flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <VscWorkspaceTrusted size={42} className="text-white" />
        </motion.div>
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        {Object.keys(verifyNumber).map((key, index) => (
          <motion.input
            key={key}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            ref={inputRefs[index]}
            maxLength={1}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-[60px] h-[60px] text-center text-[22px] font-semibold rounded-xl outline-none border-2 transition-all duration-300
              ${invalidError
                ? 'border-red-500 bg-red-50 dark:bg-red-950'
                : 'border-gray-400 dark:border-gray-500 bg-transparent focus:border-[#2190ff]'
              } dark:text-white text-gray-900`}
            disabled={isLoading}
          />
        ))}
      </div>

      {invalidError && (
        <p className="text-center text-red-500 mt-4 text-sm">
          Please enter a valid 4-digit verification code
        </p>
      )}

      <div className="w-full flex justify-center mt-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
          className={`${styles.button} px-10 py-3 rounded-xl font-semibold shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed`}
          onClick={verificationHandler}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying...
            </div>
          ) : (
            'Verify OTP'
          )}
        </motion.button>
      </div>

      <h5 className="text-center pt-8 font-Poppins text-[15px] text-gray-700 dark:text-gray-300">
        Go back to Sign in?{' '}
        <span
          className="text-[#2190ff] pl-1 cursor-pointer hover:underline"
          onClick={() => setRoute('Login')}
        >
          Sign in
        </span>
      </h5>
    </motion.div>
  );
};

export default Verification;