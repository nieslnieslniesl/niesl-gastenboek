import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-yellow-300 rounded-full animate-ping opacity-75"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-pink-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <div className="text-pink-600 font-bold font-comic animate-pulse tracking-widest">
        EVEN GEDULD...
      </div>
    </div>
  );
};

export default Loading;
