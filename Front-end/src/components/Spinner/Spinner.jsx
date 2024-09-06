import React from 'react';

const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-[#ff6600]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4" />
      <div className="text-white text-4xl font-bold">
        <span>Orange</span>
        <span className="text-sm align-super">™</span>
      </div>
    </div>
  );
};

export default Spinner;
