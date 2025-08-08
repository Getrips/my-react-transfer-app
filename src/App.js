/* global __firebase_config __initial_auth_token __app_id */
import React, { useState, useEffect } from 'react';
// Импортируем только необходимые функции Firebase, но инициализация будет условной.
import { onAuthStateChanged, signOut, signInAnonymously, signInWithCustomToken, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Импортируем компоненты страниц
import MainPage from './components/MainPage'; // MainPage теперь также обрабатывает аутентификацию
import DashboardPage from './components/DashboardPage';
import TransferPage from './components/TransferPage';
// AuthComponent больше не нужен, его функциональность перенесена в MainPage

function App() {
  const [user, setUser] = useState(null);
  const [authInstance, setAuthInstance] = useState(null);
  const [dbInstance, setDbInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('mainPage'); // Начинаем с MainPage
  const [firebaseStatus, setFirebaseStatus] = useState({ initialized: false, error: null, message: '' });

  useEffect(() => {
    let app, auth, db;
    let isFirebaseActive = false;

    try {
      const firebaseConfigString = typeof __firebase_config !== 'undefined' ? __firebase_config : '';
      let firebaseConfig = null;

      if (firebaseConfigString) {
        try {
          firebaseConfig = JSON.parse(firebaseConfigString);
          // Проверяем, что объект конфигурации не пуст
          if (Object.keys(firebaseConfig).length === 0) {
            throw new Error("Конфигурация Firebase пуста.");
          }
          // Если конфигурация действительна, инициализируем Firebase
          app = initializeApp(firebaseConfig);
          auth = getAuth(app);
          db = getFirestore(app);
          setAuthInstance(auth);
          setDbInstance(db);
          isFirebaseActive = true;
          setFirebaseStatus({ initialized: true, error: null, message: 'Firebase успешно инициализирован.' });
        } catch (parseError) {
          // Ошибка парсинга или пустая конфигурация
          setFirebaseStatus({
            initialized: false,
            error: true,
            message: `Ошибка парсинга Firebase config: ${parseError.message}. Firebase неактивен.`,
          });
          console.error(`Ошибка парсинга Firebase config: ${parseError.message}. Полученная строка: "${firebaseConfigString}"`);
        }
      } else {
        // __firebase_config не определен или пуст
        setFirebaseStatus({
          initialized: false,
          error: true,
          message: "Переменная __firebase_config не найдена или пуста. Firebase неактивен. Функции, зависящие от Firebase, будут недоступны.",
        });
        console.warn("Переменная __firebase_config не найдена или пуста. Firebase не будет инициализирован.");
      }

      // Аутентификация пользователя, только если Firebase активен
      if (isFirebaseActive && auth) {
        const authenticateUser = async () => {
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            try {
              await signInWithCustomToken(auth, __initial_auth_token);
              console.log("Успешный вход с кастомным токеном.");
            } catch (error) {
              console.error("Ошибка входа с кастомным токеном:", error);
              try {
                await signInAnonymously(auth);
                console.log("Успешный анонимный вход.");
              } catch (anonError) {
                console.error("Ошибка анонимного входа:", anonError);
                setFirebaseStatus(prev => ({ ...prev, error: true, message: prev.message + ` Ошибка аутентификации: ${anonError.message}` }));
              }
            }
          } else {
            try {
              await signInAnonymously(auth);
              console.log("Успешный анонимный вход (без токена).");
            } catch (anonError) {
              console.error("Ошибка анонимного входа:", anonError);
              setFirebaseStatus(prev => ({ ...prev, error: true, message: prev.message + ` Ошибка аутентификации: ${anonError.message}` }));
            }
          }
        };
        authenticateUser();

        // Слушатель изменений состояния аутентификации
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          if (currentUser) {
            setUser(currentUser);
            setCurrentView('dashboard'); // Переходим в личный кабинет, если пользователь вошел
          } else {
            setUser(null);
            setCurrentView('mainPage'); // Возвращаемся на MainPage (для входа/регистрации), если вышел
          }
          setLoading(false);
        });
        return () => unsubscribe(); // Отписка при размонтировании компонента
      } else {
        // Если Firebase не активен, сразу останавливаем загрузку
        setLoading(false);
      }

    } catch (error) {
      console.error("Непредвиденная ошибка при инициализации Firebase:", error);
      setFirebaseStatus({
        initialized: false,
        error: true,
        message: `Непредвиденная ошибка при инициализации: ${error.message}. Firebase неактивен.`,
      });
      setLoading(false);
    }
  }, []);

  const handleSignOut = async () => {
    if (authInstance) { // Проверяем, что authInstance существует
      try {
        await signOut(authInstance);
        console.log("Пользователь вышел из системы.");
        setCurrentView('mainPage'); // После выхода возвращаемся на MainPage
      } catch (error) {
        console.error("Ошибка выхода:", error);
      }
    } else {
      // Если Firebase неактивен, просто переключаемся на MainPage
      setCurrentView('mainPage');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-gray-700 text-xl">
        Загрузка...
      </div>
    );
  }

  return (
    <>
      {firebaseStatus.error && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-2 text-center text-sm z-50">
          {firebaseStatus.message}
        </div>
      )}
      {/* AuthComponent больше не используется напрямую как отдельная страница */}
      {currentView === 'transferPage' && <TransferPage setCurrentView={setCurrentView} />}
      {currentView === 'mainPage' && (
        <MainPage
          user={user}
          auth={authInstance} // Передаем authInstance в MainPage
          handleSignOut={handleSignOut}
          setCurrentView={setCurrentView}
        />
      )}
      {currentView === 'dashboard' && (
        <DashboardPage
          user={user}
          auth={authInstance}
          db={dbInstance}
          appId={typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'}
          handleSignOut={handleSignOut}
          setCurrentView={setCurrentView}
        />
      )}
    </>
  );
}

export default App;
