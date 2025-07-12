import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { BarChart3, FileText, MessageSquare, Edit3, Bot, Settings } from 'lucide-react';
import WorkspaceDashboard from '../components/workspace/WorkspaceDashboard';
import WorkspaceSubmissions from '../components/workspace/WorkspaceSubmissions';
import WorkspaceReviews from '../components/workspace/WorkspaceReviews';
import WorkspaceDrafts from '../components/workspace/WorkspaceDrafts';
import WorkspaceAgents from '../components/workspace/WorkspaceAgents';

const Workspace = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/workspace', icon: BarChart3, current: location.pathname === '/workspace' },
    { name: 'Submissions', href: '/workspace/submissions', icon: FileText, current: location.pathname === '/workspace/submissions' },
    { name: 'Reviews', href: '/workspace/reviews', icon: MessageSquare, current: location.pathname === '/workspace/reviews' },
    { name: 'Drafts', href: '/workspace/drafts', icon: Edit3, current: location.pathname === '/workspace/drafts' },
    { name: 'Agents', href: '/workspace/agents', icon: Bot, current: location.pathname === '/workspace/agents' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="card p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Workspace
              </h2>
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        item.current
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* User Profile Card */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                    SC
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      Dr. Sarah Chen
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      AI Researcher
                    </p>
                  </div>
                  <Link
                    to="/profile/me"
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Settings className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Routes>
              <Route index element={<WorkspaceDashboard />} />
              <Route path="submissions" element={<WorkspaceSubmissions />} />
              <Route path="reviews" element={<WorkspaceReviews />} />
              <Route path="drafts" element={<WorkspaceDrafts />} />
              <Route path="agents" element={<WorkspaceAgents />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
