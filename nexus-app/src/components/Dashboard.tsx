import { Calendar, Clock, CheckCircle2, FileText, Mic, Brain, BarChart3, Target, Zap } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { format, isToday, isTomorrow } from 'date-fns';

export function Dashboard() {
  const { tasks, events, notes, voiceRecordings, goals } = useApp();
  
  const todayEvents = events.filter(event => isToday(new Date(event.start)));
  const pendingTasks = tasks.filter(task => !task.completed);
  const highPriorityTasks = pendingTasks.filter(task => task.priority === 'high' || task.priority === 'urgent');
  
  const completedToday = tasks.filter(task => task.completed && task.completedAt && isToday(task.completedAt));
  const completionRate = tasks.length > 0 
    ? Math.round((completedToday.length / tasks.length) * 100) 
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Good {getGreeting()}, Ready to be productive?
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {format(new Date(), 'EEEE, MMMM d')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <Zap size={18} />
            Quick Capture
          </button>
        </div>
      </div>

      {/* AI Brief Card */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Brain size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Your AI Daily Brief</h2>
            <p className="text-white/90 leading-relaxed">
              You have <span className="font-semibold">{todayEvents.length} events</span> today, starting with 
              "{todayEvents[0]?.title || 'no events'}". There are <span className="font-semibold">{highPriorityTasks.length} high-priority tasks</span> waiting. 
              Your focus time is scheduled from 4-6 PM. Consider tackling the product roadmap presentation first.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Calendar />}
          label="Today's Events"
          value={todayEvents.length.toString()}
          subtext={`${todayEvents.filter(e => !e.isAllDay).length} meetings`}
          color="indigo"
        />
        <StatCard
          icon={<CheckCircle2 />}
          label="Tasks Pending"
          value={pendingTasks.length.toString()}
          subtext={`${highPriorityTasks.length} high priority`}
          color="amber"
        />
        <StatCard
          icon={<FileText />}
          label="Recent Notes"
          value={notes.length.toString()}
          subtext={`${notes.filter(n => n.isPinned).length} pinned`}
          color="emerald"
        />
        <StatCard
          icon={<Target />}
          label="Completion Rate"
          value={`${completionRate}%`}
          subtext={`${completedToday.length} completed today`}
          color="rose"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock size={20} className="text-indigo-500" />
              Today's Schedule
            </h3>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              View Calendar
            </button>
          </div>
          <div className="space-y-3">
            {todayEvents.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No events scheduled for today</p>
            ) : (
              todayEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))
            )}
          </div>
        </div>

        {/* Priority Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 size={20} className="text-amber-500" />
              Priority Tasks
            </h3>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {highPriorityTasks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No high priority tasks</p>
            ) : (
              highPriorityTasks.slice(0, 5).map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Notes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText size={20} className="text-emerald-500" />
              Recent Notes
            </h3>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {notes.slice(0, 4).map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>

        {/* Voice Recordings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Mic size={20} className="text-rose-500" />
              Recent Recordings
            </h3>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {voiceRecordings.slice(0, 3).map(recording => (
              <RecordingCard key={recording.id} recording={recording} />
            ))}
          </div>
        </div>

        {/* Goals Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 size={20} className="text-purple-500" />
              Goals Progress
            </h3>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {goals.slice(0, 3).map(goal => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: 'indigo' | 'amber' | 'emerald' | 'rose';
}

function StatCard({ icon, label, value, subtext, color }: StatCardProps) {
  const colorClasses = {
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    rose: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">{subtext}</p>
    </div>
  );
}

import { Event as EventType, Task as TaskType, Note as NoteType, VoiceRecording, Goal } from '../../types';
import { Play, Star, Pin } from 'lucide-react';

function EventCard({ event }: { event: EventType }) {
  const startTime = format(new Date(event.start), 'h:mm a');
  const endTime = format(new Date(event.end), 'h:mm a');

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group">
      <div 
        className="w-1 h-12 rounded-full"
        style={{ backgroundColor: event.color || '#6366f1' }}
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {event.title}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {startTime} - {endTime}
          {event.location && ` • ${event.location}`}
        </p>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: TaskType }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group">
      <div className={`w-2 h-2 rounded-full ${
        task.priority === 'urgent' ? 'bg-red-500' :
        task.priority === 'high' ? 'bg-amber-500' :
        task.priority === 'medium' ? 'bg-blue-500' : 'bg-gray-400'
      }`} />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 dark:text-white truncate text-sm">
          {task.title}
        </h4>
        {task.dueDate && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Due {format(new Date(task.dueDate), 'MMM d')}
          </p>
        )}
      </div>
    </div>
  );
}

function NoteCard({ note }: { note: NoteType }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group">
      <div 
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: note.color || '#6366f1' }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-900 dark:text-white truncate text-sm">
            {note.title}
          </h4>
          {note.isPinned && <Pin size={12} className="text-gray-400" />}
          {note.isFavorite && <Star size={12} className="text-amber-400 fill-amber-400" />}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {note.tags.slice(0, 3).map(tag => `#${tag}`).join(' ')}
        </p>
      </div>
    </div>
  );
}

function RecordingCard({ recording }: { recording: VoiceRecording }) {
  const duration = `${Math.floor(recording.duration / 60)}:${(recording.duration % 60).toString().padStart(2, '0')}`;
  
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group">
      <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
        <Play size={16} className="text-rose-600 dark:text-rose-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 dark:text-white truncate text-sm">
          {recording.title}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {duration} • {format(new Date(recording.createdAt), 'MMM d, h:mm a')}
        </p>
      </div>
    </div>
  );
}

function GoalCard({ goal }: { goal: Goal }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{goal.title}</h4>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{goal.progress}%</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${goal.progress}%` }}
        />
      </div>
    </div>
  );
}
