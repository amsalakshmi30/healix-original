"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";

export default function WaitingRoom() {
  const { logout } = useApp();
  const router = useRouter();

  // Local camera/mic toggles
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);

  // Countdown timer in seconds (starts at 8 seconds for a fast, responsive demo!)
  const [secondsLeft, setSecondsLeft] = useState(8);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (secondsLeft > 0) {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setIsReady(true);
    }
  }, [secondsLeft]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remain = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remain.toString().padStart(2, "0")}`;
  };

  const handleJoin = () => {
    router.push("/patient/video-call");
  };

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
          <span className="bg-blue-50 text-[#0F62FE] text-[9px] font-bold px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1 uppercase">
            🛡️ Secure Encounter
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/patient/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-800">
            Cancel & Exit
          </Link>
          <button onClick={logout} className="text-xs font-bold text-red-600 hover:underline">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Waiting Console */}
      <main className="max-w-6xl mx-auto w-full px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center">
        
        {/* Left Side: Self-Webcam Preview frame */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden aspect-video flex flex-col justify-between p-6 relative shadow-md">
            
            {/* Camera feed overlay */}
            {camOn ? (
              <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm">
                {/* Simulated webcam video feed */}
                <div className="text-center flex flex-col items-center gap-3">
                  <span className="w-12 h-12 rounded-full bg-slate-700 animate-pulse flex items-center justify-center text-white">📷</span>
                  Webcam Active (Sarah Jenkins Self-Preview)
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-slate-500 font-semibold gap-3">
                <span className="text-2xl">📷</span>
                <p className="text-xs">Camera is currently disabled</p>
              </div>
            )}

            {/* Webcam info headers */}
            <div className="relative z-10 flex justify-between">
              <span className="bg-black/60 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                Camera Preview (Self)
              </span>
            </div>

            {/* Video bottom controls overlay */}
            <div className="relative z-10 flex items-center justify-between pt-12">
              <div className="flex gap-2">
                {/* Mic toggle button */}
                <button
                  onClick={() => setMicOn(!micOn)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${micOn ? "bg-emerald-500 border-emerald-600 text-white" : "bg-black/50 border-white/20 text-white hover:bg-black/75"}`}
                >
                  {micOn ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                  )}
                </button>

                {/* Cam toggle button */}
                <button
                  onClick={() => setCamOn(!camOn)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${camOn ? "bg-emerald-500 border-emerald-600 text-white" : "bg-black/50 border-white/20 text-white hover:bg-black/75"}`}
                >
                  {camOn ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  )}
                </button>
              </div>

              <span className="bg-black/40 text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                Connection: Excellent
              </span>
            </div>

          </div>

          {/* Privacy alert bar */}
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3 text-xs text-blue-700 font-semibold leading-relaxed">
            <svg className="w-5 h-5 shrink-0 text-[#0F62FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Your camera and mic are currently off. No one can see or hear you until the consultation starts. Please toggle controls to test them.</span>
          </div>

        </div>

        {/* Right Side: Waiting Timer Dial & Detail Card */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          
          {/* Circular Countdown Tracker Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center gap-6 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isReady ? "Doctor is ready!" : "Doctor will join in"}
            </span>

            {/* SVG circle countdown dial */}
            <div className="w-40 h-40 flex items-center justify-center relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="#F1F5F9" strokeWidth="6" fill="transparent" />
                <circle 
                  cx="80" 
                  cy="80" 
                  r="70" 
                  stroke="#0F62FE" 
                  strokeWidth="6" 
                  fill="transparent" 
                  strokeDasharray="440"
                  strokeDashoffset={440 - (440 * (isReady ? 8 : secondsLeft)) / 8}
                  className="transition-all duration-1000"
                />
              </svg>
              
              <div className="absolute flex flex-col items-center gap-0.5">
                <span className="text-3xl font-extrabold font-mono text-slate-900 leading-none">
                  {isReady ? "00:00" : formatTimer(secondsLeft)}
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Minutes</span>
              </div>
            </div>

            <button
              onClick={handleJoin}
              disabled={!isReady}
              className={`w-full font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${isReady ? "bg-[#0F62FE] hover:bg-[#0353E9] text-white cursor-pointer" : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              Join Consultation
            </button>

            <span className="text-[10px] text-slate-400 font-medium">
              {isReady ? "Click button above to join video room." : "The button will activate when Dr. Sarah arrives."}
            </span>
          </div>

          {/* Appointment specifics info card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Appointment Details</span>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm">
                SM
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Dr. Sarah Miller, MD</h4>
                <p className="text-[10px] text-[#0F62FE] font-bold">Senior Cardiologist</p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
              <div className="flex justify-between">
                <span>Date & Time</span>
                <span className="text-slate-800 font-bold">Today, 2:30 PM - 3:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Consultation Type</span>
                <span className="text-slate-800 font-bold">Cardiovascular Follow-up</span>
              </div>
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
