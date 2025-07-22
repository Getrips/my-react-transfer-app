import React, { useState } from 'react';
// Импорты функций Firebase Authentication для создания пользователя и входа
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// Импорты функций Firestore для работы с документами (сохранение профиля пользователя)
import { doc, setDoc } from 'firebase/firestore';

// Компонент модального окна аутентификации
// Принимает пропсы: onClose (функция для закрытия модального окна), auth (экземпляр Firebase Auth), db (экземпляр Firestore)
function AuthModal({ onClose, auth, db }) {
  // Состояние для определения, находится ли пользователь в режиме регистрации (true) или входа (false)
  const [isRegistering, setIsRegistering] = useState(false);
  // Состояния для хранения значений полей формы
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Состояние для выбранной роли пользователя при регистрации ('traveler' по умолчанию)
  const [role, setRole] = useState('traveler');
  // Состояние для отображения сообщений об ошибках
  const [error, setError] = useState('');
  // Состояние для индикации загрузки (например, при отправке формы)
  const [loading, setLoading] = useState(false);

  // Обработчик для входа пользователя
  const handleLogin = async (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение отправки формы
    setError(''); // Сбрасываем предыдущие ошибки
    setLoading(true); // Включаем индикатор загрузки
    try {
      // Вызываем функцию входа Firebase с email и паролем
      await signInWithEmailAndPassword(auth, email, password);
      onClose(); // Закрываем модальное окно после успешного входа
    } catch (err) {
      // Обработка ошибок входа
      setError('Ошибка входа: ' + err.message);
      console.error("Login error:", err);
    } finally {
      setLoading(false); // Выключаем индикатор загрузки
    }
  };

  // Обработчик для регистрации нового пользователя
  const handleRegister = async (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение отправки формы
    setError(''); // Сбрасываем предыдущие ошибки
    setLoading(true); // Включаем индикатор загрузки
    try {
      // Создаем нового пользователя с email и паролем в Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Получаем объект созданного пользователя

      // Получаем appId из конфигурации Firebase (она будет доступна через auth.app.options.projectId)
      const appId = auth.app.options.projectId || 'default-app-id';

      // Сохраняем профиль пользователя (включая роль) в Firestore
      // Путь к документу: artifacts/{appId}/users/{userId}/user_profiles/{userId}
      const userProfileRef = doc(db, `artifacts/${appId}/users/${user.uid}/user_profiles`, user.uid);
      await setDoc(userProfileRef, {
        email: user.email,
        role: role, // Сохраняем выбранную роль
        createdAt: new Date(), // Добавляем метку времени создания
      });

      onClose(); // Закрываем модальное окно после успешной регистрации
    } catch (err) {
      // Обработка ошибок регистрации
      setError('Ошибка регистрации: ' + err.message);
      console.error("Registration error:", err);
    } finally {
      setLoading(false); // Выключаем индикатор загрузки
    }
  };

  return (
    // Контейнер модального окна: фиксированное позиционирование, затемненный фон, центрирование
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      {/* Основное содержимое модального окна */}
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative text-gray-800 font-bold">
        {/* Кнопка закрытия модального окна */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times; {/* Символ "умножения" для закрытия */}
        </button>

        {/* Заголовок модального окна, меняется в зависимости от режима (Вход/Регистрация) */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isRegistering ? 'Регистрация' : 'Вход'}
        </h2>

        {/* Форма входа/регистрации */}
        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
          {/* Поле для Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#DF6421] focus:border-[#DF6421]"
              required
            />
          </div>
          {/* Поле для Пароля */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Пароль:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#DF6421] focus:border-[#DF6421]"
              required
            />
          </div>

          {/* Выбор роли, отображается только в режиме регистрации */}
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Я:</label>
              <div className="mt-1 flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="traveler"
                    checked={role === 'traveler'}
                    onChange={(e) => setRole(e.target.value)}
                    className="form-radio text-[#DF6421] focus:ring-[#DF6421]"
                  />
                  <span className="ml-2">Путешественник</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="executor"
                    checked={role === 'executor'}
                    onChange={(e) => setRole(e.target.value)}
                    className="form-radio text-[#DF6421] focus:ring-[#DF6421]"
                  />
                  <span className="ml-2">Исполнитель</span>
                </label>
              </div>
            </div>
          )}

          {/* Отображение ошибок */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Кнопка отправки формы */}
          <button
            type="submit"
            className="w-full bg-[#DF6421] hover:bg-[#B8501A] text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-300"
            disabled={loading} // Отключаем кнопку во время загрузки
          >
            {loading ? 'Загрузка...' : (isRegistering ? 'Зарегистрироваться' : 'Войти')}
          </button>
        </form>

        {/* Ссылка для переключения между режимами Вход/Регистрация */}
        <p className="mt-4 text-center text-sm">
          {isRegistering ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)} // Переключает режим
            className="ml-1 text-[#7860BE] hover:underline"
          >
            {isRegistering ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
