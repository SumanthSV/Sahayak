"use client"

const steps = [
  {
    title: "Sign Up & Connect",
    description: "Connect your LMS or upload class roster",
    detail:
      "Seamlessly integrate with your existing learning management system or quickly upload your student roster to get started.",
  },
  {
    title: "Set Your Goals",
    description: "Choose subjects, grade levels, and learning objectives",
    detail:
      "Customize your teaching approach by selecting specific subjects, grade levels, and defining clear learning objectives for your students.",
  },
  {
    title: "Let AI Assist",
    description: "Auto-generate lessons, quizzes, and feedback",
    detail:
      "Watch as our AI creates comprehensive lesson plans, engaging quizzes, and personalized feedback tailored to your curriculum.",
  },
  {
    title: "Review & Refine",
    description: "Customize outputs before sharing with students",
    detail:
      "Review all AI-generated content and make any necessary adjustments before sharing with your students for the perfect lesson.",
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-black  dark:to-black"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How It{" "}
<span className="bg-gradient-to-r from-purple-800 via-purple-400 to-purple-600 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get started in minutes with our simple four-step process
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400 transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step number */}
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12  rounded-full flex items-center justify-center text-white text-md font-bold border border-zinc-600">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className={`text-center lg:text-left ${index % 2 === 0 ? "lg:mt-0" : "lg:mt-16"}`}>
                  <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-zinc-700 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-purple-600 dark:text-purple-400 font-medium mb-3">{step.description}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{step.detail}</p>
                  </div>
                </div>

                {/* Connector for mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-8">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-teal-500 to-coral-500"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
