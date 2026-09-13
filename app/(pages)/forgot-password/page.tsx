"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());

      toast.success("Password reset email sent!", {
        description: "Check your inbox and follow the instructions.",
      });

      setEmail("");
    } catch (error: any) {
      console.error(error);

      let message = "Something went wrong. Please try again.";

      switch (error?.code) {
        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;

        case "auth/user-not-found":
          message = "No account was found with this email.";
          break;

        case "auth/too-many-requests":
          message = "Too many attempts. Please try again later.";
          break;

        case "auth/network-request-failed":
          message = "Network error. Please check your internet connection.";
          break;
      }

      toast.error("Unable to reset password", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#171717] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center mb-5"
          >
            <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center">
              <span className="text-black text-xl font-bold">
                K
              </span>
            </div>
          </Link>

          <h1 className="text-2xl font-semibold text-white">
            Forgot your password?
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            No worries. Enter your email and we&apos;ll send you
            a link to reset your password.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800 bg-black p-6 sm:p-8 shadow-xl">

          <form onSubmit={handleResetPassword} className="space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-zinc-200"
              >
                Email address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />

                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                  className="h-11 pl-10 bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending reset link...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-zinc-500">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-zinc-300 hover:text-white underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}