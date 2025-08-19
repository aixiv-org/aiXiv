import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Share, Bookmark, Watch, Edit, MessageSquare, BarChart3, FileText, Bot, Eye, Heart, Star } from 'lucide-react';
import AddReviewModal from '../components/AddReviewModal';

const SubmissionDetail = () => {
  const { id } = useParams(); // This is the aixiv_id from the URL
  const [activeTab, setActiveTab] = useState('content');
  
  // API state
  const [submission, setSubmission] = useState(null);
  const [allVersions, setAllVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Review modal state
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  
  // Fetch submission data from API
  const fetchSubmissionData = async (aixivId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all submissions to find the one with matching aixiv_id and all its versions
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/submissions/public?skip=0&limit=1000`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const allSubmissions = await response.json();
      
      // Find all versions of the submission with this aixiv_id
      const versions = allSubmissions.filter(sub => sub.aixiv_id === aixivId);
      
      if (versions.length === 0) {
        throw new Error('Submission not found');
      }
      
      // Sort versions by version number (descending) to get the latest first
      const sortedVersions = versions.sort((a, b) => {
        const versionA = parseFloat(a.version || '1.0');
        const versionB = parseFloat(b.version || '1.0');
        return versionB - versionA;
      });
      
      const latestSubmission = sortedVersions[0];
      
      // Transform the data to match the expected format
      const transformedSubmission = {
        id: latestSubmission.aixiv_id,
        title: latestSubmission.title,
        authors: latestSubmission.agent_authors?.map(author => ({
          name: author,
          affiliation: '', // Not available in current schema
          orcid: '' // Not available in current schema
        })) || [],
        agents: [], // Could be determined based on your data
        type: latestSubmission.doc_type || 'paper',
        status: latestSubmission.status || 'published',
        publishedDate: new Date(latestSubmission.created_at).toLocaleDateString(),
        abstract: latestSubmission.abstract || 'No abstract available',
        doi: latestSubmission.doi || null,
        categories: Array.isArray(latestSubmission.category) ? latestSubmission.category : [latestSubmission.category || 'General'],
        keywords: latestSubmission.keywords || [],
    metrics: {
          views: latestSubmission.views || 0,
          downloads: latestSubmission.downloads || 0,
          citations: latestSubmission.citations || 0,
          comments: latestSubmission.comments || 0,
          bookmarks: 0, // Not available in current schema
        },
        versions: sortedVersions.map(version => ({
          version: version.version || '1.0',
          date: new Date(version.created_at).toLocaleDateString(),
          changes: version.version === latestSubmission.version ? 'Current version' : 'Previous version',
          s3_url: version.s3_url
        })),
    isBookmarked: false,
        isWatching: false,
        correspondingAuthor: latestSubmission.corresponding_author,
        license: latestSubmission.license,
        s3_url: latestSubmission.s3_url,
        currentVersion: latestSubmission.version || '1.0'
      };
      
      setSubmission(transformedSubmission);
      setAllVersions(sortedVersions);
      
    } catch (err) {
      console.error('Error fetching submission:', err);
      setError(err.message || 'Failed to load submission. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews from API
  const fetchReviews = useCallback(async () => {
    if (!submission) return;
    
    try {
      setReviewsLoading(true);
      setReviewsError(null);
      
      const reviewPayload = {
        aixiv_id: submission.id,
        version: submission.currentVersion,
        start_date: '2024-01-01T00:00:00',
        end_date: '2025-12-31T23:59:59'
      };
      
      console.log('Fetching reviews with payload:', reviewPayload);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/get-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewPayload)
      });
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      if (!response.ok) {
        console.error('Response not ok:', response.status, responseText);
        
        // Handle 404 specifically (no reviews found)
        if (response.status === 404) {
          setReviews([]);
          return;
        }
        
        throw new Error(`Failed to fetch reviews: ${response.status} - ${responseText}`);
      }
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Invalid response format from server');
      }
      
      console.log('Parsed result:', result);
      
      if (result.code === 200 && result.review_list) {
        // Sort reviews by create_time (most recent first)
        const sortedReviews = result.review_list.sort((a, b) => 
          new Date(b.create_time) - new Date(a.create_time)
        );
        
        // Transform API data to expected format
        const transformedReviews = sortedReviews.map((review, index) => ({
          id: `REV-${index + 1}`,
          reviewer: 'Anonymous Reviewer',
          date: new Date(review.create_time).toLocaleDateString(),
          summary: review.review_results.text,
          strengths: [], // Not provided by API
          weaknesses: [], // Not provided by API
          recommendation: 'Human Review', // Default since not provided
          helpful: 0, // Default since not provided
          createTime: review.create_time, // Keep original timestamp for future sorting if needed
        }));
        setReviews(transformedReviews);
      } else {
        console.log('No reviews found or unexpected response format');
        setReviews([]);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviewsError(`Failed to load reviews: ${err.message}`);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, [submission]);

  // Handle review added
  const handleReviewAdded = () => {
    fetchReviews(); // Refresh reviews after adding a new one
  };

  // Load data when component mounts or id changes
  useEffect(() => {
    if (id) {
      fetchSubmissionData(id);
    }
  }, [id]);

  // Fetch reviews when submission is loaded
  useEffect(() => {
    if (submission) {
      fetchReviews();
    }
  }, [submission, fetchReviews]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading submission...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => fetchSubmissionData(id)}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No submission found
  if (!submission) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Submission not found</p>
        </div>
      </div>
    );
  }

  const discussions = [
    {
      id: 'DISC-001',
      author: 'Dr. Sarah Chen',
      date: '2024-01-16',
      content: 'Excellent work! I\'m particularly interested in the scalability of the attention mechanism. Have you considered applying this to longer sequences?',
      replies: [
        {
          author: 'Ashish Vaswani',
          date: '2024-01-16',
          content: 'Thank you for the question! We did experiment with longer sequences and found that the quadratic complexity becomes a bottleneck. We\'re exploring sparse attention patterns in follow-up work.'
        }
      ],
      likes: 8
    },
    {
      id: 'DISC-002',
      author: 'Prof. Michael Zhang',
      date: '2024-01-17',
      content: 'The multi-head attention mechanism is brilliant. Could you elaborate on how you chose the number of heads and key dimensions?',
      replies: [],
      likes: 5
    }
  ];

  const similarPapers = [
    {
      id: 'SUB-2024-002',
      title: 'BERT: Pre-training of Deep Bidirectional Transformers',
      authors: ['Jacob Devlin', 'Ming-Wei Chang'],
      similarity: 0.85
    },
    {
      id: 'SUB-2024-003',
      title: 'GPT-3: Language Models are Few-Shot Learners',
      authors: ['Tom B. Brown', 'Benjamin Mann'],
      similarity: 0.78
    },
    {
      id: 'SUB-2024-004',
      title: 'Vision Transformer: An Image is Worth 16x16 Words',
      authors: ['Alexey Dosovitskiy', 'Lucas Beyer'],
      similarity: 0.72
    }
  ];

  const renderContent = () => (
    <div className="prose dark:prose-invert max-w-none">
      <h2>Abstract</h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {submission.abstract || 'No abstract available for this submission.'}
      </p>
      
      <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg my-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>Full PDF content would be displayed here</p>
          <p className="text-sm">Interactive PDF viewer with highlighting and comments</p>
          {submission.s3_url && (
            <a 
              href={submission.s3_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 btn-primary"
            >
              View PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );

  const renderVersions = () => (
    <div className="space-y-4">
      {allVersions.map((version, index) => (
        <div key={version.version || index} className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Version {version.version || '1.0'}
                </span>
                {index === 0 && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-sm">
                    Current
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {new Date(version.created_at).toLocaleDateString()} • 
                {index === 0 ? ' Current version' : ' Previous version'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {version.s3_url ? (
                <a 
                  href={version.s3_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm"
                >
                  Download
                </a>
              ) : (
                <span className="text-gray-400 text-sm">No file available</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      {/* Add Review Button */}
      <div className="flex justify-end">
        <button 
          onClick={() => setShowAddReviewModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>Add Review</span>
        </button>
              </div>

      {/* Reviews Loading State */}
      {reviewsLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading reviews...</p>
              </div>
      )}

      {/* Reviews Error State */}
      {reviewsError && (
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 mb-4">{reviewsError}</p>
          <button 
            onClick={fetchReviews}
            className="btn-primary"
          >
            Try Again
          </button>
            </div>
      )}

      {/* No Reviews State */}
      {!reviewsLoading && !reviewsError && reviews.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No reviews yet. Be the first to add a review!</p>
        </div>
      )}

      {/* Individual Reviews */}
      {!reviewsLoading && !reviewsError && reviews.map((review) => (
        <div key={review.id} className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {review.reviewer}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{review.date}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {review.recommendation}
              </span>
              {review.helpful > 0 && (
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <Heart className="h-4 w-4" />
                <span>{review.helpful}</span>
              </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Review</h5>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{review.summary}</p>
            </div>

            {review.strengths.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Strengths</h5>
              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {review.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            )}

            {review.weaknesses.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Weaknesses</h5>
              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {review.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderDiscussions = () => (
    <div className="space-y-6">
      {discussions.map((discussion) => (
        <div key={discussion.id} className="card p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
              {discussion.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {discussion.author}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {discussion.date}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {discussion.content}
              </p>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500">
                  <Heart className="h-4 w-4" />
                  <span>{discussion.likes}</span>
                </button>
                <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700">
                  Reply
                </button>
              </div>

              {/* Replies */}
              {discussion.replies.length > 0 && (
                <div className="mt-4 ml-6 space-y-3">
                  {discussion.replies.map((reply, index) => (
                    <div key={index} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {reply.author}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {reply.date}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Add Comment */}
      <div className="card p-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
          Add Comment
        </h4>
        <textarea
          className="input-field h-24 mb-4"
          placeholder="Share your thoughts or ask questions..."
        />
        <div className="flex justify-end">
          <button className="btn-primary">
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li><a href="/" className="hover:text-gray-700 dark:hover:text-gray-300">Home</a></li>
            <li>/</li>
            <li><a href="/explore" className="hover:text-gray-700 dark:hover:text-gray-300">Explore</a></li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white">{submission.id}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="card p-6 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    submission.type === 'paper' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {submission.type.toUpperCase()}
                  </span>
                  
                  {submission.agents.length > 0 && (
                    <span className="inline-flex items-center px-3 py-1 rounded text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      <Bot className="h-4 w-4 mr-1" />
                      AI Co-authored
                    </span>
                  )}
                  
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    submission.status === 'published' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {submission.status}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {submission.s3_url ? (
                    <a 
                      href={submission.s3_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>PDF</span>
                    </a>
                  ) : (
                    <button disabled className="btn-secondary flex items-center space-x-2 opacity-50 cursor-not-allowed">
                    <Download className="h-4 w-4" />
                    <span>PDF</span>
                  </button>
                  )}
                  <button className="btn-secondary">
                    <Share className="h-4 w-4" />
                  </button>
                  <button className={`btn-secondary ${submission.isBookmarked ? 'text-yellow-600' : ''}`}>
                    <Bookmark className="h-4 w-4" />
                  </button>
                  <button className={`btn-secondary ${submission.isWatching ? 'text-blue-600' : ''}`}>
                    <Watch className="h-4 w-4" />
                  </button>
                  
                  {submission.status === 'revision-needed' && (
                    <button className="btn-primary flex items-center space-x-2">
                      <Edit className="h-4 w-4" />
                      <span>New Version</span>
                    </button>
                  )}
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {submission.title}
              </h1>

              {/* Authors */}
              <div className="mb-4">
                <div className="flex flex-wrap items-center gap-4">
                  {submission.authors.map((author, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-gray-700 dark:text-gray-300 hover:text-primary-600 cursor-pointer">
                        {author.name}
                      </span>
                      {author.affiliation && (
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {author.affiliation}
                      </span>
                      )}
                    </div>
                  ))}
                  {submission.correspondingAuthor && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700 dark:text-gray-300">
                        <span className="text-red-500">*</span> {submission.correspondingAuthor}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        (Corresponding Author)
                      </span>
                    </div>
                  )}
                  {submission.agents.map((agent, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-purple-600" />
                      <span className="text-purple-600 dark:text-purple-400">
                        {agent.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {submission.metrics.views.toLocaleString()} views
                </span>
                <span className="flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  {submission.metrics.downloads.toLocaleString()} downloads
                </span>
                <span className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {submission.metrics.comments} comments
                </span>
                <span className="flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  {submission.metrics.citations} citations
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'content', label: 'Abstract / PDF', icon: FileText },
                  { id: 'versions', label: 'Versions', icon: Edit },
                  { id: 'reviews', label: 'Reviews', icon: MessageSquare },
                  { id: 'discussion', label: 'Discussion', icon: MessageSquare },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                      activeTab === id
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'content' && renderContent()}
              {activeTab === 'versions' && renderVersions()}
              {activeTab === 'reviews' && renderReviews()}
              {activeTab === 'discussion' && renderDiscussions()}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Paper Info */}
            <div className="card p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Paper Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Published:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{submission.publishedDate}</span>
                </div>                <div>
                  <span className="text-gray-500 dark:text-gray-400">DOI:</span>
                  <button className="ml-2 text-primary-600 dark:text-primary-400 hover:underline">
                    {submission.id}
                  </button>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Categories:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {submission.categories.map((category) => (
                      <span key={category} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Keywords:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {submission.keywords.map((keyword) => (
                      <span key={keyword} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                {submission.license && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">License:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{submission.license}</span>
                  </div>
                )}
                {submission.currentVersion && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Version:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">v{submission.currentVersion}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Live Metrics */}
            <div className="card p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Live Metrics
              </h3>
              <div className="space-y-3">
                {Object.entries(submission.metrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400 capitalize">{key}:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Papers */}
            <div className="card p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Similar Papers</h3>
              <div className="space-y-3">
                {similarPapers.map((paper) => (
                  <div key={paper.id} className="group cursor-pointer">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                      {paper.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {paper.authors.join(', ')}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {Math.round(paper.similarity * 100)}% similar
                      </span>
                      <button className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={showAddReviewModal}
        onClose={() => setShowAddReviewModal(false)}
        submission={submission}
        onReviewAdded={handleReviewAdded}
      />
    </div>
  );
};

export default SubmissionDetail;
