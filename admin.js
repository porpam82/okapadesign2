console.log('Admin Script: Carregado.');

// CONFIG
const SUPABASE_URL = 'https://yjayutnbxfblzndtvqae.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqYXl1dG5ieGZibHpuZHR2cWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMDAxMDQsImV4cCI6MjA4Mjg3NjEwNH0.JoD9XpHyRRL0bMZeIvKVtzriEIfqPm8EBAvNJ5bQtBA';

// Elements
const diagStatus = document.getElementById('sys-status');
const authSection = document.getElementById('auth-section');
const adminContent = document.getElementById('admin-content');
const loginForm = document.getElementById('login-form');
const productForm = document.getElementById('product-form');
const productsList = document.getElementById('products-list');
const countEl = document.getElementById('count');
const successAlert = document.getElementById('success-alert');
const uploadStatus = document.getElementById('upload-status');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-edit');
const googleBtn = document.getElementById('google-login-btn');

let sb; // Renamed from supabase to sb to avoid conflict
let isEditing = false;

// Helpers
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag]));
}

function logDiag(msg) {
    console.log('[DIAG]', msg);
    if (diagStatus) {
        diagStatus.innerHTML += '<br>' + msg;
        diagStatus.parentElement.style.borderColor = '#d4a574';
    }
}

// Initialization
async function init() {
    try {
        logDiag('Iniciando inicialização...');

        if (!window.supabase) {
            throw new Error('Supabase SDK não encontrado no window');
        }

        sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        logDiag('Supabase inicializado.');

        // Bind Events
        if (loginForm) loginForm.addEventListener('submit', handleLogin);
        else logDiag('⚠️ ERRO: loginForm não encontrado!');

        if (googleBtn) googleBtn.addEventListener('click', handleGoogleLogin);
        else logDiag('⚠️ ERRO: googleBtn não encontrado!');

        if (productForm) productForm.addEventListener('submit', handleProductSubmit);
        if (cancelBtn) cancelBtn.addEventListener('click', handleCancelEdit);

        // Check Session
        await checkUser();

    } catch (e) {
        console.error('Fatal Init Error:', e);
        logDiag('❌ ERRO FATAL: ' + e.message);
        alert('Erro Fatal: ' + e.message);
    }
}

// Auth Handlers
async function handleLogin(e) {
    e.preventDefault();
    logDiag('Submit de login detetado.');

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    logDiag('Enviando pedido ao Supabase...');
    const { error } = await sb.auth.signInWithPassword({ email, password });

    if (error) {
        logDiag('❌ Erro Supabase: ' + error.message);
        alert('Erro no login: ' + error.message);
    } else {
        logDiag('✅ Sucesso! A carregar painel...');
        showAdmin();
    }
}

async function handleGoogleLogin() {
    logDiag('Clique Google detetado.');
    const errorEl = document.getElementById('login-error');
    if (errorEl) errorEl.style.display = 'none';

    if (window.location.protocol === 'file:') {
        const msg = '❌ Erro: O login do Google não funciona via file://.';
        logDiag(msg);
        if (errorEl) {
            errorEl.textContent = msg;
            errorEl.style.display = 'block';
        }
        alert(msg);
        return;
    }

    const { error } = await sb.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + window.location.pathname
        }
    });

    if (error) {
        logDiag('❌ Erro OAuth: ' + error.message);
        if (errorEl) {
            errorEl.textContent = '❌ ' + error.message;
            errorEl.style.display = 'block';
        }
    }
}

async function checkUser() {
    logDiag('Verificando sessão...');
    const { data: { session }, error } = await sb.auth.getSession();

    if (error) {
        logDiag('Erro sessão: ' + error.message);
        showAuth();
        return;
    }

    if (session) {
        const userEmail = session.user.email;
        logDiag('Utilizador detetado: ' + userEmail);

        // Check if user is in admins table
        const { data: adminData, error: adminError } = await sb
            .from('admins')
            .select('email')
            .eq('email', userEmail)
            .single();

        if (adminError || !adminData) {
            logDiag('⛔ Bloqueado: ' + userEmail);
            alert('⛔ Acesso negado para ' + userEmail);
            await sb.auth.signOut();
            showAuth();
            return;
        }

        showAdmin();
    } else {
        logDiag('Sem sessão ativa.');
        showAuth();
    }
}

async function handleLogout() {
    await sb.auth.signOut();
    window.location.reload();
}

// UI Helpers
function showAdmin() {
    if (authSection) authSection.style.display = 'none';
    if (adminContent) adminContent.style.display = 'block';
    loadProducts();
}

function showAuth() {
    if (authSection) authSection.style.display = 'block';
    if (adminContent) adminContent.style.display = 'none';
}

// Tab switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    // Deactivate all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById('tab-' + tabName);
    if (selectedTab) selectedTab.classList.add('active');

    // Activate corresponding button by ID or position
    if (tabName === 'products') {
        const productsBtn = document.querySelector('.tab-btn:first-child');
        if (productsBtn) productsBtn.classList.add('active');
    } else if (tabName === 'addProduct') {
        const addBtn = document.getElementById('add-tab-btn');
        if (addBtn) addBtn.classList.add('active');
    }
}
window.switchTab = switchTab;

// Product Logic
let allProducts = [];
let currentPage = 1;
let itemsPerPage = 10;

const searchInput = document.getElementById('search-products');
const filterCategory = document.getElementById('filter-category');
const paginationEl = document.getElementById('pagination');

// Initialize search and filter listeners
if (searchInput) {
    searchInput.addEventListener('input', () => {
        currentPage = 1;
        renderProducts();
    });
}
if (filterCategory) {
    filterCategory.addEventListener('change', () => {
        currentPage = 1;
        renderProducts();
    });
}

const itemsPerPageSelect = document.getElementById('itemsPerPage');
if (itemsPerPageSelect) {
    itemsPerPageSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        itemsPerPage = val === 'all' ? 999999 : parseInt(val);
        currentPage = 1;
        renderProducts();
    });
}

async function loadProducts() {
    logDiag('Carregando produtos...');
    const { data, error } = await sb
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        logDiag('Erro ao carregar produtos: ' + error.message);
        return;
    }

    allProducts = data;
    renderProducts();
}

function getFilteredProducts() {
    let filtered = [...allProducts];

    // Search filter
    const searchTerm = searchInput?.value?.toLowerCase() || '';
    if (searchTerm) {
        filtered = filtered.filter(p =>
            p.title?.toLowerCase().includes(searchTerm) ||
            p.title_en?.toLowerCase().includes(searchTerm) ||
            p.type?.toLowerCase().includes(searchTerm) ||
            p.description?.toLowerCase().includes(searchTerm)
        );
    }

    // Category filter
    const category = filterCategory?.value || '';
    if (category) {
        filtered = filtered.filter(p => p.category === category);
    }

    return filtered;
}

function renderProducts() {
    const filtered = getFilteredProducts();
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const paged = filtered.slice(start, start + itemsPerPage);

    if (countEl) countEl.textContent = filtered.length;

    const categoryLabels = {
        paintings: 'Quadros',
        lettering: 'Digital',
        '3d': '2D/3D',
        music: 'Música',
        merch: 'Merch'
    };

    if (productsList) {
        if (filtered.length === 0) {
            productsList.innerHTML = '<tr><td colspan="6" class="empty">Nenhum produto encontrado</td></tr>';
        } else {
            productsList.innerHTML = paged.map(p => `
                <tr>
                    <td><img src="${p.image_url}" alt="${escapeHTML(p.title)}" onerror="this.src='https://placehold.co/50x50/1a1a1a/d4a574?text=IMG'"></td>
                    <td>
                        <strong>${escapeHTML(p.title)}</strong>
                        <br><small style="color:#888">${escapeHTML(p.type || '-')}</small>
                    </td>
                    <td>
                        <small style="display:block; max-height: 4.5em; overflow: hidden; color: #aaa; line-height: 1.4; text-align: left;">
                            ${p.description ? (p.description.length > 150 ? escapeHTML(p.description.substring(0, 150)) + '...' : escapeHTML(p.description)) : '-'}
                        </small>
                    </td>
                    <td><span class="category-badge">${categoryLabels[p.category] || escapeHTML(p.category)}</span></td>
                    <td style="color:#d4a574; font-weight:600">€${p.price}</td>
                    <td>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn" style="background: #333; padding: 0.4rem 0.6rem;" onclick="window.editProduct('${p.id}')">✏️</button>
                            <button class="btn btn-danger" style="padding: 0.4rem 0.6rem;" onclick="window.deleteProduct('${p.id}')">🗑</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
    }

    // Render pagination
    if (paginationEl && totalPages > 1) {
        let paginationHTML = '';

        // Previous button
        paginationHTML += `<button ${currentPage === 1 ? 'disabled style="opacity:0.5"' : ''} onclick="window.goToPage(${currentPage - 1})">‹</button>`;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                paginationHTML += `<button class="${i === currentPage ? 'active' : ''}" onclick="window.goToPage(${i})">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                paginationHTML += `<button disabled style="border:none;background:none;color:#888">...</button>`;
            }
        }

        // Next button
        paginationHTML += `<button ${currentPage === totalPages ? 'disabled style="opacity:0.5"' : ''} onclick="window.goToPage(${currentPage + 1})">›</button>`;

        paginationEl.innerHTML = paginationHTML;
    } else if (paginationEl) {
        paginationEl.innerHTML = '';
    }
}

window.goToPage = function (page) {
    const filtered = getFilteredProducts();
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderProducts();
    }
};

async function handleProductSubmit(e) {
    e.preventDefault();
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'A processar...';
    }

    try {
        let imageUrl = document.getElementById('image-url').value;
        const fileInput = document.getElementById('image-file');

        let mediaUrl = document.getElementById('media-url').value;
        const mediaInput = document.getElementById('media-file');

        if (fileInput.files.length > 0) {
            if (uploadStatus) uploadStatus.textContent = '⏳ Uploading Image...';
            const file = fileInput.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `img_${Math.random().toString(36).substring(2)}.${fileExt}`;

            const { error: uploadError } = await sb.storage
                .from('product-images')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = sb.storage
                .from('product-images')
                .getPublicUrl(fileName);

            imageUrl = publicUrl;
        }

        if (mediaInput.files.length > 0) {
            if (uploadStatus) uploadStatus.textContent = '⏳ Uploading Media...';
            const file = mediaInput.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `media_${Math.random().toString(36).substring(2)}.${fileExt}`;

            const { error: uploadError } = await sb.storage
                .from('product-images') // User should ideally use a separate bucket or allow types here
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = sb.storage
                .from('product-images')
                .getPublicUrl(fileName);

            mediaUrl = publicUrl;
        }

        const productData = {
            title: document.getElementById('title').value,
            title_en: document.getElementById('titleEn').value,
            category: document.getElementById('category').value,
            type: document.getElementById('type').value,
            type_en: document.getElementById('typeEn').value,
            price: parseFloat(document.getElementById('price').value),
            description: document.getElementById('desc').value,
            description_en: document.getElementById('descEn').value,
            image_url: imageUrl,
            media_url: mediaUrl
        };

        let error;
        if (isEditing) {
            const id = document.getElementById('product-id').value;
            const { error: err } = await sb.from('products').update(productData).eq('id', id);
            error = err;
        } else {
            const { error: err } = await sb.from('products').insert([productData]);
            error = err;
        }

        if (error) throw error;

        if (successAlert) {
            successAlert.style.display = 'block';
            setTimeout(() => successAlert.style.display = 'none', 3000);
        }

        handleCancelEdit();
        loadProducts();

    } catch (err) {
        alert('Erro: ' + err.message);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Salvar Produto';
        }
        if (uploadStatus) uploadStatus.textContent = '';
    }
}

function handleCancelEdit() {
    isEditing = false;
    if (formTitle) formTitle.textContent = '➕ Adicionar Produto';
    if (submitBtn) submitBtn.textContent = 'Salvar Produto';
    if (cancelBtn) cancelBtn.style.display = 'none';
    if (productForm) productForm.reset();
    document.getElementById('product-id').value = '';
    // Switch back to products tab
    switchTab('products');
}

// Global scope functions for HTML onclick attributes
window.deleteProduct = async function (id) {
    if (confirm('Apagar produto?')) {
        const { error } = await sb.from('products').delete().eq('id', id);
        if (error) alert(error.message);
        else loadProducts();
    }
};

window.editProduct = function (id) {
    sb.from('products').select('*').eq('id', id).single().then(({ data }) => {
        if (data) {
            isEditing = true;
            if (formTitle) formTitle.textContent = '✏️ Editar Produto';
            if (submitBtn) submitBtn.textContent = 'Atualizar';
            if (cancelBtn) cancelBtn.style.display = 'inline-flex';

            document.getElementById('product-id').value = data.id;
            document.getElementById('title').value = data.title;
            document.getElementById('titleEn').value = data.title_en || '';
            document.getElementById('category').value = data.category;
            document.getElementById('type').value = data.type || '';
            document.getElementById('typeEn').value = data.type_en || '';
            document.getElementById('price').value = data.price;
            document.getElementById('desc').value = data.description || '';
            document.getElementById('descEn').value = data.description_en || '';
            document.getElementById('image-url').value = data.image_url || '';
            document.getElementById('media-url').value = data.media_url || '';

            // Switch to Add/Edit tab
            switchTab('addProduct');
        }
    });
};

window.translateText = async function (sourceId, targetId) {
    const text = document.getElementById(sourceId).value;
    if (!text) return;

    // Note: event is deprecated/global, better to pass 'this' from HTML but for now leaving as is
    // Assuming simple usage
    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=pt|en`);
        const data = await response.json();
        if (data.responseData) {
            document.getElementById(targetId).value = data.responseData.translatedText;
        }
    } catch (err) {
        console.error(err);
    }
};

window.generateSitemap = async function () {
    if (!confirm('Gerar e descarregar novo sitemap.xml?')) return;

    try {
        logDiag('Gerando sitemap...');
        const { data, error } = await sb
            .from('products')
            .select('id, created_at')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const baseUrl = 'https://okapadesign.com';
        const now = new Date().toISOString();

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Static pages
        xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
        xml += `  <url>\n    <loc>${baseUrl}/#shop</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;

        // Products
        data.forEach(p => {
            const date = p.created_at ? new Date(p.created_at).toISOString() : now;
            xml += `  <url>\n    <loc>${baseUrl}/?product=${p.id}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        });

        xml += '</urlset>';

        // Download
        const blob = new Blob([xml], { type: 'text/xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        logDiag('✅ Sitemap gerado!');
        alert('Sitemap gerado! Faça upload deste ficheiro "sitemap.xml" para a raiz do site no GitHub.');
    } catch (err) {
        logDiag('❌ Erro sitemap: ' + err.message);
        alert('Erro: ' + err.message);
    }
};

window.handleLogout = handleLogout;

// Start
init();
