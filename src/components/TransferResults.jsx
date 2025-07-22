import React from 'react';

function TransferResults({ results }) {
  // Если нет результатов или массив пуст, отображаем заглушку
  if (!results || results.length === 0) {
    return (
      <div className="text-center text-gray-400 p-4 rounded-lg bg-white bg-opacity-10 mt-4 font-bold">
        Здесь будут отображаться результаты вашего поиска трансфера.
      </div>
    );
  }

  // Если результаты есть, отображаем их
  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold text-white mb-4">Результаты поиска</h2>
      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-md text-gray-800 font-bold">
            <p>Откуда: {result.from}</p>
            <p>Куда: {result.to}</p>
            <p>Дата: {result.date}</p>
            <p>Класс автомобиля: {result.carClass}</p>
            <p>Язык водителя: {result.language}</p>
            <p>Дополнительно: {result.extras.join(', ') || 'Нет'}</p> {/* Отображаем доп. услуги через запятую */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransferResults;
