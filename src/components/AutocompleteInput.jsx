import React, { useState, useEffect, useRef } from 'react';
import { MapPin, XCircle } from 'lucide-react'; // Импортируем XCircle для кнопки очистки

/**
 * Компонент для ввода текста с автозаполнением и выпадающим списком предложений.
 *
 * @param {object} props - Свойства компонента.
 * @param {string} props.value - Текущее значение поля ввода.
 * @param {function} props.onChange - Функция обратного вызова при изменении значения поля ввода.
 * @param {string} props.placeholder - Текст-заполнитель для поля ввода.
 * @param {string[]} props.locations - Массив всех доступных местоположений для предложений.
 * @param {string} props.iconColor - Класс цвета для иконки MapPin (например, 'text-blue-500').
 * @param {function} props.onSelect - Функция обратного вызова при выборе элемента из списка предложений.
 */
function AutocompleteInput({ value, onChange, placeholder, locations, iconColor, onSelect }) {
  const [filteredLocations, setFilteredLocations] = useState([]); // Состояние для отфильтрованных предложений
  const [showSuggestions, setShowSuggestions] = useState(false); // Состояние для видимости списка предложений
  const wrapperRef = useRef(null); // Ссылка на корневой элемент компонента для отслеживания кликов вне его

  // Эффект для обработки кликов вне компонента, чтобы закрыть список предложений
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false); // Скрыть предложения, если клик был вне компонента
      }
    };
    document.addEventListener('mousedown', handleClickOutside); // Добавить слушатель события
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Удалить слушатель события при размонтировании компонента
    };
  }, []);

  // Обработчик изменения значения в поле ввода
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue); // Обновить значение в родительском компоненте

    if (inputValue.length > 0) {
      // Фильтруем местоположения на основе введенного текста
      const filtered = locations.filter(location =>
        location.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredLocations(filtered); // Обновить отфильтрованные предложения
      setShowSuggestions(true); // Показать список предложений
    } else {
      setFilteredLocations(locations); // Если поле пустое, показать все доступные локации
      setShowSuggestions(true); // Показать список предложений
    }
  };

  // Обработчик выбора предложения из списка
  const handleSelectSuggestion = (location) => {
    onSelect(location); // Передать выбранное значение в родительский компонент
    setShowSuggestions(false); // Закрыть список предложений
    setFilteredLocations([]); // Очистить отфильтрованные предложения
  };

  // Обработчик очистки поля ввода
  const handleClearInput = () => {
    onChange(''); // Очистить значение в родительском компоненте
    setFilteredLocations([]); // Очистить отфильтрованные предложения
    setShowSuggestions(false); // Скрыть список предложений
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-sm">
        <MapPin size={20} className={`${iconColor} mr-3`} />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          // Показать предложения при фокусе
          onFocus={() => {
            if (value.length > 0) {
                // Если есть текст, фильтруем по нему
                const filtered = locations.filter(location =>
                    location.toLowerCase().includes(value.toLowerCase())
                );
                setFilteredLocations(filtered);
            } else {
                // Если поле пустое, показываем все локации
                setFilteredLocations(locations);
            }
            setShowSuggestions(true); // Всегда показываем предложения при фокусе
          }}
          className="flex-grow bg-transparent outline-none text-lg text-gray-800"
        />
        {/* Кнопка очистки */}
        {value && ( // Показываем кнопку только если есть текст в поле
          <button
            type="button"
            onClick={handleClearInput}
            className="ml-2 p-1 rounded-full text-gray-500 hover:bg-gray-200 focus:outline-none"
            title="Очистить"
          >
            <XCircle size={18} />
          </button>
        )}
      </div>
      {/* Отображаем список предложений, если showSuggestions true и есть отфильтрованные элементы */}
      {showSuggestions && filteredLocations.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
          {filteredLocations.map((location, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-800"
              onClick={() => handleSelectSuggestion(location)}
            >
              {location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AutocompleteInput;
