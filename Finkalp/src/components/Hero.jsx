import React from "react";

function Hero() {
  return (
    <div
      className="relative bg-cover bg-center h-screen"
      style={{ backgroundImage: "url('/path/to/hero-image.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Effortless Land Acquisition</h1>
        <p className="text-xl mb-8">
          Streamline the process with modern tools and seamless mapping
          integrations.
        </p>
        <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded">
          Get Started
        </button>
      </div>
    </div>
  );
}   

export default Hero;
