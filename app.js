// ===================== CONTROLE DO MENU HAMBÚRGUER MOBILE =====================
// Seleciona o botão de alternância do menu (o ícone de hambúrguer) pelo seu ID.
const menuToggle = document.getElementById('menu-toggle');
// Seleciona o elemento de navegação (o menu em si) pelo seu ID.
const nav = document.getElementById('nav');

// Adiciona um 'listener' de evento de clique ao botão do menu.
menuToggle.addEventListener('click', () => {
    // Quando clicado, alterna a classe 'show' no elemento 'nav'.
    // Esta classe 'show' é usada no CSS para exibir ou ocultar o menu de navegação no mobile.
    nav.classList.toggle('show');

    // --- Lógica para fechar o carrinho se estiver aberto ao abrir o menu ---
    // Seleciona a barra lateral do carrinho.
    const cartSidebar = document.getElementById('cart-sidebar');
    // Verifica se o overlay do carrinho (o fundo escuro semitransparente) existe no DOM.
    const existingCartOverlay = document.querySelector('.cart-overlay');

    // Se a barra lateral do carrinho tiver a classe 'open' (significa que está aberta)...
    if (cartSidebar.classList.contains('open')) {
        // ...remove a classe 'open' para fechar o carrinho.
        cartSidebar.classList.remove('open');
        // Se o overlay do carrinho existir...
        if (existingCartOverlay) {
            // ...o remove do DOM, fazendo-o desaparecer.
            existingCartOverlay.remove();
        }
    }
});

// ===================== CONTROLE DO BOTÃO VOLTAR AO TOPO =====================
// Seleciona o botão "Voltar ao Topo" pelo seu ID.
const backToTopBtn = document.getElementById('backToTop');

// Adiciona um 'listener' de evento de rolagem (scroll) à janela do navegador.
window.addEventListener('scroll', () => {
    // Verifica se a posição de rolagem vertical (scrollY) é maior que 300 pixels.
    if (window.scrollY > 300) {
        // Se for, exibe o botão (definindo seu estilo 'display' como 'block').
        backToTopBtn.style.display = 'block';
    } else {
        // Caso contrário (se estiver nos primeiros 300px), oculta o botão.
        backToTopBtn.style.display = 'none';
    }
});

// Adiciona um 'listener' de evento de clique ao botão "Voltar ao Topo".
backToTopBtn.addEventListener('click', () => {
    // Quando clicado, rola a janela para o topo (posição 0) suavemente.
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Anima a rolagem.
    });
});

// ===================== VALIDAÇÃO SIMPLES DO FORMULÁRIO DE CONTATO (EXEMPLO) =====================
// Seleciona o formulário de contato pelo seu ID.
const contactForm = document.getElementById('contactForm');

// Verifica se o 'contactForm' existe (isto é crucial porque o formulário agora só está em index.html).
// O código dentro deste 'if' só será executado se o elemento for encontrado.
if (contactForm) {
    // Adiciona um 'listener' de evento de submissão (submit) ao formulário.
    contactForm.addEventListener('submit', (e) => {
        // Previne o comportamento padrão de submissão do formulário, que recarregaria a página.
        e.preventDefault();

        // Obtém os valores dos campos do formulário e remove espaços em branco extras.
        const nome = contactForm.nome.value.trim();
        const email = contactForm.email.value.trim();
        const mensagem = contactForm.mensagem.value.trim();

        // --- Validações simples ---
        // Valida o campo 'nome'.
        if (nome.length < 3) {
            alert('Por favor, digite um nome válido com pelo menos 3 caracteres.');
            return; // Interrompe a função se a validação falhar.
        }

        // Valida o campo 'email' usando uma expressão regular.
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            alert('Por favor, digite um e-mail válido.');
            return;
        }

        // Valida o campo 'mensagem'.
        if (mensagem.length < 10) {
            alert('Por favor, digite uma mensagem com pelo menos 10 caracteres.');
            return;
        }

        // Se todas as validações passarem, exibe uma mensagem de sucesso e reseta o formulário.
        alert('Mensagem enviada com sucesso! Obrigado.');
        contactForm.reset();
    });
}

// ===================== LÓGICA DO CARRINHO DE COMPRAS =====================

// Seleciona os elementos do DOM relacionados ao carrinho.
const cartToggle = document.getElementById('cart-toggle');       // Botão para abrir/fechar o carrinho (o ícone do carrinho).
const closeCartBtn = document.getElementById('close-cart');     // Botão 'X' para fechar o carrinho dentro da sidebar.
const cartSidebar = document.getElementById('cart-sidebar');    // A barra lateral do carrinho.
const cartItemsContainer = document.getElementById('cart-items'); // O contêiner onde os itens do carrinho são listados.
const cartTotalValue = document.getElementById('cart-total-value'); // O elemento que exibe o valor total do carrinho.
const cartCountSpan = document.getElementById('cart-count');     // O span que exibe a quantidade de itens no carrinho no cabeçalho.

// Inicialmente, seleciona todos os botões "Adicionar ao Carrinho".
// 'let' é usado porque esta NodeList pode ser "re-selecionada" se o DOM mudar dinamicamente.
let addToCartButtons = document.querySelectorAll('.add-to-cart');
// Array que armazenará os objetos dos itens no carrinho.
let cart = [];

// Função para salvar o estado atual do carrinho no LocalStorage do navegador.
// Isso permite que o carrinho persista mesmo se o usuário fechar e reabrir a página.
const saveCart = () => {
    localStorage.setItem('shoppingCart', JSON.stringify(cart)); // Converte o array 'cart' para uma string JSON.
};

// Função para carregar o carrinho do LocalStorage quando a página é carregada.
const loadCart = () => {
    const savedCart = localStorage.getItem('shoppingCart'); // Tenta obter a string JSON do carrinho.
    if (savedCart) { // Se algo for encontrado...
        cart = JSON.parse(savedCart); // Converte a string JSON de volta para um array de objetos.
        updateCartDisplay(); // Atualiza a interface do usuário com os itens carregados.
    }
};

// Função principal para atualizar a exibição visual do carrinho no HTML.
const updateCartDisplay = () => {
    cartItemsContainer.innerHTML = ''; // Limpa o conteúdo atual da lista de itens para evitar duplicatas.
    let total = 0; // Inicializa o total do carrinho.

    // Se o carrinho estiver vazio...
    if (cart.length === 0) {
        // Exibe uma mensagem de "carrinho vazio".
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Seu carrinho está vazio.</p>';
    } else {
        // Para cada item no array 'cart'...
        cart.forEach(item => {
            // Cria um novo elemento 'div' para representar o item no carrinho.
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item'); // Adiciona a classe CSS para estilização.
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">Remover</button>
            `; // Define o HTML interno do item, usando os dados do item.
            cartItemsContainer.appendChild(itemElement); // Adiciona o elemento do item ao contêiner.
            total += item.price * item.quantity; // Adiciona o valor do item ao total.
        });
    }

    // Atualiza o texto do valor total no rodapé do carrinho.
    cartTotalValue.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    // Atualiza o contador de itens no ícone do carrinho no cabeçalho, somando as quantidades de todos os itens.
    cartCountSpan.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    saveCart(); // Salva o estado atualizado do carrinho no LocalStorage.
};

// Função para adicionar um produto ao carrinho.
const addItemToCart = (productId, productName, productPrice, productImage) => {
    // Tenta encontrar o item no carrinho pelo seu ID.
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        // Se o item já existe, apenas incrementa sua quantidade.
        existingItem.quantity++;
    } else {
        // Se o item não existe, adiciona um novo objeto ao array 'cart'.
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1 // Começa com quantidade 1.
        });
    }
    updateCartDisplay(); // Atualiza a exibição do carrinho.
    // Abre o carrinho automaticamente ao adicionar um item.
    cartSidebar.classList.add('open');
    // Cria e adiciona o overlay (fundo escuro) para o carrinho.
    document.body.appendChild(createCartOverlay());
};

// Função para remover um item específico do carrinho.
const removeItemFromCart = (productId) => {
    // Filtra o array 'cart', mantendo apenas os itens cujo ID é diferente do item a ser removido.
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay(); // Atualiza a exibição do carrinho.
};

// Função para ajustar a quantidade de um item no carrinho.
const adjustQuantity = (productId, change) => {
    // Encontra o índice do item no array 'cart'.
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) { // Se o item for encontrado...
        cart[itemIndex].quantity += change; // Ajusta a quantidade.
        if (cart[itemIndex].quantity <= 0) {
            // Se a quantidade for 0 ou menos, remove o item do array.
            cart.splice(itemIndex, 1);
        }
    }
    updateCartDisplay(); // Atualiza a exibição do carrinho.
};

// Event Listeners para os botões "Adicionar ao Carrinho"
// Garante que o código só seja executado quando todo o HTML (DOM) estiver completamente carregado.
document.addEventListener('DOMContentLoaded', () => {
    // Re-seleciona todos os botões 'add-to-cart' para garantir que, se houver produtos adicionados dinamicamente no futuro, eles sejam incluídos.
    addToCartButtons = document.querySelectorAll('.add-to-cart');

    // Itera sobre cada botão "Adicionar ao Carrinho" encontrado.
    addToCartButtons.forEach(button => {
        // Adiciona um 'listener' de evento de clique a cada botão.
        button.addEventListener('click', (event) => {
            // Obtém os dados do produto (ID, nome, preço, imagem) dos atributos 'data-' do botão clicado.
            const productId = event.target.dataset.productId;
            const productName = event.target.dataset.productName;
            const productPrice = parseFloat(event.target.dataset.productPrice); // Converte o preço para número.
            const productImage = event.target.dataset.productImage;
            // Chama a função para adicionar o item ao carrinho com os dados coletados.
            addItemToCart(productId, productName, productPrice, productImage);
        });
    });
});


// Event Listener para abrir o carrinho (clique no ícone do carrinho no cabeçalho).
cartToggle.addEventListener('click', () => {
    cartSidebar.classList.add('open'); // Adiciona a classe 'open' para exibir a sidebar.
    document.body.appendChild(createCartOverlay()); // Cria e adiciona o overlay.
    // Fecha o menu hambúrguer se estiver aberto, para evitar sobreposição e conflito.
    if (nav.classList.contains('show')) {
        nav.classList.remove('show');
    }
});

// Event Listener para fechar o carrinho (clique no botão 'X' dentro do carrinho).
closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('open'); // Remove a classe 'open' para ocultar a sidebar.
    // Opcional chaining operator (?.): remove o overlay SOMENTE se ele existir no DOM.
    document.querySelector('.cart-overlay')?.remove();
});

// Event Listener para remover/ajustar quantidade de itens no carrinho
// Usa **delegação de eventos**: o listener é anexado ao contêiner pai (cartItemsContainer),
// e não a cada botão individualmente. Isso é mais eficiente, especialmente para
// itens que são adicionados/removidos dinamicamente.
cartItemsContainer.addEventListener('click', (event) => {
    const target = event.target; // O elemento DOM que foi clicado.
    const productId = target.dataset.id; // Obtém o ID do produto do atributo 'data-id'.

    // Verifica qual tipo de botão foi clicado com base em suas classes.
    if (target.classList.contains('remove-item')) {
        removeItemFromCart(productId); // Chama a função para remover o item.
    } else if (target.classList.contains('increase-quantity')) {
        adjustQuantity(productId, 1); // Chama para aumentar a quantidade em 1.
    } else if (target.classList.contains('decrease-quantity')) {
        adjustQuantity(productId, -1); // Chama para diminuir a quantidade em 1.
    }
});

// Função para criar e gerenciar o overlay (fundo escuro semi-transparente) do carrinho.
function createCartOverlay() {
    let overlay = document.querySelector('.cart-overlay'); // Tenta encontrar um overlay existente.
    if (!overlay) { // Se não houver um overlay existente...
        overlay = document.createElement('div'); // Cria um novo elemento div.
        overlay.classList.add('cart-overlay'); // Adiciona a classe CSS.
        document.body.appendChild(overlay); // Adiciona o overlay ao final do corpo do documento.
        // Adiciona um listener de clique ao overlay: se o usuário clicar fora do carrinho, ele fecha.
        overlay.addEventListener('click', () => {
            cartSidebar.classList.remove('open'); // Fecha a sidebar do carrinho.
            overlay.classList.remove('show'); // Esconde o overlay.
        });
    }
    overlay.classList.add('show'); // Garante que o overlay seja visível (adicionando a classe 'show').
    return overlay; // Retorna o elemento overlay.
}

// Carregar o carrinho do LocalStorage assim que o DOM da página estiver completamente carregado.
document.addEventListener('DOMContentLoaded', loadCart);