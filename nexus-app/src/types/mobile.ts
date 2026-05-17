/**
 * Mobile & Cross-Platform Features Types
 */

// Voice-to-Email
export interface VoiceCommand {
  id: string;
  transcript: string;
  processedText: string;
  crmPlaceholders: CrmPlaceholder[];
  timestamp: Date;
  duration: number;
  language: string;
  confidence: number;
}

export interface CrmPlaceholder {
  type: 'contact_name' | 'company_name' | 'deal_value' | 'meeting_date' | 'phone' | 'email';
  value: string;
  position: number;
  entityId?: string;
}

// QR Code Meeting Check-in
export interface QrCheckIn {
  id: string;
  meetingId: string;
  qrCodeData: string;
  attendees: QrAttendee[];
  createdAt: Date;
  expiresAt: Date;
  status: 'active' | 'expired' | 'completed';
}

export interface QrAttendee {
  id: string;
  contactId: string;
  name: string;
  email: string;
  checkInTime: Date;
  source: 'qr_scan' | 'manual';
}

// WhatsApp/Telegram Integration
export interface MessagingIntegration {
  id: string;
  platform: 'whatsapp' | 'telegram';
  accountId: string;
  phoneNumber?: string;
  username?: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: Date;
  webhooksEnabled: boolean;
}

export interface MessagingMessage {
  id: string;
  platform: 'whatsapp' | 'telegram';
  recipientId: string;
  content: string;
  messageType: 'text' | 'template' | 'media' | 'document';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  metadata?: Record<string, any>;
}

// Smartwatch Notifications
export interface SmartwatchNotification {
  id: string;
  type: 'email' | 'meeting' | 'lead' | 'task' | 'reminder';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionRequired: boolean;
  actionUrl?: string;
  sentAt: Date;
  deviceId: string;
  platform: 'watchos' | 'wearos';
  read: boolean;
}

// Mobile Lead Capture (Business Card Scanner)
export interface BusinessCardScan {
  id: string;
  imageUrl: string;
  extractedData: ExtractedContactData;
  confidence: number;
  scannedAt: Date;
  status: 'pending' | 'processed' | 'created' | 'merged';
  contactId?: string;
  suggestions: ContactMergeSuggestion[];
}

export interface ExtractedContactData {
  firstName?: string;
  lastName?: string;
  title?: string;
  company?: string;
  emails: string[];
  phones: string[];
  website?: string;
  address?: string;
  linkedin?: string;
  twitter?: string;
}

export interface ContactMergeSuggestion {
  contactId: string;
  name: string;
  matchScore: number;
  matchFields: string[];
}

// Geolocation-Based Reminders
export interface GeoReminder {
  id: string;
  type: 'call' | 'visit' | 'follow_up' | 'meeting';
  targetId: string; // contactId, leadId, etc.
  targetName: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    radius: number; // in meters
  };
  action: string;
  triggered: boolean;
  triggeredAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
}

// Mobile Document Scanner
export interface DocumentScan {
  id: string;
  imageUrl: string;
  processedImageUrl: string;
  documentType: 'business_card' | 'invoice' | 'contract' | 'receipt' | 'other';
  extractedText: string;
  ocrConfidence: number;
  scannedAt: Date;
  attachedTo?: {
    type: 'email' | 'crm_record' | 'task';
    id: string;
  };
  metadata: {
    pages: number;
    size: number;
    format: string;
  };
}

// One-Tap Meeting Join
export interface MeetingJoinInfo {
  id: string;
  meetingId: string;
  platform: 'zoom' | 'teams' | 'google_meet' | 'webex' | 'other';
  joinUrl: string;
  meetingId_code?: string;
  passcode?: string;
  hostKey?: string;
  canJoinNow: boolean;
  startsAt: Date;
  endsAt: Date;
  attendees: number;
}

// Push Notifications
export interface PushNotificationConfig {
  id: string;
  deviceToken: string;
  platform: 'ios' | 'android' | 'web';
  enabled: boolean;
  categories: {
    newLeads: boolean;
    emailReceived: boolean;
    meetingReminders: boolean;
    taskDue: boolean;
    dealUpdates: boolean;
    mentions: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm
    end: string; // HH:mm
  };
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  data: Record<string, any>;
  sentAt: Date;
  read: boolean;
  actionUrl?: string;
}

// Offline Mode
export interface OfflineQueueItem {
  id: string;
  type: 'email_send' | 'crm_update' | 'task_create' | 'event_create';
  payload: any;
  createdAt: Date;
  retryCount: number;
  lastAttempt?: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
}

export interface OfflineCache {
  emails: CachedEmail[];
  contacts: CachedContact[];
  deals: CachedDeal[];
  events: CachedEvent[];
  tasks: CachedTask[];
  lastSync: Date;
  size: number;
}

export interface CachedEmail {
  id: string;
  subject: string;
  from: string;
  to: string[];
  date: Date;
  preview: string;
  folder: string;
}

export interface CachedContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

export interface CachedDeal {
  id: string;
  name: string;
  value: number;
  stage: string;
  closeDate: Date;
}

export interface CachedEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
}

export interface CachedTask {
  id: string;
  title: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

// Cross-Platform Sync
export interface SyncStatus {
  lastSync: Date;
  nextSync: Date;
  status: 'syncing' | 'idle' | 'error' | 'offline';
  pendingChanges: number;
  conflicts: SyncConflict[];
  syncStats: {
    emailsUploaded: number;
    emailsDownloaded: number;
    contactsUploaded: number;
    contactsDownloaded: number;
    errors: number;
  };
}

export interface SyncConflict {
  id: string;
  entityType: 'email' | 'contact' | 'deal' | 'task' | 'event';
  entityId: string;
  localVersion: any;
  serverVersion: any;
  conflictType: 'update' | 'delete' | 'create';
  resolved: boolean;
  resolution?: 'keep_local' | 'keep_server' | 'merge';
}
