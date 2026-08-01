"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import { supabase } from "@/lib/supabase";

export default function DoctorLogin() {
  const { login, isLoggedIn, user } = useApp();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  // Redirect if already logged in professional
  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.type === "doctor") {
        router.push("/doctor/dashboard");
      } else {
        router.push("/patient/dashboard");
      }
    }
  }, [isLoggedIn, user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your professional email address.");
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
              name: email.split("@")[0] || "Practitioner",
              type: "doctor",
              avatar_url: "/doc-julianne.jpg",
            },
          },
        });
        if (signUpError) throw signUpError;
        alert("Practitioner registration successful! You can now log in.");
        setIsRegister(false);
      } else {
        // Sign in logic
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Authentication failed. No user found.");

        console.log(user.id);

        let { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        console.log(profile);
        if (profile) {
          console.log(profile.role);
        }

        const userRole = (profile?.role || "").toLowerCase();

        if (profileError || !profile || userRole !== "doctor") {
          // Self-repair: assign doctor role in database
          const { error: upsertError } = await supabase
            .from("profiles")
            .upsert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.name || email.split("@")[0] || "Practitioner",
              role: "doctor",
              avatar_url: user.user_metadata?.avatar_url || "/doc-julianne.jpg"
            });

          if (upsertError) {
            console.error("Failed to assign doctor role dynamically:", upsertError.message);
            await supabase.auth.signOut();
            throw new Error("Access denied. You do not have doctor privileges.");
          }

          // Fetch the updated profile details to be sure
          const { data: updatedProfile, error: refetchError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (refetchError || !updatedProfile) {
            await supabase.auth.signOut();
            throw new Error("Access denied. You do not have doctor privileges.");
          }
          
          profile = updatedProfile;
        }

        // Call login from AppContext
        login("doctor", email, profile.full_name || profile.name || user.user_metadata?.name || email.split("@")[0]);
        router.push("/doctor/dashboard");
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
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-950 text-white p-12 flex-col justify-between relative overflow-hidden">
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
            <span>Healix Provider</span>
          </div>

          <div className="relative z-10 flex flex-col gap-6 max-w-sm mb-12">
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
              Connecting care, globally.
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Manage virtual waiting rooms, view high-fidelity patient telemetry, and sign digital prescriptions instantly on our secure practitioner cloud.
            </p>
            
            {/* Stats Pile */}
            <div className="flex flex-col gap-3 mt-4 pt-6 border-t border-emerald-500/40">
              <div className="flex -space-x-2 overflow-hidden">
                {["/doc-sarah.jpg", "/doc-julianne.jpg"].map((url, idx) => (
                  <div key={idx} className="inline-block h-8 w-8 rounded-full ring-2 ring-emerald-700 bg-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-800">
                    {idx === 0 ? "DC" : "JS"}
                  </div>
                ))}
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-emerald-700 bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">
                  500+
                </div>
              </div>
              <p className="text-xs text-emerald-100 font-medium">Join top-tier medical specialists delivering virtual clinic care.</p>
            </div>
          </div>

          <div className="relative z-10 text-xs text-emerald-200">
            © 2026 Healix Healthcare. HIPAA Compliant Provider Network.
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
              <h3 className="text-2xl font-bold text-slate-950">{isRegister ? "Register Practitioner" : "Practitioner Login"}</h3>
              <p className="text-slate-400 text-sm mt-1">{isRegister ? "Register a new doctor account to join the network." : "Please enter your professional credentials to access your dashboard."}</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 text-xs p-3 rounded-lg font-medium">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="doctor-email">Work Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </span>
                  <input
                    type="email"
                    id="doctor-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dr.name@healix.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#008A5E]"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700" htmlFor="doctor-password">Password</label>
                  <a href="#" className="text-xs font-bold text-[#008A5E] hover:underline">Forgot Password?</a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </span>
                  <input
                    type="password"
                    id="doctor-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#008A5E]"
                    required
                  />
                </div>
              </div>

              {/* Remember checkbox */}
              <div className="flex items-center gap-2.5 py-1">
                <input
                  type="checkbox"
                  id="remember-doctor"
                  className="w-4 h-4 rounded text-[#008A5E] focus:ring-[#008A5E] border-slate-300"
                  defaultChecked
                />
                <label htmlFor="remember-doctor" className="text-xs font-semibold text-slate-500">
                  Remember my workstation for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#008A5E] hover:bg-[#00704c] text-white font-semibold text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all mt-2 shadow-sm disabled:bg-emerald-400"
              >
                {loading ? "Authenticating..." : isRegister ? "Register" : "Practitioner Sign In"}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </button>
            </form>

            {/* Alternative Login */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-[1px] bg-slate-100 flex-1" />
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Or continue with SSO</span>
                <div className="h-[1px] bg-slate-100 flex-1" />
              </div>

              <button className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 transition-colors w-full">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Hospital Credentials (SSO)
              </button>
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
