"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";

export default function DoctorProfile() {
  const { selectedDoctor, setSelectedSlot, logout } = useApp();
  const router = useRouter();

  // Fallback to Dr. Alexander Sterling if none selected
  const doc = selectedDoctor || {
    id: "sterling",
    name: "Dr. Alexander Sterling",
    specialization: "Senior Cardiologist • MBBS, MD, FACC",
    rating: 4.9,
    reviews: "1.2k Reviews",
    experience: "15+ Years Exp",
    languages: ["English", "Spanish", "French"],
    fee: "$150.00",
    avatar: "/doc-alex.jpg",
    desc: "Dr. Alexander Sterling is a board-certified cardiologist with over 15 years of experience in interventional cardiology and preventative heart health. He graduated with honors from Johns Hopkins School of Medicine and completed his residency at the Mayo Clinic. Specializing in minimally invasive cardiac procedures, Dr. Sterling is dedicated to providing personalized, patient-centric care.",
  };

  const [selectedDay, setSelectedDay] = useState("MON 21");
  const [selectedTime, setSelectedTime] = useState("02:00 PM");

  const days = [
    { day: "MON", num: "21" },
    { day: "TUE", num: "22" },
    { day: "WED", num: "23" },
    { day: "THU", num: "24" }
  ];

  const morningSlots = ["09:00 AM", "10:30 AM"];
  const afternoonSlots = ["02:00 PM", "03:30 PM", "04:45 PM", "05:30 PM"];

  const hasDbSlots = doc.slots && Object.keys(doc.slots).length > 0;
  
  const dynamicDays = hasDbSlots 
    ? Object.keys(doc.slots).map((key) => {
        const parts = key.split(" ");
        return { day: parts[0] || "MON", num: parts[1] || "21" };
      })
    : days;

  const dbSlotsForDay = hasDbSlots ? (doc.slots[selectedDay] || []) : [];
  
  const dynamicMorningSlots = (hasDbSlots 
    ? dbSlotsForDay.filter((s: string) => s.includes("AM") || s.startsWith("09:") || s.startsWith("10:") || s.startsWith("11:"))
    : morningSlots) as string[];

  const dynamicAfternoonSlots = (hasDbSlots
    ? dbSlotsForDay.filter((s: string) => s.includes("PM") && !s.startsWith("09:") && !s.startsWith("10:") && !s.startsWith("11:"))
    : afternoonSlots) as string[];

  const handleBook = () => {
    setSelectedSlot({
      date: `Oct ${selectedDay.split(" ")[1] || "21"}, 2024`,
      time: selectedTime
    });
    router.push("/patient/book-appointment");
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
          <span className="hidden md:inline text-xs font-semibold text-slate-400 border-l border-slate-200 pl-3">
            Profile Details
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/patient/appointments" className="text-xs font-bold text-slate-500 hover:text-slate-800">
            Back to Search
          </Link>
          <button onClick={logout} className="text-xs font-bold text-red-600 hover:underline">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-6 py-6 flex-1 flex flex-col gap-6">
        
        {/* Breadcrumb path */}
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Link href="/patient/dashboard" className="hover:text-slate-600">Patients</Link>
          <span>&gt;</span>
          <span className="text-slate-600">Profile Details</span>
        </div>

        {/* Content Columns split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (Info Card, Stats, Bio, Reviews) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Top Doctor Profile Summary Card */}
            <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              {/* Doctor Large Circle Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-3xl shrink-0 uppercase">
                {doc.name.split(" ").slice(-1)[0][0]}
              </div>

              <div className="flex-1">
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full inline-block">
                  ✓ Verified Professional
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-2">{doc.name}</h2>
                <p className="text-xs text-[#0F62FE] font-bold mt-0.5">{doc.specialization}</p>
                
                <div className="flex flex-wrap gap-4 text-[10px] text-slate-400 font-bold mt-4">
                  <span className="text-amber-500">★ {doc.rating} ({doc.reviews})</span>
                  <span>•</span>
                  <span>{doc.experience}</span>
                  <span>•</span>
                  <span>{doc.languages.join(", ")}</span>
                </div>
              </div>

              <div className="w-full sm:w-auto shrink-0 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6 text-left sm:text-right flex flex-row sm:flex-col justify-between items-center sm:items-end gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Consultation Fee</span>
                  <span className="text-2xl font-extrabold text-slate-900">{doc.fee}</span>
                </div>
                <button 
                  onClick={handleBook}
                  className="bg-[#0F62FE] hover:bg-[#0353E9] text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm transition-all"
                >
                  Book Appointment
                </button>
              </div>
            </div>

            {/* Surgeon/Clinic Statistics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "12k+", desc: "Patients Treated" },
                { label: "450+", desc: "Surgeries" },
                { label: "12", desc: "Awards Won" },
                { label: "98%", desc: "Recovery Rate" }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white border border-slate-200/50 p-4 rounded-xl text-center shadow-sm">
                  <p className="text-lg font-extrabold text-slate-950">{stat.label}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">{stat.desc}</p>
                </div>
              ))}
            </div>

            {/* Biography */}
            <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm flex flex-col gap-3">
              <h3 className="text-sm font-bold text-slate-950">Professional Biography</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                {doc.desc}
              </p>
            </div>

            {/* Patient Reviews Section */}
            <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-950">Patient Reviews</h3>
                <button className="text-xs font-bold text-[#0F62FE] hover:underline">See All</button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                        MS
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Michael Simmons</h4>
                        <p className="text-[9px] text-slate-400 font-medium">2 days ago</p>
                      </div>
                    </div>
                    <span className="text-amber-500 text-xs">★★★★★</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2.5 font-semibold">
                    "Dr. Sterling is incredibly thorough and took the time to explain everything to me. I felt truly heard and cared for throughout my consultation."
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                        LA
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Linda Aris</h4>
                        <p className="text-[9px] text-slate-400 font-medium">1 week ago</p>
                      </div>
                    </div>
                    <span className="text-amber-500 text-xs">★★★★★</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2.5 font-semibold">
                    "The booking process was seamless. Dr. Sterling's expertise is evident from the first minute. Highly recommend for any heart-related concerns."
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Booking Scheduler & Map Location) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Slot Booking Card */}
            <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm flex flex-col gap-6">
              <h3 className="text-sm font-bold text-slate-900">Select a Slot</h3>
              
              {/* Date Header month select */}
              <div className="flex justify-between items-center">
                <button className="text-slate-400 hover:text-slate-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <span className="text-xs font-bold text-slate-800">October 2024</span>
                <button className="text-slate-400 hover:text-slate-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              {/* Day slots list */}
              <div className="grid grid-cols-4 gap-2">
                {dynamicDays.map((item, idx) => {
                  const key = `${item.day} ${item.num}`;
                  const isActive = selectedDay === key;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedDay(key);
                        // Auto select first slot for day if db slots exist
                        const firstSlot = doc.slots?.[key]?.[0];
                        if (firstSlot) setSelectedTime(firstSlot);
                      }}
                      className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-all ${isActive ? "bg-[#0F62FE] border-[#0F62FE] text-white" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}
                    >
                      <span className="text-[9px] uppercase font-bold tracking-wider">{item.day}</span>
                      <span className="text-sm font-extrabold">{item.num}</span>
                    </button>
                  );
                })}
              </div>

              {/* Slots details list */}
              <div className="flex flex-col gap-4">
                {/* Morning */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Morning Slots</span>
                  <div className="grid grid-cols-2 gap-2">
                    {dynamicMorningSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-3 border rounded-lg text-xs font-bold text-center transition-all ${selectedTime === time ? "bg-[#0F62FE] border-[#0F62FE] text-white" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                      >
                        {time}
                      </button>
                    ))}
                    {dynamicMorningSlots.length === 0 && (
                      <span className="col-span-2 text-center text-[10px] text-slate-400 py-2">No slots available</span>
                    )}
                  </div>
                </div>

                {/* Afternoon */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Afternoon Slots</span>
                  <div className="grid grid-cols-2 gap-2">
                    {dynamicAfternoonSlots.map((time) => {
                      const isDisabled = time === "05:30 PM"; // Disabled as in Figma
                      return (
                        <button
                          key={time}
                          disabled={isDisabled}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 px-3 border rounded-lg text-xs font-bold text-center transition-all ${isDisabled ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed" : selectedTime === time ? "bg-[#0F62FE] border-[#0F62FE] text-white" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                        >
                          {time}
                        </button>
                      );
                    })}
                    {dynamicAfternoonSlots.length === 0 && (
                      <span className="col-span-2 text-center text-[10px] text-slate-400 py-2">No slots available</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Computation section */}
              <div className="border-t border-slate-100 pt-4 flex flex-col gap-2.5 text-xs text-slate-500 font-semibold">
                <div className="flex justify-between">
                  <span>Consultation Fee</span>
                  <span>{doc.fee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>$10.00</span>
                </div>
                <div className="flex justify-between text-sm text-[#0F62FE] font-extrabold border-t border-slate-50 pt-2.5">
                  <span>Total Amount</span>
                  <span>$160.00</span>
                </div>
              </div>

              {/* Book trigger */}
              <button
                onClick={handleBook}
                className="w-full bg-[#0F62FE] hover:bg-[#0353E9] text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                Book Appointment
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>

              <span className="text-[10px] text-slate-400 font-medium text-center">
                Free cancellation up to 24 hours before session.
              </span>
            </div>

            {/* Office Map widget card */}
            <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm flex flex-col gap-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Office Location</h3>
              
              <div className="h-32 bg-slate-100 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-200">
                {/* Fake map drawing using canvas/SVG */}
                <div className="absolute inset-0 opacity-40">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0" y1="20" x2="300" y2="20" stroke="gray" strokeWidth="4" />
                    <line x1="0" y1="80" x2="300" y2="80" stroke="gray" strokeWidth="4" />
                    <line x1="100" y1="0" x2="100" y2="150" stroke="gray" strokeWidth="4" />
                  </svg>
                </div>
                <div className="absolute bg-[#0F62FE] text-white px-2 py-1 rounded shadow text-[9px] font-bold">
                  📍 Healix Clinic
                </div>
              </div>

              <div className="text-xs mt-1 font-semibold">
                <p className="text-slate-900 font-bold">Healix Specialty Clinic</p>
                <p className="text-slate-400 text-[10px] mt-0.5">782 Wellness Blvd, Suite 204,</p>
                <p className="text-slate-400 text-[10px]">New York, NY 10012</p>
              </div>
            </div>

          </div>

        </div>

      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-6 mt-16 text-center text-xs text-slate-400">
        © 2026 Healix Healthcare. All rights reserved.
      </footer>

    </div>
  );
}
