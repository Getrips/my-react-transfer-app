import React, { useState } from 'react';
import { Calendar, MapPin, Search } from 'lucide-react';
import NavigationTabs from './NavigationTabs';

export default function ToursPage({ setCurrentView }) {
  const [fromCity, setFromCity] = useState('');
  const [tourDate, setTourDate] = useState('');
  const [duration, setDuration] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-xl text-center">
        <p class="text-lg font-semibold mb-4">Поиск туров...</p>
        <p class="text-md mb-2">Город выезда: ${fromCity || 'Не указан'}</p>
        <p class="text-md mb-2">Дата: ${tourDate || 'Не указана'}</p>
        <p class="text-md mb-2">Длительность: ${duration || 'Не указана'}</p>
        <button id="closeModal" class="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 mt-4">Закрыть</button>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('closeModal').onclick = () => document.body.removeChild(modal);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-pink-100 flex flex-col items-center p-4 font-inter text-gray-800">
      <NavigationTabs active="tours" setCurrentView={setCurrentView} />

      <h1 className="text-4xl sm:text-5xl font-extrabold text-[#7860BE] mb-4 mt-6 text-center">Туры по Грузии</h1>
      <p className="text-gray-700 text-lg mb-8 text-center">Подберите идеальный тур</p>

      <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl mb-12">
        <div className="space-y-4">
          <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-sm">
            <MapPin size={20} className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Город выезда"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              className="flex-grow bg-transparent outline-none text-lg text-gray-800"
            />
          </div>
          <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-sm">
            <Calendar size={20} className="text-gray-500 mr-3" />
            <input type="date" value={tourDate} onChange={(e) => setTourDate(e.target.value)} className="flex-grow bg-transparent outline-none text-lg text-gray-800" />
          </div>
          <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-sm">
            <input
              type="number"
              min="1"
              placeholder="Длительность (дней)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="flex-grow bg-transparent outline-none text-lg text-gray-800"
            />
          </div>
          <button type="submit" className="w-full bg-lime-500 hover:bg-lime-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-lg flex justify-center items-center">
            <Search size={20} className="mr-2" /> Найти туры
          </button>
        </div>
      </form>
    </div>
  );
}



