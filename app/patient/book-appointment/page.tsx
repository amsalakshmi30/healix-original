"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";

export default function BookAppointment() {
  const { selectedDoctor, selectedSlot, addAppointment, logout } = useApp();
  const router = useRouter();

  // Fallbacks
  const doc = selectedDoctor || {
    name: "Dr. Alexander Sterling",
    specialization: "Senior Cardiologist • MBBS, MD",
    fee: "$150.00",
  };

  const slot = selectedSlot || {
    date: "Oct 24, 2024",
    time: "09:30 AM",
  };

  // Payment states: 'review' | 'scanning' | 'success'
  const [payState, setPayState] = useState<"review" | "scanning" | "success">("review");
  const [scanPulse, setScanPulse] = useState(true);

  // Trigger payment scanner simulation
  const handleConfirmPay = () => {
    setPayState("scanning");
  };

  useEffect(() => {
    if (payState === "scanning") {
      const timer = setTimeout(() => {
        // Add appointment to global context state
        addAppointment({
          doctorName: doc.name,
          doctorSpecialization: doc.specialization,
          doctorAvatar: doc.avatar || "/doc-alex.jpg",
          date: slot.date,
          time: slot.time + " (45 min)",
          fee: doc.fee || "$150.00",
          room: "Virtual Clinic - Room #402"
        });
        setPayState("success");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [payState, doc, slot, addAppointment]);

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
            Confirm Booking
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/patient/doctor-profile" className="text-xs font-bold text-slate-500 hover:text-slate-800">
            Back to Profile
          </Link>
          <button onClick={logout} className="text-xs font-bold text-red-600 hover:underline">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-4xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-6 justify-center">
        
        {payState === "review" && (
          <div className="flex flex-col gap-6">
            {/* Steps indicator */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex justify-between items-center text-xs font-bold text-slate-400">
              <span className="text-[10px] uppercase font-bold text-[#0F62FE] tracking-wide">Step 3 of 3: Confirmation</span>
              <div className="flex gap-4">
                <span className="text-emerald-500">✓ Select</span>
                <span className="text-emerald-500">✓ Schedule</span>
                <span className="text-[#0F62FE]">● Review</span>
              </div>
            </div>

            {/* Inner details container */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm flex flex-col gap-8">
              
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Review Your Appointment</h2>
                <p className="text-slate-400 text-xs mt-1">Please confirm the details of your upcoming consultation with {doc.name}.</p>
              </div>

              {/* Two Panel Layout info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
                
                {/* Doctor details card */}
                <div className="flex flex-col gap-5 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0F62FE] flex items-center justify-center font-bold text-lg">
                      {doc.name.split(" ").slice(-1)[0][0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                      <p className="text-[11px] text-slate-400 font-semibold">{doc.specialization}</p>
                      <p className="text-[10px] text-slate-400 font-medium">City Central Hospital, Wing B</p>
                    </div>
                  </div>

                  <div className="flex gap-6 border-t border-slate-200/50 pt-4 text-xs font-semibold text-slate-600">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Date</span>
                      <p className="text-slate-900 font-bold mt-1">Thursday, {slot.date}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Time</span>
                      <p className="text-slate-900 font-bold mt-1">{slot.time} • 45 min</p>
                    </div>
                  </div>

                  {/* Fake map snippet */}
                  <div className="h-20 bg-slate-200/60 rounded-xl relative overflow-hidden flex items-center justify-center mt-2 text-[9px] font-bold text-slate-500 border border-slate-200">
                    🗺️ Wing B Location Map (City Central)
                  </div>
                </div>

                {/* Pricing Summary card */}
                <div className="flex flex-col justify-between gap-6">
                  <div className="flex flex-col gap-3 text-xs text-slate-500 font-semibold">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Appointment Summary</h4>
                    
                    <div className="flex justify-between">
                      <span>Consultation Fee</span>
                      <span className="text-slate-800 font-bold">{doc.fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Facility Charge</span>
                      <span className="text-slate-800 font-bold">$25.00</span>
                    </div>
                    <div className="flex justify-between text-red-500 font-bold">
                      <span>Insurance Adjustment</span>
                      <span>-$45.00</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm font-extrabold text-slate-900 border-t border-slate-100 pt-4 mt-2">
                      <span>TOTAL PAYABLE</span>
                      <div className="flex items-center gap-1.5 text-slate-950">
                        <span>$130.00</span>
                        <span className="bg-emerald-50 text-emerald-700 text-[8px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                          🛡️ Secured
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleConfirmPay}
                      className="w-full bg-[#0F62FE] hover:bg-[#0353E9] text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      Confirm & Pay
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                    </button>
                    
                    <Link
                      href="/patient/doctor-profile"
                      className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-3 rounded-xl transition-all text-center"
                    >
                      Modify Details
                    </Link>
                  </div>

                </div>

              </div>

            </div>

            {/* Bottom logos */}
            <div className="flex justify-center gap-8 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>🔒 PCI Compliant</span>
              <span>🔒 HIPAA Secure</span>
            </div>
          </div>
        )}

        {payState === "scanning" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 shadow-sm text-center flex flex-col items-center gap-8 py-20 max-w-md w-full mx-auto relative overflow-hidden">
            
            <h3 className="text-lg font-extrabold text-slate-900">Awaiting QR Payment</h3>
            <p className="text-xs text-slate-400 max-w-xs -mt-5">Please scan the QR code using your payment app or scan terminal to complete booking.</p>

            {/* QR Scanner Simulator */}
            <div className="w-48 h-48 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-inner">
              
              {/* Fake QR Pattern */}
              <div className="w-36 h-36 bg-slate-900 flex flex-wrap p-2 rounded relative">
                {/* Corners */}
                <div className="absolute top-2 left-2 w-8 h-8 border-4 border-white bg-slate-900" />
                <div className="absolute top-2 right-2 w-8 h-8 border-4 border-white bg-slate-900" />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-4 border-white bg-slate-900" />
                {/* Fake pixels inside */}
                <div className="w-full h-full border border-dashed border-white/20 flex items-center justify-center text-white/50 text-[10px] font-bold font-mono">
                  HEALIX-PAY
                </div>
              </div>

              {/* Sweeping Laser Line Animation */}
              <div className="absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_10px_#ef4444] animate-bounce" style={{ top: '20%' }} />

            </div>

            <div className="flex flex-col gap-1.5 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Awaiting scanner link</span>
              <p className="text-xs text-slate-500 font-semibold">Booking will auto-confirm after payment.</p>
            </div>
          </div>
        )}

        {payState === "success" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm text-center flex flex-col items-center gap-6 py-16 max-w-md w-full mx-auto animate-fade-in">
            
            {/* Animated Check icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>

            <div>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                Payment Success
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-3">Appointment Confirmed!</h3>
              <p className="text-xs text-slate-400 mt-1">Your consultation has been successfully booked.</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 w-full text-left flex flex-col gap-2.5 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Doctor</span>
                <span className="text-slate-900 font-bold">{doc.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time</span>
                <span className="text-slate-900 font-bold">{slot.date} @ {slot.time}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/50 pt-2.5 mt-1">
                <span>Invoice Code</span>
                <span className="text-[#0F62FE] font-mono font-bold uppercase">HLX-9821-B</span>
              </div>
            </div>

            <Link
              href="/patient/dashboard"
              className="w-full bg-[#0F62FE] hover:bg-[#0353E9] text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm text-center"
            >
              Continue to Dashboard
            </Link>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-400">
        © 2026 Healix Healthcare. All rights reserved.
      </footer>
    </div>
  );
}
