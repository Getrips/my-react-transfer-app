import React from 'react';

function TabButton({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 sm:px-6 py-2 text-base sm:text-lg font-semibold transition-colors ${
        isActive ? 'text-indigo-900' : 'text-gray-700 hover:text-indigo-700'
      }`}
    >
      <div className="flex flex-col items-center">
        <span>{label}</span>
        <span className={`mt-1 h-0.5 w-12 ${isActive ? 'bg-indigo-800' : 'bg-transparent'}`} />
      </div>
    </button>
  );
}

export default function NavigationTabs({ active, setCurrentView }) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-2">
      <div className="flex items-center justify-center space-x-6 sm:space-x-12 border-b border-gray-200 pb-2">
        <TabButton
          label="Авто"
          isActive={active === 'carRental'}
          onClick={() => setCurrentView('carRental')}
        />
        <TabButton
          label="Трансф."
          isActive={active === 'transferPage'}
          onClick={() => setCurrentView('transferPage')}
        />
        <TabButton
          label="Туры"
          isActive={active === 'tours'}
          onClick={() => setCurrentView('tours')}
        />
      </div>
    </div>
  );
}



