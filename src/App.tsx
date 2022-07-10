import dayjs from 'dayjs';
import React, { FC } from 'react';
import Navigation from './components/navigation';
import Toast from './components/toast';
import Routes from './Routes';

function App() {
  return (
    <div className="h-full min-h-full box-border w-full flex justify-center items-center overflow-hidden">
      <div className="sm:max-w-[400px] h-full sm:max-h-[700px] p-5 sm:rounded-3xl w-full flex flex-col items-end bg-gray-50">
        <div className='w-full h-full'>
          <Routes />
        </div>
        <Navigation />
      </div>
      <Toast />
    </div>
  );
}

export default App;
