document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.nav_btn');
    const cards = document.querySelectorAll('.gallery_card');
    const selectedImage = document.getElementById('selectedImage');
    const detailTitle = document.getElementById('detailTitle');
    const detailText = document.getElementById('detailText');

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

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const imgPath = card.querySelector('img').getAttribute('src');
            selectedImage.setAttribute('src', imgPath);

            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');
            if (title) detailTitle.textContent = title;
            if (desc) detailText.innerHTML = desc;
        });
    });
});
