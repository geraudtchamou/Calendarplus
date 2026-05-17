import { useState } from 'react';
import { 
  Mail, Inbox, Send, Archive, Trash2, Star, Tag, Filter, Search,
  Plus, MoreVertical, RefreshCw, Paperclip, Eye, Link as LinkIcon,
  Shield, Clock, Calendar, ChevronDown, Folder as FolderIcon
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Email, EmailFolder, EmailLabel } from '../../types';

const mockEmails: Email[] = [
  {
    id: '1',
    accountId: 'acc1',
    subject: 'Q4 Product Roadmap Review',
    from: { email: 'sarah@company.com', name: 'Sarah Johnson' },
    to: [{ email: 'user@nexus.com', name: 'User' }],
    body: '<p>Hi team,</p><p>I wanted to share the updated Q4 product roadmap for your review. Please find the attached document with all the planned features and timelines.</p><p>Key highlights:</p><ul><li>New AI-powered features</li><li>Mobile app improvements</li><li>Enterprise integrations</li></ul><p>Let me know if you have any questions.</p><p>Best,<br>Sarah</p>',
    bodyPreview: 'Hi team, I wanted to share the updated Q4 product roadmap for your review...',
    isHtml: true,
    isRead: false,
    isStarred: true,
    isDraft: false,
    labels: ['work', 'important'],
    attachments: [{ id: 'a1', filename: 'Q4_Roadmap.pdf', mimeType: 'application/pdf', size: 2500000 }],
    receivedAt: new Date(Date.now() - 3600000),
    folderId: 'inbox',
    tracking: { opened: true, openCount: 2, linksClicked: [] }
  },
  {
    id: '2',
    accountId: 'acc1',
    subject: 'Meeting Reminder: Client Demo Tomorrow',
    from: { email: 'calendar@google.com', name: 'Google Calendar' },
    to: [{ email: 'user@nexus.com', name: 'User' }],
    body: '<p>This is a reminder that you have a client demo scheduled for tomorrow at 2:00 PM.</p><p>Attendees: You, John Smith, Emily Chen</p><p>Location: Conference Room A / Zoom</p>',
    bodyPreview: 'This is a reminder that you have a client demo scheduled for tomorrow...',
    isHtml: true,
    isRead: true,
    isStarred: false,
    isDraft: false,
    labels: ['meetings'],
    attachments: [],
    receivedAt: new Date(Date.now() - 7200000),
    folderId: 'inbox'
  },
  {
    id: '3',
    accountId: 'acc1',
    subject: 'Welcome to Nexus Pro!',
    from: { email: 'welcome@nexus.ai', name: 'Nexus Team' },
    to: [{ email: 'user@nexus.com', name: 'User' }],
    body: '<p>Welcome to Nexus Pro! Your subscription has been activated.</p><p>You now have access to:</p><ul><li>Unlimited AI credits</li><li>Advanced analytics</li><li>Priority support</li></ul><p>Get started by exploring the dashboard.</p>',
    bodyPreview: 'Welcome to Nexus Pro! Your subscription has been activated...',
    isHtml: true,
    isRead: true,
    isStarred: false,
    isDraft: false,
    labels: ['notifications'],
    attachments: [],
    receivedAt: new Date(Date.now() - 86400000),
    folderId: 'inbox'
  },
  {
    id: '4',
    accountId: 'acc1',
    subject: 'Re: Project Proposal Feedback',
    from: { email: 'mike@client.com', name: 'Mike Anderson' },
    to: [{ email: 'user@nexus.com', name: 'User' }],
    body: '<p>Thanks for sending over the proposal. I have reviewed it with my team and we have a few questions:</p><p>1. Can we adjust the timeline for Phase 2?<br>2. What are the hosting requirements?<br>3. Is training included?</p><p>Looking forward to your response.</p>',
    bodyPreview: 'Thanks for sending over the proposal. I have reviewed it with my team...',
    isHtml: true,
    isRead: false,
    isStarred: true,
    isDraft: false,
    labels: ['clients', 'urgent'],
    attachments: [],
    receivedAt: new Date(Date.now() - 1800000),
    folderId: 'inbox'
  }
];

const mockFolders: EmailFolder[] = [
  { id: 'inbox', name: 'Inbox', accountId: 'acc1', unreadCount: 12, totalCount: 156, systemFolder: 'inbox' },
  { id: 'sent', name: 'Sent', accountId: 'acc1', unreadCount: 0, totalCount: 89, systemFolder: 'sent' },
  { id: 'drafts', name: 'Drafts', accountId: 'acc1', unreadCount: 0, totalCount: 5, systemFolder: 'drafts' },
  { id: 'archive', name: 'Archive', accountId: 'acc1', unreadCount: 0, totalCount: 423, systemFolder: 'archive' },
  { id: 'spam', name: 'Spam', accountId: 'acc1', unreadCount: 0, totalCount: 34, systemFolder: 'spam' },
  { id: 'trash', name: 'Trash', accountId: 'acc1', unreadCount: 0, totalCount: 67, systemFolder: 'trash' },
];

const mockLabels: EmailLabel[] = [
  { id: 'l1', name: 'Work', color: '#3b82f6' },
  { id: 'l2', name: 'Important', color: '#ef4444' },
  { id: 'l3', name: 'Clients', color: '#10b981' },
  { id: 'l4', name: 'Meetings', color: '#8b5cf6' },
  { id: 'l5', name: 'Notifications', color: '#f59e0b' },
];

export function EmailPage() {
  const { darkMode } = useApp();
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  const filteredEmails = mockEmails.filter(email => 
    email.folderId === selectedFolder &&
    (email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
     email.from.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        {/* Compose Button */}
        <div className="p-4">
          <button
            onClick={() => setShowCompose(true)}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Compose
          </button>
        </div>

        {/* Folders */}
        <nav className="flex-1 overflow-y-auto px-3">
          <div className="space-y-1">
            {mockFolders.map(folder => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                  selectedFolder === folder.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FolderIcon size={18} />
                  <span className="font-medium">{folder.name}</span>
                </div>
                {folder.unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full">
                    {folder.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Labels */}
          <div className="mt-6">
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Labels
            </h3>
            <div className="space-y-1">
              {mockLabels.map(label => (
                <button
                  key={label.id}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: label.color }}
                  />
                  <span className="font-medium">{label.name}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      </aside>

      {/* Email List */}
      <div className="w-96 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {selectedFolder}
            </h2>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <RefreshCw size={18} className="text-gray-500" />
            </button>
          </div>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {filteredEmails.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Mail size={48} className="mx-auto mb-4 opacity-50" />
              <p>No emails found</p>
            </div>
          ) : (
            filteredEmails.map(email => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors ${
                  selectedEmail?.id === email.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                } ${!email.isRead ? 'bg-white dark:bg-gray-900' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {!email.isRead && (
                      <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                    )}
                    <span className={`text-sm ${!email.isRead ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      {email.from.name || email.from.email}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatTime(email.receivedAt)}
                  </span>
                </div>
                <h3 className={`text-sm mb-1 ${!email.isRead ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                  {email.subject}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">
                  {email.bodyPreview}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {email.attachments.length > 0 && (
                    <Paperclip size={14} className="text-gray-400" />
                  )}
                  {email.tracking?.opened && (
                    <Eye size={14} className="text-green-500" />
                  )}
                  {email.isStarred && (
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Email Preview */}
      <main className="flex-1 bg-white dark:bg-gray-900 flex flex-col">
        {selectedEmail ? (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Archive size={18} className="text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Trash2 size={18} className="text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Star size={18} className={selectedEmail.isStarred ? 'text-amber-400 fill-amber-400' : 'text-gray-500'} />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Tag size={18} className="text-gray-500" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Shield size={18} className="text-green-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <MoreVertical size={18} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Email Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {selectedEmail.subject}
                </h1>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedEmail.from.name?.[0] || selectedEmail.from.email[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedEmail.from.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedEmail.from.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(selectedEmail.receivedAt)}
                    </p>
                    {selectedEmail.to.length > 0 && (
                      <p className="text-xs text-gray-400">
                        To: {selectedEmail.to.map(t => t.name || t.email).join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                {selectedEmail.labels.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    {selectedEmail.labels.map(label => (
                      <span
                        key={label}
                        className="px-2 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}

                <div
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                />

                {selectedEmail.attachments.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Attachments ({selectedEmail.attachments.length})
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedEmail.attachments.map(att => (
                        <div
                          key={att.id}
                          className="flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Paperclip size={18} className="text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {att.filename}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(att.size / 1000).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEmail.tracking && (
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <Eye size={16} />
                      <span className="text-sm font-medium">
                        Opened {selectedEmail.tracking.openCount} times
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reply Box */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex gap-3">
                <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all">
                  Reply
                </button>
                <button className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all">
                  Forward
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <Mail size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select an email to read</p>
            </div>
          </div>
        )}
      </main>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Message</h3>
              <button
                onClick={() => setShowCompose(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <ChevronDown size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <input
                type="text"
                placeholder="To"
                className="w-full px-4 py-2 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:text-white outline-none"
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-2 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:text-white outline-none"
              />
              <textarea
                placeholder="Write your message..."
                rows={10}
                className="w-full px-4 py-2 bg-transparent resize-none focus:outline-none dark:text-white"
              />
            </div>
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  <Paperclip size={18} className="text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  <Clock size={18} className="text-gray-500" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  Save Draft
                </button>
                <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}
