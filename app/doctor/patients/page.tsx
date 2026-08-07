"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import { supabase } from "@/lib/supabase";

export default function DoctorPatients() {
  const { user, logout, doctorProfile, setActiveConsultationPatient } = useApp();
  const router = useRouter();

  const [patients, setPatients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/doctor/login");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        // Query profiles table where role is patient
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "patient");

        if (data && data.length > 0) {
          setPatients(data);
        } else {
          // Default pre-seeded patients list
          setPatients([
            {
              id: "pat-1",
              full_name: "Sarah Jenkins",
              age: 29,
              gender: "Female",
              email: "patient@healix.com",
              phone_number: "+1 555-019-2834",
              blood_type: "A+",
              weight: "58 kg",
              conditions: "Mild Hypertension"
            },
            {
              id: "pat-2",
              full_name: "Michael Scott",
              age: 45,
              gender: "Male",
              email: "michael@dundermifflin.com",
              phone_number: "+1 555-013-4412",
              blood_type: "O+",
              weight: "74 kg",
              conditions: "High Blood Pressure"
            },
            {
              id: "pat-3",
              full_name: "Pam Beesly",
              age: 34,
              gender: "Female",
              email: "pam@dundermifflin.com",
              phone_number: "+1 555-018-9124",
              blood_type: "B-",
              weight: "60 kg",
              conditions: "Seasonal Allergies"
            },
            {
              id: "pat-4",
              full_name: "Jim Halpert",
              age: 35,
              gender: "Male",
              email: "jim@dundermifflin.com",
              phone_number: "+1 555-019-2345",
              blood_type: "AB+",
              weight: "80 kg",
              conditions: "General Fitness Tracker"
            },
            {
              id: "pat-5",
              full_name: "Liam Chen",
              age: 34,
              gender: "Male",
              email: "liam@healix.com",
              phone_number: "+1 555-019-8829",
              blood_type: "A+",
              weight: "82 kg",
              conditions: "Chronic Fatigue"
            }
          ]);
        }
      } catch (err) {
        console.error("Error loading patient records:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handlePrescribe = (patient: any) => {
    setActiveConsultationPatient({
      name: patient.full_name || patient.name || "Patient",
      age: patient.age || 34,
      gender: patient.gender || "Female",
      id: patient.id || "HX-12345",
      bloodType: patient.blood_type || "A+",
      weight: patient.weight || "70 kg"
    });
    router.push("/doctor/medication-details");
  };

  const filteredPatients = patients.filter((p) => {
    const name = (p.full_name || p.name || "").toLowerCase();
    const email = (p.email || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

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
            <Link href="/doctor/appointments" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Appointments
            </Link>
            <Link href="/doctor/patients" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-blue-50 text-[#0f62fe] font-bold">
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
            <h1 className="text-xl font-bold text-slate-900">Patients Records</h1>
            <p className="text-slate-400 text-[10px] font-medium font-bold">Search and view active patient healthcare diagnostics.</p>
          </div>
          
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
            <input 
              type="text" 
              placeholder="Search by name, email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:bg-white"
            />
          </div>
        </header>

        <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Patient Directory</h3>
            
            {loading ? (
              <p className="text-xs text-slate-500 font-medium">Loading patient directory...</p>
            ) : filteredPatients.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium">No patient profiles match the query.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="pb-3 pt-1">Name</th>
                      <th className="pb-3 pt-1">Contact Info</th>
                      <th className="pb-3 pt-1">Vitals (Age/Gen)</th>
                      <th className="pb-3 pt-1">Blood/Weight</th>
                      <th className="pb-3 pt-1">Clinical Conditions</th>
                      <th className="pb-3 pt-1 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((p, idx) => (
                      <tr key={p.id || idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 font-bold text-slate-900 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                            {(p.full_name || p.name || "P").split(" ").map((n: string) => n[0]).join("").slice(0,2).toUpperCase()}
                          </div>
                          <span>{p.full_name || p.name}</span>
                        </td>
                        <td className="py-4 text-slate-600 font-medium">
                          <div>{p.email}</div>
                          <div className="text-[10px] text-slate-400">{p.phone_number || "No Phone"}</div>
                        </td>
                        <td className="py-4 text-slate-500 font-semibold">{p.age || "N/A"} yrs • {p.gender || "N/A"}</td>
                        <td className="py-4 text-slate-800 font-bold">{p.blood_type || "A+"} • {p.weight || "70 kg"}</td>
                        <td className="py-4">
                          <span className="bg-blue-50 text-[#0F62FE] border border-blue-100 text-[9px] font-bold px-2.5 py-0.5 rounded-lg">
                            {p.conditions || "Wellness Tracker"}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handlePrescribe(p)}
                            className="bg-[#0F62FE] hover:bg-[#0353E9] text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg shadow-sm transition-all"
                          >
                            Prescribe Rx
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
    </div>
  );
}
