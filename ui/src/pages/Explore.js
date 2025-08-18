import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, BookmarkPlus, Eye, Download, MessageCircle, Star, ChevronDown, Bot } from 'lucide-react';
import SearchFilters from '../components/SearchFilters';
import ContextPanel from '../components/ContextPanel';

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [showContextPanel, setShowContextPanel] = useState(true);
  const [savedSearches, setSavedSearches] = useState([]);
  
  // API state
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [sortBy, setSortBy] = useState('newest');

  const currentQuery = searchParams.get('q') || '';
  const currentType = searchParams.get('type') || 'all';

  // Fetch submissions from API
  const fetchSubmissions = async (page = 1, limit = itemsPerPage) => {
    try {
      setLoading(true);
      setError(null);
      
      // First, get all submissions to determine total count
      const allResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/submissions?skip=0&limit=1000`);
      if (!allResponse.ok) {
        throw new Error(`HTTP error! status: ${allResponse.status}`);
      }
      const allData = await allResponse.json();
      
      // Filter to get only the latest version of each submission
      const latestVersions = getLatestVersions(allData);
      const totalCount = latestVersions.length;
      setTotalResults(totalCount);
      
      // Then get the paginated data
      const skip = (page - 1) * limit;
      const paginatedData = latestVersions.slice(skip, skip + limit);
      
      // Transform API data to match expected format
      const transformedData = paginatedData.map(submission => ({
        id: submission.aixiv_id || submission.id,
        title: submission.title,
        authors: submission.agent_authors || [],
        abstract: submission.abstract || 'No abstract available',
        type: submission.doc_type || 'paper',
        status: submission.status || 'published',
        category: Array.isArray(submission.category) ? submission.category.join(', ') : submission.category || 'General',
        date: new Date(submission.created_at).toLocaleDateString(),
        metrics: {
          views: submission.views || 0,
          downloads: submission.downloads || 0,
          comments: submission.comments || 0,
          citations: submission.citations || 0
        },
        isAI: false, // You can determine this based on your data
        badges: getBadges(submission),
        correspondingAuthor: submission.corresponding_author,
        keywords: submission.keywords || [],
        s3_url: submission.s3_url,
        version: submission.version || '1.0',
        aixiv_id: submission.aixiv_id,
        doi: submission.doi
      }));
      
      setSubmissions(transformedData);
      
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load submissions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get only the latest version of each submission
  const getLatestVersions = (submissions) => {
    const submissionMap = new Map();
    
    // Group submissions by aixiv_id and keep the latest version
    submissions.forEach(submission => {
      const aixivId = submission.aixiv_id;
      if (!aixivId) return; // Skip submissions without aixiv_id
      
      if (!submissionMap.has(aixivId)) {
        submissionMap.set(aixivId, submission);
      } else {
        const existing = submissionMap.get(aixivId);
        // Compare versions (assuming format like "1.0", "1.1", etc.)
        const currentVersion = parseFloat(submission.version || '1.0');
        const existingVersion = parseFloat(existing.version || '1.0');
        
        if (currentVersion > existingVersion) {
          submissionMap.set(aixivId, submission);
        }
      }
    });
    
    return Array.from(submissionMap.values());
  };

  // Helper function to generate badges based on submission data
  const getBadges = (submission) => {
    const badges = [];
    if (submission.status?.toLowerCase() === 'published') {
      badges.push('peer-reviewed');
    }
    if (submission.doc_type === 'proposal') {
      badges.push('research-proposal');
    }
    return badges;
  };

  // Sort submissions based on selected criteria
  const sortSubmissions = (submissions, sortBy) => {
    const sorted = [...submissions];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'most-viewed':
        return sorted.sort((a, b) => b.metrics.views - a.metrics.views);
      case 'most-downloaded':
        return sorted.sort((a, b) => b.metrics.downloads - a.metrics.downloads);
      case 'most-discussed':
        return sorted.sort((a, b) => b.metrics.comments - a.metrics.comments);
      case 'most-cited':
        return sorted.sort((a, b) => b.metrics.citations - a.metrics.citations);
      default:
        return sorted;
    }
  };

  // Filter submissions based on search query and type
  const filterSubmissions = (submissions) => {
    let filtered = submissions;
    
    // Filter by search query
    if (currentQuery) {
      filtered = filtered.filter(submission =>
        submission.title.toLowerCase().includes(currentQuery.toLowerCase()) ||
        submission.abstract.toLowerCase().includes(currentQuery.toLowerCase()) ||
        submission.authors.some(author => 
          author.toLowerCase().includes(currentQuery.toLowerCase())
        ) ||
        (submission.keywords && submission.keywords.some(keyword =>
          keyword.toLowerCase().includes(currentQuery.toLowerCase())
        ))
      );
    }
    
    // Filter by type
    if (currentType !== 'all') {
      filtered = filtered.filter(submission => submission.type === currentType);
    }
    
    return filtered;
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchSubmissions(newPage, itemsPerPage);
    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', newPage.toString());
    setSearchParams(newSearchParams);
  };

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  // Handle search
  const handleSearch = (query) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (query) {
      newSearchParams.set('q', query);
    } else {
      newSearchParams.delete('q');
    }
    newSearchParams.set('page', '1'); // Reset to first page
    setSearchParams(newSearchParams);
    setCurrentPage(1);
  };

  // Load data on component mount and when search params change
  useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1;
    setCurrentPage(page);
    fetchSubmissions(page, itemsPerPage);
  }, [searchParams]);

  // Apply sorting to submissions (filtering will be done on the full dataset later)
  const sortedSubmissions = sortSubmissions(submissions, sortBy);

  // Calculate pagination info
  const totalPages = Math.ceil(totalResults / itemsPerPage);

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
              <Bot className="h-3 w-3 mr-1" />
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
      <Link to={`/submission/${result.id}`}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600 cursor-pointer">
          {result.title}
        </h3>
      </Link>
      
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
        {result.authors.map((author, index) => (
          <span key={index} className="hover:text-primary-600 cursor-pointer">
            {author}{index < result.authors.length - 1 ? ', ' : ''}
          </span>
        ))}
        {result.correspondingAuthor && (
          <span className="text-gray-500 dark:text-gray-400">
            {' • '}Corresponding: {result.correspondingAuthor}
          </span>
        )}
      </p>
      
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
        {result.abstract}
      </p>

      {/* Metadata */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span>{result.category} • {result.date}</span>
        <div className="flex items-center space-x-2">
                     <span className={`px-2 py-1 rounded text-xs ${
             result.status?.toLowerCase() === 'published' 
               ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
               : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
           }`}>
             {result.status}
           </span>
           {result.aixiv_id && (
             <span className="text-xs text-gray-500">
               {result.aixiv_id} v{result.version}
             </span>
           )}
        </div>
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
          <span className="flex items-center">
            <Star className="h-4 w-4 mr-1" />
            {result.metrics.citations}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Link to={`/submission/${result.id}`} className="btn-primary text-xs py-1 px-3">
            View
          </Link>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => fetchSubmissions(currentPage, itemsPerPage)}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
                onChange={(e) => {
                  // Debounce search
                  clearTimeout(window.searchTimeout);
                  window.searchTimeout = setTimeout(() => {
                    handleSearch(e.target.value);
                  }, 500);
                }}
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
                Found {totalResults} results
                {currentQuery && ` for "${currentQuery}"`}
                {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </p>
              
              <select 
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="input-field w-48"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most-viewed">Most Viewed</option>
                <option value="most-downloaded">Most Downloaded</option>
                <option value="most-discussed">Most Discussed</option>
                <option value="most-cited">Most Cited</option>
              </select>
            </div>

            {sortedSubmissions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">No submissions found</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                  Try adjusting your search terms or filters
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedSubmissions.map(renderResultCard)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn-secondary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-2 rounded ${
                          pageNumber === currentPage
                            ? 'bg-primary-600 text-white'
                            : 'btn-secondary'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn-secondary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
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
