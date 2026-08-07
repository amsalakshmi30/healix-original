"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import { supabase } from "@/lib/supabase";
import { getMediaStreamWithFallback } from "@/app/utils/mediaHelper";

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

  // QR Scanner States
  const [qrOpen, setQrOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [scannedDetails, setScannedDetails] = useState<any>(null);
  const [qrStream, setQrStream] = useState<MediaStream | null>(null);

  // SOS States
  const [sosOpen, setSosOpen] = useState(false);
  const [emergencyPhone, setEmergencyPhone] = useState("+919876543210");
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [tempPhone, setTempPhone] = useState("+919876543210");
  const [labResultsOpen, setLabResultsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [healthAlertsOpen, setHealthAlertsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("healix_emergency_phone");
      if (stored) {
        setEmergencyPhone(stored);
        setTempPhone(stored);
      }
    }
  }, []);

  const savePhone = () => {
    if (tempPhone.trim()) {
      setEmergencyPhone(tempPhone);
      localStorage.setItem("healix_emergency_phone", tempPhone);
      setIsEditingPhone(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/patient/login");
    }
  }, [user, router]);

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

  // QR Scanner actions
  const startCamera = async () => {
    setQrOpen(true);
    setCameraError("");
    setScanning(true);
    setScannedDetails(null);
    try {
      const { stream } = await getMediaStreamWithFallback({ video: { facingMode: "environment" } });
      setQrStream(stream);
      setTimeout(() => {
        const videoEl = document.getElementById("dashboard-qr-video") as HTMLVideoElement;
        if (videoEl) {
          videoEl.srcObject = stream;
        }
      }, 100);
      
      // Simulate scan process after 3 seconds
      setTimeout(() => {
        setScannedDetails({
          doctor: "Dr. Sarah Jenkins",
          room: "Virtual Clinic - Room #402",
          time: "2:30 PM - 3:00 PM"
        });
        setScanning(false);
      }, 3000);
    } catch (err: any) {
      console.error("Camera access denied or error:", err);
      setCameraError("Camera access was denied. Please check site permissions.");
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (qrStream) {
      qrStream.getTracks().forEach((track) => track.stop());
      setQrStream(null);
    }
    setScanning(false);
    setScannedDetails(null);
    setQrOpen(false);
  };

  // Download Prescription PDF method
  const downloadPrescription = async () => {
    try {
      const { data, error } = await supabase
        .from("prescriptions")
        .select("*")
        .eq("patient_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;
      if (!data || data.length === 0) {
        alert("No active prescriptions found in your account.");
        return;
      }

      const rx = data[0];
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Prescription - ${rx.medicine_name}</title>
              <style>
                body { font-family: sans-serif; padding: 40px; color: #1e293b; }
                .header { border-bottom: 2px solid #0f62fe; padding-bottom: 20px; margin-bottom: 30px; }
                .title { font-size: 24px; font-weight: bold; color: #0f62fe; }
                .doctor { font-size: 16px; font-weight: bold; margin-top: 5px; }
                .details { margin-bottom: 30px; font-size: 14px; color: #64748b; }
                .med-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
                .med-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin-bottom: 30px; }
                .notes { font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
                @media print {
                  .print-btn { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="title">HEALIX DIGITAL PRESCRIPTION</div>
                <div class="doctor">Prescribed by ${rx.doctor_name || "Healix Practitioner"}</div>
              </div>
              <div class="details">
                <strong>Patient ID:</strong> ${rx.patient_id}<br/>
                <strong>Date:</strong> ${new Date(rx.created_at).toLocaleDateString()}<br/>
                <strong>Status:</strong> ${rx.status}
              </div>
              <div class="med-box">
                <div class="med-title">${rx.medicine_name}</div>
                <div><strong>Dosage:</strong> ${rx.dosage}</div>
                <div style="margin-top: 10px;"><strong>Instructions:</strong> ${rx.instructions}</div>
              </div>
              <div class="notes">
                <strong>Clinical Notes:</strong><br/>
                ${rx.clinical_notes || "No additional clinical notes."}
              </div>
              <button class="print-btn" onclick="window.print()" style="margin-top: 30px; background: #0f62fe; color: white; border: none; padding: 10px 20px; font-weight: bold; border-radius: 8px; cursor: pointer;">Print / Save as PDF</button>
              <script>
                window.onload = function() { window.print(); }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } catch (err: any) {
      alert("Failed to retrieve prescription: " + err.message);
    }
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
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      
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
            <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0F62FE] flex items-center justify-center font-bold text-sm overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                "SJ"
              )}
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
            <button onClick={() => setHistoryOpen(true)} className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors w-full text-left">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              History
            </button>
            <Link href="/patient/prescription" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Prescriptions
            </Link>
            <button onClick={() => setHealthAlertsOpen(true)} className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors w-full text-left">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              Health Alerts
            </button>
          </nav>
        </div>

        {/* Bottom logout */}
        <div className="flex flex-col gap-1 text-slate-500 font-medium text-xs border-t border-slate-100 pt-6">
          <button onClick={logout} className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left font-bold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Good Morning, {user?.name ? user.name.split(" ")[0] : "Sarah"}</h1>
            <p className="text-slate-400 text-[11px] font-medium">Your health is looking great today.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input
                type="text"
                placeholder="Search metrics, reports..."
                className="w-full sm:w-60 pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0F62FE] bg-white font-medium"
              />
            </div>
            
            {/* Quick user avatar for mobile */}
            <div className="lg:hidden w-8 h-8 rounded-full bg-slate-100 overflow-hidden">
              <img src={user?.avatar || "/sarah-jenkins.jpg"} alt="avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Content Console */}
        <div className="p-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
          
          {/* Top Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Health Score Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Health Score</span>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">94<span className="text-xs text-[#0F62FE] font-bold">/100</span></p>
                <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 w-fit mt-1">Excellent</span>
              </div>
              <div className="w-16 h-16 rounded-full bg-[#0F62FE]/5 border-2 border-[#0F62FE] flex items-center justify-center font-black text-sm text-[#0F62FE]">
                A+
              </div>
            </div>

            {/* Heart Vitals Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Heart Vitals</span>
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

                <div onClick={() => setLabResultsOpen(true)} className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-blue-50/50 hover:border-blue-100 transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0F62FE] flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <span className="text-xs font-bold text-slate-800 text-left">Lab Results</span>
                </div>

                <div onClick={() => setSosOpen(true)} className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-red-50/50 hover:border-red-100 transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <span className="text-xs font-bold text-slate-800 text-left">SOS Contact</span>
                </div>

                <div onClick={startCamera} className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-blue-50/50 hover:border-blue-100 transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0F62FE] flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span className="text-xs font-bold text-slate-800 text-left">Scan QR</span>
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
                <div className="flex gap-3">
                  <button onClick={downloadPrescription} className="text-xs font-bold text-emerald-600 hover:underline">📄 Download Rx</button>
                  <button className="text-xs font-bold text-[#0F62FE] hover:underline">Full Schedule</button>
                </div>
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
                    72%
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Water Hydration</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{water}L of 2.5L Daily Goal</p>
                  </div>
                </div>
                <button 
                  onClick={() => setWater((prev) => Number((prev + 0.25).toFixed(2)))} 
                  className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0F62FE] font-extrabold text-sm flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>

              {/* Sleep tracker card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <span className="text-xl">🌙</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Sleep Analysis</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">7h 45m Restful Sleep last night</p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* QR Scanner Modal overlay */}
        {qrOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-2xl relative">
              <button 
                onClick={stopCamera}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
              <h3 className="text-base font-bold text-slate-900 mb-2">Scan Appointment QR</h3>
              <p className="text-slate-500 text-[11px] mb-4">Position the doctor's consultation QR code inside the camera reticle.</p>
              
              {cameraError ? (
                <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-200 mb-4 font-semibold">
                  {cameraError}
                </div>
              ) : (
                <div className="w-full aspect-square bg-slate-950 rounded-2xl overflow-hidden relative border border-slate-800 flex items-center justify-center text-white text-xs mb-4">
                  {/* Camera Video Stream */}
                  <video id="dashboard-qr-video" autoPlay playsInline muted className="w-full h-full object-cover absolute inset-0" />
                  
                  {/* Reticle */}
                  <div className="absolute inset-8 border-2 border-dashed border-[#0F62FE] rounded-xl pointer-events-none animate-pulse flex items-center justify-center">
                    <div className="w-full h-0.5 bg-red-500 absolute animate-bounce" />
                  </div>
                  
                  <span className="relative z-10 bg-black/50 px-3 py-1.5 rounded-full font-semibold text-[10px]">
                    {scanning ? "Scanning..." : "Camera initialized"}
                  </span>
                </div>
              )}

              {scannedDetails ? (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex flex-col gap-2">
                  <span className="text-emerald-800 text-xs font-bold">✓ Scan Successful!</span>
                  <div className="text-[11px] text-slate-600 font-semibold flex flex-col gap-1">
                    <div><strong>Doctor:</strong> {scannedDetails.doctor}</div>
                    <div><strong>Room:</strong> {scannedDetails.room}</div>
                    <div><strong>Scheduled:</strong> {scannedDetails.time}</div>
                  </div>
                  <button 
                    onClick={() => {
                      stopCamera();
                      router.push("/patient/waiting-room");
                    }}
                    className="bg-[#0F62FE] hover:bg-[#0353E9] text-white text-xs font-bold py-2.5 px-4 rounded-xl mt-2 transition-all w-full"
                  >
                    Join Waiting Room
                  </button>
                </div>
              ) : (
                <button 
                  onClick={startCamera}
                  disabled={scanning}
                  className="w-full bg-[#0F62FE] hover:bg-[#0353E9] text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:bg-blue-400"
                >
                  Start Scanning
                </button>
              )}
            </div>
          </div>
        )}

        {/* SOS Modal overlay */}
        {sosOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl relative">
              <button 
                onClick={() => {
                  setSosOpen(false);
                  setIsEditingPhone(false);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
              <h3 className="text-base font-bold text-slate-900 mb-2">Emergency Contact</h3>
              <p className="text-slate-500 text-[11px] mb-4">You can trigger a direct phone call to your configured medical responder.</p>
              
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex flex-col gap-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-red-700 uppercase tracking-wide">Emergency Number</span>
                  <button 
                    onClick={() => setIsEditingPhone(!isEditingPhone)} 
                    className="text-xs text-red-600 hover:underline font-bold"
                  >
                    {isEditingPhone ? "Cancel" : "Change"}
                  </button>
                </div>
                
                {isEditingPhone ? (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={tempPhone}
                      onChange={e => setTempPhone(e.target.value)}
                      className="flex-1 bg-white border border-red-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500"
                    />
                    <button 
                      onClick={savePhone}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <span className="text-lg font-extrabold text-slate-850 font-mono">{emergencyPhone}</span>
                )}
              </div>

              <a 
                href={`tel:${emergencyPhone}`}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                🚨 Call Now
              </a>
            </div>
          </div>
        )}

        {/* Lab Results Modal */}
        {labResultsOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-2xl relative">
              <button 
                onClick={() => setLabResultsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
              <h3 className="text-base font-bold text-slate-900 mb-2">Latest Lab Results</h3>
              <p className="text-slate-500 text-[11px] mb-4">Laboratory blood work reports from Quest Diagnostics, dated July 28, 2026.</p>
              
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                {[
                  { name: "Blood Glucose (Fasting)", value: "92 mg/dL", range: "70-100 mg/dL", status: "Normal", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
                  { name: "Hemoglobin A1c", value: "5.4%", range: "< 5.7%", status: "Normal", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
                  { name: "Total Cholesterol", value: "185 mg/dL", range: "< 200 mg/dL", status: "Normal", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
                  { name: "Triglycerides", value: "130 mg/dL", range: "< 150 mg/dL", status: "Normal", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
                  { name: "Vitamin D, 25-Hydroxy", value: "24 ng/mL", range: "30-100 ng/mL", status: "Low Warning", color: "bg-amber-50 text-amber-700 border-amber-200" },
                  { name: "White Blood Cells (WBC)", value: "5.8 K/uL", range: "4.5-11.0 K/uL", status: "Normal", color: "bg-emerald-50 text-emerald-700 border-emerald-100" }
                ].map((lab, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-slate-800">{lab.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">Normal range: {lab.range}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-extrabold text-slate-900">{lab.value}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${lab.color}`}>{lab.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Medical History Modal */}
        {historyOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-2xl relative">
              <button 
                onClick={() => setHistoryOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
              <h3 className="text-base font-bold text-slate-900 mb-2">Medical History & Encounters</h3>
              <p className="text-slate-500 text-[11px] mb-4">Historical record of medical diagnoses, checkups, and vaccinations.</p>
              
              <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Past Consultations</span>
                  <div className="flex flex-col gap-2">
                    {[
                      { date: "June 12, 2026", type: "Annual Physical checkup", provider: "Dr. Julianne Smith", status: "Completed" },
                      { date: "May 05, 2026", type: "Dental Hygiene checkup", provider: "Dr. Ray (Healix Dental)", status: "Completed" },
                      { date: "January 14, 2026", type: "Skin Pathology checkup", provider: "Dr. David Chen", status: "Completed" }
                    ].map((visit, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                        <div className="text-[11px] text-slate-600 font-semibold flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-slate-800">{visit.type}</span>
                          <span>{visit.provider} • {visit.date}</span>
                        </div>
                        <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">{visit.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Active Conditions & Operations</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Mild Hypertension (2025)", "Seasonal Allergies", "Appendectomy (2020)"].map((cond, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 border border-slate-200/80 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                        {cond}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Health Alerts Modal */}
        {healthAlertsOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl relative">
              <button 
                onClick={() => setHealthAlertsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
              <h3 className="text-base font-bold text-slate-900 mb-2">Active Health Alerts</h3>
              <p className="text-slate-500 text-[11px] mb-4">Personalized recommendations and clinical reminders.</p>
              
              <div className="flex flex-col gap-3">
                {[
                  { text: "Vitamin D level is slightly low (24 ng/mL). Daily D3 supplementation recommended.", type: "Warning", icon: "⚠️", color: "bg-amber-50 text-amber-800 border-amber-200" },
                  { text: "Upcoming Booster: Tdap vaccination booster is recommended this month.", type: "Reminder", icon: "🔔", color: "bg-blue-50 text-blue-800 border-blue-200" },
                  { text: "High pollen counts reported in your area. Keep your albuterol inhaler close.", type: "Pollen Warning", icon: "💡", color: "bg-emerald-50 text-emerald-800 border-emerald-200" }
                ].map((alertItem, idx) => (
                  <div key={idx} className={`p-4 border rounded-2xl flex gap-3 items-start ${alertItem.color}`}>
                    <span className="text-lg leading-none shrink-0">{alertItem.icon}</span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wide">{alertItem.type}</span>
                      <span className="text-xs font-bold leading-relaxed">{alertItem.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
