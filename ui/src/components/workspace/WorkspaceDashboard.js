import React, { useState, useEffect } from 'react';
import { TrendingUp, FileText, MessageSquare, Clock } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const WorkspaceDashboard = () => {
  const { user } = useUser();
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

  // Calculate KPIs from real data
  const calculateKPIs = () => {
    if (!submissions.length) return [];
    
    const totalSubmissions = submissions.length;
    const pendingReviews = submissions.filter(s => s.status?.toLowerCase() === 'under review').length;
    const published = submissions.filter(s => s.status?.toLowerCase() === 'published').length;
    const acceptanceRate = totalSubmissions > 0 ? Math.round((published / totalSubmissions) * 100) : 0;
    
    return [
      { 
        title: 'Total Submissions', 
        value: totalSubmissions.toString(), 
        change: `Last updated: ${new Date().toLocaleDateString()}`, 
        icon: FileText, 
        color: 'blue' 
      },
      { 
        title: 'Pending Reviews', 
        value: pendingReviews.toString(), 
        change: `Currently under review`, 
        icon: MessageSquare, 
        color: 'yellow' 
      },
      { 
        title: 'Acceptance Rate', 
        value: `${acceptanceRate}%`, 
        change: `${published} of ${totalSubmissions} published`, 
        icon: TrendingUp, 
        color: 'green' 
      },
      { 
        title: 'Active Submissions', 
        value: pendingReviews.toString(), 
        change: `In review process`, 
        icon: Clock, 
        color: 'purple' 
      },
    ];
  };

  // Generate recent activity from submissions
  const generateRecentActivity = () => {
    if (!submissions.length) return [];
    
    return submissions
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
      .map(submission => ({
        type: 'submission',
        title: submission.title,
        status: submission.status,
        time: getTimeAgo(submission.created_at),
        color: submission.status?.toLowerCase() === 'published' ? 'green' : 'blue',
        aixiv_id: submission.aixiv_id,
        doc_type: submission.doc_type
      }));
  };

  // Helper function to calculate time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return '1 day ago';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return `${Math.floor(diffInHours / 168)} weeks ago`;
  };

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
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="card p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="text-center">
            <p className="text-red-800 dark:text-red-200">Error loading dashboard data: {error}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {calculateKPIs().map((kpi) => {
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
      )}

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-3">
                <div className="animate-pulse">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400">Error loading recent activity</p>
          </div>
        ) : generateRecentActivity().length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {generateRecentActivity().map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.color === 'blue' ? 'bg-blue-500' :
                  activity.color === 'green' ? 'bg-green-500' :
                  'bg-purple-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <span className="text-xs text-gray-400 dark:text-gray-500">({activity.doc_type})</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.aixiv_id} • {activity.time}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  activity.status?.toLowerCase() === 'published'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>


    </div>
  );
};

export default WorkspaceDashboard;
