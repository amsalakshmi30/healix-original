import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to save patient
export async function dbRegisterPatient(patient: any) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("healix_patients")
        .insert([patient])
        .select();
      if (!error) return data;
      console.error("Supabase patient registration error:", error);
    } catch (e) {
      console.error("Supabase patient registration exception:", e);
    }
  }
  
  // LocalStorage fallback
  const localPatients = JSON.parse(localStorage.getItem("healix_patients") || "[]");
  localPatients.push(patient);
  localStorage.setItem("healix_patients", JSON.stringify(localPatients));
  return patient;
}

// Helper to save doctor
export async function dbRegisterDoctor(doctor: any) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("healix_doctors")
        .insert([doctor])
        .select();
      if (!error) return data;
      console.error("Supabase doctor registration error:", error);
    } catch (e) {
      console.error("Supabase doctor registration exception:", e);
    }
  }
  
  // LocalStorage fallback
  const localDoctors = JSON.parse(localStorage.getItem("healix_doctors") || "[]");
  localDoctors.push(doctor);
  localStorage.setItem("healix_doctors", JSON.stringify(localDoctors));
  return doctor;
}

// Helper to authenticate patient
export async function dbAuthenticatePatient(email: string, passwordHash: string) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("healix_patients")
        .select("*")
        .eq("email", email)
        .eq("password", passwordHash);
      if (!error && data && data.length > 0) return data[0];
      console.error("Supabase patient auth query error/not found:", error);
    } catch (e) {
      console.error("Supabase patient auth exception:", e);
    }
  }
  
  const localPatients = JSON.parse(localStorage.getItem("healix_patients") || "[]");
  const found = localPatients.find((p: any) => p.email === email && p.password === passwordHash);
  return found || null;
}

// Helper to authenticate doctor
export async function dbAuthenticateDoctor(email: string, passwordHash: string) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("healix_doctors")
        .select("*")
        .eq("email", email)
        .eq("password", passwordHash);
      if (!error && data && data.length > 0) return data[0];
      console.error("Supabase doctor auth query error/not found:", error);
    } catch (e) {
      console.error("Supabase doctor auth exception:", e);
    }
  }
  
  const localDoctors = JSON.parse(localStorage.getItem("healix_doctors") || "[]");
  const found = localDoctors.find((d: any) => d.email === email && d.password === passwordHash);
  return found || null;
}

// Helper to check if email exists in patients
export async function dbPatientEmailExists(email: string) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("healix_patients")
        .select("email")
        .eq("email", email);
      if (!error && data && data.length > 0) return true;
    } catch (e) {
      console.error("Supabase patient email check exception:", e);
    }
  }
  
  const localPatients = JSON.parse(localStorage.getItem("healix_patients") || "[]");
  return localPatients.some((p: any) => p.email === email);
}

// Helper to check if email exists in doctors
export async function dbDoctorEmailExists(email: string) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("healix_doctors")
        .select("email")
        .eq("email", email);
      if (!error && data && data.length > 0) return true;
    } catch (e) {
      console.error("Supabase doctor email check exception:", e);
    }
  }
  
  const localDoctors = JSON.parse(localStorage.getItem("healix_doctors") || "[]");
  return localDoctors.some((d: any) => d.email === email);
}
