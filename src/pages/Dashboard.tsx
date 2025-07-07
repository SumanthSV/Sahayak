import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, 
  FileText, 
  Users, 
  TrendingUp, 
  Clock, 
  Award, 
  Sparkles, 
  Brain,
  Target,
  Calendar,
  BarChart3,
  Zap
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { FirebaseService } from '../services/firebaseService';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const teacherStats = await FirebaseService.getTeacherStats(user.uid);
      setStats(teacherStats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Stories Generated',
      value: stats.contentByType?.story || '0',
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Worksheets Created',
      value: stats.contentByType?.worksheet || '0',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Students Tracked',
      value: stats.totalStudents || '0',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'AI Interactions',
      value: stats.totalContent || '0',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      change: '+25%',
      changeType: 'positive'
    }
  ];

  const quickActions = [
    {
      title: 'Generate New Story',
      description: 'Create culturally relevant stories',
      icon: BookOpen,
      color: 'purple',
      path: '/stories',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Create Worksheet',
      description: 'Generate worksheets from images',
      icon: FileText,
      color: 'blue',
      path: '/worksheets',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Explain Concept',
      description: 'Get simple explanations',
      icon: Brain,
      color: 'green',
      path: '/concepts',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Voice Assessment',
      description: 'AI-powered reading assessment',
      icon: Award,
      color: 'red',
      path: '/assessment',
      gradient: 'from-red-500 to-orange-500'
    }
  ];

  const insights = [
    {
      title: 'Most Popular Subject',
      value: 'Science',
      description: '45% of your content',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      title: 'Average Engagement',
      value: '92%',
      description: 'Student participation rate',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Time Saved',
      value: '15 hrs',
      description: 'This month with AI',
      icon: Clock,
      color: 'text-purple-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome back, {user?.displayName || 'Teacher'}!
            </h1>
            <p className="text-gray-600 mt-2">Here's what's happening in your classroom today</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium"
          >
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.changeType === 'positive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <motion.a
                  key={index}
                  href={action.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="block p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200/50 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${action.gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 group-hover:text-gray-900">{action.title}</p>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-6"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Insights</h2>
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100"
                >
                  <insight.icon className={`w-8 h-8 ${insight.color}`} />
                  <div>
                    <p className="font-semibold text-gray-800">{insight.value}</p>
                    <p className="text-sm text-gray-600">{insight.title}</p>
                    <p className="text-xs text-gray-500">{insight.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {stats.recentActivity.slice(0, 3).map((activity: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      {activity.type === 'story' && <BookOpen className="w-4 h-4 text-white" />}
                      {activity.type === 'worksheet' && <FileText className="w-4 h-4 text-white" />}
                      {activity.type === 'visual-aid' && <Sparkles className="w-4 h-4 text-white" />}
                      {activity.type === 'concept-explanation' && <Brain className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{activity.title}</p>
                      <p className="text-xs text-gray-500">
                        {activity.date ? new Date(activity.date).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-gray-600 text-sm">No recent activities</p>
                <p className="text-xs text-gray-500 mt-1">Start creating content to see your activity here</p>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
              💡 Teaching Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                Use AI-generated stories to make lessons more engaging and culturally relevant
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                Create differentiated worksheets for multi-grade classrooms
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                Use voice assessments to improve reading skills in local languages
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                Generate visual aids that can be easily drawn on blackboards
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;