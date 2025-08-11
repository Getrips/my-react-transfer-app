import React, { useState, useMemo } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { LogIn, UserPlus, ArrowLeftCircle } from 'lucide-react';

function MainPage({ user, auth, handleSignOut, setCurrentView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('tourist');
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isPhoneTouched, setIsPhoneTouched] = useState(false);

  const sanitizePhone = (value) => value.replace(/\s|-/g, '');
  const isValidPhone = (value) => /^\+?\d{10,15}$/.test(sanitizePhone(value));

  const evaluatePasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    const percent = Math.round((score / 5) * 100);
    let label = 'Очень слабый';
    let color = 'bg-red-500';
    if (score === 2) { label = 'Слабый'; color = 'bg-orange-500'; }
    if (score === 3) { label = 'Средний'; color = 'bg-yellow-500'; }
    if (score === 4) { label = 'Хороший'; color = 'bg-green-500'; }
    if (score === 5) { label = 'Сильный'; color = 'bg-emerald-600'; }
    return { percent, label, color };
  };

  const passwordStrength = useMemo(() => evaluatePasswordStrength(password), [password]);

  // Обработка входа/регистрации по электронной почте
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !password || (isRegistering && (!phone || !role || !confirmPassword))) {
      setError(isRegistering ? "Пожалуйста, заполните все поля для регистрации." : "Пожалуйста, введите адрес электронной почты и пароль.");
      return;
    }
    if (isRegistering && !isValidPhone(phone)) {
      setError('Введите корректный номер телефона (10-15 цифр, можно с "+").');
      return;
    }
    if (isRegistering && password !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }
    if (!auth) {
      setError("Firebase Auth не инициализирован. Функции аутентификации недоступны.");
      return;
    }
    try {
      if (isRegistering) {
        // Регистрация нового пользователя (email + password)
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        setError(null);
        // Сохраняем профиль в Firestore
        try {
          const sanitized = sanitizePhone(phone);
          await setDoc(doc(db, 'users', credential.user.uid), {
            uid: credential.user.uid,
            email,
            role,
            phone: sanitized,
            provider: 'password',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (writeErr) {
          console.error('Ошибка сохранения профиля пользователя:', writeErr);
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setError(null);
      }
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

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 w-full max-w-md text-center transform transition-all duration-300 hover:scale-105">
        <button
          onClick={() => setCurrentView('transferPage')}
          className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full shadow-md transition-all duration-300 flex items-center justify-center"
          title="Вернуться к выбору поездок"
        >
          <ArrowLeftCircle size={24} />
        </button>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#7860BE] mb-6">
          Вход и регистрация
        </h1>
        <div className="space-y-6">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-left text-gray-700 mb-1 font-medium">Выберите роль:</label>
                <div className="flex space-x-4 justify-center">
                  <label className="inline-flex items-center">
                    <input type="radio" name="role" value="tourist" checked={role === 'tourist'} onChange={() => setRole('tourist')} className="mr-2" /> Турист
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="role" value="executor" checked={role === 'executor'} onChange={() => setRole('executor')} className="mr-2" /> Исполнитель
                  </label>
                </div>
              </div>
            )}
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
            {isRegistering && (
              <div>
                <input
                  type="tel"
                  inputMode="tel"
                  placeholder="Номер телефона (например, +995512345678)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => setIsPhoneTouched(true)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                  required
                />
                {isPhoneTouched && phone && !isValidPhone(phone) && (
                  <p className="text-red-500 text-sm mt-2">Введите корректный номер телефона (10-15 цифр, можно с "+").</p>
                )}
              </div>
            )}
            <div>
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                required
              />
              {isRegistering && (
                <div className="mt-2">
                  <div className="h-2 w-full bg-gray-200 rounded">
                    <div className={`h-2 rounded ${passwordStrength.color}`} style={{ width: `${passwordStrength.percent}%` }} />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Надежность пароля: {passwordStrength.label}</p>
                  <p className="text-xs text-gray-500 mt-1">Минимум 8 символов, заглавные и строчные буквы, цифры и символы.</p>
                </div>
              )}
            </div>
            {isRegistering && (
              <div>
                <input
                  type="password"
                  placeholder="Повторите пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                  required
                />
              </div>
            )}
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
        </div>
      </div>
    </div>
  );
}

export default MainPage;
