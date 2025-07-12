import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Share, Bookmark, Watch, Edit, MessageSquare, BarChart3, FileText, Bot, Eye, Heart, Star, ChevronDown } from 'lucide-react';

const SubmissionDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('content');
  const [showVersions, setShowVersions] = useState(false);

  // Mock data - in real app this would come from API
  const submission = {
    id: 'SUB-2024-001',
    title: 'Attention Is All You Need: Transformer Architecture for Natural Language Processing',
    authors: [
      { name: 'Ashish Vaswani', affiliation: 'Google Brain', orcid: '0000-0000-0000-0001' },
      { name: 'Noam Shazeer', affiliation: 'Google Brain', orcid: '0000-0000-0000-0002' },
      { name: 'Niki Parmar', affiliation: 'Google Research', orcid: '0000-0000-0000-0003' },
    ],
    agents: [
      { name: 'ResearchBot v3.2', role: 'Co-author', contribution: 'Literature review and analysis' }
    ],
    type: 'paper',
    status: 'published',
    publishedDate: '2024-01-15',
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
    doi: '10.48550/arXiv.2024.12345',
    categories: ['Computer Science', 'Machine Learning', 'Neural Networks'],
    keywords: ['attention mechanism', 'transformer', 'neural networks', 'natural language processing'],
    metrics: {
      views: 15420,
      downloads: 3280,
      citations: 145,
      comments: 23,
      bookmarks: 892,
    },
    versions: [
      { version: '1.2', date: '2024-01-15', changes: 'Final published version' },
      { version: '1.1', date: '2024-01-10', changes: 'Added experimental results section' },
      { version: '1.0', date: '2024-01-05', changes: 'Initial submission' },
    ],
    isBookmarked: false,
    isWatching: true,
  };

  const reviews = [
    {
      id: 'REV-001',
      reviewer: 'Anonymous Reviewer 1',
      date: '2024-01-12',
      scores: { novelty: 4.5, clarity: 4.0, significance: 4.5, technical: 4.0 },
      summary: 'This paper presents a novel and significant contribution to the field of neural machine translation. The proposed Transformer architecture is elegant and achieves state-of-the-art results.',
      strengths: [
        'Novel attention-only architecture',
        'Strong empirical results',
        'Clear presentation and well-written',
        'Comprehensive experiments'
      ],
      weaknesses: [
        'Limited theoretical analysis',
        'Computational complexity could be better discussed'
      ],
      recommendation: 'Accept',
      helpful: 15,
    },
    {
      id: 'REV-002',
      reviewer: 'Anonymous Reviewer 2',
      date: '2024-01-13',
      scores: { novelty: 4.0, clarity: 4.5, significance: 4.0, technical: 4.0 },
      summary: 'The paper introduces an interesting architecture that removes recurrence entirely. The results are promising and the work is technically sound.',
      strengths: [
        'Removes recurrence for faster training',
        'Good experimental validation',
        'Impact on the field'
      ],
      weaknesses: [
        'Some notation could be clearer',
        'More ablation studies would strengthen the work'
      ],
      recommendation: 'Accept',
      helpful: 12,
    }
  ];

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
      <p>{submission.abstract}</p>
      
      <h2>1. Introduction</h2>
      <p>
        Recurrent neural networks, long short-term memory and gated recurrent neural networks 
        in particular, have been firmly established as state of the art approaches in sequence 
        modeling and transduction problems such as language modeling and machine translation.
      </p>
      
      <h2>2. Background</h2>
      <p>
        The goal of reducing sequential computation also forms the foundation of the Extended 
        Neural GPU, ByteNet and ConvS2S, all of which use convolutional neural networks as 
        basic building block, computing hidden representations in parallel for all input and 
        output positions.
      </p>
      
      <h2>3. Model Architecture</h2>
      <p>
        Most competitive neural sequence transduction models have an encoder-decoder structure. 
        Here, the encoder maps an input sequence of symbol representations to a sequence of 
        continuous representations.
      </p>
      
      <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg my-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>Full PDF content would be displayed here</p>
          <p className="text-sm">Interactive PDF viewer with highlighting and comments</p>
        </div>
      </div>
    </div>
  );

  const renderVersions = () => (
    <div className="space-y-4">
      {submission.versions.map((version, index) => (
        <div key={version.version} className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Version {version.version}
                </span>
                {index === 0 && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-sm">
                    Current
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {version.date} • {version.changes}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {index > 0 && (
                <button className="btn-secondary text-sm">
                  View Diff
                </button>
              )}
              <button className="btn-primary text-sm">
                Download
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      {/* Review Summary */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Review Summary
        </h3>
        <div className="grid grid-cols-4 gap-6">
          {['novelty', 'clarity', 'significance', 'technical'].map((criterion) => (
            <div key={criterion} className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {(reviews.reduce((sum, review) => sum + review.scores[criterion], 0) / reviews.length).toFixed(1)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {criterion}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Reviews */}
      {reviews.map((review) => (
        <div key={review.id} className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {review.reviewer}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{review.date}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                review.recommendation === 'Accept' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {review.recommendation}
              </span>
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <Heart className="h-4 w-4" />
                <span>{review.helpful}</span>
              </div>
            </div>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            {Object.entries(review.scores).map(([criterion, score]) => (
              <div key={criterion} className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {score}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {criterion}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Summary</h5>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{review.summary}</p>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Strengths</h5>
              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {review.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Weaknesses</h5>
              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {review.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>
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
                  <button className="btn-secondary flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>PDF</span>
                  </button>
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
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {author.affiliation}
                      </span>
                    </div>
                  ))}
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
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">DOI:</span>
                  <a href="#" className="ml-2 text-primary-600 dark:text-primary-400 hover:underline">
                    {submission.doi}
                  </a>
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
    </div>
  );
};

export default SubmissionDetail;
