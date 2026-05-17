import { useState } from 'react';
import { 
  LayoutDashboard, FileText, CheckSquare, Calendar, Mic, 
  Brain, FolderTree, Settings, Search, Plus, Bell, 
  Moon, Sun, Menu, X, Sparkles 
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { UserProfile } from '../App';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'notes', label: 'Notes', icon: <FileText size={20} /> },
  { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
  { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
  { id: 'voice', label: 'Voice Notes', icon: <Mic size={20} /> },
  { id: 'knowledge', label: 'Knowledge Graph', icon: <Brain size={20} /> },
  { id: 'folders', label: 'Folders', icon: <FolderTree size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

interface SidebarProps {
  onPageChange?: (page: string) => void;
  currentPage?: string;
}

export function Sidebar({ onPageChange, currentPage }: SidebarProps) {
  const { sidebarOpen, toggleSidebar, darkMode, toggleDarkMode } = useApp();
  const [activeItem, setActiveItem] = useState(currentPage || 'dashboard');

  return (
    <>
      {/* Mobile overlay with fade transition */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden fade-enter"
          onClick={toggleSidebar}
        />
      )}
      
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        transform sidebar-transition
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Nexus</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Your Second Brain</p>
              </div>
            </div>
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4">
          <button className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2">
            <Plus size={18} />
            Quick Capture
          </button>
        </div>

        {/* Navigation with stagger animation */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={item.id} className="stagger-item" style={{ animationDelay: `${index * 30}ms` }}>
                <button
                  onClick={() => {
                  setActiveItem(item.id);
                  onPageChange?.(item.id);
                  toggleSidebar();
                }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all button-press
                    ${activeItem === item.id 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}
                  `}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <UserProfile />
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={toggleDarkMode}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors button-press"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors button-press relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { toggleSidebar, searchQuery, setSearchQuery, toggleAiAssistant } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 content-fade">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg button-press"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-all">{title}</h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Search with smooth focus transition */}
          <div className="relative hidden md:block">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors" />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
            />
          </div>

          {/* AI Assistant Button with press effect */}
          <button
            onClick={toggleAiAssistant}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/25 button-press"
          >
            <Brain size={18} />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>
        </div>
      </div>
    </header>
  );
}
