"use client"

import { useState, useEffect } from "react"

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8  dark:bg-gradient-to-b  dark:from-gray-950  dark:via-purple-900/10 dark:to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Headline */}
          <h1
            className={`text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="bg-gradient-to-b from-purple-500 via-purple-600 to-purple-800 bg-clip-text text-transparent">
              Empower Every Lesson
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">with AI</span>
          </h1>

          {/* Sub-headline */}
          <p
            className={`text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Your smart co-teacher for lesson planning, real-time feedback, and student engagement.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-600 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <button className="border border-zinc-500 text-zinc-900 dark:text-white  px-6 py-3 rounded-xl text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 transform">
              Try It Free
            </button>
            <button className="text-purple-600 dark:text-purple-400 font-semibold text-lg hover:underline transition-all duration-200">
              Watch Demo →
            </button>
          </div>

          {/* Hero Visual */}
          <div
            className={`mt-16 transition-all duration-1000 delay-900 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4  bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded w-3/4">
                    
                  </div>
                  <div className="h-4 bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-800 dark:to-purple-800 rounded w-1/2"></div>
                  <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded w-2/3"></div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
