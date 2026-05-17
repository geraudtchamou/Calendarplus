import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Note, Task, CalendarEvent, VoiceRecording, Goal, AppSettings, SearchResult } from '../types';
import { mockNotes, mockTasks, mockEvents, mockVoiceRecordings, mockGoals } from '../utils/mockData';

interface AppContextType {
  // Data
  notes: Note[];
  tasks: Task[];
  events: CalendarEvent[];
  voiceRecordings: VoiceRecording[];
  goals: Goal[];
  
  // Settings
  settings: AppSettings;
  darkMode: boolean;
  sidebarOpen: boolean;
  
  // Actions
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // Note actions
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  
  // AI Assistant
  aiAssistantOpen: boolean;
  toggleAiAssistant: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [events] = useState<CalendarEvent[]>(mockEvents);
  const [voiceRecordings] = useState<VoiceRecording[]>(mockVoiceRecordings);
  const [goals] = useState<Goal[]>(mockGoals);
  
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'dark',
    language: 'en',
    notifications: {
      enabled: true,
      taskReminders: true,
      eventReminders: true,
      dailyBrief: true,
      weeklyReport: true,
    },
    privacy: {
      biometricLock: false,
      pinEnabled: false,
      encryptionEnabled: true,
    },
    sync: {
      enabled: true,
      autoSync: true,
      wifiOnly: false,
    },
  });

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const addNote = useCallback((noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes(prev => [newNote, ...prev]);
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
    ));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  }, []);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date(),
    };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, ...updates } : task
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date() : undefined }
        : task
    ));
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];
    
    notes.forEach(note => {
      if (note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query)) {
        results.push({
          type: 'note',
          id: note.id,
          title: note.title,
          preview: note.content.substring(0, 100),
          relevance: 1,
        });
      }
    });
    
    tasks.forEach(task => {
      if (task.title.toLowerCase().includes(query) || task.description?.toLowerCase().includes(query)) {
        results.push({
          type: 'task',
          id: task.id,
          title: task.title,
          preview: task.description || '',
          relevance: 1,
        });
      }
    });
    
    return results.sort((a, b) => b.relevance - a.relevance);
  }, [searchQuery, notes, tasks]);

  const toggleAiAssistant = useCallback(() => {
    setAiAssistantOpen(prev => !prev);
  }, []);

  const value = useMemo(() => ({
    notes,
    tasks,
    events,
    voiceRecordings,
    goals,
    settings,
    darkMode,
    sidebarOpen,
    toggleDarkMode,
    toggleSidebar,
    updateSettings,
    addNote,
    updateNote,
    deleteNote,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    searchQuery,
    setSearchQuery,
    searchResults,
    aiAssistantOpen,
    toggleAiAssistant,
  }), [
    notes, tasks, events, voiceRecordings, goals,
    settings, darkMode, sidebarOpen, searchQuery, aiAssistantOpen,
    toggleDarkMode, toggleSidebar, updateSettings,
    addNote, updateNote, deleteNote,
    addTask, updateTask, deleteTask, toggleTaskComplete,
    setSearchQuery, toggleAiAssistant, searchResults,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
