// ===== SUPABASE CONFIG =====
// ===== SUPABASE CONFIG =====
const SUPABASE_URL = 'https://yjayutnbxfblzndtvqae.supabase.co';
const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;
// Public key removed - using Edge Functions for security
const sb = null; // Removed client usage

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
        'about.title': 'Olá, sou a criadora da okapadesign',
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
        'type.Pack Merchandising': 'Pack Merchandising',
        'modal.title': 'Como encomendar',
        'modal.text': 'Gostou do produto? Na okapadesign gostamos de tratar de cada encomenda pessoalmente. Assim, entre em contato via e-mail do autor ou para o e-mail geral.',
        'modal.button': 'Enviar Email Agora',
        'about.desc1': 'A minha jornada artística combina a paixão por pinturas tradicionais com design digital moderno.',
        'about.desc2': 'Crio quadros únicos para decoração e designs de lettering prontos para estampar em t-shirts, garrafas térmicas e outros produtos.',
        'about.note_label': 'Nota:',
        'about.note_text': 'Convido amigos para exporem os seus trabalhos no site okapadesign. Cada encomenda é tratada pessoalmente via email do autor.',
        'stat.works': 'Obras',
        'stat.clients': 'Clientes',
        'stat.years': 'Anos',
        'contact.desc': 'Gostou do produto? Na okapadesign gostamos de tratar de cada encomenda pessoalmente. Assim, entre em contato via e-mail do autor ou para o e-mail geral.',
        'placeholder.name': 'Nome',
        'placeholder.email': 'Email',
        'placeholder.message': 'Mensagem',
        'btn.send_message': 'Enviar Mensagem',
        'contact.email_label': 'Email',
        'contact.location_label': 'Localização',
        'contact.location_value': 'Lisboa, Portugal',
        'footer.tagline': 'Pinturas e arte digital para seu espaço e estilo.',
        'footer.copyright': '© 2026 okapadesign. Todos os direitos reservados.'
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
        'type.Pack Merchandising': 'Merch Pack',
        'modal.title': 'How to order',
        'modal.text': 'Liked the product? At okapadesign we like to handle each order personally. Please contact us via the author\'s email or our general email.',
        'modal.button': 'Send Email Now',
        'about.desc1': 'My artistic journey combines a passion for traditional paintings with modern digital design.',
        'about.desc2': 'I create unique paintings for decoration and lettering designs ready for t-shirt printing, water bottles, and other products.',
        'about.note_label': 'Note:',
        'about.note_text': 'I invite friends to showcase their work on the okapadesign website. Each order is handled personally via the author\'s email.',
        'stat.works': 'Works',
        'stat.clients': 'Clients',
        'stat.years': 'Years',
        'contact.desc': 'Liked the product? At okapadesign we like to handle each order personally. Please contact us via the author\'s email or our general email.',
        'placeholder.name': 'Name',
        'placeholder.email': 'Email',
        'placeholder.message': 'Message',
        'btn.send_message': 'Send Message',
        'contact.email_label': 'Email',
        'contact.location_label': 'Location',
        'contact.location_value': 'Lisbon, Portugal',
        'footer.tagline': 'Paintings and digital art for your space and style.',
        'footer.copyright': '© 2026 okapadesign. All rights reserved.',

        // Shop page new content
        'shop.hero.title': 'Original Art Shop',
        'shop.hero.desc': 'Discover an exclusive selection of original hand-painted paintings, AI-generated digital art, independent music, 2D/3D assets for creators, and merchandising designs ready to print. Each piece is unique and made with dedication by artists in Lisbon.',
        'shop.categories.title': 'Explore Our Categories',
        'shop.cat.paintings.title': '🎨 Original Paintings',
        'shop.cat.paintings.desc': 'Unique paintings in acrylic, oil and mixed media. Each painting is an exclusive piece created by hand, perfect for decorating living rooms, offices and creative spaces. Sizes ranging from 50x70cm to 120x150cm.',
        'shop.cat.digital.title': '🤖 AI Digital Art',
        'shop.cat.digital.desc': 'Lettering designs and illustrations created with artificial intelligence. Ideal for printing on t-shirts, mugs, posters, notebook covers and much more. PNG/SVG formats in high resolution ready for printing.',
        'shop.cat.music.title': '🎵 Music & Sound',
        'shop.cat.music.desc': 'Original beats, lo-fi music, sound effects and podcast intros. Perfect for producers, YouTubers and content creators. All tracks are royalty-free and come in WAV/MP3 formats.',
        'shop.cat.merch.title': '📦 Merchandising',
        'shop.cat.merch.desc': 'Complete design packs for t-shirts, thermal bottles, mugs, stickers and posters. Save money by buying bundles with multiple designs ready to use in your business or personal projects.',
        'shop.cat.assets.title': '🧊 2D/3D Assets',
        'shop.cat.assets.desc': 'Vector icons, animated characters, low poly 3D models, interior design furniture and UI elements. Essential resources for designers, game developers and architects.',
        'shop.faq.title': 'Frequently Asked Questions About Orders',
        'shop.faq1.q': 'How do I place an order?',
        'shop.faq1.a': 'Click the "Buy" button on the product you want and send us an email. Each order is handled personally to ensure the best experience. We will respond with payment and shipping details within 24 hours.',
        'shop.faq2.q': 'What payment methods are accepted?',
        'shop.faq2.a': 'We accept bank transfer (IBAN), MBWay, PayPal and Revolut. For high-value original paintings, we also accept installment payments by prior agreement.',
        'shop.faq3.q': 'Do you ship outside Portugal?',
        'shop.faq3.a': 'Yes! We ship throughout Europe and, upon consultation, to other countries. Shipping costs vary depending on destination and artwork size. Contact us for a personalized quote.',
        'shop.faq4.q': 'Do the paintings come framed?',
        'shop.faq4.a': 'The prices shown are for unframed canvases. We can provide custom frames upon additional request. Contact us for frame options and respective prices.',
        'shop.faq5.q': 'Can I order a custom piece?',
        'shop.faq5.a': 'Absolutely! We accept custom orders for paintings, digital designs and music. Send us your ideas, references and preferences by email and we will create a tailor-made proposal.',
        'shop.faq6.q': 'What is the delivery time?',
        'shop.faq6.a': 'Digital products (digital art, music, assets) are delivered by email in 24-48 hours. Original paintings have a shipping time of 5-10 business days in Portugal and 10-20 days to Europe. Custom works may take 2-4 weeks depending on complexity.',

        // About page new content
        'about.hero.title': 'About OkapaDesign',
        'about.hero.desc': 'A multidisciplinary creative studio in Lisbon, where traditional art meets digital innovation. Since 2021 transforming ideas into artworks that connect, inspire and decorate.',
        'about.intro.p1': 'I founded OkapaDesign in 2021 with the mission to democratize art and make it accessible to everyone. I believe that every space deserves to be decorated with unique pieces that tell stories and convey emotions.',
        'about.intro.p2': 'My work spans various creative areas: original paintings in acrylic and oil, graphic design and branding, web design, interior architecture, and even electronic music under the KlaudIAmusicrave project.',
        'about.philosophy.title': 'Creative Philosophy',
        'about.philosophy1.title': '🎨 Art with Soul',
        'about.philosophy1.desc': 'Every brushstroke, every pixel, every musical note I create carries an intention. Art is not just decoration — it is expression, it is communication, it is a bridge between the artist and those who contemplate the work. I work with the belief that art has the power to transform spaces and elevate spirits.',
        'about.philosophy2.title': '🤝 Collaboration and Community',
        'about.philosophy2.desc': 'OkapaDesign is more than my personal portfolio. It is a collaboration platform where I invite other artists, musicians and designers to share their work. I believe that together we go further and create a richer and more diversified artistic ecosystem.',
        'about.philosophy3.title': '💡 Innovation and Tradition',
        'about.philosophy3.desc': 'I combine traditional painting techniques with the latest artificial intelligence tools. This fusion allows me to explore new creative territories while always maintaining the authenticity and human touch that make each work something special and irreplaceable.',
        'about.process.title': 'Work Process',
        'about.process1.title': 'Inspiration',
        'about.process1.desc': 'I capture ideas from everyday life, from nature, from music and from human emotions. Inspiration comes from everywhere.',
        'about.process2.title': 'Experimentation',
        'about.process2.desc': 'I test combinations of colors, shapes and techniques. I use both traditional brushes and digital tools.',
        'about.process3.title': 'Creation',
        'about.process3.desc': 'I dedicate myself intensely to the work, layer by layer, until reaching the result that transmits the desired emotion.',
        'about.process4.title': 'Share',
        'about.process4.desc': 'The work comes to life when it reaches the hands of those who will appreciate it. Each piece finds its perfect home.',
        'about.skills.title': 'Areas of Expertise',
        'about.cta.title': 'Let\'s Work Together?',
        'about.cta.desc': 'Looking for a unique artwork or a personalized creative project? I love collaborating on new challenges.',
        'about.cta.btn1': 'Get in Touch',
        'about.cta.btn2': 'View Shop',

        // Contact page new content
        'contact.hero.title': 'Let\'s Talk',
        'contact.hero.desc': 'Do you like any product? Have an idea for a custom project? Need a quote? At OkapaDesign we treat each order in a personal and dedicated way. Response guaranteed within 24 hours.',
        'contact.info.title': 'Useful Information',
        'contact.info1.title': '⏱️ Response Time',
        'contact.info1.desc': 'We respond to all emails in less than 24 hours (business days). If you need urgent information, mention "URGENT" in the email subject.',
        'contact.info2.title': '💰 Quotes',
        'contact.info2.desc': 'We offer free and no-obligation quotes for custom projects. Describe your idea and we will send a detailed proposal with deadlines and values.',
        'contact.info3.title': '📦 Shipping',
        'contact.info3.desc': 'Free shipping in Continental Portugal for orders over €100. We ship throughout Europe. Digital products are delivered by email in 24-48h.',
        'contact.info4.title': '💳 Payments',
        'contact.info4.desc': 'We accept MBWay, bank transfer, PayPal and Revolut. For amounts over €500, possibility of installment payment.',
        'contact.info5.title': '🎨 Custom Projects',
        'contact.info5.desc': 'We love challenges! We create custom paintings, complete branding, websites and original music. Share your vision with us.',
        'contact.info6.title': '🌍 Languages',
        'contact.info6.desc': 'We serve in Portuguese and English. We feel comfortable working with international clients throughout Europe.',
        'contact.faq.title': 'Frequently Asked Questions',
        'contact.faq1.q': 'How much does a custom painting cost?',
        'contact.faq1.a': 'The price depends on size, technique and complexity. Small paintings (50x70cm) start at €400. Medium paintings (80x100cm) from €700. Send us your ideas for an exact quote.',
        'contact.faq2.q': 'How long does a custom order take?',
        'contact.faq2.a': 'Original paintings: 2-4 weeks. Digital designs: 3-7 days. Custom music: 1-2 weeks. Exact deadlines are confirmed after project analysis.',
        'contact.faq3.q': 'Can I return a product if I don\'t like it?',
        'contact.faq3.a': 'Digital products are non-refundable. Original paintings can be returned within 14 days in the same condition. Return shipping is at customer\'s expense.Custom works are non-refundable.',
        'contact.faq4.q': 'Do you work with companies?',
        'contact.faq4.a': 'Yes! We regularly work with companies on branding projects, office decoration, web design, and visual content creation. We have special conditions for corporate clients.',
        'contact.faq5.q': 'How can I track my order progress?',
        'contact.faq5.a': 'We send email updates with progress photos on all custom orders. You can also request updates at any time. We love keeping our customers informed!',
        'contact.cta.title': 'Still have questions?',
        'contact.cta.desc': 'Send us an email or message on social media. We are always available to help!',
        'contact.cta.btn': 'Send Email Now'
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

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
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
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.getElementById('lightbox-close');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const header = document.getElementById('header');
const shopGrid = document.getElementById('shop-grid');
const filterBtns = document.querySelectorAll('.gallery__filter');
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
        const response = await fetch(`${FUNCTIONS_URL}/get-products`);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();

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
        console.error('Error loading from Supabase Functions:', err);
    }
    renderShop();

    // Check for Deep Link
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    if (productId) {
        const art = artworks.find(a => a.id == productId);
        if (art) {
            openLightbox(art.image, art.title, art.id);
        }
    }
}

// Helper to sanitize HTML to prevent XSS
function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Helper to make links clickable (URLs and Emails) and format structured descriptions
function linkify(text) {
    if (!text) return '';

    // First, format structured fields with line breaks
    // Match patterns like "Field: value." or "Field: value" at word boundaries
    const fieldPatterns = [
        'Theme', 'Author', 'Dimensions', 'Style', 'Type', 'Technique',
        'Place of use', 'Sensations', 'Cost without postage and frame \\(€\\)',
        'Cost without postage and frame', 'Cost excluding shipping and frame \\(€\\)',
        'Cost excluding shipping and frame', 'Cost', 'Contact',
        'Tema', 'Autor', 'Dimensões', 'Estilo', 'Tipo',
        'Técnica', 'Local de uso', 'Sensações', 'Usable in', 'Feelings',
        'Custo sem portes e moldura \\(€\\)', 'Custo sem portes e moldura',
        'Contato', 'Contacto', 'Size', 'Material', 'Format', 'Duration',
        'Tamanho', 'Formato', 'Duração', 'Price', 'Preço'
    ];

    // 1. Sanitize raw text FIRST
    let formattedText = escapeHTML(text);

    // Check if text contains structured fields
    const hasStructuredFields = fieldPatterns.some(field => {
        const cleanField = field.replace(/\\[()]/g, match => match.slice(1));
        return text.includes(cleanField + ':') || text.includes(cleanField + ' :');
    });

    if (hasStructuredFields) {
        // Replace field names with line break - handle various separators including after numbers
        fieldPatterns.forEach(field => {
            // Match field after period, comma, space, or number (but not at start of string)
            const regex = new RegExp(`([.,\\d])\\s+(${field}\\s*:)`, 'gi');
            formattedText = formattedText.replace(regex, '$1<br><span style="color: #d4a574; font-weight: 600;">$2</span>');
        });

        // Handle first field (at the very beginning)
        fieldPatterns.forEach(field => {
            const startRegex = new RegExp(`^(${field}\\s*:)`, 'i');
            formattedText = formattedText.replace(startRegex, '<span style="color: #d4a574; font-weight: 600;">$1</span>');
        });
    }

    // URLs
    formattedText = formattedText.replace(/(https?:\/\/[^\s]+)/g, url => `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: var(--color-accent); text-decoration: underline;">${url}</a>`);
    // Emails
    formattedText = formattedText.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/g, email => `<a href="mailto:${email}" style="color: var(--color-accent); text-decoration: underline;">${email}</a>`);

    return formattedText;
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
            <div class="product__image" onclick="openLightbox('${art.image}', '${art.title.replace(/'/g, "\\'")}', '${art.id}')" style="cursor: pointer; aspect-ratio: 1/1; overflow: hidden;">
                <img src="${art.image}" alt="${art.title}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://placehold.co/400x400/1a1a1a/d4a574?text=${encodeURIComponent(art.title)}'">
                <span class="product__badge">${translations[currentLang]['badge.' + art.category] || art.category}</span>
            </div>
            <div class="product__info">
                <span class="product__category">${translations[currentLang]['type.' + art.type] || art.type}</span>
                <h3 class="product__title">${escapeHTML(currentLang === 'en' && art.titleEn ? art.titleEn : art.title)}</h3>
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
                    <button class="btn btn--small btn--buy" onclick="openBuyModal('${art.id}')">${translations[currentLang]['btn.buy']}</button>
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
function openBuyModal(id) {
    try {
        console.log('Opening modal for product:', id);
        const art = artworks.find(a => a.id == id);
        if (!art) {
            console.error('Product not found:', id);
            return;
        }

        const modal = document.getElementById('buy-modal');
        const emailBtn = document.getElementById('modal-email-btn');

        if (!modal || !emailBtn) {
            console.error('Modal elements missing!');
            alert('Erro interno: Elementos do modal não encontrados.');
            return;
        }

        // Try to find an email in the description
        const emailMatch = art.desc.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/);
        const targetEmail = emailMatch ? emailMatch[0] : 'okapadesign@gmail.com'; // Default email

        const subject = encodeURIComponent(`Interesse em comprar: ${art.title}`);
        const body = encodeURIComponent(`Olá, estou interessado no produto "${art.title}" (Ref: ${art.id}).\n\nPodem informar-me sobre o pagamento e envio?`);

        emailBtn.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

        modal.classList.add('active');
    } catch (e) {
        console.error('Modal Error:', e);
        alert('Erro ao abrir modal: ' + e.message);
    }
}
// Make globally accessible
window.openBuyModal = openBuyModal;

function closeBuyModal() {
    const modal = document.getElementById('buy-modal');
    if (modal) modal.classList.remove('active');
}
window.closeBuyModal = closeBuyModal;

function goToPage(page) {
    renderShop(currentFilter, page);
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
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
function openLightbox(src, alt, id) {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling

    // Update URL if ID is provided
    if (id) {
        const url = new URL(window.location);
        url.searchParams.set('product', id);
        window.history.pushState({}, '', url);
    }
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling

    // Clear URL param
    const url = new URL(window.location);
    url.searchParams.delete('product');
    window.history.pushState({}, '', url);

    setTimeout(() => {
        if (lightboxImage) lightboxImage.src = ''; // Clear image after animation
    }, 300);
}

// Event Listeners for Lightbox
if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}



// ===== CART (SIMPLE) =====
function addToCart(id) {
    const art = artworks.find(a => a.id === id);
    alert(`"${art.title}" adicionado ao carrinho!\n\nEsta é uma demonstração. Integre com um sistema de pagamento real.`);
}

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
        const response = await fetch(`${FUNCTIONS_URL}/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to send email');
        }

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
