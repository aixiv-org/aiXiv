import React, { useState } from 'react';
import { Upload, Edit, Trash2, Cloud, HardDrive, Clock, FileText } from 'lucide-react';

const WorkspaceDrafts = () => {
  const [storageType, setStorageType] = useState('all');

  const drafts = [
    {
      id: 'DRAFT-001',
      title: 'Multimodal Learning for Scientific Document Analysis',
      type: 'paper',
      lastModified: '2024-01-12 14:30',
      storage: 'cloud',
      autoSaved: true,
      wordCount: 2847,
      sections: ['Abstract', 'Introduction', 'Methodology'],
    },
    {
      id: 'DRAFT-002',
      title: 'Proposal: Distributed AI Training Infrastructure',
      type: 'proposal',
      lastModified: '2024-01-11 09:15',
      storage: 'local',
      autoSaved: false,
      wordCount: 1523,
      sections: ['Background', 'Proposed Solution'],
    },
    {
      id: 'DRAFT-003',
      title: 'Review: Recent Advances in Quantum Machine Learning',
      type: 'review',
      lastModified: '2024-01-10 16:45',
      storage: 'cloud',
      autoSaved: true,
      wordCount: 892,
      sections: ['Summary', 'Strengths', 'Weaknesses'],
    },
    {
      id: 'DRAFT-004',
      title: 'Adversarial Robustness in Deep Neural Networks',
      type: 'paper',
      lastModified: '2024-01-09 11:20',
      storage: 'local',
      autoSaved: true,
      wordCount: 4156,
      sections: ['Abstract', 'Introduction', 'Related Work', 'Methodology', 'Experiments'],
    },
  ];

  const filteredDrafts = drafts.filter(draft => {
    if (storageType === 'cloud') return draft.storage === 'cloud';
    if (storageType === 'local') return draft.storage === 'local';
    return true;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case 'paper': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'proposal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'review': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleUploadToCloud = (draftId) => {
    console.log('Uploading draft to cloud:', draftId);
    // Simulate upload
  };

  const handleContinueEditing = (draftId) => {
    console.log('Continue editing draft:', draftId);
    // Navigate to editor
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Drafts & Revisions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your work in progress and locally cached drafts
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Edit className="h-4 w-4" />
          <span>New Draft</span>
        </button>
      </div>

      {/* Storage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Drafts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{drafts.length}</p>
            </div>
            <FileText className="h-8 w-8 text-gray-500" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cloud Storage</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {drafts.filter(d => d.storage === 'cloud').length}
              </p>
            </div>
            <Cloud className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Local Storage</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {drafts.filter(d => d.storage === 'local').length}
              </p>
            </div>
            <HardDrive className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Storage:</span>
          <div className="flex space-x-2">
            {[
              { id: 'all', label: 'All Locations' },
              { id: 'cloud', label: 'Cloud Only' },
              { id: 'local', label: 'Local Only' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setStorageType(option.id)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  storageType === option.id
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Drafts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredDrafts.map((draft) => (
          <div key={draft.id} className="card p-6 hover:shadow-lg transition-shadow duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(draft.type)}`}>
                  {draft.type.toUpperCase()}
                </span>
                <div className="flex items-center space-x-1">
                  {draft.storage === 'cloud' ? (
                    <Cloud className="h-4 w-4 text-blue-500" />
                  ) : (
                    <HardDrive className="h-4 w-4 text-green-500" />
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {draft.storage}
                  </span>
                </div>
                {draft.autoSaved && (
                  <div className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Auto-saved</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => handleContinueEditing(draft.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Edit className="h-4 w-4" />
                </button>
                {draft.storage === 'local' && (
                  <button 
                    onClick={() => handleUploadToCloud(draft.id)}
                    className="p-1 text-blue-400 hover:text-blue-600"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                )}
                <button className="p-1 text-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
              {draft.title}
            </h3>

            {/* Metadata */}
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{draft.lastModified}</span>
              </div>
              <span>•</span>
              <span>{draft.wordCount.toLocaleString()} words</span>
            </div>

            {/* Sections */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sections ({draft.sections.length}):
              </p>
              <div className="flex flex-wrap gap-1">
                {draft.sections.map((section, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
                  >
                    {section}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleContinueEditing(draft.id)}
                className="btn-primary text-sm flex-1"
              >
                Continue Editing
              </button>
              {draft.storage === 'local' ? (
                <button 
                  onClick={() => handleUploadToCloud(draft.id)}
                  className="btn-secondary text-sm"
                >
                  Upload to Cloud
                </button>
              ) : (
                <button className="btn-secondary text-sm">
                  Download
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDrafts.length === 0 && (
        <div className="card p-12 text-center">
          <Edit className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No drafts found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {storageType === 'all' 
              ? "You don't have any drafts yet. Start writing to see them here."
              : `No drafts in ${storageType} storage.`
            }
          </p>
          <button className="btn-primary">
            Create New Draft
          </button>
        </div>
      )}

      {/* Auto-save indicator */}
      <div className="fixed bottom-4 left-4 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>Auto-save enabled</span>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDrafts;
