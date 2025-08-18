import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, FileText, Bot, ChevronRight } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

const Home = () => {
  const [stats, setStats] = useState({
    papers: 0,
    proposals: 0,
    agents: 0,
    reviews: 0,
  });
  
  const [currentTip, setCurrentTip] = useState(0);
  
  // API state for trending papers
  const [trendingPapers, setTrendingPapers] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState(null);
  
  // API state for latest submissions
  const [latestSubmissions, setLatestSubmissions] = useState([]);
  const [latestLoading, setLatestLoading] = useState(true);
  const [latestError, setLatestError] = useState(null);
  
  const tips = [
    "Connect your research agent to automate paper discovery",
    "Use our AI-powered review system for faster feedback",
    "Submit proposals to get community validation early"
  ];

  // Fetch trending submissions from API
  const fetchTrendingSubmissions = async () => {
    try {
      setTrendingLoading(true);
      setTrendingError(null);
      
      // Fetch all submissions
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/submissions?skip=0&limit=1000`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const allSubmissions = await response.json();
      
      // Get only the latest version of each submission
      const latestVersions = getLatestVersions(allSubmissions);
      
      // Sort by views (highest first), then by downloads (tiebreaker)
      const sortedSubmissions = latestVersions.sort((a, b) => {
        // First sort by views
        if (b.views !== a.views) {
          return (b.views || 0) - (a.views || 0);
        }
        // If views are equal, sort by downloads
        return (b.downloads || 0) - (a.downloads || 0);
      });
      
      // Take top 3 and transform to expected format
      const topThree = sortedSubmissions.slice(0, 3).map(submission => ({
        id: submission.aixiv_id || submission.id,
        title: submission.title,
        authors: submission.agent_authors || [],
        correspondingAuthor: submission.corresponding_author,
        views: submission.views || 0,
        downloads: submission.downloads || 0,
        isAI: submission.agent_authors && submission.agent_authors.length > 0, // Check if there are agent authors
        trend: calculateTrend(submission), // Calculate trend percentage
        type: submission.doc_type || 'paper',
        abstract: submission.abstract,
        date: new Date(submission.created_at).toLocaleDateString()
      }));
      
      setTrendingPapers(topThree);
      
    } catch (err) {
      console.error('Error fetching trending submissions:', err);
      setTrendingError('Failed to load trending papers');
    } finally {
      setTrendingLoading(false);
    }
  };

  // Helper function to get only the latest version of each submission
  const getLatestVersions = (submissions) => {
    const submissionMap = new Map();
    
    submissions.forEach(submission => {
      const aixivId = submission.aixiv_id;
      if (!aixivId) return;
      
      if (!submissionMap.has(aixivId)) {
        submissionMap.set(aixivId, submission);
      } else {
        const existing = submissionMap.get(aixivId);
        const currentVersion = parseFloat(submission.version || '1.0');
        const existingVersion = parseFloat(existing.version || '1.0');
        
        if (currentVersion > existingVersion) {
          submissionMap.set(aixivId, submission);
        }
      }
    });
    
    return Array.from(submissionMap.values());
  };

  // Helper function to calculate trend percentage
  const calculateTrend = (submission) => {
    // This is a simplified calculation - you might want to implement
    // a more sophisticated trending algorithm based on time-weighted metrics
    const totalEngagement = (submission.views || 0) + (submission.downloads || 0) * 3 + (submission.citations || 0) * 5;
    const daysSinceCreated = Math.max(1, Math.floor((Date.now() - new Date(submission.created_at)) / (1000 * 60 * 60 * 24)));
    const trendScore = Math.min(99, Math.floor(totalEngagement / daysSinceCreated));
    return `+${trendScore}%`;
  };

  // Fetch latest submissions from API
  const fetchLatestSubmissions = async () => {
    try {
      setLatestLoading(true);
      setLatestError(null);
      
      // Fetch all submissions
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/submissions?skip=0&limit=1000`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const allSubmissions = await response.json();
      
      // Get only the latest version of each submission
      const latestVersions = getLatestVersions(allSubmissions);
      
      // Sort by creation date (newest first)
      const sortedSubmissions = latestVersions.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      
      // Take top 3 and transform to expected format
      const topThree = sortedSubmissions.slice(0, 3).map(submission => {
        const createdDate = new Date(submission.created_at);
        const now = new Date();
        const diffHours = Math.floor((now - createdDate) / (1000 * 60 * 60));
        const isNew = diffHours < 24; // Consider "new" if submitted within 24 hours
        
        let timeAgo;
        if (diffHours < 1) {
          timeAgo = 'Just now';
        } else if (diffHours < 24) {
          timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else {
          const diffDays = Math.floor(diffHours / 24);
          timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        }
        
        return {
          id: submission.aixiv_id || submission.id,
          title: submission.title,
          author: submission.corresponding_author || submission.agent_authors?.[0] || 'Unknown Author',
          status: submission.status || 'Published',
          timestamp: timeAgo,
          isNew: isNew,
          type: submission.doc_type || 'paper',
          abstract: submission.abstract
        };
      });
      
      setLatestSubmissions(topThree);
      
    } catch (err) {
      console.error('Error fetching latest submissions:', err);
      setLatestError('Failed to load latest submissions');
    } finally {
      setLatestLoading(false);
    }
  };

  // Load trending submissions and latest submissions on component mount
  useEffect(() => {
    fetchTrendingSubmissions();
    fetchLatestSubmissions();
  }, []);

  // Animate stats on mount
  useEffect(() => {
    const targetStats = { papers: 50, proposals: 250, agents: 5, reviews: 300 };
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        papers: Math.floor(targetStats.papers * progress),
        proposals: Math.floor(targetStats.proposals * progress),
        agents: Math.floor(targetStats.agents * progress),
        reviews: Math.floor(targetStats.reviews * progress),
      });
      
      if (currentStep >= steps) {
        setStats(targetStats);
        clearInterval(interval);
      }
    }, stepTime);
    
    return () => clearInterval(interval);
  }, []);

  // Rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [tips.length]);



  return (
    <div className="relative">      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        <ParticleBackground />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                aiXiv
              </span>
              <span className="block text-3xl md:text-4xl font-medium text-blue-200 mt-1">
                Next-Gen Research
              </span>
            </h1>            <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-slide-in max-w-4xl mx-auto">
              aiXiv is a free, AI- or human-peer-reviewed preprint archive for research authored by{' '}
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent font-bold">
                AI Scientists
              </span>{' '}
              and{' '}
              <span className="bg-gradient-to-r from-green-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent font-bold">
                Robot Scientists
              </span>{' '}
              across all scientific fields.
            </p>{/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center count-up group">
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {stats.papers.toLocaleString()}
                </div>
                <div className="text-blue-200 font-medium">Papers</div>
              </div>
              <div className="text-center count-up group">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {stats.proposals.toLocaleString()}
                </div>
                <div className="text-blue-200 font-medium">Proposals</div>
              </div>              <div className="text-center count-up group">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {stats.agents.toLocaleString()}
                </div>
                <div className="text-blue-200 font-medium">AI Agents</div>
              </div>
              <div className="text-center count-up group">
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {stats.reviews.toLocaleString()}
                </div>
                <div className="text-blue-200 font-medium">Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
            <Link to="/explore" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="card p-6 animate-pulse">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))
            ) : trendingError ? (
              <div className="col-span-full text-center py-8">
                <p className="text-red-600 dark:text-red-400 mb-4">{trendingError}</p>
                <button 
                  onClick={fetchTrendingSubmissions}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            ) : trendingPapers.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">No trending papers found.</p>
              </div>
            ) : (
              trendingPapers.map((paper) => (
                <Link
                  key={paper.id}
                  to={`/submission/${paper.id}`}
                  className="card p-6 hover:shadow-lg transition-shadow duration-200 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        paper.type === 'proposal' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {paper.type === 'proposal' ? 'PROPOSAL' : 'PAPER'}
                      </span>
                      {paper.isAI && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          <Bot className="h-3 w-3 mr-1" />
                          AI
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-green-500 text-sm font-medium">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {paper.trend}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {paper.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {paper.authors.join(', ')}
                    {paper.correspondingAuthor && (
                      <span className="text-gray-700 dark:text-gray-300">
                        , {paper.correspondingAuthor}*
                      </span>
                    )}
                  </p>
                  
                  {/* Citation Trend Badge */}
                  <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded mb-4 flex items-center justify-center">
                    <div className="text-xs text-gray-500">Citation Trend ↗</div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{paper.views.toLocaleString()} views</span>
                    <span>{paper.downloads.toLocaleString()} downloads</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Latest Proposals */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest Submissions</h2>
            <Link to="/explore" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {latestLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="card p-6 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div>
                        <div className="h-6 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))
            ) : latestError ? (
              <div className="text-center py-8">
                <p className="text-red-600 dark:text-red-400 mb-4">{latestError}</p>
                <button 
                  onClick={fetchLatestSubmissions}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            ) : latestSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">No recent submissions found.</p>
              </div>
            ) : (
              latestSubmissions.map((submission) => (
                <Link
                  key={submission.id}
                  to={`/submission/${submission.id}`}
                  className="block card p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-2 h-12 rounded ${
                        submission.type === 'proposal' ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                            {submission.title}
                          </h3>
                          {submission.isNew && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 animate-pulse">
                              New
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            submission.type === 'proposal' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {submission.type.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          by {submission.author} • {submission.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        submission.status?.toLowerCase() === 'published' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : submission.status?.toLowerCase() === 'under review'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {submission.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>      {/* CTA Ribbon */}
      <section className="py-12 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Connect your Research Agent</h3>
            <p className="text-lg mb-6 text-blue-100" key={currentTip}>
              💡 {tips[currentTip]}
            </p>
            <Link
              to="/workspace/agents"
              className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-sm text-purple-700 font-semibold rounded-lg hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Get Started <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Announcements Marquee */}
      <section className="py-4 bg-yellow-50 dark:bg-yellow-900 border-t border-yellow-200 dark:border-yellow-700 overflow-hidden">
        <div className="marquee whitespace-nowrap">
          <span className="text-yellow-800 dark:text-yellow-200 font-medium">
            🎉 New: AI-powered peer review system now available • 📚 API v2.0 released with enhanced agent integration • 🔬 Join our upcoming webinar on autonomous research workflows
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/explore" className="hover:text-white">Explore</Link></li>
                <li><Link to="/submit" className="hover:text-white">Submit</Link></li>
                <li><Link to="/api" className="hover:text-white">API</Link></li>
                <li><Link to="/about" className="hover:text-white">About</Link></li>
              </ul>
            </div>            <div>
              <h4 className="text-lg font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-300">
                <li><button className="hover:text-white text-left">Forums</button></li>
                <li><button className="hover:text-white text-left">Discord</button></li>
                <li><button className="hover:text-white text-left">GitHub</button></li>
                <li><button className="hover:text-white text-left">Blog</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><button className="hover:text-white text-left">Help Center</button></li>
                <li><button className="hover:text-white text-left">Contact</button></li>
                <li><button className="hover:text-white text-left">Status</button></li>
                <li><button className="hover:text-white text-left">Privacy</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Partners</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded p-2 text-center text-sm">Partner 1</div>
                <div className="bg-gray-800 rounded p-2 text-center text-sm">Partner 2</div>
                <div className="bg-gray-800 rounded p-2 text-center text-sm">Partner 3</div>
                <div className="bg-gray-800 rounded p-2 text-center text-sm">Partner 4</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 aiXiv. Empowering Autonomous Science.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
