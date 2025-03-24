document.addEventListener('DOMContentLoaded', function() {
    // Получаем все элементы
    const editorTabs = document.querySelectorAll('.editor-tab');
    const copyButtons = document.querySelectorAll('.copy-button');
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'light';

    // Определяем, является ли устройство мобильным
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Обработчик клика по переключателю темы
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'light' : 'dark';
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Функция для переключения вкладок
    function switchTab(clickedTab) {
        const tabName = clickedTab.getAttribute('data-tab');
        const editorContent = clickedTab.closest('.live-editor').querySelector('.editor-content');
        const htmlEditor = editorContent.querySelector('[id^="html-editor"]');
        const cssEditor = editorContent.querySelector('[id^="css-editor"]');
        const jsEditor = editorContent.querySelector('[id^="js-editor"]');
        const copyButton = clickedTab.closest('.live-editor').querySelector('.copy-button');

        // Обновляем активную вкладку
        clickedTab.closest('.tabs-group').querySelectorAll('.editor-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        clickedTab.classList.add('active');

        // Показываем соответствующий редактор
        if (tabName === 'html') {
            htmlEditor.parentElement.style.display = 'block';
            cssEditor.parentElement.style.display = 'none';
            jsEditor.parentElement.style.display = 'none';
            copyButton.setAttribute('data-editor', htmlEditor.id);
        } else if (tabName === 'css') {
            htmlEditor.parentElement.style.display = 'none';
            cssEditor.parentElement.style.display = 'block';
            jsEditor.parentElement.style.display = 'none';
            copyButton.setAttribute('data-editor', cssEditor.id);
        } else if (tabName === 'javascript') {
            htmlEditor.parentElement.style.display = 'none';
            cssEditor.parentElement.style.display = 'none';
            jsEditor.parentElement.style.display = 'block';
            copyButton.setAttribute('data-editor', jsEditor.id);
        }

        // Прокручиваем к началу кода на мобильных устройствах
        if (isMobile) {
            editorContent.scrollTop = 0;
        }
    }

    // Обработчики событий для вкладок
    editorTabs.forEach(tab => {
        if (isMobile) {
            // Для мобильных используем touchend вместо click
            tab.addEventListener('touchend', (e) => {
                e.preventDefault();
                switchTab(tab);
            });
        }
        tab.addEventListener('click', () => switchTab(tab));
    });

    // Функция для декодирования HTML-сущностей
    function decodeHtml(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    // Функция для копирования кода
    function copyCode(button) {
        const liveEditor = button.closest('.live-editor');
        const editorId = button.getAttribute('data-editor');
        const codeBlock = document.getElementById(editorId);
        
        if (!codeBlock) return;

        // Получаем чистый текст, удаляя HTML-теги
        const cleanText = codeBlock.textContent || codeBlock.innerText;

        // Создаем временный элемент для копирования
        const textarea = document.createElement('textarea');
        textarea.value = cleanText;
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            const buttonText = button.querySelector('span');
            const buttonIcon = button.querySelector('i');
            
            buttonText.textContent = 'Скопировано!';
            buttonIcon.className = 'fa-solid fa-check';
            button.classList.add('copied');
            
            setTimeout(() => {
                buttonText.textContent = 'Копировать';
                buttonIcon.className = 'fa-solid fa-copy';
                button.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('Не удалось скопировать текст:', err);
        }
        
        document.body.removeChild(textarea);
    }

    // Функция для отображения обратной связи при копировании
    function showCopyFeedback(button) {
        button.classList.add('copied');
        const span = button.querySelector('span');
        if (span) {
            span.textContent = 'Скопировано!';
        }
        
        setTimeout(() => {
            button.classList.remove('copied');
            if (span) {
                span.textContent = 'Копировать';
            }
        }, 2000);
    }

    // Обработчики событий для кнопок копирования
    copyButtons.forEach(button => {
        if (isMobile) {
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                copyCode(button);
            });
        }
        button.addEventListener('click', () => copyCode(button));
    });

    // Инициализация при загрузке страницы
    editorTabs.forEach(tab => {
        if (tab.classList.contains('active')) {
            switchTab(tab);
        }
    });

    // Обработка изменения ориентации экрана
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            editorTabs.forEach(tab => {
                if (tab.classList.contains('active')) {
                    switchTab(tab);
                }
            });
        }, 100);
    });

    // Обновление иконки темы
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
});