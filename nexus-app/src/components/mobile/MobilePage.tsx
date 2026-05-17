/**
 * Mobile Features Page Component
 * Demonstrates offline mode, voice-to-email, QR codes, business card scanner, 
 * geolocation reminders, document scanner, and more.
 */

import React, { useState, useEffect } from 'react';
import { mobileService } from '../../services/mobileService';
import { 
  OfflineQueueItem, 
  BusinessCardScan, 
  GeoReminder, 
  DocumentScan,
  SyncStatus,
} from '../../types/mobile';

const MobileFeaturesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'offline' | 'voice' | 'scanner' | 'geo' | 'qr'>('offline');
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [scanResult, setScanResult] = useState<BusinessCardScan | null>(null);
  const [documentScan, setDocumentScan] = useState<DocumentScan | null>(null);
  const [geoReminders, setGeoReminders] = useState<GeoReminder[]>([]);
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>([]);

  useEffect(() => {
    // Load initial data
    const status = mobileService.getSyncStatus();
    setSyncStatus(status);
    
    const queue = mobileService.loadOfflineQueue();
    setOfflineQueue(queue);

    // Check online status periodically
    const interval = setInterval(() => {
      const newStatus = mobileService.getSyncStatus();
      setSyncStatus(newStatus);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleVoiceRecord = async () => {
    if (!isRecording) {
      try {
        await mobileService.startVoiceRecording();
        setIsRecording(true);
      } catch (error) {
        alert('Microphone access denied');
      }
    } else {
      setIsRecording(false);
      // Simulate transcription
      const result = await mobileService.transcribeVoiceToEmail(new Blob(), 'en-US');
      console.log('Transcribed:', result.processedText);
    }
  };

  const handleBusinessCardScan = async () => {
    // Simulate image upload
    const imageUrl = 'https://example.com/card.jpg';
    const result = await mobileService.scanBusinessCard(imageUrl);
    setScanResult(result);
  };

  const handleDocumentScan = async () => {
    const imageUrl = 'https://example.com/document.jpg';
    const result = await mobileService.scanDocument(imageUrl, 'invoice');
    setDocumentScan(result);
  };

  const handleCreateGeoReminder = () => {
    const reminder = mobileService.createGeoReminder({
      type: 'call',
      targetId: 'contact_123',
      targetName: 'John Smith',
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: 'San Francisco, CA',
        radius: 100,
      },
      action: 'Follow up on proposal',
      expiresAt: new Date(Date.now() + 86400000),
    });
    setGeoReminders([...geoReminders, reminder]);
  };

  const handleProcessOfflineQueue = async () => {
    const result = await mobileService.processOfflineQueue();
    alert(`Processed: ${result.success} successful, ${result.failed} failed`);
    setOfflineQueue(mobileService.loadOfflineQueue());
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Mobile Features
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Cross-platform capabilities for iOS, Android, and Wearables
              </p>
            </div>
            
            {/* Sync Status Badge */}
            {syncStatus && (
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  syncStatus.status === 'online' || syncStatus.status === 'idle' 
                    ? 'bg-green-500' 
                    : syncStatus.status === 'offline'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {syncStatus.status}
                </span>
                {syncStatus.pendingChanges > 0 && (
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {syncStatus.pendingChanges} pending
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="mt-6 flex space-x-4 border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'offline', label: 'Offline Mode' },
              { id: 'voice', label: 'Voice-to-Email' },
              { id: 'scanner', label: 'Scanners' },
              { id: 'geo', label: 'Location' },
              { id: 'qr', label: 'QR Check-in' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
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
        {/* Offline Mode Tab */}
        {activeTab === 'offline' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Offline Queue
              </h2>
              
              {offlineQueue.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No pending offline actions
                </p>
              ) : (
                <div className="space-y-2">
                  {offlineQueue.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.type.replace('_', ' ').toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.createdAt.toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {offlineQueue.length > 0 && (
                <button
                  onClick={handleProcessOfflineQueue}
                  className="mt-4 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                  Process Queue
                </button>
              )}
            </div>

            {/* Cache Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Offline Cache
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Emails', value: '245' },
                  { label: 'Contacts', value: '1,234' },
                  { label: 'Deals', value: '89' },
                  { label: 'Tasks', value: '156' },
                ].map(stat => (
                  <div key={stat.label} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Voice-to-Email Tab */}
        {activeTab === 'voice' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Voice Dictation
              </h2>
              
              <div className="flex flex-col items-center justify-center py-12">
                <button
                  onClick={handleVoiceRecord}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-red-500 animate-pulse'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </button>
                
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  {isRecording ? 'Recording... Tap to stop' : 'Tap to start dictating email'}
                </p>

                {isRecording && (
                  <div className="mt-6 flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-blue-500 rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 40 + 20}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  CRM Placeholders Detected:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['{{contact_name}}', '{{company_name}}', '{{deal_value}}'].map(ph => (
                    <span
                      key={ph}
                      className="px-2 py-1 text-xs font-mono bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded"
                    >
                      {ph}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scanner Tab */}
        {activeTab === 'scanner' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Business Card Scanner */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Business Card Scanner
                </h2>
                
                <button
                  onClick={handleBusinessCardScan}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                >
                  Scan Business Card
                </button>

                {scanResult && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Extracted Information:
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p><strong>Name:</strong> {scanResult.extractedData.firstName} {scanResult.extractedData.lastName}</p>
                      <p><strong>Title:</strong> {scanResult.extractedData.title}</p>
                      <p><strong>Company:</strong> {scanResult.extractedData.company}</p>
                      <p><strong>Email:</strong> {scanResult.extractedData.emails[0]}</p>
                      <p><strong>Phone:</strong> {scanResult.extractedData.phones[0]}</p>
                    </div>
                    <div className="mt-3 flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Confidence:</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${scanResult.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {Math.round(scanResult.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Document Scanner */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Document Scanner
                </h2>
                
                <button
                  onClick={handleDocumentScan}
                  className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors"
                >
                  Scan Document
                </button>

                {documentScan && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Extracted Text:
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                      {documentScan.extractedText}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span>Pages: {documentScan.metadata.pages}</span>
                      <span>Format: {documentScan.metadata.format}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Geolocation Tab */}
        {activeTab === 'geo' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Location-Based Reminders
                </h2>
                <button
                  onClick={handleCreateGeoReminder}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                  Add Reminder
                </button>
              </div>

              {geoReminders.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No location-based reminders set. Create one to get notified when you're near a contact or office.
                </p>
              ) : (
                <div className="space-y-3">
                  {geoReminders.map(reminder => (
                    <div
                      key={reminder.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {reminder.action}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            For: {reminder.targetName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            📍 {reminder.location.address} ({reminder.location.radius}m radius)
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          reminder.triggered
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {reminder.triggered ? 'Triggered' : 'Active'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Map Placeholder */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Nearby Contacts
              </h2>
              <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Interactive map would display here
                </p>
              </div>
            </div>
          </div>
        )}

        {/* QR Check-in Tab */}
        {activeTab === 'qr' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Meeting QR Check-in
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Meeting
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>Q4 Strategy Review - Jan 20, 2:00 PM</option>
                    <option>Product Demo - Jan 21, 10:00 AM</option>
                    <option>Client Onboarding - Jan 22, 3:00 PM</option>
                  </select>
                  
                  <button className="mt-4 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
                    Generate QR Code
                  </button>
                </div>

                <div className="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-center">
                    <div className="w-48 h-48 mx-auto bg-white p-4 rounded-lg shadow-inner flex items-center justify-center">
                      <p className="text-gray-400 text-sm">QR Code Preview</p>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Attendees scan to check in automatically
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Recent Check-ins
                </h3>
                <div className="space-y-2">
                  {[
                    { name: 'Sarah Johnson', company: 'Acme Corp', time: '2 min ago' },
                    { name: 'Michael Chen', company: 'TechStart', time: '5 min ago' },
                    { name: 'Emily Rodriguez', company: 'Global Inc', time: '12 min ago' },
                  ].map((attendee, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {attendee.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {attendee.company}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {attendee.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileFeaturesPage;
