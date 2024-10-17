import React from 'react';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <AlertTriangle className="mx-auto h-24 w-24 text-orange-500" />
        <h1 className="mt-6 text-4xl font-extrabold text-gray-900 sm:text-5xl">
          404
        </h1>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-6">
          <button
            onClick={goBack}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;