"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import { supabase } from "@/lib/supabase";

export default function PrescriptionCart() {
  const { prescriptionCart, updateCartQuantity, clearCart, logout, user, setPrescriptionCart } = useApp();
  const router = useRouter();

  // Tab state
  const [activeTab, setActiveTab] = useState("clinic");
  
  // Checkout & Payment details
  const [address, setAddress] = useState("home");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "net_banking">("card");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [selectedBank, setSelectedBank] = useState("Chase Bank");
  
  // States: 'cart' | 'checkout' | 'scanning' | 'success'
  const [checkoutState, setCheckoutState] = useState<"cart" | "checkout" | "scanning" | "success">("cart");
  const [generatedOrderId, setGeneratedOrderId] = useState("HLX-000000");

  // Prescribed medicines from Supabase state
  const [prescribedMedicines, setPrescribedMedicines] = useState<any[]>([]);
  const [loadingDbMeds, setLoadingDbMeds] = useState(true);

  // Fetch prescriptions on mount
  useEffect(() => {
    const fetchPrescribed = async () => {
      if (!user?.id) {
        setLoadingDbMeds(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("prescriptions")
          .select("*")
          .eq("patient_id", user.id)
          .eq("status", "pending");

        if (error) throw error;

        if (data && data.length > 0) {
          setPrescribedMedicines(data);
        } else {
          // Fallback static medicines list
          setPrescribedMedicines([
            { id: "1", medicine_name: "Amoxicillin 500mg", dosage: "1 Tablet Daily", instructions: "10-day course" },
            { id: "2", medicine_name: "Lisinopril 10mg", dosage: "1 Tablet Daily", instructions: "30-day course" },
            { id: "3", medicine_name: "Inhaler - Albuterol", dosage: "As needed for symptoms", instructions: "200 Doses" }
          ]);
        }
      } catch (err) {
        console.error("Error fetching prescriptions:", err);
        // Fallback static list
        setPrescribedMedicines([
          { id: "1", medicine_name: "Amoxicillin 500mg", dosage: "1 Tablet Daily", instructions: "10-day course" },
          { id: "2", medicine_name: "Lisinopril 10mg", dosage: "1 Tablet Daily", instructions: "30-day course" },
          { id: "3", medicine_name: "Inhaler - Albuterol", dosage: "As needed for symptoms", instructions: "200 Doses" }
        ]);
      } finally {
        setLoadingDbMeds(false);
      }
    };
    fetchPrescribed();
  }, [user]);

  // Calculations
  const subtotal = prescriptionCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const serviceFee = prescriptionCart.length > 0 ? 2.00 : 0;
  const total = subtotal + serviceFee;

  const handleProceedToPayment = () => {
    setCheckoutState("checkout");
  };

  const handleCheckout = () => {
    // Generate real order ID
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `HLX-${randomNum}`;
    setGeneratedOrderId(orderId);
    setCheckoutState("scanning");
  };

  useEffect(() => {
    if (checkoutState === "scanning") {
      const timer = setTimeout(async () => {
        try {
          const patientId = user?.id || null;
          
          // Save Order details in Supabase
          const { data: orderData, error: orderError } = await supabase
            .from("orders")
            .insert({
              id: generatedOrderId,
              user_id: patientId,
              patient_name: user?.name || "Patient",
              patient_email: user?.email || "patient@healix.com",
              total_amount: total,
              status: "paid",
              items: prescriptionCart
            })
            .select();

          if (orderError) console.error("Error creating order:", orderError.message);

          // Save Payment details in Supabase
          const { error: paymentError } = await supabase
            .from("payments")
            .insert({
              order_id: generatedOrderId,
              user_id: patientId,
              payment_method: paymentMethod,
              status: "success",
              amount: total
            });

          if (paymentError) console.error("Error creating payment:", paymentError.message);

          // Update prescription status to completed
          const ids = prescriptionCart.map((item) => item.id);
          const validIds = ids.filter((id) => id && id.length === 36);
          if (validIds.length > 0) {
            await supabase
              .from("prescriptions")
              .update({ status: "completed" })
              .in("id", validIds);
          }
        } catch (err) {
          console.error("Error executing checkout transactions in Supabase:", err);
        }
        setCheckoutState("success");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [checkoutState, prescriptionCart, generatedOrderId, paymentMethod, total, user]);

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

        {/* Cart View */}
        {checkoutState === "cart" && (
          <div className="p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            
            {/* Left side: Prescriptions & Cart */}
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

              {/* List of Prescribed Medicines */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <h3 className="text-sm font-bold text-slate-900">1. Prescribed Medicines (From Doctor)</h3>
                <span className="text-[10px] text-slate-400 -mt-2 block font-medium">Add doctor-prescribed items to your shopping cart below.</span>
                
                {loadingDbMeds ? (
                  <span className="text-xs text-slate-400 py-4 block">Loading prescriptions...</span>
                ) : (
                  <div className="flex flex-col gap-3">
                    {prescribedMedicines.map((med) => {
                      const isInCart = prescriptionCart.some((item) => item.name === med.medicine_name);
                      return (
                        <div key={med.id} className="flex justify-between items-center p-3.5 border border-slate-100 rounded-2xl bg-slate-50/50">
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{med.medicine_name}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{med.instructions} • {med.dosage}</p>
                          </div>
                          <button
                            disabled={isInCart}
                            onClick={() => {
                              const price = med.medicine_name.includes("Amoxicillin") ? 24.00 : med.medicine_name.includes("Lisinopril") ? 9.25 : 45.00;
                              setPrescriptionCart((prev) => [
                                ...prev,
                                {
                                  id: med.id,
                                  name: med.medicine_name,
                                  dosage: med.dosage,
                                  duration: med.instructions,
                                  price,
                                  quantity: 1
                                }
                              ]);
                            }}
                            className={`text-[10px] font-bold py-1.5 px-3 rounded-lg transition-all ${isInCart ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-[#0F62FE] hover:bg-[#0353E9] text-white"}`}
                          >
                            {isInCart ? "Added" : "+ Add to Cart"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Shopping Cart List */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">2. Your Shopping Cart</h3>
                  <span className="bg-blue-50 text-[#0F62FE] text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
                    {prescriptionCart.length} Items Selected
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
                    Your cart is empty. Add prescribed medicines to proceed.
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

            </div>

            {/* Right side: Proceed details panel */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                <h3 className="text-sm font-bold text-slate-900">Checkout Delivery</h3>
                
                {/* Delivery address checkboxes */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Delivery Address</span>
                  
                  <label className={`p-4 border rounded-xl flex items-start gap-3 cursor-pointer transition-all ${address === "home" ? 'border-[#0F62FE] bg-blue-50/20' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input 
                      type="radio" 
                      name="delivery-addr" 
                      checked={address === "home"}
                      onChange={() => setAddress("home")}
                      className="text-[#0F62FE] focus:ring-0 mt-0.5" 
                    />
                    <div className="text-[10px] font-semibold">
                      <p className="text-slate-900 font-bold">🏠 Home Address</p>
                      <p className="text-slate-400 mt-0.5">1248 Medical Parkway, Suite 200,</p>
                      <p className="text-slate-400">San Francisco, CA 94103</p>
                    </div>
                  </label>

                  <label className={`p-4 border rounded-xl flex items-start gap-3 cursor-pointer transition-all ${address === "office" ? 'border-[#0F62FE] bg-blue-50/20' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input 
                      type="radio" 
                      name="delivery-addr"
                      checked={address === "office"}
                      onChange={() => setAddress("office")}
                      className="text-[#0F62FE] focus:ring-0 mt-0.5" 
                    />
                    <div className="text-[10px] font-semibold">
                      <p className="text-slate-900 font-bold">🏢 Office Address</p>
                      <p className="text-slate-400 mt-0.5">450 Tech Plaza, Floor 12,</p>
                      <p className="text-slate-400">San Francisco, CA 94105</p>
                    </div>
                  </label>
                </div>

                <button
                  onClick={handleProceedToPayment}
                  disabled={prescriptionCart.length === 0}
                  className="w-full bg-[#0F62FE] hover:bg-[#0353E9] text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  Proceed to Payment
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* Payment Screen (checkout state) */}
        {checkoutState === "checkout" && (
          <div className="p-6 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            
            {/* Left Column: Order Breakdown & Patient Details */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <h3 className="text-sm font-bold text-slate-900">Order Summary</h3>
                
                <div className="text-xs text-slate-500 font-semibold border-b border-slate-100 pb-4">
                  <p className="text-slate-800 font-bold mb-2">Patient Details</p>
                  <div>Name: {user?.name || "Patient"}</div>
                  <div>Email: {user?.email || "patient@healix.com"}</div>
                  <div>Delivery Address: {address === "home" ? "1248 Medical Parkway, San Francisco" : "450 Tech Plaza, San Francisco"}</div>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-xs font-bold text-slate-800">Medicines Ordered</p>
                  {prescriptionCart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{item.name}</span>
                        <span className="text-slate-400 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-extrabold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-4 flex flex-col gap-2 text-xs text-slate-500 font-semibold">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-slate-800 font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-[#0F62FE] border-t border-slate-100 pt-3 mt-2">
                    <span>Grand Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Payment Methods & Inputs */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
                <h3 className="text-sm font-bold text-slate-900">Select Payment Method</h3>

                {/* Methods Selectors */}
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setPaymentMethod("card")}
                    className={`py-2 px-3 border rounded-xl text-center text-xs font-bold transition-all ${paymentMethod === "card" ? "border-[#0F62FE] bg-blue-50/30 text-[#0F62FE]" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    💳 Card
                  </button>
                  <button 
                    onClick={() => setPaymentMethod("upi")}
                    className={`py-2 px-3 border rounded-xl text-center text-xs font-bold transition-all ${paymentMethod === "upi" ? "border-[#0F62FE] bg-blue-50/30 text-[#0F62FE]" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    📱 UPI
                  </button>
                  <button 
                    onClick={() => setPaymentMethod("net_banking")}
                    className={`py-2 px-3 border rounded-xl text-center text-xs font-bold transition-all ${paymentMethod === "net_banking" ? "border-[#0F62FE] bg-blue-50/30 text-[#0F62FE]" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    🏦 NetBanking
                  </button>
                </div>

                {/* Conditional Inputs */}
                {paymentMethod === "card" && (
                  <div className="flex flex-col gap-3.5 border-t border-slate-100 pt-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Card Number</label>
                      <input 
                        type="text" 
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#0F62FE]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Expiry Date</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#0F62FE]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">CVV</label>
                        <input 
                          type="password" 
                          placeholder="•••"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#0F62FE]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="flex flex-col gap-3.5 border-t border-slate-100 pt-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">UPI ID / VPA</label>
                      <input 
                        type="text" 
                        placeholder="username@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#0F62FE]"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "net_banking" && (
                  <div className="flex flex-col gap-3.5 border-t border-slate-100 pt-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Select Bank</label>
                      <select 
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#0F62FE] bg-white"
                      >
                        <option>Chase Bank</option>
                        <option>Bank of America</option>
                        <option>Wells Fargo</option>
                        <option>CitiBank</option>
                      </select>
                    </div>
                  </div>
                )}

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#0F62FE] hover:bg-[#0353E9] text-white text-xs font-bold py-3.5 rounded-xl mt-4 shadow-sm"
                >
                  Pay & Complete Order (${total.toFixed(2)})
                </button>
                <button 
                  onClick={() => setCheckoutState("cart")}
                  className="w-full border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold py-3 rounded-xl"
                >
                  Go Back to Cart
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Processing Spinner */}
        {checkoutState === "scanning" && (
          <div className="p-12 flex flex-col items-center justify-center max-w-md w-full mx-auto my-12 bg-white border border-slate-200 rounded-3xl shadow-sm gap-6 text-center py-20 animate-pulse">
            <div className="w-12 h-12 border-4 border-t-[#0F62FE] border-slate-100 rounded-full animate-spin" />
            <h3 className="text-lg font-extrabold text-slate-900">Processing Secure Payment</h3>
            <p className="text-xs text-slate-400 -mt-3">Connecting to bank gateways. Please do not close this window.</p>
          </div>
        )}

        {/* Success screen */}
        {checkoutState === "success" && (
          <div className="p-10 flex flex-col items-center justify-center max-w-md w-full mx-auto my-12 bg-white border border-slate-200 rounded-3xl shadow-sm gap-6 text-center py-16 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>

            <div>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                Payment Success
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-3">Order Confirmed!</h3>
              <p className="text-xs text-slate-400 mt-1">Your prescription payment has been processed.</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 w-full text-left flex flex-col gap-2.5 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Shipping method</span>
                <span className="text-slate-900 font-bold">Standard Delivery ({address === "home" ? "Home" : "Office"})</span>
              </div>
              <div className="flex justify-between">
                <span>Est Delivery</span>
                <span className="text-slate-900 font-bold">Tomorrow, 12:00 PM</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/50 pt-2.5 mt-1">
                <span>Order Reference</span>
                <span className="text-[#0F62FE] font-mono font-bold uppercase">{generatedOrderId}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToRx}
              className="w-full bg-[#0F62FE] hover:bg-[#0353E9] text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm text-center"
            >
              Continue to Prescription Page
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
