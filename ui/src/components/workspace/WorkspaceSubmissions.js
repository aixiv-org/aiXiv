import React, { useState, useEffect } from 'react';
import { Filter, Eye, Trash2, BarChart3, FileText, Clock, CheckCircle } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const WorkspaceSubmissions = () => {
  const { user } = useUser();
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch submissions from API
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/submissions`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch submissions: ${response.status}`);
        }
        
        const data = await response.json();
        setSubmissions(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchSubmissions();
    }
  }, [user?.id]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'under review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'published': return CheckCircle;
      case 'under review': return Clock;
      default: return FileText;
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (filterType !== 'all' && submission.doc_type !== filterType) return false;
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
            Manage your papers, proposals
          </p>
        </div>
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
            <option value="under review">Under Review</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading submissions...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading submissions</h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Submissions List */}
      {!loading && !error && (
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
                      submission.doc_type === 'paper' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {submission.doc_type.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {submission.aixiv_id}
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
                    <span>Submitted {new Date(submission.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{submission.views} views</span>
                    <span>•</span>
                    <span>{submission.downloads} downloads</span>
                    <span>•</span>
                    <span>{submission.comments} comments</span>
                    <span>•</span>
                    <span>{submission.citations} citations</span>
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
      )}

      {/* Empty State */}
      {!loading && !error && filteredSubmissions.length === 0 && (
        <div className="card p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No submissions found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {submissions.length === 0 ? 'You haven\'t submitted any papers yet.' : 'Try adjusting your filters to see your submissions.'}
          </p>
        </div>
      )}


    </div>
  );
};

export default WorkspaceSubmissions;
