import { useState } from 'react';
import { 
  Users, Building2, TrendingUp, Calendar, Phone, Mail, Plus, Search,
  Filter, MoreVertical, Star, Clock, CheckCircle, AlertCircle, ChevronRight,
  DollarSign, PieChart, BarChart3, Activity, Target, Zap, FileText,
  MessageSquare, MapPin, Globe, Linkedin, Twitter, Github, Edit2, Trash2
} from 'lucide-react';
import { Contact, Lead, Deal, Pipeline, Company, Activity as CrmActivity } from '../../types';

const mockContacts: Contact[] = [
  {
    id: 'c1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc.',
    jobTitle: 'VP of Engineering',
    avatar: undefined,
    socialProfiles: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/sarahjohnson', username: 'sarahjohnson' },
      { platform: 'twitter', url: 'https://twitter.com/sarahj', username: 'sarahj' }
    ],
    addresses: [{ type: 'work', street1: '123 Tech Blvd', city: 'San Francisco', state: 'CA', postalCode: '94105', country: 'USA' }],
    customFields: { industry: 'Technology', employeeCount: '500-1000' },
    tags: ['enterprise', 'decision-maker'],
    ownerId: 'u1',
    source: 'website',
    lifecycleStage: 'opportunity',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    lastContactedAt: new Date(Date.now() - 86400000),
    nextFollowUpAt: new Date(Date.now() + 172800000),
    notes: [{ id: 'n1', content: 'Very interested in enterprise features. Follow up on pricing.', createdById: 'u1', createdAt: new Date(), isPrivate: false }],
    tasks: ['t1', 't2'],
    deals: ['d1'],
    emails: [{ id: 'e1', subject: 'Re: Enterprise Demo', snippet: 'Thanks for the demo yesterday...', receivedAt: new Date(), isRead: true }],
    calls: [{ id: 'call1', direction: 'outbound', phoneNumber: '+1 (555) 123-4567', duration: 1200, recordedAt: new Date(), outcome: 'completed' }],
    meetings: [{ id: 'm1', title: 'Product Demo', startTime: new Date(Date.now() - 86400000), endTime: new Date(Date.now() - 82800000), attendees: ['sarah@techcorp.com'] }]
  },
  {
    id: 'c2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael@startuplab.io',
    phone: '+1 (555) 234-5678',
    company: 'StartupLab',
    jobTitle: 'CEO & Founder',
    avatar: undefined,
    socialProfiles: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/michaelchen', username: 'michaelchen' },
      { platform: 'github', url: 'https://github.com/mchen', username: 'mchen' }
    ],
    addresses: [{ type: 'work', street1: '456 Innovation Way', city: 'Austin', state: 'TX', postalCode: '78701', country: 'USA' }],
    customFields: { industry: 'SaaS', employeeCount: '10-50' },
    tags: ['startup', 'hot-lead'],
    ownerId: 'u1',
    source: 'referral',
    lifecycleStage: 'sql',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date(),
    lastContactedAt: new Date(Date.now() - 172800000),
    nextFollowUpAt: new Date(Date.now() + 259200000),
    notes: [],
    tasks: ['t3'],
    deals: ['d2'],
    emails: [],
    calls: [],
    meetings: []
  },
  {
    id: 'c3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily@designstudio.com',
    phone: '+1 (555) 345-6789',
    company: 'Design Studio Co.',
    jobTitle: 'Creative Director',
    avatar: undefined,
    socialProfiles: [
      { platform: 'twitter', url: 'https://twitter.com/emilydesigns', username: 'emilydesigns' }
    ],
    addresses: [{ type: 'work', street1: '789 Creative Ave', city: 'New York', state: 'NY', postalCode: '10001', country: 'USA' }],
    customFields: { industry: 'Design', employeeCount: '50-100' },
    tags: ['creative', 'potential-partner'],
    ownerId: 'u1',
    source: 'social',
    lifecycleStage: 'lead',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date(),
    lastContactedAt: new Date(Date.now() - 604800000),
    nextFollowUpAt: new Date(Date.now() + 432000000),
    notes: [],
    tasks: [],
    deals: [],
    emails: [],
    calls: [],
    meetings: []
  }
];

const mockLeads: Lead[] = [
  {
    id: 'l1',
    contactId: 'c1',
    status: 'qualified',
    score: 85,
    source: 'Website Demo Request',
    assignedTo: 'u1',
    activities: [
      { id: 'a1', type: 'email', subject: 'Welcome Email', completed: true, completedAt: new Date(), relatedTo: [{ type: 'contact', id: 'c1' }], createdById: 'u1', createdAt: new Date() },
      { id: 'a2', type: 'call', subject: 'Discovery Call', completed: true, completedAt: new Date(), relatedTo: [{ type: 'contact', id: 'c1' }], createdById: 'u1', createdAt: new Date() }
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  },
  {
    id: 'l2',
    contactId: 'c2',
    status: 'contacted',
    score: 72,
    source: 'Referral from John',
    assignedTo: 'u1',
    activities: [],
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date()
  },
  {
    id: 'l3',
    contactId: 'c3',
    status: 'new',
    score: 45,
    source: 'LinkedIn Campaign',
    assignedTo: 'u1',
    activities: [],
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date()
  }
];

const mockDeals: Deal[] = [
  {
    id: 'd1',
    name: 'TechCorp Enterprise License',
    contactId: 'c1',
    value: 150000,
    currency: 'USD',
    stage: { id: 's3', pipelineId: 'p1', name: 'Proposal', order: 3, color: '#3b82f6' },
    probability: 60,
    expectedCloseDate: new Date(Date.now() + 1209600000),
    status: 'open',
    source: 'Website',
    ownerId: 'u1',
    customFields: {},
    tasks: [],
    notes: [],
    activities: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date()
  },
  {
    id: 'd2',
    name: 'StartupLab Team Plan',
    contactId: 'c2',
    value: 24000,
    currency: 'USD',
    stage: { id: 's2', pipelineId: 'p1', name: 'Qualification', order: 2, color: '#10b981' },
    probability: 40,
    expectedCloseDate: new Date(Date.now() + 2592000000),
    status: 'open',
    source: 'Referral',
    ownerId: 'u1',
    customFields: {},
    tasks: [],
    notes: [],
    activities: [],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date()
  }
];

const mockPipeline: Pipeline = {
  id: 'p1',
  name: 'Sales Pipeline',
  stages: [
    { id: 's1', pipelineId: 'p1', name: 'Lead In', order: 1, color: '#6b7280' },
    { id: 's2', pipelineId: 'p1', name: 'Qualification', order: 2, color: '#10b981' },
    { id: 's3', pipelineId: 'p1', name: 'Proposal', order: 3, color: '#3b82f6' },
    { id: 's4', pipelineId: 'p1', name: 'Negotiation', order: 4, color: '#f59e0b' },
    { id: 's5', pipelineId: 'p1', name: 'Closed Won', order: 5, color: '#8b5cf6' }
  ],
  isDefault: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockCompanies: Company[] = [
  {
    id: 'comp1',
    name: 'TechCorp Inc.',
    domain: 'techcorp.com',
    industry: 'Technology',
    size: '500-1000',
    website: 'https://techcorp.com',
    phone: '+1 (555) 100-2000',
    addresses: [{ type: 'work', street1: '123 Tech Blvd', city: 'San Francisco', state: 'CA', postalCode: '94105', country: 'USA' }],
    customFields: {},
    contacts: ['c1'],
    deals: ['d1'],
    ownerId: 'u1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'comp2',
    name: 'StartupLab',
    domain: 'startuplab.io',
    industry: 'SaaS',
    size: '10-50',
    website: 'https://startuplab.io',
    phone: '+1 (555) 200-3000',
    addresses: [{ type: 'work', street1: '456 Innovation Way', city: 'Austin', state: 'TX', postalCode: '78701', country: 'USA' }],
    customFields: {},
    contacts: ['c2'],
    deals: ['d2'],
    ownerId: 'u1',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date()
  }
];

export function CrmPage() {
  const [activeTab, setActiveTab] = useState<'contacts' | 'leads' | 'deals' | 'companies' | 'pipeline' | 'analytics'>('contacts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredContacts = mockContacts.filter(contact =>
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDealValue = mockDeals.reduce((sum, deal) => sum + deal.value, 0);
  const wonDeals = mockDeals.filter(d => d.status === 'won').length;
  const openDeals = mockDeals.filter(d => d.status === 'open').length;

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CRM</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your customer relationships</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
          >
            <Plus size={18} />
            Add New
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mt-4">
          {[
            { id: 'contacts', label: 'Contacts', icon: Users },
            { id: 'leads', label: 'Leads', icon: Target },
            { id: 'deals', label: 'Deals', icon: DollarSign },
            { id: 'companies', label: 'Companies', icon: Building2 },
            { id: 'pipeline', label: 'Pipeline', icon: TrendingUp },
            { id: 'analytics', label: 'Analytics', icon: PieChart }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'contacts' && (
          <div className="h-full p-6 overflow-y-auto">
            {/* Search & Filters */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                  <Filter size={16} />
                  Filter
                </button>
                <button className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                  <MoreVertical size={16} />
                  More
                </button>
              </div>
            </div>

            {/* Contacts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContacts.map(contact => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 cursor-pointer hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {contact.firstName[0]}{contact.lastName[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {contact.firstName} {contact.lastName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{contact.jobTitle}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      contact.lifecycleStage === 'opportunity' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                      contact.lifecycleStage === 'sql' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                      'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {contact.lifecycleStage}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail size={14} />
                      {contact.email}
                    </div>
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone size={14} />
                        {contact.phone}
                      </div>
                    )}
                    {contact.company && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Building2 size={14} />
                        {contact.company}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    {contact.socialProfiles.map(profile => (
                      <a
                        key={profile.platform}
                        href={profile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {profile.platform === 'linkedin' && <Linkedin size={14} className="text-blue-600" />}
                        {profile.platform === 'twitter' && <Twitter size={14} className="text-blue-400" />}
                        {profile.platform === 'github' && <Github size={14} className="text-gray-600" />}
                      </a>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock size={12} />
                      Last contacted {formatDate(contact.lastContactedAt)}
                    </div>
                    {contact.nextFollowUpAt && (
                      <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                        <Calendar size={12} />
                        Follow-up {formatDate(contact.nextFollowUpAt)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {mockLeads.map(lead => {
                    const contact = mockContacts.find(c => c.id === lead.contactId);
                    return (
                      <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                              {contact?.firstName[0]}{contact?.lastName[0]}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {contact?.firstName} {contact?.lastName}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{contact?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            lead.status === 'qualified' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                            lead.status === 'contacted' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                            'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  lead.score >= 70 ? 'bg-green-500' :
                                  lead.score >= 50 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${lead.score}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{lead.score}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{lead.source}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">You</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(lead.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {mockDeals.map(deal => {
                const contact = mockContacts.find(c => c.id === deal.contactId);
                return (
                  <div key={deal.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{deal.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{contact?.firstName} {contact?.lastName} • {contact?.company}</p>
                      </div>
                      <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        ${deal.value.toLocaleString()}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Stage</span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: deal.stage.color + '20', color: deal.stage.color }}>
                          {deal.stage.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Probability</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{deal.probability}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Expected Close</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(deal.expectedCloseDate)}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockCompanies.map(company => (
                <div key={company.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {company.name[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{company.name}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <Globe size={14} />
                        {company.domain}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Industry</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{company.industry}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Size</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{company.size} employees</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Contacts</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{company.contacts.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Deals</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{company.deals.length}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div className="h-full p-6 overflow-x-auto">
            <div className="flex gap-4 min-w-max">
              {mockPipeline.stages.map(stage => {
                const stageDeals = mockDeals.filter(d => d.stage.id === stage.id);
                const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);

                return (
                  <div
                    key={stage.id}
                    className="w-80 bg-gray-100 dark:bg-gray-900 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                        <h3 className="font-semibold text-gray-900 dark:text-white">{stage.name}</h3>
                      </div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {stageDeals.length}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      ${stageValue.toLocaleString()}
                    </p>

                    <div className="space-y-2">
                      {stageDeals.map(deal => (
                        <div
                          key={deal.id}
                          className="bg-white dark:bg-gray-800 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {deal.name}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ${deal.value.toLocaleString()}
                            </span>
                            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                              {deal.probability}%
                            </span>
                          </div>
                        </div>
                      ))}
                      <button className="w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center gap-1">
                        <Plus size={14} />
                        Add Deal
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="h-full p-6 overflow-y-auto">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <div className="flex items-center justify-between mb-2">
                  <Users size={20} className="text-indigo-500" />
                  <TrendingUp size={16} className="text-green-500" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{mockContacts.length}</p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <div className="flex items-center justify-between mb-2">
                  <Target size={20} className="text-blue-500" />
                  <Activity size={16} className="text-blue-500" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Leads</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{mockLeads.filter(l => l.status !== 'converted').length}</p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign size={20} className="text-green-500" />
                  <BarChart3 size={16} className="text-green-500" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Open Deals Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${totalDealValue.toLocaleString()}</p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle size={20} className="text-purple-500" />
                  <PieChart size={16} className="text-purple-500" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Win Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {openDeals > 0 ? Math.round((wonDeals / (wonDeals + openDeals)) * 100) : 0}%
                </p>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Deal Pipeline Distribution</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <PieChart size={48} className="opacity-50" />
                  <span className="ml-2">Chart visualization would go here</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Monthly Activity</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <BarChart3 size={48} className="opacity-50" />
                  <span className="ml-2">Activity chart would go here</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedContact(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedContact.firstName[0]}{selectedContact.lastName[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedContact.firstName} {selectedContact.lastName}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">{selectedContact.jobTitle} at {selectedContact.company}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedContact(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  <Trash2 size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Email</label>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedContact.email}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Phone</label>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedContact.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Lifecycle Stage</label>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">{selectedContact.lifecycleStage}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Source</label>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">{selectedContact.source}</p>
                </div>
              </div>

              {selectedContact.addresses.length > 0 && (
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Address</label>
                  <div className="flex items-center gap-2 mt-1 text-gray-900 dark:text-white">
                    <MapPin size={16} />
                    <p>{selectedContact.addresses[0].city}, {selectedContact.addresses[0].state} {selectedContact.addresses[0].postalCode}</p>
                  </div>
                </div>
              )}

              {selectedContact.tags.length > 0 && (
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Tags</label>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedContact.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Recent Activity</label>
                <div className="mt-2 space-y-2">
                  {selectedContact.emails.slice(0, 3).map(email => (
                    <div key={email.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Mail size={16} className="text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{email.subject}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(email.receivedAt)}</p>
                      </div>
                    </div>
                  ))}
                  {selectedContact.calls.slice(0, 2).map(call => (
                    <div key={call.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Phone size={16} className="text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Call - {call.direction}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{Math.floor(call.duration / 60)} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-2">
              <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors">
                Edit Contact
              </button>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDate(date?: Date | null): string {
  if (!date) return 'N/A';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}
