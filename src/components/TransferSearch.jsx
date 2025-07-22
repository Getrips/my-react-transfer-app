import React, { useState } from 'react';
import { MapPin, CalendarDays, ChevronUp, ChevronDown } from 'lucide-react'; // Импортируем нужные иконки

// Данные для выпадающих списков
const cities = [
  'Тбилиси',
  'Тбилиси (Аэропорт)',
  'Кутаиси',
  'Кутаиси (Аэропорт)',
  'Батуми',
  'Батуми (Аэропорт)',
  'Зугдиди',
  'Телави',
  'Гори',
  'Мцхета',
];

const carClasses = ['Седан', 'Минивен', 'Кроссовер'];
const languages = ['Грузинский', 'Русский', 'Английский', 'Арабский', 'Турецкий'];
const extrasList = ['Детское кресло', 'Бустер', 'Багажник на крыше'];

function TransferSearch({ onSearch }) {
  // Состояние формы
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    carClass: '',
    language: '',
    extras: [],
    stops: [''],
  });

  // Состояние для управления видимостью блока "Дополнительно"
  const [showExtras, setShowExtras] = useState(false);

  // Обработчик изменения полей ввода
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Обработчик изменения чекбоксов "Дополнительно"
  const handleExtrasChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      extras: checked ? [...prev.extras, value] : prev.extras.filter((item) => item !== value),
    }));
  };

  // Обработчик изменения полей остановок
  const handleStopsChange = (index, value) => {
    const newStops = [...formData.stops];
    newStops[index] = value;
    setFormData((prev) => ({ ...prev, stops: newStops }));
  };

  // Добавление новой остановки
  const addStop = () => {
    setFormData((prev) => ({ ...prev, stops: [...prev.stops, ''] }));
  };

  // Поменять местами города отправления и назначения
  const swapCities = () => {
    setFormData((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.from === formData.to) {
      // В реальном приложении здесь можно было бы показать модальное окно или сообщение на UI
      console.warn('Пункты отправления и назначения не могут совпадать.');
      return;
    }
    onSearch(formData);
  };

  // Функция для обработки нажатия на кнопку "Все трансферы"
  const handleViewAllTransfers = () => {
    console.log('Показать все трансферы');
    // Здесь можно добавить логику для перехода на страницу со всеми трансферами
  };

  return (
    <form
      onSubmit={handleSubmit}
      // Фон формы теперь белый, 50% прозрачности, с белой обводкой 50% прозрачности
      className="bg-white bg-opacity-50 border border-white border-opacity-50 rounded-xl p-6 space-y-4 text-gray-800"
    >
      <div className="grid sm:grid-cols-3 gap-4">
        {/* Поле "Откуда" с иконкой локации */}
        <div className="relative">
          {/* Значок локации для "Откуда?" - оранжевый */}
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#DF6421]" size={20} />
          <select
            name="from"
            value={formData.from}
            onChange={handleChange}
            className="w-full bg-white text-gray-800 border border-gray-300 p-2 pl-10 rounded appearance-none"
            required
          >
            {/* Изменен текст опции на "Откуда?" */}
            <option value="">Откуда?</option>
            {cities.map((city, i) => (
              <option key={i} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Кнопка "Поменять местами" */}
        <button
          type="button"
          onClick={swapCities}
          // Увеличены классы text-3xl и font-extrabold для еще большего размера и жирности стрелки
          className="text-[#DF6421] hover:text-[#B8501A] flex items-center justify-center p-2 rounded text-3xl font-extrabold"
        >
          ↔
        </button>

        {/* Поле "Куда" с иконкой локации */}
        <div className="relative">
          {/* Значок локации для "Куда?" - фиолетовый */}
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7860BE]" size={20} />
          <select
            name="to"
            value={formData.to}
            onChange={handleChange}
            className="w-full bg-white text-gray-800 border border-gray-300 p-2 pl-10 rounded appearance-none"
            required
          >
            {/* Изменен текст опции на "Куда?" */}
            <option value="">Куда?</option>
            {cities.map((city, i) => (
              <option key={i} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {formData.stops.map((stop, i) => (
          <div key={i} className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">+</span>
            <input
              type="text"
              placeholder={`Остановка ${i + 1}`}
              value={stop}
              onChange={(e) => handleStopsChange(i, e.target.value)}
              className="w-full bg-white text-gray-800 border border-gray-300 p-2 pl-8 rounded"
            />
          </div>
        ))}
        {/* Кнопка "Добавить остановку" */}
        <button
          type="button"
          onClick={addStop}
          // Убедитесь, что здесь нет 'italic' и есть 'border-dashed'
          className="w-full bg-white border-2 border-[#DF6421] border-dashed text-[#DF6421] hover:bg-gray-100 p-2 rounded text-sm font-semibold transition-colors duration-300"
        >
          + Добавить остановку
        </button>
      </div>

      {/* Поле "Дата трансфера" с иконкой календаря */}
      <div className="relative">
        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full bg-white text-gray-800 border border-gray-300 p-2 pl-10 rounded"
          required
        />
      </div>

      <select
        name="carClass"
        value={formData.carClass}
        onChange={handleChange}
        className="w-full bg-white text-gray-800 border border-gray-300 p-2 rounded"
      >
        <option value="">Класс автомобиля</option>
        {carClasses.map((car, i) => (
          <option key={i} value={car}>
            {car}
          </option>
        ))}
      </select>

      <select
        name="language"
        value={formData.language}
        onChange={handleChange}
        className="w-full bg-white text-gray-800 border border-gray-300 p-2 rounded"
      >
        <option value="">Язык водителя</option>
        {languages.map((lang, i) => (
          <option key={i} value={lang}>
            {lang}
          </option>
        ))}
      </select>

      <div className="space-y-2">
        {/* Заголовок "Дополнительно" с кнопкой для сворачивания/разворачивания */}
        <button
          type="button"
          onClick={() => setShowExtras(!showExtras)}
          className="font-semibold flex items-center gap-1 w-full text-left p-2 -ml-2 rounded hover:bg-gray-100 focus:outline-none"
        >
          Дополнительно:
          {showExtras ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>

        {/* Блок с чекбоксами "Дополнительно" - отображается по условию */}
        {showExtras && (
          <div className="flex flex-wrap gap-4">
            {extrasList.map((extra, i) => (
              <label key={i} className="text-sm flex items-center gap-1">
                <input
                  type="checkbox"
                  value={extra}
                  checked={formData.extras.includes(extra)}
                  onChange={handleExtrasChange}
                  className="form-checkbox text-[#DF6421] rounded"
                />
                {extra}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Кнопка "Найти трансферы" */}
      <button
        type="submit"
        className="w-full bg-[#DF6421] hover:bg-[#B8501A] text-white font-bold p-3 rounded-lg transition-colors duration-300 text-xl"
      >
        Найти трансферы
      </button>

      {/* Кнопка "Все трансферы" */}
      <button
        type="button"
        onClick={handleViewAllTransfers}
        className="w-full bg-[#CEF65F] hover:bg-[#B0C09F] text-[#08102E] font-bold p-3 rounded-lg mt-2"
      >
        Все трансферы
      </button>
    </form>
  );
}

export default TransferSearch;
