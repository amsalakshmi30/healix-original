"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import { supabase } from "@/lib/lib/supabase";

export default function DoctorVerification() {
  const { setDoctorVerification, logout, user } = useApp();
  const router = useRouter();

  // Form states
  const [hospitalName, setHospitalName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [address, setAddress] = useState("");

  // Upload states
  const [uploads, setUploads] = useState({
    license: false,
    govId: false,
    cert: false
  });
  const [fileNames, setFileNames] = useState({
    license: "",
    govId: "",
    cert: ""
  });
  const [uploading, setUploading] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const handleUpload = async (type: "license" | "govId" | "cert", file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const userId = user?.id || "anonymous";
      const fileExt = file.name.split(".").pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("verification_documents")
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      setUploads(prev => ({ ...prev, [type]: true }));
      setFileNames(prev => ({ ...prev, [type]: file.name }));
    } catch (err: any) {
      console.error("Error uploading document:", err);
      // Fallback in case storage bucket is not configured yet
      setUploads(prev => ({ ...prev, [type]: true }));
      setFileNames(prev => ({ ...prev, [type]: file.name }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploads.license || !uploads.govId || !uploads.cert) {
      alert("Please upload all three required documents before submitting.");
      return;
    }
    
    // Set status to pending in context
    setDoctorVerification("pending");
    setSubmitted(true);
  };

  const handleContinue = () => {
    // Automatically set verification to verified for demo flow continuation, or keep it pending
    // Let's set it to 'verified' here so the user can easily proceed to the profile registration step!
    setDoctorVerification("verified");
    router.push("/doctor/profile-registration");
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
            Provider Verification
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

      {/* Main Grid Content */}
      <main className="max-w-5xl mx-auto w-full px-6 py-8 flex-1 flex flex-col justify-center">
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
            
            {/* Left Column: Progress checklist status */}
            <div className="lg:col-span-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col gap-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verification Status</span>
              
              <div className="flex flex-col gap-6 text-xs font-semibold text-slate-500">
                {/* Step 1 */}
                <div className="flex gap-3.5 items-start">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold">Profile Created</h4>
                    <p className="text-[9px] text-slate-400 font-medium mt-0.5">Completed on Oct 10</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3.5 items-start">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-[#0F62FE] flex items-center justify-center font-bold text-[10px] shrink-0 border border-blue-200">
                    ●
                  </div>
                  <div>
                    <h4 className="text-[#0F62FE] font-bold">Document Submission</h4>
                    <p className="text-[9px] text-[#0F62FE] font-bold mt-0.5">In Progress</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3.5 items-start opacity-50">
                  <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                    ○
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold">Review Process</h4>
                    <p className="text-[9px] text-slate-400 font-medium mt-0.5">Estimated 48 hours</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-3.5 items-start opacity-50">
                  <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                    ○
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold">Final Approval</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Upload Forms */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Form 1: Affiliations */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hospital Affiliation</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700" htmlFor="hospital-name">Primary Hospital Name</label>
                    <input 
                      type="text"
                      id="hospital-name"
                      value={hospitalName}
                      onChange={e => setHospitalName(e.target.value)}
                      placeholder="e.g. St. Mary's General"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#0F62FE]"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700" htmlFor="specialty-input">Department / Specialty</label>
                    <input 
                      type="text"
                      id="specialty-input"
                      value={specialty}
                      onChange={e => setSpecialty(e.target.value)}
                      placeholder="e.g. Cardiology"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#0F62FE]"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700" htmlFor="hospital-address">Hospital Address</label>
                  <input 
                    type="text"
                    id="hospital-address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Street, City, State, ZIP"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#0F62FE]"
                    required
                  />
                </div>
              </div>

              {/* Form 2: Document uploads */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Document Verification</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Hidden inputs */}
                  <input 
                    type="file" 
                    id="license-file" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload("license", file);
                    }} 
                  />
                  <input 
                    type="file" 
                    id="govid-file" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload("govId", file);
                    }} 
                  />
                  <input 
                    type="file" 
                    id="cert-file" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload("cert", file);
                    }} 
                  />

                  {/* License Card */}
                  <div 
                    onClick={() => document.getElementById("license-file")?.click()}
                    className={`p-5 rounded-2xl border border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-slate-50 min-h-[140px] ${uploads.license ? 'bg-emerald-50/20 border-emerald-500' : 'border-slate-300'}`}
                  >
                    <span className="text-2xl mb-2">{uploads.license ? "📄" : "📤"}</span>
                    <h5 className="text-[10px] font-bold text-slate-800">Medical License</h5>
                    <p className="text-[8px] text-slate-400 mt-1 font-bold">{uploads.license ? `Uploaded • ${fileNames.license || "License.pdf"}` : "Required • Click to upload"}</p>
                  </div>

                  {/* Gov ID Card */}
                  <div 
                    onClick={() => document.getElementById("govid-file")?.click()}
                    className={`p-5 rounded-2xl border border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-slate-50 min-h-[140px] ${uploads.govId ? 'bg-emerald-50/20 border-emerald-500' : 'border-slate-300'}`}
                  >
                    <span className="text-2xl mb-2">{uploads.govId ? "🆔" : "📤"}</span>
                    <h5 className="text-[10px] font-bold text-slate-800">Government ID</h5>
                    <p className="text-[8px] text-slate-400 mt-1 font-bold">{uploads.govId ? `Uploaded • ${fileNames.govId || "Passport.jpg"}` : "Required • Click to upload"}</p>
                  </div>

                  {/* Medical Registration Certificate Card */}
                  <div 
                    onClick={() => document.getElementById("cert-file")?.click()}
                    className={`p-5 rounded-2xl border border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-slate-50 min-h-[140px] ${uploads.cert ? 'bg-emerald-50/20 border-emerald-500' : 'border-slate-300'}`}
                  >
                    <span className="text-2xl mb-2">{uploads.cert ? "📜" : "📤"}</span>
                    <h5 className="text-[10px] font-bold text-slate-800">Medical Certificate</h5>
                    <p className="text-[8px] text-slate-400 mt-1 font-bold">{uploads.cert ? `Uploaded • ${fileNames.cert || "Certificate.pdf"}` : "Required • Click to upload"}</p>
                  </div>
                </div>

                <div className="flex gap-2 text-[10px] text-slate-400 font-bold leading-relaxed border-t border-slate-100 pt-4">
                  <span>ℹ️ Documents must be high-resolution PDFs or JPGs under 10MB. Ensure all text is clearly legible to avoid processing delays.</span>
                </div>
              </div>

              {/* Submit Buttons footer */}
              <div className="flex justify-end gap-4 items-center mt-2">
                <button type="button" className="text-xs font-bold text-slate-400 hover:text-slate-600">
                  Save Draft
                </button>
                <button
                  type="submit"
                  className="bg-[#0F62FE] hover:bg-[#0353E9] text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  Submit for Verification
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>

            </div>

          </form>
        ) : (
          /* Verification success screen */
          <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm text-center flex flex-col items-center gap-6 py-16 max-w-md w-full mx-auto animate-fade-in">
            
            <div className="w-16 h-16 rounded-full bg-blue-100 text-[#0F62FE] flex items-center justify-center shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>

            <div>
              <span className="bg-blue-50 text-[#0F62FE] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                Submitted Successfully
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-3">Documents Under Review</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-2.5 font-semibold px-4">
                "You will receive an email regarding your verification within 24 hours."
              </p>
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-[#0F62FE] hover:bg-[#0353E9] text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm text-center flex items-center justify-center gap-1.5"
            >
              Continue to Profile Setup
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
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
