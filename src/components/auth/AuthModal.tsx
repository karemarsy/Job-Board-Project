// src/components/auth/AuthModal.tsx
'use client';

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  if (!isOpen) return null;

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="relative max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 z-10"
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        {mode === 'login' ? (
          <LoginForm onToggleForm={toggleMode} />
        ) : (
          <RegisterForm onToggleForm={toggleMode} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;