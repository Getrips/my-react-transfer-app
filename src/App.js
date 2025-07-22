import React, { useState } from 'react';
import TransferSearch from './components/TransferSearch';
import TransferResults from './components/TransferResults';
import DriverCarousel from './components/DriverCarousel';

function App() {
  const [results, setResults] = useState([]);

  const handleSearch = (formData) => {
    // Эта функция имитирует поиск и устанавливает результаты
    const fakeResult = {
      from: formData.from,
      to: formData.to,
      date: formData.date,
      carClass: formData.carClass,
      language: formData.language,
      extras: formData.extras,
    };
    setResults([fakeResult]);
  };

  return (
    // Основной контейнер приложения с градиентным фоном из палитры
    // from-[#062343]: темно-синий в начале градиента
    // to-[#449AD4]: яркий синий в конце градиента
    <div className="min-h-screen bg-gradient-to-br from-[#062343] to-[#449AD4] text-[#FCFCFC] p-4">
      <div className="max-w-3xl mx-auto">
        {/* Заголовок страницы */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center text-white">Трансфер по Грузии</h1>
        <p className="text-md text-center mb-6 text-white">Выберите параметры для заказа трансфера</p>

        {/* Форма поиска - обернута в div с белым фоном (как на первом фото) */}
        <div className="bg-white rounded-lg p-6 mb-4 shadow-lg">
          <TransferSearch onSearch={handleSearch} />
        </div>

        {/* Результаты поиска (пока не стилизованы) */}
        <TransferResults results={results} />

        {/* Карусель водителей */}
        <DriverCarousel />
      </div>

      {/* Футер страницы */}
      <footer className="text-center text-sm text-white mt-12">
        &copy; {new Date().getFullYear()} GeoTrips
      </footer>
    </div>
  );
}

export default App;
