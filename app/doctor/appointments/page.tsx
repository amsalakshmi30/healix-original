"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";

export default function DoctorAppointments() {
  const { logout, user } = useApp();
  const [appointments] = useState([
    { id: "1", patientName: "Liam Chen", time: "10:30 AM - 11:00 AM", date: "Today", type: "Cardiology", status: "confirmed" },
    { id: "2", patientName: "Pam Beesly", time: "11:30 AM - 12:00 PM", date: "Today", type: "Follow-up", status: "confirmed" },
    { id: "3", patientName: "Michael Scott", time: "02:00 PM - 02:30 PM", date: "Tomorrow", type: "General Checkup", status: "pending" },
    { id: "4", patientName: "Jim Halpert", time: "03:30 PM - 04:00 PM", date: "Tomorrow", type: "Vascular Consult", status: "confirmed" }
  ]);

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
            Appointments List
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

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col gap-6 w-full">
          <div>
            <h3 className="text-base font-bold text-slate-900">Your Consultations Schedule</h3>
            <p className="text-xs text-slate-400 mt-1">Review active and pending checkups requested by patients.</p>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-100 pt-6">
            {appointments.map((appt) => (
              <div key={appt.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{appt.patientName}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                    {appt.date} at {appt.time} • {appt.type}
                  </p>
                </div>
                <span className={`text-[8px] font-bold px-2 py-1 rounded-full uppercase border ${appt.status === "confirmed" ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-amber-50 border-amber-100 text-amber-700"}`}>
                  {appt.status}
                </span>
              </div>
            ))}
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
