import React, { useState } from 'react';

// Данные для водителей, включая рейтинг и изображения-заглушки
const drivers = [
  {
    id: 1, name: 'Леван', car: 'Toyota Prius', languages: 'Грузинский, Турецкий',
    description: 'Комфортные поездки и помощь туристам',
    image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Леван',
    rating: 4.8,
  },
  {
    id: 2, name: 'Мариам', car: 'Hyundai Tucson', languages: 'Русский, Английский',
    description: 'Пунктуальность и забота о клиентах',
    image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Мариам',
    rating: 4.9,
  },
  {
    id: 3, name: 'Давид', car: 'Mercedes E-Class', languages: 'Грузинский, Английский',
    description: 'Опытный водитель, знаток местных маршрутов',
    image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Давид',
    rating: 4.7,
  },
  {
    id: 4, name: 'Нино', car: 'Honda CR-V', languages: 'Русский, Грузинский',
    description: 'Безопасность и комфорт на первом месте',
    image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Нино',
    rating: 5.0,
  },
  {
    id: 5, name: 'Георгий', car: 'Volkswagen Passat', languages: 'Грузинский, Русский',
    description: 'Помощь с багажом и дружелюбное отношение',
    image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Георгий',
    rating: 4.6,
  },
  {
    id: 6, name: 'Тамара', car: 'Skoda Octavia', languages: 'Грузинский, Английский',
    description: 'Знание местных достопримечательностей',
    image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Тамара',
    rating: 4.9,
  },
];

function DriverCarousel() {
  // Состояние для паузы анимации карусели при наведении мыши
  const [isPaused, setIsPaused] = useState(false);

  // Классы для кнопки "Забронировать" в карточках водителей
  const buttonClasses = "bg-[#DF6421] hover:bg-[#B8501A] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300";

  return (
    <div className="mt-12"> {/* Отступ сверху для секции водителей */}
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Наши водители</h2>

      {/* Контейнер для карусели с обработчиками наведения для паузы анимации */}
      <div
        className="relative w-full overflow-hidden py-4"
        onMouseEnter={() => setIsPaused(true)} // При наведении мыши - пауза
        onMouseLeave={() => setIsPaused(false)} // При уходе мыши - возобновление
      >
        {/*
          CSS-анимация для бесконечной прокрутки.
          Определена в index.css.
          Используем два идентичных набора карточек для создания эффекта бесконечного скролла.
          Класс `paused` останавливает анимацию.
        */}
        <style>
          {`
            @keyframes marquee-animation {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee-animation {
              animation: marquee-animation 30s linear infinite; /* Скорость анимации */
            }
            .animate-marquee-animation.paused {
              animation-play-state: paused;
            }
          `}
        </style>

        <div className={`flex flex-nowrap animate-marquee-animation ${isPaused ? 'paused' : ''}`}>
          {/* Первый набор карточек водителей */}
          {drivers.map((driver) => (
            <div
              key={driver.id}
              // Стили карточки: фиксированная ширина, полупрозрачный белый фон, темный текст, скругленные углы, тень
              className="flex-shrink-0 w-64 bg-white bg-opacity-90 text-gray-800 rounded-xl p-4 m-2 shadow-lg"
            >
              <img
                src={driver.image}
                alt={driver.name}
                // Стили изображения: фиксированный размер, круглая форма, центрирование, рамка
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-[#7860BE]" // Цвет рамки
                // Обработчик ошибки загрузки изображения: заменяет на заглушку
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Водитель'; }}
              />
              <h3 className="text-xl font-semibold mb-1 text-center">{driver.name}</h3>
              <p className="text-sm text-gray-600 text-center">Авто: {driver.car}</p>
              <p className="text-sm text-gray-600 text-center">Язык: {driver.languages}</p>
              {/* Отображение рейтинга со звездочкой */}
              <p className="text-xs text-gray-500 text-center mb-2">Рейтинг: {driver.rating} ⭐</p>
              <p className="text-sm text-gray-600 mt-2 text-center">{driver.description}</p>
              <div className="mt-4 text-center">
                <button className={buttonClasses}>Забронировать</button>
              </div>
            </div>
          ))}

          {/* Второй набор карточек водителей (для создания эффекта бесконечной прокрутки) */}
          {drivers.map((driver) => (
            <div
              key={`duplicate-${driver.id}`} // Уникальный ключ для дубликатов
              className="flex-shrink-0 w-64 bg-white bg-opacity-90 text-gray-800 rounded-xl p-4 m-2 shadow-lg"
            >
              <img
                src={driver.image}
                alt={driver.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-[#7860BE]"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Водитель'; }}
              />
              <h3 className="text-xl font-semibold mb-1 text-center">{driver.name}</h3>
              <p className="text-sm text-gray-600 text-center">Авто: {driver.car}</p>
              <p className="text-sm text-gray-600 text-center">Язык: {driver.languages}</p>
              <p className="text-xs text-gray-500 text-center mb-2">Рейтинг: {driver.rating} ⭐</p>
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
