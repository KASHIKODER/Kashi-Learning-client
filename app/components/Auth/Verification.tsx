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
  const { token } = useSelector((state: RootState) => state.auth);
  const [activation,{isSuccess, error }] = useActivationMutation();
  const [invalidError, setInvalidError] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [VerifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: '',
    1: '',
    2: '',
    3: '',
  });

  useEffect(() => {
    if(isSuccess){
      toast.success("Account Activated Successfully");
      setRoute("Login");
      setOpen(false);
    };
    if (error && 'data' in error) {
      const errorData = error as { data?: { message?: string } };
      toast.error(errorData.data?.message || 'Something went wrong!');
      setInvalidError(true);
    } else if (error) {
      console.error('An error occurred: ', error);
    }
  },[isSuccess, error, setRoute,setOpen]);

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = { ...VerifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    // Auto move focus
    if (value === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const verificationHandler = async () => {
  if (!token) {
    toast.error("Please login first!");
    setRoute("Login");
    setOpen(true);
    return;
  }

  const verificationNumber = Object.values(VerifyNumber).join("");
  if (verificationNumber.length !== 4) {
    setInvalidError(true);
    return;
  }

  await activation({
    activation_token: token,
    activation_code: verificationNumber,
  });
};

  

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
        {Object.keys(VerifyNumber).map((key, index) => (
          <motion.input
            key={key}
            type="text"
            ref={inputRefs[index]}
            maxLength={1}
            value={VerifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className={`w-[60px] h-[60px] text-center text-[22px] font-semibold rounded-xl outline-none border-2 transition-all duration-300
              ${
                invalidError
                  ? 'border-red-500 animate-shake bg-red-50 dark:bg-red-950'
                  : 'border-gray-400 dark:border-gray-500 bg-transparent focus:border-[#2190ff]'
              } dark:text-white text-gray-900`}
          />
        ))}
      </div>

      <div className="w-full flex justify-center mt-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${styles.button} px-10 py-3 rounded-xl font-semibold shadow-md transition-all`}
          onClick={verificationHandler}
        >
          Verify OTP
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
