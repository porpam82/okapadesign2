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

// Product Logic
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

    if (countEl) countEl.textContent = data.length;

    if (productsList) {
        if (data.length === 0) {
            productsList.innerHTML = '<div class="empty">Nenhum produto cadastrado</div>';
        } else {
            productsList.innerHTML = data.map(p => `
                <div class="product-item">
                    <img src="${p.image_url}" alt="${p.title}" onerror="this.src='https://placehold.co/60x60/1a1a1a/d4a574?text=IMG'">
                    <div class="product-info">
                        <h4>${p.title} ${p.title_en ? '<span class="edit-badge">EN</span>' : ''}</h4>
                        <p>${p.type || p.category} • €${p.price}</p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn" style="background: #333;" onclick="window.editProduct('${p.id}')">✏️</button>
                        <button class="btn btn-danger" onclick="window.deleteProduct('${p.id}')">🗑</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

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

            window.scrollTo({ top: 0, behavior: 'smooth' });
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

window.handleLogout = handleLogout;

// Start
init();
