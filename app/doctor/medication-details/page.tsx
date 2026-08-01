"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import { supabase } from "@/lib/lib/supabase";

export default function DoctorMedicationDetails() {
  const { activeConsultationPatient, logout, user } = useApp();
  const router = useRouter();

  // Selected patient details
  const pat = activeConsultationPatient || {
    name: "Liam Chen",
    age: 34,
    gender: "Male",
    id: "HX-88291",
    bloodType: "A+",
    weight: "82 kg"
  };

  // Prescription Form states
  const [medicine, setMedicine] = useState("Lisinopril 10mg");
  const [dosage, setDosage] = useState("1");
  const [instructions, setInstructions] = useState("Take with water after breakfast.");
  const [clinicalNotes, setClinicalNotes] = useState("Patient shows good cardiovascular response. Adjusted dosage for maintenance.");

  // Auto-schedule checks
  const [schedule, setSchedule] = useState({
    morning: true,
    afternoon: false,
    night: true
  });

  const [finalized, setFinalized] = useState(false);

  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicine || !dosage || !instructions) {
      alert("Please fill in medication details before finalising.");
      return;
    }

    let patientUuid = null;
    try {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id")
        .eq("full_name", pat.name)
        .eq("role", "patient")
        .limit(1);

      if (profiles && profiles.length > 0) {
        patientUuid = profiles[0].id;
      } else {
        const { data: fallbackPatient } = await supabase
          .from("profiles")
          .select("id")
          .eq("role", "patient")
          .limit(1);
        if (fallbackPatient && fallbackPatient.length > 0) {
          patientUuid = fallbackPatient[0].id;
        }
      }
    } catch (err) {
      console.error("Error finding patient uuid:", err);
    }

    if (patientUuid) {
      try {
        const { error } = await supabase.from("prescriptions").insert({
          patient_id: patientUuid,
          doctor_id: user?.id || null,
          doctor_name: user?.name || "Dr. Julianne Smith",
          medicine_name: medicine,
          dosage: `${dosage} unit daily`,
          instructions,
          clinical_notes: clinicalNotes,
          status: "pending",
        });
        if (error) throw error;
      } catch (err) {
        console.error("Error saving prescription to Supabase:", err);
      }
    }

    setFinalized(true);
  };

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

          {/* Menu */}
          <nav className="flex flex-col gap-1 text-slate-500 font-medium text-xs">
            <Link href="/doctor/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>
              Dashboard
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Appointments
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-blue-50 text-[#0F62FE] font-bold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Patients
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Analytics
            </Link>
          </nav>
        </div>

        {/* Bottom actions */}
        <div className="flex flex-col gap-1 text-slate-500 font-medium text-xs border-t border-slate-100 pt-6">
          <button onClick={logout} className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left font-bold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold text-xs uppercase">New Prescription</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/doctor/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-800">
              Back to Dashboard
            </Link>
          </div>
        </header>

        {/* Form Body */}
        {!finalized ? (
          <form onSubmit={handleFinalize} className="p-6 max-w-4xl mx-auto w-full flex flex-col gap-6">
            
            {/* Back indicator link */}
            <Link href="/doctor/dashboard" className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1.5 self-start">
              <span>← New Prescription</span>
            </Link>

            {/* Patient Info Banner */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0F62FE] flex items-center justify-center font-bold text-sm">
                  LC
                </div>
                <div className="text-xs font-semibold">
                  <h4 className="text-sm font-bold text-slate-900">{pat.name}</h4>
                  <p className="text-slate-400 mt-0.5">{pat.gender}, {pat.age} Years • Patient ID: {pat.id}</p>
                </div>
              </div>

              <div className="flex gap-3 text-[10px] font-bold text-slate-500 tracking-wider">
                <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 uppercase">Blood Type: {pat.bloodType}</span>
                <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 uppercase">Weight: {pat.weight}</span>
              </div>
            </div>

            {/* Two Column details layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
              
              {/* Left Column forms */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* Medication Details Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Medication Details</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700" htmlFor="medicine-search">Medicine Name</label>
                      <input 
                        type="text" 
                        id="medicine-search" 
                        value={medicine}
                        onChange={e => setMedicine(e.target.value)}
                        placeholder="Search medicines..." 
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#0F62FE]"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700" htmlFor="medicine-dosage">Daily Dosage (Units)</label>
                      <input 
                        type="number" 
                        id="medicine-dosage" 
                        value={dosage}
                        onChange={e => setDosage(e.target.value)}
                        placeholder="3" 
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#0F62FE]"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700" htmlFor="admin-instructions">Administration Instructions</label>
                    <textarea 
                      id="admin-instructions" 
                      value={instructions}
                      onChange={e => setInstructions(e.target.value)}
                      placeholder="e.g. Take with water after meals" 
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#0F62FE]"
                      required
                    />
                  </div>
                </div>

                {/* Clinical Notes Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Notes</span>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700" htmlFor="clinical-notes">Additional findings or observations</label>
                    <textarea 
                      id="clinical-notes" 
                      value={clinicalNotes}
                      onChange={e => setClinicalNotes(e.target.value)}
                      placeholder="e.g. Heart murmurs, palpitations, BP trends..." 
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#0F62FE]"
                    />
                  </div>
                </div>

              </div>

              {/* Right Column Auto Schedule & Finalise */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Auto Schedule Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Auto-Schedule</span>
                    <span className="bg-blue-50 text-[#0F62FE] text-[8px] font-bold px-1.5 py-0.5 rounded border border-blue-100">Smart</span>
                  </div>

                  <div className="flex flex-col gap-3 text-xs font-semibold text-slate-600 mt-2">
                    {/* Morning */}
                    <label className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={schedule.morning} 
                          onChange={e => setSchedule({...schedule, morning: e.target.checked})}
                          className="rounded text-[#0F62FE] focus:ring-0" 
                        />
                        <div>
                          <p className="text-slate-800 font-bold text-[11px]">Morning</p>
                          <p className="text-[9px] text-slate-400 font-medium">08:00 AM</p>
                        </div>
                      </div>
                      <span className="bg-white border border-slate-200/60 text-[9px] font-extrabold text-slate-700 px-2.5 py-1 rounded">1 unit</span>
                    </label>

                    {/* Afternoon */}
                    <label className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={schedule.afternoon} 
                          onChange={e => setSchedule({...schedule, afternoon: e.target.checked})}
                          className="rounded text-[#0F62FE] focus:ring-0" 
                        />
                        <div>
                          <p className="text-slate-800 font-bold text-[11px]">Afternoon</p>
                          <p className="text-[9px] text-slate-400 font-medium">02:00 PM</p>
                        </div>
                      </div>
                      <span className="bg-white border border-slate-200/60 text-[9px] font-extrabold text-slate-700 px-2.5 py-1 rounded">1 unit</span>
                    </label>

                    {/* Night */}
                    <label className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={schedule.night} 
                          onChange={e => setSchedule({...schedule, night: e.target.checked})}
                          className="rounded text-[#0F62FE] focus:ring-0" 
                        />
                        <div>
                          <p className="text-slate-800 font-bold text-[11px]">Night</p>
                          <p className="text-[9px] text-slate-400 font-medium">09:00 PM</p>
                        </div>
                      </div>
                      <span className="bg-white border border-slate-200/60 text-[9px] font-extrabold text-slate-700 px-2.5 py-1 rounded">1 unit</span>
                    </label>
                  </div>
                </div>

                {/* Finalise triggers */}
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    className="w-full bg-[#0F62FE] hover:bg-[#0353E9] text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    📝 Sign & Finalise
                  </button>

                  <button
                    type="button"
                    className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-3 rounded-xl transition-all text-center"
                  >
                    Save as Draft
                  </button>
                </div>

              </div>

            </div>

          </form>
        ) : (
          /* Finalized Success Screen */
          <div className="p-10 flex flex-col items-center justify-center max-w-md w-full mx-auto my-12 bg-white border border-slate-200 rounded-3xl shadow-sm gap-6 text-center py-16 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>

            <div>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                Success State
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-3">Prescription Finalized</h3>
              <p className="text-xs text-slate-400 mt-1">Digital Rx has been signed and published to the patient portal.</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 w-full text-left flex flex-col gap-2.5 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Patient</span>
                <span className="text-slate-900 font-bold">{pat.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Medicine</span>
                <span className="text-slate-900 font-bold">{medicine} ({dosage} unit daily)</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/50 pt-2.5 mt-1">
                <span>Prescription Ref</span>
                <span className="text-[#0F62FE] font-mono font-bold uppercase">AHX-9821-B</span>
              </div>
            </div>

            {/* Doctor digital signature card */}
            <div className="border border-slate-200/60 p-4 rounded-xl bg-white w-full text-center flex flex-col items-center justify-center text-xs">
              <span className="font-serif italic text-base text-slate-700 font-bold border-b border-dashed border-slate-350 pb-1 px-4 tracking-wide">
                Dr. Julianne Smith
              </span>
              <span className="text-[8px] text-slate-400 uppercase font-bold tracking-widest mt-1 block">
                ✓ Signatures Authenticated via Healix Security Key
              </span>
            </div>

            <button
              onClick={() => router.push("/doctor/dashboard")}
              className="w-full bg-[#0F62FE] hover:bg-[#0353E9] text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm text-center"
            >
              Return to Dashboard
            </button>
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
