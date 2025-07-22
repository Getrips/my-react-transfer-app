import React, { useState } from 'react';

const drivers = [
  {
    id: 1, name: 'Леван', car: 'Toyota Prius', languages: 'Грузинский, Турецкий',
    description: 'Комфортные поездки и помощь туристам',
    image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Леван',
  },
  {
    id: 2, name: 'Мариам', car: 'Hyundai Tucson', languages: 'Русский, Английский',
    description: 'Пунктуальность и забота о клиентах',
    image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Мариам',
  },
  {
    id: 3, name: 'Давид', car: 'Mercedes E-Class', languages: 'Грузинский, Английский',
    description: 'Опытный водитель, знаток местных маршрутов',
    image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Давид',
  },
  {
    id: 4, name: 'Нино', car: 'Honda CR-V', languages: 'Русский, Грузинский',
    description: 'Безопасность и комфорт на первом месте',
    image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Нино',
  },
  {
    id: 5, name: 'Георгий', car: 'Volkswagen Passat', languages: 'Грузинский, Русский',
    description: 'Помощь с багажом и дружелюбное отношение',
    image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Георгий',
  },
  {
    id: 6, name: 'Тамара', car: 'Skoda Octavia', languages: 'Грузинский, Английский',
    description: 'Знание местных достопримечательностей',
    image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Тамара',
  },
];

function DriverCarousel() {
  const [isPaused, setIsPaused] = useState(false);

  // Классы для кнопки "Забронировать" - теперь яркий синий
  const buttonClasses = "bg-[#449AD4] hover:bg-[#062343] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300";

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Наши водители</h2>

      <div
        className="relative w-full overflow-hidden py-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className={`flex flex-nowrap animate-marquee-animation ${isPaused ? 'paused' : ''}`}>
          {drivers.map((driver) => (
            <div
              key={driver.id}
              // Фон карточек теперь белый с небольшой прозрачностью
              className="flex-shrink-0 w-64 bg-white bg-opacity-90 text-gray-800 rounded-xl p-4 m-2 shadow-lg"
            >
              <img
                src={driver.image}
                alt={driver.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-[#65A2D0]" // Рамка вокруг фото
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Водитель'; }}
              />
              <h3 className="text-xl font-semibold mb-1 text-center">{driver.name}</h3>
              <p className="text-sm text-gray-600 text-center">Авто: {driver.car}</p>
              <p className="text-sm text-gray-600 text-center">Язык: {driver.languages}</p>
              <p className="text-sm text-gray-600 mt-2 text-center">{driver.description}</p>
              <div className="mt-4 text-center">
                <button className={buttonClasses}>Забронировать</button>
              </div>
            </div>
          ))}

          {drivers.map((driver) => (
            <div
              key={`duplicate-${driver.id}`}
              className="flex-shrink-0 w-64 bg-white bg-opacity-90 text-gray-800 rounded-xl p-4 m-2 shadow-lg"
            >
              <img
                src={driver.image}
                alt={driver.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-[#65A2D0]"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Водитель'; }}
              />
              <h3 className="text-xl font-semibold mb-1 text-center">{driver.name}</h3>
              <p className="text-sm text-gray-600 text-center">Авто: {driver.car}</p>
              <p className="text-sm text-gray-600 text-center">Язык: {driver.languages}</p>
              <p className="text-sm text-gray-600 mt-2 text-center">{driver.description}</p>
              <div className="mt-4 text-center">
                <button className={buttonClasses}>Забронировать</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DriverCarousel;
