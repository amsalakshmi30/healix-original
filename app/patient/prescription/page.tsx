"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";

export default function PrescriptionCart() {
  const { prescriptionCart, updateCartQuantity, clearCart, logout } = useApp();
  const router = useRouter();

  // Tab state
  const [activeTab, setActiveTab] = useState("clinic");
  
  // Checkout options
  const [address, setAddress] = useState("home");
  
  // Payment states: 'cart' | 'scanning' | 'success'
  const [checkoutState, setCheckoutState] = useState<"cart" | "scanning" | "success">("cart");

  // Calculations
  const subtotal = prescriptionCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const serviceFee = prescriptionCart.length > 0 ? 2.00 : 0;
  const total = subtotal + serviceFee;

  const handleCheckout = () => {
    setCheckoutState("scanning");
  };

  useEffect(() => {
    if (checkoutState === "scanning") {
      const timer = setTimeout(() => {
        setCheckoutState("success");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [checkoutState]);

  const handleProceedToRx = () => {
    clearCart();
    router.push("/patient/prescription-success");
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

          {/* Menu */}
          <nav className="flex flex-col gap-1 text-slate-500 font-medium text-xs">
            <Link href="/patient/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>
              Dashboard
            </Link>
            <Link href="/patient/appointments" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Appointments
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              History
            </Link>
            <Link href="/patient/prescription" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-blue-50 text-[#0F62FE] font-bold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Prescriptions
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              Health Alerts
            </Link>
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
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Pharmacy & Medicine</h1>
            <p className="text-slate-400 text-[10px] font-medium">Manage your prescriptions and choose your preferred delivery method.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/patient/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-800">
              Back to Dashboard
            </Link>
          </div>
        </header>

        {/* Content Container */}
        {checkoutState === "cart" && (
          <div className="p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left side: Cart List */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Tab Selector */}
              <div className="flex gap-4 border-b border-slate-200 text-xs font-bold text-slate-400">
                <button 
                  onClick={() => setActiveTab("clinic")}
                  className={`pb-3 relative ${activeTab === "clinic" ? 'text-[#0F62FE]' : 'hover:text-slate-700'}`}
                >
                  Order from Clinic
                  {activeTab === "clinic" && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0F62FE] rounded-t-full" />}
                </button>
                <button 
                  onClick={() => setActiveTab("external")}
                  className={`pb-3 relative ${activeTab === "external" ? 'text-[#0F62FE]' : 'hover:text-slate-700'}`}
                >
                  External Pharmacy
                  {activeTab === "external" && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0F62FE] rounded-t-full" />}
                </button>
              </div>

              {/* Cart Items list */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Your Prescription Cart</h3>
                  <span className="bg-blue-50 text-[#0F62FE] text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
                    {prescriptionCart.length} Items Pending
                  </span>
                </div>

                {prescriptionCart.length > 0 ? (
                  <div className="flex flex-col gap-4 divide-y divide-slate-100">
                    {prescriptionCart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center pt-4 first:pt-0">
                        <div className="flex items-start gap-4">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0F62FE] flex items-center justify-center font-bold text-xs shrink-0">
                            💊
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{item.duration} • {item.dosage}</p>
                          </div>
                        </div>

                        {/* Adjusters */}
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/60 p-1 rounded-lg">
                            <button 
                              onClick={() => updateCartQuantity(item.id, -1)}
                              className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center font-bold text-xs hover:bg-slate-100"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQuantity(item.id, 1)}
                              className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center font-bold text-xs hover:bg-slate-100"
                            >
                              +
                            </button>
                          </div>
                          
                          <span className="text-xs font-extrabold text-slate-900 w-16 text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400">
                    Prescription cart is empty.
                  </div>
                )}

                {/* Subtotals computation */}
                {prescriptionCart.length > 0 && (
                  <div className="border-t border-slate-100 pt-6 flex flex-col gap-2.5 text-xs text-slate-500 font-semibold align-bottom">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-slate-800 font-bold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Fee (Healix Care)</span>
                      <span className="text-slate-800 font-bold">${serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#0F62FE] font-extrabold border-t border-slate-100 pt-4 mt-2">
                      <span>Total Amount</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Orders Section */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Orders</span>
                
                <div className="border border-slate-100 p-4 rounded-2xl bg-slate-50/50 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">ORDER #HLX-89021</span>
                      <span className="bg-emerald-50 text-emerald-700 text-[8px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 uppercase">
                        In Transit
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">Vitamins & Supplements</p>
                  </div>
                  
                  {/* Progress Line */}
                  <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
                    <span className="text-blue-500">Ordered</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-blue-500">Prepared</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-blue-500">Shipping</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" />
                    <span>Delivered</span>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold">Estimated Arrival</p>
                    <p className="text-xs font-extrabold text-slate-800 mt-0.5">Today, 6:00 PM</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right side: Checkout panel */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                <h3 className="text-sm font-bold text-slate-900">Checkout Details</h3>
                
                {/* Delivery address checkboxes */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Delivery Address</span>
                  
                  {/* Home */}
                  <label className={`p-4 border rounded-xl flex items-start gap-3 cursor-pointer transition-all ${address === "home" ? 'border-[#0F62FE] bg-blue-50/20' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input 
                      type="radio" 
                      name="delivery-addr" 
                      checked={address === "home"}
                      onChange={() => setAddress("home")}
                      className="text-[#0F62FE] focus:ring-0 mt-0.5" 
                    />
                    <div className="text-[10px] font-semibold">
                      <p className="text-slate-900 font-bold">🏠 Home</p>
                      <p className="text-slate-400 mt-0.5">1248 Medical Parkway, Suite 200,</p>
                      <p className="text-slate-400">San Francisco, CA 94103</p>
                    </div>
                  </label>

                  {/* Office */}
                  <label className={`p-4 border rounded-xl flex items-start gap-3 cursor-pointer transition-all ${address === "office" ? 'border-[#0F62FE] bg-blue-50/20' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input 
                      type="radio" 
                      name="delivery-addr"
                      checked={address === "office"}
                      onChange={() => setAddress("office")}
                      className="text-[#0F62FE] focus:ring-0 mt-0.5" 
                    />
                    <div className="text-[10px] font-semibold">
                      <p className="text-slate-900 font-bold">🏢 Office</p>
                      <p className="text-slate-400 mt-0.5">450 Tech Plaza, Floor 12,</p>
                      <p className="text-slate-400">San Francisco, CA 94105</p>
                    </div>
                  </label>

                  <button className="border border-dashed border-slate-300 text-slate-500 hover:bg-slate-50 font-bold text-[10px] py-2.5 rounded-xl transition-all">
                    + Add New Address
                  </button>
                </div>

                {/* Credit card select */}
                <div className="flex flex-col gap-2.5 border-t border-slate-100 pt-6">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Payment Method</span>
                  <div className="flex justify-between items-center p-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-2">
                      💳 •••• 4242
                    </span>
                    <button className="text-xs text-[#0F62FE] hover:underline">Change</button>
                  </div>
                </div>

                {/* Complete Trigger */}
                <button
                  onClick={handleCheckout}
                  disabled={prescriptionCart.length === 0}
                  className="w-full bg-[#0F62FE] hover:bg-[#0353E9] text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  Complete Order
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
                
                <span className="text-[9px] text-slate-400 text-center leading-relaxed">
                  By placing the order, you agree to Healix Pharmacy's Terms of Service and health data privacy policy.
                </span>
              </div>

            </div>

          </div>
        )}

        {/* QR Scanner simulation */}
        {checkoutState === "scanning" && (
          <div className="p-12 flex flex-col items-center justify-center max-w-md w-full mx-auto my-12 bg-white border border-slate-200 rounded-3xl shadow-sm gap-6 text-center py-20">
            <h3 className="text-lg font-extrabold text-slate-900">Awaiting QR Payment</h3>
            <p className="text-xs text-slate-400 -mt-3">Scan the secure checkout QR scanner to complete order.</p>

            <div className="w-48 h-48 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-inner">
              {/* Real QR Pattern */}
              <img 
                src="/qr-code.png" 
                alt="Payment QR Code" 
                className="w-36 h-36 object-contain relative z-10 rounded-lg"
              />
              <div className="absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_10px_#ef4444] animate-bounce" style={{ top: '25%' }} />
            </div>

            <div className="flex flex-col gap-1.5 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Awaiting scanner link</span>
              <p className="text-xs text-slate-500 font-semibold">Order #HLX-89022 is currently pending checkout.</p>
            </div>
          </div>
        )}

        {/* Success simulation prompt */}
        {checkoutState === "success" && (
          <div className="p-10 flex flex-col items-center justify-center max-w-md w-full mx-auto my-12 bg-white border border-slate-200 rounded-3xl shadow-sm gap-6 text-center py-16">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>

            <div>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                Payment Success
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-3">Order Confirmed!</h3>
              <p className="text-xs text-slate-400 mt-1">Your prescription checkout has been processed.</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 w-full text-left flex flex-col gap-2.5 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Shipping method</span>
                <span className="text-slate-900 font-bold">Standard Delivery (Home)</span>
              </div>
              <div className="flex justify-between">
                <span>Est Delivery</span>
                <span className="text-slate-900 font-bold">Tomorrow, 12:00 PM</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/50 pt-2.5 mt-1">
                <span>Order Reference</span>
                <span className="text-[#0F62FE] font-mono font-bold uppercase">HLX-89022</span>
              </div>
            </div>

            <button
              onClick={handleProceedToRx}
              className="w-full bg-[#0F62FE] hover:bg-[#0353E9] text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm text-center"
            >
              View Digital Prescription details
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
