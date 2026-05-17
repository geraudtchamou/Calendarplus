import { User, Email, Contact } from './index';

// --- Encryption & Security Types ---

export interface EncryptionKeyPair {
  publicKey: string;
  privateKey: string;
  fingerprint: string;
  algorithm: 'RSA-4096' | 'ECC-P256';
  createdAt: Date;
  expiresAt?: Date;
}

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  authTag?: string;
  algorithm: 'AES-256-GCM';
}

export interface PgpMessage {
  armoredMessage: string;
  isSigned: boolean;
  isEncrypted: boolean;
}

// --- DLP (Data Loss Prevention) Types ---

export type DlpSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DlpRule {
  id: string;
  name: string;
  pattern: string;
  action: 'BLOCK' | 'WARN' | 'REDACT' | 'LOG';
  severity: DlpSeverity;
  enabled: boolean;
}

export interface DlpScanResult {
  scanId: string;
  contentId: string;
  triggeredRules: {
    ruleId: string;
    ruleName: string;
    severity: DlpSeverity;
    matchedTextPreview: string;
    position: number;
  }[];
  riskScore: number;
  recommendation: 'ALLOW' | 'REVIEW' | 'BLOCK';
  scannedAt: Date;
}

// --- Audit & Compliance Types ---

export type ActionType = 
  | 'LOGIN' | 'LOGOUT' | 'FAILED_LOGIN'
  | 'VIEW_EMAIL' | 'SEND_EMAIL' | 'DELETE_EMAIL'
  | 'VIEW_CONTACT' | 'EDIT_CONTACT' | 'DELETE_CONTACT'
  | 'EXPORT_DATA' | 'CHANGE_PERMISSIONS'
  | 'SESSION_REVOKE' | 'POLICY_CHANGE';

export interface AuditLog {
  id: string;
  userId: string;
  action: ActionType;
  resourceType: 'EMAIL' | 'CONTACT' | 'DEAL' | 'SYSTEM' | 'SESSION';
  resourceId?: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
  status: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
}

export interface RetentionPolicy {
  id: string;
  name: string;
  description: string;
  scope: 'ALL_EMAILS' | 'SENT_ITEMS' | 'SPECIFIC_LABEL' | 'CRM_LEADS' | 'CRM_DEALS';
  labelId?: string;
  retentionDays: number;
  actionOnExpiry: 'DELETE_PERMANENTLY' | 'ARCHIVE' | 'ANONYMIZE';
  enabled: boolean;
  lastRunAt?: Date;
}

export interface ComplianceTemplate {
  id: 'HIPAA' | 'FINRA' | 'GDPR' | 'SOC2' | 'CUSTOM';
  name: string;
  description: string;
  settings: {
    requireEncryption: boolean;
    requireDlp: boolean;
    minPasswordLength: number;
    sessionTimeoutMinutes: number;
    mfaRequired: boolean;
    dataResidency: string;
    auditLogRetentionDays: number;
  };
}

// --- Session & Access Control Types ---

export interface UserSession {
  id: string;
  userId: string;
  deviceInfo: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: { city: string; country: string };
  createdAt: Date;
  lastActiveAt: Date;
  expiresAt: Date;
  isActive: boolean;
  isCurrent: boolean;
}

export interface IpWhitelistRule {
  id: string;
  cidr: string;
  description: string;
  addedBy: string;
  createdAt: Date;
}

export interface SecureFileShare {
  id: string;
  fileId: string;
  fileName: string;
  senderId: string;
  recipientEmail: string;
  passwordHash: string;
  maxDownloads: number;
  currentDownloads: number;
  expiresAt: Date;
  isRevoked: boolean;
  downloadHistory: {
    timestamp: Date;
    ipAddress: string;
    success: boolean;
  }[];
}

export interface AnonymousReport {
  id: string;
  reporterId?: string;
  emailId?: string;
  reason: 'PHISHING' | 'MALWARE' | 'SPAM' | 'DATA_LEAK' | 'HARASSMENT' | 'OTHER';
  description: string;
  attachments?: string[];
  submittedAt: Date;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE';
  investigatorNotes?: string;
}
