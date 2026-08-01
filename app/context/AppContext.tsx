"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/lib/supabase";

export type UserType = "patient" | "doctor" | "none";

export interface User {
  id?: string;
  name: string;
  email: string;
  type: UserType;
  avatar?: string;
  phone_number?: string;
  age?: number;
  gender?: string;
  role?: string;
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
  setPrescriptionCart: React.Dispatch<React.SetStateAction<PrescriptionItem[]>>;
  
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

  // Load from localStorage/Supabase on mount
  useEffect(() => {
    // Check initial session
    const loadSessionAndData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch user profile from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          const loadedUser: User = {
            id: profile.id,
            name: profile.full_name || profile.name || session.user.email?.split("@")[0] || "User",
            email: session.user.email || profile.email,
            type: (profile.role as UserType) || (profile.type as UserType) || "none",
            avatar: profile.avatar_url || (((profile.role || profile.type) === "patient") ? "/sarah-jenkins.jpg" : "/doc-julianne.jpg"),
            phone_number: profile.phone_number || "",
            age: profile.age || null,
            gender: profile.gender || "",
            role: profile.role || "patient",
          };
          setUser(loadedUser);
          localStorage.setItem("healix_user", JSON.stringify(loadedUser));

          if (profile.role === "doctor" || profile.type === "doctor") {
            const { data: docData } = await supabase
              .from("doctors")
              .select("*")
              .eq("id", profile.id)
              .single();

            if (docData) {
              setDoctorVerification(docData.verification_status as any);
              setDoctorProfile({
                name: docData.name,
                specialization: docData.specialization || "",
                hospital: docData.hospital || "",
                experience: docData.experience || "",
                languages: docData.languages || [],
                fee: docData.fee || "",
                bio: docData.bio || "",
                slots: docData.slots || {},
              });
            }
          }
        }
      } else {
        // Fall back to local storage
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
        }
      }
    };

    loadSessionAndData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          const loadedUser: User = {
            id: profile.id,
            name: profile.full_name || profile.name || session.user.email?.split("@")[0] || "User",
            email: session.user.email || profile.email,
            type: (profile.role as UserType) || (profile.type as UserType) || "none",
            avatar: profile.avatar_url || (((profile.role || profile.type) === "patient") ? "/sarah-jenkins.jpg" : "/doc-julianne.jpg"),
            phone_number: profile.phone_number || "",
            age: profile.age || null,
            gender: profile.gender || "",
            role: profile.role || "patient",
          };
          setUser(loadedUser);
          localStorage.setItem("healix_user", JSON.stringify(loadedUser));

          if (profile.role === "doctor" || profile.type === "doctor") {
            const { data: docData } = await supabase
              .from("doctors")
              .select("*")
              .eq("id", profile.id)
              .single();

            if (docData) {
              setDoctorVerification(docData.verification_status as any);
              setDoctorProfile({
                name: docData.name,
                specialization: docData.specialization || "",
                hospital: docData.hospital || "",
                experience: docData.experience || "",
                languages: docData.languages || [],
                fee: docData.fee || "",
                bio: docData.bio || "",
                slots: docData.slots || {},
              });
            }
          }
        }
      } else {
        setUser(null);
        localStorage.removeItem("healix_user");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user appointments dynamically when user logs in or out
  useEffect(() => {
    if (user?.id) {
      const fetchAppointments = async () => {
        try {
          const { data, error } = await supabase
            .from("appointments")
            .select("*")
            .or(`patient_id.eq.${user.id},doctor_id.eq.${user.id}`)
            .order("created_at", { ascending: false });

          if (data && data.length > 0) {
            const formatted: Appointment[] = data.map((item) => ({
              doctorName: item.doctor_name || "Doctor",
              doctorSpecialization: item.doctor_specialization || "",
              doctorAvatar: item.doctor_avatar || "/doc-sarah.jpg",
              date: item.date,
              time: item.time,
              fee: item.fee || "$150.00",
              room: item.room || "Virtual Clinic - Room #402",
            }));
            setAppointments(formatted);
          } else {
            loadDefaultAppointments();
          }
        } catch (err) {
          console.error("Error fetching appointments from Supabase:", err);
          loadDefaultAppointments();
        }
      };
      fetchAppointments();
    } else {
      loadDefaultAppointments();
    }
  }, [user]);

  // Fetch user prescriptions dynamically when patient logs in
  useEffect(() => {
    if (user?.id && user.type === "patient") {
      const fetchPrescriptions = async () => {
        try {
          const { data, error } = await supabase
            .from("prescriptions")
            .select("*")
            .eq("patient_id", user.id)
            .eq("status", "pending");

          if (data && data.length > 0) {
            const formatted: PrescriptionItem[] = data.map((item) => ({
              id: item.id,
              name: item.medicine_name,
              dosage: item.dosage,
              duration: item.instructions || "30-day course",
              price: 15.0,
              quantity: 1,
            }));
            setPrescriptionCart(formatted);
          } else {
            loadDefaultPrescriptionCart();
          }
        } catch (err) {
          console.error("Error loading prescriptions from Supabase:", err);
          loadDefaultPrescriptionCart();
        }
      };
      fetchPrescriptions();
    } else {
      loadDefaultPrescriptionCart();
    }
  }, [user]);

  const loadDefaultPrescriptionCart = () => {
    setPrescriptionCart([
      { id: "1", name: "Amoxicillin 500mg", dosage: "1 Tablet Daily", duration: "10-day course", price: 24.0, quantity: 1 },
      { id: "2", name: "Lisinopril 10mg", dosage: "1 Tablet Daily", duration: "30-day course", price: 9.25, quantity: 2 },
      { id: "3", name: "Inhaler - Albuterol", dosage: "As needed for symptoms", duration: "200 Doses", price: 45.0, quantity: 1 },
    ]);
  };

  const loadDefaultAppointments = () => {
    if (typeof window !== "undefined") {
      const storedAppointments = localStorage.getItem("healix_appointments");
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      } else {
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
  };

  const login = (type: UserType, email: string, name?: string) => {
    const newUser: User = {
      name: name || (type === "patient" ? "Sarah Jenkins" : "Dr. Julianne Smith"),
      email,
      type,
      avatar: type === "patient" ? "/sarah-jenkins.jpg" : "/doc-julianne.jpg",
    };
    setUser(newUser);
    localStorage.setItem("healix_user", JSON.stringify(newUser));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("healix_user");
    localStorage.removeItem("healix_doctor_verification");
    localStorage.removeItem("healix_doctor_profile");
    localStorage.removeItem("healix_appointments");
    setDoctorVerification("unverified");
    setDoctorProfile(null);
    setAppointments([]);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error signing out from Supabase:", err);
    }
  };

  const addAppointment = async (appt: Appointment) => {
    const updated = [appt, ...appointments];
    setAppointments(updated);
    localStorage.setItem("healix_appointments", JSON.stringify(updated));

    if (user?.id) {
      try {
        const { error } = await supabase.from("appointments").insert({
          patient_id: user.id,
          doctor_name: appt.doctorName,
          doctor_specialization: appt.doctorSpecialization,
          doctor_avatar: appt.doctorAvatar,
          date: appt.date,
          time: appt.time,
          fee: appt.fee,
          room: appt.room || "Virtual Clinic - Room #402",
        });
        if (error) throw error;
      } catch (err) {
        console.error("Error saving appointment to Supabase:", err);
      }
    }
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

  const handleSetDoctorVerification = async (status: "unverified" | "pending" | "verified") => {
    setDoctorVerification(status);
    localStorage.setItem("healix_doctor_verification", status);

    if (user?.id) {
      try {
        const { error } = await supabase.from("doctors").upsert({
          id: user.id,
          name: user?.name || "Practitioner",
          verification_status: status,
        });
        if (error) throw error;
      } catch (err) {
        console.error("Error saving doctor verification to Supabase:", err);
      }
    }
  };

  const handleSetDoctorProfile = async (profile: DoctorProfile | null) => {
    setDoctorProfile(profile);
    if (profile) {
      localStorage.setItem("healix_doctor_profile", JSON.stringify(profile));
    } else {
      localStorage.removeItem("healix_doctor_profile");
    }

    if (user?.id) {
      try {
        if (profile) {
          const { error } = await supabase.from("doctors").upsert({
            id: user.id,
            name: profile.name,
            specialization: profile.specialization,
            hospital: profile.hospital,
            experience: profile.experience,
            languages: profile.languages,
            fee: profile.fee,
            bio: profile.bio,
            slots: profile.slots,
          });
          if (error) throw error;
        } else {
          await supabase.from("doctors").delete().eq("id", user.id);
        }
      } catch (err) {
        console.error("Error saving doctor profile to Supabase:", err);
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
        setPrescriptionCart,
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
