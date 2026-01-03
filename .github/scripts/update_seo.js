const fs = require('fs');
const path = require('path');

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL; // e.g. https://xyz.supabase.co
const SUPABASE_KEY = process.env.SUPABASE_KEY; // Service Role or Anon Key
const INDEX_PATH = path.join(__dirname, '../../index.html');

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Error: SUPABASE_URL and SUPABASE_KEY are required.');
    process.exit(1);
}

async function fetchProducts() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=title,category,type&limit=20&order=created_at.desc`, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    return await response.json();
}

function generateKeywords(products) {
    const baseKeywords = [
        // PT Core
        'arte original', 'arte contemporânea', 'arte digital', 'arte feita por IA',
        'arte gerada por inteligência artificial', 'quadros originais', 'quadros modernos',
        'ilustrações artísticas', 'música independente', 'música digital', 'sons para produtores',
        'efeitos sonoros', 'merchandising artístico', 'loja de arte online', 'loja criativa',
        'marketplace de artistas', 'produtos criativos exclusivos',
        // EN Core
        'original art', 'contemporary art', 'AI generated art', 'digital art download',
        'limited edition art prints', 'independent music', 'digital albums download',
        'sound effects library', 'music samples pack', 'online art store', 'creative marketplace'
    ];

    const productKeywords = products.map(p => p.title.toLowerCase());
    const uniqueKeywords = [...new Set([...baseKeywords, ...productKeywords])];

    return uniqueKeywords.join(', ');
}

function generateDescription(products) {
    const latestTitles = products.slice(0, 3).map(p => `'${p.title}'`).join(', ');
    return `OkapaDesign - Arte original por Paulo Morgado. Descubra novidades como ${latestTitles} e muito mais. Quadros, música e merch.`;
}

async function updateIndexHtml() {
    try {
        console.log('Fetching products...');
        const products = await fetchProducts();
        console.log(`Found ${products.length} products.`);

        const newKeywords = generateKeywords(products);
        const newDescription = generateDescription(products);

        console.log('Reading index.html...');
        let html = fs.readFileSync(INDEX_PATH, 'utf8');

        // Regex to replace content
        const keywordsRegex = /<meta name="keywords" content="[^"]*">/i;
        const descriptionRegex = /<meta name="description" content="[^"]*">/i;

        html = html.replace(keywordsRegex, `<meta name="keywords" content="${newKeywords}">`);
        html = html.replace(descriptionRegex, `<meta name="description" content="${newDescription}">`);

        console.log('Writing updates to index.html...');
        fs.writeFileSync(INDEX_PATH, html);
        console.log('SEO tags updated successfully.');

    } catch (error) {
        console.error('Error updating SEO:', error);
        process.exit(1);
    }
}

updateIndexHtml();
