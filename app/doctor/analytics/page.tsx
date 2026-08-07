"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import { supabase } from "@/lib/supabase";

export default function DoctorAnalytics() {
  const { user, logout, doctorProfile } = useApp();
  const router = useRouter();

  const [revenue, setRevenue] = useState(12450);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/doctor/login");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.from("payments").select("amount");
        if (data && data.length > 0) {
          const sum = data.reduce((total: number, p: any) => total + Number(p.amount), 0);
          setRevenue(sum);
        }
      } catch (err) {
        console.error("Error loading analytics data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const initials = (user?.name || "Dr. Julianne Smith")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Mock data for graphs
  const monthlyRevenue = [
    { month: "Jan", amount: 8200 },
    { month: "Feb", amount: 9400 },
    { month: "Mar", amount: 11100 },
    { month: "Apr", amount: 10800 },
    { month: "May", amount: 12100 },
    { month: "Jun", amount: revenue }
  ];

  const patientDemographics = [
    { group: "Pediatric (0-12)", value: 15, color: "bg-blue-400" },
    { group: "Teen (13-18)", value: 20, color: "bg-emerald-400" },
    { group: "Adult (19-60)", value: 45, color: "bg-indigo-500" },
    { group: "Senior (60+)", value: 20, color: "bg-amber-400" }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 p-6 justify-between shrink-0">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <svg className="w-7 h-7 text-[#0F62FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-none">Healix</h2>
              <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Provider Portal</span>
            </div>
          </div>

          <Link href="/doctor/profile-registration" className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100/70 transition-all cursor-pointer w-full text-left">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#008A5E] flex items-center justify-center font-bold text-sm shrink-0">
              {initials}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{user?.name || "Dr. Julianne Smith"}</h4>
              <p className="text-[10px] text-slate-400 font-medium">{doctorProfile?.specialization || "Cardiology Specialist"}</p>
            </div>
          </Link>

          <nav className="flex flex-col gap-1 text-slate-500 font-medium text-xs">
            <Link href="/doctor/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>
              Dashboard
            </Link>
            <Link href="/doctor/appointments" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Appointments
            </Link>
            <Link href="/doctor/patients" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Patients
            </Link>
            <Link href="/doctor/analytics" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-blue-50 text-[#0f62fe] font-bold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Analytics
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-1 text-slate-500 font-medium text-xs border-t border-slate-100 pt-6">
          <a href="mailto:support@healix.com" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors w-full text-left">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Support Desk
          </a>
          <button onClick={logout} className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left font-bold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-40">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Practice Analytics</h1>
            <p className="text-slate-400 text-[10px] font-medium font-bold">Comprehensive report of your consults and patient metrics.</p>
          </div>
        </header>

        <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
          
          {/* Main Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Revenue (YTD)</span>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">${(64600 + revenue).toLocaleString()}</p>
              <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 block w-fit mt-1">+14% Growth</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Consultation Hours</span>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">142 Hrs</p>
              <span className="text-[9px] text-slate-400 font-bold block mt-1">Average 32m per patient</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patient Satisfaction</span>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">4.92<span className="text-xs text-slate-400 font-bold">/5.0</span></p>
              <span className="text-[9px] text-slate-400 font-bold block mt-1">Based on 1.4k reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Revenue Analytics Chart */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-6">Revenue Growth (Last 6 Months)</h3>
              
              <div className="flex gap-4 items-end h-60 pt-4 px-2 border-b border-l border-slate-100">
                {monthlyRevenue.map((data, idx) => {
                  const percent = Math.round((data.amount / 13000) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end gap-2 group">
                      <div className="text-[10px] font-bold text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                        ${data.amount.toLocaleString()}
                      </div>
                      <div 
                        style={{ height: `${percent}%` }}
                        className="w-full bg-[#0F62FE] hover:bg-[#0353E9] rounded-t-xl transition-all duration-500 shadow-sm"
                      />
                      <span className="text-[10px] font-bold text-slate-400 mt-1">{data.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Demographics */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-6">Patient Demographics</h3>
                
                <div className="flex flex-col gap-4">
                  {patientDemographics.map((demo, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{demo.group}</span>
                        <span>{demo.value}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${demo.color} rounded-full`}
                          style={{ width: `${demo.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-6">
                Based on active clinic consultations. Demographic patterns are used to plan slots availability.
              </p>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
