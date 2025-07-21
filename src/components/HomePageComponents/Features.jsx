"use client"

import { useState } from "react"

const features = [
  {
    title: "Personalized Lesson Planning",
    description:
      "Generate tailored lesson outlines in seconds. Save time and focus on what matters most.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="#8B5CF6" viewBox="0 0 24 24" width="32" height="32">
        <path d="M5 2a2 2 0 0 0-2 2v16.002A2 2 0 0 0 5 22h14a2 2 0 0 0 2-2V8.828a2 2 0 0 0-.586-1.414l-5.828-5.828A2 2 0 0 0 13.172 1H5zm0 2h8v5a1 1 0 0 0 1 1h5v11H5V4zm9 0.414L18.586 9H14a1 1 0 0 1-1-1V4.414zM7 12h10v2H7v-2zm0 4h6v2H7v-2z" />
      </svg>
    ),
  },
  {
    title: "Instant Student Feedback",
    description:
      "Auto-grade quizzes and pinpoint areas for improvement instantly and accurately.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="#34D399" viewBox="0 0 24 24" width="32" height="32">
        <path d="M3 3v18h18v-2H5V3H3zm6 6v6h2V9H9zm4-3v9h2V6h-2zm4 6v3h2v-3h-2z" />
      </svg>
    ),
  },
  {
    title: "Classroom Analytics",
    description:
      "Track participation, performance trends, and more with real-time AI insights.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="#F43F5E" viewBox="0 0 24 24" width="32" height="32">
        <path d="M4 4h16v2H4V4zm2 4h2v10H6V8zm4 4h2v6h-2v-6zm4-4h2v10h-2V8zm4 6h2v4h-2v-4z" />
      </svg>
    ),
  },
]

export default function UseCases() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black text-white text-center">
      {/* Label */}
      <div className="mb-4">
        <span className="inline-block border border-white/20 rounded-full px-4 py-1 text-xs tracking-wider text-white/80">
          USE CASES
        </span>
      </div>

      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-bold mb-4">
        Making life easier with AI
      </h2>

      {/* Subtext */}
      <p className="text-lg text-white/70 max-w-3xl mx-auto mb-16">
        Discover how our AI teaching assistant transforms lesson planning, grading, and classroom management
        with personalized, data-driven insights. Make every lesson count with AI-powered efficiency.
      </p>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-start gap-4 group hover:scale-[1.02] transition duration-300"
          >
            <div className="w-12 h-12">{feature.icon}</div>
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
