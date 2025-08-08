import React, { useState, useRef } from 'react';
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
  Share2,
  Upload,
  Camera
} from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('papers');
  const [isOwnProfile] = useState(true); // Mock: assume viewing own profile
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

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

  // Initialize form data when entering edit mode
  const handleEditClick = () => {
    setIsEditMode(true);
    setFormData({
      name: profileData.name,
      title: profileData.title,
      affiliation: profileData.affiliation,
      location: profileData.location,
      bio: profileData.bio,
      email: profileData.email,
      website: profileData.website,
      github: profileData.socialLinks.github,
      twitter: profileData.socialLinks.twitter,
      linkedin: profileData.socialLinks.linkedin
    });
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return null;

    const formData = new FormData();
    formData.append('avatar', avatarFile);
    formData.append('user_id', profileData.id);

    try {
      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        // Add authorization header if needed
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      const result = await response.json();
      return result.avatar_url;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let avatarUrl = null;
      
      // Upload avatar first if there's a new one
      if (avatarFile) {
        try {
          avatarUrl = await handleAvatarUpload();
        } catch (error) {
          console.error('Avatar upload failed:', error);
          // Continue with profile update even if avatar upload fails
        }
      }

      // Prepare profile data
      const profilePayload = {
        user_id: profileData.id,
        ...formData
      };
      
      // Add avatar URL if successfully uploaded
      if (avatarUrl) {
        profilePayload.avatar_url = avatarUrl;
      }

      // Call the backend API to save profile
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profilePayload)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      console.log('Profile updated successfully:', result);
      
      // Exit edit mode after successful save
      setIsEditMode(false);
      setFormData(null);
      setAvatarPreview(null);
      setAvatarFile(null);
      
      // Optionally refresh the page or update local state
      // window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setFormData(null);
    setAvatarPreview(null);
    setAvatarFile(null);
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
                {isEditMode ? (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={profileData.avatar}
                          alt={profileData.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                        <div className="text-white text-center">
                          <Camera className="w-8 h-8 mx-auto mb-1" />
                          <span className="text-xs">Change Photo</span>
                        </div>
                      </div>
                    </div>
                    {avatarFile && (
                      <button 
                        onClick={() => {
                          setAvatarFile(null);
                          setAvatarPreview(null);
                        }}
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <span className="text-xs">✕</span>
                      </button>
                    )}
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
              
              <div className="mt-4 text-center lg:text-left">
                {isEditMode ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={formData?.name || ''}
                      onChange={handleInputChange}
                      className="text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none mb-2 w-full"
                      placeholder="Your Name"
                    />
                    <input
                      type="text"
                      name="title"
                      value={formData?.title || ''}
                      onChange={handleInputChange}
                      className="text-lg text-gray-600 dark:text-gray-400 bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none mb-2 w-full"
                      placeholder="Your Title"
                    />
                    <input
                      type="text"
                      name="affiliation"
                      value={formData?.affiliation || ''}
                      onChange={handleInputChange}
                      className="text-gray-500 dark:text-gray-500 bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none mb-2 w-full"
                      placeholder="Your Affiliation"
                    />
                    <input
                      type="text"
                      name="location"
                      value={formData?.location || ''}
                      onChange={handleInputChange}
                      className="text-gray-500 dark:text-gray-500 bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none w-full"
                      placeholder="Your Location"
                    />
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>

            {/* Bio and Links */}
            <div className="flex-1">
              {isEditMode ? (
                <>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData?.bio || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none mb-6"
                    placeholder="Tell us about yourself..."
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData?.email || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
                      <input
                        type="url"
                        name="website"
                        value={formData?.website || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub</label>
                      <input
                        type="url"
                        name="github"
                        value={formData?.github || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twitter</label>
                      <input
                        type="url"
                        name="twitter"
                        value={formData?.twitter || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn</label>
                      <input
                        type="url"
                        name="linkedin"
                        value={formData?.linkedin || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}

              {/* Badges */}
              {!isEditMode && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {profileData.badges.map((badge, index) => (
                    <span key={index} className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                      <badge.icon className="w-4 h-4" />
                      {badge.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {isOwnProfile ? (
                  isEditMode ? (
                    <>
                      <button 
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                      <button 
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={handleEditClick}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Edit Profile
                    </button>
                  )
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
