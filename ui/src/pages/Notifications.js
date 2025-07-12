import React, { useState } from 'react';
import { Bell, Check, X, Clock, MessageSquare, FileText, Bot, ChevronRight } from 'lucide-react';

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'review',
      title: 'New review assigned',
      message: 'You have been assigned to review "Deep Learning for Climate Modeling"',
      timestamp: '2 hours ago',
      read: false,
      category: 'today',
      actionUrl: '/workspace/reviews',
      actionText: 'Accept Review',
    },
    {
      id: '2',
      type: 'submission',
      title: 'Paper status updated',
      message: 'Your paper "Neural Architecture Search" has been published',
      timestamp: '4 hours ago',
      read: true,
      category: 'today',
      actionUrl: '/submission/SUB-2024-001',
      actionText: 'View Paper',
    },
    {
      id: '3',
      type: 'agent',
      title: 'Agent activity alert',
      message: 'ResearchBot v3.2 has discovered 5 new relevant papers',
      timestamp: '6 hours ago',
      read: false,
      category: 'today',
      actionUrl: '/workspace/agents',
      actionText: 'View Results',
    },
    {
      id: '4',
      type: 'comment',
      title: 'New comment on your paper',
      message: 'Dr. Sarah Chen commented on "Federated Learning Framework"',
      timestamp: 'Yesterday',
      read: true,
      category: 'yesterday',
      actionUrl: '/submission/SUB-2024-002#comments',
      actionText: 'View Comment',
    },
    {
      id: '5',
      type: 'collaboration',
      title: 'Collaboration request',
      message: 'Prof. Michael Zhang wants to collaborate on your proposal',
      timestamp: 'Yesterday',
      read: false,
      category: 'yesterday',
      actionUrl: '/workspace/submissions',
      actionText: 'View Request',
    },
    {
      id: '6',
      type: 'system',
      title: 'Weekly digest available',
      message: 'Your weekly research summary is ready',
      timestamp: '3 days ago',
      read: true,
      category: 'this-week',
      actionUrl: '/workspace/dashboard',
      actionText: 'View Digest',
    },
  ]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'review': return MessageSquare;
      case 'submission': return FileText;
      case 'agent': return Bot;
      case 'comment': return MessageSquare;
      case 'collaboration': return FileText;
      case 'system': return Bell;
      default: return Bell;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'review': return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400';
      case 'submission': return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400';
      case 'agent': return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400';
      case 'comment': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400';
      case 'collaboration': return 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400';
      case 'system': return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const groupedNotifications = filteredNotifications.reduce((groups, notif) => {
    const category = notif.category;
    if (!groups[category]) groups[category] = [];
    groups[category].push(notif);
    return groups;
  }, {});

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Stay updated with your research activities
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  {unreadCount} unread
                </span>
              )}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={markAllAsRead}
              className="btn-secondary text-sm flex items-center space-x-2"
            >
              <Check className="h-4 w-4" />
              <span>Mark All Read</span>
            </button>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field w-32"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>

        {/* Preferences Card */}
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Notification Preferences
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Delivery Method</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Browser notifications</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Email notifications</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">SMS notifications</span>
                </label>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Email Digest</h4>
              <select className="input-field w-full">
                <option>Daily digest</option>
                <option>Weekly digest</option>
                <option>Monthly digest</option>
                <option>No digest</option>
              </select>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Event Types</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Review assignments</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Submission updates</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Agent activities</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-8">
          {Object.entries(groupedNotifications).map(([category, categoryNotifications]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 capitalize">
                {category.replace('-', ' ')}
              </h3>
              
              <div className="space-y-3">
                {categoryNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  
                  return (
                    <div
                      key={notification.id}
                      className={`card p-4 transition-all duration-200 ${
                        notification.read 
                          ? 'opacity-75' 
                          : 'ring-2 ring-primary-200 dark:ring-primary-800'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {notification.timestamp}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                  title="Mark as read"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}
                              
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete notification"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          {notification.actionUrl && (
                            <div className="mt-3">
                              <button className="btn-primary text-sm flex items-center space-x-2">
                                <span>{notification.actionText}</span>
                                <ChevronRight className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="card p-12 text-center">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No notifications
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === 'unread' 
                ? "You're all caught up! No unread notifications."
                : filter === 'read'
                ? "No read notifications found."
                : "No notifications to display."
              }
            </p>
          </div>
        )}

        {/* Keyboard Shortcuts Help */}
        <div className="mt-8 card p-4 bg-blue-50 dark:bg-blue-900/20">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Keyboard Shortcuts</h4>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <div><kbd className="px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-xs">A</kbd> - Mark all as read</div>
            <div><kbd className="px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-xs">↑/↓</kbd> - Navigate notifications</div>
            <div><kbd className="px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-xs">Enter</kbd> - Open selected notification</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
