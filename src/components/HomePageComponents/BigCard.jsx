import React from "react";

export default function BigCard() {
  return (
    <div className="p-10 h-screen bg-black">
    <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto mt-20 h-[70vh] bg-gradient-to-br from-purple-800 via-purple-600 to-indigo-600
 rounded-2xl shadow-2xl overflow-hidden p-8 md:p-12 transition-all duration-300">
      
      {/* Left Side: Text */}
      <div className="md:w-1/2 mb-8 md:mb-0">
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-800 dark:text-white leading-tight mb-4">
          Empower Teaching with{" "}
          <span className=" text-purple-100 font-mono font-extralight">
            Sahayak AI
          </span>
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-100">
          Sahayak is your intelligent classroom partner that listens, analyzes, and guides. Transform voice into insight, and lessons into lasting impact with our voice-powered AI assistant built for educators.
        </p>
      </div>

      {/* Right Side: Image */}
      <div className="md:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1561089489-f13d5e730d72?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGVhY2hpbmclMjB3aXRoJTIwYWklMjA0a3xlbnwwfHwwfHx8MA%3D%3D"
          alt="Teaching AI Assistant"
          className="w-full h-auto object-cover  rounded-xl shadow-md border border-zinc-200 dark:border-zinc-700"
        />
      </div>
    </section></div>
  );
}
