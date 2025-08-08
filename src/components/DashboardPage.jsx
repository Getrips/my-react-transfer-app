import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, deleteDoc, doc, updateDoc } from 'firebase/firestore';

function DashboardPage({ user, auth, db, appId, handleSignOut, setCurrentView }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingMessageText, setEditingMessageText] = useState('');
  const [error, setError] = useState('');

  // Получаем userId. Если пользователь не аутентифицирован, используем случайный UUID.
  // Это важно для Firestore правил безопасности.
  const userId = auth?.currentUser?.uid || crypto.randomUUID();

  useEffect(() => {
    if (!db || !user) {
      setError("Firestore неактивен или пользователь не аутентифицирован. Невозможно загрузить сообщения.");
      setMessages([]); // Очищаем сообщения, если Firebase неактивен
      return;
    }

    setError(''); // Очищаем предыдущие ошибки

    // Путь к коллекции для публичных данных
    const messagesCollectionRef = collection(db, `artifacts/${appId}/public/data/messages`);
    const q = query(messagesCollectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Сортируем сообщения по timestamp для корректного отображения
      fetchedMessages.sort((a, b) => (a.timestamp?.toDate() || 0) - (b.timestamp?.toDate() || 0));
      setMessages(fetchedMessages);
    }, (err) => {
      console.error("Ошибка получения сообщений Firestore:", err);
      setError(`Ошибка загрузки сообщений: ${err.message}. Убедитесь, что у вас есть доступ.`);
    });

    return () => unsubscribe(); // Отписка при размонтировании компонента
  }, [db, user, appId]); // Зависимости: db и user, appId

  const handleSendMessage = async () => {
    if (!db || !user) {
      setError("Firebase неактивен или пользователь не аутентифицирован. Невозможно отправить сообщение.");
      return;
    }
    if (message.trim() === '') return;

    setError(''); // Очищаем предыдущие ошибки

    try {
      await addDoc(collection(db, `artifacts/${appId}/public/data/messages`), {
        text: message,
        userId: user.uid,
        userName: user.email || user.displayName || 'Аноним',
        timestamp: new Date(),
      });
      setMessage('');
    } catch (err) {
      console.error("Ошибка отправки сообщения:", err);
      setError(`Ошибка отправки сообщения: ${err.message}`);
    }
  };

  const handleDeleteMessage = async (id, messageUserId) => {
    if (!db || !user) {
      setError("Firebase неактивен или пользователь не аутентифицирован. Невозможно удалить сообщение.");
      return;
    }
    if (user.uid !== messageUserId) {
      setError("Вы можете удалять только свои сообщения.");
      return;
    }

    setError(''); // Очищаем предыдущие ошибки

    try {
      await deleteDoc(doc(db, `artifacts/${appId}/public/data/messages`, id));
    } catch (err) {
      console.error("Ошибка удаления сообщения:", err);
      setError(`Ошибка удаления сообщения: ${err.message}`);
    }
  };

  const handleEditMessage = async (id, messageUserId) => {
    if (!db || !user) {
      setError("Firebase неактивен или пользователь не аутентифицирован. Невозможно обновить сообщение.");
      return;
    }
    if (user.uid !== messageUserId) {
      setError("Вы можете редактировать только свои сообщения.");
      return;
    }
    if (editingMessageText.trim() === '') {
      setError("Сообщение не может быть пустым.");
      return;
    }

    setError(''); // Очищаем предыдущие ошибки

    try {
      await updateDoc(doc(db, `artifacts/${appId}/public/data/messages`, id), {
        text: editingMessageText,
        timestamp: new Date(), // Обновляем timestamp при редактировании
      });
      setEditingMessageId(null);
      setEditingMessageText('');
    } catch (err) {
      console.error("Ошибка обновления сообщения:", err);
      setError(`Ошибка обновления сообщения: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Личный кабинет
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Ошибка!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        {user ? (
          <>
            <p className="text-gray-700 text-center mb-4">
              Добро пожаловать, <span className="font-semibold">{user.email || user.displayName || 'Анонимный пользователь'}</span>!
            </p>
            <p className="text-gray-600 text-center text-sm mb-6">
              Ваш ID пользователя: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{userId}</span>
            </p>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Публичный чат</h3>
              <div className="border border-gray-300 rounded-lg p-4 h-64 overflow-y-auto bg-gray-50 mb-4">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center">Сообщений пока нет. Будьте первым!</p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`mb-3 p-3 rounded-lg shadow-sm ${msg.userId === user.uid ? 'bg-blue-100 ml-auto text-right' : 'bg-gray-100 mr-auto text-left'} max-w-[85%]`}>
                      {editingMessageId === msg.id ? (
                        <div className="flex flex-col">
                          <input
                            type="text"
                            value={editingMessageText}
                            onChange={(e) => setEditingMessageText(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md mb-2"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditMessage(msg.id, msg.userId)}
                              className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition"
                            >
                              Сохранить
                            </button>
                            <button
                              onClick={() => setEditingMessageId(null)}
                              className="bg-gray-400 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-500 transition"
                            >
                              Отмена
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-800 break-words">{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.userId === user.uid ? 'text-blue-600' : 'text-gray-600'}`}>
                            {msg.userName} {msg.timestamp ? `(${new Date(msg.timestamp.toDate()).toLocaleString()})` : ''}
                          </p>
                          {msg.userId === user.uid && (
                            <div className="flex justify-end space-x-2 mt-2">
                              <button
                                onClick={() => { setEditingMessageId(msg.id); setEditingMessageText(msg.text); }}
                                className="text-sm text-blue-500 hover:text-blue-700"
                              >
                                Редактировать
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(msg.id, msg.userId)}
                                className="text-sm text-red-500 hover:text-red-700"
                              >
                                Удалить
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="flex">
                <input
                  type="text"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Напишите сообщение..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white font-bold py-2 px-4 rounded-r-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                >
                  Отправить
                </button>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
              >
                Выйти
              </button>
              <button
                onClick={() => setCurrentView('mainPage')}
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
              >
                На главную
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-gray-700 mb-4">Вы не вошли в систему.</p>
            <button
              onClick={() => setCurrentView('authPage')}
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
            >
              Войти / Зарегистрироваться
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
