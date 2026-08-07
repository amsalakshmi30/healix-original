"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import { supabase } from "@/lib/supabase";
import { getMediaStreamWithFallback } from "@/app/utils/mediaHelper";

interface ChatMessage {
  sender: "doctor" | "patient";
  text: string;
  time: string;
}

export default function VideoCall() {
  const { logout, user } = useApp();
  const router = useRouter();

  // Control toggles
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Chat message simulator
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "doctor", text: "Hello! I can see your latest vitals. How have you been feeling today?", time: "10:01 AM" },
    { sender: "patient", text: "A bit better, but the fatigue is still persistent in the mornings.", time: "10:03 AM" }
  ]);
  const [newMsg, setNewMsg] = useState("");

  // Handle active media stream in the call
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    const startMedia = async () => {
      if (!camOff) {
        try {
          const { stream } = await getMediaStreamWithFallback({
            video: true,
            audio: !micMuted
          });
          activeStream = stream;
          setMediaStream(activeStream);
          setTimeout(() => {
            const videoEl = document.getElementById("call-self-video") as HTMLVideoElement;
            if (videoEl) {
              videoEl.srcObject = activeStream;
            }
          }, 100);
        } catch (err) {
          console.error("Camera access failed inside consultation:", err);
        }
      } else {
        if (mediaStream) {
          mediaStream.getTracks().forEach((t) => t.stop());
          setMediaStream(null);
        }
      }
    };
    startMedia();
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [camOff, micMuted]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMsg.trim()) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages([...messages, { sender: "patient", text: newMsg, time: timeStr }]);
      setNewMsg("");
      
      // Simulate doctor auto response after 1.5 seconds
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "doctor", text: "Understood. I am going to adjust your Lisinopril dosage in your digital prescription form now.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
      }, 1500);
    }
  };

  const handleEndCall = async () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }

    // Save Consultation details in Supabase before exiting
    try {
      if (user?.id) {
        await supabase.from("consultations").insert({
          patient_id: user.id,
          doctor_name: "Dr. Sarah Jenkins",
          room_id: "Room-#402",
          status: "completed",
          notes: "Patient reported persistent morning fatigue. Lisinopril dosage adjusted."
        });
      }
    } catch (err) {
      console.error("Error saving consultation logs in Supabase:", err);
    }

    router.push("/patient/dashboard");
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9] overflow-hidden font-sans text-slate-800">
      
      {/* Outer wrapper: Main Video grid + Sidebar chat */}
      <div className="flex flex-1 w-full relative">
        
        {/* Left Side: Call Interface */}
        <div className="flex-1 flex flex-col p-6 justify-between relative h-full">
          
          {/* Main Video Frame */}
          <div className="flex-1 bg-slate-900 rounded-3xl overflow-hidden relative border border-slate-800 shadow-md">
            
            {/* Main Video Feed (Doctor Image Mockup) */}
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: "url('/doc-sarah.jpg')", backgroundSize: 'cover', backgroundPosition: 'center 20%' }}
            >
              {/* Fallback Doctor screen overlay */}
              <div className="absolute inset-0 bg-slate-950/10 flex flex-col justify-between p-6">
                
                {/* Doctor name tag */}
                <div className="flex justify-between items-start">
                  <span className="bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                    ● Dr. Sarah Jenkins
                  </span>
                </div>

                {/* Self preview inset in top right */}
                {!camOff && (
                  <div className="absolute top-6 right-6 w-32 aspect-video bg-slate-800 border-2 border-white/20 rounded-2xl overflow-hidden shadow-lg z-10">
                    <video id="call-self-video" autoPlay playsInline muted className="w-full h-full object-cover bg-slate-900" />
                  </div>
                )}

              </div>
            </div>

            {/* Bottom Controls Bar Overlay */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
              <div className="bg-black/65 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-4 shadow-xl">
                
                {/* Mic button */}
                <button 
                  onClick={() => setMicMuted(!micMuted)} 
                  className={`w-11 h-11 rounded-full flex flex-col items-center justify-center border transition-all text-white ${micMuted ? 'bg-red-500/80 border-red-600' : 'bg-white/10 border-white/10 hover:bg-white/20'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  <span className="text-[7px] uppercase font-bold mt-0.5">{micMuted ? 'Muted' : 'Mute'}</span>
                </button>

                {/* Camera button */}
                <button 
                  onClick={() => setCamOff(!camOff)} 
                  className={`w-11 h-11 rounded-full flex flex-col items-center justify-center border transition-all text-white ${camOff ? 'bg-red-500/80 border-red-600' : 'bg-white/10 border-white/10 hover:bg-white/20'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  <span className="text-[7px] uppercase font-bold mt-0.5">{camOff ? 'Off' : 'Camera'}</span>
                </button>

                {/* Share screen button */}
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

        {/* Right Side: Chat & Doctor Notes Sidebar */}
        <aside className="w-80 bg-white border-l border-slate-200 h-full flex flex-col justify-between shrink-0 shadow-sm">
          
          {/* Chat header area */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">Live Chat</span>
              <span className="bg-blue-50 text-[#0F62FE] text-[8px] font-bold px-1.5 py-0.5 rounded border border-blue-100 uppercase tracking-wide">
                Secure
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400">Consultation Session</span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {messages.map((msg, idx) => {
              const isPatient = msg.sender === "patient";
              return (
                <div key={idx} className={`flex flex-col ${isPatient ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-2xl text-xs max-w-[220px] font-semibold leading-relaxed ${isPatient ? 'bg-[#0F62FE] text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold mt-1 px-1">{msg.time}</span>
                </div>
              );
            })}
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:bg-white"
            />
            <button type="submit" className="bg-[#0F62FE] hover:bg-[#0353E9] text-white p-2 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </form>

          {/* Doctor's Notes Widget */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/70">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-slate-800">📋 Doctor's Notes</span>
            </div>
            <ul className="flex flex-col gap-2 text-[10px] text-slate-500 font-bold list-disc pl-4">
              <li>Adjust medication dosage to 10mg.</li>
              <li>Schedule follow-up blood test.</li>
              <li>Monitoring fatigue levels...</li>
            </ul>
          </div>

        </aside>

      </div>

    </div>
  );
}
