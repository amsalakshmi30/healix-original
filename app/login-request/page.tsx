"use client";

import React from "react";
import Link from "next/link";

export default function LoginRequest() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-[#0F62FE]">
          <svg className="w-8 h-8 text-[#0F62FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Healix</span>
        </Link>
        <div className="flex items-center gap-8 text-sm font-medium text-slate-500">
          <Link href="/#services" className="hover:text-slate-900">Services</Link>
          <Link href="/#how-it-works" className="hover:text-slate-900">How It Works</Link>
          <Link href="/#faqs" className="hover:text-slate-900">FAQ</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Welcome to your wellness <br /> journey.
          </h1>
          <p className="text-slate-500 text-base leading-relaxed">
            Choose your path to begin. Healix connects medical professionals with patients through a seamless, futuristic experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Patient Path Card */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300 group">
            {/* Visual Illustration Simulator for Patient */}
            <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-slate-100 flex items-center justify-center mb-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 flex flex-wrap gap-2 p-4">
                {Array.from({ length: 40 }).map((_, idx) => (
                  <div key={idx} className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                ))}
              </div>
              
              {/* Modern Flat Icon Simulation for Patient */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full bg-blue-100 text-[#0F62FE] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div className="bg-[#0F62FE] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  Active Health File
                </div>
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Continue as Patient</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm">
              Access your personal health records, book appointments, and chat with your medical team.
            </p>
            <Link 
              href="/patient/login" 
              className="w-full bg-[#0F62FE] hover:bg-[#0353E9] text-white font-semibold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              Enter Portal
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </div>

          {/* Doctor Path Card */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300 group">
            {/* Visual Illustration Simulator for Doctor */}
            <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-slate-100 flex items-center justify-center mb-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 flex flex-wrap gap-2 p-4">
                {Array.from({ length: 40 }).map((_, idx) => (
                  <div key={idx} className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                ))}
              </div>
              
              {/* Modern Flat Icon Simulation for Practitioner */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#008A5E] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div className="bg-[#008A5E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  Verified Practitioner
                </div>
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Continue as Doctor</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm">
              Manage your practice, review patient analytics, and provide world-class virtual care.
            </p>
            <Link 
              href="/doctor/login" 
              className="w-full bg-[#006044] hover:bg-[#004d36] text-white font-semibold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              Practitioner Login
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </Link>
          </div>
        </div>

        <div className="mt-12 text-slate-400 text-xs">
          Already have an account? <Link href="/patient/login" className="text-[#0F62FE] hover:underline font-semibold">Sign in here</Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8 px-6 mt-12">
        <div className="max-w-5xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0F62FE] text-sm">Healix</span>
            <span>© 2026 Healix Healthcare. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
