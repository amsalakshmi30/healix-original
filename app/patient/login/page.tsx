"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import { supabase } from "@/lib/supabase";

export default function PatientLogin() {
  const { login, isLoggedIn, user } = useApp();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  // Redirect if already logged in (no await inside useEffect)
  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.type === "patient") {
        router.push("/patient/dashboard");
      } else {
        router.push("/doctor/dashboard");
      }
    }
  }, [isLoggedIn, user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        // Sign up logic
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: email.split("@")[0] || "Patient",
              type: "patient",
              role: "patient",
              phone_number: "+1 (555) 019-2834",
              age: 34,
              gender: "Female",
              avatar_url: "/sarah-jenkins.jpg",
            },
          },
        });
        if (signUpError) throw signUpError;
        alert("Registration successful! You can now log in.");
        setIsRegister(false);
      } else {
        // Sign in logic
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        
        // Ensure patient profile is fully populated with all required details
        if (signInData.user) {
          try {
            await supabase
              .from("profiles")
              .upsert({
                id: signInData.user.id,
                email: signInData.user.email,
                phone_number: "+1 (555) 019-2834",
                age: 34,
                gender: "Female",
                role: "patient",
                full_name: signInData.user.user_metadata?.name || email.split("@")[0] || "Patient"
              });
          } catch (updateErr) {
            console.error("Error populating profile fields:", updateErr);
          }
        }

        // Call login from AppContext
        login("patient", email, signInData.user?.user_metadata?.name || email.split("@")[0]);
        router.push("/patient/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Back Button */}
      <Link 
        href="/login-request" 
        className="absolute top-6 left-6 z-50 flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200/60 px-3.5 py-2 rounded-lg shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        Back to Options
      </Link>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        
        {/* Left Side: Brand Banner */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-12 flex-col justify-between relative overflow-hidden">
          {/* SVG shapes for background aesthetics */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10%" cy="20%" r="20%" fill="white" />
              <circle cx="90%" cy="80%" r="30%" fill="white" />
              <path d="M 0,200 Q 150,100 300,200 T 600,200" fill="none" stroke="white" strokeWidth="4" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-2xl font-bold">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Healix</span>
          </div>

          <div className="relative z-10 flex flex-col gap-6 max-w-sm mb-12">
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
              Your health journey, simplified.
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Access your medical history, book consultations, and manage prescriptions through our secure, patient-first platform.
            </p>
            
            {/* Social Avatars Pile */}
            <div className="flex flex-col gap-3 mt-4 pt-6 border-t border-blue-500/40">
              <div className="flex -space-x-2 overflow-hidden">
                {["/sarah-jenkins.jpg", "/doc-sarah.jpg", "/doc-julianne.jpg"].map((url, idx) => (
                  <div key={idx} className="inline-block h-8 w-8 rounded-full ring-2 ring-blue-700 bg-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-800">
                    {idx === 0 ? "SJ" : idx === 1 ? "DC" : "JS"}
                  </div>
                ))}
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-blue-700 bg-blue-500 text-white flex items-center justify-center font-bold text-[10px]">
                  +2k
                </div>
              </div>
              <p className="text-xs text-blue-100 font-medium">Join over 2,000 patients receiving premium care today.</p>
            </div>
          </div>

          <div className="relative z-10 text-xs text-blue-200">
            © 2026 Healix Healthcare. Secure Patient Portal.
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:col-span-7 flex flex-col justify-center px-6 sm:px-16 py-20 bg-white">
          <div className="max-w-md w-full mx-auto flex flex-col gap-8">
            
            {/* Tabs Selector */}
            <div className="flex gap-1.5 p-1 bg-slate-100 rounded-lg w-fit">
              <button 
                type="button"
                onClick={() => setIsRegister(false)}
                className={`${!isRegister ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"} text-sm font-semibold px-6 py-2 rounded-md transition-all`}
              >
                Login
              </button>
              <button 
                type="button"
                onClick={() => setIsRegister(true)}
                className={`${isRegister ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"} text-sm font-semibold px-6 py-2 rounded-md transition-all`}
              >
                Register
              </button>
            </div>

            {/* Intro */}
            <div>
              <h3 className="text-2xl font-bold text-slate-950">{isRegister ? "Create Account" : "Welcome Back"}</h3>
              <p className="text-slate-400 text-sm mt-1">{isRegister ? "Register a new patient account to get started." : "Please enter your details to access your account."}</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 text-xs p-3 rounded-lg font-medium">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="email-input">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </span>
                  <input
                    type="email"
                    id="email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#0F62FE]"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700" htmlFor="password-input">Password</label>
                  {!isRegister && <a href="#" className="text-xs font-bold text-[#0F62FE] hover:underline">Forgot Password?</a>}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </span>
                  <input
                    type="password"
                    id="password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#0F62FE]"
                    required
                  />
                </div>
              </div>

              {/* Remember checkbox */}
              {!isRegister && (
                <div className="flex items-center gap-2.5 py-1">
                  <input
                    type="checkbox"
                    id="remember-checkbox"
                    className="w-4 h-4 rounded text-[#0F62FE] focus:ring-[#0F62FE] border-slate-300"
                    defaultChecked
                  />
                  <label htmlFor="remember-checkbox" className="text-xs font-semibold text-slate-500">
                    Remember me for 30 days
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0F62FE] hover:bg-[#0353E9] text-white font-semibold text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all mt-2 shadow-sm disabled:bg-blue-400"
              >
                {loading ? "Authenticating..." : isRegister ? "Register" : "Get Started"}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </form>

            {/* Alternative Login */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-[1px] bg-slate-100 flex-1" />
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Or continue with</span>
                <div className="h-[1px] bg-slate-100 flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 transition-colors">
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.437-2.883-6.437-6.438a6.442 6.442 0 016.437-6.437c1.616 0 3.078.595 4.217 1.57l3.208-3.208A10.742 10.742 0 0012.24 2C6.594 2 2 6.594 2 12.24c0 5.647 4.594 10.24 10.24 10.24 5.903 0 10.24-4.148 10.24-10.24 0-.685-.06-1.354-.171-1.955H12.24z"/></svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 transition-colors">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
                  Facebook
                </button>
              </div>
            </div>

            {/* Footer links */}
            <div className="flex flex-wrap justify-between text-[11px] text-slate-400 mt-6 pt-6 border-t border-slate-100">
              <Link href="#" className="hover:underline">Privacy Policy</Link>
              <Link href="#" className="hover:underline">Contact Support</Link>
              <Link href="#" className="hover:underline">System Status</Link>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
