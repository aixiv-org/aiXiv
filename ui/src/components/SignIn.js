import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200',
              card: 'bg-white dark:bg-gray-800 shadow-lg rounded-lg',
              headerTitle: 'text-gray-900 dark:text-white',
              headerSubtitle: 'text-gray-600 dark:text-gray-400',
              socialButtonsBlockButton: 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600',
              formFieldInput: 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              formFieldLabel: 'text-gray-700 dark:text-gray-300',
              footerActionLink: 'text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300',
              dividerLine: 'bg-gray-300 dark:bg-gray-600',
              dividerText: 'text-gray-500 dark:text-gray-400',
            }
          }}
        />
      </div>
    </div>
  );
};

export default SignInPage; 