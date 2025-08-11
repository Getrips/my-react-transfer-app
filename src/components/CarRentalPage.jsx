import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Search, ChevronDown, User, Car, CarFront, Award, Star, Baby, Plus, Snowflake, Package } from 'lucide-react';
import NavigationTabs from './NavigationTabs';

export default function CarRentalPage({ setCurrentView }) {
  const [selectedLanguage, setSelectedLanguage] = useState('Русский');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const languageDropdownRef = useRef(null);

  const [city, setCity] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [carType, setCarType] = useState('');
  const [carClass, setCarClass] = useState('');
  const [showAdditional, setShowAdditional] = useState(false);
  const [withChildSeat, setWithChildSeat] = useState(false);
  const [withBooster, setWithBooster] = useState(false);
  const [withSkiRack, setWithSkiRack] = useState(false);
  const [withRoofRack, setWithRoofRack] = useState(false);

  // Популярные авто (заглушки)
  const popularCars = [
    { id: 1, name: 'Toyota Corolla', image: 'https://placehold.co/320x200?text=Corolla', rating: 4.8, class: 'Эконом' },
    { id: 2, name: 'Hyundai Tucson', image: 'https://placehold.co/320x200?text=Tucson', rating: 4.9, class: 'Комфорт' },
    { id: 3, name: 'Mercedes E-Class', image: 'https://placehold.co/320x200?text=E-Class', rating: 5.0, class: 'Бизнес' },
  ];

  // FAQ по аренде авто
  const carFaqItems = [
    { q: 'Какие документы требуются для аренды автомобиля? Возраст и стаж вождения?', a: 'Паспорт и водительское удостоверение установленного образца. Минимальный возраст — от 21 года, стаж от 2-х лет.' },
    { q: 'Как забронировать авто?', a: 'Выберите город, даты и параметры на нашем сайте, оставьте контакты. Мы подтвердим бронь и пришлём детали на почту или в мессенджер.' },
    { q: 'Как внести залог/депозит?', a: 'Размер залога зависит от класса авто и указывается при бронировании. Вносится при получении автомобиля наличными или банковской картой.' },
    { q: 'Можно ли получить машину в аэропорту/в городе?', a: 'Да, возможно получение и возврат как в аэропорту, так и в городе. Укажите удобные точки при бронировании.' },
    { q: 'Что включено в цену аренды?', a: 'Страхование ОСАГО, базовая помощь на дороге, лимит пробега в соответствии с условиями тарифа, налог и сборы.' },
    { q: 'Можно ли пересечь границу?', a: 'По умолчанию — нет. Пересечение границы возможно только по согласованию и с доплатой.' },
    { q: 'Что будет, если меняются даты бронирования?', a: 'Напишите нам как можно раньше. Мы постараемся внести изменения без штрафов, если авто доступно на новые даты.' },
  ];

  // Почему выбирают нас (аренда авто)
  const whyChooseUsItems = [
    { icon: <Car size={40} className="text-indigo-600" />, title: 'Современный автопарк', desc: 'Поддержанные и новые модели, регулярное обслуживание и чистый салон.' },
    { icon: <Award size={40} className="text-indigo-600" />, title: 'Гибкие условия', desc: 'Прозрачные правила, бесплатная отмена заранее, опции для семьи и активного отдыха.' },
    { icon: <Calendar size={40} className="text-indigo-600" />, title: 'Простое бронирование', desc: 'Пару кликов — и автомобиль забронирован на нужные даты.' },
  ];

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

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setShowLanguageDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-xl text-center">
        <p class="text-lg font-semibold mb-4">Поиск авто в аренду...</p>
        <p class="text-md mb-2">Город: ${city || 'Не указан'}</p>
        <p class="text-md mb-2">Выбор автомобиля: ${carType || 'Не выбран'}</p>
        <p class="text-md mb-2">Класс автомобиля: ${carClass || 'Не выбран'}</p>
        <p class="text-md mb-2">Дата начала: ${pickupDate || 'Не указана'}</p>
        <p class="text-md mb-2">Дата окончания: ${dropoffDate || 'Не указана'}</p>
        <p class="text-md mb-2">Дополнительно: ${[
          withChildSeat ? 'Детское кресло' : null,
          withBooster ? 'Бустер' : null,
          withSkiRack ? 'Крепление для лыж/сноуборда' : null,
          withRoofRack ? 'Багажник на крыше' : null,
        ].filter(Boolean).join(', ') || 'Нет'}</p>
        <button id="closeModal" class="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 mt-4">Закрыть</button>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('closeModal').onclick = () => document.body.removeChild(modal);
  };

  const handleAllCars = () => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-xl text-center">
        <p class="text-lg font-semibold mb-4">Показать все авто...</p>
        <button id="closeModal" class="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600">Закрыть</button>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('closeModal').onclick = () => document.body.removeChild(modal);
  };

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
              <button onClick={() => handleLanguageSelect('Русский')} className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100">
                <img src="https://flagsapi.com/RU/flat/24.png" alt="Русский" className="mr-2 rounded-sm" /> Русский
              </button>
              <button onClick={() => handleLanguageSelect('English')} className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100">
                <img src="https://flagsapi.com/US/flat/24.png" alt="English" className="mr-2 rounded-sm" /> English
              </button>
              <button onClick={() => handleLanguageSelect('Georgian')} className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100">
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

      <NavigationTabs active="carRental" setCurrentView={setCurrentView} />

      <h1 className="text-4xl sm:text-5xl font-extrabold text-[#7860BE] mb-4 mt-6 text-center">Аренда авто</h1>
      <p className="text-gray-700 text-lg mb-8 text-center">Выберите параметры для аренды автомобиля</p>

      <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl mb-12">
        <div className="space-y-4">
          {/* Город */}
          <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-sm">
            <MapPin size={20} className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Город"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              list="locations-list"
              className="flex-grow bg-transparent outline-none text-lg text-gray-800"
            />
            <datalist id="locations-list">
              {locations.map((loc, index) => (
                <option key={index} value={loc} />
              ))}
            </datalist>
          </div>

          {/* Выбор автомобиля */}
          <div className="relative bg-gray-100 p-3 rounded-lg shadow-sm flex items-center">
            <CarFront size={20} className="text-gray-500 mr-3" />
            <select
              className="w-full bg-transparent outline-none appearance-none text-lg text-gray-800 pr-8"
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
            >
              <option value="" disabled hidden>Выбор автомобиля</option>
              <option>Седан</option>
              <option>Внедорожник (SUV)</option>
              <option>Минивэн</option>
              <option>Универсал</option>
            </select>
            <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {/* Класс автомобиля */}
          <div className="relative bg-gray-100 p-3 rounded-lg shadow-sm flex items-center">
            <Award size={20} className="text-gray-500 mr-3" />
            <select
              className="w-full bg-transparent outline-none appearance-none text-lg text-gray-800 pr-8"
              value={carClass}
              onChange={(e) => setCarClass(e.target.value)}
            >
              <option value="" disabled hidden>Класс автомобиля</option>
              <option>Эконом</option>
              <option>Комфорт</option>
              <option>Бизнес</option>
              <option>Премиум</option>
            </select>
            <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {/* Даты */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-sm">
              <Calendar size={20} className="text-gray-500 mr-3" />
              <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="flex-grow bg-transparent outline-none text-lg text-gray-800" />
            </div>
            <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-sm">
              <Calendar size={20} className="text-gray-500 mr-3" />
              <input type="date" value={dropoffDate} onChange={(e) => setDropoffDate(e.target.value)} className="flex-grow bg-transparent outline-none text-lg text-gray-800" />
            </div>
          </div>

          {/* Дополнительно */}
          <div className="mb-2">
            <button
              type="button"
              onClick={() => setShowAdditional(!showAdditional)}
              className="w-full flex items-center justify-between text-gray-700 font-medium py-2 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              Дополнительно:
              <ChevronDown size={20} className={`transform transition-transform duration-300 ${showAdditional ? 'rotate-180' : ''}`} />
            </button>
            {showAdditional && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" checked={withChildSeat} onChange={(e) => setWithChildSeat(e.target.checked)} />
                  <Baby size={18} className="text-purple-600 mr-2"/>
                  <span className="text-gray-700">Детское кресло</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" checked={withBooster} onChange={(e) => setWithBooster(e.target.checked)} />
                  <Plus size={18} className="text-purple-600 mr-2"/>
                  <span className="text-gray-700">Бустер</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" checked={withSkiRack} onChange={(e) => setWithSkiRack(e.target.checked)} />
                  <Snowflake size={18} className="text-purple-600 mr-2"/>
                  <span className="text-gray-700">Крепление для лыж/сноуборда</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" checked={withRoofRack} onChange={(e) => setWithRoofRack(e.target.checked)} />
                  <Package size={18} className="text-purple-600 mr-2"/>
                  <span className="text-gray-700">Багажник на крыше</span>
                </label>
              </div>
            )}
          </div>

          {/* Кнопки */}
          <div className="space-y-4">
            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-lg flex justify-center items-center">
              <Search size={20} className="mr-2" /> Найти авто
            </button>
            <button type="button" onClick={handleAllCars} className="w-full bg-lime-400 hover:bg-lime-500 text-gray-800 font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-lg flex items-center justify-center">
              <Car size={20} className="mr-2"/> Все авто
            </button>
          </div>
        </div>
      </form>

      {/* Популярные автомобили */}
      <div className="w-full max-w-4xl mt-4 mb-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">Популярные автомобили</h2>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">Выбирайте из большого автопарка хороших моделей по гибким ценам</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {popularCars.map((car) => (
            <div key={car.id} className="bg-white rounded-xl shadow-lg overflow-hidden text-left">
              <img src={car.image} alt={car.name} className="w-full h-40 object-cover" onError={(e)=>{e.target.onerror=null; e.target.src='https://placehold.co/320x200?text=Car'}} />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{car.name}</h3>
                <p className="text-sm text-gray-500 mb-2">Класс: {car.class}</p>
                <div className="flex items-center text-yellow-500">
                  <Star size={16} fill="currentColor" className="mr-1" />
                  <span className="font-medium">{car.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Часто задаваемые вопросы */}
      <div className="w-full max-w-4xl mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4 text-center">Часто задаваемые вопросы</h2>
        <p className="text-gray-600 mb-6 text-center text-sm sm:text-base">Ответы на популярные вопросы об аренде автомобиля</p>
        <div className="space-y-3">
          {carFaqItems.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-4">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer text-sm sm:text-base font-semibold text-gray-800">
                  {item.q}
                  <ChevronDown size={20} className="text-indigo-600 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-gray-600 text-sm sm:text-base">{item.a}</p>
              </details>
            </div>
          ))}
        </div>
      </div>

      {/* Почему выбирают нас */}
      <div className="w-full max-w-4xl mb-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4">Почему выбирают нас</h2>
        <p className="text-gray-600 mb-8">Наши преимущества в аренде автомобилей</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {whyChooseUsItems.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
              <div className="p-4 bg-indigo-100 rounded-full mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



