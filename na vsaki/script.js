document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav_btn');
    const cards = document.querySelectorAll('.card');
    const previewImage = document.getElementById('previewImage');
    const previewTitle = document.getElementById('previewTitle');
    const previewText = document.getElementById('previewText');

    // Функція для оновлення великого прев'ю
    function updatePreview(card) {
        const img = card.querySelector('img');
        if (img && previewImage) {
            previewImage.src = img.getAttribute('src');
        }

        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-desc');
        
        if (title && previewTitle) previewTitle.textContent = title;
        if (desc && previewText) previewText.innerHTML = desc;

        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
    }

    // Фільтрація карток у галереї за категоріями
    function showCategory(category) {
        let firstVisibleCard = null;

        cards.forEach(card => {
            if (card.getAttribute('data-category') === category) {
                card.style.display = 'flex';
                if (!firstVisibleCard) {
                    firstVisibleCard = card;
                }
            } else {
                card.style.display = 'none';
            }
        });

        // Автоматично обираємо першу картку нової категорії для прев'ю
        if (firstVisibleCard) {
            updatePreview(firstVisibleCard);
        }
    }

    // Запуск за замовчуванням (абстракція)
    showCategory('abstract');

    // Кліки по кнопках навігації
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showCategory(btn.getAttribute('data-category'));
        });
    });

    // Кліки по картках галереї
    cards.forEach(card => {
        card.addEventListener('click', () => {
            updatePreview(card);
        });
    });
});