"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";

export default function PrescriptionSuccess() {
  const { user, logout } = useApp();
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Link href="/patient/dashboard" className="flex items-center gap-2 text-2xl font-bold text-[#0F62FE]">
            <svg className="w-8 h-8 text-[#0F62FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Healix</span>
          </Link>
          <span className="hidden md:inline text-xs font-semibold text-slate-400 border-l border-slate-200 pl-3">
            Digital Prescription
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/patient/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-800">
            Back to Dashboard
          </Link>
          <button onClick={logout} className="text-xs font-bold text-red-600 hover:underline">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-6">
        
        {/* Prescription Header controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Digital Prescription</h2>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Issued on Oct 24, 2024 • ID: AHX-9821-B</p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-bold w-full sm:w-auto">
            <button className="flex items-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-lg transition-colors">
              🖨️ Print
            </button>
            <button className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all">
              🛒 Order Medicines
            </button>
            <button className="flex items-center gap-1.5 bg-[#0F62FE] hover:bg-[#0353E9] text-white px-4 py-2 rounded-lg shadow-sm transition-all">
              📥 Download PDF
            </button>
          </div>
        </div>

        {/* Prescription Layout Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col gap-8 relative overflow-hidden">
          
          {/* Confident Label */}
          <div className="absolute top-8 right-8 text-right hidden sm:block">
            <span className="text-[8px] font-extrabold tracking-widest text-red-500 bg-red-50 px-2.5 py-1 rounded border border-red-200 uppercase">
              Strictly Confidential
            </span>
          </div>

          {/* Practitioner & Patient Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-slate-100">
            {/* Practitioner Details */}
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-base">
                ES
              </div>
              <div className="text-xs font-semibold">
                <h4 className="text-sm font-bold text-slate-900">Dr. Elena Sterling</h4>
                <p className="text-[#0F62FE] font-bold">Senior Cardiologist, MD</p>
                <p className="text-slate-400 text-[10px] mt-0.5">+1 (555) 234-0981</p>
              </div>
            </div>

            {/* Patient details */}
            <div className="text-xs font-semibold text-slate-500 md:text-right flex flex-col justify-center">
              <p className="text-slate-800 text-sm font-bold">Patient: {user?.name || "Alexander Vance"}</p>
              <p className="text-[10px] text-slate-400 mt-1 font-bold">Age: 42 • Sex: Male • Weight: 78kg</p>
              <p className="text-[10px] text-slate-400 font-bold">Condition: Post-Op Hypertension Management</p>
            </div>
          </div>

          {/* Rx Prescriptions Checklist */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              💊 Rx Prescriptions
            </h3>
            
            <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs font-semibold text-slate-600">
              
              {/* Item 1 */}
              <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h4 className="font-bold text-slate-900">Lisinopril 10mg</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">ACT Lisinopril - 30 Tablets</p>
                </div>
                <div className="flex gap-6 sm:text-right">
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Dosage</span>
                    <p className="text-slate-800 font-bold mt-0.5">1 Tablet Daily</p>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Duration</span>
                    <p className="text-slate-800 font-bold mt-0.5">30 Days</p>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h4 className="font-bold text-slate-900">Metformin 500mg</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Extended Release - 60 Capsules</p>
                </div>
                <div className="flex gap-6 sm:text-right">
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Dosage</span>
                    <p className="text-slate-800 font-bold mt-0.5">2 Times Daily</p>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Duration</span>
                    <p className="text-slate-800 font-bold mt-0.5">30 Days</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Smart Schedule Timetable */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                🪄 Smart Schedule
              </span>
              <span className="bg-blue-50 text-[#0F62FE] text-[8px] font-bold px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wide">
                AI Optimized
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold text-slate-500 mt-2">
              <div className="bg-white border border-slate-200/50 p-4 rounded-xl flex flex-col gap-2">
                <span className="text-[9px] uppercase font-bold text-amber-600 flex items-center gap-1">
                  ☀️ Morning (8 AM)
                </span>
                <p className="text-slate-800 font-bold">Lisinopril <span className="text-[9px] text-slate-400 font-medium font-sans">1 Tab</span></p>
                <p className="text-slate-800 font-bold">Metformin <span className="text-[9px] text-slate-400 font-medium font-sans">1 Tab</span></p>
              </div>

              <div className="bg-white border border-slate-200/50 p-4 rounded-xl flex flex-col gap-2 opacity-60">
                <span className="text-[9px] uppercase font-bold text-sky-600 flex items-center gap-1">
                  🌤️ Afternoon (2 PM)
                </span>
                <p className="text-slate-400 italic">No Medication due</p>
              </div>

              <div className="bg-white border border-slate-200/50 p-4 rounded-xl flex flex-col gap-2">
                <span className="text-[9px] uppercase font-bold text-indigo-600 flex items-center gap-1">
                  🌙 Night (9 PM)
                </span>
                <p className="text-slate-800 font-bold">Metformin <span className="text-[9px] text-slate-400 font-medium font-sans">1 Tab</span></p>
              </div>
            </div>
          </div>

          {/* Two column: Instructions & Lifestyle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Instructions */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">📘 Special Instructions</span>
              <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                Take Metformin with a full glass of water during or immediately after meals to minimize digestive discomfort. Avoid excessive grapefruit consumption while on Lisinopril.
              </p>
            </div>

            {/* Lifestyle */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">🩺 Lifestyle Notes</span>
              <ul className="flex flex-col gap-2 text-xs text-slate-500 font-semibold list-disc pl-4">
                <li>Monitor BP twice daily (AM/PM).</li>
                <li>Restrict daily sodium intake below 1,500mg.</li>
                <li>30 mins moderate walking recommended.</li>
              </ul>
            </div>

          </div>

          {/* Signature and Review Dates */}
          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center">📅</span>
              <div>
                <p className="text-slate-400 text-[10px] font-bold">NEXT REVIEW</p>
                <p className="text-slate-800 font-bold mt-0.5">Nov 24, 2024</p>
              </div>
            </div>

            {/* Doctor Signature */}
            <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
              {/* Fake signature script */}
              <span className="font-serif italic text-lg text-slate-800 font-bold border-b border-dashed border-slate-300 pb-1 px-4 tracking-wider">
                Dr. Elena Sterling
              </span>
              <span className="text-[8px] text-slate-400 uppercase font-bold tracking-widest mt-1 block">
                ✓ Electronically Authenticated
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              🚚
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Fastest Delivery Available</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Order these medicines now and get them delivered by A-Pharmacy.</p>
            </div>
          </div>

          <button 
            onClick={() => router.push("/patient/dashboard")}
            className="bg-[#008A5E] hover:bg-[#00704c] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-sm transition-all shrink-0"
          >
            Order at Healix Pharmacy
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
