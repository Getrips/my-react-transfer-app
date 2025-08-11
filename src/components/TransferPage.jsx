import React, { useState, useRef, useEffect } from 'react';
// Импортируем все необходимые иконки, включая XCircle для удаления
import { MapPin, Calendar, Plus, ChevronDown, Repeat2, Star, User, Car, Wifi, Baby, PawPrint, Award, XCircle } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';
import NavigationTabs from './NavigationTabs';

function TransferPage({ setCurrentView }) {
  const [showAdditional, setShowAdditional] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Русский');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [stops, setStops] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const languageDropdownRef = useRef(null);
  const carouselRef = useRef(null);
  const [isHoveringCarousel, setIsHoveringCarousel] = useState(false);

  // Список доступных направлений
  const locations = [
    'Тбилиси',
    'Тбилиси аэропорт',
    'Кутаиси',
    'Кутаиси аэропорт',
    'Батуми',
    'Батуми аэропорт',
    'Гори',
    'Зугдиди',
    'Телави',
    'Местия',
  ];

  // Данные для карусели водителей
  const drivers = [
    { id: 1, name: 'Георгий', rating: 5, trips: 120, image: 'https://placehold.co/100x100/A78BFA/ffffff?text=ГГ' },
    { id: 2, name: 'Нино', rating: 4.9, trips: 95, image: 'https://placehold.co/100x100/FB7185/ffffff?text=НН' },
    { id: 3, name: 'Давид', rating: 4.8, trips: 150, image: 'https://placehold.co/100x100/60A5FA/ffffff?text=ДД' },
    { id: 4, name: 'Мария', rating: 5, trips: 80, image: 'https://placehold.co/100x100/34D399/ffffff?text=ММ' },
    { id: 5, name: 'Александр', rating: 4.7, trips: 110, image: 'https://placehold.co/100x100/FACC15/ffffff?text=АА' },
    { id: 6, name: 'Тамара', rating: 4.9, trips: 70, image: 'https://placehold.co/100x100/F472B6/ffffff?text=ТТ' },
  ];

  // Данные для FAQ
  const faqItems = [
    {
      question: 'Бронирование и подтверждение',
      answer: 'Трансфер необходимо бронировать не позднее чем за 24 часа до поездки. После оформления заказа вы получите подтверждение от водителя.',
    },
    {
      question: 'Условия отмены',
      answer: 'Бесплатная отмена возможна не позднее чем за 48 часов до начала трансфера. В случае отмены менее чем за 48 часов - предоплата не возвращается.',
    },
    {
      question: 'Встреча в аэропорту',
      answer: 'Водитель будет ожидать в зоне прилета с табличкой, на которой указано имя клиента. Время бесплатного ожидания - до 60 минут после посадки рейса. При изменении номера рейса или времени прибытия - просьба сообщить заранее.',
    },
    {
      question: 'Время ожидания в других точках',
      answer: 'Ожидание до 20 минут - бесплатно.',
    },
    {
      question: 'Детали поездки',
      answer: 'Все автомобили - чистые, комфортные и с кондиционером. Водители говорят на русском, грузинском, английском языках. Возможны короткие остановки в пути по просьбе клиента, в том числе для фото на красивых видах или у достопримечательностей. Более длительные остановки - по предварительному согласованию.',
    },
    {
      question: 'Дополнительные услуги',
      answer: 'Детское кресло - по запросу, бесплатно. Вода в машине - бесплатно. Дополнительный багаж - уточняйте при бронировании.',
    },
    {
      question: 'Ответственность',
      answer: 'Компания не несет ответственности за задержки, вызванные пробками, погодными условиями или действиями третьих лиц. Клиент обязан сообщать об изменении прибытия как можно раньше.',
    },
  ];

  const whyChooseUsItems = [
    {
      icon: <Car size={40} className="text-orange-500" />,
      title: 'Комфортные автомобили',
      description: 'Все наши автомобили чистые, комфортные и оснащены кондиционером для вашего удобства',
    },
    {
      icon: <Award size={40} className="text-orange-500" />,
      title: 'Профессиональные водители',
      description: 'Наши водители говорят на русском, грузинском и английском языках, обеспечивая комфортное общение',
    },
    {
      icon: <Calendar size={40} className="text-orange-500" />,
      title: 'Гибкие условия',
      description: 'Бесплатная отмена за 48 часов, короткие остановки по пути и дополнительные услуги по запросу',
    },
  ];

  const handleSearchTransfers = () => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-xl text-center">
        <p class="text-lg font-semibold mb-4">Поиск трансферов...</p>
        <p class="text-md mb-2">Откуда: ${fromLocation || 'Не указано'}</p>
        <p class="text-md mb-2">Куда: ${toLocation || 'Не указано'}</p>
        <p class="text-md mb-2">Дата: ${selectedDate || 'Не указана'}</p>
        ${stops.length > 0 ? `<p class="text-md mb-2">Остановки: ${stops.map((s, i) => s || `Остановка ${i + 1}`).join(', ')}</p>` : ''}
        <button id="closeModal" class="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 mt-4">Закрыть</button>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('closeModal').onclick = () => document.body.removeChild(modal);
  };

  const handleAllTransfers = () => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-xl text-center">
        <p class="text-lg font-semibold mb-4">Показать все трансферы...</p>
        <button id="closeModal" class="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600">Закрыть</button>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('closeModal').onclick = () => document.body.removeChild(modal);
  };

  const handleSwapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setShowLanguageDropdown(false);
  };

  const handleAddStop = () => {
    setStops([...stops, '']);
  };

  const handleStopChange = (index, value) => {
    const newStops = [...stops];
    newStops[index] = value;
    setStops(newStops);
  };

  const handleRemoveStop = (indexToRemove) => {
    setStops(stops.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-pink-100 flex flex-col items-center p-4 font-inter text-gray-800">
      {/* Верхняя панель */}
      <div className="w-full max-w-4xl flex justify-between items-center py-4 px-6">
        <div className="relative" ref={languageDropdownRef}>
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center text-[#7860BE] text-lg font-medium bg-transparent border-none focus:outline-none"
          >
            <img src={`https://flagsapi.com/${selectedLanguage === 'Русский' ? 'RU' : selectedLanguage === 'English' ? 'US' : 'GE'}/flat/24.png`} alt={selectedLanguage} className="mr-2 rounded-sm" />
            {selectedLanguage} <ChevronDown size={16} className="ml-1" />
          </button>
          {showLanguageDropdown && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg py-2 z-10">
              <button
                onClick={() => handleLanguageSelect('Русский')}
                className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                <img src="https://flagsapi.com/RU/flat/24.png" alt="Русский" className="mr-2 rounded-sm" /> Русский
              </button>
              <button
                onClick={() => handleLanguageSelect('English')}
                className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                <img src="https://flagsapi.com/US/flat/24.png" alt="English" className="mr-2 rounded-sm" /> English
              </button>
              <button
                onClick={() => handleLanguageSelect('Georgian')}
                className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                <img src="https://flagsapi.com/GE/flat/24.png" alt="Georgian" className="mr-2 rounded-sm" /> Georgian
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => setCurrentView('mainPage')}
          className="ml-6 flex items-center text-[#7860BE] text-lg font-medium bg-transparent border-none focus:outline-none"
        >
          <User size={20} className="mr-2" />
          <span className="text-orange-500">Войти</span>
        </button>
      </div>

      <NavigationTabs active="transferPage" setCurrentView={setCurrentView} />

      <h1 className="text-4xl sm:text-5xl font-extrabold text-[#7860BE] mb-4 mt-8 text-center">
        Трансфер по Грузии
      </h1>
      <p className="text-gray-700 text-lg mb-8 text-center">
        Выберите параметры для заказа трансфера
      </p>

      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl transform transition-all duration-300 hover:scale-[1.01] mb-12">
        {/* Поля "Откуда?" и "Куда?" */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 relative">
          <AutocompleteInput
            value={fromLocation}
            onChange={setFromLocation}
            onSelect={setFromLocation}
            placeholder="Откуда?"
            locations={locations}
            iconColor="text-blue-500"
          />
          <AutocompleteInput
            value={toLocation}
            onChange={setToLocation}
            onSelect={setToLocation}
            placeholder="Куда?"
            locations={locations}
            iconColor="text-red-500"
          />
          <button
            onClick={handleSwapLocations}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-full shadow-md transition-all duration-300 z-10"
            title="Поменять местами"
          >
            <Repeat2 size={20} />
          </button>
        </div>

        {/* Остановки */}
        <div className="space-y-3 mb-6">
          {stops.map((stop, index) => (
            <div key={index} className="flex items-center bg-gray-100 p-3 rounded-lg shadow-sm">
              <MapPin size={20} className="text-gray-500 mr-3" />
              <input
                type="text"
                placeholder={`Остановка ${index + 1}`}
                value={stop}
                onChange={(e) => handleStopChange(index, e.target.value)}
                list="locations-list-stops"
                className="flex-grow bg-transparent outline-none text-lg text-gray-800"
              />
              {stop && (
                <button
                  type="button"
                  onClick={() => handleRemoveStop(index)}
                  className="ml-2 p-1 rounded-full text-gray-500 hover:bg-gray-200 focus:outline-none"
                  title="Удалить остановку"
                >
                  <XCircle size={18} />
                </button>
              )}
            </div>
          ))}
          <datalist id="locations-list-stops">
            {locations.map((loc, index) => (
              <option key={index} value={loc} />
            ))}
          </datalist>
          <button
            onClick={handleAddStop}
            className="w-full text-orange-500 border border-dashed border-orange-500 rounded-lg py-2 text-lg hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
          >
            + Добавить остановку
          </button>
        </div>

        {/* Дата */}
        <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-sm mb-4">
          <Calendar size={20} className="text-gray-500 mr-3" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex-grow bg-transparent outline-none text-lg text-gray-800"
          />
        </div>

        {/* Класс автомобиля */}
        <div className="relative bg-gray-100 p-3 rounded-lg shadow-sm mb-4">
          <select
            className="w-full bg-transparent outline-none appearance-none text-lg text-gray-800 pr-8"
            defaultValue=""
          >
            <option value="" disabled hidden>Класс автомобиля</option>
            <option>Эконом</option>
            <option>Комфорт</option>
            <option>Бизнес</option>
            <option>Минивэн</option>
          </select>
          <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        {/* Язык водителя */}
        <div className="relative bg-gray-100 p-3 rounded-lg shadow-sm mb-6">
          <select
            className="w-full bg-transparent outline-none appearance-none text-lg text-gray-800 pr-8"
            defaultValue=""
          >
            <option value="" disabled hidden>Язык водителя</option>
            <option>Русский</option>
            <option>Английский</option>
            <option>Грузинский</option>
          </select>
          <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        {/* Дополнительно */}
        <div className="mb-6">
          <button
            onClick={() => setShowAdditional(!showAdditional)}
            className="w-full flex items-center justify-between text-gray-700 font-medium py-2 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            Дополнительно:
            <ChevronDown size={20} className={`transform transition-transform duration-300 ${showAdditional ? 'rotate-180' : ''}`} />
          </button>
          {showAdditional && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
              <div className="flex items-center">
                <input type="checkbox" id="child-seat" className="mr-2" />
                <label htmlFor="child-seat" className="text-gray-700 flex items-center">
                  <Baby size={20} className="mr-2 text-purple-600" /> Детское кресло
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="wifi" className="mr-2" />
                <label htmlFor="wifi" className="text-gray-700 flex items-center">
                  <Wifi size={20} className="mr-2 text-purple-600" /> Wi-Fi в машине
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="animal" className="mr-2" />
                <label htmlFor="animal" className="text-gray-700 flex items-center">
                  <PawPrint size={20} className="mr-2 text-purple-600" /> Перевозка животного
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="booster" className="mr-2" />
                <label htmlFor="booster" className="text-gray-700 flex items-center">
                  <Plus size={20} className="mr-2 text-purple-600" /> Бустер
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Кнопки */}
        <div className="space-y-4">
          <button
            onClick={handleSearchTransfers}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-lg"
          >
            Найти трансферы
          </button>
          <button
            onClick={handleAllTransfers}
            className="w-full bg-lime-400 hover:bg-lime-500 text-gray-800 font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-lg"
          >
            Все трансферы
          </button>
        </div>
      </div>

      {/* Карусель топовых водителей (плавное marquee) */}
      <div className="w-full max-w-4xl mt-12 mb-12 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#7860BE] mb-4">
          Наши лучшие водители
        </h2>
        <p className="text-gray-700 text-lg mb-8">
          Познакомьтесь с водителями, которые сделают вашу поездку незабываемой
        </p>
        <div
          className="relative w-full custom-scrollbar"
          onMouseEnter={() => setIsHoveringCarousel(true)}
          onMouseLeave={() => setIsHoveringCarousel(false)}
          onTouchStart={() => setIsHoveringCarousel(true)}
          onTouchEnd={() => setIsHoveringCarousel(false)}
        >
          <div
            ref={carouselRef}
            className={`flex space-x-6 py-4 px-2 snap-x snap-mandatory animate-marquee-animation${isHoveringCarousel ? ' paused' : ''}`}
            style={{ scrollBehavior: 'smooth', width: 'max-content' }}
          >
            {[...drivers, ...drivers].map((driver, idx) => (
              <div
                key={driver.id + '-' + idx}
                className="flex-shrink-0 w-64 bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center snap-center transform transition-all duration-300 hover:scale-105"
              >
                <img
                  src={driver.image}
                  alt={driver.name}
                  className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-purple-300"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/CCCCCC/333333?text=N/A'; }}
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{driver.name}</h3>
                <div className="flex items-center text-yellow-500 mb-2">
                  <Star size={18} fill="currentColor" className="mr-1" />
                  <span className="font-bold">{driver.rating}</span>
                </div>
                <p className="text-gray-600 text-sm">{driver.trips} поездок</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Секция "Почему выбирают нас" */}
      <div className="w-full max-w-4xl mt-12 mb-12 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#7860BE] mb-4">
          Почему выбирают нас
        </h2>
        <p className="text-gray-700 text-lg mb-8">
          Наши преимущества в трансферах
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {whyChooseUsItems.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105">
              <div className="p-4 bg-orange-100 rounded-full mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Секция "Условия предоставления трансфера" (FAQ) */}
      <div className="w-full max-w-4xl mt-12 mb-12 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#7860BE] mb-4">
          Условия предоставления трансфера
        </h2>
        <p className="text-gray-700 text-lg mb-8">
          Ответы на популярные вопросы о трансферах
        </p>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-5 text-left transform transition-all duration-300 hover:scale-[1.01]">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer text-xl font-semibold text-gray-800 leading-tight">
                  {item.question}
                  <ChevronDown size={24} className="transform transition-transform duration-300 group-open:rotate-180 text-purple-600" />
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {item.answer}
                </p>
              </details>
            </div>
          ))}
        </div>
      </div>

      <p className="text-gray-700 text-md mt-6 mb-4 text-center">
        Здесь будут отображаться результаты вашего поиска трансфера.
      </p>
    </div>
  );
}

export default TransferPage;
