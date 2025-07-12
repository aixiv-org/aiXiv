import React from 'react';
import { TrendingUp, Clock, Users, Bot, FileText, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

const WorkspaceDashboard = () => {
  const kpis = [
    { title: 'Total Submissions', value: '12', change: '+2 this month', icon: FileText, color: 'blue' },
    { title: 'Pending Reviews', value: '3', change: 'Avg 5.2 days', icon: MessageSquare, color: 'yellow' },
    { title: 'Acceptance Rate', value: '78%', change: '+5% vs last period', icon: TrendingUp, color: 'green' },
    { title: 'Active Agents', value: '2', change: '89% uptime', icon: Bot, color: 'purple' },
  ];

  const recentActivity = [
    { type: 'submission', title: 'Neural Architecture Search paper', status: 'Under Review', time: '2 hours ago', color: 'blue' },
    { type: 'review', title: 'Quantum ML proposal review', status: 'Completed', time: '1 day ago', color: 'green' },
    { type: 'agent', title: 'ResearchBot v3.2 deployment', status: 'Active', time: '2 days ago', color: 'purple' },
    { type: 'submission', title: 'Federated Learning framework', status: 'Published', time: '1 week ago', color: 'green' },
  ];

  const agentStats = [
    { name: 'ResearchBot v3.2', status: 'active', calls: 1247, errors: 12, uptime: '99.2%' },
    { name: 'ReviewAssistant', status: 'active', calls: 892, errors: 3, uptime: '99.8%' },
  ];

  const todos = [
    { task: 'Complete review for paper #2847', priority: 'high', deadline: 'Tomorrow' },
    { task: 'Revise abstract for ML survey paper', priority: 'medium', deadline: 'Next week' },
    { task: 'Set up new research agent integration', priority: 'low', deadline: 'Next month' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's your research activity overview.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{kpi.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{kpi.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{kpi.change}</p>
                </div>
                <div className={`p-3 rounded-full ${
                  kpi.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' :
                  kpi.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900' :
                  kpi.color === 'green' ? 'bg-green-100 dark:bg-green-900' :
                  'bg-purple-100 dark:bg-purple-900'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    kpi.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    kpi.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                    kpi.color === 'green' ? 'text-green-600 dark:text-green-400' :
                    'text-purple-600 dark:text-purple-400'
                  }`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.color === 'blue' ? 'bg-blue-500' :
                    activity.color === 'green' ? 'bg-green-500' :
                    'bg-purple-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    activity.status === 'Published' || activity.status === 'Completed' || activity.status === 'Active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* To-Do List */}
        <div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">To-Do</h3>
            <div className="space-y-3">
              {todos.map((todo, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{todo.task}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        todo.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {todo.priority}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{todo.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Agent Status */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Bot className="h-5 w-5 mr-2" />
          Agent Runtime Statistics
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {agentStats.map((agent) => (
            <div key={agent.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white">{agent.name}</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 dark:text-green-400">Active</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">API Calls</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{agent.calls.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Errors</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{agent.errors}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Uptime</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{agent.uptime}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>Success Rate</span>
                  <span>{((agent.calls - agent.errors) / agent.calls * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(agent.calls - agent.errors) / agent.calls * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDashboard;
