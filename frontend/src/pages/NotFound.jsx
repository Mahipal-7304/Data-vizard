import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-6xl font-bold text-indigo-600">404</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Page not found
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go back home
          </Link>
        </div>
        <div className="mt-8">
          <p className="text-sm text-gray-500">
            Or try these pages:
          </p>
          <div className="mt-2 space-x-4">
            <Link to="/dashboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Dashboard
            </Link>
            <Link to="/upload" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Upload
            </Link>
            <Link to="/profile" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;