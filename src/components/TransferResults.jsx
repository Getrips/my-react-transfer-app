import React from 'react';

const TransferResults = ({ results }) => {
  if (results.length === 0) return null;

  return (
    <div className="mt-8 bg-[#333438] border border-[#19181E] rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Результаты поиска</h2>
      {results.map((res, index) => (
        <div key={index} className="mb-4 p-4 rounded-lg bg-[#19181E]">
          <p><strong>Из:</strong> {res.from}</p>
          <p><strong>В:</strong> {res.to}</p>
          <p><strong>Дата:</strong> {res.date}</p>
          <p><strong>Класс авто:</strong> {res.carClass || 'Не указан'}</p>
          <p><strong>Язык водителя:</strong> {res.language || 'Не указан'}</p>
          {res.extras.length > 0 && (
            <p><strong>Дополнительно:</strong> {res.extras.join(', ')}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default TransferResults;