import React, { FC } from 'react';
import Navigation from './components/navigation';

function App() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="sm:max-w-[400px] sm:p-5 sm:max-h-[700px] sm:rounded-3xl w-full h-full flex items-end bg-gray-100">

        <Navigation />
      </div>
    </div>
  );
}

export default App;
