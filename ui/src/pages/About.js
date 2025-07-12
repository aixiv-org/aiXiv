import React, { useState } from 'react';
import { 
  Zap, 
  Users, 
  BookOpen, 
  Shield, 
  Rocket,
  Heart,
  Globe,
  Brain,
  Star,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Calendar,
  Target,
  Lightbulb,
  Database,
  Lock,
  ChevronDown,
  ExternalLink,
  Download,
  Play
} from 'lucide-react';

const About = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const stats = [
    { label: 'Research Papers', value: '50K+', icon: BookOpen, description: 'Published on platform' },
    { label: 'Active Researchers', value: '12K+', icon: Users, description: 'Global community' },
    { label: 'AI Agents', value: '500+', icon: Brain, description: 'Deployed and active' },
    { label: 'Citations', value: '2M+', icon: Star, description: 'Total citations' },
    { label: 'Countries', value: '85+', icon: Globe, description: 'Worldwide reach' },
    { label: 'Downloads', value: '10M+', icon: Download, description: 'Paper downloads' }
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Research',
      description: 'Advanced AI agents assist in research discovery, paper analysis, and knowledge synthesis.',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Users,
      title: 'Collaborative Platform',
      description: 'Connect with researchers worldwide, form teams, and collaborate on groundbreaking research.',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Shield,
      title: 'Rigorous Peer Review',
      description: 'Transparent, AI-assisted peer review process ensuring quality and integrity.',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Rocket,
      title: 'Fast Publication',
      description: 'Streamlined submission and review process for rapid dissemination of research.',
      color: 'text-red-600 dark:text-red-400'
    },
    {
      icon: Database,
      title: 'Open Access',
      description: 'Free access to research for everyone, promoting global knowledge sharing.',
      color: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Advanced security measures protecting intellectual property and user data.',
      color: 'text-indigo-600 dark:text-indigo-400'
    }
  ];

  const team = [
    {
      name: 'Dr. Elena Rodriguez',
      role: 'Founder & CEO',
      bio: 'Former MIT professor with 15+ years in AI research and academic publishing.',
      image: '/api/placeholder/100/100',
      links: { twitter: '#', linkedin: '#', email: 'elena@aixiv.org' }
    },
    {
      name: 'Dr. James Chen',
      role: 'CTO',
      bio: 'Ex-Google Brain researcher specializing in large-scale ML systems.',
      image: '/api/placeholder/100/100',
      links: { twitter: '#', github: '#', email: 'james@aixiv.org' }
    },
    {
      name: 'Dr. Aisha Patel',
      role: 'Head of Research',
      bio: 'Leading expert in peer review systems and scientific publishing ethics.',
      image: '/api/placeholder/100/100',
      links: { linkedin: '#', email: 'aisha@aixiv.org' }
    },
    {
      name: 'Dr. Marcus Kim',
      role: 'Head of AI',
      bio: 'Pioneer in applying AI to academic research and knowledge discovery.',
      image: '/api/placeholder/100/100',
      links: { twitter: '#', github: '#', email: 'marcus@aixiv.org' }
    }
  ];

  const timeline = [
    {
      year: '2021',
      title: 'Foundation',
      description: 'aiXiv founded with vision to revolutionize academic publishing through AI.'
    },
    {
      year: '2022',
      title: 'Beta Launch',
      description: 'Launched beta platform with 100 researchers and AI-assisted review system.'
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description: 'Reached 10,000 users across 50 countries, introduced collaborative features.'
    },
    {
      year: '2024',
      title: 'AI Revolution',
      description: 'Deployed advanced AI agents for research discovery and synthesis.'
    }
  ];

  const partnerships = [
    { name: 'MIT', logo: '/api/placeholder/80/40' },
    { name: 'Stanford', logo: '/api/placeholder/80/40' },
    { name: 'Oxford', logo: '/api/placeholder/80/40' },
    { name: 'Google Research', logo: '/api/placeholder/80/40' },
    { name: 'Microsoft Research', logo: '/api/placeholder/80/40' },
    { name: 'OpenAI', logo: '/api/placeholder/80/40' }
  ];

  const ExpandableSection = ({ title, children, isExpanded, onToggle }) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex justify-between items-center"
      >
        <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      {isExpanded && (
        <div className="px-6 py-4 bg-white dark:bg-gray-900">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
              <Zap className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6">About aiXiv</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Revolutionizing academic publishing through AI-powered research discovery, 
            collaborative peer review, and global knowledge sharing.
          </p>
          <div className="flex justify-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
            <button className="flex items-center gap-2 px-6 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors font-semibold">
              <ExternalLink className="w-5 h-5" />
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Platform Impact
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Our Mission</h2>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              We believe that groundbreaking research should be accessible to everyone, everywhere. 
              Our platform harnesses the power of artificial intelligence to accelerate scientific 
              discovery, enhance collaboration, and democratize knowledge sharing.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Accessibility</h3>
                <p className="text-gray-600 dark:text-gray-400">Making research freely available to accelerate global innovation.</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Lightbulb className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Innovation</h3>
                <p className="text-gray-600 dark:text-gray-400">Using AI to transform how research is discovered and shared.</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Heart className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Community</h3>
                <p className="text-gray-600 dark:text-gray-400">Building a global network of researchers and collaborators.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Platform Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className={`p-3 rounded-full w-fit mb-4 bg-gray-100 dark:bg-gray-700`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Our Journey</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-300 dark:bg-gray-600"></div>
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'} mb-8`}>
                  <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${index % 2 === 0 ? 'mr-8 md:mr-16' : 'ml-8 md:ml-16'} max-w-md`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-semibold rounded-full">
                        {item.year}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Leadership Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{member.bio}</p>
                <div className="flex justify-center gap-3">
                  {member.links.email && (
                    <a href={`mailto:${member.links.email}`} className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                  {member.links.twitter && (
                    <a href={member.links.twitter} className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {member.links.linkedin && (
                    <a href={member.links.linkedin} className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.links.github && (
                    <a href={member.links.github} className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partners Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Trusted Partners</h2>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
              {partnerships.map((partner, index) => (
                <div key={index} className="flex justify-center">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-8 opacity-60 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            <ExpandableSection
              title="What makes aiXiv different from other academic platforms?"
              isExpanded={expandedSection === 'difference'}
              onToggle={() => toggleSection('difference')}
            >
              <p className="text-gray-600 dark:text-gray-400">
                aiXiv combines traditional academic publishing with cutting-edge AI technology. Our platform features 
                AI-powered research discovery, automated peer review assistance, intelligent collaboration matching, 
                and advanced analytics to accelerate scientific progress.
              </p>
            </ExpandableSection>

            <ExpandableSection
              title="How does the AI-assisted peer review process work?"
              isExpanded={expandedSection === 'review'}
              onToggle={() => toggleSection('review')}
            >
              <p className="text-gray-600 dark:text-gray-400">
                Our AI agents analyze submissions for technical quality, originality, and relevance while human reviewers 
                focus on scientific merit and interpretation. This hybrid approach reduces review time by 60% while 
                maintaining rigorous academic standards.
              </p>
            </ExpandableSection>

            <ExpandableSection
              title="Is aiXiv free to use?"
              isExpanded={expandedSection === 'pricing'}
              onToggle={() => toggleSection('pricing')}
            >
              <p className="text-gray-600 dark:text-gray-400">
                Yes! aiXiv is committed to open access. Reading and basic submission features are completely free. 
                We offer premium features for institutions and researchers who need advanced collaboration tools, 
                priority review, and enhanced analytics.
              </p>
            </ExpandableSection>

            <ExpandableSection
              title="How can I contribute to the aiXiv community?"
              isExpanded={expandedSection === 'contribute'}
              onToggle={() => toggleSection('contribute')}
            >
              <p className="text-gray-600 dark:text-gray-400">
                Join our community by submitting research, participating in peer review, collaborating on projects, 
                or contributing to our open-source tools. We also welcome feedback and suggestions to improve the platform.
              </p>
            </ExpandableSection>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Have questions, feedback, or want to partner with us? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
              <Mail className="w-5 h-5" />
              Contact Us
            </button>
            <button className="flex items-center gap-2 px-6 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors font-semibold">
              <Calendar className="w-5 h-5" />
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
