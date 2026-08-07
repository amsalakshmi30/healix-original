"use client";

// Seeding helper to create initial mock data in localStorage
function seedInitialData() {
  if (typeof window === "undefined") return;

  const dbStr = localStorage.getItem("healix_mock_db");
  if (dbStr) return; // Database already seeded or exists

  const initialDb: any = {
    profiles: [
      {
        id: "patient-id-1",
        email: "patient@healix.com",
        full_name: "Sarah Jenkins",
        role: "patient",
        avatar_url: "/sarah-jenkins.jpg",
        phone_number: "+1 555-019-2834",
        age: 29,
        gender: "Female"
      },
      {
        id: "doctor-id-1",
        email: "doctor@healix.com",
        full_name: "Dr. Julianne Smith",
        role: "doctor",
        avatar_url: "/doc-julianne.jpg",
        phone_number: "+1 555-018-9922",
        age: 42,
        gender: "Female"
      }
    ],
    doctors: [
      {
        id: "alexander",
        name: "Dr. Alexander Sterling",
        specialization: "Cardiology Specialist",
        rating: 4.8,
        reviews_count: "1.2k Reviews",
        experience: 15,
        languages: ["English", "Spanish", "French"],
        fee: "$150.00",
        bio: "Dr. Alexander Sterling is a board-certified cardiologist with over 15 years of experience in interventional cardiology and preventative heart health.",
        verification_status: "verified",
        slots: {
          "Monday": ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"],
          "Tuesday": ["09:00 AM", "11:00 AM", "01:30 PM", "03:00 PM"],
          "Wednesday": ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"],
          "Thursday": ["09:00 AM", "10:30 AM", "02:30 PM", "05:00 PM"],
          "Friday": ["09:00 AM", "11:00 AM", "01:30 PM", "03:00 PM"]
        }
      },
      {
        id: "jenkins",
        name: "Dr. Sarah Jenkins",
        specialization: "Senior Cardiologist",
        rating: 4.9,
        reviews_count: "950 Reviews",
        experience: 12,
        languages: ["English", "Spanish"],
        fee: "$180.00",
        bio: "Passionate about preventative heart health and long term vascular wellness.",
        verification_status: "verified",
        slots: {
          "Monday": ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"],
          "Tuesday": ["09:00 AM", "11:00 AM", "01:30 PM", "03:00 PM"],
          "Wednesday": ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"],
          "Thursday": ["09:00 AM", "10:30 AM", "02:30 PM", "05:00 PM"],
          "Friday": ["09:00 AM", "11:00 AM", "01:30 PM", "03:00 PM"]
        }
      },
      {
        id: "thorne",
        name: "Dr. Marcus Thorne",
        specialization: "Neurology Specialist",
        rating: 4.8,
        reviews_count: "820 Reviews",
        experience: 15,
        languages: ["English", "German"],
        fee: "$210.00",
        bio: "Specializing in sleep disorders, migraine therapies, and neuro-oncology diagnostics.",
        verification_status: "verified",
        slots: {
          "Monday": ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"],
          "Tuesday": ["09:00 AM", "11:00 AM", "01:30 PM", "03:00 PM"],
          "Wednesday": ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"],
          "Thursday": ["09:00 AM", "10:30 AM", "02:30 PM", "05:00 PM"],
          "Friday": ["09:00 AM", "11:00 AM", "01:30 PM", "03:00 PM"]
        }
      },
      {
        id: "rodriguez",
        name: "Dr. Elena Rodriguez",
        specialization: "Pediatric Surgeon",
        rating: 5.0,
        reviews_count: "1.4k Reviews",
        experience: 8,
        languages: ["English", "Spanish"],
        fee: "$195.00",
        bio: "Expert in minimally invasive pediatric care and neonatal surgery protocols.",
        verification_status: "verified",
        slots: {
          "Monday": ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"],
          "Tuesday": ["09:00 AM", "11:00 AM", "01:30 PM", "03:00 PM"],
          "Wednesday": ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"],
          "Thursday": ["09:00 AM", "10:30 AM", "02:30 PM", "05:00 PM"],
          "Friday": ["09:00 AM", "11:00 AM", "01:30 PM", "03:00 PM"]
        }
      },
      {
        id: "chen",
        name: "Dr. David Chen",
        specialization: "Dermatology Lead",
        rating: 4.7,
        reviews_count: "600 Reviews",
        experience: 20,
        languages: ["English", "Mandarin"],
        fee: "$160.00",
        bio: "Specializing in aesthetic dermatology, skin pathology, and oncological treatments.",
        verification_status: "verified",
        slots: {
          "Monday": ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"],
          "Tuesday": ["09:00 AM", "11:00 AM", "01:30 PM", "03:00 PM"],
          "Wednesday": ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"],
          "Thursday": ["09:00 AM", "10:30 AM", "02:30 PM", "05:00 PM"],
          "Friday": ["09:00 AM", "11:00 AM", "01:30 PM", "03:00 PM"]
        }
      },
      {
        id: "doctor-id-1",
        name: "Dr. Julianne Smith",
        specialization: "General Practice Lead",
        rating: 4.9,
        reviews_count: "120 Reviews",
        experience: 10,
        languages: ["English"],
        fee: "$150.00",
        bio: "General medicine specialist focused on holistic patient wellness.",
        verification_status: "verified",
        slots: {
          "Monday": ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"],
          "Tuesday": ["09:00 AM", "11:00 AM", "01:30 PM", "03:00 PM"],
          "Wednesday": ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"],
          "Thursday": ["09:00 AM", "10:30 AM", "02:30 PM", "05:00 PM"],
          "Friday": ["09:00 AM", "11:00 AM", "01:30 PM", "03:00 PM"]
        }
      }
    ],
    appointments: [
      {
        id: "appt-1",
        patient_id: "patient-id-1",
        patient_name: "Sarah Jenkins",
        doctor_id: "doctor-id-1",
        doctor_name: "Dr. Julianne Smith",
        doctor_specialization: "General Practice Lead",
        doctor_avatar: "/doc-julianne.jpg",
        date: "Today",
        time: "2:30 PM - 3:00 PM",
        fee: "$150.00",
        room: "Virtual Clinic - Room #402",
        created_at: new Date().toISOString()
      }
    ],
    prescriptions: [
      {
        id: "pr-1",
        patient_id: "patient-id-1",
        doctor_id: "doctor-id-1",
        doctor_name: "Dr. Julianne Smith",
        medicine_name: "Amoxicillin 500mg",
        dosage: "1 Tablet Daily",
        instructions: "10-day course",
        clinical_notes: "Take after meals. Complete full course.",
        status: "pending",
        created_at: new Date().toISOString()
      },
      {
        id: "pr-2",
        patient_id: "patient-id-1",
        doctor_id: "doctor-id-1",
        doctor_name: "Dr. Julianne Smith",
        medicine_name: "Lisinopril 10mg",
        dosage: "1 Tablet Daily",
        instructions: "30-day course",
        clinical_notes: "Monitor blood pressure weekly.",
        status: "pending",
        created_at: new Date().toISOString()
      },
      {
        id: "pr-3",
        patient_id: "patient-id-1",
        doctor_id: "jenkins",
        doctor_name: "Dr. Sarah Jenkins",
        medicine_name: "Inhaler - Albuterol",
        dosage: "As needed for symptoms",
        instructions: "200 Doses",
        clinical_notes: "Use only as needed for shortness of breath.",
        status: "pending",
        created_at: new Date().toISOString()
      }
    ],
    payments: [
      { id: "pay-1", amount: 4200, status: "success", created_at: "2026-08-01T10:00:00Z" },
      { id: "pay-2", amount: 3805, status: "success", created_at: "2026-08-03T11:00:00Z" },
      { id: "pay-3", amount: 4445, status: "success", created_at: "2026-08-05T12:00:00Z" }
    ],
    orders: [],
    consultations: []
  };

  localStorage.setItem("healix_mock_db", JSON.stringify(initialDb));
}

class QueryBuilder {
  private tableName: string;
  private method: "select" | "insert" | "update" | "delete" | "upsert" = "select";
  private selectFields: string = "*";
  private selectOptions: any = {};
  private payload: any = null;
  private filters: Array<(row: any) => boolean> = [];
  private sortField: string = "";
  private sortAscending: boolean = true;
  private limitCount: number = -1;
  private isSingle: boolean = false;
  private orExpression: string = "";

  constructor(tableName: string) {
    this.tableName = tableName;
    seedInitialData();
  }

  select(fields = "*", options = {}) {
    this.method = "select";
    this.selectFields = fields;
    this.selectOptions = options;
    return this;
  }

  insert(data: any) {
    this.method = "insert";
    this.payload = data;
    return this;
  }

  update(data: any) {
    this.method = "update";
    this.payload = data;
    return this;
  }

  delete() {
    this.method = "delete";
    return this;
  }

  upsert(data: any) {
    this.method = "upsert";
    this.payload = data;
    return this;
  }

  eq(field: string, value: any) {
    this.filters.push((row) => {
      const val = row[field];
      if (val === undefined) return false;
      return String(val) === String(value);
    });
    return this;
  }

  neq(field: string, value: any) {
    this.filters.push((row) => {
      const val = row[field];
      if (val === undefined) return true;
      return String(val) !== String(value);
    });
    return this;
  }

  or(expression: string) {
    this.orExpression = expression;
    return this;
  }

  in(field: string, values: any[]) {
    this.filters.push((row) => {
      const val = row[field];
      if (val === undefined) return false;
      return values.map(String).includes(String(val));
    });
    return this;
  }

  order(field: string, { ascending = true } = {}) {
    this.sortField = field;
    this.sortAscending = ascending;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    try {
      const result = await this.execute();
      if (onfulfilled) return onfulfilled(result);
      return result;
    } catch (err) {
      if (onrejected) return onrejected(err);
      throw err;
    }
  }

  private async execute() {
    if (typeof window === "undefined") {
      return { data: this.isSingle ? null : [], error: null, count: 0 };
    }

    const dbStr = localStorage.getItem("healix_mock_db");
    let db = dbStr ? JSON.parse(dbStr) : {};

    if (!db[this.tableName]) {
      db[this.tableName] = [];
    }

    let results = [...db[this.tableName]];

    if (this.method === "insert") {
      const rowsToInsert = Array.isArray(this.payload) ? this.payload : [this.payload];
      const insertedRows = rowsToInsert.map((row) => {
        const id = row.id || Math.random().toString(36).substring(2, 11);
        return {
          id,
          created_at: new Date().toISOString(),
          ...row
        };
      });
      db[this.tableName] = [...db[this.tableName], ...insertedRows];
      localStorage.setItem("healix_mock_db", JSON.stringify(db));
      results = insertedRows;
    } else if (this.method === "upsert") {
      const rowsToUpsert = Array.isArray(this.payload) ? this.payload : [this.payload];
      const upsertedRows = rowsToUpsert.map((row) => {
        const index = db[this.tableName].findIndex((r: any) => r.id === row.id);
        const newRow = {
          created_at: new Date().toISOString(),
          ...row
        };
        if (index > -1) {
          db[this.tableName][index] = { ...db[this.tableName][index], ...newRow };
          return db[this.tableName][index];
        } else {
          const id = row.id || Math.random().toString(36).substring(2, 11);
          const fullNewRow = { id, ...newRow };
          db[this.tableName].push(fullNewRow);
          return fullNewRow;
        }
      });
      localStorage.setItem("healix_mock_db", JSON.stringify(db));
      results = upsertedRows;
    } else if (this.method === "update") {
      db[this.tableName] = db[this.tableName].map((row: any) => {
        const matches = this.filters.every((filter) => filter(row));
        if (matches) {
          return { ...row, ...this.payload };
        }
        return row;
      });
      localStorage.setItem("healix_mock_db", JSON.stringify(db));
      results = db[this.tableName].filter((row: any) => this.filters.every((filter) => filter(row)));
    } else if (this.method === "delete") {
      const remaining = db[this.tableName].filter((row: any) => !this.filters.every((filter) => filter(row)));
      db[this.tableName] = remaining;
      localStorage.setItem("healix_mock_db", JSON.stringify(db));
      results = [];
    }

    // Filters for selects
    if (this.method === "select") {
      results = results.filter((row: any) => this.filters.every((filter) => filter(row)));
    }

    // Apply orExpression if defined
    if (this.orExpression) {
      const parts = this.orExpression.split(",");
      results = results.filter((row) => {
        return parts.some((part) => {
          const match = part.match(/^([^.]+)\.eq\.(.+)$/);
          if (match) {
            const [, col, val] = match;
            return String(row[col]) === String(val);
          }
          return false;
        });
      });
    }

    // Add virtual profiles lookup if profiles is in query
    if (this.selectFields && this.selectFields.includes("profiles(")) {
      results = results.map((row: any) => {
        const profilesList = db["profiles"] || [];
        // Match profile matching id, patient_id or doctor_id
        const pid = row.id || row.patient_id || row.doctor_id;
        const profile = profilesList.find((p: any) => p.id === pid);
        return {
          ...row,
          profiles: profile
            ? { avatar_url: profile.avatar_url }
            : { avatar_url: row.avatar || "/doc-sarah.jpg" }
        };
      });
    }

    // Sorting
    if (this.sortField) {
      results.sort((a: any, b: any) => {
        const valA = a[this.sortField];
        const valB = b[this.sortField];
        if (valA === undefined) return 1;
        if (valB === undefined) return -1;
        if (typeof valA === "string") {
          return this.sortAscending ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return this.sortAscending ? valA - valB : valB - valA;
      });
    }

    // Limit
    if (this.limitCount > -1) {
      results = results.slice(0, this.limitCount);
    }

    // Count computation
    let count: number | null = null;
    if (this.selectOptions && this.selectOptions.count === "exact") {
      count = results.length;
    }

    let finalData = results;
    if (this.isSingle) {
      finalData = results.length > 0 ? results[0] : null;
    }

    return { data: finalData, error: null, count };
  }
}

class MockAuth {
  private listeners: Array<(event: string, session: any) => void> = [];

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key === "healix_mock_session") {
          const session = this.getSessionSync();
          this.listeners.forEach((cb) => cb(session ? "SIGNED_IN" : "SIGNED_OUT", session));
        }
      });
    }
  }

  private getSessionSync() {
    if (typeof window === "undefined") return null;
    const sessionStr = localStorage.getItem("healix_mock_session");
    return sessionStr ? JSON.parse(sessionStr) : null;
  }

  async getSession() {
    const session = this.getSessionSync();
    return { data: { session }, error: null };
  }

  async getUser() {
    const session = this.getSessionSync();
    return { data: { user: session?.user || null }, error: null };
  }

  async signUp({ email, password, options }: any) {
    const userId = Math.random().toString(36).substring(2, 11);
    const user = {
      id: userId,
      email,
      user_metadata: options?.data || {}
    };
    const session = {
      user,
      access_token: "mock-token",
      expires_at: Math.floor(Date.now() / 1000) + 3600
    };

    localStorage.setItem("healix_mock_session", JSON.stringify(session));

    // Save profile in the profiles table in mock database
    const dbStr = localStorage.getItem("healix_mock_db");
    let db = dbStr ? JSON.parse(dbStr) : {};
    if (!db.profiles) db.profiles = [];

    const profile = {
      id: userId,
      email,
      full_name: options?.data?.name || options?.data?.full_name || email.split("@")[0],
      role: options?.data?.role || options?.data?.type || "patient",
      avatar_url: options?.data?.avatar_url || (options?.data?.role === "doctor" ? "/doc-julianne.jpg" : "/sarah-jenkins.jpg"),
      phone_number: options?.data?.phone_number || "",
      age: options?.data?.age || null,
      gender: options?.data?.gender || ""
    };

    db.profiles.push(profile);
    localStorage.setItem("healix_mock_db", JSON.stringify(db));

    // Emit event
    this.listeners.forEach((cb) => cb("SIGNED_IN", session));

    return { data: { user, session }, error: null };
  }

  async signInWithPassword({ email, password }: any) {
    const dbStr = localStorage.getItem("healix_mock_db");
    let db = dbStr ? JSON.parse(dbStr) : {};
    if (!db.profiles) db.profiles = [];

    let profile = db.profiles.find((p: any) => p.email.toLowerCase() === email.toLowerCase());
    let userId;

    if (profile) {
      userId = profile.id;
    } else {
      userId = Math.random().toString(36).substring(2, 11);
      const isDoctorEmail = email.toLowerCase().includes("doctor") || email.toLowerCase().includes("doc");
      profile = {
        id: userId,
        email,
        full_name: email.split("@")[0],
        role: isDoctorEmail ? "doctor" : "patient",
        avatar_url: isDoctorEmail ? "/doc-julianne.jpg" : "/sarah-jenkins.jpg",
        phone_number: "+1 (555) 019-2834",
        age: 34,
        gender: "Female"
      };
      db.profiles.push(profile);
      localStorage.setItem("healix_mock_db", JSON.stringify(db));
    }

    const user = {
      id: userId,
      email,
      user_metadata: {
        name: profile.full_name,
        type: profile.role,
        avatar_url: profile.avatar_url
      }
    };

    const session = {
      user,
      access_token: "mock-token",
      expires_at: Math.floor(Date.now() / 1000) + 3600
    };

    localStorage.setItem("healix_mock_session", JSON.stringify(session));

    // Emit event
    this.listeners.forEach((cb) => cb("SIGNED_IN", session));

    return { data: { user, session }, error: null };
  }

  async signOut() {
    localStorage.removeItem("healix_mock_session");
    this.listeners.forEach((cb) => cb("SIGNED_OUT", null));
    return { error: null };
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    this.listeners.push(callback);
    const session = this.getSessionSync();
    // Fire callback immediately
    callback(session ? "SIGNED_IN" : "SIGNED_OUT", session);

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners = this.listeners.filter((cb) => cb !== callback);
          }
        }
      }
    };
  }
}

class MockStorage {
  from(bucketName: string) {
    return {
      upload: async (path: string, file: File, options?: any) => {
        return { data: { path }, error: null };
      },
      getPublicUrl: (path: string) => {
        const isAvatar = bucketName === "avatars";
        const fallbackUrl = isAvatar ? "/doc-julianne.jpg" : "/document-mock.png";
        return { data: { publicUrl: fallbackUrl } };
      }
    };
  }
}

// Instance of the mock Supabase client
const mockAuthInstance = new MockAuth();
const mockStorageInstance = new MockStorage();

export const supabase = {
  auth: mockAuthInstance,
  storage: mockStorageInstance,
  from: (tableName: string) => new QueryBuilder(tableName)
};
