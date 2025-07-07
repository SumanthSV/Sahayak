import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  enableNetwork,
  disableNetwork,
  serverTimestamp,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User,
  updateProfile
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../config/firebase';

export interface Teacher {
  id: string;
  email: string;
  name: string;
  school: string;
  subjects: string[];
  experience: string;
  phone?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  rollNumber: string;
  teacherId: string;
  subjects: string[];
  createdAt: Date;
  lastAssessment?: Date;
  performance?: Record<string, number>;
}

export interface GeneratedContent {
  id: string;
  type: 'story' | 'worksheet' | 'visual-aid' | 'concept-explanation';
  title: string;
  content: string;
  subject: string;
  grade: string;
  language: string;
  teacherId: string;
  createdAt: Date;
  isOffline?: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  grade: string;
  week: string;
  objectives: string[];
  activities: string[];
  resources: string[];
  assessment: string;
  teacherId: string;
  createdAt: Date;
  status?: 'draft' | 'active' | 'completed';
}

export interface Assessment {
  id: string;
  studentId: string;
  teacherId: string;
  type: 'reading' | 'comprehension' | 'speaking';
  subject: string;
  score: number;
  feedback: string;
  audioUrl?: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export class FirebaseService {
  // Authentication
  static async signIn(email: string, password: string): Promise<User> {
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login
    if (result.user) {
      await this.updateLastLogin(result.user.uid);
    }
    
    return result.user;
  }

  static async signUp(email: string, password: string, teacherData: Partial<Teacher>): Promise<User> {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile
    await updateProfile(result.user, {
      displayName: teacherData.name
    });
    
    // Create teacher profile in Firestore
    await addDoc(collection(db, 'teachers'), {
      ...teacherData,
      email,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
    
    return result.user;
  }

  static async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  // Teacher Profile Management
  static async getTeacherProfile(userId: string): Promise<Teacher | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const q = query(collection(db, 'teachers'), where('email', '==', user.email));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLogin: data.lastLogin?.toDate() || new Date()
        } as Teacher;
      }
      return null;
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
      return null;
    }
  }

  static async updateTeacherProfile(teacherId: string, updates: Partial<Teacher>): Promise<void> {
    await updateDoc(doc(db, 'teachers', teacherId), {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  private static async updateLastLogin(userId: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, 'teachers'), where('email', '==', user.email));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const teacherDoc = snapshot.docs[0];
        await updateDoc(teacherDoc.ref, {
          lastLogin: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  // Content Management
  static async saveGeneratedContent(content: Omit<GeneratedContent, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'generated_content'), {
        ...content,
        createdAt: serverTimestamp(),
        tags: content.tags || [],
        metadata: content.metadata || {}
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving content:', error);
      // Save to local storage if offline
      const offlineContent = { 
        ...content, 
        id: Date.now().toString(), 
        isOffline: true,
        createdAt: new Date()
      };
      this.saveToLocalStorage('offline_content', offlineContent);
      return offlineContent.id;
    }
  }

  static async getGeneratedContent(teacherId: string, type?: string): Promise<GeneratedContent[]> {
    try {
      let q = query(
        collection(db, 'generated_content'),
        where('teacherId', '==', teacherId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      if (type) {
        q = query(
          collection(db, 'generated_content'),
          where('teacherId', '==', teacherId),
          where('type', '==', type),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
      }

      const snapshot = await getDocs(q);
      const content = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        } as GeneratedContent;
      });

      // Merge with offline content
      const offlineContent = this.getFromLocalStorage('offline_content') || [];
      return [...content, ...offlineContent];
    } catch (error) {
      console.error('Error fetching content:', error);
      // Return offline content if network unavailable
      return this.getFromLocalStorage('offline_content') || [];
    }
  }

  static async deleteGeneratedContent(contentId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'generated_content', contentId));
    } catch (error) {
      console.error('Error deleting content:', error);
      // Queue for deletion when online
      this.saveToLocalStorage('pending_deletions', { type: 'content', id: contentId });
    }
  }

  // Student Management
  static async addStudent(student: Omit<Student, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'students'), {
        ...student,
        createdAt: serverTimestamp(),
        performance: {}
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding student:', error);
      const offlineStudent = { 
        ...student, 
        id: Date.now().toString(),
        createdAt: new Date(),
        performance: {}
      };
      this.saveToLocalStorage('offline_students', offlineStudent);
      return offlineStudent.id;
    }
  }

  static async getStudents(teacherId: string): Promise<Student[]> {
    try {
      const q = query(
        collection(db, 'students'),
        where('teacherId', '==', teacherId),
        orderBy('name')
      );
      const snapshot = await getDocs(q);
      const students = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastAssessment: data.lastAssessment?.toDate()
        } as Student;
      });

      // Merge with offline students
      const offlineStudents = this.getFromLocalStorage('offline_students') || [];
      return [...students, ...offlineStudents];
    } catch (error) {
      console.error('Error fetching students:', error);
      return this.getFromLocalStorage('offline_students') || [];
    }
  }

  static async updateStudent(studentId: string, updates: Partial<Student>): Promise<void> {
    try {
      await updateDoc(doc(db, 'students', studentId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating student:', error);
      // Queue update for when online
      this.saveToLocalStorage('pending_updates', { 
        type: 'student', 
        id: studentId, 
        updates 
      });
    }
  }

  static async deleteStudent(studentId: string): Promise<void> {
    try {
      // Delete student and all related assessments
      const batch = writeBatch(db);
      
      // Delete student
      batch.delete(doc(db, 'students', studentId));
      
      // Delete related assessments
      const assessmentsQuery = query(
        collection(db, 'assessments'),
        where('studentId', '==', studentId)
      );
      const assessmentsSnapshot = await getDocs(assessmentsQuery);
      assessmentsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error deleting student:', error);
      this.saveToLocalStorage('pending_deletions', { type: 'student', id: studentId });
    }
  }

  // Assessment Management
  static async saveAssessment(assessment: Omit<Assessment, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'assessments'), {
        ...assessment,
        createdAt: serverTimestamp()
      });

      // Update student's last assessment date
      await this.updateStudent(assessment.studentId, {
        lastAssessment: new Date()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error saving assessment:', error);
      const offlineAssessment = {
        ...assessment,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      this.saveToLocalStorage('offline_assessments', offlineAssessment);
      return offlineAssessment.id;
    }
  }

  static async getAssessments(teacherId: string, studentId?: string): Promise<Assessment[]> {
    try {
      let q = query(
        collection(db, 'assessments'),
        where('teacherId', '==', teacherId),
        orderBy('createdAt', 'desc'),
        limit(100)
      );

      if (studentId) {
        q = query(
          collection(db, 'assessments'),
          where('teacherId', '==', teacherId),
          where('studentId', '==', studentId),
          orderBy('createdAt', 'desc')
        );
      }

      const snapshot = await getDocs(q);
      const assessments = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        } as Assessment;
      });

      // Merge with offline assessments
      const offlineAssessments = this.getFromLocalStorage('offline_assessments') || [];
      return [...assessments, ...offlineAssessments];
    } catch (error) {
      console.error('Error fetching assessments:', error);
      return this.getFromLocalStorage('offline_assessments') || [];
    }
  }

  // Lesson Plans
  static async saveLessonPlan(plan: Omit<LessonPlan, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'lesson_plans'), {
        ...plan,
        createdAt: serverTimestamp(),
        status: plan.status || 'draft'
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving lesson plan:', error);
      const offlinePlan = { 
        ...plan, 
        id: Date.now().toString(),
        createdAt: new Date(),
        status: plan.status || 'draft'
      };
      this.saveToLocalStorage('offline_lesson_plans', offlinePlan);
      return offlinePlan.id;
    }
  }

  static async getLessonPlans(teacherId: string): Promise<LessonPlan[]> {
    try {
      const q = query(
        collection(db, 'lesson_plans'),
        where('teacherId', '==', teacherId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const plans = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        } as LessonPlan;
      });

      // Merge with offline plans
      const offlinePlans = this.getFromLocalStorage('offline_lesson_plans') || [];
      return [...plans, ...offlinePlans];
    } catch (error) {
      console.error('Error fetching lesson plans:', error);
      return this.getFromLocalStorage('offline_lesson_plans') || [];
    }
  }

  static async updateLessonPlan(planId: string, updates: Partial<LessonPlan>): Promise<void> {
    try {
      await updateDoc(doc(db, 'lesson_plans', planId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating lesson plan:', error);
      this.saveToLocalStorage('pending_updates', {
        type: 'lesson_plan',
        id: planId,
        updates
      });
    }
  }

  // File Upload
  static async uploadFile(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Analytics and Statistics
  static async getTeacherStats(teacherId: string): Promise<Record<string, any>> {
    try {
      const [content, students, assessments, plans] = await Promise.all([
        this.getGeneratedContent(teacherId),
        this.getStudents(teacherId),
        this.getAssessments(teacherId),
        this.getLessonPlans(teacherId)
      ]);

      return {
        totalContent: content.length,
        totalStudents: students.length,
        totalAssessments: assessments.length,
        totalLessonPlans: plans.length,
        contentByType: content.reduce((acc, item) => {
          acc[item.type] = (acc[item.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        studentsByGrade: students.reduce((acc, student) => {
          acc[student.grade] = (acc[student.grade] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        recentActivity: content.slice(0, 5).map(item => ({
          type: item.type,
          title: item.title,
          date: item.createdAt
        }))
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {};
    }
  }

  // Offline Support
  static async enableOfflineMode(): Promise<void> {
    try {
      await disableNetwork(db);
    } catch (error) {
      console.error('Error enabling offline mode:', error);
    }
  }

  static async enableOnlineMode(): Promise<void> {
    try {
      await enableNetwork(db);
      await this.syncOfflineData();
    } catch (error) {
      console.error('Error enabling online mode:', error);
    }
  }

  // Local Storage Helpers
  private static saveToLocalStorage(key: string, data: any): void {
    try {
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(data);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private static getFromLocalStorage(key: string): any[] {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  private static clearLocalStorage(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // Sync offline data when back online
  static async syncOfflineData(): Promise<void> {
    try {
      const offlineContent = this.getFromLocalStorage('offline_content');
      const offlineStudents = this.getFromLocalStorage('offline_students');
      const offlinePlans = this.getFromLocalStorage('offline_lesson_plans');
      const offlineAssessments = this.getFromLocalStorage('offline_assessments');
      const pendingUpdates = this.getFromLocalStorage('pending_updates');
      const pendingDeletions = this.getFromLocalStorage('pending_deletions');

      // Sync content
      for (const content of offlineContent) {
        try {
          const { id, isOffline, ...contentData } = content;
          await addDoc(collection(db, 'generated_content'), {
            ...contentData,
            createdAt: serverTimestamp()
          });
        } catch (error) {
          console.error('Failed to sync content:', error);
        }
      }

      // Sync students
      for (const student of offlineStudents) {
        try {
          const { id, ...studentData } = student;
          await addDoc(collection(db, 'students'), {
            ...studentData,
            createdAt: serverTimestamp()
          });
        } catch (error) {
          console.error('Failed to sync student:', error);
        }
      }

      // Sync lesson plans
      for (const plan of offlinePlans) {
        try {
          const { id, ...planData } = plan;
          await addDoc(collection(db, 'lesson_plans'), {
            ...planData,
            createdAt: serverTimestamp()
          });
        } catch (error) {
          console.error('Failed to sync lesson plan:', error);
        }
      }

      // Sync assessments
      for (const assessment of offlineAssessments) {
        try {
          const { id, ...assessmentData } = assessment;
          await addDoc(collection(db, 'assessments'), {
            ...assessmentData,
            createdAt: serverTimestamp()
          });
        } catch (error) {
          console.error('Failed to sync assessment:', error);
        }
      }

      // Process pending updates
      for (const update of pendingUpdates) {
        try {
          const { type, id, updates } = update;
          const collectionName = type === 'student' ? 'students' : 
                                type === 'lesson_plan' ? 'lesson_plans' : 'generated_content';
          await updateDoc(doc(db, collectionName, id), {
            ...updates,
            updatedAt: serverTimestamp()
          });
        } catch (error) {
          console.error('Failed to process pending update:', error);
        }
      }

      // Process pending deletions
      for (const deletion of pendingDeletions) {
        try {
          const { type, id } = deletion;
          const collectionName = type === 'student' ? 'students' : 
                                type === 'content' ? 'generated_content' : 'lesson_plans';
          await deleteDoc(doc(db, collectionName, id));
        } catch (error) {
          console.error('Failed to process pending deletion:', error);
        }
      }

      // Clear synced data
      this.clearLocalStorage('offline_content');
      this.clearLocalStorage('offline_students');
      this.clearLocalStorage('offline_lesson_plans');
      this.clearLocalStorage('offline_assessments');
      this.clearLocalStorage('pending_updates');
      this.clearLocalStorage('pending_deletions');

      console.log('Offline data synced successfully');
    } catch (error) {
      console.error('Error syncing offline data:', error);
    }
  }

  // Real-time listeners
  static subscribeToContent(teacherId: string, callback: (content: GeneratedContent[]) => void): () => void {
    const q = query(
      collection(db, 'generated_content'),
      where('teacherId', '==', teacherId),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const content = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        } as GeneratedContent;
      });
      callback(content);
    });
  }

  static subscribeToStudents(teacherId: string, callback: (students: Student[]) => void): () => void {
    const q = query(
      collection(db, 'students'),
      where('teacherId', '==', teacherId),
      orderBy('name')
    );

    return onSnapshot(q, (snapshot) => {
      const students = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastAssessment: data.lastAssessment?.toDate()
        } as Student;
      });
      callback(students);
    });
  }
}