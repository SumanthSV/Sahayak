"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Gamepad2, Calculator, Puzzle, Type, Target, Sparkles } from "lucide-react"
import toast from "react-hot-toast"
import GameReady from "../components/PageComponents/GamesPage/GameReady"
import GamePlay from "../components/PageComponents/GamesPage/GamePlay"
import {AIService} from "../services/aiService"

interface GameConfig {
  grade: string
  difficulty: "easy" | "medium" | "hard"
}

enum gameType {Math = "math" , Puzzle = "puzzle", Word = "word"}

interface GameData {
  title: string
  instructions: string
  questions: any[]
  timeLimit: number
  totalQuestions: number
}

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<"math" | "puzzle" | "word" | null>(null)
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [isGenerating, setIsGenerating] = useState({
    Math : false,
    Puzzle : false,
    Word : false
  })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    grade: "3",
    difficulty: "medium",
  })

  // const gameTypes = [
  //   {
  //     id: "math",
  //     title: "Math Challenge",
  //     description: "Solve math problems and improve your calculation skills",
  //     icon: Calculator,
  //     color: "from-blue-500 to-cyan-500",
  //     bgColor: "from-blue-50 to-cyan-50",
  //   },
  //   {
  //     id: "puzzle",
  //     title: "Brain Puzzles",
  //     description: "Challenge your mind with word puzzles and riddles",
  //     icon: Puzzle,
  //     color: "from-purple-500 to-pink-500",
  //     bgColor: "from-purple-50 to-pink-50",
  //   },
  //   {
  //     id: "word",
  //     title: "Word Master",
  //     description: "Choose the correct words and build your vocabulary",
  //     icon: Type,
  //     color: "from-green-500 to-emerald-500",
  //     bgColor: "from-green-50 to-emerald-50",
  //   },
  // ]

  const subjects = [
    { value: "math", label: "Mathematics" },
    { value: "science", label: "Science" },
    { value: "english", label: "English" },
    { value: "hindi", label: "Hindi" },
    { value: "social", label: "Social Studies" },
    { value: "evs", label: "Environmental Studies" },
  ]

  const grades = [
    { value: "1", label: "Grade 1" },
    { value: "2", label: "Grade 2" },
    { value: "3", label: "Grade 3" },
    { value: "4", label: "Grade 4" },
    { value: "5", label: "Grade 5" },
    { value: "6", label: "Grade 6" },
    { value: "7", label: "Grade 7" },
    { value: "8", label: "Grade 8" },
  ]

  const generateGame = async (gameType: "math" | "puzzle" | "word") => {
    setIsGenerating(prev => ({ ...prev, [gameType.charAt(0).toUpperCase() + gameType.slice(1)]: true }))
    try {
      const result = await AIService.generateEducationalGame({
        gameType : gameType,
        grade: gameConfig.grade,
        difficulty: gameConfig.difficulty,
      });

      // Use mock data for now
      // const mockData: GameData = {
      //   title: `${gameType} Game for Grade ${gameConfig.grade}`,
      //   instructions: "Follow the prompts and select the correct answers.",
      //   questions: mockMathQuestions,
      //   timeLimit: 20,
      //   totalQuestions: 10,
      // }
      console.log(result)
      setGameData(result)
      setSelectedGame(gameType)
      toast.success("Game generated successfully!")
    } catch (error) {
      console.error("Error generating game:", error)
      toast.error("Failed to generate game. Please try again.")
    } finally {
      setIsGenerating(prev => ({ ...prev, [gameType.charAt(0).toUpperCase() + gameType.slice(1)]: true }))
    }
  }

  const handleStartGame = () => {
    setGameStarted(true)
  }

  const handleBackToGames = () => {
    setSelectedGame(null)
    setGameData(null)
    setGameStarted(false)
  }

  const handleGameComplete = () => {
    setGameStarted(false)
  }

  if (gameStarted && gameData) {
    return <GamePlay gameData={gameData} onGameComplete={handleGameComplete} onBackToGames={handleBackToGames} />
  }

  if (selectedGame && gameData) {
    return (
      <GameReady
        gameData={gameData}
        gameConfig={gameConfig}
        onStartGame={handleStartGame}
        onBackToGames={handleBackToGames}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center"
            >
              <Gamepad2 className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Educational Games
              </h1>
              <p className="text-gray-600">Learn through fun, AI-generated games and challenges</p>
            </div>
          </div>
        </motion.div>

        {/* Game Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Target className="w-5 h-5 text-indigo-600 mr-2" />
            Game Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={gameConfig.subject}
                onChange={(e) => setGameConfig((prev) => ({ ...prev, subject: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
              >
                {subjects.map((subject) => (
                  <option key={subject.value} value={subject.value}>
                    {subject.label}
                  </option>
                ))}
              </select>
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
              <select
                value={gameConfig.grade}
                onChange={(e) => setGameConfig((prev) => ({ ...prev, grade: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
              >
                {grades.map((grade) => (
                  <option key={grade.value} value={grade.value}>
                    {grade.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={gameConfig.difficulty}
                onChange={(e) => setGameConfig((prev) => ({ ...prev, difficulty: e.target.value as any }))}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Game Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
          
              key={"math"}
              initial={{  y: 20 }}
              animate={{  y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 cursor-pointer`}
              onClick={() => !isGenerating.Math && generateGame(gameType.Math)}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center`}
                >
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                {isGenerating.Math ? (
                  <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : null}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">Math Challenge</h3>
              <p className="text-gray-600 text-sm mb-4">Solve math problems and improve your calculation skills</p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isGenerating.Math}
                className={`w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2`}
              >
                {isGenerating.Math ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate & Play</span>
                  </>
                )}
              </motion.button>
            </motion.div>




            <motion.div
          
              key={"puzzle"}
              initial={{  y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 cursor-pointer`}
              onClick={() => !isGenerating.Puzzle && generateGame(gameType.Puzzle)}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center`}
                >
                  <Puzzle className="w-6 h-6 text-white" />
                </div>
                {isGenerating.Puzzle? (
                  <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : null}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">Brain Puzzles</h3>
              <p className="text-gray-600 text-sm mb-4">Challenge your mind with word puzzles and riddles</p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isGenerating.Puzzle}
                className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2`}
              >
                {isGenerating.Puzzle ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate & Play</span>
                  </>
                )}
              </motion.button>
            </motion.div>
            <motion.div
          
              key={"word"}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -5  }}
              className={`bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 cursor-pointer`}
              onClick={() => !isGenerating.Word && generateGame(gameType.Word)}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center`}
                >
                  <Type className="w-6 h-6 text-white" />
                </div>
                {isGenerating.Word ? (
                  <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : null}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">Word Master</h3>
              <p className="text-gray-600 text-sm mb-4">Choose the correct words and build your vocabulary</p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isGenerating.Word}
                className={`w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2`}
              >
                {isGenerating.Word ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate & Play</span>
                  </>
                )}
              </motion.button>
            </motion.div>

          {/* {gameTypes.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`bg-gradient-to-br ${game.bgColor} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 cursor-pointer`}
              onClick={() => !isGenerating && generateGame(game.id as any)}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${game.color} rounded-xl flex items-center justify-center`}
                >
                  <game.icon className="w-6 h-6 text-white" />
                </div>
                {isGenerating ? (
                  <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : null}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">{game.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{game.description}</p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isGenerating}
                className={`w-full bg-gradient-to-r ${game.color} text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate & Play</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          ))} */}
        </div>
      </div>
    </div>
  )
}
