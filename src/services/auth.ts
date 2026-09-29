import { UserProfile, Role } from '../types';

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  userRole: Role | null;
}

export interface SignupData {
  fullName: string;
  studentId: string;
  email: string;
  password: string;
  college: string;
  department: string;
  year: string;
}

const AUTH_STORAGE_KEY = 'student_transit_auth_session';
const REMEMBER_ME_KEY = 'student_transit_remember_me';
const REGISTERED_USERS_KEY = 'student_transit_registered_users';

// Demo Student profile
export const DEMO_STUDENT_USER: UserProfile = {
  id: 'usr-student-01',
  studentId: 'JU2024CS042',
  fullName: 'Arun Kumar',
  email: 'arun.k@joyuniversity.edu.in',
  college: 'Joy University',
  department: 'Computer Science & Engineering',
  year: '3rd Year (B.Tech)',
  role: 'student',
  hasCompletedTutorial: false,
  preferredDestination: 'Nagercoil',
  phone: '+91 98765 43210',
};

// Demo Admin profile
export const DEMO_ADMIN_USER: UserProfile = {
  id: 'usr-admin-01',
  studentId: 'ADM-JU-001',
  fullName: 'Prof. S. Ramanathan',
  email: 'admin@joyuniversity.edu.in',
  college: 'Joy University',
  department: 'Campus Transport Operations & Logistics',
  year: 'Faculty Administrator',
  role: 'admin',
  hasCompletedTutorial: true,
  phone: '7029 200 200',
};

class AuthService {
  private static instance: AuthService;
  private state: AuthState = {
    isAuthenticated: false,
    currentUser: null,
    userRole: null,
  };
  private listeners: Set<(state: AuthState) => void> = new Set();

  private constructor() {
    this.restoreSession();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  private restoreSession(): void {
    if (typeof window === 'undefined') return;

    try {
      const isRemembered = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
      const storage = isRemembered ? localStorage : sessionStorage;
      const sessionStr = storage.getItem(AUTH_STORAGE_KEY);

      if (sessionStr) {
        const user: UserProfile = JSON.parse(sessionStr);
        if (user && user.id) {
          this.state = {
            isAuthenticated: true,
            currentUser: user,
            userRole: user.role,
          };
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to restore session:', e);
    }

    // Default: completely unauthenticated
    this.state = {
      isAuthenticated: false,
      currentUser: null,
      userRole: null,
    };
  }

  public isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  public getCurrentUser(): UserProfile | null {
    return this.state.currentUser;
  }

  public getUserRole(): Role | null {
    return this.state.userRole;
  }

  public hasCompletedTutorial(): boolean {
    return !!this.state.currentUser?.hasCompletedTutorial;
  }

  // Student & general login
  public login(identifier: string, password: string, rememberMe = true): { success: boolean; error?: string } {
    const trimmedId = identifier.trim();
    if (!trimmedId) {
      return { success: false, error: 'Please enter your Student ID or email.' };
    }
    if (!password) {
      return { success: false, error: 'Please enter your password.' };
    }

    // Check custom registered users in storage
    const registered = this.getRegisteredUsers();
    const foundUser = registered.find(
      (u) =>
        (u.email.toLowerCase() === trimmedId.toLowerCase() ||
          u.studentId.toLowerCase() === trimmedId.toLowerCase()) &&
        u.password === password
    );

    let loggedInUser: UserProfile;

    if (foundUser) {
      loggedInUser = {
        id: foundUser.id,
        studentId: foundUser.studentId,
        fullName: foundUser.fullName,
        email: foundUser.email,
        college: foundUser.college,
        department: foundUser.department,
        year: foundUser.year,
        role: 'student',
        hasCompletedTutorial: foundUser.hasCompletedTutorial ?? false,
        preferredDestination: 'Nagercoil',
      };
    } else if (
      trimmedId.toLowerCase() === 'demo@student.com' ||
      trimmedId.toLowerCase() === 'arun.k@joyuniversity.edu.in' ||
      trimmedId.toUpperCase() === 'JU2024CS042' ||
      trimmedId.toLowerCase() === 'student'
    ) {
      // Demo student accepted
      loggedInUser = { ...DEMO_STUDENT_USER };
    } else if (
      trimmedId.toLowerCase() === 'admin@joyuniversity.edu.in' ||
      trimmedId.toUpperCase() === 'ADM-JU-001' ||
      trimmedId.toLowerCase() === 'admin'
    ) {
      // Admin account
      loggedInUser = { ...DEMO_ADMIN_USER };
    } else {
      // Check if it's formatted like a college email/ID for prototype flexibility
      if (trimmedId.includes('@') || trimmedId.toUpperCase().startsWith('JU')) {
        loggedInUser = {
          ...DEMO_STUDENT_USER,
          id: `usr-${Date.now()}`,
          studentId: trimmedId.includes('@') ? 'JU2024CS099' : trimmedId.toUpperCase(),
          fullName: trimmedId.includes('@') ? trimmedId.split('@')[0] : 'Joy University Student',
          email: trimmedId.includes('@') ? trimmedId : `${trimmedId.toLowerCase()}@joyuniversity.edu.in`,
          hasCompletedTutorial: false,
        };
      } else {
        return {
          success: false,
          error: 'Your account could not be authenticated. Check your Student ID or use Demo Login.',
        };
      }
    }

    this.persistUser(loggedInUser, rememberMe);
    return { success: true };
  }

  // Admin specific login
  public loginAdmin(email: string, password: string, rememberMe = true): { success: boolean; error?: string } {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      return { success: false, error: 'Please enter administrator email.' };
    }
    if (!password) {
      return { success: false, error: 'Please enter administrator password.' };
    }

    if (
      trimmed === 'admin@joyuniversity.edu.in' ||
      trimmed === 'admin' ||
      trimmed === 'adm-ju-001'
    ) {
      this.persistUser(DEMO_ADMIN_USER, rememberMe);
      return { success: true };
    }

    return {
      success: false,
      error: 'Administrator credentials could not be verified. Contact Joy University campus IT.',
    };
  }

  // Quick 1-click Demo logins
  public loginAsDemo(role: 'student' | 'admin' = 'student', rememberMe = true): void {
    const user = role === 'admin' ? { ...DEMO_ADMIN_USER } : { ...DEMO_STUDENT_USER };
    this.persistUser(user, rememberMe);
  }

  // Signup
  public signup(data: SignupData): { success: boolean; error?: string } {
    if (!data.fullName.trim()) return { success: false, error: 'Please enter your full name.' };
    if (!data.studentId.trim()) return { success: false, error: 'Please enter your Student ID.' };
    if (!data.email.trim() || !data.email.includes('@')) return { success: false, error: 'Please enter a valid email address.' };
    if (!data.password || data.password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

    const registered = this.getRegisteredUsers();
    if (registered.some((u) => u.email.toLowerCase() === data.email.trim().toLowerCase())) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      studentId: data.studentId.trim().toUpperCase(),
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      college: data.college || 'Joy University',
      department: data.department || 'Computer Science & Engineering',
      year: data.year || '1st Year',
      hasCompletedTutorial: false,
    };

    registered.push(newUser);
    try {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));
    } catch (e) {
      console.error('Failed to save registered user:', e);
    }

    return { success: true };
  }

  public logout(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(REMEMBER_ME_KEY);
      } catch (e) {
        console.error('Error during logout:', e);
      }
    }

    this.state = {
      isAuthenticated: false,
      currentUser: null,
      userRole: null,
    };
    this.notify();
  }

  public completeTutorial(): void {
    if (!this.state.currentUser) return;
    const updated: UserProfile = {
      ...this.state.currentUser,
      hasCompletedTutorial: true,
    };
    this.persistUser(updated, localStorage.getItem(REMEMBER_ME_KEY) === 'true');
  }

  public resetTutorial(): void {
    if (!this.state.currentUser) return;
    const updated: UserProfile = {
      ...this.state.currentUser,
      hasCompletedTutorial: false,
    };
    this.persistUser(updated, localStorage.getItem(REMEMBER_ME_KEY) === 'true');
  }

  public updateProfile(updates: Partial<UserProfile>): void {
    if (!this.state.currentUser) return;
    const updated: UserProfile = {
      ...this.state.currentUser,
      ...updates,
    };
    this.persistUser(updated, localStorage.getItem(REMEMBER_ME_KEY) === 'true');
  }

  private persistUser(user: UserProfile, rememberMe: boolean): void {
    this.state = {
      isAuthenticated: true,
      currentUser: user,
      userRole: user.role,
    };

    if (typeof window !== 'undefined') {
      try {
        if (rememberMe) {
          localStorage.setItem(REMEMBER_ME_KEY, 'true');
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
          sessionStorage.removeItem(AUTH_STORAGE_KEY);
        } else {
          localStorage.setItem(REMEMBER_ME_KEY, 'false');
          sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch (e) {
        console.error('Failed to persist auth:', e);
      }
    }

    this.notify();
  }

  private getRegisteredUsers(): any[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(REGISTERED_USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}

export const authService = AuthService.getInstance();
