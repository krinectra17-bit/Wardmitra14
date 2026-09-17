import { NextRequest } from 'next/server';
import crypto from 'crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || 'ward14_supersecret_auth_token_key_2026';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ward14.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ward14admin2026';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

export const SESSION_COOKIE_NAME = 'ward14_admin_session';

/**
 * Hash password using SHA-256 with a salt or default secret
 */
export function hashPassword(password: string): string {
  return crypto.createHmac('sha256', AUTH_SECRET).update(password).digest('hex');
}

/**
 * Compare password against stored hash or plain password
 */
export function verifyPassword(password: string, storedHashOrPlain: string): boolean {
  if (!password || !storedHashOrPlain) return false;
  
  // 1. Direct match (if plain password configured in env for simplicity)
  if (password === storedHashOrPlain) {
    return true;
  }

  // 2. Hash match (HMAC SHA-256)
  const computedHash = hashPassword(password);
  if (computedHash === storedHashOrPlain) {
    return true;
  }

  return false;
}

export interface AdminSessionPayload {
  email: string;
  role: string;
  exp: number;
}

/**
 * Create a signed session token: base64(payload).signature
 */
export function createSessionToken(email: string, role = 'admin'): string {
  const payload: AdminSessionPayload = {
    email,
    role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const payloadString = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payloadString).digest('base64url');

  return `${payloadString}.${signature}`;
}

/**
 * Verify signed session token
 */
export function verifySessionToken(token: string): AdminSessionPayload | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadString, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(payloadString).digest('base64url');

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload: AdminSessionPayload = JSON.parse(
      Buffer.from(payloadString, 'base64url').toString('utf8')
    );

    if (Date.now() > payload.exp) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Verify request has valid Admin authentication
 */
export function verifyAdminAuth(req: NextRequest): { authenticated: boolean; email?: string; role?: string } {
  // 1. Check Authorization Bearer Header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    // Check if token matches session token or raw admin password
    const verified = verifySessionToken(token);
    if (verified) {
      return { authenticated: true, email: verified.email, role: verified.role };
    }
    if (token === ADMIN_PASSWORD) {
      return { authenticated: true, email: ADMIN_EMAIL, role: 'admin' };
    }
  }

  // 2. Check Cookie
  const cookie = req.cookies.get(SESSION_COOKIE_NAME);
  if (cookie?.value) {
    const verified = verifySessionToken(cookie.value);
    if (verified) {
      return { authenticated: true, email: verified.email, role: verified.role };
    }
    // Backward compatibility for direct password cookie
    if (cookie.value === ADMIN_PASSWORD) {
      return { authenticated: true, email: ADMIN_EMAIL, role: 'admin' };
    }
  }

  return { authenticated: false };
}

/**
 * Validate Admin Credentials against environment variables
 */
export function validateAdminCredentials(emailInput?: string, passwordInput?: string): boolean {
  if (!passwordInput) return false;

  // Check password against env hash or plain password
  const targetPassword = ADMIN_PASSWORD_HASH || ADMIN_PASSWORD;
  const passwordValid = verifyPassword(passwordInput, targetPassword);

  if (!passwordValid) return false;

  // If email was provided, verify it matches
  if (emailInput && emailInput.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    // If not matching default ADMIN_EMAIL, only reject if ADMIN_EMAIL is strictly set
    if (ADMIN_EMAIL && emailInput.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return false;
    }
  }

  return true;
}
