import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Award, 
  Star, 
  Download,
  Edit,
  Settings,
  Mail,
  Link as LinkIcon,
  Github,
  Twitter,
  Linkedin,
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  Heart,
  Share2
} from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('papers');
  const [isOwnProfile] = useState(true); // Mock: assume viewing own profile

  // Mock profile data
  const profileData = {
    id: id || 'current-user',
    name: 'Dr. Sarah Chen',
    title: 'Senior Research Scientist',
    affiliation: 'MIT Computer Science & Artificial Intelligence Laboratory',
    location: 'Cambridge, MA',
    joinDate: 'March 2021',
    avatar: '/api/placeholder/150/150',
    bio: 'Researcher in machine learning, computer vision, and AI systems. Passionate about developing ethical AI solutions for real-world problems.',
    email: 'sarah.chen@mit.edu',
    website: 'https://sarahchen.ai',
    socialLinks: {
      github: 'https://github.com/sarahchen',
      twitter: 'https://twitter.com/sarahchen_ai',
      linkedin: 'https://linkedin.com/in/sarahchen'
    },
    stats: {
      papers: 47,
      citations: 2847,
      hIndex: 23,
      followers: 1204,
      following: 342,
      downloads: 15420
    },
    badges: [
      { name: 'Top Reviewer', icon: Award, color: 'bg-yellow-100 text-yellow-800' },
      { name: 'Rising Star', icon: Star, color: 'bg-purple-100 text-purple-800' },
      { name: 'Community Leader', icon: Users, color: 'bg-blue-100 text-blue-800' }
    ]
  };

  const papers = [
    {
      id: 1,
      title: 'Attention Is All You Need for Multimodal Learning',
      authors: 'Sarah Chen, David Kim, Michael Zhang',
      venue: 'ICML 2024',
      date: '2024-01-15',
      citations: 342,
      downloads: 1205,
      status: 'published',
      tags: ['machine learning', 'attention mechanisms', 'multimodal']
    },
    {
      id: 2,
      title: 'Ethical Considerations in Large Language Model Deployment',
      authors: 'Sarah Chen, Alice Johnson',
      venue: 'Under Review - NeurIPS 2024',
      date: '2024-02-20',
      citations: 0,
      downloads: 89,
      status: 'under-review',
      tags: ['ethics', 'large language models', 'AI safety']
    },
    {
      id: 3,
      title: 'Federated Learning with Differential Privacy Guarantees',
      authors: 'Sarah Chen, Robert Liu, Emma Davis',
      venue: 'ICLR 2023',
      date: '2023-05-12',
      citations: 156,
      downloads: 892,
      status: 'published',
      tags: ['federated learning', 'privacy', 'distributed systems']
    }
  ];

  const reviews = [
    {
      id: 1,
      title: 'Neural Architecture Search for Efficient Models',
      venue: 'ICML 2024',
      date: '2024-01-10',
      score: 7,
      decision: 'accept'
    },
    {
      id: 2,
      title: 'Quantum Machine Learning Applications',
      venue: 'NeurIPS 2024',
      date: '2024-02-05',
      score: 5,
      decision: 'reject'
    }
  ];

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
      }`}
    >
      {label}
    </button>
  );

  const StatCard = ({ label, value, icon: Icon, trend }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </p>
          )}
        </div>
        <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
    </div>
  );

  const PaperCard = ({ paper }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
          {paper.title}
        </h3>
        <span className={`px-2 py-1 text-xs rounded-full ${
          paper.status === 'published' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
        }`}>
          {paper.status === 'published' ? 'Published' : 'Under Review'}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{paper.authors}</p>
      <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">{paper.venue}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {paper.tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>{new Date(paper.date).toLocaleDateString()}</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            {paper.citations}
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            {paper.downloads}
          </span>
          <div className="flex gap-2">
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-blue-500 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative">
                <img
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                />
                {isOwnProfile && (
                  <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="mt-4 text-center lg:text-left">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profileData.name}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">{profileData.title}</p>
                <p className="text-gray-500 dark:text-gray-500 flex items-center gap-1 mt-2">
                  <MapPin className="w-4 h-4" />
                  {profileData.affiliation}
                </p>
                <p className="text-gray-500 dark:text-gray-500 flex items-center gap-1 mt-1">
                  <Calendar className="w-4 h-4" />
                  Joined {profileData.joinDate}
                </p>
              </div>
            </div>

            {/* Bio and Links */}
            <div className="flex-1">
              <p className="text-gray-700 dark:text-gray-300 mb-6">{profileData.bio}</p>
              
              {/* Contact Links */}
              <div className="flex flex-wrap gap-4 mb-6">
                <a href={`mailto:${profileData.email}`} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Mail className="w-4 h-4" />
                  Email
                </a>
                <a href={profileData.website} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <LinkIcon className="w-4 h-4" />
                  Website
                </a>
                <a href={profileData.socialLinks.github} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
                <a href={profileData.socialLinks.twitter} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Twitter className="w-4 h-4" />
                  Twitter
                </a>
                <a href={profileData.socialLinks.linkedin} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {profileData.badges.map((badge, index) => (
                  <span key={index} className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                    <badge.icon className="w-4 h-4" />
                    {badge.name}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {isOwnProfile ? (
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Settings className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <User className="w-4 h-4" />
                      Follow
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Mail className="w-4 h-4" />
                      Message
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <StatCard label="Papers" value={profileData.stats.papers} icon={BookOpen} trend="+3 this month" />
          <StatCard label="Citations" value={profileData.stats.citations.toLocaleString()} icon={MessageSquare} trend="+127 this month" />
          <StatCard label="H-Index" value={profileData.stats.hIndex} icon={BarChart3} />
          <StatCard label="Followers" value={profileData.stats.followers.toLocaleString()} icon={Users} trend="+45 this month" />
          <StatCard label="Following" value={profileData.stats.following} icon={User} />
          <StatCard label="Downloads" value={profileData.stats.downloads.toLocaleString()} icon={Download} trend="+892 this month" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          <TabButton
            id="papers"
            label="Papers"
            isActive={activeTab === 'papers'}
            onClick={() => setActiveTab('papers')}
          />
          <TabButton
            id="reviews"
            label="Reviews"
            isActive={activeTab === 'reviews'}
            onClick={() => setActiveTab('reviews')}
          />
          <TabButton
            id="activity"
            label="Activity"
            isActive={activeTab === 'activity'}
            onClick={() => setActiveTab('activity')}
          />
          <TabButton
            id="collaborations"
            label="Collaborations"
            isActive={activeTab === 'collaborations'}
            onClick={() => setActiveTab('collaborations')}
          />
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'papers' && (
            <div className="space-y-4">
              {papers.map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{review.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      review.decision === 'accept' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {review.decision}
                    </span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">{review.venue}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>{new Date(review.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Score: {review.score}/10
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Activity Timeline</h3>
              <p className="text-gray-600 dark:text-gray-400">Activity visualization coming soon</p>
            </div>
          )}

          {activeTab === 'collaborations' && (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Collaboration Network</h3>
              <p className="text-gray-600 dark:text-gray-400">Collaboration visualization coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
