// Этот компонент использует REACT_APP_APP_ID из .env для путей Firestore.

import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { PlusCircle, Edit, Trash2, CheckCircle, XCircle, ChevronLeft } from 'lucide-react';

function ExecutorDashboard({ user, db, auth, setCurrentView }) {
  const [trips, setTrips] = useState([]);
  const [newTripName, setNewTripName] = useState('');
  const [newTripDescription, setNewTripDescription] = useState('');
  const [editingTripId, setEditingTripId] = useState(null);
  const [editingTripName, setEditingTripName] = useState('');
  const [editingTripDescription, setEditingTripDescription] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddingNewTrip, setIsAddingNewTrip] = useState(false);

  // Получаем userId из объекта user
  const userId = user?.uid;

  // Получаем appId из переменных среды
  const appId = process.env.REACT_APP_APP_ID || 'default-app-id';

  useEffect(() => {
    if (!db || !userId) {
      setError("База данных или ID пользователя недоступны.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const tripsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/trips`);
    const q = query(tripsCollectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tripsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      tripsData.sort((a, b) => a.name.localeCompare(b.name));
      setTrips(tripsData);
      setLoading(false);
    }, (err) => {
      console.error("Ошибка получения поездок:", err);
      setError(`Не удалось загрузить поездки: ${err.message}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db, userId, appId]); // Добавили appId в зависимости

  const handleAddTrip = async (e) => {
    e.preventDefault();
    setError(null);
    if (!newTripName.trim()) {
      setError("Название поездки не может быть пустым.");
      return;
    }
    if (!db || !userId) {
      setError("База данных или ID пользователя недоступны для добавления.");
      return;
    }

    try {
      await addDoc(collection(db, `artifacts/${appId}/users/${userId}/trips`), {
        name: newTripName,
        description: newTripDescription,
        createdAt: new Date(),
        userId: userId,
      });
      setNewTripName('');
      setNewTripDescription('');
      setIsAddingNewTrip(false);
    } catch (err) {
      console.error("Ошибка добавления поездки:", err);
      setError(`Не удалось добавить поездку: ${err.message}`);
    }
  };

  const handleEditClick = (trip) => {
    setEditingTripId(trip.id);
    setEditingTripName(trip.name);
    setEditingTripDescription(trip.description);
    setIsAddingNewTrip(false);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!editingTripName.trim()) {
      setError("Название поездки не может быть пустым.");
      return;
    }
    if (!db || !userId || !editingTripId) {
      setError("База данных, ID пользователя или ID поездки недоступны для сохранения.");
      return;
    }

    try {
      const tripDocRef = doc(db, `artifacts/${appId}/users/${userId}/trips`, editingTripId);
      await updateDoc(tripDocRef, {
        name: editingTripName,
        description: editingTripDescription,
        updatedAt: new Date(),
      });
      setEditingTripId(null);
      setEditingTripName('');
      setEditingTripDescription('');
    } catch (err) {
      console.error("Ошибка обновления поездки:", err);
      setError(`Не удалось обновить поездку: ${err.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingTripId(null);
    setEditingTripName('');
    setEditingTripDescription('');
  };

  const handleDeleteTrip = async (id) => {
    setError(null);
    if (!db || !userId) {
      setError("База данных или ID пользователя недоступны для удаления.");
      return;
    }
    if (window.confirm("Вы уверены, что хотите удалить эту поездку?")) {
      try {
        const tripDocRef = doc(db, `artifacts/${appId}/users/${userId}/trips`, id);
        await deleteDoc(tripDocRef);
        console.log("Поездка успешно удалена:", id);
      } catch (err) {
        console.error("Ошибка удаления поездки:", err);
        setError(`Не удалось удалить поездку: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
        <p className="ml-4 text-xl text-gray-700">Загрузка поездок...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-800 p-6 rounded-lg shadow-lg mx-auto max-w-md text-center">
        <p className="text-2xl font-bold mb-4">Ошибка!</p>
        <p className="text-lg mb-4">{error}</p>
        <button
          onClick={() => setCurrentView('transferPage')}
          className="mt-4 bg-[#7860BE] hover:bg-[#6a54a8] text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#7860BE] focus:ring-opacity-50"
        >
          <ChevronLeft size={20} className="inline-block mr-2" /> На главную
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 font-inter flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 sm:p-8 mt-8 relative">
        <button
          onClick={() => setCurrentView('transferPage')}
          className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 flex items-center"
        >
          <ChevronLeft size={20} className="mr-2" /> На главную
        </button>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#7860BE] mb-6 text-center pt-10">
          Мои поездки
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Здесь вы можете управлять своими запланированными поездками.
        </p>

        {user && (
          <p className="text-sm text-gray-500 text-center mb-6 break-all">
            Ваш ID пользователя: <span className="font-mono text-purple-700">{user.uid}</span>
          </p>
        )}

        <div className="text-center mb-6">
          <button
            onClick={() => setIsAddingNewTrip(!isAddingNewTrip)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center mx-auto"
          >
            <PlusCircle size={24} className="mr-2" />
            {isAddingNewTrip ? 'Скрыть форму' : 'Добавить новую поездку'}
          </button>
        </div>

        {isAddingNewTrip && (
          <form onSubmit={handleAddTrip} className="mb-8 p-6 bg-purple-50 rounded-lg shadow-inner border border-purple-200">
            <h3 className="text-2xl font-bold text-[#7860BE] mb-4">Новая поездка</h3>
            <div className="mb-4">
              <label htmlFor="newTripName" className="block text-gray-700 text-sm font-bold mb-2">
                Название поездки:
              </label>
              <input
                type="text"
                id="newTripName"
                value={newTripName}
                onChange={(e) => setNewTripName(e.target.value)}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Например: Поход в Сванетию"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newTripDescription" className="block text-gray-700 text-sm font-bold mb-2">
                Описание:
              </label>
              <textarea
                id="newTripDescription"
                value={newTripDescription}
                onChange={(e) => setNewTripDescription(e.target.value)}
                rows="3"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Краткое описание вашей поездки..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-[#7860BE] hover:bg-[#6a54a8] text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#7860BE] focus:ring-opacity-50"
            >
              Добавить поездку
            </button>
          </form>
        )}

        {trips.length === 0 ? (
          <p className="text-center text-gray-500 text-lg py-8">
            У вас пока нет запланированных поездок. Добавьте первую!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-white border border-purple-200 rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                {editingTripId === trip.id ? (
                  <form onSubmit={handleSaveEdit}>
                    <div className="mb-3">
                      <label htmlFor={`editName-${trip.id}`} className="block text-gray-700 text-sm font-bold mb-1">
                        Название:
                      </label>
                      <input
                        type="text"
                        id={`editName-${trip.id}`}
                        value={editingTripName}
                        onChange={(e) => setEditingTripName(e.target.value)}
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor={`editDescription-${trip.id}`} className="block text-gray-700 text-sm font-bold mb-1">
                        Описание:
                      </label>
                      <textarea
                        id={`editDescription-${trip.id}`}
                        value={editingTripDescription}
                        onChange={(e) => setEditingTripDescription(e.target.value)}
                        rows="2"
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 flex items-center"
                      >
                        <CheckCircle size={18} className="mr-1" /> Сохранить
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 flex items-center"
                      >
                        <XCircle size={18} className="mr-1" /> Отмена
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{trip.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">{trip.description || 'Нет описания.'}</p>
                    <div className="flex justify-end gap-2 mt-auto">
                      <button
                        onClick={() => handleEditClick(trip)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 flex items-center"
                      >
                        <Edit size={18} className="mr-1" /> Редактировать
                      </button>
                      <button
                        onClick={() => handleDeleteTrip(trip.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 flex items-center"
                      >
                        <Trash2 size={18} className="mr-1" /> Удалить
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExecutorDashboard;
