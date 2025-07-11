import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="p-2 md:p-0 min-h-screen bg-gradient-to-br from-orange-100 via-white to-orange-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center transition-colors">
      <div className="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-100 shadow-2xl rounded-3xl p-10 max-w-lg w-full flex flex-col items-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Expense Tracker Logo"
          className="w-24 h-24 mb-4"
        />
        <h1 className="text-4xl font-extrabold text-orange-600 dark:text-orange-400 mb-2 text-center">
          Welcome to Expense Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          Take control of your finances. Track your income, expenses, and savings with ease.
        </p>
        <div className="flex gap-4 w-full justify-center">
          <Link to="/login">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow transition">
              Login
            </button>
          </Link>
          <Link to="/signUp">
            <button className="bg-white dark:bg-gray-700 border border-blue-500 text-blue-600 dark:text-blue-400 font-semibold py-2 px-6 rounded-full shadow hover:bg-orange-50 dark:hover:bg-gray-600 transition">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
      <footer className="mt-10 text-gray-400 dark:text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
