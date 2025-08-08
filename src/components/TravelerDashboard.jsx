import React from 'react';

// Компонент личного кабинета путешественника
function TravelerDashboard({ user, db }) {
  return (
    <div className="bg-white bg-opacity-50 rounded-lg p-6 mb-4 shadow-lg text-gray-800">
      <h2 className="text-2xl font-bold mb-4">Личный кабинет путешественника</h2>
      {user ? (
        <p className="text-lg">Добро пожаловать, {user.email || 'Путешественник'}!</p>
      ) : (
        <p className="text-lg">Пожалуйста, войдите, чтобы просмотреть свой личный кабинет.</p>
      )}
      <p className="mt-4">Здесь будет информация о ваших поездках, заказах и предпочтениях.</p>
      {/* Здесь можно добавить функционал для путешественника */}
    </div>
  );
}

export default TravelerDashboard;
