import { Note, Task, CalendarEvent, VoiceRecording, Goal, FocusSession } from '../types';

// Mock data generator for development and demo purposes

const generateId = () => Math.random().toString(36).substring(2, 15);

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

export const mockNotes: Note[] = [
  {
    id: generateId(),
    title: 'Product Strategy Q2 2024',
    content: `# Product Strategy Q2 2024

## Key Objectives
- Launch new AI features
- Improve user retention by 25%
- Expand to enterprise market

## Action Items
1. Conduct user research
2. Design new onboarding flow
3. Implement analytics dashboard

## Notes from Meeting
The team discussed the importance of focusing on AI-powered features that differentiate us from competitors.`,
    createdAt: new Date(today.getTime() - 86400000 * 2),
    updatedAt: new Date(),
    folderId: 'work',
    tags: ['strategy', 'product', 'q2'],
    color: '#6366f1',
    isPinned: true,
    isFavorite: true,
    attachments: [],
    linkedNoteIds: [],
    aiSummary: 'Q2 strategy focusing on AI features, user retention, and enterprise expansion.',
    aiKeywords: ['AI', 'retention', 'enterprise', 'strategy'],
  },
  {
    id: generateId(),
    title: 'Meeting Notes: Design Review',
    content: `# Design Review - March 15

## Attendees
- Sarah (Design Lead)
- Mike (Product)
- Alex (Engineering)

## Discussion Points
- New dashboard layout received positive feedback
- Need to improve mobile responsiveness
- Color palette adjustments needed

## Decisions
- Proceed with Option B for main dashboard
- Schedule follow-up in 1 week`,
    createdAt: new Date(today.getTime() - 86400000),
    updatedAt: new Date(today.getTime() - 86400000),
    folderId: 'meetings',
    tags: ['design', 'meeting', 'review'],
    color: '#ec4899',
    isPinned: false,
    isFavorite: true,
    attachments: [],
    linkedNoteIds: [],
    aiSummary: 'Design review meeting approved Option B for dashboard, follow-up scheduled.',
    aiKeywords: ['design', 'dashboard', 'mobile', 'feedback'],
  },
  {
    id: generateId(),
    title: 'Learning React Patterns',
    content: `# React Best Practices

## Component Patterns
- Use custom hooks for logic extraction
- Prefer composition over inheritance
- Keep components small and focused

## Performance Tips
- Memoize expensive calculations
- Use React.lazy for code splitting
- Optimize re-renders with useMemo/useCallback

## Resources
- React documentation
- Epic React by Kent C. Dodds
- Patterns.dev`,
    createdAt: new Date(today.getTime() - 86400000 * 5),
    updatedAt: new Date(today.getTime() - 86400000 * 3),
    folderId: 'learning',
    tags: ['react', 'learning', 'frontend'],
    color: '#14b8a6',
    isPinned: false,
    isFavorite: false,
    attachments: [],
    linkedNoteIds: [],
    aiSummary: 'React best practices covering component patterns and performance optimization.',
    aiKeywords: ['React', 'hooks', 'performance', 'components'],
  },
];

export const mockTasks: Task[] = [
  {
    id: generateId(),
    title: 'Complete product roadmap presentation',
    description: 'Create slides for Q2 roadmap review with stakeholders',
    completed: false,
    priority: 'high',
    dueDate: new Date(today.getTime() + 86400000 * 2),
    projectId: 'proj-1',
    labels: ['presentation', 'roadmap'],
    subtasks: [
      { id: generateId(), title: 'Gather metrics from last quarter', completed: true },
      { id: generateId(), title: 'Design slide templates', completed: false },
      { id: generateId(), title: 'Write executive summary', completed: false },
    ],
    dependencies: [],
    estimatedMinutes: 120,
    createdAt: new Date(today.getTime() - 86400000),
  },
  {
    id: generateId(),
    title: 'Review pull requests',
    description: 'Review pending PRs from the team',
    completed: false,
    priority: 'medium',
    dueDate: today,
    projectId: 'proj-1',
    labels: ['code-review'],
    subtasks: [],
    dependencies: [],
    estimatedMinutes: 45,
    createdAt: new Date(),
  },
  {
    id: generateId(),
    title: 'Team standup preparation',
    completed: true,
    priority: 'low',
    dueDate: today,
    projectId: 'proj-1',
    labels: ['meeting'],
    subtasks: [],
    dependencies: [],
    estimatedMinutes: 15,
    createdAt: new Date(today.getTime() - 86400000),
    completedAt: new Date(),
  },
  {
    id: generateId(),
    title: 'Update documentation',
    description: 'Refresh API docs with latest endpoints',
    completed: false,
    priority: 'medium',
    dueDate: new Date(today.getTime() + 86400000 * 5),
    projectId: 'proj-2',
    labels: ['documentation'],
    subtasks: [
      { id: generateId(), title: 'Document new auth endpoints', completed: false },
      { id: generateId(), title: 'Add usage examples', completed: false },
    ],
    dependencies: [],
    estimatedMinutes: 90,
    createdAt: new Date(today.getTime() - 86400000 * 2),
  },
];

export const mockEvents: CalendarEvent[] = [
  {
    id: generateId(),
    title: 'Product Planning Meeting',
    description: 'Weekly product planning with the team',
    start: new Date(today.setHours(10, 0, 0, 0)),
    end: new Date(today.setHours(11, 0, 0, 0)),
    location: 'Conference Room A',
    attendees: ['sarah@company.com', 'mike@company.com'],
    color: '#6366f1',
    isAllDay: false,
    reminders: [{ id: generateId(), type: 'notification', minutesBefore: 15 }],
    relatedTaskIds: [],
    relatedNoteIds: [],
  },
  {
    id: generateId(),
    title: 'Design Review Session',
    start: new Date(today.setHours(14, 0, 0, 0)),
    end: new Date(today.setHours(15, 30, 0, 0)),
    location: 'Virtual - Zoom',
    attendees: ['alex@company.com', 'design-team@company.com'],
    color: '#ec4899',
    isAllDay: false,
    reminders: [{ id: generateId(), type: 'notification', minutesBefore: 30 }],
  },
  {
    id: generateId(),
    title: 'Focus Time - Deep Work',
    start: new Date(today.setHours(16, 0, 0, 0)),
    end: new Date(today.setHours(18, 0, 0, 0)),
    color: '#14b8a6',
    isAllDay: false,
    reminders: [],
  },
  {
    id: generateId(),
    title: 'Team Lunch',
    start: new Date(today.setHours(12, 0, 0, 0)),
    end: new Date(today.setHours(13, 0, 0, 0)),
    location: 'Cafeteria',
    color: '#f59e0b',
    isAllDay: false,
    reminders: [{ id: generateId(), type: 'notification', minutesBefore: 60 }],
  },
  {
    id: generateId(),
    title: 'Quarterly Review',
    start: new Date(nextWeek.setHours(9, 0, 0, 0)),
    end: new Date(nextWeek.setHours(17, 0, 0, 0)),
    location: 'Main Office',
    attendees: ['all-hands@company.com'],
    color: '#8b5cf6',
    isAllDay: true,
    reminders: [{ id: generateId(), type: 'email', minutesBefore: 1440 }],
  },
];

export const mockVoiceRecordings: VoiceRecording[] = [
  {
    id: generateId(),
    title: 'Morning Brainstorm Ideas',
    audioUrl: '/recordings/morning-brainstorm.mp3',
    duration: 185,
    createdAt: new Date(today.getTime() - 86400000),
    transcript: `Hey, I just had some great ideas for the new feature. We should focus on making the onboarding experience more intuitive. Maybe we can add interactive tutorials and a progress tracker. Also, I think we should integrate AI suggestions based on user behavior patterns. Let me schedule a meeting with the design team to discuss this further.`,
    aiSummary: 'Ideas for improving onboarding with interactive tutorials, progress tracking, and AI-powered suggestions.',
    keywords: ['onboarding', 'AI', 'tutorials', 'design'],
    isProcessing: false,
  },
  {
    id: generateId(),
    title: 'Quick Task Reminder',
    audioUrl: '/recordings/task-reminder.mp3',
    duration: 45,
    createdAt: new Date(today.getTime() - 3600000),
    transcript: `Remember to call John about the project update tomorrow at 3 PM. Also need to send the budget proposal before Friday. Don't forget the team building event next week.`,
    aiSummary: 'Reminders: Call John tomorrow 3PM, send budget proposal by Friday, attend team building event.',
    keywords: ['call', 'budget', 'team building'],
    isProcessing: false,
  },
];

export const mockGoals: Goal[] = [
  {
    id: generateId(),
    title: 'Launch New Product Feature',
    description: 'Successfully launch the AI-powered recommendation system',
    targetDate: new Date(today.getTime() + 86400000 * 60),
    progress: 65,
    category: 'work',
    milestones: [
      { id: generateId(), title: 'Research & Planning', completed: true },
      { id: generateId(), title: 'Design Phase', completed: true },
      { id: generateId(), title: 'Development', completed: false },
      { id: generateId(), title: 'Testing', completed: false },
      { id: generateId(), title: 'Launch', completed: false },
    ],
  },
  {
    id: generateId(),
    title: 'Read 24 Books This Year',
    progress: 33,
    category: 'personal',
    milestones: [
      { id: generateId(), title: 'Q1: 6 books', completed: true },
      { id: generateId(), title: 'Q2: 6 books', completed: false },
      { id: generateId(), title: 'Q3: 6 books', completed: false },
      { id: generateId(), title: 'Q4: 6 books', completed: false },
    ],
  },
  {
    id: generateId(),
    title: 'Improve Fitness Routine',
    description: 'Exercise 4 times per week consistently',
    progress: 80,
    category: 'health',
    milestones: [
      { id: generateId(), title: 'Establish routine', completed: true },
      { id: generateId(), title: 'Reach 30 workouts', completed: true },
      { id: generateId(), title: 'Complete 5K run', completed: false },
    ],
  },
];

export const mockFocusSessions: FocusSession[] = [
  {
    id: generateId(),
    startTime: new Date(today.setHours(9, 0, 0, 0)),
    endTime: new Date(today.setHours(9, 25, 0, 0)),
    duration: 25,
    type: 'pomodoro',
    completed: true,
    distractions: 0,
  },
  {
    id: generateId(),
    startTime: new Date(today.setHours(9, 30, 0, 0)),
    endTime: new Date(today.setHours(9, 55, 0, 0)),
    duration: 25,
    type: 'pomodoro',
    completed: true,
    distractions: 1,
  },
  {
    id: generateId(),
    startTime: new Date(today.setHours(10, 30, 0, 0)),
    endTime: new Date(today.setHours(12, 30, 0, 0)),
    duration: 120,
    type: 'deep-work',
    completed: true,
    distractions: 2,
  },
];
