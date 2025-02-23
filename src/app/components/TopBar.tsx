'use client';

import React from 'react';

const TopBar = () => {
  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center space-x-2">
            <span className="text-xl font-semibold text-gray-800 hover:text-gray-600 transition-colors">
              Home
            </span>
          </a>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Aquí puedes agregar más elementos de navegación si lo necesitas */}
        </div>
      </nav>
    </header>
  );
};

export default TopBar; 