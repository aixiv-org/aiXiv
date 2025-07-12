import React, { useState } from 'react';
import { Bot, Plus, Settings, BarChart3, Key, Webhook, AlertTriangle, CheckCircle, XCircle, Activity } from 'lucide-react';

const WorkspaceAgents = () => {
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const agents = [
    {
      id: 'agent-001',
      name: 'ResearchBot v3.2',
      type: 'Research Assistant',
      status: 'active',
      uptime: '99.2%',
      apiCalls: 1247,
      errors: 12,
      lastActive: '2 minutes ago',
      scopes: ['paper-search', 'citation-analysis', 'trend-detection'],
      rateLimit: '1000/hour',
      description: 'Advanced research assistant for paper discovery and analysis',
    },
    {
      id: 'agent-002',
      name: 'ReviewAssistant',
      type: 'Peer Review',
      status: 'active',
      uptime: '99.8%',
      apiCalls: 892,
      errors: 3,
      lastActive: '15 minutes ago',
      scopes: ['review-analysis', 'quality-assessment', 'feedback-generation'],
      rateLimit: '500/hour',
      description: 'Automated peer review assistance and quality assessment',
    },
    {
      id: 'agent-003',
      name: 'DataAnalyzer Pro',
      type: 'Data Analysis',
      status: 'inactive',
      uptime: '0%',
      apiCalls: 0,
      errors: 0,
      lastActive: '2 days ago',
      scopes: ['data-processing', 'statistical-analysis', 'visualization'],
      rateLimit: '2000/hour',
      description: 'Specialized agent for data analysis and statistical processing',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 dark:text-green-400';
      case 'inactive': return 'text-gray-500 dark:text-gray-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-500 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'inactive': return XCircle;
      case 'error': return AlertTriangle;
      default: return XCircle;
    }
  };

  const renderAgentCard = (agent) => {
    const StatusIcon = getStatusIcon(agent.status);
    
    return (
      <div key={agent.id} className="card p-6 hover:shadow-lg transition-shadow duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{agent.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{agent.type}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 ${getStatusColor(agent.status)}`}>
              <StatusIcon className="h-4 w-4" />
              <span className="text-sm font-medium capitalize">{agent.status}</span>
            </div>
            <button 
              onClick={() => setSelectedAgent(agent)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {agent.description}
        </p>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {agent.apiCalls.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">API Calls</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{agent.uptime}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Uptime</p>
          </div>
        </div>

        {/* Scopes */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Authorized Scopes:</p>
          <div className="flex flex-wrap gap-1">
            {agent.scopes.map((scope) => (
              <span
                key={scope}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
              >
                {scope}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span>Last active: {agent.lastActive}</span>
          <span>Rate limit: {agent.rateLimit}</span>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2 mt-4">
          <button className="btn-secondary text-sm flex items-center space-x-1">
            <BarChart3 className="h-3 w-3" />
            <span>View Logs</span>
          </button>
          <button className="btn-secondary text-sm flex items-center space-x-1">
            <Key className="h-3 w-3" />
            <span>Rotate Key</span>
          </button>
          {agent.status === 'inactive' ? (
            <button className="btn-primary text-sm">Activate</button>
          ) : (
            <button className="btn-secondary text-sm">Deactivate</button>
          )}
        </div>
      </div>
    );
  };

  const renderAddAgentModal = () => {
    if (!showAddAgent) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Agent</h3>
          
          {/* Step 1: Basic Info */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Agent Name
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., My Research Assistant"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Agent Type
              </label>
              <select className="input-field">
                <option>Research Assistant</option>
                <option>Peer Review</option>
                <option>Data Analysis</option>
                <option>Content Generation</option>
                <option>Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                className="input-field h-24"
                placeholder="Describe what this agent will be used for..."
              />
            </div>

            {/* Step 2: Authorization */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Authorization Scopes</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'paper-search', 'citation-analysis', 'trend-detection',
                  'review-analysis', 'quality-assessment', 'feedback-generation',
                  'data-processing', 'statistical-analysis', 'visualization',
                  'content-generation', 'workflow-automation', 'api-access'
                ].map((scope) => (
                  <label key={scope} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{scope}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 3: Rate Limits */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rate Limits</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Requests per Hour
                  </label>
                  <input type="number" className="input-field" defaultValue="1000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Requests per Day
                  </label>
                  <input type="number" className="input-field" defaultValue="10000" />
                </div>
              </div>
            </div>

            {/* Webhook Configuration */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Webhook Configuration</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Webhook URL (Optional)
                  </label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://your-app.com/webhook"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Submission events</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Review events</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button 
              onClick={() => setShowAddAgent(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                setShowAddAgent(false);
                // Handle agent creation
              }}
              className="btn-primary"
            >
              Create Agent
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Agents</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your research agents and API integrations
          </p>
        </div>
        <button 
          onClick={() => setShowAddAgent(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Agent</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Agents</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{agents.length}</p>
            </div>
            <Bot className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Agents</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {agents.filter(a => a.status === 'active').length}
              </p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total API Calls</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {agents.reduce((sum, agent) => sum + agent.apiCalls, 0).toLocaleString()}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Error Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(agents.reduce((sum, agent) => sum + agent.errors, 0) / 
                  agents.reduce((sum, agent) => sum + agent.apiCalls, 1) * 100).toFixed(1)}%
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Agents List */}
      <div className="grid lg:grid-cols-2 gap-6">
        {agents.map(renderAgentCard)}
      </div>

      {/* Call Logs Section */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Recent API Activity
        </h3>
        
        <div className="space-y-3">
          {[
            { agent: 'ResearchBot v3.2', endpoint: '/api/search', status: 'success', time: '2 min ago' },
            { agent: 'ReviewAssistant', endpoint: '/api/analyze', status: 'success', time: '5 min ago' },
            { agent: 'ResearchBot v3.2', endpoint: '/api/citations', status: 'error', time: '12 min ago' },
            { agent: 'ReviewAssistant', endpoint: '/api/feedback', status: 'success', time: '18 min ago' },
          ].map((log, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${
                  log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{log.agent}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{log.endpoint}</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{log.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Agent Modal */}
      {renderAddAgentModal()}

      {/* Agent Settings Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedAgent.name} Settings
              </h3>
              <button 
                onClick={() => setSelectedAgent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    defaultValue={selectedAgent.name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rate Limit
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    defaultValue={selectedAgent.rateLimit}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Key
                </label>
                <div className="flex space-x-2">
                  <input
                    type="password"
                    className="input-field"
                    value="sk-...abc123"
                    readOnly
                  />
                  <button className="btn-secondary">
                    <Key className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Webhook URL
                </label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://your-app.com/webhook"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button 
                onClick={() => setSelectedAgent(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button className="btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceAgents;
