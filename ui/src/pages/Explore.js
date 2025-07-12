import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, BookmarkPlus, Eye, Download, MessageCircle, Star, ChevronDown, X } from 'lucide-react';
import SearchFilters from '../components/SearchFilters';
import ContextPanel from '../components/ContextPanel';

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [showContextPanel, setShowContextPanel] = useState(true);
  const [savedSearches, setSavedSearches] = useState([]);

  const currentQuery = searchParams.get('q') || '';
  const currentType = searchParams.get('type') || 'all';

  const mockResults = [
    {
      id: '1',
      title: 'Attention Is All You Need: Transformer Architecture for NLP',
      authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar'],
      abstract: 'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
      type: 'paper',
      status: 'published',
      category: 'Machine Learning',
      date: '2023-12-15',
      metrics: { views: 15420, downloads: 3280, comments: 45 },
      isAI: false,
      badges: ['peer-reviewed'],
    },
    {
      id: '2',
      title: 'Automated Scientific Discovery Through AI Agents',
      authors: ['ResearchBot v3.2', 'Dr. Emily Chen'],
      abstract: 'This proposal outlines a framework for autonomous scientific discovery using large language models and specialized research agents.',
      type: 'proposal',
      status: 'under-review',
      category: 'AI Research',
      date: '2024-01-08',
      metrics: { views: 8900, downloads: 1200, comments: 23 },
      isAI: true,
      badges: ['ai-authored', 'collaborative'],
    },
    {
      id: '3',
      title: 'Quantum Machine Learning: A Survey of Recent Advances',
      authors: ['Prof. Michael Zhang', 'Dr. Sarah Kim'],
      abstract: 'We present a comprehensive survey of quantum machine learning algorithms and their applications in various domains.',
      type: 'paper',
      status: 'published',
      category: 'Quantum Computing',
      date: '2024-01-05',
      metrics: { views: 6700, downloads: 1800, comments: 31 },
      isAI: false,
      badges: ['survey', 'peer-reviewed'],
    },
  ];

  const handleSaveSearch = () => {
    const searchName = prompt('Name this search:');
    if (searchName) {
      setSavedSearches([...savedSearches, {
        id: Date.now(),
        name: searchName,
        query: currentQuery,
        filters: { type: currentType },
        date: new Date().toISOString(),
      }]);
    }
  };

  const renderResultCard = (result) => (
    <div key={result.id} className="card p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
            result.type === 'proposal' 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          }`}>
            {result.type.toUpperCase()}
          </span>
          
          {result.isAI && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              AI
            </span>
          )}
          
          {result.badges.map((badge) => (
            <span key={badge} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {badge}
            </span>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <BookmarkPlus className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <Star className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600 cursor-pointer">
        {result.title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
        {result.authors.map((author, index) => (
          <span key={index} className="hover:text-primary-600 cursor-pointer">
            {author}{index < result.authors.length - 1 ? ', ' : ''}
          </span>
        ))}
      </p>
      
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
        {result.abstract}
      </p>

      {/* Metadata */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span>{result.category} • {result.date}</span>
        <span className={`px-2 py-1 rounded text-xs ${
          result.status === 'published' 
            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
        }`}>
          {result.status}
        </span>
      </div>

      {/* Metrics & Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {result.metrics.views.toLocaleString()}
          </span>
          <span className="flex items-center">
            <Download className="h-4 w-4 mr-1" />
            {result.metrics.downloads.toLocaleString()}
          </span>
          <span className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-1" />
            {result.metrics.comments}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button className="btn-secondary text-xs py-1 px-3">
            PDF
          </button>
          <button className="btn-primary text-xs py-1 px-3">
            View
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explore</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Discover papers, proposals, and research insights
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSaveSearch}
              className="btn-secondary flex items-center space-x-2"
            >
              <Star className="h-4 w-4" />
              <span>Save Search</span>
            </button>
            
            <button
              onClick={() => setShowContextPanel(!showContextPanel)}
              className="btn-secondary"
            >
              Context Panel
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search papers, proposals, authors..."
                defaultValue={currentQuery}
                className="input-field pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Layout */}
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-64 flex-shrink-0">
              <SearchFilters />
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Found {mockResults.length} results
                {currentQuery && ` for "${currentQuery}"`}
              </p>
              
              <select className="input-field w-48">
                <option>Relevance</option>
                <option>Newest First</option>
                <option>Most Viewed</option>
                <option>Most Downloaded</option>
                <option>Most Discussed</option>
              </select>
            </div>

            <div className="space-y-6">
              {mockResults.map(renderResultCard)}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2">
                <button className="btn-secondary px-3 py-2">Previous</button>
                <button className="bg-primary-600 text-white px-3 py-2 rounded">1</button>
                <button className="btn-secondary px-3 py-2">2</button>
                <button className="btn-secondary px-3 py-2">3</button>
                <button className="btn-secondary px-3 py-2">Next</button>
              </div>
            </div>
          </div>

          {/* Context Panel */}
          {showContextPanel && (
            <div className="w-80 flex-shrink-0">
              <ContextPanel query={currentQuery} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
