import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit3, Trash2, Search, BookOpen, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { FirebaseService, Student } from '../../services/firebaseService';

interface StudentProgress {
  subject: string;
  score: number;
  lastAssessment: string;
  trend: 'up' | 'down' | 'stable';
}

const StudentTracker: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    grade: '3',
    rollNumber: '',
    subjects: [] as string[]
  });

  const grades = [
    { value: 'all', label: 'All Grades' },
    { value: '1', label: 'Grade 1' },
    { value: '2', label: 'Grade 2' },
    { value: '3', label: 'Grade 3' },
    { value: '4', label: 'Grade 4' },
    { value: '5', label: 'Grade 5' },
  ];

  const subjects = [
    'Mathematics',
    'Science',
    'English',
    'Hindi',
    'Social Studies',
    'Environmental Studies'
  ];

  // Mock progress data
  const getStudentProgress = (studentId: string): StudentProgress[] => {
    return [
      { subject: 'Math', score: 85, lastAssessment: '2 days ago', trend: 'up' },
      { subject: 'Science', score: 78, lastAssessment: '1 week ago', trend: 'stable' },
      { subject: 'English', score: 92, lastAssessment: '3 days ago', trend: 'up' },
      { subject: 'Hindi', score: 76, lastAssessment: '5 days ago', trend: 'down' },
    ];
  };

  useEffect(() => {
    loadStudents();
  }, [user]);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, selectedGrade]);

  const loadStudents = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const studentList = await FirebaseService.getStudents(user.uid);
      setStudents(studentList);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGrade !== 'all') {
      filtered = filtered.filter(student => student.grade === selectedGrade);
    }

    setFilteredStudents(filtered);
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleSaveStudent = async () => {
    if (!user || !formData.name.trim() || !formData.rollNumber.trim()) return;

    try {
      const studentData = {
        ...formData,
        teacherId: user.uid
      };

      if (editingStudent) {
        await FirebaseService.updateStudent(editingStudent.id, studentData);
      } else {
        await FirebaseService.addStudent(studentData);
      }

      await loadStudents();
      resetForm();
      alert('Student saved successfully!');
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Error saving student. Please try again.');
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      await FirebaseService.deleteStudent(studentId);
      await loadStudents();
      alert('Student deleted successfully!');
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Error deleting student. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      grade: '3',
      rollNumber: '',
      subjects: []
    });
    setIsAddingStudent(false);
    setEditingStudent(null);
  };

  const startEditing = (student: Student) => {
    setFormData({
      name: student.name,
      grade: student.grade,
      rollNumber: student.rollNumber,
      subjects: student.subjects
    });
    setEditingStudent(student);
    setIsAddingStudent(true);
  };

  const getOverallStats = () => {
    const totalStudents = students.length;
    const gradeDistribution = students.reduce((acc, student) => {
      acc[student.grade] = (acc[student.grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalStudents, gradeDistribution };
  };

  const stats = getOverallStats();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Student Tracker</h1>
              <p className="text-gray-600">Monitor student progress and manage classroom data</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddingStudent(true)}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Students</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalStudents}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {Object.entries(stats.gradeDistribution).map(([grade, count]) => (
          <div key={grade} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Grade {grade}</p>
                <p className="text-3xl font-bold text-gray-800">{count}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search students..."
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent w-64"
              />
            </div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {grades.map((grade) => (
                <option key={grade.value} value={grade.value}>
                  {grade.label}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-600">
            Showing {filteredStudents.length} of {students.length} students
          </p>
        </div>
      </div>

      {/* Add/Edit Student Form */}
      {isAddingStudent && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter student name..."
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => handleInputChange('grade', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    {grades.slice(1).map((grade) => (
                      <option key={grade.value} value={grade.value}>
                        {grade.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={formData.rollNumber}
                    onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                    placeholder="Enter roll number..."
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subjects
              </label>
              <div className="grid grid-cols-2 gap-2">
                {subjects.map((subject) => (
                  <label key={subject} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.subjects.includes(subject)}
                      onChange={() => handleSubjectToggle(subject)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">{subject}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveStudent}
              disabled={!formData.name.trim() || !formData.rollNumber.trim()}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-teal-600 hover:to-cyan-600 transition-all duration-200"
            >
              {editingStudent ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </div>
      )}

      {/* Students List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Students</h2>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600">
              {students.length === 0 ? 'No students added yet' : 'No students match your search'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {students.length === 0 ? 'Click "Add Student" to get started' : 'Try adjusting your search criteria'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStudents.map((student) => {
              const progress = getStudentProgress(student.id);
              const averageScore = Math.round(progress.reduce((sum, p) => sum + p.score, 0) / progress.length);
              
              return (
                <div key={student.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{student.name}</h3>
                      <p className="text-gray-600">Grade {student.grade} • Roll #{student.rollNumber}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEditing(student)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Overall Performance</span>
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold text-gray-800">{averageScore}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: `${averageScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">Subject Progress:</p>
                    {progress.map((prog, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{prog.subject}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{prog.score}%</span>
                          <div className="flex items-center">
                            {prog.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                            {prog.trend === 'down' && <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />}
                            {prog.trend === 'stable' && <div className="w-4 h-4 bg-gray-400 rounded-full"></div>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Subjects: {student.subjects.join(', ') || 'None assigned'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTracker;