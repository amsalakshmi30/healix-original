"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";

export default function PatientDashboard() {
  const { user, logout, appointments } = useApp();
  const router = useRouter();

  // State for live countdown timer
  const [timeLeft, setTimeLeft] = useState(862); // 14:22 in seconds
  
  // Water intake simulator
  const [water, setWater] = useState(1.8);

  // Checkbox states for medicine timeline
  const [meds, setMeds] = useState({
    morning: false,
    afternoon: true,
    night: false
  });

  const [dashboardSearch, setDashboardSearch] = useState("");
  const [activeModal, setActiveModal] = useState<"none" | "lab" | "sos" | "share">("none");
  const [emailToShare, setEmailToShare] = useState("");
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("healix_user");
    if (!storedUser) {
      router.push("/patient/login");
    }
  }, [router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAddWater = (amount: number) => {
    setWater((prev) => Math.min(2.5, Math.round((prev + amount) * 10) / 10));
  };

  const nextAppt = appointments[0] || {
    doctorName: "Dr. Sarah Jenkins",
    doctorSpecialization: "Senior Cardiologist",
    doctorAvatar: "/doc-sarah.jpg",
    date: "Today",
    time: "2:30 PM - 3:00 PM",
    fee: "$180.00",
    room: "Virtual Clinic - Room #402"
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 p-6 justify-between shrink-0">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <svg className="w-7 h-7 text-[#0F62FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-none">Healix</h2>
              <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Patient Portal</span>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0F62FE] flex items-center justify-center font-bold text-sm">
              SJ
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{user?.name || "Sarah Jenkins"}</h4>
              <p className="text-[10px] text-slate-400 font-medium">Wellness Enthusiast</p>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex flex-col gap-1 text-slate-500 font-medium text-xs">
            <Link href="/patient/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-blue-50 text-[#0F62FE] font-bold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>
              Dashboard
            </Link>
            <Link href="/patient/appointments" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Appointments
            </Link>
            <a href="#medical-history" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              History
            </a>
            <Link href="/patient/prescription" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Prescriptions
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              Health Alerts
            </Link>

            {/* Book Button */}
            <Link 
              href="/patient/appointments"
              className="mt-8 bg-[#0F62FE] hover:bg-[#0353E9] text-white font-semibold text-center py-3 rounded-full shadow-sm hover:shadow transition-all duration-200"
            >
              Book New Appointment
            </Link>
          </nav>
        </div>

        {/* Bottom actions */}
        <div className="flex flex-col gap-1 text-slate-500 font-medium text-xs border-t border-slate-100 pt-6">
          <Link href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Settings
          </Link>
          <button onClick={logout} className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Dashboard Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Good Morning, {user?.name.split(" ")[0] || "Sarah"}</h1>
            <p className="text-slate-400 text-[11px] font-medium">Your health is looking great today.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input 
                type="text" 
                placeholder="Search records, doctors..." 
                value={dashboardSearch}
                onChange={(e) => setDashboardSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && dashboardSearch.trim()) {
                    router.push(`/patient/appointments?q=${encodeURIComponent(dashboardSearch)}`);
                  }
                }}
                className="w-full sm:w-64 pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:bg-white"
              />
            </div>
            
            <button className="relative w-9 h-9 border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>

            {/* Mobile Sidebar Trigger / Logout */}
            <button onClick={logout} className="lg:hidden w-9 h-9 border border-slate-200 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </header>

        {/* Dashboard Grid Grid */}
        <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
          
          {/* Top Metric Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* BMI Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Body Mass Index</span>
                <span className="text-slate-300 hover:text-slate-500 cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                </span>
              </div>
              <div className="my-3">
                <p className="text-3xl font-extrabold text-slate-900 leading-none">22.4</p>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-2">
                  Healthy Range
                </span>
              </div>
              <div className="w-full h-8 bg-slate-100 rounded-lg overflow-hidden flex items-end relative mt-2">
                <div className="absolute inset-0 flex items-center justify-between px-2 text-[8px] text-slate-400 font-bold z-10">
                  <span>18.5 - 24.9</span>
                </div>
                <div className="h-full bg-emerald-500/20" style={{ width: '60%' }} />
              </div>
            </div>

            {/* Heart Rate Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Heart Rate</span>
                <span className="text-red-500 animate-pulse">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                </span>
              </div>
              <div className="my-3">
                <p className="text-3xl font-extrabold text-slate-900 leading-none">72 <span className="text-xs text-slate-400 font-bold uppercase">bpm</span></p>
                <span className="text-[9px] text-slate-400 font-bold block mt-1">Resting • Stable</span>
              </div>
              {/* Dynamic SVG Waveform */}
              <div className="w-full h-8 mt-2 overflow-hidden">
                <svg className="w-full h-full text-red-500" viewBox="0 0 200 40" fill="none">
                  <path d="M0,20 L30,20 L40,10 L50,30 L60,20 L90,20 L100,0 L110,40 L120,20 L150,20 L160,15 L170,25 L180,20 L200,20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Daily Activity Steps */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Daily Activity</span>
                <span className="text-xs font-bold text-[#0F62FE]">+12% vs last week</span>
              </div>
              <div className="my-3 flex justify-between items-end">
                <div>
                  <p className="text-3xl font-extrabold text-slate-900 leading-none">8,432</p>
                  <span className="text-[9px] text-slate-400 font-bold mt-1 block">Steps Taken</span>
                </div>
                {/* Mon, Tue, Wed mini circles */}
                <div className="flex gap-1.5">
                  {["M", "T", "W"].map((day, idx) => (
                    <div key={idx} className="w-6 h-6 rounded-full bg-blue-100 text-[#0F62FE] flex items-center justify-center text-[9px] font-bold shadow-sm">
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Indigo Next Appointment Card & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Indigo Card */}
            <div className="lg:col-span-8 bg-gradient-to-br from-blue-700 via-indigo-800 to-indigo-950 text-white rounded-3xl p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center relative overflow-hidden gap-6 shadow-md border border-slate-800">
              {/* Subtle background nodes */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" strokeWidth="1" />
                </svg>
              </div>

              <div className="flex flex-col gap-3 relative z-10">
                <span className="text-[10px] font-extrabold tracking-widest text-blue-200 bg-blue-500/20 px-3 py-1 rounded-full w-fit uppercase">
                  Next Appointment
                </span>
                <div>
                  <h3 className="text-2xl font-bold">{nextAppt.doctorName === "Dr. Sarah Jenkins" ? "Annual Health Assessment" : "Cardiology Consultation"}</h3>
                  <p className="text-slate-300 text-sm font-semibold mt-1.5">{nextAppt.doctorName} • {nextAppt.doctorSpecialization}</p>
                  <p className="text-slate-300 text-xs mt-1">{nextAppt.room || "Virtual Clinic - Room #402"}</p>
                </div>

                <div className="flex gap-4 items-center mt-3">
                  <Link 
                    href="/patient/waiting-room"
                    className="bg-white text-blue-900 hover:bg-slate-100 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Join Now
                  </Link>
                  <span className="text-[11px] text-slate-300">Appointment scheduled for {nextAppt.time}</span>
                </div>
              </div>

              {/* Timer Dial Display */}
              <div className="flex flex-col items-center gap-1.5 shrink-0 bg-slate-900/30 p-5 rounded-2xl border border-white/10 relative z-10 min-w-[130px]">
                <span className="text-[9px] uppercase font-bold text-blue-200 tracking-wider">Starts In</span>
                <span className="text-3xl font-mono font-extrabold">{formatTime(timeLeft)}</span>
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-white h-full transition-all" style={{ width: `${(timeLeft / 862) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Quick Actions Sidebar Grid */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quick Actions</span>
              
              <div className="grid grid-cols-2 gap-4">
                <Link href="/patient/prescription" className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-blue-50/50 hover:border-blue-100 transition-all text-left">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0F62FE] flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" /></svg>
                  </div>
                  <span className="text-xs font-bold text-slate-800">Refill Rx</span>
                </Link>

                <div onClick={() => setActiveModal("lab")} className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-blue-50/50 hover:border-blue-100 transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0F62FE] flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <span className="text-xs font-bold text-slate-800">Lab Results</span>
                </div>

                <div onClick={() => setActiveModal("sos")} className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-red-50/50 hover:border-red-100 transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <span className="text-xs font-bold text-slate-800">SOS Contact</span>
                </div>

                <div onClick={() => setActiveModal("share")} className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-blue-50/50 hover:border-blue-100 transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0F62FE] flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 10.742l4.8 2.4A2 2 0 1113.6 15.2a2 2 0 01-2.8-2.8l4.8-2.4a2 2 0 11.8 2.8" /></svg>
                  </div>
                  <span className="text-xs font-bold text-slate-800">Share Record</span>
                </div>
              </div>
            </div>

          </div>

          {/* Medication Timeline & Sleep/Water Trackers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Timeline */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Medication Timeline</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Daily prescription tracker</p>
                </div>
                <button className="text-xs font-bold text-[#0F62FE] hover:underline">Full Schedule</button>
              </div>

              <div className="flex flex-col gap-4">
                {/* Morning */}
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Morning (8:00 AM)</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Lisinopril 10mg • Before Breakfast</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={meds.morning} 
                    onChange={e => setMeds({...meds, morning: e.target.checked})}
                    className="w-5 h-5 text-[#0F62FE] border-slate-300 rounded focus:ring-0 cursor-pointer"
                  />
                </div>

                {/* Afternoon */}
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Afternoon (2:00 PM)</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Vitamin D3 2000 IU • With Lunch</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={meds.afternoon} 
                    onChange={e => setMeds({...meds, afternoon: e.target.checked})}
                    className="w-5 h-5 text-[#0F62FE] border-slate-300 rounded focus:ring-0 cursor-pointer"
                  />
                </div>

                {/* Night */}
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Night (9:00 PM)</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Melatonin 3mg • Before Bed</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={meds.night} 
                    onChange={e => setMeds({...meds, night: e.target.checked})}
                    className="w-5 h-5 text-[#0F62FE] border-slate-300 rounded focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Water and Sleep trackers */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Water Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Circle progress ring simulator */}
                  <div className="w-14 h-14 rounded-full border-4 border-blue-500/20 border-t-blue-500 flex items-center justify-center font-bold text-xs text-blue-600 relative shrink-0">
                    {Math.round((water / 2.5) * 100)}%
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Water Intake</h4>
                    <p className="text-xs font-extrabold text-slate-900 mt-0.5">{water}L <span className="text-[10px] text-slate-400 font-semibold">/ 2.5L</span></p>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => handleAddWater(0.2)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                    +0.2
                  </button>
                  <button onClick={() => handleAddWater(0.5)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                    +0.5
                  </button>
                </div>
              </div>

              {/* Sleep Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 flex items-center justify-center shrink-0 text-indigo-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Sleep Quality</h4>
                    <p className="text-xs font-extrabold text-slate-900 mt-0.5">7h 45m</p>
                    <span className="text-[9px] text-emerald-500 font-bold">Excellent</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Recent History Table & Wellness Tip */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Medical History */}
            <div id="medical-history" className="scroll-mt-6 lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-x-auto">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Recent Medical History</h3>
              <table className="w-full text-left text-xs font-medium text-slate-500">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[9px] font-bold">
                    <th className="pb-3 pr-4">Procedure/Visit</th>
                    <th className="pb-3 px-4">Date</th>
                    <th className="pb-3 px-4">Doctor</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 pl-4 text-right">Results</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  <tr>
                    <td className="py-4 pr-4 text-slate-900">Blood Panel (Routine)</td>
                    <td className="py-4 px-4 text-slate-500 font-medium">Oct 12, 2023</td>
                    <td className="py-4 px-4 text-slate-500">Dr. Sarah Vane</td>
                    <td className="py-4 px-4">
                      <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2.5 py-0.5 rounded-full">
                        COMPLETED
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600">
                        <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 text-slate-900">Physical Examination</td>
                    <td className="py-4 px-4 text-slate-500 font-medium">Sep 05, 2023</td>
                    <td className="py-4 px-4 text-slate-500">Dr. Michael Chen</td>
                    <td className="py-4 px-4">
                      <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2.5 py-0.5 rounded-full">
                        COMPLETED
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600">
                        <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Daily Wellness Tip */}
            <div className="lg:col-span-4 bg-emerald-50 border border-emerald-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-2">Daily Wellness Tip</span>
                <p className="text-xs text-emerald-800 leading-relaxed font-semibold">
                  Increasing your fiber intake by just 5g a day can significantly improve your metabolic health. Try adding some flax seeds or chia to your morning breakfast.
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <svg className="w-8 h-8 text-emerald-600/30" fill="currentColor" viewBox="0 0 24 24"><path d="M12.24 10.285V14.4h6.887" /></svg>
              </div>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
