import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, FileText, Home, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function Navigation() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-xl dark:text-white">CareerPredict</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                <Home className="h-4 w-4 mr-1" />
                Home
              </Link>
              <Link
                to="/predict"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <GraduationCap className="h-4 w-4 mr-1" />
                Placement Prediction
              </Link>
              <Link
                to="/resume"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <FileText className="h-4 w-4 mr-1" />
                Resume Matching
              </Link>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="relative w-16 h-8 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 rounded-full transform transition-transform duration-300 flex items-center justify-center ${
                theme === 'dark' ? 'translate-x-8 bg-gray-800' : 'translate-x-0 bg-yellow-500'
              }`}
            >
              {theme === 'dark' ? (
                <Moon className="h-4 w-4 text-gray-200" />
              ) : (
                <Sun className="h-4 w-4 text-white" />
              )}
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}