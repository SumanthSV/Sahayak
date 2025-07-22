"use client"

import { useState } from "react"

const faqs = [
  {
    question: "Do I need technical skills to get started?",
    answer:
      "Not at all! Our platform is designed to be user-friendly for educators of all technical backgrounds. Simply sign up, connect your classroom data, and start generating lessons with our intuitive interface.",
  },
  {
    question: "How does student data privacy work?",
    answer:
      "We take privacy seriously. All student data is encrypted and stored securely. We comply with FERPA, COPPA, and GDPR regulations. We never share student information with third parties and you maintain full control over your data.",
  },
  {
    question: "Can I integrate with Google Classroom / Moodle?",
    answer:
      "Yes! We support seamless integration with popular learning management systems including Google Classroom, Moodle, Canvas, and Blackboard. Your existing workflow remains unchanged.",
  },
  {
    question: "What languages are supported?",
    answer:
      "Currently, we support English, Spanish, French, German, and Hindi. We're continuously adding more languages based on user demand. Contact us if you need support for a specific language.",
  },
  {
    question: "Can I customize the AI-generated content?",
    answer:
      "All AI-generated lesson plans, quizzes, and feedback can be fully customized. You can edit, add, or remove content to match your teaching style and curriculum requirements.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "We offer comprehensive support including email support for all users, priority support for Standard plan users, and dedicated account management for Enterprise customers. We also provide extensive documentation and video tutorials.",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-black  dark:to-black">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-purple-800 via-purple-400 to-purple-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Everything you need to know about our AI teaching assistant
          </p>
        </div>

        <div className="space-y-4 border border-zinc-600 px-6 py-3 rounded-xl">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="  border-b border-gray-200 dark:border-zinc-800  overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-transparent transition-colors duration-200"
              >
                <span className="text-lg font-semibold text-gray-900 dark:text-white pr-4">{faq.question}</span>
                <svg
                  className={`w-6 h-6 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`px-6 overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 pb-6" : "max-h-0"
                }`}
              >
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
