"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import { supabase } from "@/lib/supabase";

export default function DoctorAppointments() {
  const { user, logout, doctorProfile, setActiveConsultationPatient } = useApp();
  const router = useRouter();

  const [appointmentsList, setAppointmentsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/doctor/login");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("appointments")
          .select("*")
          .eq("doctor_id", user.id);

        if (data && data.length > 0) {
          setAppointmentsList(data);
        } else {
          // Seeding some default appointments if none are found
          setAppointmentsList([
            {
              id: "appt-default-1",
              patient_name: "Michael Scott",
              date: "Today",
              time: "10:30 AM - 11:00 AM",
              room: "Virtual Clinic - Room #101",
              fee: "$150.00",
              status: "Scheduled"
            },
            {
              id: "appt-default-2",
              patient_name: "Pam Beesly",
              date: "Today",
              time: "11:30 AM - 12:00 PM",
              room: "Virtual Clinic - Room #402",
              fee: "$150.00",
              status: "Scheduled"
            },
            {
              id: "appt-default-3",
              patient_name: "Jim Halpert",
              date: "Tomorrow",
              time: "02:00 PM - 02:30 PM",
              room: "Virtual Clinic - Room #305",
              fee: "$150.00",
              status: "Scheduled"
            }
          ]);
        }
      } catch (err) {
        console.error("Error loading doctor appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user]);

  const handleStartConsultation = (appt: any) => {
    setActiveConsultationPatient({
      name: appt.patient_name || "Patient",
      age: appt.patient_name === "Michael Scott" ? 45 : appt.patient_name === "Pam Beesly" ? 34 : 35,
      gender: appt.patient_name === "Michael Scott" ? "Male" : appt.patient_name === "Pam Beesly" ? "Female" : "Male",
      id: "HX-88291",
      bloodType: "O+",
      weight: "74 kg"
    });
    router.push("/doctor/waiting-room");
  };

  const initials = (user?.name || "Dr. Julianne Smith")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
            <Link href="/doctor/appointments" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-blue-50 text-[#0f62fe] font-bold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Appointments
            </Link>
            <Link href="/doctor/patients" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Patients
            </Link>
            <Link href="/doctor/analytics" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
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
            <h1 className="text-xl font-bold text-slate-900">Appointments Schedule</h1>
            <p className="text-slate-400 text-[10px] font-medium">Hello, {user?.name || "Dr. Smith"}. View and manage your patient visits.</p>
          </div>
        </header>

        <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Patient Visits List</h3>
            
            {loading ? (
              <p className="text-xs text-slate-500 font-medium">Loading appointments...</p>
            ) : appointmentsList.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium">No appointments scheduled.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="pb-3 pt-1">Patient Name</th>
                      <th className="pb-3 pt-1">Scheduled Time</th>
                      <th className="pb-3 pt-1">Consultation Room</th>
                      <th className="pb-3 pt-1">Fee</th>
                      <th className="pb-3 pt-1">Status</th>
                      <th className="pb-3 pt-1 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentsList.map((appt, idx) => (
                      <tr key={appt.id || idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 font-bold text-slate-900">{appt.patient_name}</td>
                        <td className="py-4 text-slate-600 font-medium">{appt.date} • {appt.time}</td>
                        <td className="py-4 text-slate-500 font-semibold">{appt.room}</td>
                        <td className="py-4 text-slate-800 font-bold">{appt.fee || "$150.00"}</td>
                        <td className="py-4">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold px-2 py-0.5 rounded">
                            {appt.status || "Scheduled"}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleStartConsultation(appt)}
                            className="bg-[#008A5E] hover:bg-[#00704c] text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg shadow-sm transition-all"
                          >
                            Join Call
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-400 lg:hidden">
        © 2026 Healix Healthcare. All rights reserved.
      </footer>
    </div>
  );
}
