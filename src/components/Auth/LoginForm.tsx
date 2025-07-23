import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, BookOpen, Sparkles, UserPlus, Loader2, Notebook as Robot, Wand2 } from 'lucide-react';
import { FirebaseService } from '../../services/firebaseService';
// import { AnimatedBackground } from './AnimatedBackground';
// import { ThreeDScene } from './ThreeDScene';
import Logo2 from '../../assets/Logo2.png'
import toast from 'react-hot-toast';

interface FuturisticLoginFormProps {
  onShowSignup: () => void;
}

const FuturisticLoginForm: React.FC<FuturisticLoginFormProps> = ({ onShowSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      await FirebaseService.signIn(email, password);
      toast.success('Welcome back!');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen dark:bg-gradient-to-br dark:from-gray-950 via-60%  dark:via-purple-950/10  dark:to-black ">
      {/* Animated Background */}
      {/*<AnimatedBackground />*/}
      
      {/* 3D Scene */}
      {/* <Suspense fallback={<div className="absolute inset-0 " />}>
        <ThreeDScene sceneType="login" />
      </Suspense> */}

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center justify-center p-4 ">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row  items-center mt-14">
          
          {/* Left Panel - 3D Scene Overlay */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden  lg:flex flex-col items-center justify-center text-center text-white space-y-6"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="w-24 h-24  rounded-3xl flex items-center justify-center ">
                {/* <Robot className="w-16 h-16 text-white" /> */}
                <img src={Logo2} alt="" />
              </div>
              {/* <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-3xl opacity-20 blur-xl animate-pulse" /> */}
            </motion.div>
            
            <div className="space-y-4">
              <h1 className="text-2xl font-bold dark:text-white">
                Sahayak AI
              </h1>
              <p className="text-sm text-gray-200 max-w-md">
                Step into the future of education with AI-powered teaching assistance
              </p>
              {/* <div className="flex items-center justify-center space-x-2 text-cyan-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="text-sm">Powered by Advanced AI</span>
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div> */}
            </div>
          </motion.div>

          {/* Right Panel - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full max-w-[26rem] mx-auto"
          >
            <div className="backdrop-blur-xl dark:bg-transparent rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 relative overflow-hidden">
              {/* Glassmorphism overlay */}
              {/* <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" /> */}
              
              {/* Neon border effect */}
              {/* <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-sm" /> */}
              
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="text-center mb-8"
                >
                  {/* <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/50"
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </motion.div> */}
                  <h2 className="text-2xl font-bold dark:text-white text-zinc-800 mb-2">Welcome Back</h2>
                  <p className="dark:text-gray-300 text-gray-400 text-sm">Sign in to your AI teaching assistant</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors" />
                      {/* <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-2 text-sm bg-green-500 border border-white/20 rounded-xl text-white  transition-all duration-300"
                        placeholder="Enter your email"
                        required
                      /> */}
                      <input type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                           required
                      className='dark:bg-transparent w-full pl-12 pr-4 py-2 text-sm  border border-white/20 rounded-xl text-white  transition-all duration-300' />
                      {/* <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-purple-500/0 to-pink-500/0 group-focus-within:from-cyan-500/20 group-focus-within:via-purple-500/20 group-focus-within:to-pink-500/20 transition-all duration-300 pointer-events-none" /> */}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors" />
                      {/* <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-2 bg-red-400 text-sm backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 transition-all duration-300"
                        placeholder="Enter your password"
                        required
                      /> */}
                        {/* <input type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="bg-transparent "
                        required
                       /> */}
                       <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="dark:bg-transparent w-full pl-12 pr-12 py-2 text-sm backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 transition-all duration-300"
                        />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </motion.button>
                      <div className="absolute inset-0 rounded-xl  transition-all duration-300 pointer-events-none" />
                    </div>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-zinc-900  dark:text-white font-semibold py-2 border border-zinc-500 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center space-x-2">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-5 h-5" />
                          <span>Sign In</span>
                        </>
                      )}
                    </div>
                  </motion.button>
                </form>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="mt-8"
                >
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-transparent text-gray-300 text-xs">New to Sahayak AI?</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onShowSignup}
                    className="w-full mt-6 border border-zinc-500 dark:text-zinc-900 dark:bg-zinc-100 text-zinc-100 bg-zinc-800 font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center space-x-2">
                      <UserPlus className="w-4 h-4" />
                      <span className='text-sm'>Create an Account</span>
                    </div>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FuturisticLoginForm;