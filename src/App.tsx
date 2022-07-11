import React from 'react';
import Navigation from './components/navigation';
import Toast from './components/toast';
import Routes from './Routes';

export default function App() {
  return (
    <div className='absolute h-full w-full top-0'>
      <div className="h-full w-full flex justify-center items-center">
        <div className="sm:max-w-[400px] sm:max-h-[660px] h-full px-6 py-3 sm:rounded-3xl w-full flex flex-col bg-gray-50">          
          <div className="w-full flex-1 overflow-scroll">
            <Routes />
          </div>
          <Navigation />
        </div>
        <Toast />
      </div>
    </div>
  );
}
