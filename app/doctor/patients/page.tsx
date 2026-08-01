"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";

export default function DoctorPatients() {
  const { logout } = useApp();
  const [selectedPatId, setSelectedPatId] = useState("HX-88291");

  const patients = [
    { id: "HX-88291", name: "Liam Chen", age: 34, gender: "Male", bp: "120/80", hr: "72 bpm", weight: "82 kg", history: "Cardiovascular checkup, reports minor muscle soreness under high endurance training.", blood: "O+" },
    { id: "HX-99021", name: "Pam Beesly", age: 34, gender: "Female", bp: "115/75", hr: "68 bpm", weight: "59 kg", history: "Follow-up visit, symptoms of minor vertigo. Recommended sodium levels calibration.", blood: "A-" },
    { id: "HX-12349", name: "Michael Scott", age: 45, gender: "Male", bp: "135/90", hr: "88 bpm", weight: "88 kg", history: "Hypertension symptoms. Advised to reduce sugar and caffeine intakes.", blood: "O-" },
    { id: "HX-55421", name: "Jim Halpert", age: 35, gender: "Male", bp: "120/80", hr: "74 bpm", weight: "80 kg", history: "Vascular evaluation. Active recovery tracking is going well.", blood: "B+" }
  ];

  const selectedPat = patients.find(p => p.id === selectedPatId) || patients[0];

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
          <span className="bg-blue-50 text-[#0F62FE] text-[9px] font-bold px-2 py-0.5 rounded border border-blue-100 uppercase">
            Clinical Records
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/doctor/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-800">
            Back to Dashboard
          </Link>
          <button onClick={logout} className="text-xs font-bold text-red-600 hover:underline">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main split dashboard content */}
      <main className="max-w-5xl mx-auto w-full px-6 py-8 flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Patients List */}
        <div className="md:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-sans">Patient Directory</h3>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Select a patient card to load active medical charts.</p>
          </div>

          <div className="flex flex-col gap-3">
            {patients.map(p => (
              <div 
                key={p.id}
                onClick={() => setSelectedPatId(p.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left flex justify-between items-center ${p.id === selectedPatId ? "bg-blue-50/50 border-blue-200" : "bg-slate-50 border-slate-100 hover:bg-slate-100/50"}`}
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{p.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-bold">ID: {p.id} • {p.gender}, {p.age}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-bold">&gt;</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Patient Details */}
        <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          <div>
            <span className="bg-emerald-50 text-[#008A5E] text-[8px] font-bold px-2 py-1 rounded border border-emerald-100 uppercase tracking-wide">
              Active Medical File
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-3">{selectedPat.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-bold">Registration Code: {selectedPat.id} • Blood Type: {selectedPat.blood}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-6 text-xs text-slate-500 font-semibold">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[8px] uppercase font-bold text-slate-400 block mb-1">Blood Pressure</span>
              <span className="text-base font-extrabold text-slate-800">{selectedPat.bp}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[8px] uppercase font-bold text-slate-400 block mb-1">Heart Rate</span>
              <span className="text-base font-extrabold text-slate-800">{selectedPat.hr}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[8px] uppercase font-bold text-slate-400 block mb-1">Weight</span>
              <span className="text-base font-extrabold text-slate-800">{selectedPat.weight}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[8px] uppercase font-bold text-slate-400 block mb-1">Demographics</span>
              <span className="text-base font-extrabold text-slate-800">{selectedPat.gender}, {selectedPat.age} yrs</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clinical Notes</span>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold bg-slate-50 p-4 border border-slate-100 rounded-2xl">
              {selectedPat.history}
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-400">
        © 2026 Healix Healthcare. All rights reserved.
      </footer>
    </div>
  );
}
