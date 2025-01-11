"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NavLogoHeader from "@/components/sidebar/nav-header-logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "example@hilti.com" && password === "password") {
      // Store login state
      sessionStorage.setItem("isLoggedIn", "true");
      router.push("/dashboard");
    } else {
      alert("Invalid credentials");
      setError("Invalid credentials");
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute object-contain h-auto w-auto top-0 left-0">
        <NavLogoHeader link="/" />
      </div>
      
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md bg-white p-4 rounded-lg border bg-card text-card-foreground shadow">
          <PageHeader
            heading="Login"
            subtext="Please enter your credentials to continue"
          />
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="text-sm text-red-500 text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>
            
            <Button type="submit" variant="destructive" className="w-full">
              Login with Hilti (SSO)
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
