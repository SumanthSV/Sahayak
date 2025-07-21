export default function CTABanner() {
  return (
    <section className="relative h-screen flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#3b0764] via-[#7e22ce] to-[#581c87] dark:from-[#1e1b4b] dark:via-10% dark:via-[#4c1d95] dark:to-black overflow-hidden">
      {/* Wave decoration */}
      <div className="absolute top-0 left-0 right-0">
        <svg className="w-full h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="fill-purple-200 dark:fill-gray-900"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="fill-purple-300 dark:fill-gray-900"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-purple-400 dark:fill-gray-900"
          ></path>
        </svg>
      </div>

      {/* Main Text */}
      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-white to-purple-400 drop-shadow-md mb-6">
          Ready to Transform Your Teaching?
        </h2>
        <p className="text-xl md:text-2xl text-purple-100/80 mb-8 max-w-2xl mx-auto drop-shadow-md">
          Join thousands of educators who are already using AI to create better learning experiences.
        </p>
        <button className="bg-gradient-to-br from-white via-purple-100 to-white text-purple-900 border border-purple-300 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 transform">
          Get Started for Free
        </button>
      </div>

      {/* Decorative Pulsing Circles */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-purple-200/20 rounded-full animate-pulse delay-200"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-300/20 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-violet-400/20 rounded-full animate-pulse delay-500"></div>
      <div className="absolute top-20 right-1/4 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-700"></div>

      {/* Additional Magic Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-white/10 to-transparent pointer-events-none"></div>
    </section>
  );
}
