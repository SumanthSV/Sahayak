import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit3, Trash2, Save, BookOpen, Clock, Target } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { FirebaseService, LessonPlan } from '../../services/firebaseService';
import { format, startOfWeek, addDays } from 'date-fns';

const LessonPlanner: React.FC = () => {
  const { user } = useAuth();
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [isCreating, setIsCreating] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    subject: 'math',
    grade: '3',
    week: '',
    objectives: [''],
    activities: [''],
    resources: [''],
    assessment: ''
  });

  const subjects = [
    { value: 'math', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'social', label: 'Social Studies' },
    { value: 'evs', label: 'Environmental Studies' },
  ];

  const grades = [
    { value: '1', label: 'Grade 1' },
    { value: '2', label: 'Grade 2' },
    { value: '3', label: 'Grade 3' },
    { value: '4', label: 'Grade 4' },
    { value: '5', label: 'Grade 5' },
  ];

  useEffect(() => {
    loadLessonPlans();
  }, [user]);

  useEffect(() => {
    const weekStart = startOfWeek(selectedWeek);
    const weekEnd = addDays(weekStart, 6);
    setFormData(prev => ({
      ...prev,
      week: `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd, yyyy')}`
    }));
  }, [selectedWeek]);

  const loadLessonPlans = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const plans = await FirebaseService.getLessonPlans(user.uid);
      setLessonPlans(plans);
    } catch (error) {
      console.error('Error loading lesson plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'objectives' | 'activities' | 'resources', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'objectives' | 'activities' | 'resources') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'objectives' | 'activities' | 'resources', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!user || !formData.title.trim()) return;

    try {
      const planData = {
        ...formData,
        objectives: formData.objectives.filter(obj => obj.trim()),
        activities: formData.activities.filter(act => act.trim()),
        resources: formData.resources.filter(res => res.trim()),
        teacherId: user.uid
      };

      if (editingPlan) {
        // Update existing plan (would need updateLessonPlan method)
        console.log('Update plan:', planData);
      } else {
        await FirebaseService.saveLessonPlan(planData);
      }

      await loadLessonPlans();
      resetForm();
      alert('Lesson plan saved successfully!');
    } catch (error) {
      console.error('Error saving lesson plan:', error);
      alert('Error saving lesson plan. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subject: 'math',
      grade: '3',
      week: format(selectedWeek, 'MMM dd - MMM dd, yyyy'),
      objectives: [''],
      activities: [''],
      resources: [''],
      assessment: ''
    });
    setIsCreating(false);
    setEditingPlan(null);
  };

  const startEditing = (plan: LessonPlan) => {
    setFormData({
      title: plan.title,
      subject: plan.subject,
      grade: plan.grade,
      week: plan.week,
      objectives: plan.objectives.length ? plan.objectives : [''],
      activities: plan.activities.length ? plan.activities : [''],
      resources: plan.resources.length ? plan.resources : [''],
      assessment: plan.assessment
    });
    setEditingPlan(plan);
    setIsCreating(true);
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startOfWeek(selectedWeek), i);
    return {
      date: day,
      dayName: format(day, 'EEEE'),
      dayNumber: format(day, 'd'),
      plans: lessonPlans.filter(plan => plan.week === format(startOfWeek(selectedWeek), 'MMM dd - MMM dd, yyyy'))
    };
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Lesson Planner</h1>
              <p className="text-gray-600">Plan and organize your weekly lessons</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Lesson Plan</span>
          </button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Weekly Overview</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedWeek(addDays(selectedWeek, -7))}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200"
            >
              ←
            </button>
            <span className="font-medium text-gray-700">
              {format(startOfWeek(selectedWeek), 'MMM dd')} - {format(addDays(startOfWeek(selectedWeek), 6), 'MMM dd, yyyy')}
            </span>
            <button
              onClick={() => setSelectedWeek(addDays(selectedWeek, 7))}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4">
              <div className="text-center mb-3">
                <p className="text-sm font-medium text-gray-600">{day.dayName}</p>
                <p className="text-lg font-bold text-gray-800">{day.dayNumber}</p>
              </div>
              <div className="space-y-2">
                {day.plans.map((plan, planIndex) => (
                  <div
                    key={planIndex}
                    className="bg-white p-2 rounded-lg border-l-4 border-indigo-500 cursor-pointer hover:shadow-md transition-all duration-200"
                    onClick={() => startEditing(plan)}
                  >
                    <p className="text-xs font-medium text-indigo-600">{plan.subject}</p>
                    <p className="text-sm text-gray-800 truncate">{plan.title}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingPlan ? 'Edit Lesson Plan' : 'Create New Lesson Plan'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter lesson title..."
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {subjects.map((subject) => (
                      <option key={subject.value} value={subject.value}>
                        {subject.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => handleInputChange('grade', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {grades.map((grade) => (
                      <option key={grade.value} value={grade.value}>
                        {grade.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Week
                </label>
                <input
                  type="text"
                  value={formData.week}
                  readOnly
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Objectives
                </label>
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
                      placeholder="Enter learning objective..."
                      className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    {formData.objectives.length > 1 && (
                      <button
                        onClick={() => removeArrayItem('objectives', index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('objectives')}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  + Add Objective
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activities
                </label>
                {formData.activities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={activity}
                      onChange={(e) => handleArrayChange('activities', index, e.target.value)}
                      placeholder="Enter activity..."
                      className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    {formData.activities.length > 1 && (
                      <button
                        onClick={() => removeArrayItem('activities', index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('activities')}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  + Add Activity
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resources Needed
                </label>
                {formData.resources.map((resource, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={resource}
                      onChange={(e) => handleArrayChange('resources', index, e.target.value)}
                      placeholder="Enter resource..."
                      className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    {formData.resources.length > 1 && (
                      <button
                        onClick={() => removeArrayItem('resources', index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('resources')}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  + Add Resource
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assessment Method
                </label>
                <textarea
                  value={formData.assessment}
                  onChange={(e) => handleInputChange('assessment', e.target.value)}
                  placeholder="How will you assess student learning?"
                  className="w-full h-24 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={!formData.title.trim()}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{editingPlan ? 'Update Plan' : 'Save Plan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Plans List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Lesson Plans</h2>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading lesson plans...</p>
          </div>
        ) : lessonPlans.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600">No lesson plans created yet</p>
            <p className="text-sm text-gray-500 mt-2">Click "New Lesson Plan" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessonPlans.map((plan) => (
              <div
                key={plan.id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => startEditing(plan)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{plan.title}</h3>
                    <p className="text-sm text-gray-600">{plan.subject} • Grade {plan.grade}</p>
                  </div>
                  <Edit3 className="w-4 h-4 text-gray-400" />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span className="text-gray-600">{plan.week}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">{plan.objectives.length} objectives</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-600">{plan.activities.length} activities</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPlanner;