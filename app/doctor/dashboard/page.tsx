"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";

export default function DoctorDashboard() {
  const { 
    user, 
    logout, 
    doctorVerification, 
    doctorProfile, 
    setActiveConsultationPatient 
  } = useApp();
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in as doctor
    const storedUser = localStorage.getItem("healix_user");
    if (!storedUser) {
      router.push("/doctor/login");
    }
  }, [router]);

  const handleJoinConsultation = (patientName: string) => {
    setActiveConsultationPatient({
      name: patientName,
      age: patientName === "Michael Scott" ? 45 : patientName === "Pam Beesly" ? 34 : 35,
      gender: patientName === "Michael Scott" ? "Male" : patientName === "Pam Beesly" ? "Female" : "Male",
      id: "HX-88291",
      bloodType: "O+",
      weight: "74 kg"
    });
    router.push("/doctor/waiting-room");
  };

  const isFullyUnlocked = doctorVerification === "verified" && doctorProfile !== null;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      
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
              <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Provider Portal</span>
            </div>
          </div>

          {/* Doctor Profile Header banner */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#008A5E] flex items-center justify-center font-bold text-sm">
              JS
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{user?.name || "Dr. Julianne Smith"}</h4>
              <p className="text-[10px] text-slate-400 font-medium">{doctorProfile?.specialization || "Cardiology Specialist"}</p>
            </div>
          </div>

          {/* Sidebar Nav */}
          <nav className="flex flex-col gap-1 text-slate-500 font-medium text-xs">
            <Link href="/doctor/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-blue-50 text-[#0f62fe] font-bold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>
              Dashboard
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Appointments
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Patients
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Analytics
            </Link>
          </nav>
        </div>

        {/* Bottom support/signout */}
        <div className="flex flex-col gap-1 text-slate-500 font-medium text-xs border-t border-slate-100 pt-6">
          <Link href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Support Desk
          </Link>
          <button onClick={logout} className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left font-bold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Dashboard Panel */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-40">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Doctor Dashboard</h1>
            <p className="text-slate-400 text-[10px] font-medium">Hello, {user?.name || "Dr. Smith"}. Let's view your practice analytics.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input 
                type="text" 
                placeholder="Search patients, records..." 
                className="w-full sm:w-64 pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:bg-white"
              />
            </div>
            
            <button className="relative w-9 h-9 border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Dashboard Grid Content */}
        <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
          
          {/* Top Metric Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Today's Patients</span>
                <span className="text-emerald-500 font-bold">+8%</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 mt-2.5">24</p>
            </div>

            {/* Metric 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Remaining Appts</span>
                <span className="text-blue-500 font-bold">14 Pending</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 mt-2.5">14</p>
            </div>

            {/* Metric 3 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Monthly Revenue</span>
                <span className="text-emerald-500 font-bold">+5.4%</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 mt-2.5">$12,450</p>
            </div>

            {/* Metric 4 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Pending Requests</span>
                <span className="bg-red-50 text-red-700 text-[8px] font-bold px-1.5 py-0.5 rounded border border-red-200">
                  High Priority
                </span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 mt-2.5">06</p>
            </div>

          </div>

          {/* Conditional Workflows Steps Section (Verification & Profile Setup) */}
          <div className="flex flex-col gap-4">
            
            {/* Step 1: Verification Pending/Required */}
            {doctorVerification === "unverified" && (
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                    ⚠️
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">Provider Verification Required</h4>
                    <p className="text-[10px] text-amber-700 mt-0.5 font-medium">Please submit your medical licenses and ID verification documents to activate your provider dashboard.</p>
                  </div>
                </div>
                <Link 
                  href="/doctor/verification"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-sm transition-colors shrink-0"
                >
                  Complete Verification
                </Link>
              </div>
            )}

            {doctorVerification === "pending" && (
              <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 flex flex-col gap-3 shadow-sm">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0F62FE] flex items-center justify-center font-bold animate-pulse">
                    ⏳
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-blue-900">Verification Under Review</h4>
                    <p className="text-[10px] text-blue-700 mt-0.5 font-medium">
                      You will receive an email regarding your verification within 24 hours. Once verified, you can proceed to register your professional details.
                    </p>
                  </div>
                </div>
                
                {/* Demo cheat button to bypass review immediately */}
                <button
                  onClick={() => {
                    localStorage.setItem("healix_doctor_verification", "verified");
                    window.location.reload();
                  }}
                  className="text-[10px] text-[#0F62FE] hover:underline font-bold self-start mt-1"
                >
                  [Demo Shortcut: Approve Verification Instantly]
                </button>
              </div>
            )}

            {/* Step 2: Profile Registration */}
            {doctorVerification === "verified" && doctorProfile === null && (
              <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0F62FE] flex items-center justify-center font-bold">
                    📝
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-blue-900">Profile Registration Required</h4>
                    <p className="text-[10px] text-blue-700 mt-0.5 font-medium">Your credentials have been approved! Please set up your professional bio, slots, and fees to go publish live.</p>
                  </div>
                </div>
                <Link 
                  href="/doctor/profile-registration"
                  className="bg-[#0f62fe] hover:bg-[#0353e9] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-sm transition-colors shrink-0"
                >
                  Set Up Profile
                </Link>
              </div>
            )}

          </div>

          {/* Main Dashboard Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Side Column: Queue List & Analytics */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Waiting Room Queue */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Patients in Waiting Room</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Active queue of patients ready for video consult</p>
                  </div>
                  <button className="text-xs font-bold text-[#0F62FE] hover:underline">View All</button>
                </div>

                {isFullyUnlocked ? (
                  <div className="flex flex-col gap-4">
                    {[
                      { name: "Michael Scott", type: "Check-up • Just waiting", initials: "MS", color: "bg-blue-100 text-blue-800" },
                      { name: "Pam Beesly", type: "Consultation • 5m waiting", initials: "PB", color: "bg-emerald-100 text-emerald-800" },
                      { name: "Jim Halpert", type: "Follow-up • Just arrived", initials: "JH", color: "bg-purple-100 text-purple-800" }
                    ].map((pat, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className={`w-9 h-9 rounded-full ${pat.color} flex items-center justify-center font-bold text-xs shrink-0`}>
                            {pat.initials}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">{pat.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{pat.type}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleJoinConsultation(pat.name)}
                          className="bg-[#0F62FE] hover:bg-[#0353E9] text-white font-bold text-xs py-2 px-5 rounded-lg shadow-sm transition-all"
                        >
                          Join
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                    <span>⚠️ Waiting room locked</span>
                    <span className="text-[10px] text-slate-400 font-medium max-w-xs">Complete your Verification and Profile Registration setup above to unlock the patient consultation queue.</span>
                  </div>
                )}
              </div>

              {/* Custom SVG Revenue trend Chart */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Revenue & Patient Trends</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Financial analytics tracker</p>
                  </div>
                  <div className="flex gap-1.5 p-1 bg-slate-100 rounded-lg text-[9px] font-bold">
                    <button className="bg-white text-slate-800 px-2.5 py-1 rounded shadow-sm">Monthly</button>
                    <button className="text-slate-500 px-2.5 py-1">Weekly</button>
                  </div>
                </div>

                {/* SVG Chart Draw */}
                <div className="h-44 w-full flex items-end pt-4 gap-2 relative">
                  {/* Grid Lines */}
                  <div className="absolute inset-x-0 top-4 border-t border-dashed border-slate-100" />
                  <div className="absolute inset-x-0 top-16 border-t border-dashed border-slate-100" />
                  <div className="absolute inset-x-0 top-28 border-t border-dashed border-slate-100" />

                  {/* Bars list */}
                  {[
                    { month: "Jan", height: "40%", val: "$3,200" },
                    { month: "Feb", height: "55%", val: "$4,500" },
                    { month: "Mar", height: "50%", val: "$4,100" },
                    { month: "Apr", height: "70%", val: "$5,800" },
                    { month: "May", height: "85%", val: "$7,200" },
                    { month: "Jun", height: "95%", val: "$8,500" }
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative z-10 h-full justify-end">
                      <div className="text-[8px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 bg-slate-900 text-white px-1.5 py-0.5 rounded shadow">
                        {bar.val}
                      </div>
                      <div 
                        className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400 group-hover:from-blue-700 group-hover:to-blue-500 transition-all cursor-pointer"
                        style={{ height: bar.height }}
                      />
                      <span className="text-[10px] font-bold text-slate-400 mt-1">{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Side Column: Actions & Schedule & Stats */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Quick Tool button */}
              <Link 
                href="/doctor/medication-details"
                className="bg-[#0F62FE] hover:bg-[#0353E9] text-white rounded-2xl p-5 flex items-center justify-between shadow-md border border-slate-800 transition-all"
              >
                <div className="text-left">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-200">Quick Tool</span>
                  <h4 className="text-sm font-bold mt-0.5">Write Prescription</h4>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold">
                  →
                </div>
              </Link>

              {/* Schedule list */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Schedule</span>
                
                <div className="flex flex-col gap-4">
                  {[
                    { time: "09:00 AM", title: "Dr. Staff Meeting", desc: "Room #103 • Session Update" },
                    { time: "10:30 AM", title: "Michael Scott", desc: "Room #101 • Regular Check-up" },
                    { time: "11:30 AM", title: "Pam Beesly", desc: "Online Consultation" },
                    { time: "12:30 PM", title: "Lunch Break", desc: "" }
                  ].map((sch, idx) => (
                    <div key={idx} className="flex gap-4 items-start text-xs font-semibold">
                      <span className="text-[#0F62FE] font-bold shrink-0 w-16">{sch.time}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-slate-800 font-bold truncate">{sch.title}</h4>
                        {sch.desc && <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{sch.desc}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patient Stats donut */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center gap-4 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-full text-left">Patient Statistics</span>
                
                <div className="w-28 h-28 flex items-center justify-center relative my-2">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Ring pieces */}
                    <circle cx="56" cy="56" r="48" stroke="#0F62FE" strokeWidth="10" fill="transparent" strokeDasharray="301" strokeDashoffset="105" />
                    <circle cx="56" cy="56" r="48" stroke="#008A5E" strokeWidth="10" fill="transparent" strokeDasharray="301" strokeDashoffset="240" />
                    <circle cx="56" cy="56" r="48" stroke="#F1F5F9" strokeWidth="10" fill="transparent" strokeDasharray="301" strokeDashoffset="270" />
                  </svg>
                  <div className="absolute flex flex-col items-center leading-none">
                    <span className="text-lg font-extrabold text-slate-900">1.2k</span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase mt-1">Patients</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 w-full text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2 border-t border-slate-100">
                  <div className="flex flex-col gap-0.5 items-center">
                    <span className="text-slate-800 text-xs">65%</span>
                    <span>Adults</span>
                  </div>
                  <div className="flex flex-col gap-0.5 items-center">
                    <span className="text-[#008A5E] text-xs">20%</span>
                    <span>Kids</span>
                  </div>
                  <div className="flex flex-col gap-0.5 items-center">
                    <span className="text-slate-400 text-xs">15%</span>
                    <span>Seniors</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
