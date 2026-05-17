import { AppProvider, useApp } from './store/AppContext';
import { AuthProvider, useAuth } from './store/AuthContext';
import { Sidebar, Header } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { EmailPage } from './components/email/EmailPage';
import { CrmPage } from './components/crm/CrmPage';
import { AuthPage } from './components/AuthPage';
import { PageTransition } from './components/PageTransition';
import { Brain, X, Send, LogOut, User } from 'lucide-react';
import { useState } from 'react';

type Page = 'dashboard' | 'email' | 'crm' | 'notes' | 'tasks' | 'calendar' | 'voice' | 'knowledge';

function UserProfile() {
  const { user, signOut } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
      {user.avatar ? (
        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
          {user.name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {user.email || user.phone}
        </p>
      </div>
      <button
        onClick={signOut}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors button-press"
        title="Sign out"
      >
        <LogOut size={16} className="text-gray-500 dark:text-gray-400" />
      </button>
    </div>
  );
}

function AIAssistant() {
  const { aiAssistantOpen, toggleAiAssistant } = useApp();
  
  if (!aiAssistantOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 fade-enter">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] scale-enter">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
              <Brain size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Your intelligent productivity partner</p>
            </div>
          </div>
          <button
            onClick={toggleAiAssistant}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors button-press"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-start gap-3 stagger-item">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
              <Brain size={16} className="text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
              <p className="text-gray-900 dark:text-white">
                Hello! I'm your AI assistant. I can help you with:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Summarizing meetings and notes</li>
                <li>• Creating tasks from conversations</li>
                <li>• Finding information across your workspace</li>
                <li>• Planning your schedule efficiently</li>
                <li>• Generating action items</li>
              </ul>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Try asking: "Summarize today's meetings" or "What tasks are overdue?"
              </p>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
            />
            <button className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all button-press">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MainContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'email':
        return <EmailPage />;
      case 'crm':
        return <CrmPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar onPageChange={setCurrentPage} currentPage={currentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} />
        <main className="flex-1 overflow-hidden">
          <PageTransition currentPage={currentPage}>
            {renderPage()}
          </PageTransition>
        </main>
      </div>
      <AIAssistant />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
