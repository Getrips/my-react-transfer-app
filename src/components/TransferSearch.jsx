import React, { useState } from 'react';
import { MapPin, CalendarDays, ChevronUp, ChevronDown } from 'lucide-react';

const cities = [
  'Тбилиси', 'Тбилиси (Аэропорт)', 'Кутаиси', 'Кутаиси (Аэропорт)',
  'Батуми', 'Батуми (Аэропорт)', 'Зугдиди', 'Телави', 'Гори', 'Мцхета',
];

const carClasses = ['Седан', 'Минивен', 'Кроссовер'];
const languages = ['Грузинский', 'Русский', 'Английский', 'Арабский', 'Турецкий'];
const extrasList = ['Детское кресло', 'Бустер', 'Багажник на крыше'];

function TransferSearch({ onSearch }) {
  const [formData, setFormData] = useState({
    from: '', to: '', date: '', carClass: '', language: '', extras: [], stops: [''],
  });

  const [showExtras, setShowExtras] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExtrasChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      extras: checked ? [...prev.extras, value] : prev.extras.filter((item) => item !== value),
    }));
  };

  const handleStopsChange = (index, value) => {
    const newStops = [...formData.stops];
    newStops[index] = value;
    setFormData((prev) => ({ ...prev, stops: newStops }));
  };

  const addStop = () => {
    setFormData((prev) => ({ ...prev, stops: [...prev.stops, ''] }));
  };

  const swapCities = () => {
    setFormData((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.from === formData.to) {
      console.warn('Пункты отправления и назначения не могут совпадать.');
      return;
    }
    onSearch(formData);
  };

  const handleViewAllTransfers = () => {
    console.log('Показать все трансферы');
  };

  return (
    <form
      onSubmit={handleSubmit}
      // Фон формы теперь белый, как на первом фото
      className="bg-white rounded-xl p-6 space-y-4 text-gray-800"
    >
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <select
            name="from"
            value={formData.from}
            onChange={handleChange}
            className="w-full bg-gray-100 text-gray-800 border border-gray-300 p-2 pl-10 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-[#449AD4]"
            required
          >
            <option value="">Откуда? </option>
            {cities.map((city, i) => (
              <option key={i} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Кнопка "Поменять местами" теперь яркий синий текст */}
        <button
          type="button"
          onClick={swapCities}
          className="text-[#449AD4] hover:text-[#062343] flex items-center justify-center p-2 rounded transition-colors duration-300"
        >
          ↔
        </button>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <select
            name="to"
            value={formData.to}
            onChange={handleChange}
            className="w-full bg-gray-100 text-gray-800 border border-gray-300 p-2 pl-10 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-[#449AD4]"
            required
          >
            <option value="">Куда? </option>
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
              className="w-full bg-gray-100 text-gray-800 border border-gray-300 p-2 pl-8 rounded focus:outline-none focus:ring-2 focus:ring-[#449AD4]"
            />
          </div>
        ))}
        {/* Кнопка "Добавить остановку" теперь яркий синий текст */}
        <button
          type="button"
          onClick={addStop}
          className="w-full bg-gray-100 border border-gray-300 text-[#449AD4] hover:text-[#062343] p-2 rounded text-sm font-semibold transition-colors duration-300"
        >
          + Добавить остановку
        </button>
      </div>

      <div className="relative">
        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full bg-gray-100 text-gray-800 border border-gray-300 p-2 pl-10 rounded focus:outline-none focus:ring-2 focus:ring-[#449AD4]"
          required
        />
      </div>

      <select
        name="carClass"
        value={formData.carClass}
        onChange={handleChange}
        className="w-full bg-gray-100 text-gray-800 border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#449AD4]"
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
        className="w-full bg-gray-100 text-gray-800 border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#449AD4]"
      >
        <option value="">Язык водителя</option>
        {languages.map((lang, i) => (
          <option key={i} value={lang}>
            {lang}
          </option>
        ))}
      </select>

      <div className="space-y-2">
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

        {showExtras && (
          <div className="flex flex-wrap gap-4">
            {extrasList.map((extra, i) => (
              <label key={i} className="text-sm flex items-center gap-1">
                <input
                  type="checkbox"
                  value={extra}
                  checked={formData.extras.includes(extra)}
                  onChange={handleExtrasChange}
                  className="form-checkbox text-[#449AD4] rounded focus:ring-2 focus:ring-[#449AD4]" // Цвет чекбокса
                />
                {extra}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Кнопка "Найти трансферы" теперь яркая синяя */}
      <button
        type="submit"
        className="w-full bg-[#449AD4] hover:bg-[#062343] text-white font-semibold p-3 rounded-lg transition-colors duration-300"
      >
        Найти трансферы
      </button>

      {/* Кнопка "Все трансферы" теперь светло-синяя */}
      <button
        type="button"
        onClick={handleViewAllTransfers}
        className="w-full bg-[#65A2D0] hover:bg-[#449AD4] text-white font-semibold p-3 rounded-lg mt-2 transition-colors duration-300"
      >
        Все трансферы
      </button>
    </form>
  );
}

export default TransferSearch;
