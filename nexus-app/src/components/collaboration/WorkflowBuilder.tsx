import React, { useState } from 'react';

interface WorkflowBuilderProps {
  onSave?: (workflow: any) => void;
  onCancel?: () => void;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState<'event' | 'schedule' | 'webhook'>('event');
  const [eventType, setEventType] = useState('note_created');
  const [actions, setActions] = useState<any[]>([]);
  const [conditions, setConditions] = useState<any[]>([]);

  const triggerOptions = [
    { value: 'note_created', label: 'Note Created' },
    { value: 'task_completed', label: 'Task Completed' },
    { value: 'email_received', label: 'Email Received' },
    { value: 'meeting_ended', label: 'Meeting Ended' },
    { value: 'lead_added', label: 'New Lead Added' },
    { value: 'deal_won', label: 'Deal Won' },
  ];

  const actionTypes = [
    { value: 'create_task', label: 'Create Task', icon: '✅' },
    { value: 'send_email', label: 'Send Email', icon: '📧' },
    { value: 'ai_summarize', label: 'AI Summarize', icon: '🤖' },
    { value: 'slack_notify', label: 'Slack Notification', icon: '💬' },
    { value: 'update_crm', label: 'Update CRM', icon: '📊' },
    { value: 'create_note', label: 'Create Note', icon: '📝' },
  ];

  const addAction = (type: string) => {
    setActions([
      ...actions,
      { id: `action-${Date.now()}`, type, config: {}, order: actions.length },
    ]);
  };

  const removeAction = (id: string) => {
    setActions(actions.filter((a) => a.id !== id));
  };

  const handleSave = () => {
    const workflow = {
      name,
      description,
      trigger: {
        type: triggerType,
        eventType: triggerType === 'event' ? eventType : undefined,
        cronExpression: triggerType === 'schedule' ? '0 9 * * 1' : undefined,
      },
      actions,
      conditions,
    };
    onSave?.(workflow);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Create Automation Workflow
      </h2>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Workflow Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., New Lead Follow-up"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of what this workflow does"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
          />
        </div>
      </div>

      {/* Trigger Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <span className="text-lg">⚡</span>
          </div>
          <h3 className="font-semibold text-lg">Trigger</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Trigger Type
            </label>
            <select
              value={triggerType}
              onChange={(e) => setTriggerType(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
            >
              <option value="event">Event</option>
              <option value="schedule">Schedule</option>
              <option value="webhook">Webhook</option>
            </select>
          </div>

          {triggerType === 'event' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
              >
                {triggerOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {triggerType === 'schedule' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cron Expression
              </label>
              <input
                type="text"
                placeholder="0 9 * * 1 (Every Monday at 9 AM)"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
              />
            </div>
          )}
        </div>
      </div>

      {/* Actions Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <span className="text-lg">🎯</span>
            </div>
            <h3 className="font-semibold text-lg">Actions</h3>
          </div>
          <span className="text-sm text-gray-500">{actions.length} actions configured</span>
        </div>

        {/* Action List */}
        {actions.length > 0 ? (
          <div className="space-y-3 mb-4">
            {actions.map((action, index) => {
              const actionType = actionTypes.find((t) => t.value === action.type);
              return (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <span className="text-xl">{actionType?.icon}</span>
                    <span className="font-medium">{actionType?.label}</span>
                  </div>
                  <button
                    onClick={() => removeAction(action.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            No actions added yet. Select an action type below to get started.
          </p>
        )}

        {/* Add Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {actionTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => addAction(type.value)}
              className="flex flex-col items-center gap-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-2xl">{type.icon}</span>
              <span className="text-xs font-medium text-center">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conditions Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-lg">🔀</span>
          </div>
          <h3 className="font-semibold text-lg">Conditions (Optional)</h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add conditions to control when this workflow should run.
        </p>
      </div>

      {/* Preview */}
      {name && actions.length > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2">Preview</h4>
          <p className="text-sm text-indigo-700 dark:text-indigo-400">
            When <strong>{triggerOptions.find((o) => o.value === eventType)?.label}</strong> occurs,{' '}
            {actions.length} action{actions.length > 1 ? 's' : ''} will be executed:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-indigo-700 dark:text-indigo-400">
            {actions.map((action, i) => {
              const actionType = actionTypes.find((t) => t.value === action.type);
              return (
                <li key={action.id}>
                  {i + 1}. {actionType?.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={!name || actions.length === 0}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Save Workflow
        </button>
      </div>
    </div>
  );
};
