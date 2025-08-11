// ✅ src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Загружаем конфигурацию из .env
const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG || '{}');

let appInstance = null;
let authInstance = null;
let dbInstance = null;
let firebaseInitError = null;

try {
  if (!firebaseConfig || Object.keys(firebaseConfig).length === 0) {
    throw new Error(
      'Firebase конфигурация пуста или отсутствует. Проверь файл .env и переменную REACT_APP_FIREBASE_CONFIG.'
    );
  }

  // Инициализация Firebase
  appInstance = initializeApp(firebaseConfig);
  authInstance = getAuth(appInstance);
  dbInstance = getFirestore(appInstance);
  console.log('✅ Firebase успешно инициализирован');

} catch (error) {
  console.error('❌ Ошибка инициализации Firebase:', error);
  firebaseInitError = error.message;
}

export {
  appInstance as app,
  authInstance as auth,
  dbInstance as db,
  firebaseInitError,
};
