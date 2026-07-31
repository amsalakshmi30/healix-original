"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "./context/AppContext";

export default function Home() {
  const { isLoggedIn, user, logout } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterSubscribed(false);
        setNewsletterEmail("");
      }, 3000);
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setContactForm({ name: "", email: "", message: "" });
      }, 3000);
    }
  };

  const faqs = [
    {
      q: "How do I book a consultation?",
      a: "Simply login to your patient account, click on 'Appointments', filter or search for your preferred doctor, select an available date and time slot, and finalize payment to confirm your booking."
    },
    {
      q: "Are my medical records safe?",
      a: "Yes, Healix uses industry-standard end-to-end encryption. All medical histories and consultations are strictly confidential and HIPAA compliant."
    },
    {
      q: "Does Healix work with insurance?",
      a: "We partner with leading insurance providers. You can add your provider details during appointment checkout to automatically apply coverage calculations."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-[#0F62FE]">
          <svg className="w-8 h-8 text-[#0F62FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Healix</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#services" className="hover:text-[#0F62FE] transition-colors">Services</a>
          <a href="#how-it-works" className="hover:text-[#0F62FE] transition-colors">How It Works</a>
          <a href="#faqs" className="hover:text-[#0F62FE] transition-colors">FAQ</a>
          <a href="#contact" className="hover:text-[#0F62FE] transition-colors">Contact</a>
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn && user ? (
            <div className="flex items-center gap-3">
              <Link 
                href={user.type === "patient" ? "/patient/dashboard" : "/doctor/dashboard"} 
                className="text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
              >
                Go to Portal
              </Link>
              <button 
                onClick={logout} 
                className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline px-2 py-1"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link 
              href="/login-request" 
              className="bg-[#0F62FE] text-white hover:bg-[#0353E9] text-sm font-semibold px-6 py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
            >
              Log In
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6 max-w-xl">
          <span className="text-sm font-semibold tracking-wider text-[#0F62FE] bg-blue-50 px-3.5 py-1.5 rounded-full w-fit">
            VIRTUAL MEDICAL CARE
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
            Healthcare, <br />
            <span className="text-[#0F62FE]">Anytime.</span> <br />
            Anywhere.
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Connect instantly with top certified doctors, access security-first digital prescriptions, and manage your health records in a seamless, futuristic space.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <Link 
              href={isLoggedIn && user?.type === "patient" ? "/patient/appointments" : "/login-request"} 
              className="bg-[#0F62FE] text-white hover:bg-[#0353E9] px-8 py-3.5 rounded-lg text-base font-semibold shadow-md transition-all duration-200"
            >
              Book Appointment
            </Link>
            <a 
              href="#how-it-works" 
              className="border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 px-8 py-3.5 rounded-lg text-base font-semibold transition-all duration-200"
            >
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-200 mt-4">
            <div>
              <p className="text-3xl font-extrabold text-slate-950">99%+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Satisfaction</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-950">100+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expert Doctors</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-950">24/7</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Consultations</p>
            </div>
          </div>
        </div>

        {/* Doctor Banner Mockup */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="w-full max-w-[540px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 p-4">
            <div className="relative aspect-video rounded-xl bg-slate-100 overflow-hidden group">
              {/* Fake Video Call Frame */}
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/doc-sarah.jpg')", backgroundSize: 'cover', backgroundPosition: 'center 20%' }}>
                {/* Fallback stylized doctor illustration if image is loading/missing */}
                <div className="absolute inset-0 bg-slate-900/10 flex flex-col justify-between p-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-emerald-500 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Live Consultation
                    </span>
                    <span className="bg-black/40 text-white text-xs font-semibold px-2 py-1 rounded backdrop-blur-sm">
                      Connection: Excellent
                    </span>
                  </div>
                  
                  {/* Doctor Info Card */}
                  <div className="bg-white/95 backdrop-blur-sm p-3.5 rounded-lg shadow flex items-center gap-3.5 max-w-sm self-start">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm">
                      DS
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-950">Dr. Sarah Jenkins</h4>
                      <p className="text-xs text-slate-500">Senior Cardiologist • MBBS, MD</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Redefining Experience */}
      <section className="bg-white py-16 px-6 border-y border-slate-100">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-12">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-3">
            <h2 className="text-3xl font-extrabold text-slate-950">Redefining the patient experience</h2>
            <p className="text-slate-600 text-sm">We provide an intuitive, security-first virtual clinical experience tailored to your wellness needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F8FAFC] border border-slate-100 p-8 rounded-2xl flex flex-col gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-[#0F62FE]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-950">Personalized Care Plans</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Tailored consultation profiles with diagnostic tracking, dietary alerts, and medicine timetables built for you.</p>
            </div>
            
            <div className="bg-[#F8FAFC] border border-slate-100 p-8 rounded-2xl flex flex-col gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-[#0F62FE]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-950">24/7 Care Access</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Book slots with international specialists in multiple departments any hour, from the comfort of home.</p>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-100 p-8 rounded-2xl flex flex-col gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-[#0F62FE]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-950">Rapid Response</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Instantly obtain verified digital prescriptions, check out securely, and get medications delivered rapidly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-950">Our Medical Services</h2>
            <p className="text-slate-500 text-sm mt-1">Access specialized practitioner care through virtual consultations.</p>
          </div>
          <Link href={isLoggedIn && user?.type === "patient" ? "/patient/appointments" : "/login-request"} className="text-sm font-bold text-[#0F62FE] hover:underline">
            View All Services →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Cardiology Consult", desc: "Expert heart and vascular assessment from board-certified cardiac specialists.", bg: "from-blue-500 to-indigo-600" },
            { title: "Pediatric Clinic", desc: "Friendly pediatric consultations focusing on childhood development and therapy.", bg: "from-purple-500 to-pink-600" },
            { title: "General Practitioner", desc: "Daily medical consults, prescription checkups, and diagnosis updates.", bg: "from-teal-500 to-emerald-600" }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col">
              <div className={`h-40 bg-gradient-to-br ${item.bg} p-6 flex flex-col justify-end text-white`}>
                <h3 className="text-xl font-bold">{item.title}</h3>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{item.desc}</p>
                <Link href={isLoggedIn && user?.type === "patient" ? "/patient/appointments" : "/login-request"} className="text-sm font-bold text-[#0F62FE] hover:text-[#0353E9] flex items-center gap-1.5">
                  Book Slot
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4 Simple Steps */}
      <section id="how-it-works" className="bg-slate-100 py-16 px-6">
        <div className="max-w-7xl mx-auto w-full text-center">
          <h2 className="text-3xl font-extrabold text-slate-950 mb-12">Your Health Journey in 4 Simple Steps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Book Appointment", desc: "Search specialists, view profile reviews, and pick an active time slot." },
              { step: "02", title: "Receive Reminder", desc: "Receive email and calendar alerts ahead of your scheduled videolink." },
              { step: "03", title: "Meet Online", desc: "Enter the waiting room, run camera checks, and start your consultation." },
              { step: "04", title: "Get Prescription", desc: "Download sign-approved digital Rx forms and order medicine to home." }
            ].map((step, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/50 flex flex-col gap-3 relative text-left">
                <span className="text-4xl font-extrabold text-blue-100 absolute right-6 top-4">{step.step}</span>
                <h3 className="text-base font-bold text-slate-900 mt-2">{step.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section id="faqs" className="py-16 px-6 max-w-3xl mx-auto w-full">
        <h2 className="text-3xl font-extrabold text-slate-950 text-center mb-10">Common Questions</h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button 
                onClick={() => toggleFaq(index)} 
                className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-slate-950 hover:bg-slate-50/50 transition-colors"
              >
                <span>{faq.q}</span>
                <svg 
                  className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${activeFaq === index ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeFaq === index && (
                <div className="px-6 pb-5 pt-1 text-slate-500 text-sm leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white py-16 px-6 border-t border-slate-100">
        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col justify-center gap-4">
            <h2 className="text-3xl font-extrabold text-slate-950">Get in touch with us</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Have questions about registration, license verification, or insurance coverage? Our customer assistance desk operates 24/7.
            </p>
            <div className="flex flex-col gap-3 mt-4 text-sm text-slate-500">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-[#0F62FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>1-800-HEALIX-01</span>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-[#0F62FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span>care@healix.com</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitContact} className="bg-[#F8FAFC] border border-slate-200/50 p-6 rounded-2xl flex flex-col gap-4">
            {submitted ? (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-8 rounded-xl text-center flex flex-col items-center gap-2 py-16">
                <svg className="w-10 h-10 text-emerald-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h4 className="font-bold">Message Submitted!</h4>
                <p className="text-xs text-emerald-600">We will respond within the next 2 hours.</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-name" className="text-xs font-bold text-slate-700">Full Name</label>
                  <input 
                    type="text" 
                    id="contact-name" 
                    value={contactForm.name} 
                    onChange={e => setContactForm({...contactForm, name: e.target.value})}
                    placeholder="Enter your name" 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:border-[#0F62FE]"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-email" className="text-xs font-bold text-slate-700">Email Address</label>
                  <input 
                    type="email" 
                    id="contact-email" 
                    value={contactForm.email} 
                    onChange={e => setContactForm({...contactForm, email: e.target.value})}
                    placeholder="name@company.com" 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:border-[#0F62FE]"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-message" className="text-xs font-bold text-slate-700">Message</label>
                  <textarea 
                    id="contact-message" 
                    value={contactForm.message} 
                    onChange={e => setContactForm({...contactForm, message: e.target.value})}
                    placeholder="Describe your question..." 
                    rows={4} 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:border-[#0F62FE]"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="bg-[#0F62FE] hover:bg-[#0353E9] text-white font-semibold text-sm py-3 rounded-lg mt-2 shadow transition-all"
                >
                  Send Message
                </button>
              </>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12 px-6">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <span className="flex items-center gap-2 text-xl font-bold text-[#0F62FE]">
              <svg className="w-6 h-6 text-[#0F62FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Healix</span>
            </span>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
              Redefining the healthcare experience through technology and human-centric design.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2.5 text-slate-500 text-sm">
              <a href="#services" className="hover:underline">About Us</a>
              <a href="#how-it-works" className="hover:underline">Careers</a>
              <a href="#faqs" className="hover:underline">Press Kit</a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider mb-4">Support</h4>
            <div className="flex flex-col gap-2.5 text-slate-500 text-sm">
              <a href="#faqs" className="hover:underline">Help Center</a>
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider mb-4">Newsletter</h4>
            {newsletterSubscribed ? (
              <p className="text-emerald-600 text-xs font-bold animate-pulse">✓ Subscribed successfully!</p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input 
                  type="email" 
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="Email" 
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-[#F8FAFC] w-full focus:outline-none" 
                  required
                />
                <button type="submit" className="bg-[#0F62FE] hover:bg-[#0353E9] text-white p-2 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </form>
            )}
          </div>
        </div>
        <div className="max-w-7xl mx-auto w-full border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row justify-between text-xs text-slate-400">
          <span>© 2026 Healix Healthcare. All rights reserved.</span>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
