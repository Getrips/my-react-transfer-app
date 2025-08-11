/* global __firebase_config __initial_auth_token __app_id */
import React, { useState, useEffect } from 'react';
// Импортируем только необходимые функции Firebase, но инициализация будет условной.
import { onAuthStateChanged, signOut, signInAnonymously, signInWithCustomToken, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { app, auth, db, firebaseInitError } from './firebase';

// Импортируем компоненты страниц
import MainPage from './components/MainPage'; // MainPage теперь также обрабатывает аутентификацию
import DashboardPage from './components/DashboardPage';
import TransferPage from './components/TransferPage';
import CarRentalPage from './components/CarRentalPage';
import ToursPage from './components/ToursPage';
// AuthComponent больше не нужен, его функциональность перенесена в MainPage

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('transferPage'); // Начинаем с TransferPage

  useEffect(() => {
    if (firebaseInitError) {
      setLoading(false);
      return;
    }
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setCurrentView('dashboard');
        } else {
          setUser(null);
          setCurrentView('transferPage');
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const handleSignOut = async () => {
    if (auth) {
      try {
        await signOut(auth);
        setCurrentView('transferPage');
      } catch (error) {
        console.error('Ошибка выхода:', error);
      }
    } else {
      setCurrentView('transferPage');
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
      {firebaseInitError && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-2 text-center text-sm z-50">
          {firebaseInitError}
        </div>
      )}
      {currentView === 'transferPage' && <TransferPage setCurrentView={setCurrentView} />}
      {currentView === 'carRental' && <CarRentalPage setCurrentView={setCurrentView} />}
      {currentView === 'tours' && <ToursPage setCurrentView={setCurrentView} />}
      {currentView === 'mainPage' && (
        <MainPage
          user={user}
          auth={auth}
          handleSignOut={handleSignOut}
          setCurrentView={setCurrentView}
        />
      )}
      {currentView === 'dashboard' && (
        <DashboardPage
          user={user}
          auth={auth}
          db={db}
          appId={typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'}
          handleSignOut={handleSignOut}
          setCurrentView={setCurrentView}
        />
      )}
    </>
  );
}

export default App;
