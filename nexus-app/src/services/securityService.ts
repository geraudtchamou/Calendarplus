import {
  EncryptionKeyPair,
  EncryptedPayload,
  PgpMessage,
  DlpRule,
  DlpScanResult,
  AuditLog,
  ActionType,
  RetentionPolicy,
  ComplianceTemplate,
  UserSession,
  IpWhitelistRule,
  SecureFileShare,
  AnonymousReport,
} from '../types/security';

// --- Mock Data ---

const mockKeyPairs: EncryptionKeyPair[] = [
  {
    publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: OpenPGP.js v4.10.10\nComment: https://openpgpjs.org\n\nxsBNBF...[truncated]',
    privateKey: '-----BEGIN PGP PRIVATE KEY BLOCK-----\n[ENCRYPTED]',
    fingerprint: 'A1B2 C3D4 E5F6 7890 1234 5678 90AB CDEF 1234 5678',
    algorithm: 'RSA-4096',
    createdAt: new Date('2024-01-15'),
  },
];

const mockDlpRules: DlpRule[] = [
  {
    id: 'dlp-1',
    name: 'Credit Card Numbers',
    pattern: '\\b(?:\\d[ -]*){13,16}\\b',
    action: 'BLOCK',
    severity: 'CRITICAL',
    enabled: true,
  },
  {
    id: 'dlp-2',
    name: 'Social Security Numbers',
    pattern: '\\b\\d{3}-\\d{2}-\\d{4}\\b',
    action: 'BLOCK',
    severity: 'CRITICAL',
    enabled: true,
  },
  {
    id: 'dlp-3',
    name: 'Email Addresses',
    pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
    action: 'WARN',
    severity: 'LOW',
    enabled: true,
  },
  {
    id: 'dlp-4',
    name: 'Phone Numbers',
    pattern: '\\b(?:\\+?\\d{1,3}[-.]?)?\\(?(?:\\d{3})\\)?[-.]?(?:\\d{3})[-.]?(?:\\d{4})\\b',
    action: 'LOG',
    severity: 'MEDIUM',
    enabled: true,
  },
];

const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    userId: 'user-1',
    action: 'LOGIN',
    resourceType: 'SYSTEM',
    timestamp: new Date('2024-06-17T09:00:00Z'),
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    details: { method: 'password' },
    status: 'SUCCESS',
  },
  {
    id: 'audit-2',
    userId: 'user-1',
    action: 'VIEW_EMAIL',
    resourceType: 'EMAIL',
    resourceId: 'email-123',
    timestamp: new Date('2024-06-17T09:15:00Z'),
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    details: { emailSubject: 'Q2 Financial Report' },
    status: 'SUCCESS',
  },
  {
    id: 'audit-3',
    userId: 'user-2',
    action: 'SEND_EMAIL',
    resourceType: 'EMAIL',
    resourceId: 'email-456',
    timestamp: new Date('2024-06-17T10:30:00Z'),
    ipAddress: '10.0.0.50',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    details: { recipients: ['client@example.com'], hasAttachment: true },
    status: 'SUCCESS',
  },
  {
    id: 'audit-4',
    userId: 'user-3',
    action: 'FAILED_LOGIN',
    resourceType: 'SYSTEM',
    timestamp: new Date('2024-06-17T11:00:00Z'),
    ipAddress: '203.0.113.45',
    userAgent: 'curl/7.68.0',
    details: { reason: 'Invalid password', attemptCount: 3 },
    status: 'FAILURE',
  },
  {
    id: 'audit-5',
    userId: 'user-1',
    action: 'EDIT_CONTACT',
    resourceType: 'CONTACT',
    resourceId: 'contact-789',
    timestamp: new Date('2024-06-17T14:20:00Z'),
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    details: { changedFields: ['phone', 'title'] },
    status: 'SUCCESS',
  },
];

const mockRetentionPolicies: RetentionPolicy[] = [
  {
    id: 'ret-1',
    name: 'General Email Retention',
    description: 'Delete all emails after 7 years',
    scope: 'ALL_EMAILS',
    retentionDays: 2555,
    actionOnExpiry: 'DELETE_PERMANENTLY',
    enabled: true,
    lastRunAt: new Date('2024-06-17T02:00:00Z'),
  },
  {
    id: 'ret-2',
    name: 'CRM Leads Cleanup',
    description: 'Archive inactive leads after 90 days',
    scope: 'CRM_LEADS',
    retentionDays: 90,
    actionOnExpiry: 'ARCHIVE',
    enabled: true,
    lastRunAt: new Date('2024-06-17T03:00:00Z'),
  },
  {
    id: 'ret-3',
    name: 'Sent Items Short-term',
    description: 'Delete sent items older than 30 days',
    scope: 'SENT_ITEMS',
    retentionDays: 30,
    actionOnExpiry: 'DELETE_PERMANENTLY',
    enabled: false,
  },
];

const mockComplianceTemplates: ComplianceTemplate[] = [
  {
    id: 'HIPAA',
    name: 'HIPAA Compliance',
    description: 'Health Insurance Portability and Accountability Act',
    settings: {
      requireEncryption: true,
      requireDlp: true,
      minPasswordLength: 12,
      sessionTimeoutMinutes: 15,
      mfaRequired: true,
      dataResidency: 'US',
      auditLogRetentionDays: 2190,
    },
  },
  {
    id: 'FINRA',
    name: 'FINRA Compliance',
    description: 'Financial Industry Regulatory Authority',
    settings: {
      requireEncryption: true,
      requireDlp: true,
      minPasswordLength: 10,
      sessionTimeoutMinutes: 30,
      mfaRequired: true,
      dataResidency: 'US',
      auditLogRetentionDays: 2555,
    },
  },
  {
    id: 'GDPR',
    name: 'GDPR Compliance',
    description: 'General Data Protection Regulation (EU)',
    settings: {
      requireEncryption: true,
      requireDlp: true,
      minPasswordLength: 8,
      sessionTimeoutMinutes: 60,
      mfaRequired: false,
      dataResidency: 'EU',
      auditLogRetentionDays: 730,
    },
  },
  {
    id: 'SOC2',
    name: 'SOC 2 Type II',
    description: 'Service Organization Control 2',
    settings: {
      requireEncryption: true,
      requireDlp: true,
      minPasswordLength: 10,
      sessionTimeoutMinutes: 30,
      mfaRequired: true,
      dataResidency: 'ANY',
      auditLogRetentionDays: 1095,
    },
  },
];

const mockSessions: UserSession[] = [
  {
    id: 'session-1',
    userId: 'user-1',
    deviceInfo: 'Desktop',
    browser: 'Chrome 125',
    os: 'Windows 11',
    ipAddress: '192.168.1.100',
    location: { city: 'San Francisco', country: 'USA' },
    createdAt: new Date('2024-06-17T08:00:00Z'),
    lastActiveAt: new Date('2024-06-17T15:30:00Z'),
    expiresAt: new Date('2024-06-18T08:00:00Z'),
    isActive: true,
    isCurrent: true,
  },
  {
    id: 'session-2',
    userId: 'user-1',
    deviceInfo: 'Mobile',
    browser: 'Safari',
    os: 'iOS 17',
    ipAddress: '192.168.1.105',
    location: { city: 'San Francisco', country: 'USA' },
    createdAt: new Date('2024-06-16T12:00:00Z'),
    lastActiveAt: new Date('2024-06-17T07:45:00Z'),
    expiresAt: new Date('2024-06-17T12:00:00Z'),
    isActive: true,
    isCurrent: false,
  },
  {
    id: 'session-3',
    userId: 'user-1',
    deviceInfo: 'Tablet',
    browser: 'Chrome',
    os: 'Android 14',
    ipAddress: '203.0.113.50',
    location: { city: 'New York', country: 'USA' },
    createdAt: new Date('2024-06-10T09:00:00Z'),
    lastActiveAt: new Date('2024-06-12T18:00:00Z'),
    expiresAt: new Date('2024-06-11T09:00:00Z'),
    isActive: false,
    isCurrent: false,
  },
];

const mockIpWhitelist: IpWhitelistRule[] = [
  {
    id: 'ip-1',
    cidr: '192.168.1.0/24',
    description: 'Office Network - Main Building',
    addedBy: 'admin-1',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'ip-2',
    cidr: '10.0.0.0/8',
    description: 'Corporate VPN Range',
    addedBy: 'admin-1',
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 'ip-3',
    cidr: '203.0.113.0/24',
    description: 'Remote Office - NYC',
    addedBy: 'admin-2',
    createdAt: new Date('2024-03-20'),
  },
];

const mockSecureFiles: SecureFileShare[] = [
  {
    id: 'secure-file-1',
    fileId: 'file-123',
    fileName: 'Q2_Financial_Report.pdf',
    senderId: 'user-1',
    recipientEmail: 'client@example.com',
    passwordHash: '$2b$10$xyz...',
    maxDownloads: 3,
    currentDownloads: 1,
    expiresAt: new Date('2024-06-24T23:59:59Z'),
    isRevoked: false,
    downloadHistory: [
      { timestamp: new Date('2024-06-17T10:30:00Z'), ipAddress: '198.51.100.50', success: true },
    ],
  },
  {
    id: 'secure-file-2',
    fileId: 'file-456',
    fileName: 'Contract_Draft_v3.docx',
    senderId: 'user-2',
    recipientEmail: 'partner@company.com',
    passwordHash: '$2b$10$abc...',
    maxDownloads: 5,
    currentDownloads: 5,
    expiresAt: new Date('2024-06-20T23:59:59Z'),
    isRevoked: false,
    downloadHistory: [],
  },
];

const mockAnonymousReports: AnonymousReport[] = [
  {
    id: 'report-1',
    reporterId: undefined,
    emailId: 'email-suspicious-1',
    reason: 'PHISHING',
    description: 'Email claims to be from IT asking for password reset. Suspicious link detected.',
    attachments: ['email-suspicious-1'],
    submittedAt: new Date('2024-06-17T11:30:00Z'),
    status: 'INVESTIGATING',
  },
  {
    id: 'report-2',
    reporterId: 'user-5',
    emailId: 'email-suspicious-2',
    reason: 'MALWARE',
    description: 'Attachment appears to be executable disguised as PDF.',
    attachments: ['email-suspicious-2'],
    submittedAt: new Date('2024-06-16T14:00:00Z'),
    status: 'RESOLVED',
    investigatorNotes: 'Confirmed malware. Sender domain blocked.',
  },
  {
    id: 'report-3',
    reporterId: undefined,
    reason: 'DATA_LEAK',
    description: 'Employee accidentally sent customer database to external address.',
    submittedAt: new Date('2024-06-15T09:45:00Z'),
    status: 'RESOLVED',
    investigatorNotes: 'Data retrieved. Employee retrained on DLP policies.',
  },
];

// --- Service Functions ---

export const securityService = {
  // Encryption
  generateKeyPair: async (algorithm: 'RSA-4096' | 'ECC-P256'): Promise<EncryptionKeyPair> => {
    // In production: Use Web Crypto API or OpenPGP.js
    return mockKeyPairs[0];
  },

  encryptMessage: async (content: string, recipientPublicKey: string): Promise<PgpMessage> => {
    // In production: Use OpenPGP.js
    return {
      armoredMessage: '-----BEGIN PGP MESSAGE-----\n[ENCRYPTED CONTENT]\n-----END PGP MESSAGE-----',
      isSigned: true,
      isEncrypted: true,
    };
  },

  decryptMessage: async (armoredMessage: string, privateKey: string): Promise<string> => {
    // In production: Use OpenPGP.js
    return 'Decrypted message content';
  },

  // DLP
  scanContent: async (content: string, rules: DlpRule[]): Promise<DlpScanResult> => {
    const triggeredRules: DlpScanResult['triggeredRules'] = [];
    
    for (const rule of rules) {
      if (!rule.enabled) continue;
      
      const regex = new RegExp(rule.pattern);
      const match = regex.exec(content);
      
      if (match) {
        triggeredRules.push({
          ruleId: rule.id,
          ruleName: rule.name,
          severity: rule.severity,
          matchedTextPreview: match[0].substring(0, 20) + '...',
          position: match.index,
        });
      }
    }

    const riskScore = triggeredRules.reduce((acc, rule) => {
      const severityScores = { LOW: 10, MEDIUM: 30, HIGH: 60, CRITICAL: 100 };
      return acc + severityScores[rule.severity];
    }, 0);

    let recommendation: DlpScanResult['recommendation'] = 'ALLOW';
    if (riskScore >= 100) recommendation = 'BLOCK';
    else if (riskScore >= 30) recommendation = 'REVIEW';

    return {
      scanId: `scan-${Date.now()}`,
      contentId: 'content-temp',
      triggeredRules,
      riskScore: Math.min(riskScore, 100),
      recommendation,
      scannedAt: new Date(),
    };
  },

  getDlpRules: (): DlpRule[] => mockDlpRules,

  // Audit Trail
  logAction: async (
    userId: string,
    action: ActionType,
    resourceType: AuditLog['resourceType'],
    resourceId?: string,
    details?: Record<string, any>,
    status: AuditLog['status'] = 'SUCCESS'
  ): Promise<AuditLog> => {
    const log: AuditLog = {
      id: `audit-${Date.now()}`,
      userId,
      action,
      resourceType,
      resourceId,
      timestamp: new Date(),
      ipAddress: '192.168.1.100', // Would come from request
      userAgent: 'Mozilla/5.0', // Would come from request
      details: details || {},
      status,
    };
    // In production: Write to immutable audit log storage
    return log;
  },

  getAuditLogs: async (filters?: {
    userId?: string;
    action?: ActionType;
    resourceType?: AuditLog['resourceType'];
    startDate?: Date;
    endDate?: Date;
  }): Promise<AuditLog[]> => {
    let logs = [...mockAuditLogs];
    
    if (filters?.userId) {
      logs = logs.filter(log => log.userId === filters.userId);
    }
    if (filters?.action) {
      logs = logs.filter(log => log.action === filters.action);
    }
    if (filters?.resourceType) {
      logs = logs.filter(log => log.resourceType === filters.resourceType);
    }
    if (filters?.startDate) {
      logs = logs.filter(log => log.timestamp >= filters.startDate!);
    }
    if (filters?.endDate) {
      logs = logs.filter(log => log.timestamp <= filters.endDate!);
    }
    
    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  },

  // Retention Policies
  getRetentionPolicies: (): RetentionPolicy[] => mockRetentionPolicies,

  applyRetentionPolicy: async (policy: RetentionPolicy): Promise<{ deleted: number; archived: number }> => {
    // In production: Run background job to apply policy
    return { deleted: 0, archived: 0 };
  },

  // Compliance Templates
  getComplianceTemplates: (): ComplianceTemplate[] => mockComplianceTemplates,

  applyComplianceTemplate: async (templateId: ComplianceTemplate['id']): Promise<void> => {
    // In production: Apply template settings to organization
    console.log(`Applying compliance template: ${templateId}`);
  },

  // Session Management
  getActiveSessions: (userId: string): UserSession[] => {
    return mockSessions.filter(s => s.userId === userId && s.isActive);
  },

  revokeSession: async (sessionId: string): Promise<boolean> => {
    // In production: Invalidate session token
    console.log(`Revoking session: ${sessionId}`);
    return true;
  },

  revokeAllOtherSessions: async (userId: string, currentSessionId: string): Promise<number> => {
    // In production: Revoke all sessions except current
    return mockSessions.filter(s => s.userId === userId && s.id !== currentSessionId).length;
  },

  // IP Whitelisting
  getIpWhitelist: (): IpWhitelistRule[] => mockIpWhitelist,

  checkIpAccess: async (ipAddress: string): Promise<{ allowed: boolean; reason?: string }> => {
    const whitelist = mockIpWhitelist;
    if (whitelist.length === 0) return { allowed: true };

    // Simple CIDR check (production would use proper library)
    for (const rule of whitelist) {
      if (ipAddress.startsWith(rule.cidr.split('/')[0].split('.').slice(0, 3).join('.'))) {
        return { allowed: true };
      }
    }
    
    return { allowed: false, reason: 'IP address not in whitelist' };
  },

  // Secure File Sharing
  createSecureShare: async (
    fileId: string,
    fileName: string,
    senderId: string,
    recipientEmail: string,
    password: string,
    maxDownloads: number,
    expiresAt: Date
  ): Promise<SecureFileShare> => {
    // In production: Hash password, store in secure storage
    return {
      id: `secure-file-${Date.now()}`,
      fileId,
      fileName,
      senderId,
      recipientEmail,
      passwordHash: '$2b$10$hashed...',
      maxDownloads,
      currentDownloads: 0,
      expiresAt,
      isRevoked: false,
      downloadHistory: [],
    };
  },

  downloadSecureFile: async (shareId: string, password: string, ipAddress: string): Promise<{ success: boolean; url?: string; error?: string }> => {
    const share = mockSecureFiles.find(f => f.id === shareId);
    if (!share) return { success: false, error: 'Share not found' };
    if (share.isRevoked) return { success: false, error: 'Share has been revoked' };
    if (new Date() > share.expiresAt) return { success: false, error: 'Share has expired' };
    if (share.currentDownloads >= share.maxDownloads) return { success: false, error: 'Download limit reached' };
    
    // In production: Verify password hash
    return { success: true, url: 'https://secure-download.example.com/file' };
  },

  revokeSecureShare: async (shareId: string): Promise<boolean> => {
    // In production: Mark share as revoked
    return true;
  },

  // Anonymous Reporting
  submitAnonymousReport: async (
    report: Omit<AnonymousReport, 'id' | 'submittedAt' | 'status'>
  ): Promise<AnonymousReport> => {
    return {
      id: `report-${Date.now()}`,
      submittedAt: new Date(),
      status: 'PENDING',
      ...report,
    };
  },

  getAnonymousReports: async (status?: AnonymousReport['status']): Promise<AnonymousReport[]> => {
    let reports = [...mockAnonymousReports];
    if (status) {
      reports = reports.filter(r => r.status === status);
    }
    return reports.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
  },

  updateReportStatus: async (reportId: string, status: AnonymousReport['status'], notes?: string): Promise<void> => {
    // In production: Update report in database
    console.log(`Updating report ${reportId} to ${status}`);
  },
};

export default securityService;
