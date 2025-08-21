// Обучающая платформа с полноценными курсами и отдельными кнопками "Тема" и "Выйти"
class LearningPlatform {
  constructor() {
    this.currentCourse = null;
    this.currentLesson = 0;
    this.courses = {
      html: this.createHTMLCourse(),
      css: this.createCSSCourse(),
      js: this.createJSCourse(),
      python: this.createPythonCourse()
    };
  }

  // Инициализация
  init() {
    this.renderPlatform();
    this.bindEvents();
  }

  // Шапка + список курсов
  renderPlatform() {
    const username = this.getCurrentUsername();
    const platformHTML = `
      <div class="platform-header">
        <div class="header-left">
          <h1>🚀 Survival Code Academy</h1>
          <p>Изучайте программирование с нуля — шаг за шагом</p>
        </div>
        <div class="header-actions">
          <button class="btn secondary" id="toggle-theme" title="Переключить тему">🌙 Тема</button>
          <button class="btn secondary" id="logout" title="Выйти из аккаунта">🚪 Выйти</button>
        </div>
      </div>

      <div class="course-grid">
        <div class="course-card html" data-course="html">
          <div class="course-icon">🌐</div>
          <h3>HTML Basics</h3>
          <p>Основы создания веб-страниц</p>
          <p><strong>10 уроков</strong></p>
        </div>

        <div class="course-card css" data-course="css">
          <div class="course-icon">🎨</div>
          <h3>CSS Styling</h3>
          <p>Стилизация и макеты</p>
          <p><strong>8 уроков</strong></p>
        </div>

        <div class="course-card js" data-course="js">
          <div class="course-icon">⚡</div>
          <h3>JavaScript</h3>
          <p>Интерактивность и логика</p>
          <p><strong>12 уроков</strong></p>
        </div>

        <div class="course-card python" data-course="python">
          <div class="course-icon">🐍</div>
          <h3>Python</h3>
          <p>Универсальный язык</p>
          <p><strong>15 уроков</strong></p>
        </div>
      </div>

      <div id="lesson-container"></div>
    `;

    const root = document.getElementById('learning-platform');
    root.innerHTML = platformHTML;
  }

  bindEvents() {
    // Один делегированный обработчик на документ
    document.addEventListener('click', (e)=>{
      const card = e.target.closest('.course-card');
      if(card){
        const course = card.dataset.course;
        this.startCourse(course);
        return;
      }

      if(e.target.id === 'next-lesson'){ this.nextLesson(); return; }
      if(e.target.id === 'prev-lesson'){ this.prevLesson(); return; }
      if(e.target.id === 'back-to-courses'){ this.renderPlatform(); return; }

      if(e.target.id === 'toggle-theme'){
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        return;
      }

      if(e.target.id === 'logout'){
        localStorage.removeItem('sessionUser');
        document.getElementById('learning-platform').classList.add('hidden');
        document.getElementById('auth-container').classList.remove('hidden');
        return;
      }
    }, { passive: true });
  }

  getCurrentUsername(){
    const email = localStorage.getItem('sessionUser');
    if(!email) return 'Гость';
    try {
      const users = JSON.parse(localStorage.getItem('users')||'{}');
      return users[email]?.username || 'Пользователь';
    } catch(e){ return 'Пользователь'; }
  }

  startCourse(courseName){
    this.currentCourse = courseName;
    this.currentLesson = 0;
    this.renderLesson();
  }

  renderLesson(){
    const course = this.courses[this.currentCourse];
    const lesson = course.lessons[this.currentLesson];

    const lessonHTML = `
      <div class="lesson-content">
        <h2>${course.title} — Урок ${this.currentLesson+1} из ${course.lessons.length}: ${lesson.title}</h2>
        <div class="lesson-text">${lesson.content}</div>
        ${lesson.example ? `<div class="code-editor">${lesson.example}</div>` : ''}
        <div class="navigation">
          <button class="btn secondary" id="back-to-courses">← Назад к курсам</button>
          <div>
            ${this.currentLesson>0 ? `<button class="btn secondary" id="prev-lesson">← Предыдущий</button>` : ''}
            <button class="btn primary" id="next-lesson">${this.currentLesson < course.lessons.length-1 ? 'Следующий →' : 'Завершить курс'}</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('lesson-container').innerHTML = lessonHTML;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextLesson(){
    const course = this.courses[this.currentCourse];
    if(this.currentLesson < course.lessons.length-1){
      this.currentLesson++;
      this.renderLesson();
    } else {
      this.renderPlatform();
      // Можно добавить тост "Курс завершён!"
    }
  }
  prevLesson(){
    if(this.currentLesson>0){ this.currentLesson--; this.renderLesson(); }
  }

  // ===== КУРСЫ =====
  createHTMLCourse(){
    const lessons = [
      {
        title: "Введение в HTML",
        content: "HTML — язык разметки, который описывает структуру страницы. Браузер читает теги и отображает документ. Страница состоит из элементов (тегов), у которых могут быть атрибуты. Самые важные части — <strong>&lt;head&gt;</strong> и <strong>&lt;body&gt;</strong>.",
        example: `<span class="code-comment">&lt;!-- Минимальная разметка документа --&gt;</span>
<span class="code-tag">&lt;!DOCTYPE html&gt;</span>
<span class="code-tag">&lt;html lang=<span class="code-value">"ru"</span>&gt;</span>
  <span class="code-tag">&lt;head&gt;</span>
    <span class="code-tag">&lt;meta</span> <span class="code-attribute">charset</span>=<span class="code-value">"UTF-8"</span><span class="code-tag">&gt;</span>
    <span class="code-tag">&lt;title&gt;</span>Мой сайт<span class="code-tag">&lt;/title&gt;</span>
  <span class="code-tag">&lt;/head&gt;</span>
  <span class="code-tag">&lt;body&gt;</span>
    <span class="code-tag">&lt;h1&gt;</span>Привет, мир!<span class="code-tag">&lt;/h1&gt;</span>
  <span class="code-tag">&lt;/body&gt;</span>
<span class="code-tag">&lt;/html&gt;</span>`
      },
      {
        title: "Заголовки, параграфы и текст",
        content: "Заголовки <strong>&lt;h1&gt;...&lt;h6&gt;</strong> задают структуру текста. Для абзацев используется <strong>&lt;p&gt;</strong>. Жирный и курсив — <strong>&lt;strong&gt;</strong> и <strong>&lt;em&gt;</strong>.",
        example: `<span class="code-tag">&lt;h1&gt;</span>Главная тема<span class="code-tag">&lt;/h1&gt;</span>
<span class="code-tag">&lt;h2&gt;</span>Подраздел<span class="code-tag">&lt;/h2&gt;</span>
<span class="code-tag">&lt;p&gt;</span>Это обычный абзац текста с <span class="code-tag">&lt;strong&gt;</span>важным<span class="code-tag">&lt;/strong&gt;</span> словом и <span class="code-tag">&lt;em&gt;</span>акцентом<span class="code-tag">&lt;/em&gt;</span>.<span class="code-tag">&lt;/p&gt;</span>`
      },
      {
        title: "Списки и цитаты",
        content: "Маркированные списки — <strong>&lt;ul&gt;</strong>, нумерованные — <strong>&lt;ol&gt;</strong>, элементы — <strong>&lt;li&gt;</strong>. Для цитат используется <strong>&lt;blockquote&gt;</strong>.",
        example: `<span class="code-tag">&lt;ul&gt;</span>
  <span class="code-tag">&lt;li&gt;</span>Яблоки<span class="code-tag">&lt;/li&gt;</span>
  <span class="code-tag">&lt;li&gt;</span>Груши<span class="code-tag">&lt;/li&gt;</span>
<span class="code-tag">&lt;/ul&gt;</span>

<span class="code-tag">&lt;ol&gt;</span>
  <span class="code-tag">&lt;li&gt;</span>Шаг один<span class="code-tag">&lt;/li&gt;</span>
  <span class="code-tag">&lt;li&gt;</span>Шаг два<span class="code-tag">&lt;/li&gt;</span>
<span class="code-tag">&lt;/ol&gt;</span>

<span class="code-tag">&lt;blockquote&gt;</span>Цитата дня<span class="code-tag">&lt;/blockquote&gt;</span>`
      },
      {
        title: "Ссылки и изображения",
        content: "Ссылки создаются тегом <strong>&lt;a href=\"...\"&gt;</strong>. Изображение — <strong>&lt;img src=\"...\" alt=\"...\"&gt;</strong>. Атрибут <strong>alt</strong> обязателен для доступности.",
        example: `<span class="code-tag">&lt;a</span> <span class="code-attribute">href</span>=<span class="code-value">"https://developer.mozilla.org"</span><span class="code-tag">&gt;</span>MDN<span class="code-tag">&lt;/a&gt;</span>
<span class="code-tag">&lt;img</span> <span class="code-attribute">src</span>=<span class="code-value">"cat.jpg"</span> <span class="code-attribute">alt</span>=<span class="code-value">"Котик"</span><span class="code-tag">&gt;</span>`
      },
      {
        title: "Атрибуты, классы и идентификаторы",
        content: "Любой тег может иметь атрибуты. Часто используются <strong>class</strong> и <strong>id</strong> для стилизации и скриптов.",
        example: `<span class="code-tag">&lt;div</span> <span class="code-attribute">class</span>=<span class="code-value">"card highlight"</span> <span class="code-attribute">id</span>=<span class="code-value">"promo"</span><span class="code-tag">&gt;</span>Контент<span class="code-tag">&lt;/div&gt;</span>`
      },
      {
        title: "Таблицы",
        content: "Таблица состоит из <strong>&lt;table&gt;</strong>, строк <strong>&lt;tr&gt;</strong>, заголовков <strong>&lt;th&gt;</strong> и ячеек <strong>&lt;td&gt;</strong>.",
        example: `<span class="code-tag">&lt;table&gt;</span>
  <span class="code-tag">&lt;tr&gt;</span><span class="code-tag">&lt;th&gt;</span>Имя<span class="code-tag">&lt;/th&gt;</span><span class="code-tag">&lt;th&gt;</span>Возраст<span class="code-tag">&lt;/th&gt;</span><span class="code-tag">&lt;/tr&gt;</span>
  <span class="code-tag">&lt;tr&gt;</span><span class="code-tag">&lt;td&gt;</span>Анна<span class="code-tag">&lt;/td&gt;</span><span class="code-tag">&lt;td&gt;</span>22<span class="code-tag">&lt;/td&gt;</span><span class="code-tag">&lt;/tr&gt;</span>
<span class="code-tag">&lt;/table&gt;</span>`
      },
      {
        title: "Формы",
        content: "Формы собирают данные пользователя: <strong>&lt;form&gt;</strong>, поля <strong>&lt;input&gt;</strong>, <strong>&lt;textarea&gt;</strong>, <strong>&lt;select&gt;</strong>. Важен атрибут <strong>name</strong>.",
        example: `<span class="code-tag">&lt;form</span> <span class="code-attribute">action</span>=<span class="code-value">"/send"</span> <span class="code-attribute">method</span>=<span class="code-value">"post"</span><span class="code-tag">&gt;</span>
  <span class="code-tag">&lt;input</span> <span class="code-attribute">type</span>=<span class="code-value">"text"</span> <span class="code-attribute">name</span>=<span class="code-value">"user"</span><span class="code-tag">&gt;</span>
  <span class="code-tag">&lt;button&gt;</span>Отправить<span class="code-tag">&lt;/button&gt;</span>
<span class="code-tag">&lt;/form&gt;</span>`
      },
      {
        title: "Семантическая разметка",
        content: "Теги <strong>&lt;header&gt;</strong>, <strong>&lt;nav&gt;</strong>, <strong>&lt;main&gt;</strong>, <strong>&lt;article&gt;</strong>, <strong>&lt;section&gt;</strong>, <strong>&lt;footer&gt;</strong> делают структуру понятной поисковикам и ассистивным технологиям.",
        example: `<span class="code-tag">&lt;header&gt;</span>Шапка<span class="code-tag">&lt;/header&gt;</span>
<span class="code-tag">&lt;nav&gt;</span>Меню<span class="code-tag">&lt;/nav&gt;</span>
<span class="code-tag">&lt;main&gt;</span>
  <span class="code-tag">&lt;article&gt;</span>Статья<span class="code-tag">&lt;/article&gt;</span>
<span class="code-tag">&lt;/main&gt;</span>
<span class="code-tag">&lt;footer&gt;</span>Подвал<span class="code-tag">&lt;/footer&gt;</span>`
      },
      {
        title: "Мультимедиа: аудио и видео",
        content: "Современный HTML поддерживает встраивание аудио/видео без плагинов: <strong>&lt;audio&gt;</strong> и <strong>&lt;video&gt;</strong> с атрибутом <strong>controls</strong>.",
        example: `<span class="code-tag">&lt;audio</span> <span class="code-attribute">controls</span><span class="code-tag">&gt;</span>
  <span class="code-tag">&lt;source</span> <span class="code-attribute">src</span>=<span class="code-value">"sound.mp3"</span> <span class="code-attribute">type</span>=<span class="code-value">"audio/mpeg"</span><span class="code-tag">&gt;</span>
<span class="code-tag">&lt;/audio&gt;</span>

<span class="code-tag">&lt;video</span> <span class="code-attribute">controls</span> <span class="code-attribute">width</span>=<span class="code-value">"320"</span><span class="code-tag">&gt;</span>
  <span class="code-tag">&lt;source</span> <span class="code-attribute">src</span>=<span class="code-value">"clip.mp4"</span> <span class="code-attribute">type</span>=<span class="code-value">"video/mp4"</span><span class="code-tag">&gt;</span>
<span class="code-tag">&lt;/video&gt;</span>`
      },
      {
        title: "Метаданные и SEO-основы",
        content: "Внутри <strong>&lt;head&gt;</strong> задаются метаданные: кодировка, адаптивность, описание страницы. Это помогает SEO и шарингу.",
        example: `<span class="code-tag">&lt;head&gt;</span>
  <span class="code-tag">&lt;meta</span> <span class="code-attribute">name</span>=<span class="code-value">"viewport"</span> <span class="code-attribute">content</span>=<span class="code-value">"width=device-width, initial-scale=1"</span><span class="code-tag">&gt;</span>
  <span class="code-tag">&lt;meta</span> <span class="code-attribute">name</span>=<span class="code-value">"description"</span> <span class="code-attribute">content</span>=<span class="code-value">"Учебный сайт"</span><span class="code-tag">&gt;</span>
<span class="code-tag">&lt;/head&gt;</span>`
      }
    ];
    return { title: "HTML Basics", lessons };
  }

  createCSSCourse(){
    const lessons = [
      {
        title: "Что такое CSS и как подключить",
        content: "CSS описывает внешний вид HTML. Подключаем стилевой файл через <strong>&lt;link rel=\"stylesheet\" href=\"...\"&gt;</strong> или задаём стили в <strong>&lt;style&gt;</strong>.",
        example: `<span class="code-comment">/* В head документа */</span>
<span class="code-tag">&lt;link</span> <span class="code-attribute">rel</span>=<span class="code-value">"stylesheet"</span> <span class="code-attribute">href</span>=<span class="code-value">"style.css"</span><span class="code-tag">&gt;</span>`
      },
      {
        title: "Селекторы и специфичность",
        content: "Селекторы выбирают элементы: по тегу (<code>p</code>), классу (<code>.card</code>), id (<code>#main</code>). Специфичность решает, чей стиль победит.",
        example: `<span class="css-selector">p</span> { <span class="code-attribute">color</span>: <span class="code-value">#333</span>; }
<span class="css-selector">.card</span> { <span class="code-attribute">padding</span>: <span class="code-value">12px</span>; }
<span class="css-selector">#main</span> { <span class="code-attribute">border</span>: <span class="code-value">1px solid #ccc</span>; }`
      },
      {
        title: "Цвета, шрифты, отступы",
        content: "Основные свойства оформления текста и отступов: <code>color</code>, <code>font-family</code>, <code>margin</code>, <code>padding</code>, <code>border</code>.",
        example: `<span class="css-selector">body</span> {
  <span class="code-attribute">font-family</span>: Arial, sans-serif;
  <span class="code-attribute">color</span>: <span class="code-value">#222</span>;
  <span class="code-attribute">margin</span>: <span class="code-value">0</span>;
  <span class="code-attribute">padding</span>: <span class="code-value">20px</span>;
}`
      },
      {
        title: "Блочная модель и display",
        content: "Каждый элемент — прямоугольник со своей моделью (content, padding, border, margin). Свойство <code>display</code> управляет типом поведения элемента.",
        example: `<span class="css-selector">.box</span> {
  <span class="code-attribute">display</span>: <span class="code-value">inline-block</span>;
  <span class="code-attribute">width</span>: <span class="code-value">120px</span>;
  <span class="code-attribute">padding</span>: <span class="code-value">10px</span>;
  <span class="code-attribute">border</span>: <span class="code-value">1px solid #999</span>;
}`
      },
      {
        title: "Flexbox — выравнивание и раскладки",
        content: "Flexbox упрощает выравнивание по осям и распределение пространства.",
        example: `<span class="css-selector">.row</span> {
  <span class="code-attribute">display</span>: <span class="code-value">flex</span>;
  <span class="code-attribute">gap</span>: <span class="code-value">12px</span>;
  <span class="code-attribute">justify-content</span>: <span class="code-value">space-between</span>;
  <span class="code-attribute">align-items</span>: <span class="code-value">center</span>;
}`
      },
      {
        title: "Grid — мощные сетки",
        content: "CSS Grid создаёт двумерные сетки для сложных макетов.",
        example: `<span class="css-selector">.grid</span> {
  <span class="code-attribute">display</span>: <span class="code-value">grid</span>;
  <span class="code-attribute">grid-template-columns</span>: <span class="code-value">repeat(3, 1fr)</span>;
  <span class="code-attribute">gap</span>: <span class="code-value">10px</span>;
}`
      },
      {
        title: "Псевдоклассы и псевдоэлементы",
        content: "Псевдоклассы описывают состояние (<code>:hover</code>, <code>:focus</code>), псевдоэлементы создают виртуальные элементы (<code>::before</code>, <code>::after</code>).",
        example: `<span class="css-selector">a:hover</span> { <span class="code-attribute">text-decoration</span>: <span class="code-value">underline</span>; }
<span class="css-selector">.badge::before</span> { <span class="code-attribute">content</span>: <span class="code-value">"★"</span>; }`
      },
      {
        title: "Адаптивность: медиа-запросы",
        content: "Медиа-запросы позволяют менять стили под ширину экрана.",
        example: `<span class="code-comment">/* Мобильная адаптация */</span>
@media (max-width: 600px) {
  <span class="css-selector">.sidebar</span>{ <span class="code-attribute">display</span>: <span class="code-value">none</span>; }
}`
      }
    ];
    return { title: "CSS Styling", lessons };
  }

  createJSCourse(){
    const lessons = [
      {
        title: "Введение и подключение",
        content: "JavaScript добавляет интерактивность. Скрипт можно подключать в конце <strong>&lt;body&gt;</strong> или с атрибутом <strong>defer</strong> в <strong>&lt;head&gt;</strong>.",
        example: `<span class="code-tag">&lt;script</span> <span class="code-attribute">src</span>=<span class="code-value">"app.js"</span> <span class="code-attribute">defer</span><span class="code-tag">&gt;&lt;/script&gt;</span>`
      },
      {
        title: "Переменные и типы",
        content: "Переменные объявляются через <code>let</code>, <code>const</code>. Типы: число, строка, булево, объект, массив, null, undefined.",
        example: `<span class="js-keyword">const</span> name = <span class="code-value">'Ира'</span>;
<span class="js-keyword">let</span> age = <span class="code-value">20</span>;
<span class="js-keyword">const</span> isStudent = <span class="code-value">true</span>;`
      },
      {
        title: "Операторы и выражения",
        content: "Сложение, сравнение, логические операции. Строгое сравнение — <code>===</code>.",
        example: `<span class="js-keyword">const</span> ok = <span class="code-value">2</span> + <span class="code-value">2</span> === <span class="code-value">4</span>;`
      },
      {
        title: "Условия",
        content: "Ветвления с <code>if/else</code> и тернарным оператором.",
        example: `<span class="js-keyword">const</span> score = <span class="code-value">75</span>;
<span class="js-keyword">if</span> (score &gt;= <span class="code-value">60</span>) {
  console.log(<span class="code-value">'Сдал'</span>);
} <span class="js-keyword">else</span> {
  console.log(<span class="code-value">'Не сдал'</span>);
}`
      },
      {
        title: "Циклы",
        content: "Повторяющиеся действия с <code>for</code>, <code>while</code>, <code>for...of</code>.",
        example: `<span class="js-keyword">for</span> (<span class="js-keyword">let</span> i = <span class="code-value">0</span>; i &lt; <span class="code-value">3</span>; i++) {
  console.log(<span class="code-value">i</span>);
}`
      },
      {
        title: "Функции",
        content: "Функции — переиспользуемые блоки кода. Есть обычные и стрелочные функции.",
        example: `<span class="js-keyword">function</span> sum(a, b){ <span class="js-keyword">return</span> a + b; }
<span class="js-keyword">const</span> mult = (a,b) =&gt; a * b;`
      },
      {
        title: "Массивы и объекты",
        content: "Массив — упорядоченный список, объект — набор пар ключ/значение.",
        example: `<span class="js-keyword">const</span> arr = [<span class="code-value">1</span>,<span class="code-value">2</span>,<span class="code-value">3</span>];
<span class="js-keyword">const</span> user = { name: <span class="code-value">'Антон'</span>, age: <span class="code-value">21</span> };`
      },
      {
        title: "Методы массивов",
        content: "Полезные методы: <code>push</code>, <code>map</code>, <code>filter</code>, <code>find</code>, <code>reduce</code>.",
        example: `<span class="js-keyword">const</span> nums = [<span class="code-value">1</span>,<span class="code-value">2</span>,<span class="code-value">3</span>];
nums.map(x =&gt; x * <span class="code-value">2</span>); <span class="code-comment">// [2,4,6]</span>`
      },
      {
        title: "DOM: поиск и изменение элементов",
        content: "Через DOM мы изменяем HTML. Методы: <code>querySelector</code>, <code>createElement</code>, <code>append</code>.",
        example: `document.querySelector(<span class="code-value">'#box'</span>).textContent = <span class="code-value">'Привет!'</span>;`
      },
      {
        title: "События и обработчики",
        content: "Слушаем события и реагируем на действия пользователя.",
        example: `document.getElementById(<span class="code-value">'btn'</span>).addEventListener(<span class="code-value">'click'</span>, () =&gt; {
  alert(<span class="code-value">'Нажато!'</span>);
});`
      },
      {
        title: "Асинхронность: setTimeout и Promise",
        content: "Асинхронный код не блокирует страницу. <code>Promise</code> и <code>async/await</code> упрощают работу.",
        example: `<span class="js-keyword">const</span> delay = (ms) =&gt; <span class="js-keyword">new</span> Promise(r =&gt; setTimeout(r, ms));
(<span class="js-keyword">async</span> () =&gt; {
  <span class="js-keyword">await</span> delay(<span class="code-value">500</span>);
  console.log(<span class="code-value">'Прошло 0.5с'</span>);
})();`
      },
      {
        title: "Работа с API: fetch",
        content: "Запросы к серверу выполняются через <code>fetch</code>.",
        example: `<span class="js-keyword">async</span> function load(){
  <span class="js-keyword">const</span> res = <span class="js-keyword">await</span> fetch(<span class="code-value">'https://jsonplaceholder.typicode.com/todos/1'</span>);
  <span class="js-keyword">const</span> data = <span class="js-keyword">await</span> res.json();
  console.log(data);
}`
      },
      {
        title: "Практика: мини‑TODO",
        content: "Соберём список дел: ввод, добавление элемента в массив и вывод на страницу.",
        example: `<span class="js-keyword">let</span> todos = [];
<span class="js-keyword">function</span> addTodo(text){
  todos.push({ text, done: <span class="code-value">false</span> });
}`
      }
    ];
    return { title: "JavaScript", lessons };
  }

  createPythonCourse(){
    const lessons = [
      { title: "Установка и запуск", content: "Установите Python 3.x. В консоли используйте команду <code>python</code> или <code>python3</code>. Файлы имеют расширение <code>.py</code>.", example: `<span class="code-comment"># Проверка версии</span>
<span class="python-keyword">import</span> sys
<span class="python-keyword">print</span>(sys.version)` },
      { title: "Переменные и типы", content: "Переменные создаются при присваивании. Типы: int, float, str, bool.", example: `name = <span class="code-value">"Анна"</span>
age = <span class="code-value">23</span>
pi = <span class="code-value">3.14</span>
is_ok = <span class="code-value">True</span>` },
      { title: "Ввод/вывод", content: "Вывод — функцией <code>print</code>, ввод — <code>input</code> (возвращает строку).", example: `<span class="python-keyword">print</span>(<span class="code-value">"Как тебя зовут?"</span>)
name = input()
<span class="python-keyword">print</span>(<span class="code-value">f"Привет, {name}!"</span>)` },
      { title: "Операторы", content: "Арифметика, сравнение, логика. Деление <code>/</code> — float, <code>//</code> — целочисленное.", example: `a = <span class="code-value">7</span>
b = <span class="code-value">3</span>
<span class="python-keyword">print</span>(a / b, a // b, a ** b)` },
      { title: "Условия if/elif/else", content: "Ветвления по условиям. Важны отступы (4 пробела).", example: `score = <span class="code-value">72</span>
<span class="python-keyword">if</span> score &gt;= <span class="code-value">60</span>:
    <span class="python-keyword">print</span>(<span class="code-value">"Сдал"</span>)
<span class="python-keyword">else</span>:
    <span class="python-keyword">print</span>(<span class="code-value">"Не сдал"</span>)` },
      { title: "Циклы for и while", content: "Циклы повторяют действия. <code>for</code> перебирает коллекции, <code>while</code> — пока условие истинно.", example: `<span class="python-keyword">for</span> i <span class="python-keyword">in</span> range(<span class="code-value">3</span>):
    <span class="python-keyword">print</span>(i)` },
      { title: "Списки", content: "Список — изменяемая последовательность.", example: `nums = [<span class="code-value">1</span>,<span class="code-value">2</span>,<span class="code-value">3</span>]
nums.append(<span class="code-value">4</span>)
<span class="python-keyword">print</span>(nums)` },
      { title: "Кортежи и множества", content: "Кортеж — неизменяемая последовательность. Множество — уникальные значения без порядка.", example: `t = (<span class="code-value">1</span>, <span class="code-value">2</span>)
s = {<span class="code-value">1</span>, <span class="code-value">2</span>, <span class="code-value">2</span>}
<span class="python-keyword">print</span>(t, s)` },
      { title: "Словари", content: "Словарь — пары ключ/значение.", example: `user = {<span class="code-value">"name"</span>: <span class="code-value">"Игорь"</span>, <span class="code-value">"age"</span>: <span class="code-value">20</span>}
<span class="python-keyword">print</span>(user[<span class="code-value">"name"</span>])` },
      { title: "Функции", content: "Функции помогают структурировать код. Возврат значений через <code>return</code>.", example: `<span class="python-keyword">def</span> area(w, h):
    <span class="python-keyword">return</span> w * h

<span class="python-keyword">print</span>(area(<span class="code-value">3</span>, <span class="code-value">5</span>))` },
      { title: "Работа с файлами", content: "Открываем файл через <code>with open</code> — так он закроется автоматически.", example: `<span class="python-keyword">with</span> open(<span class="code-value">"data.txt"</span>, <span class="code-value">"w"</span>, encoding=<span class="code-value">"utf-8"</span>) <span class="python-keyword">as</span> f:
    f.write(<span class="code-value">"Привет"</span>)` },
      { title: "Исключения (try/except)", content: "Обрабатываем ошибки, чтобы программа не падала.", example: `<span class="python-keyword">try</span>:
    x = <span class="code-value">1</span> / <span class="code-value">0</span>
<span class="python-keyword">except</span> ZeroDivisionError:
    <span class="python-keyword">print</span>(<span class="code-value">"Нельзя делить на ноль"</span>)` },
      { title: "Модули и пакеты", content: "Подключайте чужой или свой код через <code>import</code>.", example: `<span class="python-keyword">import</span> math
<span class="python-keyword">print</span>(math.sqrt(<span class="code-value">9</span>))` },
      { title: "Классы и объекты (ООП)", content: "Класс описывает шаблон, объект — экземпляр. Метод <code>__init__</code> — конструктор.", example: `<span class="python-keyword">class</span> Person:
    <span class="python-keyword">def</span> __init__(self, name):
        self.name = name
    <span class="python-keyword">def</span> hello(self):
        <span class="python-keyword">print</span>(<span class="code-value">f"Привет, {self.name}"</span>)

p = Person(<span class="code-value">"Оля"</span>)
p.hello()` },
      { title: "Практика: консольный калькулятор", content: "Реализуем простое меню с операциями сложения/вычитания/умножения/деления и обработкой ошибок.", example: `<span class="python-keyword">def</span> calc(a, b, op):
    <span class="python-keyword">if</span> op == <span class="code-value">"+"</span>: <span class="python-keyword">return</span> a + b
    <span class="python-keyword">elif</span> op == <span class="code-value">"-"</span>: <span class="python-keyword">return</span> a - b
    <span class="python-keyword">elif</span> op == <span class="code-value">"*"</span>: <span class="python-keyword">return</span> a * b
    <span class="python-keyword">elif</span> op == <span class="code-value">"/"</span>:
        <span class="python-keyword">return</span> a / b <span class="code-comment"># Не забудьте обработать деление на 0</span>
    <span class="python-keyword">else</span>:
        <span class="python-keyword">return</span> <span class="code-value">None</span>` }
    ];
    return { title: "Python", lessons };
  }
}

// Инициализация единожды
window.learningPlatformInstance = new LearningPlatform();
