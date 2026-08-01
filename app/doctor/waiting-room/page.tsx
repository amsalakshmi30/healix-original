"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";

export default function DoctorWaitingRoom() {
  const { logout, setActiveConsultationPatient } = useApp();
  const router = useRouter();

  // Sample patients queue
  const [patients] = useState([
    { id: "HX-88291", name: "Liam Chen", status: "online", age: 34, gender: "Male", bp: "120/80", hr: "72 bpm" },
    { id: "HX-99021", name: "Pam Beesly", status: "online", age: 34, gender: "Female", bp: "115/75", hr: "68" },
    { id: "HX-12349", name: "Michael Scott", status: "offline", age: 45, gender: "Male", bp: "135/90", hr: "88" },
    { id: "HX-55421", name: "Jim Halpert", status: "online", age: 35, gender: "Male", bp: "120/80", hr: "74" }
  ]);

  const handleJoin = (pat: any) => {
    setActiveConsultationPatient({
      name: pat.name,
      age: pat.age,
      gender: pat.gender,
      id: pat.id,
      bloodType: pat.gender === "Male" ? "O+" : "A-",
      weight: pat.gender === "Male" ? "82 kg" : "59 kg"
    });
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
      <main className="max-w-4xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-6 justify-center">
        
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col gap-6 w-full">
          <div>
            <span className="bg-blue-50 text-[#0F62FE] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
              Waiting Queue
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-3">Virtual Waiting Room</h3>
            <p className="text-xs text-slate-400 mt-1">Select an active online patient to initiate the telehealth consultation room.</p>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-100 pt-6">
            {patients.map((pat) => {
              const isOnline = pat.status === "online";
              return (
                <div 
                  key={pat.id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl gap-4 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                        {pat.name.split(" ").slice(-1)[0][0] || "P"}
                      </div>
                      {/* Green online or Red offline dot */}
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${isOnline ? "bg-emerald-500" : "bg-red-500"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-800">{pat.name}</h4>
                        <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded border uppercase ${isOnline ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-red-50 border-red-100 text-red-600"}`}>
                          {pat.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                        ID: {pat.id} • {pat.gender}, {pat.age} yrs • BP: {pat.bp} • HR: {pat.hr} bpm
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoin(pat)}
                    disabled={!isOnline}
                    className={`font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0 ${isOnline ? "bg-[#0F62FE] hover:bg-[#0353E9] text-white cursor-pointer" : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Admit Patient
                  </button>
                </div>
              );
            })}
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
