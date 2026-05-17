import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

// Security constants
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const PASSWORD_MIN_LENGTH = 12;
const SESSION_STORAGE_KEY = 'nexus_session';
const ATTEMPTS_STORAGE_KEY = 'nexus_login_attempts';

export type AuthMethod = 'email' | 'phone' | 'google' | 'apple' | 'github';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  avatar?: string;
  authMethod: AuthMethod;
  verified: boolean;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  // Email/Password authentication
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  
  // Phone authentication
  signUpWithPhone: (phone: string, code: string, name: string) => Promise<void>;
  sendPhoneCode: (phone: string) => Promise<void>;
  
  // Social authentication
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  
  // Sign out
  signOut: () => void;
  
  // Clear error
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Security utility functions
function generateSecureId(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for older browsers
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone: string): boolean {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  // Check if it has at least 10 digits and starts with +
  const digits = cleaned.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { valid: false, message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  return { valid: true };
}

function checkRateLimit(): { allowed: boolean; remainingLockoutTime?: number } {
  try {
    const attemptsData = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    if (!attemptsData) {
      return { allowed: true };
    }
    
    const { count, lockoutUntil } = JSON.parse(attemptsData);
    const now = Date.now();
    
    if (lockoutUntil && now < lockoutUntil) {
      return { allowed: false, remainingLockoutTime: lockoutUntil - now };
    }
    
    // Reset if lockout period has passed
    if (lockoutUntil && now >= lockoutUntil) {
      localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
      return { allowed: true };
    }
    
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

function recordLoginAttempt(success: boolean): void {
  try {
    const now = Date.now();
    let attemptsData = { count: 0, lockoutUntil: null as number | null };
    
    const stored = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    if (stored) {
      attemptsData = JSON.parse(stored);
    }
    
    if (success) {
      // Reset on successful login
      localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
    } else {
      attemptsData.count += 1;
      
      if (attemptsData.count >= MAX_LOGIN_ATTEMPTS) {
        attemptsData.lockoutUntil = now + LOCKOUT_DURATION_MS;
      }
      
      localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(attemptsData));
    }
  } catch (error) {
    console.error('Failed to record login attempt:', error);
  }
}

function sanitizeInput(input: string): string {
  return input.replace(/[<>\"'&]/g, (char) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;'
    };
    return entities[char] || char;
  }).trim();
}

function encryptSessionData(data: object): string {
  // In production, use proper encryption library
  // For now, use base64 encoding as a minimal obfuscation
  try {
    return btoa(JSON.stringify(data));
  } catch {
    return JSON.stringify(data);
  }
}

function decryptSessionData(encrypted: string): object | null {
  try {
    const decoded = atob(encrypted);
    return JSON.parse(decoded);
  } catch {
    try {
      // Fallback for unencrypted data (migration)
      return JSON.parse(encrypted);
    } catch {
      return null;
    }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  // Check for existing session on mount with security validation
  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (savedSession) {
      try {
        const decrypted = decryptSessionData(savedSession);
        if (decrypted && typeof decrypted === 'object' && 'user' in decrypted) {
          const { user, expiresAt } = decrypted as { user: User; expiresAt: number };
          
          // Check if session has expired (24 hours)
          if (Date.now() > expiresAt) {
            localStorage.removeItem(SESSION_STORAGE_KEY);
            return;
          }
          
          user.createdAt = new Date(user.createdAt);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
      } catch (e) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
    
    // Clean up old login attempts
    const attemptsData = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    if (attemptsData) {
      try {
        const { lockoutUntil } = JSON.parse(attemptsData);
        if (lockoutUntil && Date.now() >= lockoutUntil) {
          localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
      }
    }
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, name: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedName = sanitizeInput(name);
      
      // Validate email format
      if (!validateEmail(sanitizedEmail)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Validate password strength
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: generateSecureId(),
        email: sanitizedEmail,
        name: sanitizedName,
        authMethod: 'email',
        verified: false,
        createdAt: new Date(),
      };
      
      // Store encrypted session data with expiration
      const sessionData = {
        user,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      localStorage.setItem(SESSION_STORAGE_KEY, encryptSessionData(sessionData));
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign up failed',
      }));
      throw error;
    }
  }, []);
  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      if (password.length < 6) {
        throw new Error('Invalid credentials');
      }
      
      const user: User = {
        id: Math.random().toString(36).substring(2, 15),
        email,
        name: email.split('@')[0],
        authMethod: 'email',
        verified: true,
        createdAt: new Date(),
      };
      
      localStorage.setItem('nexus_user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign in failed',
      }));
      throw error;
    }
  }, []);

  const sendPhoneCode = useCallback(async (phone: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic phone validation
      if (phone.length < 10) {
        throw new Error('Please enter a valid phone number');
      }
      
      // In real app, send SMS code here
      console.log(`Sending verification code to ${phone}`);
      
      setAuthState(prev => ({ ...prev, isLoading: false, error: null }));
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to send code',
      }));
      throw error;
    }
  }, []);

  const signUpWithPhone = useCallback(async (phone: string, code: string, name: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (phone.length < 10) {
        throw new Error('Invalid phone number');
      }
      if (code.length !== 6) {
        throw new Error('Invalid verification code');
      }
      
      const user: User = {
        id: Math.random().toString(36).substring(2, 15),
        phone,
        name,
        authMethod: 'phone',
        verified: true,
        createdAt: new Date(),
      };
      
      localStorage.setItem('nexus_user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign up failed',
      }));
      throw error;
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const user: User = {
        id: Math.random().toString(36).substring(2, 15),
        email: 'user@gmail.com',
        name: 'Google User',
        avatar: 'https://lh3.googleusercontent.com/a/default-user',
        authMethod: 'google',
        verified: true,
        createdAt: new Date(),
      };
      
      localStorage.setItem('nexus_user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Google sign in failed',
      }));
      throw error;
    }
  }, []);

  const signInWithApple = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const user: User = {
        id: Math.random().toString(36).substring(2, 15),
        email: 'user@icloud.com',
        name: 'Apple User',
        authMethod: 'apple',
        verified: true,
        createdAt: new Date(),
      };
      
      localStorage.setItem('nexus_user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Apple sign in failed',
      }));
      throw error;
    }
  }, []);

  const signInWithGithub = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const user: User = {
        id: Math.random().toString(36).substring(2, 15),
        email: 'user@github.com',
        name: 'GitHub User',
        avatar: 'https://github.com/github.png',
        authMethod: 'github',
        verified: true,
        createdAt: new Date(),
      };
      
      localStorage.setItem('nexus_user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'GitHub sign in failed',
      }));
      throw error;
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('nexus_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  const value = useMemo(() => ({
    ...authState,
    signUpWithEmail,
    signInWithEmail,
    sendPhoneCode,
    signUpWithPhone,
    signInWithGoogle,
    signInWithApple,
    signInWithGithub,
    signOut,
    clearError,
  }), [
    authState,
    signUpWithEmail,
    signInWithEmail,
    sendPhoneCode,
    signUpWithPhone,
    signInWithGoogle,
    signInWithApple,
    signInWithGithub,
    signOut,
    clearError,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
