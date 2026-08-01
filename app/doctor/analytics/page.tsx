"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";

export default function DoctorAnalytics() {
  const { logout } = useApp();

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
            Practice Performance
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

      {/* Main Stats Panel */}
      <main className="max-w-4xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-6 justify-center">
        
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col gap-8 w-full">
          <div>
            <span className="bg-blue-50 text-[#0F62FE] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
              Dashboard Metrics
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-3">Practice Insights</h3>
            <p className="text-xs text-slate-400 mt-1">Review metrics on appointment volumes, clinic revenue, and patient wait times.</p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Total Consultations</span>
              <span className="text-2xl font-extrabold text-slate-800">142</span>
              <p className="text-[9px] text-emerald-600 font-bold mt-2">▲ 14% vs last month</p>
            </div>
            
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Average Session Duration</span>
              <span className="text-2xl font-extrabold text-slate-800">18.4 mins</span>
              <p className="text-[9px] text-[#0F62FE] font-bold mt-2">● Stable performance</p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Consultation Revenue</span>
              <span className="text-2xl font-extrabold text-slate-800">$21,300.00</span>
              <p className="text-[9px] text-emerald-600 font-bold mt-2">▲ 8% vs last month</p>
            </div>
          </div>

          {/* Custom styled mock charts/visualizations */}
          <div className="flex flex-col gap-6 border-t border-slate-100 pt-8">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Weekly Consultation Volumes</h4>
            
            <div className="flex flex-col gap-4">
              {[
                { label: "Cardiology", value: 75, count: "64 consults" },
                { label: "General Checkup", value: 50, count: "42 consults" },
                { label: "Vascular Follow-up", value: 35, count: "30 consults" },
                { label: "Emergency Consults", value: 10, count: "6 consults" }
              ].map((c) => (
                <div key={c.label} className="flex flex-col gap-1 text-xs font-semibold">
                  <div className="flex justify-between text-slate-600 text-[11px]">
                    <span>{c.label}</span>
                    <span className="font-bold text-slate-800">{c.count}</span>
                  </div>
                  {/* Mock progress bar to represent bar chart */}
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#0F62FE] h-full rounded-full transition-all duration-500" 
                      style={{ width: `${c.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
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
