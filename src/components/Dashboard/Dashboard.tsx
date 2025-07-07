import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Users, TrendingUp, Clock, Award, Sparkles, Brain } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { FirebaseService } from '../../services/firebaseService';

const Dashboard: React.FC = () => {
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

  const defaultStats = [
    {
      title: 'Stories Generated',
      value: stats.contentByType?.story || '0',
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50'
    },
    {
      title: 'Worksheets Created',
      value: stats.contentByType?.worksheet || '0',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    {
      title: 'Students Tracked',
      value: stats.totalStudents || '0',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      title: 'Total Content',
      value: stats.totalContent || '0',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50'
    }
  ];

  const quickActions = [
    {
      title: 'Generate New Story',
      description: 'Create culturally relevant stories',
      icon: BookOpen,
      color: 'purple',
      action: 'stories'
    },
    {
      title: 'Create Worksheet',
      description: 'Generate worksheets from images',
      icon: FileText,
      color: 'blue',
      action: 'worksheets'
    },
    {
      title: 'Explain Concept',
      description: 'Get simple explanations',
      icon: Brain,
      color: 'green',
      action: 'concepts'
    },
    {
      title: 'Start Assessment',
      description: 'Voice-based reading assessment',
      icon: Award,
      color: 'red',
      action: 'assessment'
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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, Teacher!</h1>
        <p className="text-gray-600">Here's what's happening in your classroom today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {defaultStats.map((stat, index) => (
          <div key={index} className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
            
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.map((activity: any, index: number) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      {activity.type === 'story' && <BookOpen className="w-5 h-5 text-white" />}
                      {activity.type === 'worksheet' && <FileText className="w-5 h-5 text-white" />}
                      {activity.type === 'visual-aid' && <Sparkles className="w-5 h-5 text-white" />}
                      {activity.type === 'concept-explanation' && <Brain className="w-5 h-5 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{activity.title}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <p className="text-sm text-gray-500">
                          {activity.date ? new Date(activity.date).toLocaleDateString() : 'Recently'}
                        </p>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-sm text-purple-600 font-medium capitalize">
                          {activity.type.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600">No recent activities</p>
                <p className="text-sm text-gray-500 mt-2">Start creating content to see your activity here</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`w-full p-4 rounded-xl border-2 border-transparent hover:border-${action.color}-200 bg-${action.color}-50 hover:bg-${action.color}-100 transition-all duration-200 text-left group`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-${action.color}-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`font-medium text-${action.color}-800`}>{action.title}</p>
                      <p className={`text-sm text-${action.color}-600`}>{action.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Distribution */}
          {stats.contentByType && Object.keys(stats.contentByType).length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Content Distribution</h3>
              <div className="space-y-3">
                {Object.entries(stats.contentByType).map(([type, count]: [string, any]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{type.replace('-', ' ')}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${(count / stats.totalContent) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-800">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Students by Grade */}
          {stats.studentsByGrade && Object.keys(stats.studentsByGrade).length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Students by Grade</h3>
              <div className="space-y-3">
                {Object.entries(stats.studentsByGrade).map(([grade, count]: [string, any]) => (
                  <div key={grade} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Grade {grade}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${(count / stats.totalStudents) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-800">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Teaching Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Use AI-generated stories to make lessons more engaging</li>
              <li>• Create worksheets from textbook images to save time</li>
              <li>• Track student progress regularly for better outcomes</li>
              <li>• Use voice assessments to improve reading skills</li>
              <li>• Plan lessons weekly for better organization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;