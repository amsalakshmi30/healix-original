"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";

export default function DoctorWaitingRoom() {
  const { logout, activeConsultationPatient } = useApp();
  const router = useRouter();

  // Fallback patient
  const pat = activeConsultationPatient || {
    name: "Liam Chen",
    age: 34,
    gender: "Male",
    id: "HX-88291"
  };

  const handleAdmit = () => {
    router.push("/doctor/video-call");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Link href="/doctor/dashboard" className="flex items-center gap-2 text-2xl font-bold text-[#0F62FE]">
            <svg className="w-8 h-8 text-[#0F62FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Healix Provider</span>
          </Link>
          <span className="bg-emerald-50 text-[#008A5E] text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-100 uppercase">
            🛡️ Telehealth Session
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/doctor/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-800">
            Exit to Dashboard
          </Link>
          <button onClick={logout} className="text-xs font-bold text-red-600 hover:underline">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Console */}
      <main className="max-w-4xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-6 justify-center items-center">
        
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center flex flex-col items-center gap-6 py-12 max-w-lg w-full">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0F62FE] flex items-center justify-center text-2xl shrink-0 shadow-inner">
            👨‍⚕️
          </div>

          <div>
            <span className="bg-blue-50 text-[#0F62FE] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
              Patient Waiting
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-3">{pat.name} is in waiting room</h3>
            <p className="text-xs text-slate-400 mt-1">Ready to initiate virtual check-up consultation.</p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 w-full text-left flex flex-col gap-2.5 text-xs font-semibold text-slate-600">
            <div className="flex justify-between">
              <span>Patient Name</span>
              <span className="text-slate-900 font-bold">{pat.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Vitals Status</span>
              <span className="text-emerald-600 font-bold">Stable (BP: 120/80, HR: 72)</span>
            </div>
            <div className="flex justify-between border-t border-slate-200/50 pt-2.5 mt-1">
              <span>Consult Room ID</span>
              <span className="text-[#0F62FE] font-mono font-bold uppercase">{pat.id}</span>
            </div>
          </div>

          <button
            onClick={handleAdmit}
            className="w-full bg-[#0F62FE] hover:bg-[#0353E9] text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm text-center flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            Admit Patient & Start Consultation
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-400">
        © 2026 Healix Healthcare. All rights reserved.
      </footer>
    </div>
  );
}
