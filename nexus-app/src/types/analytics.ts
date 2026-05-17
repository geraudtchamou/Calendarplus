/**
 * Data Intelligence & Reporting Types
 */

// Email Performance Heatmaps
export interface EmailHeatmap {
  emailId: string;
  subject: string;
  sentAt: Date;
  recipients: number;
  opens: number;
  clicks: number;
  sections: HeatmapSection[];
  engagementScore: number;
  avgTimeSpent: number; // seconds
}

export interface HeatmapSection {
  id: string;
  type: 'header' | 'body' | 'cta' | 'footer' | 'image' | 'link';
  content: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  views: number;
  clicks: number;
  avgViewDuration: number;
  engagementRate: number;
}

// CRM Health Dashboard
export interface CrmHealthMetrics {
  leadResponseTime: {
    avg: number; // minutes
    median: number;
    p90: number;
    trend: 'improving' | 'stable' | 'declining';
  };
  conversionRates: {
    byChannel: ChannelConversion[];
    overall: number;
    trend: number; // percentage change
  };
  pipelineVelocity: {
    avgDaysInStage: number;
    avgDealSize: number;
    velocityScore: number;
    trend: 'accelerating' | 'stable' | 'slowing';
  };
  dataQuality: {
    completenessScore: number;
    duplicateRate: number;
    staleRecords: number;
    healthScore: 'excellent' | 'good' | 'fair' | 'poor';
  };
  activityMetrics: {
    emailsPerDay: number;
    callsPerDay: number;
    meetingsPerWeek: number;
    tasksCompletedRate: number;
  };
}

export interface ChannelConversion {
  channel: 'email' | 'phone' | 'website' | 'referral' | 'social' | 'event';
  leads: number;
  converted: number;
  rate: number;
  revenue: number;
}

// Meeting Cost Calculator
export interface MeetingCostAnalysis {
  meetingId: string;
  title: string;
  duration: number; // minutes
  attendees: MeetingAttendeeCost[];
  totalCost: number;
  costPerMinute: number;
  roi?: {
    estimatedValue: number;
    netRoi: number;
    confidence: 'low' | 'medium' | 'high';
  };
  recommendations: string[];
}

export interface MeetingAttendeeCost {
  attendeeId: string;
  name: string;
  role: string;
  hourlyRate: number;
  cost: number;
}

// Churn Prediction Model
export interface ChurnPrediction {
  contactId: string;
  contactName: string;
  company?: string;
  churnProbability: number; // 0-1
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: ChurnRiskFactor[];
  predictedChurnDate?: Date;
  recommendedActions: ChurnPreventionAction[];
  lastUpdated: Date;
}

export interface ChurnRiskFactor {
  factor: string;
  impact: 'low' | 'medium' | 'high';
  description: string;
  trend: 'worsening' | 'stable' | 'improving';
}

export interface ChurnPreventionAction {
  action: string;
  priority: 'low' | 'medium' | 'high';
  expectedImpact: number;
  effort: 'low' | 'medium' | 'high';
}

// Revenue Attribution
export interface RevenueAttribution {
  dealId: string;
  dealName: string;
  value: number;
  closedDate: Date;
  touchpoints: AttributionTouchpoint[];
  attributionModel: 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'position_based';
  attributedRevenue: {
    email: number;
    meeting: number;
    call: number;
    other: number;
  };
  topContributors: AttributionContributor[];
}

export interface AttributionTouchpoint {
  id: string;
  type: 'email' | 'meeting' | 'call' | 'demo' | 'proposal';
  date: Date;
  participantIds: string[];
  outcome: string;
  sentimentScore?: number;
  weight: number;
}

export interface AttributionContributor {
  name: string;
  role: string;
  touchpoints: number;
  attributedRevenue: number;
  percentage: number;
}

// Custom Report Builder
export interface CustomReport {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  config: ReportConfig;
  schedule?: ReportSchedule;
  sharedWith: string[];
  lastRun?: Date;
  nextRun?: Date;
}

export interface ReportConfig {
  dataSource: 'emails' | 'crm' | 'meetings' | 'tasks' | 'combined';
  fields: ReportField[];
  filters: ReportFilter[];
  groupBy?: string[];
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  aggregations: ReportAggregation[];
  visualizations: VisualizationConfig[];
  dateRange: {
    type: 'last_7_days' | 'last_30_days' | 'last_quarter' | 'last_year' | 'custom';
    start?: Date;
    end?: Date;
  };
}

export interface ReportField {
  name: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'currency';
}

export interface ReportFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in';
  value: any;
}

export interface ReportAggregation {
  field: string;
  function: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'distinct_count';
  alias: string;
}

export interface VisualizationConfig {
  type: 'bar' | 'line' | 'pie' | 'table' | 'funnel' | 'scatter' | 'heatmap';
  title: string;
  xAxis?: string;
  yAxis?: string;
  metrics: string[];
  dimensions?: string[];
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string; // HH:mm
  recipients: string[];
  format: 'pdf' | 'csv' | 'excel';
  enabled: boolean;
}

// Anomaly Detection
export interface AnomalyAlert {
  id: string;
  type: 'email_open_rate' | 'meeting_no_show' | 'conversion_drop' | 'response_time_spike' | 'pipeline_stall';
  metric: string;
  currentValue: number;
  expectedValue: number;
  deviation: number; // percentage
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: Date;
  description: string;
  possibleCauses: string[];
  recommendedActions: string[];
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

export interface AnomalyDetectionConfig {
  metric: string;
  threshold: number; // percentage deviation
  sensitivity: 'low' | 'medium' | 'high';
  baselinePeriod: '7_days' | '30_days' | '90_days';
  alertChannels: ('email' | 'push' | 'slack')[];
  enabled: boolean;
}

// Team Leaderboards
export interface TeamLeaderboard {
  id: string;
  name: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'all_time';
  category: LeaderboardCategory;
  rankings: LeaderboardRanking[];
  startDate: Date;
  endDate?: Date;
  lastUpdated: Date;
}

export type LeaderboardCategory = 
  | 'emails_sent'
  | 'meetings_booked'
  | 'calls_made'
  | 'deals_closed'
  | 'revenue_generated'
  | 'tasks_completed'
  | 'response_time'
  | 'customer_satisfaction';

export interface LeaderboardRanking {
  rank: number;
  userId: string;
  userName: string;
  avatarUrl?: string;
  value: number;
  change: number; // rank change from previous period
  trend: 'up' | 'down' | 'same';
  badges: string[];
}

// Email Thread Analysis
export interface EmailThreadAnalysis {
  threadId: string;
  subject: string;
  participants: string[];
  messageCount: number;
  duration: number; // hours from first to last message
  avgResponseTime: number; // minutes
  sentimentAnalysis: {
    overall: 'positive' | 'neutral' | 'negative';
    trajectory: 'improving' | 'stable' | 'declining';
    scores: number[]; // per message
  };
  lengthAnalysis: {
    avgMessageLength: number; // words
    totalWords: number;
    efficiency: 'efficient' | 'average' | 'verbose';
  };
  outcomes: {
    resolved: boolean;
    actionItemsGenerated: number;
    meetingScheduled: boolean;
    dealProgressed: boolean;
  };
  recommendations: ThreadImprovement[];
}

export interface ThreadImprovement {
  type: 'response_time' | 'message_length' | 'clarity' | 'tone' | 'follow_up';
  suggestion: string;
  impact: 'low' | 'medium' | 'high';
  example?: string;
}

// Data Export Integration
export interface ExportConfig {
  id: string;
  name: string;
  destination: 'power_bi' | 'tableau' | 'google_data_studio' | 'csv' | 'json';
  dataSource: string;
  fields: string[];
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
  };
  authentication: {
    type: 'oauth' | 'api_key' | 'credentials';
    configured: boolean;
  };
  lastExport?: Date;
  status: 'active' | 'paused' | 'error';
  error?: string;
}

export interface ExportJob {
  id: string;
  configId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  recordsExported: number;
  startedAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
  error?: string;
}

// Dashboard Widgets
export interface DashboardWidget {
  id: string;
  type: 'metric_card' | 'chart' | 'table' | 'funnel' | 'gauge' | 'trend';
  title: string;
  config: any;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  refreshInterval: number; // seconds
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  isDefault: boolean;
  sharedWith: string[];
}
