"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import { supabase } from "@/lib/lib/supabase";

export default function DoctorProfileRegistration() {
  const { setDoctorProfile, logout, user } = useApp();
  const router = useRouter();

  // Profile fields state
  const [name, setName] = useState("Dr. Julianne Smith");
  const [specialization, setSpecialization] = useState("Cardiologist");
  const [hospital, setHospital] = useState("Central Health Memorial");
  const [experience, setExperience] = useState("10");
  const [fee, setFee] = useState("150.00");
  const [bio, setBio] = useState("Briefly describe your medical philosophy and background...");
  const [languages, setLanguages] = useState(["English", "Spanish"]);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Slots state selection
  const [slots, setSlots] = useState({
    MON: ["09:00 AM", "10:00 AM"],
    TUE: ["09:00 AM", "11:00 AM"],
    WED: ["10:00 AM"],
    THU: ["10:00 AM"],
    FRI: ["09:00 AM"]
  });

  const handleAvatarUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const userId = user?.id || "anonymous";
      const fileExt = file.name.split(".").pop();
      const fileName = `avatar_${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
    } catch (err: any) {
      console.error("Error uploading avatar:", err);
      alert("Error uploading avatar: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !specialization || !hospital) {
      alert("Please fill in all core professional details.");
      return;
    }

    // Save profile to context state
    await setDoctorProfile({
      name,
      specialization,
      hospital,
      experience,
      languages,
      fee,
      bio,
      slots: {
        "MON 21": slots.MON,
        "TUE 22": slots.TUE,
        "WED 23": slots.WED,
        "THU 24": slots.THU,
        "FRI 25": slots.FRI
      }
    });

    if (user?.id) {
      try {
        const updatePayload: any = {};
        if (avatarUrl) updatePayload.avatar_url = avatarUrl;
        if (name) updatePayload.full_name = name;
        
        await supabase
          .from("profiles")
          .update(updatePayload)
          .eq("id", user.id);
      } catch (err) {
        console.error("Error updating profile avatar/name in Supabase:", err);
      }
    }

    router.push("/doctor/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Link href="/doctor/dashboard" className="flex items-center gap-2 text-2xl font-bold text-[#0F62FE]">
            <svg className="w-8 h-8 text-[#0F62FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Healix Provider</span>
          </Link>
          <span className="hidden md:inline text-xs font-semibold text-slate-400 border-l border-slate-200 pl-3">
            Profile Setup
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/doctor/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-800">
            Back to Dashboard
          </Link>
          <button onClick={logout} className="text-xs font-bold text-red-600 hover:underline">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-6">
        
        {/* Breadcrumb path */}
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <span>Provider Portal</span>
          <span>&gt;</span>
          <span className="text-slate-600">Provider Registration</span>
        </div>

        {/* Profile Card */}
        <form onSubmit={handlePublish} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col gap-8">
          
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Set Up Your Profile</h2>
            <p className="text-slate-400 text-xs mt-1">Complete your professional details to begin connecting with patients on the Healix network.</p>
          </div>

          {/* Grid fields */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-8 border-b border-slate-100">
            {/* Avatar Photo Slot */}
            <div className="md:col-span-3 flex flex-col items-center gap-3">
              <input 
                type="file" 
                id="avatar-file" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAvatarUpload(file);
                }} 
              />
              <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-2xl relative shadow-inner overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  "👩‍⚕️"
                )}
                <button 
                  type="button" 
                  onClick={() => document.getElementById("avatar-file")?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#0F62FE] text-white border-2 border-white flex items-center justify-center text-xs shadow-sm cursor-pointer"
                >
                  ✏️
                </button>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">{uploading ? "Uploading..." : "Profile Photo (JPG/PNG, max 2MB)"}</span>
            </div>

            {/* Inputs grid */}
            <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="doctor-fullname">Full Name</label>
                <input 
                  type="text" 
                  id="doctor-fullname" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Dr. Julianne Smith" 
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#0F62FE]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="doctor-specialization">Specialization</label>
                <input 
                  type="text" 
                  id="doctor-specialization" 
                  value={specialization} 
                  onChange={e => setSpecialization(e.target.value)}
                  placeholder="e.g. Cardiologist" 
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#0F62FE]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="doctor-hospital">Primary Hospital</label>
                <input 
                  type="text" 
                  id="doctor-hospital" 
                  value={hospital} 
                  onChange={e => setHospital(e.target.value)}
                  placeholder="e.g. Central Health Memorial" 
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#0F62FE]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="doctor-exp">Years of Experience</label>
                <input 
                  type="number" 
                  id="doctor-exp" 
                  value={experience} 
                  onChange={e => setExperience(e.target.value)}
                  placeholder="e.g. 10" 
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#0F62FE]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Languages and Fees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-slate-100">
            {/* Languages */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">Languages Spoken</span>
              <div className="flex flex-wrap gap-2 items-center">
                {languages.map((lang) => (
                  <span key={lang} className="bg-blue-50 text-[#0F62FE] text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-1.5 shadow-sm">
                    {lang}
                    <button type="button" onClick={() => setLanguages(languages.filter(l => l !== lang))} className="text-blue-400 hover:text-blue-600 font-bold text-[10px]">×</button>
                  </span>
                ))}
                <button type="button" onClick={() => setLanguages([...languages, prompt("Enter language:") || "French"])} className="border border-dashed border-slate-300 text-slate-500 hover:bg-slate-50 text-[10px] font-bold px-3 py-1.5 rounded-lg">
                  + Add Language
                </button>
              </div>
            </div>

            {/* Fee */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700" htmlFor="doctor-regfee">Consultation Fee ($)</label>
              <input 
                type="text" 
                id="doctor-regfee" 
                value={fee} 
                onChange={e => setFee(e.target.value)}
                placeholder="150.00" 
                className="w-full max-w-xs px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#0F62FE]"
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1.5 pb-8 border-b border-slate-100">
            <label className="text-xs font-bold text-slate-700" htmlFor="doctor-bio">Professional Bio</label>
            <textarea 
              id="doctor-bio" 
              value={bio} 
              onChange={e => setBio(e.target.value)}
              rows={4} 
              placeholder="Briefly describe your medical philosophy and background..." 
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#0F62FE]"
              required
            />
          </div>

          {/* Available Slots Selector Grid */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                📅 Available Time Slots
              </span>
              <span className="text-[10px] text-slate-400 font-bold">Oct 21 - Oct 27, 2024</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mt-2">
              {[
                { key: "MON", label: "MON 21", items: slots.MON },
                { key: "TUE", label: "TUE 22", items: slots.TUE },
                { key: "WED", label: "WED 23", items: slots.WED },
                { key: "THU", label: "THU 24", items: slots.THU },
                { key: "FRI", label: "FRI 25", items: slots.FRI }
              ].map((day, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 text-center">{day.label}</span>
                  <div className="flex flex-col gap-1.5 mt-1">
                    {day.items.map((time, tIdx) => (
                      <span key={tIdx} className="bg-blue-100 border border-blue-200 text-[#0F62FE] text-[10px] font-bold py-1.5 rounded-md text-center shadow-sm">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button type="button" className="text-xs font-bold text-[#0F62FE] hover:underline self-start mt-2">
              Manage Advanced Recurring Schedule
            </button>
          </div>

          {/* Publish Trigger footer */}
          <div className="flex justify-end gap-4 items-center border-t border-slate-100 pt-6 mt-4">
            <button type="button" className="text-xs font-bold text-slate-400 hover:text-slate-600">
              Discard Draft
            </button>
            <button
              type="submit"
              className="bg-[#0F62FE] hover:bg-[#0353E9] text-white font-bold text-xs py-3.5 px-6 rounded-xl transition-all shadow-sm flex items-center gap-1"
            >
              Save and Publish Profile
            </button>
          </div>

        </form>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-400">
        © 2026 Healix Healthcare. All rights reserved.
      </footer>
    </div>
  );
}
