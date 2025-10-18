import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="text-center my-12">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-violet-300">
        Is It A Good Deal?
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-300 max-w-3xl mx-auto">
        AI-Powered Real Estate Analysis.
      </h2>
      <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mt-4">
        Stop guessing. Input property and financial details below to get an instant, data-driven verdict on your next real estate investment, powered by Gemini.
      </p>
    </div>
  );
};

export default Hero;