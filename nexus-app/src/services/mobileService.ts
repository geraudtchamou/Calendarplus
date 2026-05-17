/**
 * Mobile & Cross-Platform Service
 * Handles offline mode, voice-to-email, QR codes, messaging integrations, 
 * smartwatch notifications, business card scanning, geolocation reminders, and more.
 */

import {
  VoiceCommand,
  CrmPlaceholder,
  QrCheckIn,
  QrAttendee,
  MessagingIntegration,
  MessagingMessage,
  SmartwatchNotification,
  BusinessCardScan,
  ExtractedContactData,
  ContactMergeSuggestion,
  GeoReminder,
  DocumentScan,
  MeetingJoinInfo,
  PushNotificationConfig,
  PushNotification,
  OfflineQueueItem,
  OfflineCache,
  SyncStatus,
  SyncConflict,
} from '../types/mobile';

import { Contact, Lead } from '../types';

class MobileService {
  private offlineQueue: OfflineQueueItem[] = [];
  private offlineCache: OfflineCache | null = null;
  private isOnline: boolean = true;
  private syncInProgress: boolean = false;

  // ==================== OFFLINE MODE ====================

  /**
   * Check current online status
   */
  checkOnlineStatus(): boolean {
    this.isOnline = navigator.onLine;
    return this.isOnline;
  }

  /**
   * Queue an action for offline execution
   */
  queueOfflineAction(
    type: OfflineQueueItem['type'],
    payload: any
  ): OfflineQueueItem {
    const item: OfflineQueueItem = {
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      payload,
      createdAt: new Date(),
      retryCount: 0,
      status: 'pending',
    };

    this.offlineQueue.push(item);
    this.saveOfflineQueue();
    return item;
  }

  /**
   * Process offline queue when back online
   */
  async processOfflineQueue(): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const item of this.offlineQueue) {
      if (item.status === 'pending' || item.status === 'failed') {
        try {
          item.status = 'processing';
          item.lastAttempt = new Date();

          // Simulate API call based on action type
          await this.executeOfflineAction(item);

          item.status = 'completed';
          success++;
        } catch (error) {
          item.retryCount++;
          item.error = error instanceof Error ? error.message : 'Unknown error';
          
          if (item.retryCount >= 3) {
            item.status = 'failed';
          } else {
            item.status = 'pending';
          }
          failed++;
        }
      }
    }

    this.saveOfflineQueue();
    return { success, failed };
  }

  private async executeOfflineAction(item: OfflineQueueItem): Promise<void> {
    // Simulate different action types
    await new Promise(resolve => setTimeout(resolve, 500));
    
    switch (item.type) {
      case 'email_send':
        // Simulate sending email
        console.log('Sending queued email:', item.payload.subject);
        break;
      case 'crm_update':
        // Simulate CRM update
        console.log('Updating CRM record:', item.payload.contactId);
        break;
      case 'task_create':
        // Simulate task creation
        console.log('Creating task:', item.payload.title);
        break;
      case 'event_create':
        // Simulate event creation
        console.log('Creating event:', item.payload.title);
        break;
    }
  }

  /**
   * Save offline queue to local storage
   */
  private saveOfflineQueue(): void {
    try {
      localStorage.setItem('nexus_offline_queue', JSON.stringify(this.offlineQueue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  /**
   * Load offline queue from local storage
   */
  loadOfflineQueue(): OfflineQueueItem[] {
    try {
      const stored = localStorage.getItem('nexus_offline_queue');
      if (stored) {
        this.offlineQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
    return this.offlineQueue;
  }

  /**
   * Cache data for offline access
   */
  cacheData(cache: Partial<OfflineCache>): void {
    this.offlineCache = {
      emails: cache.emails || [],
      contacts: cache.contacts || [],
      deals: cache.deals || [],
      events: cache.events || [],
      tasks: cache.tasks || [],
      lastSync: new Date(),
      size: this.calculateCacheSize(),
    };
    this.saveOfflineCache();
  }

  private calculateCacheSize(): number {
    if (!this.offlineCache) return 0;
    const data = JSON.stringify(this.offlineCache);
    return new Blob([data]).size;
  }

  /**
   * Save offline cache to local storage
   */
  private saveOfflineCache(): void {
    try {
      localStorage.setItem('nexus_offline_cache', JSON.stringify(this.offlineCache));
    } catch (error) {
      console.error('Failed to save offline cache:', error);
    }
  }

  /**
   * Get cached data for offline access
   */
  getOfflineCache(): OfflineCache | null {
    try {
      const stored = localStorage.getItem('nexus_offline_cache');
      if (stored) {
        this.offlineCache = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offline cache:', error);
    }
    return this.offlineCache;
  }

  /**
   * Get sync status
   */
  getSyncStatus(): SyncStatus {
    const pendingChanges = this.offlineQueue.filter(
      i => i.status === 'pending' || i.status === 'processing'
    ).length;

    return {
      lastSync: this.offlineCache?.lastSync || new Date(0),
      nextSync: this.isOnline ? new Date(Date.now() + 300000) : new Date(0),
      status: this.isOnline ? (this.syncInProgress ? 'syncing' : 'idle') : 'offline',
      pendingChanges,
      conflicts: [], // Would be populated from server
      syncStats: {
        emailsUploaded: 0,
        emailsDownloaded: 0,
        contactsUploaded: 0,
        contactsDownloaded: 0,
        errors: this.offlineQueue.filter(i => i.status === 'failed').length,
      },
    };
  }

  // ==================== VOICE-TO-EMAIL ====================

  /**
   * Start voice recording for email dictation
   */
  async startVoiceRecording(): Promise<{ stream: MediaStream; stop: () => void }> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const stop = () => {
        stream.getTracks().forEach(track => track.stop());
      };

      return { stream, stop };
    } catch (error) {
      throw new Error('Microphone access denied or not available');
    }
  }

  /**
   * Transcribe voice to text with CRM placeholder detection
   */
  async transcribeVoiceToEmail(audioBlob: Blob, language: string = 'en-US'): Promise<VoiceCommand> {
    // Simulate transcription service (would use Whisper or similar)
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockTranscript = "Hi John, I wanted to follow up on our meeting last week about the enterprise deal. Please send me the proposal by Friday. You can reach me at my office phone if you need anything.";

    // Detect CRM placeholders
    const crmPlaceholders: CrmPlaceholder[] = [];
    
    // Detect contact name
    const nameMatch = mockTranscript.match(/Hi (\w+)/i);
    if (nameMatch) {
      crmPlaceholders.push({
        type: 'contact_name',
        value: nameMatch[1],
        position: nameMatch.index || 0,
        entityId: 'contact_123',
      });
    }

    // Detect company references
    if (mockTranscript.toLowerCase().includes('enterprise deal')) {
      crmPlaceholders.push({
        type: 'company_name',
        value: 'Enterprise Corp',
        position: mockTranscript.indexOf('enterprise'),
        entityId: 'company_456',
      });
    }

    return {
      id: `voice_${Date.now()}`,
      transcript: mockTranscript,
      processedText: this.insertCrmPlaceholders(mockTranscript, crmPlaceholders),
      crmPlaceholders,
      timestamp: new Date(),
      duration: 15,
      language,
      confidence: 0.95,
    };
  }

  private insertCrmPlaceholders(text: string, placeholders: CrmPlaceholder[]): string {
    let processed = text;
    placeholders.forEach(ph => {
      processed = processed.replace(
        ph.value,
        `{{${ph.type}:${ph.entityId}}}`
      );
    });
    return processed;
  }

  // ==================== QR CODE MEETING CHECK-IN ====================

  /**
   * Generate QR code for meeting check-in
   */
  generateQrCheckIn(meetingId: string, expiresMinutes: number = 60): QrCheckIn {
    const qrData = JSON.stringify({
      meetingId,
      timestamp: Date.now(),
      nonce: Math.random().toString(36),
    });

    return {
      id: `qr_${meetingId}_${Date.now()}`,
      meetingId,
      qrCodeData: qrData,
      attendees: [],
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + expiresMinutes * 60000),
      status: 'active',
    };
  }

  /**
   * Process QR code scan for attendee check-in
   */
  processQrCheckIn(qrData: string, contactId: string): QrAttendee {
    const parsed = JSON.parse(qrData);
    
    const attendee: QrAttendee = {
      id: `attendee_${Date.now()}`,
      contactId,
      name: 'John Doe', // Would fetch from CRM
      email: 'john@example.com',
      checkInTime: new Date(),
      source: 'qr_scan',
    };

    // In real implementation, would update meeting attendance
    return attendee;
  }

  /**
   * Get active QR check-ins for a meeting
   */
  getQrCheckIns(meetingId: string): QrCheckIn[] {
    // Would fetch from database
    return [];
  }

  // ==================== MESSAGING INTEGRATIONS ====================

  /**
   * Connect WhatsApp account
   */
  async connectWhatsApp(phoneNumber: string, verificationCode: string): Promise<MessagingIntegration> {
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      id: `wa_${Date.now()}`,
      platform: 'whatsapp',
      accountId: phoneNumber,
      phoneNumber,
      status: 'connected',
      lastSync: new Date(),
      webhooksEnabled: true,
    };
  }

  /**
   * Connect Telegram account
   */
  async connectTelegram(botToken: string): Promise<MessagingIntegration> {
    // Simulate bot authentication
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      id: `tg_${Date.now()}`,
      platform: 'telegram',
      accountId: botToken.split(':')[0],
      username: 'NexusBot',
      status: 'connected',
      lastSync: new Date(),
      webhooksEnabled: true,
    };
  }

  /**
   * Send message via WhatsApp or Telegram
   */
  async sendMessagingMessage(
    platform: 'whatsapp' | 'telegram',
    recipientId: string,
    content: string,
    messageType: MessagingMessage['messageType'] = 'text'
  ): Promise<MessagingMessage> {
    // Simulate sending message
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      id: `msg_${platform}_${Date.now()}`,
      platform,
      recipientId,
      content,
      messageType,
      status: 'sent',
      sentAt: new Date(),
    };
  }

  /**
   * Send meeting reminder via messaging app
   */
  async sendMeetingReminder(
    platform: 'whatsapp' | 'telegram',
    contactId: string,
    meetingTitle: string,
    meetingTime: Date
  ): Promise<MessagingMessage> {
    const content = `Reminder: Your meeting "${meetingTitle}" is scheduled for ${meetingTime.toLocaleString()}. Join link will be sent closer to the time.`;
    
    return this.sendMessagingMessage(platform, contactId, content);
  }

  // ==================== SMARTWATCH NOTIFICATIONS ====================

  /**
   * Send notification to smartwatch
   */
  async sendSmartwatchNotification(
    deviceId: string,
    notification: Omit<SmartwatchNotification, 'id' | 'sentAt' | 'read'>
  ): Promise<SmartwatchNotification> {
    // Simulate sending to watch
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      ...notification,
      id: `watch_${Date.now()}`,
      sentAt: new Date(),
      read: false,
    };
  }

  /**
   * Get notifications for smartwatch sync
   */
  getWatchNotifications(deviceId: string, platform: 'watchos' | 'wearos'): SmartwatchNotification[] {
    // Would fetch from database filtered by device
    return [
      {
        id: 'watch_1',
        type: 'email',
        title: 'New Email',
        message: 'Important: Q4 Report Ready',
        priority: 'high',
        actionRequired: true,
        actionUrl: '/email/123',
        sentAt: new Date(),
        deviceId,
        platform,
        read: false,
      },
      {
        id: 'watch_2',
        type: 'meeting',
        title: 'Meeting in 15 min',
        message: 'Product Review with Team',
        priority: 'critical',
        actionRequired: true,
        actionUrl: '/meetings/456',
        sentAt: new Date(Date.now() - 300000),
        deviceId,
        platform,
        read: false,
      },
    ];
  }

  // ==================== BUSINESS CARD SCANNER ====================

  /**
   * Scan business card and extract contact information
   */
  async scanBusinessCard(imageUrl: string): Promise<BusinessCardScan> {
    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const extractedData: ExtractedContactData = {
      firstName: 'Sarah',
      lastName: 'Johnson',
      title: 'VP of Sales',
      company: 'TechCorp Inc.',
      emails: ['sarah.johnson@techcorp.com'],
      phones: ['+1-555-0123'],
      website: 'www.techcorp.com',
      linkedin: 'linkedin.com/in/sarahjohnson',
    };

    // Check for existing contacts
    const suggestions: ContactMergeSuggestion[] = [
      {
        contactId: 'contact_789',
        name: 'Sarah J.',
        matchScore: 0.75,
        matchFields: ['email', 'company'],
      },
    ];

    return {
      id: `scan_${Date.now()}`,
      imageUrl,
      extractedData,
      confidence: 0.92,
      scannedAt: new Date(),
      status: 'processed',
      suggestions,
    };
  }

  /**
   * Create contact from business card scan
   */
  async createContactFromScan(scanId: string): Promise<Contact> {
    // Would create contact in CRM
    return {
      id: `contact_${Date.now()}`,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@techcorp.com',
      phone: '+1-555-0123',
      company: 'TechCorp Inc.',
      title: 'VP of Sales',
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: 'user_1',
      lifecycleStage: 'lead',
    };
  }

  // ==================== GEOLOCATION REMINDERS ====================

  /**
   * Create geolocation-based reminder
   */
  createGeoReminder(reminder: Omit<GeoReminder, 'id' | 'createdAt' | 'triggered'>): GeoReminder {
    return {
      ...reminder,
      id: `geo_${Date.now()}`,
      createdAt: new Date(),
      triggered: false,
    };
  }

  /**
   * Check if user is near any reminder locations
   */
  checkGeoReminders(currentLocation: { latitude: number; longitude: number }): GeoReminder[] {
    const triggered: GeoReminder[] = [];
    
    // Mock reminders
    const reminders: GeoReminder[] = [
      {
        id: 'geo_1',
        type: 'call',
        targetId: 'contact_123',
        targetName: 'John Smith',
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          address: 'San Francisco, CA',
          radius: 100,
        },
        action: 'Call to follow up on proposal',
        triggered: false,
        expiresAt: new Date(Date.now() + 86400000),
        createdAt: new Date(),
      },
    ];

    reminders.forEach(reminder => {
      if (!reminder.triggered && !reminder.expiresAt || reminder.expiresAt > new Date()) {
        const distance = this.calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          reminder.location.latitude,
          reminder.location.longitude
        );

        if (distance <= reminder.location.radius) {
          reminder.triggered = true;
          reminder.triggeredAt = new Date();
          triggered.push(reminder);
        }
      }
    });

    return triggered;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // ==================== DOCUMENT SCANNER ====================

  /**
   * Scan document and extract text
   */
  async scanDocument(imageUrl: string, documentType?: DocumentScan['documentType']): Promise<DocumentScan> {
    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      id: `doc_${Date.now()}`,
      imageUrl,
      processedImageUrl: `${imageUrl}_processed`,
      documentType: documentType || 'other',
      extractedText: 'Invoice #12345\nDate: Jan 15, 2024\nAmount: $5,000\nDue: Feb 15, 2024',
      ocrConfidence: 0.94,
      scannedAt: new Date(),
      metadata: {
        pages: 1,
        size: 245000,
        format: 'PDF',
      },
    };
  }

  /**
   * Attach scanned document to email or CRM record
   */
  async attachDocumentToRecord(
    scanId: string,
    recordType: 'email' | 'crm_record' | 'task',
    recordId: string
  ): Promise<DocumentScan> {
    // Would update the record with attachment
    return {
      id: scanId,
      imageUrl: '',
      processedImageUrl: '',
      documentType: 'other',
      extractedText: '',
      ocrConfidence: 0.94,
      scannedAt: new Date(),
      attachedTo: {
        type: recordType,
        id: recordId,
      },
      metadata: {
        pages: 1,
        size: 245000,
        format: 'PDF',
      },
    };
  }

  // ==================== ONE-TAP MEETING JOIN ====================

  /**
   * Get meeting join information
   */
  getMeetingJoinInfo(meetingId: string): MeetingJoinInfo {
    // Would fetch from calendar service
    return {
      id: `join_${meetingId}`,
      meetingId,
      platform: 'zoom',
      joinUrl: 'https://zoom.us/j/123456789',
      meetingId_code: '123 456 789',
      passcode: 'abc123',
      canJoinNow: true,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 3600000),
      attendees: 5,
    };
  }

  /**
   * Join meeting with one tap
   */
  async joinMeeting(meetingId: string): Promise<{ success: boolean; url: string }> {
    const joinInfo = this.getMeetingJoinInfo(meetingId);
    
    if (!joinInfo.canJoinNow) {
      throw new Error('Meeting has not started yet');
    }

    // In mobile app, would open native app or web view
    return {
      success: true,
      url: joinInfo.joinUrl,
    };
  }

  // ==================== PUSH NOTIFICATIONS ====================

  /**
   * Register device for push notifications
   */
  registerDevice(token: string, platform: 'ios' | 'android' | 'web'): PushNotificationConfig {
    const config: PushNotificationConfig = {
      id: `device_${Date.now()}`,
      deviceToken: token,
      platform,
      enabled: true,
      categories: {
        newLeads: true,
        emailReceived: true,
        meetingReminders: true,
        taskDue: true,
        dealUpdates: true,
        mentions: true,
      },
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '07:00',
      },
    };

    // Would save to server
    return config;
  }

  /**
   * Send push notification for new lead
   */
  async sendNewLeadNotification(leadName: string, company: string): Promise<PushNotification> {
    return {
      id: `push_${Date.now()}`,
      title: 'New Lead Captured',
      body: `${leadName} from ${company} just filled out your form`,
      data: { type: 'new_lead', leadName, company },
      sentAt: new Date(),
      read: false,
      actionUrl: '/crm/leads',
    };
  }

  /**
   * Get unread notifications
   */
  getUnreadNotifications(): PushNotification[] {
    // Would fetch from server
    return [
      {
        id: 'push_1',
        title: 'New Lead',
        body: 'Acme Corp submitted contact form',
        data: { type: 'new_lead' },
        sentAt: new Date(Date.now() - 60000),
        read: false,
        actionUrl: '/crm/leads',
      },
    ];
  }

  /**
   * Mark notification as read
   */
  markNotificationRead(notificationId: string): void {
    // Would update on server
    console.log('Marking notification read:', notificationId);
  }
}

export const mobileService = new MobileService();
export default mobileService;
