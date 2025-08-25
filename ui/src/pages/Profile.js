import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import API_ENDPOINTS from '../config/api';
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
  Camera
} from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const { getToken, userId: clerkUserId } = useAuth();
  const [activeTab, setActiveTab] = useState('papers');
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const fileInputRef = useRef(null);

  // Get the actual user ID - handle 'me' as special case for current user
  // Use 'default-user' as fallback if no user ID is available
  let profileUserId;
  if (id === 'me' || !id) {
    profileUserId = clerkUserId || 'default-user';
  } else {
    profileUserId = id;
  }
  
  // Check if viewing own profile
  // If no ID in URL or 'me', it's the current user's profile
  // Or if the profile ID matches the current user ID
  const isOwnProfile = !id || id === 'me' || (profileUserId === clerkUserId) || (!clerkUserId && profileUserId === 'default-user');
  
  // Default profile structure with stats and badges
  const defaultProfileData = useMemo(() => ({
    id: profileUserId,
    name: 'New User',
    title: '',
    affiliation: '',
    location: '',
    joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    avatar: null,
    bio: '',
    email: '',
    website: '',
    socialLinks: {
      github: '',
      twitter: '',
      linkedin: ''
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
  }), [profileUserId]);

  // Fetch profile data on component mount or when user ID changes
  const fetchProfileData = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await fetch(API_ENDPOINTS.PROFILE_GET(profileUserId), {
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Map backend data to frontend format
        setProfileData({
          ...defaultProfileData,
          id: data.user_id,
          name: data.name || defaultProfileData.name,
          title: data.title || '',
          affiliation: data.affiliation || '',
          location: data.location || '',
          avatar: data.avatar_url || null,
          bio: data.bio || '',
          email: data.email || '',
          website: data.website || '',
          socialLinks: {
            github: data.github_url || '',
            twitter: data.twitter_url || '',
            linkedin: data.linkedin_url || ''
          }
        });
      } else if (response.status === 404) {
        // Profile not found, use default data
        setProfileData(defaultProfileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfileData(defaultProfileData);
    }
  }, [getToken, profileUserId, defaultProfileData]);

  useEffect(() => {
    if (profileUserId) {
      fetchProfileData();
    }
  }, [profileUserId, fetchProfileData]);

  // Show loading state while fetching profile
  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

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
      const token = await getToken();
      const response = await fetch(API_ENDPOINTS.PROFILE_AVATAR, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined
        },
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

      // Prepare profile data - filter out empty URL strings
      const profilePayload = {
        user_id: profileData.id,
        name: formData.name,
        title: formData.title || null,
        affiliation: formData.affiliation || null,
        location: formData.location || null,
        bio: formData.bio || null,
        email: formData.email || null,
        website: formData.website || null,
        github: formData.github || null,
        twitter: formData.twitter || null,
        linkedin: formData.linkedin || null
      };
      
      // Add avatar URL if successfully uploaded
      if (avatarUrl) {
        profilePayload.avatar_url = avatarUrl;
      }

      // Call the backend API to save profile
      const token = await getToken();
      const response = await fetch(API_ENDPOINTS.PROFILE_UPDATE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : undefined
        },
        body: JSON.stringify(profilePayload)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      console.log('Profile updated successfully:', result);
      
      // Update local profile data with the saved data
      setProfileData({
        ...profileData,
        name: result.name || profileData.name,
        title: result.title || '',
        affiliation: result.affiliation || '',
        location: result.location || '',
        avatar: result.avatar_url || profileData.avatar,
        bio: result.bio || '',
        email: result.email || '',
        website: result.website || '',
        socialLinks: {
          github: result.github_url || '',
          twitter: result.twitter_url || '',
          linkedin: result.linkedin_url || ''
        }
      });
      
      // Exit edit mode after successful save
      setIsEditMode(false);
      setFormData(null);
      setAvatarPreview(null);
      setAvatarFile(null);
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700 group hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">{label}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </p>
          )}
        </div>
        <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
          <div className="px-8 pb-8 -mt-16">
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
                      className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-2xl cursor-pointer group"
                    >
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : profileData?.avatar ? (
                        <img
                          src={profileData.avatar}
                          alt={profileData.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <User className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-all">
                        <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                    {profileData?.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt={profileData.name}
                        className="w-40 h-40 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-2xl"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : null}
                    {!profileData?.avatar && (
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-4 border-white dark:border-gray-700 shadow-2xl flex items-center justify-center">
                        <User className="w-16 h-16 text-white" />
                      </div>
                    )}
                    {isOwnProfile && (
                      <button 
                        onClick={handleEditClick}
                        className="absolute bottom-2 right-2 p-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
              
              <div className="mt-6 text-center lg:text-left">
                {isEditMode ? (
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData?.name || ''}
                        onChange={handleInputChange}
                        className="text-3xl font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="title"
                        value={formData?.title || ''}
                        onChange={handleInputChange}
                        className="text-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        placeholder="Professional Title"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          name="affiliation"
                          value={formData?.affiliation || ''}
                          onChange={handleInputChange}
                          className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                          placeholder="Organization"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          name="location"
                          value={formData?.location || ''}
                          onChange={handleInputChange}
                          className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                          placeholder="Location"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{profileData.name}</h1>
                    {profileData.title && (
                      <p className="text-xl text-gray-600 dark:text-gray-400 mb-3">{profileData.title}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      {profileData.affiliation && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {profileData.affiliation}
                        </span>
                      )}
                      {profileData.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {profileData.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined {profileData.joinDate}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bio and Links */}
            <div className="flex-1 mt-8 lg:mt-0">
              {isEditMode ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">About Me</label>
                    <textarea
                      name="bio"
                      value={formData?.bio || ''}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
                      placeholder="Share your research interests, achievements, and what drives your work..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Contact Information</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData?.email || ''}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="url"
                          name="website"
                          value={formData?.website || ''}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Social Media</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="url"
                          name="github"
                          value={formData?.github || ''}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                          placeholder="GitHub profile"
                        />
                      </div>
                      <div className="relative">
                        <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="url"
                          name="twitter"
                          value={formData?.twitter || ''}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                          placeholder="Twitter profile"
                        />
                      </div>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="url"
                          name="linkedin"
                          value={formData?.linkedin || ''}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                          placeholder="LinkedIn profile"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {profileData.bio && (
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-3">About</h3>
                      <p className="text-base lg:text-lg text-gray-900 dark:text-gray-100 leading-relaxed">{profileData.bio}</p>
                    </div>
                  )}
                  
                  {/* Contact Links */}
                  {(profileData.email || profileData.website || profileData.socialLinks.github || profileData.socialLinks.twitter || profileData.socialLinks.linkedin) && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Connect</h3>
                      <div className="flex flex-wrap gap-3">
                        {profileData.email && (
                          <a href={`mailto:${profileData.email}`} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">Email</span>
                          </a>
                        )}
                        {profileData.website && (
                          <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
                            <LinkIcon className="w-4 h-4" />
                            <span className="text-sm">Website</span>
                          </a>
                        )}
                        {profileData.socialLinks.github && (
                          <a href={profileData.socialLinks.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 hover:text-white transition-all">
                            <Github className="w-4 h-4" />
                            <span className="text-sm">GitHub</span>
                          </a>
                        )}
                        {profileData.socialLinks.twitter && (
                          <a href={profileData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-400 hover:text-white transition-all">
                            <Twitter className="w-4 h-4" />
                            <span className="text-sm">Twitter</span>
                          </a>
                        )}
                        {profileData.socialLinks.linkedin && (
                          <a href={profileData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                            <Linkedin className="w-4 h-4" />
                            <span className="text-sm">LinkedIn</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Badges */}
              {!isEditMode && profileData.badges && profileData.badges.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Achievements</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.badges.map((badge, index) => (
                      <span key={index} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${badge.color} shadow-sm`}>
                        <badge.icon className="w-4 h-4" />
                        {badge.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                {isOwnProfile ? (
                  isEditMode ? (
                    <>
                      <button 
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Changes
                          </>
                        )}
                      </button>
                      <button 
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    </>
                  ) : null
                ) : (
                  <>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
                      <User className="w-4 h-4" />
                      Follow
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-md hover:shadow-lg">
                      <Mail className="w-4 h-4" />
                      Message
                    </button>
                  </>
                )}
              </div>
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
