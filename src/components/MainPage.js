import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth';
import { LogIn, UserPlus, User, ArrowRight, ArrowLeftCircle } from 'lucide-react';

function MainPage({ user, auth, handleSignOut, setCurrentView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false); // Состояние для переключения между входом и регистрацией

  // Обработка входа/регистрации по электронной почте
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError(null); // Сброс предыдущих ошибок

    if (!email || !password) {
      setError("Пожалуйста, введите адрес электронной почты и пароль.");
      return;
    }

    if (!auth) {
      setError("Firebase Auth не инициализирован. Функции аутентификации недоступны.");
      return;
    }

    try {
      if (isRegistering) {
        // Регистрация нового пользователя
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("Пользователь успешно зарегистрирован!");
        setError(null); // Очищаем ошибки при успешной регистрации
      } else {
        // Вход существующего пользователя
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Пользователь успешно вошел в систему!");
        setError(null); // Очищаем ошибки при успешном входе
      }
      // После успешного входа/регистрации переходим в личный кабинет
      setCurrentView('dashboard');
    } catch (err) {
      console.error("Ошибка аутентификации:", err);
      // Отображаем более понятные сообщения об ошибках
      switch (err.code) {
        case 'auth/invalid-email':
          setError("Неверный формат адреса электронной почты.");
          break;
        case 'auth/user-disabled':
          setError("Этот пользовательский аккаунт был отключен.");
          break;
        case 'auth/user-not-found':
          setError("Пользователь с таким адресом электронной почты не найден.");
          break;
        case 'auth/wrong-password':
          setError("Неверный пароль.");
          break;
        case 'auth/email-already-in-use':
          setError("Этот адрес электронной почты уже используется.");
          break;
        case 'auth/weak-password':
          setError("Пароль должен быть не менее 6 символов.");
          break;
        default:
          setError(`Ошибка аутентификации: ${err.message}`);
      }
    }
  };

  // Вход с Google
  const handleGoogleSignIn = async () => {
    setError(null);
    if (!auth) {
      setError("Firebase Auth не инициализирован. Функции аутентификации недоступны.");
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      console.log("Вход через Google успешен!");
      setError(null);
      setCurrentView('dashboard'); // Переходим в личный кабинет после входа через Google
    } catch (err) {
      console.error("Ошибка входа через Google:", err);
      setError(`Ошибка входа через Google: ${err.message}`);
    }
  };

  // Вход в качестве гостя (анонимно)
  const handleGuestSignIn = async () => {
    setError(null);
    if (!auth) {
      setError("Firebase Auth не инициализирован. Функции аутентификации недоступны.");
      return;
    }
    try {
      await signInAnonymously(auth);
      console.log("Анонимный вход успешен!");
      setError(null);
      setCurrentView('dashboard'); // Переходим в личный кабинет после анонимного входа
    } catch (err) {
      console.error("Ошибка анонимного входа:", err);
      setError(`Ошибка анонимного входа: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 w-full max-w-md text-center transform transition-all duration-300 hover:scale-105">
        <button
          onClick={() => setCurrentView('transferPage')} // Возвращаемся на TransferPage
          className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full shadow-md transition-all duration-300 flex items-center justify-center"
          title="Вернуться к выбору поездок"
        >
          <ArrowLeftCircle size={24} />
        </button>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#7860BE] mb-6">
          Планировщик Поездок
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Ваш идеальный спутник в планировании приключений.
        </p>

        {user ? (
          // Если пользователь вошел в систему
          <div className="space-y-4">
            <p className="text-xl text-gray-700 font-semibold mb-6">
              Добро пожаловать, {user.email || 'Гость'}!
            </p>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="w-full bg-[#7860BE] hover:bg-[#6a54a8] text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg"
            >
              <ArrowRight size={24} className="mr-3" /> Перейти в личный кабинет
            </button>
            <button
              onClick={handleSignOut}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg"
            >
              <LogIn size={24} className="mr-3" /> Выйти
            </button>
          </div>
        ) : (
          // Если пользователь не вошел в систему
          <div className="space-y-6">
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Электронная почта"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <button
                type="submit"
                className="w-full bg-[#7860BE] hover:bg-[#6a54a8] text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg"
              >
                {isRegistering ? (
                  <>
                    <UserPlus size={24} className="mr-3" /> Зарегистрироваться
                  </>
                ) : (
                  <>
                    <LogIn size={24} className="mr-3" /> Войти
                  </>
                )}
              </button>
            </form>

            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[#7860BE] hover:underline text-md font-medium"
            >
              {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">ИЛИ</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg"
            >
              {/* Встроенный SVG для логотипа Google */}
              <svg className="mr-3" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.24 10.21V14.11H18.73C18.51 15.36 18.06 16.51 17.39 17.47C16.71 18.43 15.82 19.23 14.78 19.78C13.74 20.33 12.59 20.61 11.39 20.61C9.09 20.61 7.15 19.82 5.56 18.23C3.97 16.64 3.18 14.7 3.18 12.41C3.18 10.11 3.97 8.17 5.56 6.58C7.15 4.99 9.09 4.2 11.39 4.2C12.98 4.2 14.42 4.67 15.71 5.61L18.66 2.66C16.71 1.07 14.28 0.28 11.39 0.28C7.81 0.28 4.79 1.58 2.58 3.79C0.37 6.01 -0.74 8.99 -0.74 12.41C-0.74 15.82 0.37 18.8 2.58 21.01C4.79 23.22 7.81 24.52 11.39 24.52C14.28 24.52 16.71 23.73 18.73 21.71C20.76 19.7 21.87 17.15 21.87 14.11C21.87 13.25 21.75 12.41 21.51 11.58H12.24Z" fill="#4285F4"/>
                <path d="M0.37 8.99L3.18 6.58L5.56 6.58C3.97 8.17 3.18 10.11 3.18 12.41C3.18 14.7 3.97 16.64 5.56 18.23L3.18 21.01L0.37 21.01C-0.74 18.8 -0.74 15.82 -0.74 12.41C-0.74 8.99 0.37 6.01 2.58 3.79C4.79 1.58 7.81 0.28 11.39 0.28C14.28 0.28 16.71 1.07 18.73 2.66L15.71 5.61C14.42 4.67 12.98 4.2 11.39 4.2C9.09 4.2 7.15 4.99 5.56 6.58C3.97 8.17 3.18 10.11 3.18 12.41C3.18 14.7 3.97 16.64 5.56 18.23L3.18 21.01L0.37 21.01Z" fill="#FBBC05"/>
                <path d="M11.39 4.2C12.98 4.2 14.42 4.67 15.71 5.61L18.66 2.66C16.71 1.07 14.28 0.28 11.39 0.28C7.81 0.28 4.79 1.58 2.58 3.79C0.37 6.01 -0.74 8.99 -0.74 12.41C-0.74 15.82 0.37 18.8 2.58 21.01C4.79 23.22 7.81 24.52 11.39 24.52C14.28 24.52 16.71 23.73 18.73 21.71C20.76 19.7 21.87 17.15 21.87 14.11C21.87 13.25 21.75 12.41 21.51 11.58H12.24V10.21H21.51C21.75 11.04 21.87 11.88 21.87 12.72C21.87 15.76 20.76 18.31 18.73 20.33C16.71 22.36 14.28 23.15 11.39 23.15C7.81 23.15 4.79 21.85 2.58 19.64C0.37 17.43 -0.74 14.45 -0.74 11.04C-0.74 7.62 0.37 4.64 2.58 2.43C4.79 0.22 7.81 -1.08 11.39 -1.08C14.28 -1.08 16.71 -0.29 18.73 1.73L15.71 4.67C14.42 3.73 12.98 3.26 11.39 3.26Z" fill="#EA4335"/>
                <path d="M12.24 10.21V14.11H18.73C18.51 15.36 18.06 16.51 17.39 17.47C16.71 18.43 15.82 19.23 14.78 19.78C13.74 20.33 12.59 20.61 11.39 20.61C9.09 20.61 7.15 19.82 5.56 18.23C3.97 16.64 3.18 14.7 3.18 12.41C3.18 10.11 3.97 8.17 5.56 6.58C7.15 4.99 9.09 4.2 11.39 4.2C12.98 4.2 14.42 4.67 15.71 5.61L18.66 2.66C16.71 1.07 14.28 0.28 11.39 0.28C7.81 0.28 4.79 1.58 2.58 3.79C0.37 6.01 -0.74 8.99 -0.74 12.41C-0.74 15.82 0.37 18.8 2.58 21.01C4.79 23.22 7.81 24.52 11.39 24.52C14.28 24.52 16.71 23.73 18.73 21.71C20.76 19.7 21.87 17.15 21.87 14.11C21.87 13.25 21.75 12.41 21.51 11.58H12.24Z" fill="#34A853"/>
              </svg>
              Войти с Google
            </button>

            <button
              onClick={handleGuestSignIn}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg"
            >
              <User size={24} className="mr-3" /> Войти как гость
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;
