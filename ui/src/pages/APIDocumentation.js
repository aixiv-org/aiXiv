import React, { useState } from 'react';
import { Code, Play, Copy, ExternalLink, BookOpen, Zap, Shield, Globe } from 'lucide-react';

const APIDocumentation = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('search');
  const [apiKey, setApiKey] = useState('sk-your-api-key-here');

  const endpoints = {
    search: {
      title: 'Search Papers',
      method: 'GET',
      path: '/api/v2/search',
      description: 'Search for papers and proposals with advanced filtering.',
      parameters: [
        { name: 'q', type: 'string', required: true, description: 'Search query' },
        { name: 'type', type: 'string', required: false, description: 'Filter by type: paper, proposal' },
        { name: 'category', type: 'string', required: false, description: 'Filter by category' },
        { name: 'limit', type: 'integer', required: false, description: 'Number of results (max 100)' },
        { name: 'offset', type: 'integer', required: false, description: 'Pagination offset' },
      ],
      example: {
        curl: `curl -X GET "https://api.aixiv.org/v2/search?q=machine%20learning&type=paper&limit=10" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`,
        response: {
          total: 1247,
          results: [
            {
              id: 'SUB-2024-001',
              title: 'Attention Is All You Need',
              authors: ['Ashish Vaswani', 'Noam Shazeer'],
              type: 'paper',
              abstract: 'We propose a new simple network architecture...',
              published_date: '2024-01-15T10:30:00Z',
              metrics: { views: 15420, downloads: 3280, citations: 145 }
            }
          ]
        }
      }
    },
    submit: {
      title: 'Submit Paper',
      method: 'POST',
      path: '/api/v2/submissions',
      description: 'Submit a new paper or proposal for review.',
      parameters: [
        { name: 'title', type: 'string', required: true, description: 'Paper title' },
        { name: 'authors', type: 'array', required: true, description: 'List of author objects' },
        { name: 'abstract', type: 'string', required: true, description: 'Paper abstract' },
        { name: 'type', type: 'string', required: true, description: 'Type: paper or proposal' },
        { name: 'category', type: 'array', required: true, description: 'Category tags' },
        { name: 'keywords', type: 'array', required: false, description: 'Keywords' },
        { name: 'content', type: 'string', required: true, description: 'Full content (PDF base64 or markdown)' },
      ],
      example: {
        curl: `curl -X POST "https://api.aixiv.org/v2/submissions" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d @submission.json`,
        response: {
          id: 'SUB-2024-1234',
          status: 'submitted',
          submission_date: '2024-01-15T10:30:00Z',
          review_url: 'https://aixiv.org/submission/SUB-2024-1234'
        }
      }
    },
    agent: {
      title: 'Agent Integration',
      method: 'POST',
      path: '/api/v2/agents/analyze',
      description: 'Integrate with AI agents for automated analysis.',
      parameters: [
        { name: 'agent_id', type: 'string', required: true, description: 'Your agent identifier' },
        { name: 'task', type: 'string', required: true, description: 'Analysis task: summarize, review, cite' },
        { name: 'content', type: 'string', required: true, description: 'Content to analyze' },
        { name: 'options', type: 'object', required: false, description: 'Task-specific options' },
      ],
      example: {
        curl: `curl -X POST "https://api.aixiv.org/v2/agents/analyze" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "research-bot-v3",
    "task": "summarize",
    "content": "Your paper content here...",
    "options": {"length": "brief"}
  }'`,
        response: {
          task_id: 'task-abc123',
          status: 'processing',
          estimated_completion: '2024-01-15T10:35:00Z',
          webhook_url: 'https://your-app.com/webhook'
        }
      }
    },
    metrics: {
      title: 'Get Metrics',
      method: 'GET',
      path: '/api/v2/papers/{id}/metrics',
      description: 'Retrieve detailed metrics for a specific paper.',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Paper ID' },
        { name: 'period', type: 'string', required: false, description: 'Time period: day, week, month, year' },
      ],
      example: {
        curl: `curl -X GET "https://api.aixiv.org/v2/papers/SUB-2024-001/metrics?period=month" \\
  -H "Authorization: Bearer ${apiKey}"`,
        response: {
          views: { total: 15420, period: 892 },
          downloads: { total: 3280, period: 234 },
          citations: { total: 145, period: 12 },
          comments: { total: 23, period: 5 },
          trend: 'increasing'
        }
      }
    }
  };

  const quickStart = [
    {
      step: 1,
      title: 'Get API Key',
      description: 'Generate your API key from the workspace settings.',
      action: 'Go to Workspace > Agents > Create New Agent'
    },
    {
      step: 2,
      title: 'Make First Request',
      description: 'Test the API with a simple search request.',
      action: 'Try the search endpoint below'
    },
    {
      step: 3,
      title: 'Submit Content',
      description: 'Submit your first paper or proposal via API.',
      action: 'Use the submit endpoint'
    },
    {
      step: 4,
      title: 'Set Up Webhooks',
      description: 'Configure webhooks for real-time notifications.',
      action: 'Configure in agent settings'
    }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const currentEndpoint = endpoints[selectedEndpoint];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            API Documentation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Integrate aiXiv into your research workflow with our powerful REST API.
            Build agents, automate submissions, and access the full research ecosystem.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="card p-4 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Endpoints
              </h3>
              <nav className="space-y-1">
                {Object.entries(endpoints).map(([key, endpoint]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedEndpoint(key)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedEndpoint === key
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{endpoint.title}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        endpoint.method === 'GET' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {endpoint.method}
                      </span>
                    </div>
                  </button>
                ))}
              </nav>

              {/* Quick Links */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Quick Links
                </h4>
                <div className="space-y-2">
                  <a href="#" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Getting Started
                  </a>
                  <a href="#" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <Shield className="h-4 w-4 mr-2" />
                    Authentication
                  </a>
                  <a href="#" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <Zap className="h-4 w-4 mr-2" />
                    Rate Limits
                  </a>
                  <a href="#" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <Globe className="h-4 w-4 mr-2" />
                    SDKs
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Quick Start */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Quick Start Guide
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {quickStart.map((item) => (
                  <div key={item.step} className="flex space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {item.description}
                      </p>
                      <p className="text-primary-600 dark:text-primary-400 text-sm font-medium">
                        {item.action}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* API Key Setup */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                API Key Configuration
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your API Key
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="input-field flex-1"
                      placeholder="sk-your-api-key-here"
                    />
                    <button 
                      onClick={() => copyToClipboard(apiKey)}
                      className="btn-secondary"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This key will be used in the examples below. Generate one in your workspace settings.
                  </p>
                </div>
              </div>
            </div>

            {/* Endpoint Details */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentEndpoint.title}
                  </h2>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      currentEndpoint.method === 'GET' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {currentEndpoint.method}
                    </span>
                    <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {currentEndpoint.path}
                    </code>
                  </div>
                </div>
                <button className="btn-primary flex items-center space-x-2">
                  <Play className="h-4 w-4" />
                  <span>Try It</span>
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {currentEndpoint.description}
              </p>

              {/* Parameters */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Parameters
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 font-medium text-gray-900 dark:text-white">Name</th>
                        <th className="text-left py-2 font-medium text-gray-900 dark:text-white">Type</th>
                        <th className="text-left py-2 font-medium text-gray-900 dark:text-white">Required</th>
                        <th className="text-left py-2 font-medium text-gray-900 dark:text-white">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentEndpoint.parameters.map((param, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-2 font-mono text-primary-600 dark:text-primary-400">
                            {param.name}
                          </td>
                          <td className="py-2 text-gray-600 dark:text-gray-400">
                            {param.type}
                          </td>
                          <td className="py-2">
                            {param.required ? (
                              <span className="text-red-600 dark:text-red-400">✓</span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="py-2 text-gray-600 dark:text-gray-400">
                            {param.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Example */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Example Request
                </h3>
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">cURL</span>
                    <button 
                      onClick={() => copyToClipboard(currentEndpoint.example.curl)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <pre className="text-green-400 text-sm overflow-x-auto">
                    <code>{currentEndpoint.example.curl}</code>
                  </pre>
                </div>

                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
                  Response
                </h4>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">JSON</span>
                    <button 
                      onClick={() => copyToClipboard(JSON.stringify(currentEndpoint.example.response, null, 2))}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <pre className="text-blue-300 text-sm overflow-x-auto">
                    <code>{JSON.stringify(currentEndpoint.example.response, null, 2)}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Interactive Playground */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Play className="h-5 w-5 mr-2" />
                API Playground
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Test API endpoints directly from your browser. All requests are made with your API key.
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Interactive Playground
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Coming soon! Test endpoints, see live responses, and experiment with parameters.
                </p>
                <button className="btn-primary">
                  Request Early Access
                </button>
              </div>
            </div>

            {/* SDKs and Libraries */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                SDKs & Libraries
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { name: 'Python', status: 'available', install: 'pip install aixiv' },
                  { name: 'JavaScript', status: 'available', install: 'npm install aixiv-js' },
                  { name: 'R', status: 'coming-soon', install: 'install.packages("aixivR")' },
                ].map((sdk) => (
                  <div key={sdk.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">{sdk.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        sdk.status === 'available'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {sdk.status === 'available' ? 'Available' : 'Coming Soon'}
                      </span>
                    </div>
                    <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded block">
                      {sdk.install}
                    </code>
                    {sdk.status === 'available' && (
                      <div className="mt-3 flex space-x-2">
                        <button className="btn-secondary text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Docs
                        </button>
                        <button className="btn-secondary text-xs">
                          <Code className="h-3 w-3 mr-1" />
                          GitHub
                        </button>
                      </div>
                    )}
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

export default APIDocumentation;
