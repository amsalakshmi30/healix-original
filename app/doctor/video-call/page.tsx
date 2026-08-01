"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";

export default function DoctorVideoCall() {
  const { logout, activeConsultationPatient } = useApp();
  const router = useRouter();

  // Control toggles
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const pat = activeConsultationPatient || {
    name: "Liam Chen",
    age: 34,
    gender: "Male",
    id: "HX-88291",
    bloodType: "A+",
    weight: "82 kg"
  };

  const requestPermissions = async () => {
    try {
      setHasPermission(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setHasPermission(true);
      setMediaStream(stream);
      streamRef.current = stream;

      // Apply initial toggles
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = !micMuted;

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = !camOff;

      setTimeout(() => {
        const videoEl = document.getElementById("doctor-self-video") as HTMLVideoElement;
        if (videoEl) {
          videoEl.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Camera/Mic access failed inside practitioner consultation:", err);
      setHasPermission(false);
    }
  };

  // Video and voice consultation camera setup on mount
  useEffect(() => {
    requestPermissions();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Update track enabled state on control toggles
  useEffect(() => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = !micMuted;
    }
  }, [micMuted, mediaStream]);

  useEffect(() => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = !camOff;
    }
  }, [camOff, mediaStream]);

  const handleEndCall = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    router.push("/doctor/medication-details");
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9] overflow-hidden font-sans text-slate-800">
      
      {/* Outer wrapper */}
      <div className="flex flex-1 w-full relative">
        
        {/* Left Side: Patient video feed */}
        <div className="flex-1 flex flex-col p-6 justify-between relative h-full">
          
          <div className="flex-1 bg-slate-900 rounded-3xl overflow-hidden relative border border-slate-800 shadow-md">
            
            {/* Main Video (Patient Image / Placeholder) */}
            {hasPermission === false ? (
              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-red-500 font-semibold gap-3 p-6 text-center">
                <span className="text-3xl">⚠️</span>
                <p className="text-sm font-bold text-white">Camera & Microphone Access Denied</p>
                <p className="text-xs text-slate-400 max-w-xs">Please allow camera and microphone permissions in your browser settings to proceed with the video consultation.</p>
                <button 
                  onClick={requestPermissions}
                  className="mt-2 bg-[#0F62FE] hover:bg-[#0353E9] text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Retry Permission Request
                </button>
              </div>
            ) : (
              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-slate-500 font-semibold gap-3">
                <div className="w-20 h-20 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-2xl shadow-md border border-slate-700">
                  {pat.name.split(" ").slice(-1)[0][0] || "P"}
                </div>
                <p className="text-sm font-bold text-white">{pat.name} (Patient Video Feed Active)</p>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider animate-pulse">● Live Telehealth Feed</p>
              </div>
            )}

            {/* Video overlay headers */}
            <div className="absolute top-6 left-6 z-10 flex justify-between w-full pr-12">
              <span className="bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                ● Live consultation room
              </span>
              <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow backdrop-blur-sm">
                Connection: Excellent
              </span>
            </div>

            {/* Inset Self View */}
            {!camOff && hasPermission === true && (
              <div className="absolute top-6 right-6 w-32 aspect-video bg-slate-800 border-2 border-white/20 rounded-2xl overflow-hidden shadow-lg z-10">
                <video id="doctor-self-video" autoPlay playsInline muted className="w-full h-full object-cover bg-slate-905" />
              </div>
            )}

            {/* Bottom Call Controls Overlay */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
              <div className="bg-black/65 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-4 shadow-xl">
                
                {/* Mic */}
                <button 
                  onClick={() => setMicMuted(!micMuted)} 
                  disabled={hasPermission !== true}
                  className={`w-11 h-11 rounded-full flex flex-col items-center justify-center border transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed ${micMuted ? 'bg-red-500/80 border-red-600' : 'bg-white/10 border-white/10 hover:bg-white/20'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  <span className="text-[7px] uppercase font-bold mt-0.5">{micMuted ? 'Muted' : 'Mute'}</span>
                </button>

                {/* Camera */}
                <button 
                  onClick={() => setCamOff(!camOff)} 
                  disabled={hasPermission !== true}
                  className={`w-11 h-11 rounded-full flex flex-col items-center justify-center border transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed ${camOff ? 'bg-red-500/80 border-red-600' : 'bg-white/10 border-white/10 hover:bg-white/20'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  <span className="text-[7px] uppercase font-bold mt-0.5">{camOff ? 'Off' : 'Camera'}</span>
                </button>

                {/* Share */}
                <button className="w-11 h-11 rounded-full flex flex-col items-center justify-center border border-white/10 bg-white/10 text-white hover:bg-white/20 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <span className="text-[7px] uppercase font-bold mt-0.5">Share</span>
                </button>

                <div className="w-[1px] h-8 bg-white/20" />

                {/* Red End Call button */}
                <button 
                  onClick={handleEndCall}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-full flex items-center gap-1.5 shadow transition-all border border-red-700"
                >
                  <svg className="w-4 h-4 transform rotate-135" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span className="text-xs font-bold uppercase tracking-wider">End Call</span>
                </button>

              </div>
            </div>

          </div>

        </div>

        {/* Right Side: Patient Vitals & History sidebar */}
        <aside className="w-80 bg-white border-l border-slate-200 h-full flex flex-col justify-between shrink-0 shadow-sm overflow-y-auto">
          
          <div className="flex flex-col gap-6">
            
            {/* Header Status */}
            <div className="bg-[#0f62fe] text-white p-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider block">Patient is ready</span>
            </div>

            {/* Profile */}
            <div className="p-4 border-b border-slate-100 flex flex-col gap-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Details</span>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm">
                  {pat.name.split(" ").slice(-1)[0][0] || "P"}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{pat.name}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">ID: {pat.id} • {pat.gender}, {pat.age}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 mt-3 text-xs font-semibold text-slate-500">
                <div className="flex justify-between">
                  <span>Appointment Time</span>
                  <span className="text-slate-800 font-bold">Today, 2:30 PM - 3:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Reason for Visit</span>
                  <span className="text-slate-800 font-bold">Cardiovascular Follow-up</span>
                </div>
              </div>
            </div>

            {/* Vitals */}
            <div className="px-4 py-2 border-b border-slate-100 flex flex-col gap-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vitals & History</span>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Blood Pressure</span>
                  <p className="text-base font-extrabold text-emerald-600 mt-1">120/80</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Heart Rate</span>
                  <p className="text-base font-extrabold text-emerald-600 mt-1">72 bpm</p>
                </div>
              </div>
            </div>

            {/* Clinical summary */}
            <div className="p-4 flex flex-col gap-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Medical History</span>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Patient reports consistent improvement in exercise tolerance after starting new regimen. No episodes of palpitations noted in last 48 hours.
              </p>
              
              <button className="text-xs font-bold text-[#0F62FE] hover:underline self-start mt-2">
                View Full Medical Record &gt;
              </button>
            </div>

          </div>

          <div className="p-4 text-center border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase">
            🛡️ HIPAA Compliant Session
          </div>

        </aside>

      </div>

    </div>
  );
}
