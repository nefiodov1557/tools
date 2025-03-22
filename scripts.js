document.addEventListener('DOMContentLoaded', function() {
    // Получаем все элементы
    const editorTabs = document.querySelectorAll('.editor-tab');
    const copyButtons = document.querySelectorAll('.copy-button');

    // Функция для переключения вкладок
    function switchTab(clickedTab) {
        const tabName = clickedTab.getAttribute('data-tab');
        const editorContent = clickedTab.closest('.live-editor').querySelector('.editor-content');
        const htmlEditor = editorContent.querySelector('[id^="html-editor"]');
        const cssEditor = editorContent.querySelector('[id^="css-editor"]');

        // Обновляем активную вкладку
        clickedTab.closest('.tabs-group').querySelectorAll('.editor-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        clickedTab.classList.add('active');

        // Показываем соответствующий редактор
        if (tabName === 'html') {
            htmlEditor.parentElement.style.display = 'block';
            cssEditor.parentElement.style.display = 'none';
        } else {
            htmlEditor.parentElement.style.display = 'none';
            cssEditor.parentElement.style.display = 'block';
        }

        // Обновляем data-editor у кнопки копирования
        const copyButton = clickedTab.closest('.live-editor').querySelector('.copy-button');
        copyButton.setAttribute('data-editor', tabName === 'html' ? htmlEditor.id : cssEditor.id);
    }

    // Обработчики событий для вкладок
    editorTabs.forEach(tab => {
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
        const activeTab = liveEditor.querySelector('.editor-tab.active');
        const editorContent = liveEditor.querySelector('.editor-content');
        
        let codeElement;
        if (activeTab.getAttribute('data-tab') === 'html') {
            codeElement = editorContent.querySelector('[id^="html-editor"]');
        } else {
            codeElement = editorContent.querySelector('[id^="css-editor"]');
        }

        const code = decodeHtml(codeElement.innerHTML);

        navigator.clipboard.writeText(code).then(() => {
            button.classList.add('copied');
            button.querySelector('span').textContent = 'Скопировано!';
            
            setTimeout(() => {
                button.classList.remove('copied');
                button.querySelector('span').textContent = 'Копировать';
            }, 2000);
        }).catch(err => {
            console.error('Ошибка при копировании:', err);
        });
    }

    // Обработчики событий для кнопок копирования
    copyButtons.forEach(button => {
        button.addEventListener('click', () => copyCode(button));
    });

    // Инициализация при загрузке страницы
    editorTabs.forEach(tab => {
        if (tab.classList.contains('active')) {
            switchTab(tab);
        }
    });
});

