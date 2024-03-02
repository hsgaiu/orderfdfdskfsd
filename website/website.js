// Получаем элементы для таймера и окон
const timerElement = document.getElementById('timer');
const content1Element = document.getElementById('content1');
const content2Element = document.getElementById('content2');

let userId = getCookie('userId');
if (!userId) {
  userId = generateUserId(); // Генерируем новый идентификатор пользователя, если его нет
  setCookie('userId', userId, 20); // Устанавливаем Cookie на 20 секунд
}

// Функция для обновления таймера
function updateTimer(timeInSeconds) {
  // Уменьшаем время на 1 секунду
  timeInSeconds--;

  // Рассчитываем часы, минуты и секунды
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;

  // Форматируем время в формат HH:MM:SS
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Обновляем содержимое элемента таймера
  timerElement.textContent = `Оставшееся время: ${formattedTime}`;

  // Если время вышло, останавливаем таймер и показываем рулетку
  if (timeInSeconds <= 0) {
    clearInterval(timerInterval);
    timerElement.textContent = ''; // Удаляем текст таймера
    content1Element.style.display = 'none'; // Скрываем первое окно
    content2Element.style.display = 'block'; // Показываем третье окно (рулетку)
  }
}

// Установка времени для таймера (в секундах)
let timeInSeconds = 20; // Например, 5 секунд (для тестирования)
updateTimer(timeInSeconds);

// Обновляем таймер каждую секунду
const timerInterval = setInterval(() => {
  updateTimer(timeInSeconds);
}, 1000);

const socket = io();

// Подписываемся на событие получения данных о пользователе
socket.on('userData', (data) => {
  const userAvatar = document.getElementById('userAvatar');
  userAvatar.src = `https://api.telegram.org/file/bot${data.user.avatar.file_path}?userId=${userId}`;
});

function generateUserId() {
  return Math.random().toString(36).substring(2, 15);
}

function setCookie(name, value, seconds) {
  const expires = new Date();
  expires.setTime(expires.getTime() + seconds * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
