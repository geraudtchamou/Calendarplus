import React, { useState, useEffect } from 'react';
import { securityService } from '../../services/securityService';
import { AuditLog, DlpRule, UserSession, RetentionPolicy, ComplianceTemplate, SecureFileShare, AnonymousReport } from '../../types/security';

interface SecurityPageProps {
  userId: string;
}

export const SecurityPage: React.FC<SecurityPageProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'dlp' | 'sessions' | 'retention' | 'compliance' | 'secure-files' | 'reports'>('audit');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [dlpRules, setDlpRules] = useState<DlpRule[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [retentionPolicies, setRetentionPolicies] = useState<RetentionPolicy[]>([]);
  const [complianceTemplates, setComplianceTemplates] = useState<ComplianceTemplate[]>([]);
  const [secureFiles, setSecureFiles] = useState<SecureFileShare[]>([]);
  const [anonymousReports, setAnonymousReports] = useState<AnonymousReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [logs, rules, userSessions, policies, templates, reports] = await Promise.all([
      securityService.getAuditLogs(),
      securityService.getDlpRules(),
      securityService.getActiveSessions(userId),
      securityService.getRetentionPolicies(),
      securityService.getComplianceTemplates(),
      securityService.getAnonymousReports(),
    ]);
    setAuditLogs(logs);
    setDlpRules(rules);
    setSessions(userSessions);
    setRetentionPolicies(policies);
    setComplianceTemplates(templates);
    setAnonymousReports(reports);
    setLoading(false);
  };

  const handleRevokeSession = async (sessionId: string) => {
    await securityService.revokeSession(sessionId);
    loadData();
  };

  const handleRevokeAllSessions = async () => {
    const currentSessionId = sessions.find(s => s.isCurrent)?.id || '';
    await securityService.revokeAllOtherSessions(userId, currentSessionId);
    loadData();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-green-100 text-green-800';
      case 'FAILURE': return 'bg-red-100 text-red-800';
      case 'BLOCKED': return 'bg-purple-100 text-purple-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'INVESTIGATING': return 'bg-blue-100 text-blue-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Security & Compliance</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage encryption, audit trails, DLP policies, and compliance settings
        </p>
      </div>

      {/* Tabs */}
      <div className="px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-4 overflow-x-auto">
          {[
            { id: 'audit', label: 'Audit Trail', icon: '📋' },
            { id: 'dlp', label: 'DLP Rules', icon: '🛡️' },
            { id: 'sessions', label: 'Sessions', icon: '💻' },
            { id: 'retention', label: 'Retention', icon: '📅' },
            { id: 'compliance', label: 'Compliance', icon: '✅' },
            { id: 'secure-files', label: 'Secure Files', icon: '🔒' },
            { id: 'reports', label: 'Reports', icon: '🚨' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Audit Trail Tab */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Audit Logs</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                Export Logs
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {log.timestamp.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{log.userId}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {log.resourceType}{log.resourceId && `: ${log.resourceId}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{log.ipAddress}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DLP Rules Tab */}
        {activeTab === 'dlp' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Data Loss Prevention Rules</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                Add Rule
              </button>
            </div>
            <div className="grid gap-4">
              {dlpRules.map(rule => (
                <div key={rule.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{rule.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Pattern: {rule.pattern}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(rule.severity)}`}>
                        {rule.severity}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        rule.action === 'BLOCK' ? 'bg-red-100 text-red-800' :
                        rule.action === 'WARN' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {rule.action}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={rule.enabled} readOnly className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Sessions</h2>
              <button 
                onClick={handleRevokeAllSessions}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Revoke All Other Sessions
              </button>
            </div>
            <div className="grid gap-4">
              {sessions.map(session => (
                <div key={session.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-2xl">
                        {session.deviceInfo === 'Desktop' ? '💻' : session.deviceInfo === 'Mobile' ? '📱' : '📲'}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {session.browser} on {session.os}
                          </h3>
                          {session.isCurrent && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Current Device
                            </span>
                          )}
                          {!session.isCurrent && session.isActive && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          IP: {session.ipAddress} • {session.location.city}, {session.location.country}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                          Last active: {session.lastActiveAt.toLocaleString()} • Expires: {session.expiresAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {!session.isCurrent && session.isActive && (
                      <button
                        onClick={() => handleRevokeSession(session.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Retention Policies Tab */}
        {activeTab === 'retention' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Data Retention Policies</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                Create Policy
              </button>
            </div>
            <div className="grid gap-4">
              {retentionPolicies.map(policy => (
                <div key={policy.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{policy.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{policy.description}</p>
                      <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Scope: <strong>{policy.scope}</strong></span>
                        <span>•</span>
                        <span>Retention: <strong>{policy.retentionDays} days</strong></span>
                        <span>•</span>
                        <span>Action: <strong>{policy.actionOnExpiry.replace('_', ' ')}</strong></span>
                      </div>
                      {policy.lastRunAt && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                          Last run: {policy.lastRunAt.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={policy.enabled} readOnly className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compliance Templates Tab */}
        {activeTab === 'compliance' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Compliance Templates</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Pre-configured settings for regulated industries
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {complianceTemplates.map(template => (
                <div key={template.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{template.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{template.description}</p>
                    </div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                      {template.id}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Encryption Required</span>
                      <span className={`font-medium ${template.settings.requireEncryption ? 'text-green-600' : 'text-gray-400'}`}>
                        {template.settings.requireEncryption ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">DLP Required</span>
                      <span className={`font-medium ${template.settings.requireDlp ? 'text-green-600' : 'text-gray-400'}`}>
                        {template.settings.requireDlp ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Min Password Length</span>
                      <span className="font-medium text-gray-900 dark:text-white">{template.settings.minPasswordLength} chars</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Session Timeout</span>
                      <span className="font-medium text-gray-900 dark:text-white">{template.settings.sessionTimeoutMinutes} min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">MFA Required</span>
                      <span className={`font-medium ${template.settings.mfaRequired ? 'text-green-600' : 'text-gray-400'}`}>
                        {template.settings.mfaRequired ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Audit Log Retention</span>
                      <span className="font-medium text-gray-900 dark:text-white">{template.settings.auditLogRetentionDays} days</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                    Apply Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Secure Files Tab */}
        {activeTab === 'secure-files' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Secure File Shares</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                Create Secure Share
              </button>
            </div>
            <div className="grid gap-4">
              {secureFiles.map(file => (
                <div key={file.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-2xl">
                        📎
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{file.fileName}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Recipient: {file.recipientEmail}
                        </p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>Downloads: <strong>{file.currentDownloads}/{file.maxDownloads}</strong></span>
                          <span>•</span>
                          <span>Expires: <strong>{file.expiresAt.toLocaleDateString()}</strong></span>
                          {file.isRevoked && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              Revoked
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {!file.isRevoked && (
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium">
                        Revoke Access
                      </button>
                    )}
                  </div>
                  {file.downloadHistory.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Download History</h4>
                      <div className="space-y-1">
                        {file.downloadHistory.map((download, idx) => (
                          <p key={idx} className="text-xs text-gray-500 dark:text-gray-400">
                            {download.timestamp.toLocaleString()} - IP: {download.ipAddress} - {download.success ? '✓ Success' : '✗ Failed'}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Anonymous Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Anonymous Security Reports</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                Submit Report
              </button>
            </div>
            <div className="grid gap-4">
              {anonymousReports.map(report => (
                <div key={report.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          report.reason === 'PHISHING' ? 'bg-red-100 text-red-800' :
                          report.reason === 'MALWARE' ? 'bg-purple-100 text-purple-800' :
                          report.reason === 'DATA_LEAK' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {report.reason}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-white mt-3">{report.description}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        Submitted: {report.submittedAt.toLocaleString()}
                        {report.reporterId ? ` • Reporter ID: ${report.reporterId}` : ' • Anonymous'}
                      </p>
                      {report.investigatorNotes && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Investigator Notes:</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{report.investigatorNotes}</p>
                        </div>
                      )}
                    </div>
                    {report.status === 'PENDING' && (
                      <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm font-medium">
                        Investigate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityPage;
