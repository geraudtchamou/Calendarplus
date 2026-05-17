// src/services/collaborationService.ts
// Collaboration, Knowledge Graph, and Automation Service

import {
  Workspace,
  WorkspaceMember,
  Comment,
  ActivityLog,
  KnowledgeNode,
  KnowledgeEdge,
  KnowledgeCluster,
  GraphLayout,
  Workflow,
  AutomationLog,
  SearchResult,
  SearchQuery,
  SearchFacet,
} from '../types/collaboration';

class CollaborationService {
  // Mock data for demonstration
  private workspaces: Workspace[] = [];
  private comments: Comment[] = [];
  private activityLogs: ActivityLog[] = [];
  private knowledgeNodes: KnowledgeNode[] = [];
  private knowledgeEdges: KnowledgeEdge[] = [];
  private workflows: Workflow[] = [];
  private automationLogs: AutomationLog[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize mock workspaces
    this.workspaces = [
      {
        id: 'ws-1',
        name: 'Product Team',
        description: 'Main product development workspace',
        icon: '🚀',
        color: '#6366f1',
        members: [
          {
            userId: 'user-1',
            role: 'owner',
            invitedAt: new Date().toISOString(),
            joinedAt: new Date().toISOString(),
            status: 'active',
            permissions: {
              canEdit: true,
              canDelete: true,
              canShare: true,
              canInvite: true,
              canManageBilling: true,
              canAccessAnalytics: true,
            },
          },
          {
            userId: 'user-2',
            role: 'editor',
            invitedAt: new Date().toISOString(),
            joinedAt: new Date().toISOString(),
            status: 'active',
            permissions: {
              canEdit: true,
              canDelete: false,
              canShare: true,
              canInvite: false,
              canManageBilling: false,
              canAccessAnalytics: true,
            },
          },
        ],
        roles: [],
        settings: {
          visibility: 'team',
          allowGuests: true,
          require2FA: false,
          defaultLanguage: 'en',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Initialize mock knowledge graph
    this.knowledgeNodes = [
      {
        id: 'node-1',
        type: 'note',
        title: 'Product Strategy 2024',
        summary: 'Q1-Q4 strategic initiatives',
        color: '#6366f1',
        icon: '📋',
        metadata: { tags: ['strategy', 'planning'], folder: 'Business' },
        clusterId: 'cluster-1',
      },
      {
        id: 'node-2',
        type: 'task',
        title: 'Launch MVP',
        summary: 'Complete MVP development and testing',
        color: '#10b981',
        icon: '✅',
        metadata: { priority: 'high', dueDate: '2024-06-01' },
        clusterId: 'cluster-1',
      },
      {
        id: 'node-3',
        type: 'concept',
        title: 'User Onboarding',
        summary: 'Key concepts for user onboarding flow',
        color: '#f59e0b',
        icon: '💡',
        metadata: { tags: ['ux', 'onboarding'] },
        clusterId: 'cluster-2',
      },
      {
        id: 'node-4',
        type: 'note',
        title: 'Competitor Analysis',
        summary: 'Analysis of key competitors',
        color: '#ef4444',
        icon: '📊',
        metadata: { tags: ['research', 'market'] },
        clusterId: 'cluster-1',
      },
    ];

    this.knowledgeEdges = [
      {
        id: 'edge-1',
        sourceId: 'node-1',
        targetId: 'node-2',
        type: 'depends_on',
        strength: 0.9,
        label: 'requires',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'edge-2',
        sourceId: 'node-1',
        targetId: 'node-4',
        type: 'references',
        strength: 0.7,
        label: 'informed by',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'edge-3',
        sourceId: 'node-3',
        targetId: 'node-2',
        type: 'related_to',
        strength: 0.6,
        label: 'influences',
        createdAt: new Date().toISOString(),
      },
    ];

    // Initialize mock workflows
    this.workflows = [
      {
        id: 'wf-1',
        name: 'New Lead Follow-up',
        description: 'Automatically create tasks when new leads arrive',
        trigger: {
          type: 'event',
          eventType: 'email_received',
          filters: { subjectContains: 'Inquiry' },
        },
        actions: [
          {
            id: 'action-1',
            type: 'create_task',
            config: { priority: 'high', dueInDays: 1 },
            order: 1,
          },
          {
            id: 'action-2',
            type: 'slack_notify',
            config: { channel: '#sales', message: 'New lead received!' },
            order: 2,
          },
        ],
        isActive: true,
        runCount: 47,
        createdBy: 'user-1',
      },
      {
        id: 'wf-2',
        name: 'Meeting Summary Distribution',
        description: 'Send meeting summaries to attendees',
        trigger: {
          type: 'event',
          eventType: 'meeting_ended',
        },
        actions: [
          {
            id: 'action-3',
            type: 'ai_summarize',
            config: { includeActionItems: true },
            order: 1,
          },
          {
            id: 'action-4',
            type: 'send_email',
            config: { template: 'meeting-summary', delayMinutes: 5 },
            order: 2,
          },
        ],
        isActive: true,
        runCount: 128,
        createdBy: 'user-1',
      },
    ];
  }

  // Workspace Management
  async getWorkspaces(): Promise<Workspace[]> {
    return Promise.resolve(this.workspaces);
  }

  async getWorkspace(id: string): Promise<Workspace | null> {
    const workspace = this.workspaces.find((w) => w.id === id);
    return Promise.resolve(workspace || null);
  }

  async createWorkspace(data: Partial<Workspace>): Promise<Workspace> {
    const newWorkspace: Workspace = {
      id: `ws-${Date.now()}`,
      name: data.name || 'Untitled Workspace',
      description: data.description,
      icon: data.icon,
      color: data.color,
      members: data.members || [],
      roles: data.roles || [],
      settings: data.settings || {
        visibility: 'private',
        allowGuests: false,
        require2FA: false,
        defaultLanguage: 'en',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.workspaces.push(newWorkspace);
    return Promise.resolve(newWorkspace);
  }

  async inviteMember(
    workspaceId: string,
    email: string,
    role: 'admin' | 'editor' | 'viewer'
  ): Promise<void> {
    const workspace = await this.getWorkspace(workspaceId);
    if (!workspace) throw new Error('Workspace not found');
    // Simulate invitation
    console.log(`Inviting ${email} as ${role} to ${workspace.name}`);
  }

  // Comments & Collaboration
  async addComment(resourceId: string, authorId: string, content: string): Promise<Comment> {
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      resourceId,
      authorId,
      content,
      resolved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mentions: [],
      reactions: [],
    };
    this.comments.push(comment);
    this.logActivity(authorId, 'comment', 'note', resourceId, 'Added comment');
    return Promise.resolve(comment);
  }

  async resolveComment(commentId: string, resolvedBy: string): Promise<void> {
    const comment = this.comments.find((c) => c.id === commentId);
    if (comment) {
      comment.resolved = true;
      comment.resolvedBy = resolvedBy;
      comment.updatedAt = new Date().toISOString();
    }
  }

  async getComments(resourceId: string): Promise<Comment[]> {
    return Promise.resolve(this.comments.filter((c) => c.resourceId === resourceId));
  }

  // Activity Logging
  logActivity(
    userId: string,
    action: ActivityLog['action'],
    targetType: ActivityLog['targetType'],
    targetId: string,
    targetName: string,
    metadata?: Record<string, any>
  ): void {
    const log: ActivityLog = {
      id: `log-${Date.now()}`,
      workspaceId: 'ws-1',
      userId,
      action,
      targetType,
      targetId,
      targetName,
      metadata: metadata || {},
      timestamp: new Date().toISOString(),
    };
    this.activityLogs.unshift(log);
    // Keep only last 1000 logs
    if (this.activityLogs.length > 1000) {
      this.activityLogs = this.activityLogs.slice(0, 1000);
    }
  }

  async getActivityLogs(workspaceId: string, limit = 50): Promise<ActivityLog[]> {
    return Promise.resolve(
      this.activityLogs.filter((l) => l.workspaceId === workspaceId).slice(0, limit)
    );
  }

  // Knowledge Graph Operations
  async getKnowledgeGraph(workspaceId: string): Promise<GraphLayout> {
    // Auto-cluster nodes based on tags and types
    const clusters: KnowledgeCluster[] = [
      {
        id: 'cluster-1',
        name: 'Strategy & Planning',
        nodeIds: this.knowledgeNodes.filter((n) => n.clusterId === 'cluster-1').map((n) => n.id),
        color: '#6366f1',
        autoGenerated: true,
      },
      {
        id: 'cluster-2',
        name: 'UX & Design',
        nodeIds: this.knowledgeNodes.filter((n) => n.clusterId === 'cluster-2').map((n) => n.id),
        color: '#f59e0b',
        autoGenerated: true,
      },
    ];

    return Promise.resolve({
      nodes: this.knowledgeNodes,
      edges: this.knowledgeEdges,
      clusters,
      viewport: { x: 0, y: 0, zoom: 1 },
    });
  }

  async findRelatedNotes(noteId: string): Promise<KnowledgeNode[]> {
    const connectedIds = new Set<string>();
    
    // Find all connected nodes via edges
    this.knowledgeEdges.forEach((edge) => {
      if (edge.sourceId === noteId) connectedIds.add(edge.targetId);
      if (edge.targetId === noteId) connectedIds.add(edge.sourceId);
    });

    return Promise.resolve(
      this.knowledgeNodes.filter((n) => connectedIds.has(n.id) && n.id !== noteId)
    );
  }

  async createLink(sourceId: string, targetId: string, type: KnowledgeEdge['type']): Promise<void> {
    const edge: KnowledgeEdge = {
      id: `edge-${Date.now()}`,
      sourceId,
      targetId,
      type,
      strength: 1.0,
      createdAt: new Date().toISOString(),
    };
    this.knowledgeEdges.push(edge);
  }

  // Universal Search
  async search(query: SearchQuery): Promise<{ results: SearchResult[]; facets: SearchFacet[] }> {
    // Simulate semantic search across all content types
    const mockResults: SearchResult[] = [
      {
        id: 'result-1',
        type: 'note',
        title: 'Product Strategy 2024',
        snippet: '...strategic <mark>initiatives</mark> for Q1-Q4...',
        score: 0.95,
        metadata: {
          createdAt: new Date().toISOString(),
          author: 'John Doe',
          tags: ['strategy', 'planning'],
          folder: 'Business',
        },
        contextPath: ['Business', 'Strategy'],
      },
      {
        id: 'result-2',
        type: 'task',
        title: 'Launch MVP',
        snippet: 'Complete <mark>MVP</mark> development and testing',
        score: 0.87,
        metadata: {
          createdAt: new Date().toISOString(),
          author: 'Jane Smith',
          tags: ['development'],
        },
        contextPath: ['Tasks', 'High Priority'],
      },
      {
        id: 'result-3',
        type: 'email',
        title: 'Re: Project Update',
        snippet: '...attached is the latest <mark>project</mark> update...',
        score: 0.76,
        metadata: {
          createdAt: new Date().toISOString(),
          author: 'Mike Johnson',
        },
        contextPath: ['Email', 'Inbox'],
      },
    ];

    const facets: SearchFacet[] = [
      {
        name: 'Type',
        values: [
          { value: 'note', count: 45 },
          { value: 'task', count: 23 },
          { value: 'email', count: 156 },
          { value: 'contact', count: 89 },
        ],
      },
      {
        name: 'Tags',
        values: [
          { value: 'strategy', count: 12 },
          { value: 'planning', count: 8 },
          { value: 'development', count: 15 },
        ],
      },
    ];

    return Promise.resolve({ results: mockResults, facets });
  }

  // Workflow Automation
  async getWorkflows(): Promise<Workflow[]> {
    return Promise.resolve(this.workflows);
  }

  async createWorkflow(data: Partial<Workflow>): Promise<Workflow> {
    const workflow: Workflow = {
      id: `wf-${Date.now()}`,
      name: data.name || 'Untitled Workflow',
      description: data.description,
      trigger: data.trigger!,
      actions: data.actions || [],
      conditions: data.conditions,
      isActive: data.isActive ?? true,
      runCount: 0,
      createdBy: data.createdBy || 'system',
    };
    this.workflows.push(workflow);
    return Promise.resolve(workflow);
  }

  async toggleWorkflow(workflowId: string): Promise<void> {
    const workflow = this.workflows.find((w) => w.id === workflowId);
    if (workflow) {
      workflow.isActive = !workflow.isActive;
    }
  }

  async triggerWorkflow(workflowId: string, inputData: any): Promise<AutomationLog> {
    const workflow = this.workflows.find((w) => w.id === workflowId);
    if (!workflow) throw new Error('Workflow not found');

    const log: AutomationLog = {
      id: `auto-${Date.now()}`,
      workflowId,
      triggeredAt: new Date().toISOString(),
      status: 'running',
      inputData,
      executionTimeMs: 0,
    };

    // Simulate workflow execution
    setTimeout(() => {
      log.status = 'success';
      log.executionTimeMs = Math.floor(Math.random() * 500) + 100;
      workflow.runCount++;
    }, 500);

    this.automationLogs.unshift(log);
    return Promise.resolve(log);
  }

  async getAutomationLogs(workflowId?: string, limit = 20): Promise<AutomationLog[]> {
    let logs = this.automationLogs;
    if (workflowId) {
      logs = logs.filter((l) => l.workflowId === workflowId);
    }
    return Promise.resolve(logs.slice(0, limit));
  }
}

export const collaborationService = new CollaborationService();
