// pages/LoginPage.tsx
import React from 'react';
import Footer from "@/components/footer";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      {/* Login Form */}
      <div className="flex items-center justify-center flex-grow">
        <div className="bg-white shadow-lg rounded-md w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-left text-black-700">Login</h2>
          <p className="text-sm text-left pb-4 text-gray-600">Enter your email below to login to your account</p>
            <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Button className="w-full" variant="destructive">
                  Login with Hilti
                </Button>
              </div>
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-left pb-4 text-gray-900 hover:underline">
              Need any help? Click here
            </a>
          </div>
        </div>
      </div>

      {/* Footer - remove currently*/}

    </div>
  );
};

export default LoginPage;
