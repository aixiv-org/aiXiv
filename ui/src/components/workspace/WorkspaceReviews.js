import React, { useState } from 'react';
import { Clock, FileText, Star, MessageSquare, ChevronRight } from 'lucide-react';

const WorkspaceReviews = () => {
  const [activeTab, setActiveTab] = useState('assigned');

  const reviews = {
    assigned: [
      {
        id: 'REV-2024-001',
        paper: 'Deep Learning Approaches for Climate Modeling',
        submissionId: 'SUB-2024-445',
        deadline: '2024-01-20',
        daysLeft: 3,
        complexity: 'high',
        domain: 'Machine Learning',
      },
      {
        id: 'REV-2024-002',
        paper: 'Quantum Algorithms for Optimization Problems',
        submissionId: 'SUB-2024-512',
        deadline: '2024-01-25',
        daysLeft: 8,
        complexity: 'medium',
        domain: 'Quantum Computing',
      },
    ],
    drafted: [
      {
        id: 'REV-2024-003',
        paper: 'Federated Learning in Healthcare Applications',
        submissionId: 'SUB-2024-387',
        deadline: '2024-01-18',
        daysLeft: 1,
        progress: 75,
        domain: 'Healthcare AI',
      },
    ],
    submitted: [
      {
        id: 'REV-2024-004',
        paper: 'Neural Architecture Search for Mobile Devices',
        submissionId: 'SUB-2024-298',
        submittedDate: '2024-01-10',
        turnaroundTime: '7 days',
        rating: 4.2,
        domain: 'Mobile AI',
      },
      {
        id: 'REV-2024-005',
        paper: 'Attention Mechanisms in Computer Vision',
        submissionId: 'SUB-2024-234',
        submittedDate: '2024-01-05',
        turnaroundTime: '5 days',
        rating: 4.7,
        domain: 'Computer Vision',
      },
    ],
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const renderAssignedReviews = () => (
    <div className="space-y-4">
      {reviews.assigned.map((review) => (
        <div key={review.id} className="card p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">{review.id}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getComplexityColor(review.complexity)}`}>
                  {review.complexity} complexity
                </span>
                <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {review.domain}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {review.paper}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Submission: {review.submissionId}
              </p>

              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className={`${review.daysLeft <= 3 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {review.daysLeft} days left
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600 dark:text-gray-400">Due {review.deadline}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-6">
              <button className="btn-secondary text-sm">
                View Paper
              </button>
              <button className="btn-primary text-sm">
                Start Review
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDraftedReviews = () => (
    <div className="space-y-4">
      {reviews.drafted.map((review) => (
        <div key={review.id} className="card p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">{review.id}</span>
                <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {review.domain}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {review.paper}
              </h3>
              
              <div className="flex items-center space-x-4 text-sm mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className={`${review.daysLeft <= 1 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {review.daysLeft} day left
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600 dark:text-gray-400">{review.progress}% complete</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${review.progress}%` }}
                />
              </div>

              {/* Quick Form Elements */}
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <label className="block text-gray-500 dark:text-gray-400 mb-1">Novelty</label>
                  <input type="range" min="1" max="5" defaultValue="4" className="w-full" />
                </div>
                <div>
                  <label className="block text-gray-500 dark:text-gray-400 mb-1">Clarity</label>
                  <input type="range" min="1" max="5" defaultValue="3" className="w-full" />
                </div>
                <div>
                  <label className="block text-gray-500 dark:text-gray-400 mb-1">Significance</label>
                  <input type="range" min="1" max="5" defaultValue="4" className="w-full" />
                </div>
                <div>
                  <label className="block text-gray-500 dark:text-gray-400 mb-1">Technical</label>
                  <input type="range" min="1" max="5" defaultValue="4" className="w-full" />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-6">
              <button className="btn-secondary text-sm">
                Save Draft
              </button>
              <button className="btn-primary text-sm">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSubmittedReviews = () => (
    <div className="space-y-4">
      {reviews.submitted.map((review) => (
        <div key={review.id} className="card p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">{review.id}</span>
                <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Completed
                </span>
                <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {review.domain}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {review.paper}
              </h3>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span>Submitted: {review.submittedDate}</span>
                <span>•</span>
                <span>Turnaround: {review.turnaroundTime}</span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{review.rating}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">reviewer rating</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-6">
              <button className="btn-secondary text-sm">
                View Review
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reviews</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your peer review assignments and submissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Turnaround</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">5.2 days</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reviews Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">47</p>
            </div>
            <FileText className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">4.3</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'assigned', label: 'Assigned', count: reviews.assigned.length },
            { id: 'drafted', label: 'Drafted', count: reviews.drafted.length },
            { id: 'submitted', label: 'Submitted', count: reviews.submitted.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'assigned' && renderAssignedReviews()}
        {activeTab === 'drafted' && renderDraftedReviews()}
        {activeTab === 'submitted' && renderSubmittedReviews()}
      </div>

      {/* Empty State */}
      {reviews[activeTab].length === 0 && (
        <div className="card p-12 text-center">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No {activeTab} reviews
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {activeTab === 'assigned' && "You don't have any review assignments at the moment."}
            {activeTab === 'drafted' && "No reviews in progress."}
            {activeTab === 'submitted' && "No completed reviews yet."}
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkspaceReviews;
