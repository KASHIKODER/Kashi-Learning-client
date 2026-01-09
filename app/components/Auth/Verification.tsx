'use client';
import { styles } from '@/app/styles/style';
import React, { FC, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { VscWorkspaceTrusted } from 'react-icons/vsc';
import { useActivationMutation } from '@/redux/features/auth/authApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

type Props = {
  setOpen: (open: boolean) => void;
  setRoute: (route: string) => void;
};

type VerifyNumber = {
  '0': string;
  '1': string;
  '2': string;
  '3': string;
};

const Verification: FC<Props> = ({ setOpen, setRoute }) => {
  // Get token from multiple sources
  const { token: reduxToken } = useSelector((state: RootState) => state.auth);
  const [activation, { isSuccess, error, isLoading }] = useActivationMutation();
  const [invalidError, setInvalidError] = useState(false);
  const [verificationError, setVerificationError] = useState('');

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

  // ✅ FIX: Handle activation response
  useEffect(() => {
    if (isSuccess) {
      toast.success('Account activated successfully!');
      
      // Clear stored tokens
      localStorage.removeItem('activation_token');
      localStorage.removeItem('pending_email');
      sessionStorage.removeItem('temp_activation_token');
      
      setRoute('Login');
      setOpen(false);
    }

    if (error) {
      console.error('🔴 Activation error:', error);
      
      let errorMsg = 'Activation failed!';
      
      if ('data' in error && error.data) {
        const errorData = error.data as any;
        if (errorData.message) {
          errorMsg = errorData.message;
          
          // Handle specific errors
          if (errorData.message.includes('expired') || errorData.message.includes('Invalid')) {
            errorMsg = 'Activation token expired. Please register again.';
            localStorage.removeItem('activation_token');
            localStorage.removeItem('pending_email');
            setRoute('Signup');
            setOpen(true);
          }
        }
      } else if ('status' in error && error.status === 'TIMEOUT') {
        errorMsg = 'Activation timeout. Please try again.';
      }
      
      toast.error(errorMsg);
      setVerificationError(errorMsg);
    }
  }, [isSuccess, error, setRoute, setOpen]);

  // ✅ FIX: Get token from multiple reliable sources
  const getActivationToken = () => {
    // 1. Check Redux first
    if (reduxToken) {
      console.log('✅ Using token from Redux');
      return reduxToken;
    }
    
    // 2. Check localStorage (primary storage)
    const localStorageToken = localStorage.getItem('activation_token');
    if (localStorageToken) {
      console.log('✅ Using token from localStorage');
      return localStorageToken;
    }
    
    // 3. Check sessionStorage
    const sessionStorageToken = sessionStorage.getItem('temp_activation_token');
    if (sessionStorageToken) {
      console.log('✅ Using token from sessionStorage');
      return sessionStorageToken;
    }
    
    // 4. Check old token key
    const oldToken = localStorage.getItem('token');
    if (oldToken) {
      console.log('✅ Using token from old localStorage key');
      return oldToken;
    }
    
    console.error('❌ No token found anywhere');
    return null;
  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    setVerificationError('');
    
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;
    
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    // Auto-focus next/previous
    if (value === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const verificationHandler = async () => {
    const verificationCode = Object.values(verifyNumber).join('');
    
    if (verificationCode.length !== 4) {
      toast.error('Please enter all 4 digits');
      setInvalidError(true);
      return;
    }

    // Get activation token
    const activationToken = getActivationToken();
    
    if (!activationToken) {
      toast.error('No activation token found. Please register again.');
      setRoute('Signup');
      setOpen(true);
      return;
    }

    console.log('🔄 Activating with token:', activationToken.substring(0, 30) + '...');
    console.log('🔄 Verification code:', verificationCode);

    try {
      // Manual timeout for activation
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Activation timeout')), 15000);
      });

      const activationPromise = activation({
        activation_token: activationToken,
        activation_code: verificationCode,
      });

      await Promise.race([activationPromise, timeoutPromise]);
      
    } catch (err: any) {
      console.error('🔴 Activation error:', err);
      
      if (err.message === 'Activation timeout') {
        toast.error('Activation timeout. Please try again.');
      }
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split('');
      const newVerifyNumber: VerifyNumber = {
        0: digits[0] || '',
        1: digits[1] || '',
        2: digits[2] || '',
        3: digits[3] || '',
      };
      setVerifyNumber(newVerifyNumber);
      inputRefs[3].current?.focus();
    }
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto backdrop-blur-lg bg-white/30 dark:bg-slate-800/30 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onPaste={handlePaste}
    >
      <h1 className={`${styles.title} text-center`}>
        Verify Your <span className="text-[#2190ff]">Account</span>
      </h1>

      <div className="w-full flex items-center justify-center mt-6">
        <div className="w-[85px] h-[85px] rounded-full bg-[#2190ff] flex items-center justify-center shadow-lg">
          <VscWorkspaceTrusted size={42} className="text-white" />
        </div>
      </div>

      <p className="text-center mt-6 text-gray-600 dark:text-gray-300">
        Enter the 4-digit code sent to your email
      </p>

      <div className="mt-10 flex items-center justify-center gap-4">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            key={key}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            ref={inputRefs[index]}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className={`w-[65px] h-[65px] text-center text-2xl font-bold rounded-xl outline-none border-2 transition-all duration-300
              ${invalidError || verificationError
                ? 'border-red-500 bg-red-50 dark:bg-red-950 animate-shake'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-[#2190ff] focus:ring-2 focus:ring-[#2190ff]/30'
              } dark:text-white`}
            disabled={isLoading}
          />
        ))}
      </div>

      {verificationError && (
        <p className="text-center mt-4 text-red-500 text-sm">{verificationError}</p>
      )}

      <div className="w-full flex justify-center mt-10">
        <button
          onClick={verificationHandler}
          disabled={isLoading || Object.values(verifyNumber).join('').length !== 4}
          className={`${styles.button} px-10 py-3 rounded-xl font-semibold shadow-md transition-all ${
            isLoading || Object.values(verifyNumber).join('').length !== 4
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-[#1a7ae0]'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying...
            </div>
          ) : (
            'Verify OTP'
          )}
        </button>
      </div>

      {/* Token Debug Info */}
      <div className="mt-8 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs">
        <p className="font-semibold mb-2">Token Sources:</p>
        <div className="space-y-1">
          <p>Redux: {reduxToken ? '✅ Available' : '❌ Not found'}</p>
          <p>LocalStorage: {localStorage.getItem('activation_token') ? '✅ Available' : '❌ Not found'}</p>
          <p>SessionStorage: {sessionStorage.getItem('temp_activation_token') ? '✅ Available' : '❌ Not found'}</p>
          <p>Pending Email: {localStorage.getItem('pending_email') || 'None'}</p>
          <p>Code Entered: {Object.values(verifyNumber).join('') || 'Empty'}</p>
        </div>
      </div>

      <div className="text-center pt-8">
        <span className="text-gray-600 dark:text-gray-300">
          Go back to{' '}
          <button
            onClick={() => setRoute('Login')}
            className="text-[#2190ff] hover:underline ml-1"
          >
            Sign in
          </button>
        </span>
      </div>
    </motion.div>
  );
};

export default Verification;