'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MdHome, MdPieChart, MdSettings, MdOutlineCases, MdAccountCircle } from "react-icons/md";

// Removed placeholder SVGs

export default function Header({ currentPage, setCurrentPage }) {
  const handleIconClick = (iconName) => {
    setCurrentPage(iconName);
  };

  return (
    <header className="py-4 px-6 flex justify-between items-center">
      {/* Left section: App Name */}
      <div className="flex items-center">
        <MdOutlineCases className="w-8 h-8 mr-3 text-gray-900 dark:text-gray-100" />
        <span className="text-3xl font-bold text-gray-900 dark:text-gray-800">Inbox Hire</span>
      </div>

      {/* Center section: Menu Icons */}
      <div className="flex items-center space-x-6 flex-grow justify-center">
        <button className="p-2 rounded-full transition-transform duration-200 transform hover:scale-110" onClick={() => handleIconClick('home')}>
          <div className={`p-2 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center transition-colors duration-200 ${currentPage === 'home' ? 'bg-black dark:bg-white' : 'bg-transparent'}`}>
             <MdHome className={`w-6 h-6 ${currentPage === 'home' ? 'text-white dark:text-black' : 'text-gray-900 dark:text-gray-100'}`} />
          </div>
        </button>
        <button className="p-2 rounded-full transition-transform duration-200 transform hover:scale-110" onClick={() => handleIconClick('chart')}>
           <div className={`p-2 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center transition-colors duration-200 ${currentPage === 'chart' ? 'bg-black dark:bg-white' : 'bg-transparent'}`}>
            <MdPieChart className={`w-6 h-6 ${currentPage === 'chart' ? 'text-white dark:text-black' : 'text-gray-900 dark:text-gray-100'}`} />
           </div>
        </button>
        <button className="p-2 rounded-full transition-transform duration-200 transform hover:scale-110" onClick={() => handleIconClick('settings')}>
           <div className={`p-2 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center transition-colors duration-200 ${currentPage === 'settings' ? 'bg-black dark:bg-white' : 'bg-transparent'}`}>
             <MdSettings className={`w-6 h-6 ${currentPage === 'settings' ? 'text-white dark:text-black' : 'text-gray-900 dark:text-gray-100'}`} />
           </div>
        </button>
      </div>

      {/* Right section: Profile Icon */}
      <div className="flex items-center">
        <button className="p-2 rounded-full transition-transform duration-200 transform hover:scale-110">
          <div className="p-2 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <MdAccountCircle className="w-8 h-8 text-gray-900 dark:text-gray-100" />
          </div>
        </button>
      </div>
    </header>
  );
} 