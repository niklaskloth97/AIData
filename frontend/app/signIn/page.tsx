// pages/LoginPage.tsx
import React from 'react';
import Footer from "@/components/footer";

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
      <Footer />
    </div>
  );
};

export default LoginPage;
