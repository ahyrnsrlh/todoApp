"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AuthForm as AuthFormType } from "@/types/auth";
import AuthForm from "../components/AuthForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleAuth = async (formData: AuthFormType) => {
    try {
      setError(null);
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        toast({
          title: "Registration successful",
          description: "Check your email for the confirmation link!",
        });
        setError("Check your email for the confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        router.push("/");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "An error occurred");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
      // No need to redirect as Supabase OAuth will handle it
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "An error occurred with Google login");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred with Google login",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
          {mode === "login" ? "Welcome back!" : "Create your account"}
        </h1>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-xl">
              {mode === "login"
                ? "Sign in to your account"
                : "Create a new account"}
            </CardTitle>
            <CardDescription className="text-blue-100">
              {mode === "login"
                ? "Enter your credentials to access your account"
                : "Fill in the details to create your account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <div className="mb-4 p-4 text-sm rounded-md bg-red-50 text-red-500 border border-red-200">
                {error}
              </div>
            )}

            <AuthForm
              onSubmit={handleAuth}
              type={mode}
              onGoogleLogin={handleGoogleLogin}
            />

            <div className="mt-4 text-center">
              <button
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                {mode === "login"
                  ? "Don't have an account? Register"
                  : "Already have an account? Login"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
