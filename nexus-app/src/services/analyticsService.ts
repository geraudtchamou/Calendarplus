/**
 * Data Intelligence & Analytics Service
 * Handles email heatmaps, CRM health metrics, meeting cost analysis, 
 * churn prediction, revenue attribution, custom reports, anomaly detection, and more.
 */

import {
  EmailHeatmap,
  HeatmapSection,
  CrmHealthMetrics,
  ChannelConversion,
  MeetingCostAnalysis,
  MeetingAttendeeCost,
  ChurnPrediction,
  ChurnRiskFactor,
  ChurnPreventionAction,
  RevenueAttribution,
  AttributionTouchpoint,
  AttributionContributor,
  CustomReport,
  ReportConfig,
  ReportFilter,
  ReportAggregation,
  VisualizationConfig,
  AnomalyAlert,
  AnomalyDetectionConfig,
  TeamLeaderboard,
  LeaderboardRanking,
  LeaderboardCategory,
  EmailThreadAnalysis,
  ThreadImprovement,
  ExportConfig,
  ExportJob,
  DashboardWidget,
  DashboardLayout,
} from '../types/analytics';

import { Contact, Deal, Email, Meeting } from '../types';

class AnalyticsService {
  private anomalyConfigs: AnomalyDetectionConfig[] = [];
  private activeAlerts: AnomalyAlert[] = [];

  // ==================== EMAIL PERFORMANCE HEATMAPS ====================

  /**
   * Generate engagement heatmap for an email
   */
  generateEmailHeatmap(emailId: string): EmailHeatmap {
    // Simulate heatmap data based on tracking pixels and click analytics
    return {
      emailId,
      subject: 'Q4 Product Launch Announcement',
      sentAt: new Date(Date.now() - 86400000),
      recipients: 250,
      opens: 187,
      clicks: 94,
      sections: [
        {
          id: 'section_header',
          type: 'header',
          content: 'Company Logo + Headline',
          position: { x: 0, y: 0, width: 600, height: 120 },
          views: 180,
          clicks: 0,
          avgViewDuration: 2.3,
          engagementRate: 0.72,
        },
        {
          id: 'section_body_1',
          type: 'body',
          content: 'Introduction paragraph',
          position: { x: 40, y: 140, width: 520, height: 80 },
          views: 165,
          clicks: 0,
          avgViewDuration: 4.1,
          engagementRate: 0.66,
        },
        {
          id: 'section_cta_primary',
          type: 'cta',
          content: 'Learn More Button',
          position: { x: 200, y: 240, width: 200, height: 50 },
          views: 142,
          clicks: 78,
          avgViewDuration: 1.8,
          engagementRate: 0.55,
        },
        {
          id: 'section_image',
          type: 'image',
          content: 'Product screenshot',
          position: { x: 100, y: 310, width: 400, height: 250 },
          views: 156,
          clicks: 12,
          avgViewDuration: 5.2,
          engagementRate: 0.62,
        },
        {
          id: 'section_cta_secondary',
          type: 'cta',
          content: 'Schedule Demo Button',
          position: { x: 200, y: 580, width: 200, height: 50 },
          views: 98,
          clicks: 45,
          avgViewDuration: 1.5,
          engagementRate: 0.39,
        },
        {
          id: 'section_footer',
          type: 'footer',
          content: 'Contact info + unsubscribe',
          position: { x: 0, y: 650, width: 600, height: 80 },
          views: 45,
          clicks: 3,
          avgViewDuration: 1.2,
          engagementRate: 0.18,
        },
      ],
      engagementScore: 0.75,
      avgTimeSpent: 12.5,
    };
  }

  /**
   * Get heatmap insights and recommendations
   */
  getHeatmapInsights(heatmap: EmailHeatmap): { strengths: string[]; improvements: string[] } {
    const strengths: string[] = [];
    const improvements: string[] = [];

    // Analyze CTA performance
    const ctaSections = heatmap.sections.filter(s => s.type === 'cta');
    const avgCtaClickRate = ctaSections.reduce((sum, s) => sum + s.engagementRate, 0) / ctaSections.length;

    if (avgCtaClickRate > 0.5) {
      strengths.push('Strong CTA engagement rate');
    } else {
      improvements.push('Consider making CTAs more prominent or compelling');
    }

    // Analyze header engagement
    const header = heatmap.sections.find(s => s.type === 'header');
    if (header && header.engagementRate > 0.7) {
      strengths.push('Effective headline capturing attention');
    }

    // Analyze footer drop-off
    const footer = heatmap.sections.find(s => s.type === 'footer');
    if (footer && footer.engagementRate < 0.2) {
      improvements.push('Significant drop-off before footer - consider shortening email');
    }

    // Image engagement
    const image = heatmap.sections.find(s => s.type === 'image');
    if (image && image.avgViewDuration > 4) {
      strengths.push('Images are holding viewer attention');
    }

    return { strengths, improvements };
  }

  // ==================== CRM HEALTH DASHBOARD ====================

  /**
   * Get comprehensive CRM health metrics
   */
  getCrmHealthMetrics(): CrmHealthMetrics {
    return {
      leadResponseTime: {
        avg: 45, // minutes
        median: 32,
        p90: 120,
        trend: 'improving',
      },
      conversionRates: {
        byChannel: [
          { channel: 'email', leads: 450, converted: 67, rate: 0.149, revenue: 234000 },
          { channel: 'phone', leads: 180, converted: 45, rate: 0.25, revenue: 189000 },
          { channel: 'website', leads: 890, converted: 71, rate: 0.08, revenue: 156000 },
          { channel: 'referral', leads: 120, converted: 38, rate: 0.317, revenue: 267000 },
          { channel: 'social', leads: 340, converted: 28, rate: 0.082, revenue: 78000 },
          { channel: 'event', leads: 95, converted: 32, rate: 0.337, revenue: 198000 },
        ],
        overall: 0.156,
        trend: 0.023,
      },
      pipelineVelocity: {
        avgDaysInStage: 12.5,
        avgDealSize: 45000,
        velocityScore: 0.72,
        trend: 'accelerating',
      },
      dataQuality: {
        completenessScore: 0.87,
        duplicateRate: 0.03,
        staleRecords: 234,
        healthScore: 'good',
      },
      activityMetrics: {
        emailsPerDay: 156,
        callsPerDay: 42,
        meetingsPerWeek: 89,
        tasksCompletedRate: 0.78,
      },
    };
  }

  /**
   * Get pipeline velocity breakdown by stage
   */
  getPipelineVelocityByStage(): { stage: string; avgDays: number; conversionRate: number }[] {
    return [
      { stage: 'Lead', avgDays: 3.2, conversionRate: 0.65 },
      { stage: 'Qualified', avgDays: 5.1, conversionRate: 0.55 },
      { stage: 'Proposal', avgDays: 8.7, conversionRate: 0.45 },
      { stage: 'Negotiation', avgDays: 12.3, conversionRate: 0.60 },
      { stage: 'Closed Won', avgDays: 0, conversionRate: 1.0 },
    ];
  }

  // ==================== MEETING COST CALCULATOR ====================

  /**
   * Calculate meeting cost based on attendees
   */
  calculateMeetingCost(meetingId: string, attendees: Array<{ id: string; name: string; role: string; hourlyRate: number }>, durationMinutes: number): MeetingCostAnalysis {
    const attendeeCosts: MeetingAttendeeCost[] = attendees.map(a => ({
      attendeeId: a.id,
      name: a.name,
      role: a.role,
      hourlyRate: a.hourlyRate,
      cost: (a.hourlyRate * durationMinutes) / 60,
    }));

    const totalCost = attendeeCosts.reduce((sum, a) => sum + a.cost, 0);
    const costPerMinute = totalCost / durationMinutes;

    const analysis: MeetingCostAnalysis = {
      meetingId,
      title: 'Q4 Strategy Planning',
      duration: durationMinutes,
      attendees: attendeeCosts,
      totalCost,
      costPerMinute,
      roi: {
        estimatedValue: 150000,
        netRoi: ((150000 - totalCost) / totalCost) * 100,
        confidence: 'medium',
      },
      recommendations: [
        'Consider reducing meeting frequency for recurring syncs',
        'Send pre-read materials to reduce meeting time',
        'Evaluate if all 8 attendees need to be present for entire duration',
      ],
    };

    return analysis;
  }

  /**
   * Get meeting ROI analysis
   */
  getMeetingRoi(meetingId: string): { cost: number; value: number; roi: number; breakEven: boolean } {
    // Would analyze deal progression linked to meeting
    return {
      cost: 2400,
      value: 150000,
      roi: 6150,
      breakEven: true,
    };
  }

  // ==================== CHURN PREDICTION MODEL ====================

  /**
   * Predict churn risk for contacts
   */
  predictChurnRisk(contactId: string): ChurnPrediction {
    // Simulate ML model prediction
    return {
      contactId,
      contactName: 'Acme Corporation',
      company: 'Acme Corp',
      churnProbability: 0.72,
      riskLevel: 'high',
      factors: [
        {
          factor: 'Decreased email engagement',
          impact: 'high',
          description: 'Open rate dropped from 45% to 12% in last 30 days',
          trend: 'worsening',
        },
        {
          factor: 'No recent meetings',
          impact: 'medium',
          description: 'No meetings scheduled in last 60 days',
          trend: 'worsening',
        },
        {
          factor: 'Support ticket increase',
          impact: 'medium',
          description: '5 support tickets opened in last 2 weeks',
          trend: 'worsening',
        },
        {
          factor: 'Contract renewal approaching',
          impact: 'high',
          description: 'Contract expires in 45 days with no renewal discussion',
          trend: 'stable',
        },
      ],
      predictedChurnDate: new Date(Date.now() + 45 * 86400000),
      recommendedActions: [
        {
          action: 'Schedule executive check-in call',
          priority: 'high',
          expectedImpact: 0.35,
          effort: 'low',
        },
        {
          action: 'Review and address open support tickets',
          priority: 'high',
          expectedImpact: 0.25,
          effort: 'medium',
        },
        {
          action: 'Present renewal incentives',
          priority: 'medium',
          expectedImpact: 0.20,
          effort: 'low',
        },
      ],
      lastUpdated: new Date(),
    };
  }

  /**
   * Get all high-risk accounts
   */
  getHighRiskAccounts(): ChurnPrediction[] {
    return [
      this.predictChurnRisk('contact_1'),
      this.predictChurnRisk('contact_2'),
    ];
  }

  // ==================== REVENUE ATTRIBUTION ====================

  /**
   * Analyze revenue attribution for a deal
   */
  analyzeRevenueAttribution(dealId: string): RevenueAttribution {
    const touchpoints: AttributionTouchpoint[] = [
      {
        id: 'tp_1',
        type: 'email',
        date: new Date(Date.now() - 90 * 86400000),
        participantIds: ['contact_1'],
        outcome: 'Initial interest expressed',
        sentimentScore: 0.6,
        weight: 0.15,
      },
      {
        id: 'tp_2',
        type: 'meeting',
        date: new Date(Date.now() - 75 * 86400000),
        participantIds: ['contact_1', 'contact_2'],
        outcome: 'Discovery call completed',
        sentimentScore: 0.75,
        weight: 0.25,
      },
      {
        id: 'tp_3',
        type: 'demo',
        date: new Date(Date.now() - 60 * 86400000),
        participantIds: ['contact_1', 'contact_2', 'contact_3'],
        outcome: 'Product demo successful',
        sentimentScore: 0.85,
        weight: 0.30,
      },
      {
        id: 'tp_4',
        type: 'proposal',
        date: new Date(Date.now() - 30 * 86400000),
        participantIds: ['contact_1'],
        outcome: 'Proposal sent and reviewed',
        sentimentScore: 0.70,
        weight: 0.20,
      },
      {
        id: 'tp_5',
        type: 'call',
        date: new Date(Date.now() - 7 * 86400000),
        participantIds: ['contact_1'],
        outcome: 'Negotiation completed',
        sentimentScore: 0.80,
        weight: 0.10,
      },
    ];

    const dealValue = 125000;

    return {
      dealId,
      dealName: 'Enterprise License - Acme Corp',
      value: dealValue,
      closedDate: new Date(),
      touchpoints,
      attributionModel: 'time_decay',
      attributedRevenue: {
        email: dealValue * 0.15,
        meeting: dealValue * 0.25,
        call: dealValue * 0.10,
        other: dealValue * 0.50,
      },
      topContributors: [
        {
          name: 'John Smith',
          role: 'Account Executive',
          touchpoints: 8,
          attributedRevenue: 75000,
          percentage: 0.60,
        },
        {
          name: 'Sarah Johnson',
          role: 'Solutions Engineer',
          touchpoints: 4,
          attributedRevenue: 37500,
          percentage: 0.30,
        },
      ],
    };
  }

  // ==================== CUSTOM REPORT BUILDER ====================

  /**
   * Create a custom report
   */
  createCustomReport(config: Omit<CustomReport, 'id' | 'createdAt' | 'updatedAt'>): CustomReport {
    return {
      ...config,
      id: `report_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Run a custom report
   */
  async runReport(reportId: string): Promise<{ rows: any[]; aggregations: Record<string, number> }> {
    // Simulate report execution
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      rows: [
        { date: '2024-01-01', emails: 45, opens: 32, clicks: 18, conversions: 5 },
        { date: '2024-01-02', emails: 52, opens: 38, clicks: 22, conversions: 7 },
        { date: '2024-01-03', emails: 48, opens: 35, clicks: 20, conversions: 6 },
      ],
      aggregations: {
        total_emails: 145,
        total_opens: 105,
        total_clicks: 60,
        total_conversions: 18,
        avg_open_rate: 0.724,
        avg_click_rate: 0.414,
      },
    };
  }

  /**
   * Get saved reports
   */
  getSavedReports(): CustomReport[] {
    return [
      {
        id: 'report_1',
        name: 'Weekly Email Performance',
        description: 'Track email KPIs week over week',
        createdAt: new Date(Date.now() - 30 * 86400000),
        updatedAt: new Date(),
        createdBy: 'user_1',
        config: {
          dataSource: 'emails',
          fields: [],
          filters: [],
          aggregations: [],
          visualizations: [],
          dateRange: { type: 'last_30_days' },
        },
        sharedWith: ['user_2', 'user_3'],
        lastRun: new Date(Date.now() - 86400000),
        nextRun: new Date(Date.now() + 604800000),
      },
    ];
  }

  // ==================== ANOMALY DETECTION ====================

  /**
   * Configure anomaly detection for a metric
   */
  configureAnomalyDetection(config: AnomalyDetectionConfig): void {
    this.anomalyConfigs.push(config);
  }

  /**
   * Check for anomalies in metrics
   */
  detectAnomalies(): AnomalyAlert[] {
    const alerts: AnomalyAlert[] = [];

    // Simulate detecting anomalies
    alerts.push({
      id: `anomaly_${Date.now()}`,
      type: 'email_open_rate',
      metric: 'Email Open Rate',
      currentValue: 0.18,
      expectedValue: 0.35,
      deviation: -0.486,
      severity: 'high',
      detectedAt: new Date(),
      description: 'Email open rates have dropped significantly below baseline',
      possibleCauses: [
        'Subject line effectiveness decreased',
        'Sending time may not be optimal',
        'List quality issues or increased spam filtering',
      ],
      recommendedActions: [
        'A/B test new subject line approaches',
        'Review sending time optimization',
        'Clean email list and remove inactive subscribers',
      ],
      acknowledged: false,
    });

    alerts.push({
      id: `anomaly_${Date.now() + 1}`,
      type: 'meeting_no_show',
      metric: 'Meeting No-Show Rate',
      currentValue: 0.35,
      expectedValue: 0.15,
      deviation: 1.33,
      severity: 'critical',
      detectedAt: new Date(),
      description: 'Meeting no-show rate has more than doubled',
      possibleCauses: [
        'Reminder system may not be working',
        'Meeting invitations sent too far in advance',
        'Lack of clear meeting agenda or value proposition',
      ],
      recommendedActions: [
        'Implement automated reminder sequence',
        'Require calendar confirmation',
        'Send pre-meeting value brief',
      ],
      acknowledged: false,
    });

    this.activeAlerts = alerts;
    return alerts;
  }

  /**
   * Acknowledge an anomaly alert
   */
  acknowledgeAlert(alertId: string, userId: string): void {
    const alert = this.activeAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedBy = userId;
      alert.acknowledgedAt = new Date();
    }
  }

  // ==================== TEAM LEADERBOARDS ====================

  /**
   * Generate team leaderboard
   */
  generateLeaderboard(category: LeaderboardCategory, period: 'weekly' | 'monthly' | 'quarterly'): TeamLeaderboard {
    const rankings: LeaderboardRanking[] = [
      {
        rank: 1,
        userId: 'user_1',
        userName: 'Sarah Johnson',
        avatarUrl: '/avatars/sarah.jpg',
        value: category === 'revenue_generated' ? 245000 : 156,
        change: 2,
        trend: 'up',
        badges: ['top_performer', 'most_improved'],
      },
      {
        rank: 2,
        userId: 'user_2',
        userName: 'Michael Chen',
        avatarUrl: '/avatars/michael.jpg',
        value: category === 'revenue_generated' ? 198000 : 142,
        change: -1,
        trend: 'down',
        badges: ['consistent'],
      },
      {
        rank: 3,
        userId: 'user_3',
        userName: 'Emily Rodriguez',
        avatarUrl: '/avatars/emily.jpg',
        value: category === 'revenue_generated' ? 187000 : 138,
        change: 0,
        trend: 'same',
        badges: ['team_player'],
      },
    ];

    return {
      id: `leaderboard_${category}_${period}`,
      name: `${category.replace(/_/g, ' ').toUpperCase()} - ${period.toUpperCase()}`,
      period,
      category,
      rankings,
      startDate: new Date(Date.now() - 7 * 86400000),
      endDate: period === 'weekly' ? new Date() : undefined,
      lastUpdated: new Date(),
    };
  }

  /**
   * Get all leaderboards
   */
  getAllLeaderboards(): TeamLeaderboard[] {
    const categories: LeaderboardCategory[] = [
      'emails_sent',
      'meetings_booked',
      'deals_closed',
      'revenue_generated',
    ];

    return categories.map(cat => this.generateLeaderboard(cat, 'weekly'));
  }

  // ==================== EMAIL THREAD ANALYSIS ====================

  /**
   * Analyze email thread for insights
   */
  analyzeEmailThread(threadId: string): EmailThreadAnalysis {
    return {
      threadId,
      subject: 'Re: Enterprise Proposal Discussion',
      participants: ['john@company.com', 'sarah@client.com', 'mike@client.com'],
      messageCount: 12,
      duration: 72, // hours
      avgResponseTime: 4.5, // hours
      sentimentAnalysis: {
        overall: 'positive',
        trajectory: 'improving',
        scores: [0.5, 0.55, 0.6, 0.65, 0.7, 0.72, 0.75, 0.78, 0.8, 0.82, 0.85, 0.88],
      },
      lengthAnalysis: {
        avgMessageLength: 145,
        totalWords: 1740,
        efficiency: 'average',
      },
      outcomes: {
        resolved: true,
        actionItemsGenerated: 3,
        meetingScheduled: true,
        dealProgressed: true,
      },
      recommendations: [
        {
          type: 'response_time',
          suggestion: 'Consider responding within 2 hours during business hours for better engagement',
          impact: 'medium',
        },
        {
          type: 'message_length',
          suggestion: 'Messages are appropriately concise. Continue using bullet points for clarity.',
          impact: 'low',
        },
        {
          type: 'follow_up',
          suggestion: 'Schedule follow-up within 48 hours after the meeting to maintain momentum',
          impact: 'high',
        },
      ],
    };
  }

  /**
   * Get thread sentiment trend
   */
  getThreadSentimentTrend(threadId: string): { trend: 'positive' | 'negative' | 'neutral'; confidence: number } {
    return {
      trend: 'positive',
      confidence: 0.87,
    };
  }

  // ==================== DATA EXPORT INTEGRATION ====================

  /**
   * Configure export to BI tool
   */
  configureExport(config: Omit<ExportConfig, 'id' | 'lastExport' | 'status'>): ExportConfig {
    return {
      ...config,
      id: `export_${Date.now()}`,
      lastExport: undefined,
      status: 'active',
    };
  }

  /**
   * Trigger manual export
   */
  async triggerExport(configId: string): Promise<ExportJob> {
    const job: ExportJob = {
      id: `job_${Date.now()}`,
      configId,
      status: 'processing',
      recordsExported: 0,
      startedAt: new Date(),
    };

    // Simulate export process
    setTimeout(() => {
      job.status = 'completed';
      job.recordsExported = 15420;
      job.completedAt = new Date();
      job.downloadUrl = `https://exports.nexus.app/${job.id}.csv`;
    }, 5000);

    return job;
  }

  /**
   * Get export history
   */
  getExportHistory(configId?: string): ExportJob[] {
    return [
      {
        id: 'job_1',
        configId: configId || 'export_1',
        status: 'completed',
        recordsExported: 15420,
        startedAt: new Date(Date.now() - 86400000),
        completedAt: new Date(Date.now() - 86340000),
        downloadUrl: 'https://exports.nexus.app/job_1.csv',
      },
    ];
  }

  // ==================== DASHBOARD WIDGETS ====================

  /**
   * Create dashboard layout
   */
  createDashboard(name: string, widgets: DashboardWidget[]): DashboardLayout {
    return {
      id: `dashboard_${Date.now()}`,
      name,
      widgets,
      isDefault: false,
      sharedWith: [],
    };
  }

  /**
   * Get default dashboard
   */
  getDefaultDashboard(): DashboardLayout {
    return {
      id: 'default_dashboard',
      name: 'Executive Overview',
      isDefault: true,
      sharedWith: ['all'],
      widgets: [
        {
          id: 'widget_1',
          type: 'metric_card',
          title: 'Total Revenue',
          config: { metric: 'revenue', format: 'currency' },
          position: { x: 0, y: 0, width: 3, height: 2 },
          refreshInterval: 300,
        },
        {
          id: 'widget_2',
          type: 'chart',
          title: 'Pipeline Trend',
          config: { chartType: 'line', metric: 'pipeline_value' },
          position: { x: 3, y: 0, width: 6, height: 4 },
          refreshInterval: 600,
        },
        {
          id: 'widget_3',
          type: 'funnel',
          title: 'Conversion Funnel',
          config: { stages: ['Lead', 'Qualified', 'Proposal', 'Closed'] },
          position: { x: 9, y: 0, width: 3, height: 4 },
          refreshInterval: 3600,
        },
      ],
    };
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
