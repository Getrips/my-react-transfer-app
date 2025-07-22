import React, { useState, useEffect } from 'react';
// Импортируем компоненты, которые будут использоваться в приложении
import TransferSearch from './components/TransferSearch.jsx';
import TransferResults from './components/TransferResults.jsx';
import DriverCarousel from './components/DriverCarousel.jsx';
import AuthModal from './components/AuthModal.jsx';

// Импортируем иконки из библиотеки lucide-react, используемые в шапке и аккордеонах
import { User, ChevronDown, ChevronUp } from 'lucide-react';

// Импорты Firebase SDK
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signOut } from 'firebase/auth'; // Удален signInWithCustomToken
import { getFirestore, doc, setDoc } from 'firebase/firestore';


// Вспомогательный компонент для отображения SVG-флагов
const FlagSVG = ({ code, className }) => {
  switch (code) {
    case 'ru': // Флаг России: три горизонтальные полосы (белая, синяя, красная)
      return (
        <svg className={className} viewBox="0 0 3 2">
          <rect width="3" height="0.666667" fill="#fff" y="0" /> {/* Белая полоса */}
          <rect width="3" height="0.666667" fill="#0039a6" y="0.666667" /> {/* Синяя полота */}
          <rect width="3" height="0.666667" fill="#d52b1e" y="1.333333" /> {/* Красная полоса */}
        </svg>
      );
    case 'en': // Флаг Великобритании: Юнион Джек
      return (
        <svg className={className} viewBox="0 0 60 30">
          <clipPath id="a">
            <path d="M0 0h60v30H0z" />
          </clipPath>
          <path fill="#00247d" d="M0 0h60v30H0z" />
          <path stroke="#fff" strokeWidth="6" d="M0 0l60 30M60 0L0 30" clipPath="url(#a)" />
          <path stroke="#c12127" strokeWidth="4" d="M0 0l60 30M60 0L0 30" clipPath="url(#a)" />
          <path stroke="#fff" strokeWidth="10" d="M30 0v30M0 15h60" />
          <path stroke="#c12127" strokeWidth="6" d="M30 0v30M0 15h60" />
        </svg>
      );
    case 'ka': // Флаг Грузии: белый фон с красным крестом и четырьмя малыми крестами
      return (
        <svg className={className} viewBox="0 0 24 16">
          <rect width="24" height="16" fill="#fff"/>
          {/* Главный крест */}
          <path fill="#e00034" d="M10 0h4v16h-4zM0 6h24v4H0z"/>
          {/* Четыре малых креста (Болнисские кресты) */}
          <path fill="#e00034" d="M4 2h2v2H4zM3 3h4v2H3zM4 12h2v2H4zM3 11h4v2H3zM18 2h2v2h-2zM17 3h4v2h-4zM18 12h2v2h-2zM17 11h4v2h-4z"/>
        </svg>
      );
    default:
      return null;
  }
};


function App() {
  // Состояние для хранения результатов поиска (пока имитируется)
  const [results, setResults] = useState([]);
  // Состояние для выбранного языка в шапке, по умолчанию русский
  const [selectedLanguage, setSelectedLanguage] = useState('ru');
  // Состояние для управления видимостью выпадающего списка языков
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  // Состояние для управления видимостью каждого пункта аккордеона в секции "Условия"
  // Это состояние все еще не используется, поэтому ESLint может выдать предупреждение
  const [accordionOpen, setAccordionOpen] = useState({
    booking: false,
    cancellation: false,
    airportMeeting: false,
    waitingTime: false,
    boardingDetails: false,
    additionalServices: false,
    responsibility: false,
  });

  // ===== Состояния для Firebase и аутентификации =====
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);

  // Хук useEffect для инициализации Firebase и прослушивания состояния аутентификации
  useEffect(() => {
    console.log("useEffect: Инициализация Firebase...");
    try {
      // Получаем конфигурацию Firebase из переменной окружения .env
      const firebaseConfig = typeof process.env.REACT_APP_FIREBASE_CONFIG !== 'undefined'
        ? JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG)
        : {};

      if (Object.keys(firebaseConfig).length === 0) {
        console.error("Firebase config is missing. Please ensure REACT_APP_FIREBASE_CONFIG is set in your .env file.");
        return;
      }

      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setDb(firestore);
      setAuth(firebaseAuth);
      console.log("Firebase: db и auth установлены.");

      const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setUserId(currentUser.uid);
          console.log("User is signed in:", currentUser.uid);
        } else {
          // В локальной среде мы не используем __initial_auth_token,
          // поэтому просто входим анонимно, если пользователь не аутентифицирован.
          await signInAnonymously(firebaseAuth);
          console.log("Signed in anonymously.");
          setUser(null);
          setUserId(null);
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
    }
  }, []);


  // Данные для языковых кнопок: код языка и его название
  const languages = [
    { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English' },
    { code: 'ka', name: 'ქართული' },
  ];

  // Функция, имитирующая поиск трансфера.
  // В реальном приложении здесь был бы вызов API.
  const handleSearch = (formData) => {
    const fakeResult = {
      from: formData.from, to: formData.to, date: formData.date,
      carClass: formData.carClass, language: formData.language, extras: formData.extras,
    };
    setResults([fakeResult]); // Обновляем состояние с "результатами"
  };

  // Обработчик смены языка: устанавливает выбранный язык и скрывает список
  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    setShowLanguageOptions(false);
    console.log(`Язык изменен на: ${langCode}`);
    // Здесь можно добавить логику для изменения языка всего приложения (например, через Context API)
  };

  // Обработчик выхода из системы
  const handleLogout = async () => {
    if (auth) {
      try {
        await signOut(auth);
        console.log("User signed out.");
        // После выхода можно снова войти анонимно
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }
  };

  // Находим объект текущего выбранного языка для отображения на кнопке
  const currentLang = languages.find(lang => lang.code === selectedLanguage);

  // Добавляем логи для отладки перед рендерингом
  console.log("App render: showAuthModal =", showAuthModal, "db =", !!db, "auth =", !!auth, "user =", !!user);

  return (
    // Основной контейнер приложения.
    // min-h-screen: занимает всю высоту экрана.
    // bg-gradient-to-b from-[#08102E] to-[#9B87D6]: градиентный фон сверху вниз с указанными цветами.
    // text-[#FCFCFC]: основной цвет текста (светлый).
    // p-4: внутренний отступ со всех сторон.
    // relative: для позиционирования абсолютно расположенных элементов внутри.
    // font-bold: весь текст в приложении будет жирным по умолчанию.
    <div className="min-h-screen bg-gradient-to-b from-[#08102E] to-[#9B87D6] text-[#FCFCFC] p-4 relative font-bold">
      {/* Контейнер для кнопок выбора языка и пользователя в правом верхнем углу */}
      {/* absolute top-4 right-4: позиционирование относительно родительского div.min-h-screen */}
      {/* flex items-center space-x-4: элементы выравниваются по центру и имеют отступ между ними */}
      {/* z-20: высокий z-index, чтобы кнопки были поверх других элементов */}
      <div className="absolute top-4 right-4 flex items-center space-x-4 z-20">
        {/* Блок выбора языка */}
        <div className="relative"> {/* Обертка для позиционирования выпадающего списка */}
          <button
            onClick={() => setShowLanguageOptions(!showLanguageOptions)} // Переключает видимость опций
            className="flex items-center p-2 rounded-lg text-sm font-bold transition-colors duration-200
                       bg-[#CEF65F] bg-opacity-20 text-white hover:bg-opacity-30" // Фон кнопки и эффекты наведения
          >
            {/* Отображение флага и названия выбранного языка */}
            <FlagSVG code={currentLang.code} className="w-5 h-auto mr-2 rounded-sm" />
            {currentLang.name}
            {/* Иконка стрелки вверх/вниз в зависимости от состояния showLanguageOptions */}
            {showLanguageOptions ? (
              <ChevronUp size={16} className="ml-1" />
            ) : (
              <ChevronDown size={16} className="ml-1" />
            )}
          </button>

          {/* Выпадающий список языков, отображается только если showLanguageOptions === true */}
          {showLanguageOptions && (
            <div className="absolute top-full right-0 mt-2 w-40 bg-white bg-opacity-90 rounded-lg shadow-lg z-10 p-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex items-center w-full text-left p-2 rounded-md text-gray-800 font-bold hover:bg-gray-100
                    ${selectedLanguage === lang.code ? 'bg-gray-200' : ''}`} // Выделение выбранного языка
                >
                  <FlagSVG code={lang.code} className="w-5 h-auto mr-2 rounded-sm" />
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Кнопка пользователя (Вход/Регистрация или Выход) */}
        <button
          onClick={() => {
            console.log("Кнопка пользователя нажата. Текущий пользователь:", user);
            // Если пользователь вошел, вызываем handleLogout, иначе показываем модальное окно
            user ? handleLogout() : setShowAuthModal(true);
          }}
          className="bg-[#DF6421] hover:bg-[#B8501A] p-2 rounded-lg transition-colors duration-300 shadow-md"
          title={user ? "Выход" : "Вход / Регистрация"}
        >
          <User size={24} className="text-white" />
        </button>
      </div>

      {/* Основной контент приложения */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6 pt-16 sm:pt-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Трансфер по Грузии</h1>
          <p className="text-md text-white">Выберите параметры для заказа трансфера</p>
        </div>

        <div className="bg-white bg-opacity-50 rounded-lg p-6 mb-4 shadow-lg">
          <TransferSearch onSearch={handleSearch} />
        </div>

        <TransferResults results={results} />

        <DriverCarousel />
      </div>

      {/* МОДАЛЬНОЕ ОКНО АУТЕНТИФИКАЦИИ */}
      {showAuthModal && db && auth && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          auth={auth}
          db={db}
        />
      )}

      {/* Футер страницы */}
      <footer className="text-center text-sm text-white font-bold mt-12">
        &copy; {new Date().getFullYear()} GeoTrips
      </footer>
    </div>
  );
}

export default App;
