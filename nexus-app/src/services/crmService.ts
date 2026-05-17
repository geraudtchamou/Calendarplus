// CRM Service - Handles all CRM-related operations
import { Contact, Lead, Deal, Company, Pipeline, Workflow, CrmReport, TaskAssignment } from '../types';

class CrmService {
  private contacts: Contact[] = [];
  private leads: Lead[] = [];
  private deals: Deal[] = [];
  private companies: Company[] = [];
  private pipelines: Pipeline[] = [];
  private workflows: Workflow[] = [];
  private taskAssignments: TaskAssignment[] = [];

  // Contact Management
  async createContact(contact: Partial<Contact>): Promise<Contact> {
    const newContact: Contact = {
      id: `contact_${Date.now()}`,
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      email: contact.email || '',
      phone: contact.phone,
      company: contact.company,
      jobTitle: contact.jobTitle,
      socialProfiles: contact.socialProfiles || [],
      addresses: contact.addresses || [],
      customFields: contact.customFields || {},
      tags: contact.tags || [],
      source: contact.source || 'manual',
      lifecycleStage: contact.lifecycleStage || 'subscriber',
      ownerId: contact.ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: [],
      tasks: [],
      deals: [],
      emails: [],
      calls: [],
      meetings: []
    };
    this.contacts.push(newContact);
    return newContact;
  }

  async updateContact(contactId: string, updates: Partial<Contact>): Promise<Contact> {
    const index = this.contacts.findIndex(c => c.id === contactId);
    if (index !== -1) {
      this.contacts[index] = { ...this.contacts[index], ...updates, updatedAt: new Date() };
    }
    return this.contacts[index];
  }

  async deleteContact(contactId: string): Promise<void> {
    const index = this.contacts.findIndex(c => c.id === contactId);
    if (index !== -1) {
      this.contacts.splice(index, 1);
    }
  }

  getContacts(filters?: { lifecycleStage?: string; companyId?: string }): Contact[] {
    let result = this.contacts;
    if (filters?.lifecycleStage) {
      result = result.filter(c => c.lifecycleStage === filters.lifecycleStage);
    }
    if (filters?.companyId) {
      result = result.filter(c => c.company === filters.companyId);
    }
    return result;
  }

  async searchContacts(query: string): Promise<Contact[]> {
    const lowerQuery = query.toLowerCase();
    return this.contacts.filter(c =>
      c.firstName.toLowerCase().includes(lowerQuery) ||
      c.lastName.toLowerCase().includes(lowerQuery) ||
      c.email.toLowerCase().includes(lowerQuery) ||
      c.company?.toLowerCase().includes(lowerQuery)
    );
  }

  // Lead Management
  async createLead(lead: Partial<Lead>): Promise<Lead> {
    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      contactId: lead.contactId || '',
      status: lead.status || 'new',
      score: lead.score || 0,
      source: lead.source || '',
      assignedTo: lead.assignedTo,
      activities: lead.activities || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.leads.push(newLead);
    return newLead;
  }

  async updateLeadStatus(leadId: string, status: Lead['status']): Promise<Lead> {
    const index = this.leads.findIndex(l => l.id === leadId);
    if (index !== -1) {
      this.leads[index].status = status;
      this.leads[index].updatedAt = new Date();
      
      if (status === 'converted') {
        this.leads[index].convertedAt = new Date();
      }
    }
    return this.leads[index];
  }

  async updateLeadScore(leadId: string, score: number): Promise<Lead> {
    const index = this.leads.findIndex(l => l.id === leadId);
    if (index !== -1) {
      this.leads[index].score = Math.max(0, Math.min(100, score));
      this.leads[index].updatedAt = new Date();
    }
    return this.leads[index];
  }

  getLeads(status?: Lead['status']): Lead[] {
    return status ? this.leads.filter(l => l.status === status) : this.leads;
  }

  // Deal Management
  async createDeal(deal: Partial<Deal>): Promise<Deal> {
    const newDeal: Deal = {
      id: `deal_${Date.now()}`,
      name: deal.name || 'Untitled Deal',
      contactId: deal.contactId || '',
      value: deal.value || 0,
      currency: deal.currency || 'USD',
      stage: deal.stage || { id: '', pipelineId: '', name: 'New', order: 1 },
      probability: deal.probability || 10,
      status: deal.status || 'open',
      source: deal.source || '',
      ownerId: deal.ownerId,
      customFields: deal.customFields || {},
      expectedCloseDate: deal.expectedCloseDate,
      tasks: [],
      notes: [],
      activities: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.deals.push(newDeal);
    return newDeal;
  }

  async updateDealStage(dealId: string, stageId: string): Promise<Deal> {
    const index = this.deals.findIndex(d => d.id === dealId);
    if (index !== -1) {
      this.deals[index].stage.id = stageId;
      this.deals[index].updatedAt = new Date();
    }
    return this.deals[index];
  }

  async updateDealStatus(dealId: string, status: Deal['status'], lossReason?: string): Promise<Deal> {
    const index = this.deals.findIndex(d => d.id === dealId);
    if (index !== -1) {
      this.deals[index].status = status;
      this.deals[index].updatedAt = new Date();
      
      if (status === 'lost' && lossReason) {
        this.deals[index].lossReason = lossReason;
      }
      
      if (status === 'won') {
        this.deals[index].actualCloseDate = new Date();
      }
    }
    return this.deals[index];
  }

  getDeals(filters?: { status?: Deal['status']; stageId?: string }): Deal[] {
    let result = this.deals;
    if (filters?.status) {
      result = result.filter(d => d.status === filters.status);
    }
    if (filters?.stageId) {
      result = result.filter(d => d.stage.id === filters.stageId);
    }
    return result;
  }

  getPipelineValue(): number {
    return this.deals
      .filter(d => d.status === 'open')
      .reduce((sum, deal) => sum + deal.value * (deal.probability / 100), 0);
  }

  // Company Management
  async createCompany(company: Partial<Company>): Promise<Company> {
    const newCompany: Company = {
      id: `company_${Date.now()}`,
      name: company.name || 'Untitled Company',
      domain: company.domain,
      industry: company.industry,
      size: company.size,
      website: company.website,
      phone: company.phone,
      addresses: company.addresses || [],
      customFields: company.customFields || {},
      contacts: [],
      deals: [],
      ownerId: company.ownerId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.companies.push(newCompany);
    return newCompany;
  }

  async updateCompany(companyId: string, updates: Partial<Company>): Promise<Company> {
    const index = this.companies.findIndex(c => c.id === companyId);
    if (index !== -1) {
      this.companies[index] = { ...this.companies[index], ...updates, updatedAt: new Date() };
    }
    return this.companies[index];
  }

  getCompanies(industry?: string): Company[] {
    return industry ? this.companies.filter(c => c.industry === industry) : this.companies;
  }

  // Pipeline Management
  async createPipeline(pipeline: Partial<Pipeline>): Promise<Pipeline> {
    const newPipeline: Pipeline = {
      id: `pipeline_${Date.now()}`,
      name: pipeline.name || 'Untitled Pipeline',
      stages: pipeline.stages || [],
      isDefault: pipeline.isDefault ?? false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.pipelines.push(newPipeline);
    return newPipeline;
  }

  getPipelines(): Pipeline[] {
    return this.pipelines;
  }

  getDefaultPipeline(): Pipeline | undefined {
    return this.pipelines.find(p => p.isDefault);
  }

  // Activity Tracking
  async logActivity(activity: {
    type: 'email' | 'call' | 'meeting' | 'note';
    contactId: string;
    subject: string;
    description?: string;
  }): Promise<void> {
    console.log('Logging activity:', activity);
    // Implementation for logging activities
  }

  async getActivityHistory(contactId: string): Promise<any[]> {
    console.log('Getting activity history for:', contactId);
    return [];
  }

  // Workflow Automation
  async createWorkflow(workflow: Partial<Workflow>): Promise<Workflow> {
    const newWorkflow: Workflow = {
      id: `workflow_${Date.now()}`,
      name: workflow.name || 'Untitled Workflow',
      trigger: workflow.trigger || { type: 'contactCreated' },
      conditions: workflow.conditions || [],
      actions: workflow.actions || [],
      enabled: workflow.enabled ?? true,
      runs: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.workflows.push(newWorkflow);
    return newWorkflow;
  }

  async toggleWorkflow(workflowId: string): Promise<void> {
    const index = this.workflows.findIndex(w => w.id === workflowId);
    if (index !== -1) {
      this.workflows[index].enabled = !this.workflows[index].enabled;
    }
  }

  getWorkflows(): Workflow[] {
    return this.workflows;
  }

  // Task Assignment
  async assignTask(assignment: Partial<TaskAssignment>): Promise<TaskAssignment> {
    const newAssignment: TaskAssignment = {
      id: `assignment_${Date.now()}`,
      taskId: assignment.taskId || '',
      assignedTo: assignment.assignedTo || '',
      assignedBy: assignment.assignedBy || '',
      assignedAt: new Date(),
      dueDate: assignment.dueDate,
      priority: assignment.priority || 'medium',
      status: assignment.status || 'pending'
    };
    this.taskAssignments.push(newAssignment);
    return newAssignment;
  }

  updateTaskStatus(assignmentId: string, status: TaskAssignment['status']): void {
    const index = this.taskAssignments.findIndex(a => a.id === assignmentId);
    if (index !== -1) {
      this.taskAssignments[index].status = status;
      
      if (status === 'completed') {
        // Trigger workflow if task completed
        this.triggerWorkflows('taskCompleted', { assignmentId });
      }
    }
  }

  // Reporting & Analytics
  async generateReport(type: CrmReport['type'], dateRange: { start: Date; end: Date }): Promise<CrmReport> {
    const report: CrmReport = {
      id: `report_${Date.now()}`,
      name: `${type} Report`,
      type,
      dateRange,
      data: this.calculateReportData(type, dateRange),
      charts: this.generateCharts(type),
      createdAt: new Date()
    };
    return report;
  }

  private calculateReportData(type: string, dateRange: { start: Date; end: Date }): Record<string, unknown> {
    switch (type) {
      case 'sales':
        return {
          totalRevenue: this.deals.filter(d => d.status === 'won').reduce((sum, d) => sum + d.value, 0),
          dealsWon: this.deals.filter(d => d.status === 'won').length,
          averageDealSize: this.deals.filter(d => d.status === 'won').reduce((sum, d) => sum + d.value, 0) / 
            (this.deals.filter(d => d.status === 'won').length || 1)
        };
      case 'pipeline':
        return {
          totalValue: this.getPipelineValue(),
          openDeals: this.deals.filter(d => d.status === 'open').length,
          byStage: this.pipelines[0]?.stages.map(stage => ({
            stage: stage.name,
            count: this.deals.filter(d => d.stage.id === stage.id && d.status === 'open').length,
            value: this.deals.filter(d => d.stage.id === stage.id && d.status === 'open').reduce((sum, d) => sum + d.value, 0)
          }))
        };
      default:
        return {};
    }
  }

  private generateCharts(type: string): any[] {
    return [
      { type: 'bar' as const, title: 'Overview', data: [], config: {} }
    ];
  }

  // Email-to-CRM Sync
  async syncEmailToCrm(emailData: {
    from: { email: string; name?: string };
    subject: string;
    body: string;
    receivedAt: Date;
  }): Promise<{ contact?: Contact; activityLogged: boolean }> {
    // Find or create contact from email
    let contact = this.contacts.find(c => c.email === emailData.from.email);
    
    if (!contact && emailData.from.email) {
      const names = (emailData.from.name || '').split(' ');
      contact = await this.createContact({
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        email: emailData.from.email,
        source: 'email'
      });
    }

    if (contact) {
      await this.logActivity({
        type: 'email',
        contactId: contact.id,
        subject: emailData.subject,
        description: emailData.body.substring(0, 500)
      });
    }

    return { contact: contact || undefined, activityLogged: true };
  }

  // Workflow Trigger System
  private async triggerWorkflows(triggerType: string, context: Record<string, unknown>): Promise<void> {
    const applicableWorkflows = this.workflows.filter(
      w => w.enabled && w.trigger.type === triggerType
    );

    for (const workflow of applicableWorkflows) {
      // Check conditions and execute actions
      console.log('Triggering workflow:', workflow.name);
      workflow.runs++;
      workflow.lastRunAt = new Date();
    }
  }

  // Email-to-Task Conversion
  async convertEmailToTask(emailId: string, assignTo: string, dueDate?: Date): Promise<TaskAssignment> {
    return this.assignTask({
      taskId: `task_from_email_${emailId}`,
      assignedTo: assignTo,
      assignedBy: 'system',
      dueDate,
      priority: 'medium',
      status: 'pending'
    });
  }
}

export const crmService = new CrmService();
