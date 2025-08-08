import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'; // Импортируем только функции

function AuthComponent({ setCurrentView, auth }) { // Получаем auth через пропсы
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Очищаем предыдущие ошибки

    if (!auth) { // Проверяем, что экземпляр auth доступен
      setError("Firebase Auth неактивен. Пожалуйста, проверьте статус Firebase.");
      return;
    }

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("Регистрация успешна!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Вход успешен!");
      }
      setCurrentView('dashboard'); // Переходим в личный кабинет при успехе
    } catch (err) {
      console.error("Ошибка аутентификации:", err);
      // Отображаем более понятные сообщения об ошибках
      if (err.code === 'auth/invalid-email') {
        setError('Неверный формат электронной почты.');
      } else if (err.code === 'auth/user-disabled') {
        setError('Пользователь заблокирован.');
      } else if (err.code === 'auth/user-not-found') {
        setError('Пользователь не найден. Возможно, вам нужно зарегистрироваться.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Неверный пароль.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Этот адрес электронной почты уже используется.');
      } else if (err.code === 'auth/weak-password') {
        setError('Пароль должен быть не менее 6 символов.');
      } else {
        setError(`Ошибка аутентификации: ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isRegistering ? 'Регистрация' : 'Вход'}
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Ошибка!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
              Электронная почта
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ваша.почта@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
          >
            {isRegistering ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </button>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => setCurrentView('transferPage')}
            className="text-gray-500 hover:underline text-sm"
          >
            Вернуться на страницу трансфера
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthComponent;
