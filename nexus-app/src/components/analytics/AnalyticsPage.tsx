/**
 * Analytics & Intelligence Page Component
 * Demonstrates email heatmaps, CRM health metrics, churn prediction, 
 * revenue attribution, custom reports, anomaly detection, and team leaderboards.
 */

import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { 
  EmailHeatmap,
  CrmHealthMetrics,
  ChurnPrediction,
  AnomalyAlert,
  TeamLeaderboard,
} from '../../types/analytics';

const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'email' | 'crm' | 'churn' | 'reports' | 'leaderboard'>('overview');
  const [crmMetrics, setCrmMetrics] = useState<CrmHealthMetrics | null>(null);
  const [churnRisks, setChurnRisks] = useState<ChurnPrediction[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>([]);
  const [leaderboards, setLeaderboards] = useState<TeamLeaderboard[]>([]);

  useEffect(() => {
    // Load analytics data
    const metrics = analyticsService.getCrmHealthMetrics();
    setCrmMetrics(metrics);

    const risks = analyticsService.getHighRiskAccounts();
    setChurnRisks(risks);

    const detectedAnomalies = analyticsService.detectAnomalies();
    setAnomalies(detectedAnomalies);

    const boards = analyticsService.getAllLeaderboards();
    setLeaderboards(boards);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Data Intelligence
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Advanced analytics, AI insights, and performance tracking
              </p>
            </div>
            
            <button className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors">
              Export Report
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex space-x-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'email', label: 'Email Heatmaps' },
              { id: 'crm', label: 'CRM Health' },
              { id: 'churn', label: 'Churn Prediction' },
              { id: 'reports', label: 'Custom Reports' },
              { id: 'leaderboard', label: 'Leaderboards' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-1 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: '$1.2M', change: '+12.5%', trend: 'up' },
                { label: 'Conversion Rate', value: '15.6%', change: '+2.3%', trend: 'up' },
                { label: 'Avg Response Time', value: '45 min', change: '-8 min', trend: 'down' },
                { label: 'Pipeline Velocity', value: '12.5 days', change: '-1.2 days', trend: 'down' },
              ].map(metric => (
                <div key={metric.label} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.label}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                  <p className={`mt-2 text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-green-600'
                  }`}>
                    {metric.change} from last period
                  </p>
                </div>
              ))}
            </div>

            {/* Anomaly Alerts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Active Anomaly Alerts
              </h2>
              
              {anomalies.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No anomalies detected</p>
              ) : (
                <div className="space-y-4">
                  {anomalies.map(alert => (
                    <div
                      key={alert.id}
                      className={`p-4 border rounded-lg ${getSeverityColor(alert.severity)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold">{alert.metric}</span>
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-white/50">
                              {alert.type.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="mt-1 text-sm">{alert.description}</p>
                          <div className="mt-2 grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="font-medium">Current:</span> {alert.currentValue}
                            </div>
                            <div>
                              <span className="font-medium">Expected:</span> {alert.expectedValue}
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium">Deviation:</span> {(alert.deviation * 100).toFixed(1)}%
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-xs font-medium mb-1">Recommended Actions:</p>
                            <ul className="text-xs space-y-1 list-disc list-inside">
                              {alert.recommendedActions.slice(0, 2).map((action, i) => (
                                <li key={i}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        {!alert.acknowledged && (
                          <button className="px-3 py-1 text-xs font-medium bg-white/50 hover:bg-white/70 rounded transition-colors">
                            Acknowledge
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pipeline Velocity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Pipeline Velocity by Stage
              </h2>
              <div className="space-y-4">
                {[
                  { stage: 'Lead', days: 3.2, rate: 65 },
                  { stage: 'Qualified', days: 5.1, rate: 55 },
                  { stage: 'Proposal', days: 8.7, rate: 45 },
                  { stage: 'Negotiation', days: 12.3, rate: 60 },
                  { stage: 'Closed Won', days: 0, rate: 100 },
                ].map(stage => (
                  <div key={stage.stage} className="flex items-center space-x-4">
                    <span className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {stage.stage}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>{stage.days} avg days</span>
                        <span>{stage.rate}% conversion</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${stage.rate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Email Heatmaps Tab */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Email Engagement Heatmap
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Email Campaign
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Q4 Product Launch Announcement</option>
                  <option>Holiday Promotion - December</option>
                  <option>New Feature Release</option>
                </select>
              </div>

              {/* Heatmap Visualization */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                <div className="space-y-4">
                  {[
                    { section: 'Header', engagement: 72, color: 'bg-green-500' },
                    { section: 'Introduction', engagement: 66, color: 'bg-green-400' },
                    { section: 'Primary CTA', engagement: 55, color: 'bg-yellow-500' },
                    { section: 'Product Image', engagement: 62, color: 'bg-green-400' },
                    { section: 'Secondary CTA', engagement: 39, color: 'bg-orange-500' },
                    { section: 'Footer', engagement: 18, color: 'bg-red-500' },
                  ].map(section => (
                    <div key={section.section} className="flex items-center space-x-4">
                      <span className="w-32 text-sm text-gray-700 dark:text-gray-300">
                        {section.section}
                      </span>
                      <div className="flex-1 h-8 bg-white dark:bg-gray-800 rounded overflow-hidden">
                        <div
                          className={`h-full ${section.color} opacity-75`}
                          style={{ width: `${section.engagement}%` }}
                        />
                      </div>
                      <span className="w-12 text-sm font-medium text-gray-900 dark:text-white text-right">
                        {section.engagement}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="text-sm font-semibold text-green-800 dark:text-green-400 mb-2">
                    ✅ Strengths
                  </h3>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 list-disc list-inside">
                    <li>Effective headline capturing attention</li>
                    <li>Images are holding viewer attention</li>
                    <li>Strong primary CTA placement</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-400 mb-2">
                    ⚠️ Improvements
                  </h3>
                  <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1 list-disc list-inside">
                    <li>Significant drop-off before footer</li>
                    <li>Secondary CTA needs more prominence</li>
                    <li>Consider shortening email length</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CRM Health Tab */}
        {activeTab === 'crm' && crmMetrics && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Lead Response Time */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Lead Response Time
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {crmMetrics.leadResponseTime.avg} min
                </p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Median:</span>
                    <span className="font-medium">{crmMetrics.leadResponseTime.median} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">P90:</span>
                    <span className="font-medium">{crmMetrics.leadResponseTime.p90} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Trend:</span>
                    <span className="font-medium text-green-600 capitalize">{crmMetrics.leadResponseTime.trend}</span>
                  </div>
                </div>
              </div>

              {/* Conversion Rates */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Overall Conversion Rate
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {(crmMetrics.conversionRates.overall * 100).toFixed(1)}%
                </p>
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${crmMetrics.conversionRates.overall * 100}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-green-600">
                    +{(crmMetrics.conversionRates.trend * 100).toFixed(1)}% from last month
                  </p>
                </div>
              </div>

              {/* Data Quality */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Data Quality Score
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
                  {crmMetrics.dataQuality.healthScore}
                </p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Completeness:</span>
                    <span className="font-medium">{(crmMetrics.dataQuality.completenessScore * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duplicates:</span>
                    <span className="font-medium">{(crmMetrics.dataQuality.duplicateRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Stale Records:</span>
                    <span className="font-medium">{crmMetrics.dataQuality.staleRecords}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Channel Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Conversion by Channel
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Channel</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Leads</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Converted</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Rate</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crmMetrics.conversionRates.byChannel.map(channel => (
                      <tr key={channel.channel} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white capitalize">{channel.channel}</td>
                        <td className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">{channel.leads.toLocaleString()}</td>
                        <td className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">{channel.converted.toLocaleString()}</td>
                        <td className="text-right py-3 px-4">
                          <span className={`font-medium ${(channel.rate > 0.2) ? 'text-green-600' : 'text-gray-600'}`}>
                            {(channel.rate * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                          ${(channel.revenue / 1000).toFixed(0)}K
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Churn Prediction Tab */}
        {activeTab === 'churn' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                High-Risk Accounts
              </h2>
              
              {churnRisks.map(account => (
                <div key={account.contactId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {account.contactName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{account.company}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getRiskLevelColor(account.riskLevel)}`}>
                        {(account.churnProbability * 100).toFixed(0)}%
                      </p>
                      <p className="text-xs text-gray-500 uppercase">{account.riskLevel} Risk</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Risk Factors
                      </h4>
                      <div className="space-y-2">
                        {account.factors.map((factor, i) => (
                          <div key={i} className="text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 dark:text-gray-400">{factor.factor}</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                factor.impact === 'high' ? 'bg-red-100 text-red-800' :
                                factor.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {factor.impact}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{factor.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Recommended Actions
                      </h4>
                      <div className="space-y-2">
                        {account.recommendedActions.map((action, i) => (
                          <div key={i} className="flex items-start space-x-2 text-sm">
                            <input type="checkbox" className="mt-1" />
                            <div>
                              <p className="text-gray-700 dark:text-gray-300">{action.action}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-500">Priority: {action.priority}</span>
                                <span className="text-xs text-green-600">Impact: {(action.expectedImpact * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Saved Reports
                </h2>
                <button className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors">
                  Create New Report
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Weekly Email Performance', desc: 'Track email KPIs week over week', lastRun: '2 hours ago' },
                  { name: 'Sales Pipeline Analysis', desc: 'Deal progression and velocity metrics', lastRun: '1 day ago' },
                  { name: 'Customer Health Score', desc: 'Churn risk and engagement metrics', lastRun: '3 days ago' },
                ].map(report => (
                  <div key={report.name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{report.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{report.desc}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-gray-500">Last run: {report.lastRun}</span>
                      <button className="px-3 py-1 text-sm bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 rounded transition-colors">
                        Run Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Leaderboards Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Team Performance Leaderboard
                </h2>
                <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                  <option>Weekly - Revenue Generated</option>
                  <option>Monthly - Deals Closed</option>
                  <option>Quarterly - Meetings Booked</option>
                </select>
              </div>

              {leaderboards[0] && (
                <div className="space-y-4">
                  {leaderboards[0].rankings.map((ranking, index) => (
                    <div
                      key={ranking.userId}
                      className={`flex items-center p-4 rounded-lg ${
                        index === 0 ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200' :
                        index === 1 ? 'bg-gray-50 dark:bg-gray-700 border-2 border-gray-200' :
                        index === 2 ? 'bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200' :
                        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 font-bold text-gray-700 dark:text-gray-300 mr-4">
                        {ranking.rank}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 dark:text-white">{ranking.userName}</span>
                          {ranking.badges.map(badge => (
                            <span key={badge} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                              {badge.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span>Value: {ranking.value.toLocaleString()}</span>
                          <span className={ranking.trend === 'up' ? 'text-green-600' : ranking.trend === 'down' ? 'text-red-600' : 'text-gray-500'}>
                            {ranking.change > 0 ? '↑' : ranking.change < 0 ? '↓' : '→'} {Math.abs(ranking.change)} positions
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
