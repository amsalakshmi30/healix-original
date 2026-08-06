"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserType = "patient" | "doctor" | "none";

export interface User {
  name: string;
  email: string;
  type: UserType;
  avatar?: string;
}

export interface DoctorProfile {
  name: string;
  specialization: string;
  hospital: string;
  experience: string;
  languages: string[];
  fee: string;
  bio: string;
  slots: { [day: string]: string[] };
}

export interface Appointment {
  doctorName: string;
  doctorSpecialization: string;
  doctorAvatar: string;
  date: string;
  time: string;
  fee: string;
  room?: string;
}

export interface PrescriptionItem {
  id: string;
  name: string;
  dosage: string;
  duration: string;
  price: number;
  quantity: number;
}

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (type: UserType, email: string, name?: string) => void;
  logout: () => void;
  
  // Patient flow states
  selectedDoctor: any | null;
  setSelectedDoctor: (doc: any) => void;
  selectedSlot: { date: string; time: string } | null;
  setSelectedSlot: (slot: { date: string; time: string } | null) => void;
  appointments: Appointment[];
  addAppointment: (appt: Appointment) => void;
  prescriptionCart: PrescriptionItem[];
  updateCartQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  
  // Doctor flow states
  doctorVerification: "unverified" | "pending" | "verified";
  setDoctorVerification: (status: "unverified" | "pending" | "verified") => void;
  doctorProfile: DoctorProfile | null;
  setDoctorProfile: (profile: DoctorProfile | null) => void;
  
  // Consultation states
  activeConsultationPatient: { name: string; age: number; gender: string; id: string; bloodType: string; weight: string } | null;
  setActiveConsultationPatient: (patient: any) => void;
  doctorNotes: string;
  setDoctorNotes: (notes: string) => void;
  prescribedMedicines: { name: string; dosage: string; instructions: string }[];
  addPrescribedMedicine: (med: { name: string; dosage: string; instructions: string }) => void;
  clearPrescribedMedicines: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptionCart, setPrescriptionCart] = useState<PrescriptionItem[]>([
    { id: "1", name: "Amoxicillin 500mg", dosage: "1 Tablet Daily", duration: "10-day course", price: 24.0, quantity: 1 },
    { id: "2", name: "Lisinopril 10mg", dosage: "1 Tablet Daily", duration: "30-day course", price: 9.25, quantity: 2 },
    { id: "3", name: "Inhaler - Albuterol", dosage: "As needed for symptoms", duration: "200 Doses", price: 45.0, quantity: 1 },
  ]);

  const [doctorVerification, setDoctorVerification] = useState<"unverified" | "pending" | "verified">("unverified");
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [activeConsultationPatient, setActiveConsultationPatient] = useState<any>({
    name: "Liam Chen",
    age: 34,
    gender: "Male",
    id: "HX-88291",
    bloodType: "A+",
    weight: "82 kg"
  });
  const [doctorNotes, setDoctorNotes] = useState<string>("");
  const [prescribedMedicines, setPrescribedMedicines] = useState<{ name: string; dosage: string; instructions: string }[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("healix_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      const storedVerification = localStorage.getItem("healix_doctor_verification");
      if (storedVerification) {
        setDoctorVerification(storedVerification as any);
      }
      
      const storedProfile = localStorage.getItem("healix_doctor_profile");
      if (storedProfile) {
        setDoctorProfile(JSON.parse(storedProfile));
      }

      const storedAppointments = localStorage.getItem("healix_appointments");
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      } else {
        // Initialize with default next appointment
        const defaultAppt: Appointment = {
          doctorName: "Dr. Sarah Jenkins",
          doctorSpecialization: "Senior Cardiologist",
          doctorAvatar: "/doc-sarah.jpg",
          date: "Today",
          time: "2:30 PM - 3:00 PM",
          fee: "$180.00",
          room: "Virtual Clinic - Room #402"
        };
        setAppointments([defaultAppt]);
      }
    }
  }, []);

  const login = (type: UserType, email: string, name?: string) => {
    const newUser: User = {
      name: name || (type === "patient" ? "Sarah Jenkins" : "Dr. Julianne Smith"),
      email,
      type,
      avatar: type === "patient" ? "/sarah-jenkins.jpg" : "/doc-julianne.jpg",
    };
    setUser(newUser);
    localStorage.setItem("healix_user", JSON.stringify(newUser));

    if (type === "doctor") {
      const savedVerification = localStorage.getItem(`healix_verification_${email}`) as any;
      if (savedVerification) {
        setDoctorVerification(savedVerification);
      } else {
        setDoctorVerification("unverified");
      }
      
      const savedProfile = localStorage.getItem(`healix_profile_${email}`);
      if (savedProfile) {
        setDoctorProfile(JSON.parse(savedProfile));
      } else {
        setDoctorProfile(null);
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("healix_user");
    localStorage.removeItem("healix_doctor_verification");
    localStorage.removeItem("healix_doctor_profile");
    localStorage.removeItem("healix_appointments");
    setDoctorVerification("unverified");
    setDoctorProfile(null);
    setAppointments([]);
  };

  const addAppointment = (appt: Appointment) => {
    const updated = [appt, ...appointments];
    setAppointments(updated);
    localStorage.setItem("healix_appointments", JSON.stringify(updated));
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setPrescriptionCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setPrescriptionCart([]);
  };

  const addPrescribedMedicine = (med: { name: string; dosage: string; instructions: string }) => {
    setPrescribedMedicines((prev) => [...prev, med]);
  };

  const clearPrescribedMedicines = () => {
    setPrescribedMedicines([]);
  };

  const handleSetDoctorVerification = (status: "unverified" | "pending" | "verified") => {
    setDoctorVerification(status);
    localStorage.setItem("healix_doctor_verification", status);
    if (user && user.type === "doctor") {
      localStorage.setItem(`healix_verification_${user.email}`, status);
    }
  };

  const handleSetDoctorProfile = (profile: DoctorProfile | null) => {
    setDoctorProfile(profile);
    if (profile) {
      localStorage.setItem("healix_doctor_profile", JSON.stringify(profile));
      if (user && user.type === "doctor") {
        localStorage.setItem(`healix_profile_${user.email}`, JSON.stringify(profile));
      }
    } else {
      localStorage.removeItem("healix_doctor_profile");
      if (user && user.type === "doctor") {
        localStorage.removeItem(`healix_profile_${user.email}`);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
        selectedDoctor,
        setSelectedDoctor,
        selectedSlot,
        setSelectedSlot,
        appointments,
        addAppointment,
        prescriptionCart,
        updateCartQuantity,
        clearCart,
        doctorVerification,
        setDoctorVerification: handleSetDoctorVerification,
        doctorProfile,
        setDoctorProfile: handleSetDoctorProfile,
        activeConsultationPatient,
        setActiveConsultationPatient,
        doctorNotes,
        setDoctorNotes,
        prescribedMedicines,
        addPrescribedMedicine,
        clearPrescribedMedicines,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
