export default function Demo() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            See It In{" "}
            <span className="bg-gradient-to-r from-purple-800 via-purple-400 to-purple-600 bg-clip-text text-transparent">Action</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Generate a complete lesson plan in under 90 seconds
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 shadow-2xl">
              {/* Device frame */}
              <div className="bg-black rounded-xl p-2">
                <div className="bg-white dark:bg-gray-100 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
                  {/* Video placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200">
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 mx-auto">
                          <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <p className="text-gray-700 font-medium">Watch Demo Video</p>
                        <p className="text-gray-500 text-sm mt-1">90 seconds • Lesson Planning</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Drop shadow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl transform translate-x-4 translate-y-4 -z-10"></div>
          </div>

          <div className="text-center mt-8">
            <p className="text-lg text-gray-600 dark:text-gray-300 italic">
              "See it in action: generate a complete lesson plan in under 90 seconds."
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
