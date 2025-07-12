import React, { useState } from 'react';
import { Filter, Eye, Edit, Trash2, BarChart3, Upload, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

const WorkspaceSubmissions = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const submissions = [
    {
      id: 'SUB-2024-001',
      title: 'Neural Architecture Search for Efficient Transformer Models',
      type: 'paper',
      status: 'published',
      date: '2024-01-15',
      views: 1247,
      downloads: 892,
      comments: 23,
      version: '1.2',
    },
    {
      id: 'SUB-2024-002', 
      title: 'Federated Learning Framework for Privacy-Preserving AI',
      type: 'paper',
      status: 'under-review',
      date: '2024-01-10',
      views: 456,
      downloads: 123,
      comments: 8,
      version: '1.0',
    },
    {
      id: 'SUB-2024-003',
      title: 'Proposal: Automated Scientific Discovery Through AI Agents',
      type: 'proposal',
      status: 'revision-needed',
      date: '2024-01-08',
      views: 789,
      downloads: 234,
      comments: 15,
      version: '1.1',
    },
    {
      id: 'SUB-2024-004',
      title: 'Quantum Machine Learning Applications in Drug Discovery',
      type: 'paper',
      status: 'draft',
      date: '2024-01-05',
      views: 0,
      downloads: 0,
      comments: 0,
      version: '0.1',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'under-review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'revision-needed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published': return CheckCircle;
      case 'under-review': return Clock;
      case 'revision-needed': return XCircle;
      case 'draft': return Edit;
      default: return FileText;
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (filterType !== 'all' && submission.type !== filterType) return false;
    if (filterStatus !== 'all' && submission.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Submissions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your papers, proposals, and drafts
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Upload className="h-4 w-4" />
          <span>New Submission</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
          </div>
          
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field w-40"
          >
            <option value="all">All Types</option>
            <option value="paper">Papers</option>
            <option value="proposal">Proposals</option>
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field w-40"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="under-review">Under Review</option>
            <option value="revision-needed">Revision Needed</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((submission) => {
          const StatusIcon = getStatusIcon(submission.status);
          
          return (
            <div key={submission.id} className="card p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      submission.type === 'paper' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {submission.type.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {submission.id}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      v{submission.version}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600 cursor-pointer">
                    {submission.title}
                  </h3>

                  {/* Metadata */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>Submitted {submission.date}</span>
                    {submission.status !== 'draft' && (
                      <>
                        <span>•</span>
                        <span>{submission.views} views</span>
                        <span>•</span>
                        <span>{submission.downloads} downloads</span>
                        <span>•</span>
                        <span>{submission.comments} comments</span>
                      </>
                    )}
                  </div>

                  {/* Status Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                    <div 
                      className={`h-2 rounded-full ${
                        submission.status === 'published' ? 'bg-green-500 w-full' :
                        submission.status === 'under-review' ? 'bg-yellow-500 w-3/4' :
                        submission.status === 'revision-needed' ? 'bg-red-500 w-1/2' :
                        'bg-gray-400 w-1/4'
                      }`}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-6">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(submission.status)}`}>
                    <StatusIcon className="h-4 w-4" />
                    <span className="capitalize">{submission.status.replace('-', ' ')}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    {submission.status === 'revision-needed' && (
                      <button className="p-2 text-primary-600 hover:text-primary-700 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      <BarChart3 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredSubmissions.length === 0 && (
        <div className="card p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No submissions found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Try adjusting your filters or create your first submission.
          </p>
          <button className="btn-primary">
            Create New Submission
          </button>
        </div>
      )}

      {/* Floating Start Revision Button */}
      {filteredSubmissions.some(s => s.status === 'revision-needed') && (
        <div className="fixed bottom-8 right-8">
          <button className="bg-accent-600 hover:bg-accent-700 text-white rounded-full p-4 shadow-lg transition-colors duration-200 flex items-center space-x-2">
            <Edit className="h-5 w-5" />
            <span className="hidden md:inline">Start Revision</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkspaceSubmissions;
