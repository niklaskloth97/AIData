// pages/LoginPage.tsx
import React from 'react';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      {/* Login Form */}
      <div className="flex items-center justify-center flex-grow">
        <div className="bg-white shadow-lg rounded-md w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-center text-maroon-700">Login</h2>
          <p className="text-center text-gray-500">Sign in to your account</p>
          <form className="space-y-6 mt-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-user text-gray-400"></i>
                </span>
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-lock text-gray-400"></i>
                </span>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 text-white bg-maroon-700 rounded-md hover:bg-maroon-800 focus:outline-none"
            >
              Login!
            </button>
          </form>
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-maroon-600 hover:underline">
              I forgot my password. Click here to reset
            </a>
          </div>
          <div className="mt-4">
            <button className="w-full py-2 border border-maroon-700 text-maroon-700 rounded-md hover:bg-maroon-100">
              Register New Account
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-gray-300 py-10 px-5">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          {/* Contact Info Section */}
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center space-x-3">
              <i className="fas fa-envelope text-red-600"></i>
              <span>info@ercis.org</span>
            </div>
            <div className="flex items-center space-x-3">
              <i className="fas fa-phone text-red-600"></i>
              <span>+49 251 8338100</span>
            </div>
            <div className="flex items-center space-x-3">
              <i className="fas fa-map-marker-alt text-red-600"></i>
              <span>Leonardo-Campus 3, 48149 Münster Germany</span>
            </div>
            <div className="flex items-center space-x-3">
              <i className="fas fa-shopping-cart text-red-600"></i>
              <span>Merch</span>
            </div>
            <p className="pt-4">Hello from Europe. 👋</p>
          </div>

          {/* Logo Section */}
          <div className="mt-8 md:mt-0 text-center md:text-right">
            <div className="text-red-600 text-4xl font-bold">ERCIS</div>
            <p className="text-sm mt-2">European Research Center for Information Systems</p>
            <div className="mt-4">
              {/* Add a placeholder for a map or icon */}
              <div className="h-16 w-16 bg-gray-700 inline-block rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
