// src/components/layout/Footer.tsx
import React from 'react';
import { Briefcase } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Briefcase className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-lg font-bold text-gray-900">
              JobBoard
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-sm text-gray-600">
              © 2024 JobBoard. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-700 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-700 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-700 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            This is a demo application built with React, Next.js, Redux Toolkit, and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;