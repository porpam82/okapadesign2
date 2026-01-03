// ===== SUPABASE CONFIG =====
const SUPABASE_URL = 'https://yjayutnbxfblzndtvqae.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqYXl1dG5ieGZibHpuZHR2cWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMDAxMDQsImV4cCI6MjA4Mjg3NjEwNH0.JoD9XpHyRRL0bMZeIvKVtzriEIfqPm8EBAvNJ5bQtBA';
const sb = window.supabase ?
    window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// ===== DATA =====
let artworks = []; // Will be loaded from Supabase

// Local fallback data (kept as backup or for initial load reference)
const defaultArtworks = [
    // QUADROS (8 produtos)
    { id: 1, title: 'Harmonia Abstrata', titleEn: 'Abstract Harmony', category: 'paintings', price: 890, type: 'Quadro Original', desc: 'Acrílico sobre tela, 80x100cm', descEn: 'Acrylic on canvas, 80x100cm', image: 'images/art1.jpg' },
    { id: 2, title: 'Sonho Tropical', titleEn: 'Tropical Dream', category: 'paintings', price: 650, type: 'Quadro Original', desc: 'Óleo sobre tela, 60x80cm', descEn: 'Oil on canvas, 60x80cm', image: 'images/art4.jpg' },
    { id: 3, title: 'Oceano Sereno', titleEn: 'Serene Ocean', category: 'paintings', price: 720, type: 'Quadro Original', desc: 'Acrílico sobre tela, 70x90cm', descEn: 'Acrylic on canvas, 70x90cm', image: 'images/art1.jpg' },
    { id: 4, title: 'Pôr do Sol Urbano', titleEn: 'Urban Sunset', category: 'paintings', price: 580, type: 'Quadro Original', desc: 'Óleo sobre tela, 50x70cm', descEn: 'Oil on canvas, 50x70cm', image: 'images/art4.jpg' },
    { id: 5, title: 'Floresta Encantada', titleEn: 'Enchanted Forest', category: 'paintings', price: 950, type: 'Quadro Original', desc: 'Técnica mista, 100x120cm', descEn: 'Mixed media, 100x120cm', image: 'images/art1.jpg' },
    { id: 6, title: 'Montanhas ao Amanhecer', titleEn: 'Mountains at Dawn', category: 'paintings', price: 780, type: 'Quadro Original', desc: 'Acrílico sobre tela, 90x120cm', descEn: 'Acrylic on canvas, 90x120cm', image: 'images/art4.jpg' },
    { id: 7, title: 'Abstrato Dourado', titleEn: 'Golden Abstract', category: 'paintings', price: 850, type: 'Quadro Original', desc: 'Técnica mista, 80x80cm', descEn: 'Mixed media, 80x80cm', image: 'images/art1.jpg' },
    { id: 8, title: 'Cidade à Noite', titleEn: 'City at Night', category: 'paintings', price: 620, type: 'Quadro Original', desc: 'Óleo sobre tela, 60x90cm', descEn: 'Oil on canvas, 60x90cm', image: 'images/art4.jpg' },
    // ARTE DIGITAL (8 produtos)
    { id: 9, title: 'Good Vibes Only', titleEn: 'Good Vibes Only', category: 'lettering', price: 25, type: 'Arte Digital', desc: 'Design para estampa, PNG/SVG', descEn: 'Print design, PNG/SVG', image: 'images/art2.jpg' },
    { id: 10, title: 'Create Your Sunshine', titleEn: 'Create Your Sunshine', category: 'lettering', price: 30, type: 'Arte Digital', desc: 'Design para estampa, PNG/SVG', descEn: 'Print design, PNG/SVG', image: 'images/art3.jpg' },
    { id: 11, title: 'Stay Positive', titleEn: 'Stay Positive', category: 'lettering', price: 20, type: 'Arte Digital', desc: 'Design para estampa, PNG/SVG', descEn: 'Print design, PNG/SVG', image: 'images/art2.jpg' },
    { id: 12, title: 'Dream Big', titleEn: 'Dream Big', category: 'lettering', price: 22, type: 'Arte Digital', desc: 'Design para estampa, PNG/SVG', descEn: 'Print design, PNG/SVG', image: 'images/art3.jpg' },
    { id: 13, title: 'Be Kind', titleEn: 'Be Kind', category: 'lettering', price: 18, type: 'Arte Digital', desc: 'Design para estampa, PNG/SVG', descEn: 'Print design, PNG/SVG', image: 'images/art2.jpg' },
    { id: 14, title: 'Love Yourself', titleEn: 'Love Yourself', category: 'lettering', price: 25, type: 'Arte Digital', desc: 'Design para estampa, PNG/SVG', descEn: 'Print design, PNG/SVG', image: 'images/art3.jpg' },
    { id: 15, title: 'Never Give Up', titleEn: 'Never Give Up', category: 'lettering', price: 28, type: 'Arte Digital', desc: 'Design para estampa, PNG/SVG', descEn: 'Print design, PNG/SVG', image: 'images/art2.jpg' },
    { id: 16, title: 'Make It Happen', titleEn: 'Make It Happen', category: 'lettering', price: 24, type: 'Arte Digital', desc: 'Design para estampa, PNG/SVG', descEn: 'Print design, PNG/SVG', image: 'images/art3.jpg' },
    // MERCHANDISING (8 produtos)
    { id: 17, title: 'T-Shirt Pack', titleEn: 'T-Shirt Pack', category: 'merch', price: 45, type: 'Pack Merchandising', desc: '5 designs para estampar', descEn: '5 print-ready designs', image: 'images/art5.jpg' },
    { id: 18, title: 'Pack Garrafa Térmica', titleEn: 'Thermos Bottle Pack', category: 'merch', price: 35, type: 'Pack Merchandising', desc: '3 designs para garrafas', descEn: '3 bottle designs', image: 'images/art6.jpg' },
    { id: 19, title: 'Pack Canecas', titleEn: 'Mug Pack', category: 'merch', price: 40, type: 'Pack Merchandising', desc: '4 designs para canecas', descEn: '4 mug designs', image: 'images/art5.jpg' },
    { id: 20, title: 'Pack Cadernos', titleEn: 'Notebook Pack', category: 'merch', price: 38, type: 'Pack Merchandising', desc: '5 designs para capas', descEn: '5 cover designs', image: 'images/art6.jpg' },
    { id: 21, title: 'Pack Completo', titleEn: 'Complete Pack', category: 'merch', price: 75, type: 'Pack Merchandising', desc: '10 designs variados', descEn: '10 assorted designs', image: 'images/art5.jpg' },
    { id: 22, title: 'Pack Posters', titleEn: 'Poster Pack', category: 'merch', price: 50, type: 'Pack Merchandising', desc: '6 designs A3', descEn: '6 A3 designs', image: 'images/art6.jpg' },
    { id: 23, title: 'Pack Stickers', titleEn: 'Sticker Pack', category: 'merch', price: 15, type: 'Pack Merchandising', desc: '20 stickers variados', descEn: '20 assorted stickers', image: 'images/art5.jpg' },
    { id: 24, title: 'Pack Premium', titleEn: 'Premium Pack', category: 'merch', price: 95, type: 'Pack Merchandising', desc: 'Todos os packs incluídos', descEn: 'All packs included', image: 'images/art6.jpg' },
    // MÚSICA/SOM (8 produtos)
    { id: 25, title: 'Beat Pack Vol.1', titleEn: 'Beat Pack Vol.1', category: 'music', price: 35, type: 'Beats/Instrumentais', desc: '5 beats originais, WAV/MP3', descEn: '5 original beats, WAV/MP3', image: 'images/art2.jpg' },
    { id: 26, title: 'Lo-Fi Chill Pack', titleEn: 'Lo-Fi Chill Pack', category: 'music', price: 40, type: 'Beats/Instrumentais', desc: '8 beats lo-fi relaxantes', descEn: '8 relaxing lo-fi beats', image: 'images/art3.jpg' },
    { id: 27, title: 'Sound Effects Pack', titleEn: 'Sound Effects Pack', category: 'music', price: 25, type: 'Efeitos Sonoros', desc: '50 efeitos para vídeos', descEn: '50 video effects', image: 'images/art2.jpg' },
    { id: 28, title: 'Podcast Intro Pack', titleEn: 'Podcast Intro Pack', category: 'music', price: 30, type: 'Jingles', desc: '10 intros para podcast', descEn: '10 podcast intros', image: 'images/art3.jpg' },
    { id: 29, title: 'Trap Beat Pack', titleEn: 'Trap Beat Pack', category: 'music', price: 45, type: 'Beats/Instrumentais', desc: '6 beats trap energéticos', descEn: '6 energetic trap beats', image: 'images/art2.jpg' },
    { id: 30, title: 'Ambient Music Pack', titleEn: 'Ambient Music Pack', category: 'music', price: 35, type: 'Música Ambiente', desc: '10 faixas relaxantes', descEn: '10 relaxing tracks', image: 'images/art3.jpg' },
    { id: 31, title: 'YouTube Music Pack', titleEn: 'YouTube Music Pack', category: 'music', price: 50, type: 'Música para Vídeos', desc: '15 faixas royalty-free', descEn: '15 royalty-free tracks', image: 'images/art2.jpg' },
    { id: 32, title: 'Complete Audio Bundle', titleEn: 'Complete Audio Bundle', category: 'music', price: 120, type: 'Bundle Completo', desc: 'Todos os packs de áudio', descEn: 'All audio packs', image: 'images/art3.jpg' },
    // 2D/3D (8 produtos)
    { id: 33, title: 'Pack Ícones 2D', titleEn: '2D Icons Pack', category: '3d', price: 30, type: 'Assets 2D', desc: '100 ícones vetoriais', descEn: '100 vector icons', image: 'images/art5.jpg' },
    { id: 34, title: 'Characters 2D Pack', titleEn: 'Characters 2D Pack', category: '3d', price: 45, type: 'Assets 2D', desc: '10 personagens animados', descEn: '10 animated characters', image: 'images/art6.jpg' },
    { id: 35, title: 'Low Poly 3D Pack', titleEn: 'Low Poly 3D Pack', category: '3d', price: 55, type: 'Modelos 3D', desc: '20 modelos low poly', descEn: '20 low poly models', image: 'images/art5.jpg' },
    { id: 36, title: 'Furniture 3D Pack', titleEn: 'Furniture 3D Pack', category: '3d', price: 65, type: 'Modelos 3D', desc: '15 móveis para interior', descEn: '15 interior furniture', image: 'images/art6.jpg' },
    { id: 37, title: 'UI Elements Pack', titleEn: 'UI Elements Pack', category: '3d', price: 35, type: 'Assets 2D', desc: '50 elementos de UI', descEn: '50 UI elements', image: 'images/art5.jpg' },
    { id: 38, title: 'Game Assets 2D', titleEn: 'Game Assets 2D', category: '3d', price: 50, type: 'Assets 2D', desc: 'Sprites para jogos', descEn: 'Game sprites', image: 'images/art6.jpg' },
    { id: 39, title: 'Architectural 3D', titleEn: 'Architectural 3D', category: '3d', price: 80, type: 'Modelos 3D', desc: '10 edifícios detalhados', descEn: '10 detailed buildings', image: 'images/art5.jpg' },
    { id: 40, title: '3D Complete Bundle', titleEn: '3D Complete Bundle', category: '3d', price: 150, type: 'Bundle Completo', desc: 'Todos os assets 2D/3D', descEn: 'All 2D/3D assets', image: 'images/art6.jpg' }
];

// Load from localStorage or use defaults
function getArtworks() {
    const saved = localStorage.getItem('okapa_products');
    return saved ? JSON.parse(saved) : defaultArtworks;
}
// Carregar dados iniciais (fallback)
artworks = getArtworks();

// ===== TRANSLATIONS =====
const translations = {
    pt: {
        'nav.home': 'Início',
        'nav.shop': 'Loja',
        'nav.about': 'Sobre',
        'nav.contact': 'Contato',
        'hero.subtitle': 'Pinturas Originais & Arte Digital',
        'hero.title': 'Arte é para',
        'hero.title_accent': 'todos',
        'hero.desc': 'Quadros únicos e designs de lettering para t-shirts, garrafas térmicas e muito mais.',
        'hero.btn_shop': 'Ver Loja',
        'hero.btn_about': 'Sobre Mim',
        'shop.subtitle': 'Loja',
        'shop.title': 'Obras Disponíveis',
        'filter.all': 'Todas',
        'filter.paintings': 'Quadros',
        'filter.digital': 'Digital',
        'filter.music': 'Música/Som',
        'about.subtitle': 'Sobre o Artista',
        'about.title': 'Olá, sou o criador da okapadesign',
        'contact.subtitle': 'Contato',
        'contact.title': 'Vamos Conversar',
        'btn.buy': 'Comprar',
        'badge.paintings': 'Quadro',
        'badge.lettering': 'Digital',
        'badge.music': 'Áudio',
        'badge.3d': '2D/3D',
        'badge.merch': 'Merch',
        // Tipos de produto
        'type.Quadro Original': 'Quadro Original',
        'type.Arte Digital': 'Arte Digital',
        'type.Beats/Instrumentais': 'Beats/Instrumentais',
        'type.Efeitos Sonoros': 'Efeitos Sonoros',
        'type.Jingles': 'Jingles',
        'type.Música Ambiente': 'Música Ambiente',
        'type.Música para Vídeos': 'Música para Vídeos',
        'type.Bundle Completo': 'Bundle Completo',
        'type.Assets 2D': 'Assets 2D',
        'type.Modelos 3D': 'Modelos 3D',
        'type.Pack Merchandising': 'Pack Merchandising'
    },
    en: {
        'nav.home': 'Home',
        'nav.shop': 'Shop',
        'nav.about': 'About',
        'nav.contact': 'Contact',
        'hero.subtitle': 'Original Paintings & Digital Art',
        'hero.title': 'Art is for',
        'hero.title_accent': 'everyone',
        'hero.desc': 'Unique paintings and lettering designs for t-shirts, water bottles and much more.',
        'hero.btn_shop': 'View Shop',
        'hero.btn_about': 'About Me',
        'shop.subtitle': 'Shop',
        'shop.title': 'Available Works',
        'filter.all': 'All',
        'filter.paintings': 'Paintings',
        'filter.digital': 'Digital',
        'filter.music': 'Music/Sound',
        'about.subtitle': 'About the Artist',
        'about.title': 'Hi, I\'m the creator of okapadesign',
        'contact.subtitle': 'Contact',
        'contact.title': 'Let\'s Talk',
        'btn.buy': 'Buy',
        'badge.paintings': 'Painting',
        'badge.lettering': 'Digital',
        'badge.music': 'Audio',
        'badge.3d': '2D/3D',
        'badge.merch': 'Merch',
        // Product types
        'type.Quadro Original': 'Original Painting',
        'type.Arte Digital': 'Digital Art',
        'type.Beats/Instrumentais': 'Beats/Instrumentals',
        'type.Efeitos Sonoros': 'Sound Effects',
        'type.Jingles': 'Jingles',
        'type.Música Ambiente': 'Ambient Music',
        'type.Música para Vídeos': 'Music for Videos',
        'type.Bundle Completo': 'Complete Bundle',
        'type.Assets 2D': '2D Assets',
        'type.Modelos 3D': '3D Models',
        'type.Pack Merchandising': 'Merch Pack'
    }
};

let currentLang = localStorage.getItem('okapa_lang') || 'pt';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('okapa_lang', lang);

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Re-render shop with new language
    renderShop(currentFilter, currentPage);
}

// ===== PAGINATION =====
const ITEMS_PER_PAGE = 6;
let currentPage = 1;
let currentFilter = 'all';

// ===== DOM ELEMENTS =====
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const header = document.getElementById('header');
const shopGrid = document.getElementById('shop-grid');
const filterBtns = document.querySelectorAll('.gallery__filter');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.getElementById('lightbox-close');
const contactForm = document.getElementById('contact-form');

// ===== NAVIGATION =====
navToggle?.addEventListener('click', () => navMenu.classList.add('show'));
navClose?.addEventListener('click', () => navMenu.classList.remove('show'));
navLinks.forEach(link => link.addEventListener('click', () => navMenu.classList.remove('show')));

// Active link on scroll
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    header.style.background = scrollY > 50 ? 'rgba(10,10,10,0.98)' : 'rgba(10,10,10,0.95)';

    document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) link.classList.add('active');
            });
        }
    });
});

// ===== RENDER SHOP WITH PAGINATION =====
// Load from Supabase or use defaults
async function loadArtworks() {
    try {
        if (!sb) throw new Error('Supabase not initialized');

        const { data, error } = await sb
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
            artworks = data.map(item => ({
                id: item.id,
                title: item.title,
                titleEn: item.title_en,
                category: item.category,
                price: Number(item.price),
                type: item.type,
                typeEn: item.type_en,
                desc: item.description,
                descEn: item.description_en,
                image: item.image_url,
                media: item.media_url
            }));
        }
    } catch (err) {
        console.error('Error loading from Supabase:', err);
    }
    renderShop();
}

// Helper to make links clickable
// Helper to make links clickable (URLs and Emails)
function linkify(text) {
    if (!text) return '';
    // URLs
    let html = text.replace(/(https?:\/\/[^\s]+)/g, url => `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: var(--color-accent); text-decoration: underline;">${url}</a>`);
    // Emails
    html = html.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/g, email => `<a href="mailto:${email}" style="color: var(--color-accent); text-decoration: underline;">${email}</a>`);
    return html;
}

function renderShop(filter = currentFilter, page = currentPage) {
    currentFilter = filter;
    currentPage = page;

    const filtered = filter === 'all' ? artworks : artworks.filter(a => a.category === filter);
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const start = (page - 1) * ITEMS_PER_PAGE;
    const paged = filtered.slice(start, start + ITEMS_PER_PAGE);

    // Render products
    shopGrid.innerHTML = paged.map(art => `
        <article class="product">
            <div class="product__image">
                <img src="${art.image}" alt="${art.title}" onerror="this.src='https://placehold.co/400x400/1a1a1a/d4a574?text=${encodeURIComponent(art.title)}'">
                <span class="product__badge">${translations[currentLang]['badge.' + art.category] || art.category}</span>
            </div>
            <div class="product__info">
                <span class="product__category">${translations[currentLang]['type.' + art.type] || art.type}</span>
                <h3 class="product__title">${currentLang === 'en' && art.titleEn ? art.titleEn : art.title}</h3>
                ${art.media ? `
                    <div class="product__media" style="margin: 10px 0;">
                        ${art.media.match(/\.(mp3|wav|ogg)$/i) ?
                `<audio controls src="${art.media}" style="width: 100%; height: 30px;"></audio>` :
                `<video controls src="${art.media}" style="width: 100%; max-height: 200px; border-radius: 4px;"></video>`
            }
                    </div>
                ` : ''}
                <p class="product__description">${linkify(currentLang === 'en' && art.descEn ? art.descEn : art.desc)}</p>
                <div class="product__footer">
                    <span class="product__price">€ ${art.price.toLocaleString()}</span>
                    <button class="btn btn--small btn--buy js-buy-btn" data-id="${art.id}">${translations[currentLang]['btn.buy']}</button>
                </div>
            </div>
        </article>
    `).join('');

    // Remove old pagination first
    const oldPagination = document.querySelector('.pagination');
    if (oldPagination) oldPagination.remove();

    // Render pagination
    if (totalPages > 1) {
        let paginationHTML = '<div class="pagination">';
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `<button class="pagination__btn ${i === page ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        }
        paginationHTML += '</div>';
        shopGrid.insertAdjacentHTML('afterend', paginationHTML);
    }
}

// ===== BUY MODAL =====
// Event Delegation Pattern to avoid inline onclick reference errors
document.addEventListener('click', (e) => {
    // Handle Buy Button Click
    if (e.target.closest('.js-buy-btn')) {
        const btn = e.target.closest('.js-buy-btn');
        const id = btn.dataset.id;
        openBuyModal(id);
    }
    // Handle Close Button Click
    if (e.target.closest('.modal__close') || e.target.classList.contains('modal')) {
        closeBuyModal();
    }
});

function openBuyModal(rawId) {
    try {
        console.log('Attempting to open modal for ID:', rawId);

        let id = rawId;
        // Try to convert to number if possible to match artworks array
        if (!isNaN(rawId)) {
            id = Number(rawId);
        }

        const art = artworks.find(a => a.id == id); // Abstract equality to match string/number

        if (!art) {
            console.error('Product not found for ID:', id);
            alert('Produto não encontrado. ID: ' + id);
            return;
        }

        const modal = document.getElementById('buy-modal');
        const emailBtn = document.getElementById('modal-email-btn');

        if (!modal || !emailBtn) {
            alert('Erro interno: Modal não encontrado.');
            return;
        }

        // Try to find an email in the description
        const emailMatch = art.desc.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/);
        const targetEmail = emailMatch ? emailMatch[0] : 'okapadesign@gmail.com';

        const subject = encodeURIComponent(`Interesse em comprar: ${art.title}`);
        const body = encodeURIComponent(`Olá, estou interessado no produto "${art.title}" (Ref: ${art.id}).\n\nPodem informar-me sobre o pagamento e envio?`);

        emailBtn.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

        modal.classList.add('active');
        console.log('Modal opened successfully');

    } catch (e) {
        console.error('Critical Modal Error:', e);
        alert('Erro ao abrir janela de compra: ' + e.message);
    }
}

function closeBuyModal() {
    const modal = document.getElementById('buy-modal');
    if (modal) modal.classList.remove('active');
}

// Global expose for backup
window.openBuyModal = openBuyModal;
window.closeBuyModal = closeBuyModal;

function goToPage(page) {
    renderShop(currentFilter, page);
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
}
}

// ===== FILTERS =====
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderShop(btn.dataset.filter, 1);
    });
});

// ===== LIGHTBOX =====
function openLightbox(src, alt) {
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightboxImage.onerror = () => { lightboxImage.src = `https://placehold.co/800x600/1a1a1a/d4a574?text=${encodeURIComponent(alt)}`; };
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== CART (SIMPLE) =====
function addToCart(id) {
    const art = artworks.find(a => a.id === id);
    alert(`"${art.title}" adicionado ao carrinho!\n\nEsta é uma demonstração. Integre com um sistema de pagamento real.`);
}

// ===== CONTACT FORM =====
// ===== CONTACT FORM =====
contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // UI Loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    try {
        if (!sb) throw new Error('Supabase client not initialized');

        const { data, error } = await sb.functions.invoke('send-email', {
            body: { name, email, message }
        });

        if (error) throw error;

        alert(`Obrigado ${name}! A sua mensagem foi enviada com sucesso.`);
        contactForm.reset();
    } catch (err) {
        console.error('Error sending email:', err);
        alert('Erro ao enviar mensagem. Por favor tente novamente ou use o email direto.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize language
    setLanguage(currentLang);

    // Language switcher
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    // Load from Supabase
    loadArtworks();
});
