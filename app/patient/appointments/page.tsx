"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  reviews: string;
  experience: string;
  languages: string[];
  fee: string;
  avatar: string;
  desc: string;
}

export default function DoctorSearch() {
  const { setSelectedDoctor, logout } = useApp();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All Specializations");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("Adult Care");
  const [selectedTab, setSelectedTab] = useState("General");
  const [selectedRating, setSelectedRating] = useState(4.0);

  // Sample Doctor Data aligning with Figma mockups
  const doctors: Doctor[] = [
    {
      id: "sterling",
      name: "Dr. Alexander Sterling",
      specialization: "Senior Cardiologist • MBBS, MD, FACC",
      rating: 4.9,
      reviews: "1.2k Reviews",
      experience: "15+ Years Exp",
      languages: ["English", "Spanish", "French"],
      fee: "$150.00",
      avatar: "/doc-alex.jpg",
      desc: "Dr. Alexander Sterling is a board-certified cardiologist with over 15 years of experience in interventional cardiology and preventative heart health.",
    },
    {
      id: "jenkins",
      name: "Dr. Sarah Jenkins",
      specialization: "Senior Cardiologist",
      rating: 4.9,
      reviews: "950 Reviews",
      experience: "12 yrs exp",
      languages: ["English", "Spanish"],
      fee: "$180.00",
      avatar: "/doc-sarah.jpg",
      desc: "Passionate about preventative heart health and long term vascular wellness.",
    },
    {
      id: "thorne",
      name: "Dr. Marcus Thorne",
      specialization: "Neurology Specialist",
      rating: 4.8,
      reviews: "820 Reviews",
      experience: "15 yrs exp",
      languages: ["English", "German"],
      fee: "$210.00",
      avatar: "/doc-marcus.jpg",
      desc: "Specializing in sleep disorders, migraine therapies, and neuro-oncology diagnostics.",
    },
    {
      id: "rodriguez",
      name: "Dr. Elena Rodriguez",
      specialization: "Pediatric Surgeon",
      rating: 5.0,
      reviews: "1.4k Reviews",
      experience: "8 yrs exp",
      languages: ["English", "Spanish"],
      fee: "$195.00",
      avatar: "/doc-elena.jpg",
      desc: "Expert in minimally invasive pediatric care and neonatal surgery protocols.",
    },
    {
      id: "chen",
      name: "Dr. David Chen",
      specialization: "Dermatology Lead",
      rating: 4.7,
      reviews: "600 Reviews",
      experience: "20 yrs exp",
      languages: ["English", "Mandarin"],
      fee: "$160.00",
      avatar: "/doc-chen.jpg",
      desc: "Specializing in aesthetic dermatology, skin pathology, and oncological treatments.",
    }
  ];

  const handleViewProfile = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    router.push("/patient/doctor-profile");
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpec = selectedSpecialization === "All Specializations" || 
                        doc.specialization.includes(selectedSpecialization);
    return matchesSearch && matchesSpec;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Link href="/patient/dashboard" className="flex items-center gap-2 text-2xl font-bold text-[#0F62FE]">
            <svg className="w-8 h-8 text-[#0F62FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Healix</span>
          </Link>
          <span className="hidden md:inline text-xs font-semibold text-slate-400 border-l border-slate-200 pl-3">
            Find Doctor
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/patient/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-800">
            Back to Dashboard
          </Link>
          <button onClick={logout} className="text-xs font-bold text-red-600 hover:underline">
            Sign Out
          </button>
        </div>
      </header>

      {/* Outer Content Layout (Sidebar + Main grid) */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col lg:flex-row gap-8 flex-1">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 bg-white border border-slate-200/60 p-6 rounded-2xl shrink-0 shadow-sm self-start flex flex-col gap-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-900">Filters</span>
            <button 
              onClick={() => {
                setSelectedSpecialization("All Specializations");
                setSearchQuery("");
                setSelectedRating(4.0);
              }} 
              className="text-[10px] font-bold text-slate-400 hover:text-[#0F62FE]"
            >
              Clear all
            </button>
          </div>

          {/* Specialization Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specialization</label>
            <select 
              value={selectedSpecialization} 
              onChange={e => setSelectedSpecialization(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:outline-none"
            >
              <option>All Specializations</option>
              <option>Cardiologist</option>
              <option>Neurology</option>
              <option>Pediatric</option>
              <option>Dermatology</option>
            </select>
          </div>

          {/* Fee Range Filter */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Fee Range</span>
              <span className="text-[#0F62FE] font-bold">$50 - $250+</span>
            </div>
            <input type="range" min="50" max="250" className="w-full accent-[#0F62FE]" defaultValue="180" />
          </div>

          {/* Experience Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience</label>
            <div className="flex flex-wrap gap-2">
              {["0-5 yrs", "5-10 yrs", "10-15 yrs", "15+ yrs"].map((exp, idx) => (
                <button 
                  key={idx} 
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${exp === "10-15 yrs" ? "bg-blue-50 text-[#0F62FE] border-blue-200" : "bg-slate-50 text-slate-600 border-slate-200/80"} hover:bg-slate-100 transition-colors`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          {/* Language Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Language</label>
            <div className="flex flex-col gap-2 text-xs text-slate-600 font-semibold">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-[#0F62FE]" />
                English
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded text-[#0F62FE]" />
                Spanish
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded text-[#0F62FE]" />
                Mandarin
              </label>
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Minimum Rating</label>
            <div className="flex items-center gap-1.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, idx) => (
                <svg key={idx} className={`w-4 h-4 ${idx < 4 ? 'fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs font-bold text-slate-500 ml-1.5">4.0+</span>
            </div>
          </div>
        </aside>

        {/* Main Search Panel */}
        <main className="flex-1 flex flex-col gap-6">
          
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <h2 className="text-2xl font-extrabold text-slate-950">Search Doctors</h2>
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input 
                type="text" 
                placeholder="Search by name, clinic, or condition..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#0F62FE]"
              />
            </div>
          </div>

          {/* Primary Tabs selector */}
          <div className="flex border-b border-slate-200 text-xs font-bold text-slate-400 gap-6">
            {["General", "Specialist", "Browse by Hospital"].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setSelectedTab(tab)}
                className={`pb-3 relative transition-all ${selectedTab === tab ? "text-[#0F62FE]" : "hover:text-slate-700"}`}
              >
                {tab}
                {selectedTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0F62FE] rounded-t-full" />}
              </button>
            ))}
          </div>

          {/* Age-based Selection Cards */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Age-based Selection</span>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Pediatric", ages: "0-12 Years" },
                { name: "Teen Care", ages: "13-18 Years" },
                { name: "Adult Care", ages: "19-60 Years" },
                { name: "Senior Care", ages: "60+ Years" }
              ].map((age, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAgeGroup(age.name)}
                  className={`p-4 rounded-xl border text-left flex flex-col gap-1 transition-all ${selectedAgeGroup === age.name ? "bg-white border-[#0F62FE] shadow-sm text-slate-900" : "bg-slate-50 border-slate-200/70 text-slate-500 hover:bg-slate-100/50"}`}
                >
                  <span className="text-xs font-bold">{age.name}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{age.ages}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Doctors Grid Listing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc) => (
                <div key={doc.id} className="bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    {/* Header: Photo and Info */}
                    <div className="flex items-start gap-4">
                      {/* Placeholder for Doctor Avatar */}
                      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
                        <div className="font-bold text-slate-600 text-base uppercase">
                          {doc.name.split(" ").slice(-1)[0][0]}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-bold text-slate-950 truncate">{doc.name}</h4>
                          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                            ★ {doc.rating}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#0F62FE] font-bold mt-0.5 truncate">{doc.specialization}</p>
                        
                        {/* Little details */}
                        <div className="flex gap-3 text-[10px] text-slate-400 font-semibold mt-2.5">
                          <span>{doc.experience}</span>
                          <span>•</span>
                          <span>{doc.languages.join(", ")}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-500 text-xs leading-relaxed my-4 line-clamp-2">
                      {doc.desc}
                    </p>
                  </div>

                  {/* Pricing and Action */}
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-2">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Fee</span>
                      <p className="text-sm font-extrabold text-slate-900 leading-none mt-0.5">
                        {doc.fee} <span className="text-[10px] text-slate-400 font-medium font-sans">/ consultation</span>
                      </p>
                    </div>

                    <button 
                      onClick={() => handleViewProfile(doc)}
                      className="bg-[#0F62FE] hover:bg-[#0353E9] text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm transition-all shrink-0"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-16 bg-white border border-slate-200 rounded-2xl text-slate-400 text-sm">
                No doctors match your active filters.
              </div>
            )}
          </div>

          {/* Show More */}
          <button className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 mt-4 mx-auto py-2.5">
            Show more results
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </button>

        </main>

      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6 mt-16">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <span className="flex items-center gap-2 text-xl font-bold text-[#0F62FE]">
              <svg className="w-6 h-6 text-[#0F62FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Healix</span>
            </span>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
              Your premium sanctuary for digital wellness and world-class healthcare access.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2.5 text-slate-500 text-sm">
              <Link href="/patient/appointments" className="hover:underline">Find a Doctor</Link>
              <Link href="#" className="hover:underline">Book Lab Test</Link>
              <Link href="#" className="hover:underline">Virtual Care</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider mb-4">Contact Info</h4>
            <div className="flex flex-col gap-2.5 text-slate-500 text-sm">
              <span>care@healix.com</span>
              <span>1-800-HEALIX-01</span>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider mb-4">Newsletter</h4>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-[#F8FAFC] w-full focus:outline-none" 
              />
              <button className="bg-[#0F62FE] hover:bg-[#0353E9] text-white p-2 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto w-full border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row justify-between text-xs text-slate-400">
          <span>© 2026 Healix Healthcare. All rights reserved.</span>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
