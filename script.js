document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.nav_btn');
    const cards = document.querySelectorAll('.gallery_card');
    const selectedImage = document.getElementById('selectedImage');
    const detailTitle = document.getElementById('detailTitle');
    const detailText = document.getElementById('detailText');
    const detailTextBox = document.getElementById('detailTextBox');
    const detailPrice = document.getElementById('detailPrice');
    const addToCartBtn = document.getElementById('addToCartBtn');

    /* ===================== ФІЛЬТР ГАЛЕРЕЇ ===================== */
    function filterGallery(category) {
        cards.forEach(card => {
            card.style.display = card.getAttribute('data-category') === category ? 'flex' : 'none';
        });
    }

    filterGallery('abstract');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            filterGallery(button.getAttribute('data-category'));
        });
    });

    /* ============== ПОТОЧНА ВИБРАНА КАРТИНА (для кошика) ============== */
    let currentArt = {
        title: detailTitle.textContent.trim(),
        price: Number(detailPrice.textContent.replace(/\D/g, '')) || 0,
        img: selectedImage.getAttribute('src')
    };

    /* ===================== АНІМАЦІЯ ТЕКСТУ ПРИ ВИБОРІ КАРТИНИ ===================== */
    function playTextAnimation() {
        detailTextBox.classList.remove('animate');
        // форсуємо reflow, щоб анімацію можна було відтворити повторно
        void detailTextBox.offsetWidth;
        detailTextBox.classList.add('animate');
    }

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const imgPath = card.querySelector('img').getAttribute('src');
            selectedImage.setAttribute('src', imgPath);

            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');
            const price = Number(card.getAttribute('data-price')) || 0;

            if (title) detailTitle.textContent = title;
            if (desc) detailText.innerHTML = desc;
            detailPrice.textContent = price + ' ₴';

            currentArt = { title, price, img: imgPath };

            // скидаємо стан кнопки "Додати в кошик", якщо вона була змінена
            addToCartBtn.textContent = 'Додати в кошик';
            addToCartBtn.classList.remove('added');

            // запускаємо анімацію появи тексту
            playTextAnimation();

            // плавно прокручуємо до опису, якщо секція поза екраном (на мобільних)
            const rect = detailTextBox.getBoundingClientRect();
            if (rect.top < 0 || rect.bottom > window.innerHeight) {
                detailTextBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });

    // програємо анімацію одразу для картини, вибраної за замовчуванням
    playTextAnimation();

    /* ============================ КОШИК ============================ */
    const CART_KEY = 'art_website_cart';
    let cart = loadCart();

    const cartBar = document.getElementById('cartBar');
    const cartToggleBtn = document.getElementById('cartToggleBtn');
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    const cartPanel = document.getElementById('cartPanel');
    const cartItemsEl = document.getElementById('cartItems');
    const cartEmptyMsg = document.getElementById('cartEmptyMsg');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const cartBarTotal = document.getElementById('cartBarTotal');
    const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');

    function loadCart() {
        try {
            const raw = localStorage.getItem(CART_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveCart() {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
        } catch (e) { /* ігноруємо, якщо localStorage недоступний */ }
    }

    function formatPrice(value) {
        return value.toLocaleString('uk-UA') + ' ₴';
    }

    function renderCart() {
        cartItemsEl.innerHTML = '';

        if (cart.length === 0) {
            cartEmptyMsg.style.display = 'block';
            cartItemsEl.appendChild(cartEmptyMsg);
        } else {
            cartEmptyMsg.style.display = 'none';

            cart.forEach((item, index) => {
                const row = document.createElement('div');
                row.className = 'cart_item';
                row.innerHTML = `
                    <img src="${item.img}" alt="${item.title}">
                    <div class="cart_item_info">
                        <div class="cart_item_title">${item.title}</div>
                        <div class="cart_item_price">${formatPrice(item.price)}</div>
                    </div>
                    <button class="cart_item_remove" data-index="${index}" aria-label="Видалити">&times;</button>
                `;
                cartItemsEl.appendChild(row);
            });
        }

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartCount.textContent = cart.length;
        cartTotal.textContent = formatPrice(total);
        cartBarTotal.textContent = formatPrice(total);
    }

    function addToCart(item) {
        cart.push(item);
        saveCart();
        renderCart();

        addToCartBtn.textContent = 'Додано ✓';
        addToCartBtn.classList.add('added');

        // невелика "стрибаюча" анімація на іконці кошика
        cartToggleBtn.animate(
            [
                { transform: 'scale(1)' },
                { transform: 'scale(1.25)' },
                { transform: 'scale(1)' }
            ],
            { duration: 350, easing: 'ease-out' }
        );
    }

    addToCartBtn.addEventListener('click', () => {
        addToCart({ ...currentArt });
    });

    cartItemsEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.cart_item_remove');
        if (!btn) return;
        const index = Number(btn.getAttribute('data-index'));
        cart.splice(index, 1);
        saveCart();
        renderCart();
    });

    cartToggleBtn.addEventListener('click', () => {
        cartPanel.classList.toggle('open');
    });

    cartCloseBtn.addEventListener('click', () => {
        cartPanel.classList.remove('open');
    });

    document.addEventListener('click', (e) => {
        if (!cartBar.contains(e.target)) {
            cartPanel.classList.remove('open');
        }
    });

    /* ===================== ФАЛЬШИВЕ ОФОРМЛЕННЯ ЗАМОВЛЕННЯ ===================== */
    const checkoutOverlay = document.getElementById('checkoutOverlay');
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutCloseBtn = document.getElementById('checkoutCloseBtn');
    const checkoutSummary = document.getElementById('checkoutSummary');
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutFormView = document.getElementById('checkoutFormView');
    const checkoutSuccessView = document.getElementById('checkoutSuccessView');
    const checkoutSuccessText = document.getElementById('checkoutSuccessText');
    const checkoutDoneBtn = document.getElementById('checkoutDoneBtn');

    function renderCheckoutSummary() {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        const rows = cart.map(item => `
            <div class="checkout_summary_row">
                <span>${item.title}</span>
                <span>${formatPrice(item.price)}</span>
            </div>
        `).join('');

        checkoutSummary.innerHTML = `
            ${rows}
            <div class="checkout_summary_row total">
                <span>Разом (${cart.length} шт.)</span>
                <span>${formatPrice(total)}</span>
            </div>
        `;
    }

    function openCheckout() {
        // повертаємо форму до початкового вигляду
        checkoutFormView.style.display = 'block';
        checkoutSuccessView.classList.remove('show');
        checkoutForm.reset();

        renderCheckoutSummary();

        cartPanel.classList.remove('open');
        checkoutOverlay.classList.add('open');
        checkoutModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeCheckout() {
        checkoutOverlay.classList.remove('open');
        checkoutModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    cartCheckoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Ваш кошик порожній. Додайте хоча б одну картину.');
            return;
        }
        openCheckout();
    });

    checkoutCloseBtn.addEventListener('click', closeCheckout);
    checkoutOverlay.addEventListener('click', closeCheckout);

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        const name = document.getElementById('checkoutName').value.trim();

        checkoutSuccessText.textContent =
            `Дякуємо, ${name}! Ваше замовлення на суму ${formatPrice(total)} прийнято в обробку.`;

        checkoutFormView.style.display = 'none';
        checkoutSuccessView.classList.add('show');

        // перезапускаємо анімацію галочки
        const check = checkoutSuccessView.querySelector('.checkout_success_icon');
        check.style.animation = 'none';
        void check.offsetWidth;
        check.style.animation = '';

        cart = [];
        saveCart();
        renderCart();
    });

    checkoutDoneBtn.addEventListener('click', closeCheckout);

    renderCart();
});
