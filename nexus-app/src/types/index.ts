// Nexus AI - Second Brain Productivity App Types

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'premium' | 'team' | 'enterprise';
  aiCredits: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  folderId?: string;
  tags: string[];
  color?: string;
  isPinned: boolean;
  isFavorite: boolean;
  attachments: Attachment[];
  linkedNoteIds: string[];
  aiSummary?: string;
  aiKeywords?: string[];
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  children: Folder[];
  noteCount: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  projectId?: string;
  labels: string[];
  subtasks: Subtask[];
  dependencies: string[];
  recurring?: RecurringConfig;
  estimatedMinutes?: number;
  actualMinutes?: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface RecurringConfig {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  taskIds: string[];
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  attendees: string[];
  color?: string;
  isAllDay: boolean;
  recurring?: RecurringConfig;
  reminders: Reminder[];
  relatedTaskIds?: string[];
  relatedNoteIds?: string[];
  meetingNotes?: string;
}

export interface Reminder {
  id: string;
  type: 'notification' | 'email' | 'sms';
  minutesBefore: number;
}

export interface VoiceRecording {
  id: string;
  title: string;
  audioUrl: string;
  duration: number;
  createdAt: Date;
  transcript?: string;
  aiSummary?: string;
  keywords?: string[];
  speakers?: Speaker[];
  isProcessing: boolean;
}

export interface Speaker {
  id: string;
  name: string;
  segments: TimeSegment[];
}

export interface TimeSegment {
  start: number;
  end: number;
  text: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'audio' | 'video' | 'other';
  url: string;
  size: number;
  createdAt: Date;
}

export interface KnowledgeNode {
  id: string;
  type: 'note' | 'task' | 'event' | 'recording';
  title: string;
  connections: KnowledgeConnection[];
  position?: { x: number; y: number };
}

export interface KnowledgeConnection {
  targetId: string;
  strength: number;
  type: 'related' | 'referenced' | 'ai-suggested';
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  config: Record<string, unknown>;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export type WidgetType = 
  | 'calendar' 
  | 'tasks' 
  | 'notes' 
  | 'voice' 
  | 'analytics' 
  | 'focus' 
  | 'goals' 
  | 'ai-brief';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate?: Date;
  progress: number;
  milestones: Milestone[];
  category: 'personal' | 'work' | 'health' | 'learning' | 'other';
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
}

export interface FocusSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  type: 'pomodoro' | 'deep-work' | 'short-break' | 'long-break';
  completed: boolean;
  distractions: number;
}

export interface AIAssistantMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: AIAction[];
}

export interface AIAction {
  type: 'create-task' | 'create-event' | 'search' | 'summarize' | 'generate';
  label: string;
  payload?: Record<string, unknown>;
}

export interface ProductivityAnalytics {
  tasksCompleted: number;
  focusTime: number;
  streakDays: number;
  weeklyCompletionRate: number;
  calendarUtilization: number;
  topCategories: CategoryStat[];
  dailyTrend: DailyStat[];
}

export interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
}

export interface DailyStat {
  date: Date;
  tasksCompleted: number;
  focusMinutes: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  sync: SyncSettings;
}

export interface NotificationSettings {
  enabled: boolean;
  taskReminders: boolean;
  eventReminders: boolean;
  dailyBrief: boolean;
  weeklyReport: boolean;
}

export interface PrivacySettings {
  biometricLock: boolean;
  pinEnabled: boolean;
  encryptionEnabled: boolean;
}

export interface SyncSettings {
  enabled: boolean;
  autoSync: boolean;
  wifiOnly: boolean;
}

export interface SearchResult {
  type: 'note' | 'task' | 'event' | 'recording' | 'email' | 'contact' | 'lead' | 'deal';
  id: string;
  title: string;
  preview: string;
  relevance: number;
  highlightedText?: string;
}

// ==================== EMAIL TYPES ====================

export interface EmailAccount {
  id: string;
  email: string;
  provider: 'gmail' | 'outlook' | 'yahoo' | 'imap' | 'other';
  name: string;
  color?: string;
  isConnected: boolean;
  lastSynced?: Date;
}

export interface EmailFolder {
  id: string;
  name: string;
  accountId: string;
  parentId?: string;
  unreadCount: number;
  totalCount: number;
  systemFolder?: 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam' | 'archive';
}

export interface EmailLabel {
  id: string;
  name: string;
  color: string;
  accountId?: string;
}

export interface EmailAttachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url?: string;
  cloudStorageUrl?: string;
}

export interface Email {
  id: string;
  accountId: string;
  folderId?: string;
  subject: string;
  from: EmailContact;
  to: EmailContact[];
  cc?: EmailContact[];
  bcc?: EmailContact[];
  body: string;
  bodyPreview: string;
  isHtml: boolean;
  isRead: boolean;
  isStarred: boolean;
  isDraft: boolean;
  labels: string[];
  attachments: EmailAttachment[];
  receivedAt: Date;
  sentAt?: Date;
  threadId?: string;
  inReplyTo?: string;
  tracking?: EmailTracking;
  scheduledAt?: Date;
  encryption?: 'none' | 'pgp' | 'smime';
}

export interface EmailContact {
  email: string;
  name?: string;
}

export interface EmailTracking {
  opened: boolean;
  openedAt?: Date;
  openCount: number;
  linksClicked: LinkClick[];
}

export interface LinkClick {
  url: string;
  clickedAt: Date;
  clickCount: number;
}

export interface EmailFilter {
  id: string;
  name: string;
  conditions: FilterCondition[];
  actions: FilterAction[];
  enabled: boolean;
}

export interface FilterCondition {
  field: 'from' | 'to' | 'subject' | 'body' | 'hasAttachment' | 'label';
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'regex';
  value: string;
}

export interface FilterAction {
  type: 'moveToFolder' | 'addLabel' | 'markAsRead' | 'star' | 'forward' | 'delete';
  value?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  variables: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  segmentIds: string[];
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'paused';
  scheduledAt?: Date;
  sentCount: number;
  openRate: number;
  clickRate: number;
  createdAt: Date;
}

export interface EmailSegment {
  id: string;
  name: string;
  description?: string;
  criteria: SegmentCriteria[];
  contactCount: number;
}

export interface SegmentCriteria {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'in' | 'notIn';
  value: unknown;
}

export interface EmailSignature {
  id: string;
  name: string;
  signature: string;
  isDefault: boolean;
  conditions?: SignatureCondition[];
}

export interface SignatureCondition {
  field: 'accountId' | 'recipientDomain' | 'emailType';
  value: string;
}

// ==================== CRM TYPES ====================

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  avatar?: string;
  socialProfiles: SocialProfile[];
  addresses: Address[];
  customFields: Record<string, unknown>;
  tags: string[];
  ownerId?: string;
  source: 'manual' | 'import' | 'website' | 'referral' | 'social' | 'email';
  lifecycleStage: 'subscriber' | 'lead' | 'mql' | 'sql' | 'opportunity' | 'customer' | 'evangelist';
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt?: Date;
  nextFollowUpAt?: Date;
  notes: CrmNote[];
  tasks: string[];
  deals: string[];
  emails: EmailSummary[];
  calls: CallLog[];
  meetings: MeetingLog[];
}

export interface SocialProfile {
  platform: 'linkedin' | 'twitter' | 'facebook' | 'github' | 'other';
  url: string;
  username?: string;
}

export interface Address {
  type: 'work' | 'home' | 'billing' | 'shipping';
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface CrmNote {
  id: string;
  content: string;
  createdById: string;
  createdAt: Date;
  isPrivate: boolean;
}

export interface CallLog {
  id: string;
  direction: 'inbound' | 'outbound';
  phoneNumber: string;
  duration: number;
  recordedAt: Date;
  recordingUrl?: string;
  notes?: string;
  outcome?: 'completed' | 'voicemail' | 'no-answer' | 'busy' | 'wrong-number';
}

export interface MeetingLog {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees: string[];
  notes?: string;
  calendarEventId?: string;
}

export interface EmailSummary {
  id: string;
  subject: string;
  snippet: string;
  receivedAt: Date;
  isRead: boolean;
}

export interface Lead {
  id: string;
  contactId: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
  score: number;
  source: string;
  campaignId?: string;
  assignedTo?: string;
  convertedAt?: Date;
  conversionDetails?: {
    dealId: string;
    convertedToContactId: string;
  };
  activities: Activity[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'task' | 'webinar' | 'demo';
  subject: string;
  description?: string;
  completed: boolean;
  completedAt?: Date;
  dueDate?: Date;
  relatedTo: RelatedItem[];
  createdById: string;
  createdAt: Date;
}

export interface RelatedItem {
  type: 'contact' | 'lead' | 'deal' | 'company';
  id: string;
}

export interface Deal {
  id: string;
  name: string;
  contactId: string;
  companyId?: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number;
  expectedCloseDate?: Date;
  actualCloseDate?: Date;
  status: 'open' | 'won' | 'lost' | 'archived';
  lossReason?: string;
  source: string;
  ownerId?: string;
  customFields: Record<string, unknown>;
  tasks: string[];
  notes: CrmNote[];
  activities: Activity[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DealStage {
  id: string;
  pipelineId: string;
  name: string;
  order: number;
  color?: string;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: DealStage[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  website?: string;
  phone?: string;
  addresses: Address[];
  customFields: Record<string, unknown>;
  contacts: string[];
  deals: string[];
  ownerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  enabled: boolean;
  runs: number;
  lastRunAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowTrigger {
  type: 'contactCreated' | 'contactUpdated' | 'dealCreated' | 'dealStageChanged' | 'formSubmitted' | 'emailOpened' | 'taskCompleted';
  filters?: Record<string, unknown>;
}

export interface WorkflowCondition {
  field: string;
  operator: string;
  value: unknown;
}

export interface WorkflowAction {
  type: 'sendEmail' | 'createTask' | 'updateField' | 'addTag' | 'assignOwner' | 'createDeal' | 'notifyUser' | 'webhook';
  config: Record<string, unknown>;
}

export interface CrmReport {
  id: string;
  name: string;
  type: 'sales' | 'pipeline' | 'activity' | 'conversion' | 'revenue';
  dateRange: { start: Date; end: Date };
  data: Record<string, unknown>;
  charts: ChartConfig[];
  createdAt: Date;
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'funnel' | 'table';
  title: string;
  data: unknown[];
  config?: Record<string, unknown>;
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  assignedTo: string;
  assignedBy: string;
  assignedAt: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
}

export interface CrmSettings {
  customFields: CustomFieldDefinition[];
  pipelines: Pipeline[];
  workflows: Workflow[];
  emailTemplates: EmailTemplate[];
  signatures: EmailSignature[];
  automationEnabled: boolean;
  emailSyncEnabled: boolean;
  taskRemindersEnabled: boolean;
}

export interface CustomFieldDefinition {
  id: string;
  entityType: 'contact' | 'lead' | 'deal' | 'company';
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiSelect' | 'checkbox' | 'url' | 'email' | 'phone';
  required: boolean;
  options?: string[];
  defaultValue?: unknown;
}
