/* ================================================
   main.js — LojaPC
   1. Carrinho (abrir, fechar, adicionar, remover)
   2. Slider de preço
   3. Tags de marca
   4. Sidebar ativo
   5. Limpar filtros
   6. Inicialização
================================================ */


/* ------------------------------------------------
   1. CARRINHO DE COMPRAS
   - cartItems: array que guarda os produtos
   - openCart / closeCart: controlam o modal
   - addToCart: adiciona produto vindo do botão
   - removeFromCart: remove pelo índice
   - renderCart: redesenha a lista no modal
------------------------------------------------ */

// Array que armazena os itens do carrinho
let cartItems = [];

/** Abre o painel lateral do carrinho */
function openCart() {
  document.getElementById('cartModal').classList.add('active');
  document.getElementById('cartOverlay').classList.add('active');
  document.body.style.overflow = 'hidden'; // impede rolar a página de fundo
}

/** Fecha o painel lateral do carrinho */
function closeCart() {
  document.getElementById('cartModal').classList.remove('active');
  document.getElementById('cartOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

/**
 * addToCart(button)
 * Lê o nome e preço do card pai (data-name, data-price)
 * e adiciona no array cartItems, depois atualiza o visual.
 */
function addToCart(button) {
  // Sobe até o .product-card para pegar os dados
  const card  = button.closest('.product-card');
  const name  = card.dataset.name;
  const price = parseInt(card.dataset.price);

  // Adiciona o produto no array
  cartItems.push({ name, price });

  // Atualiza badge do header
  const badge = document.getElementById('cartBadge');
  badge.textContent = cartItems.length;

  // Animação no badge
  badge.style.transform = 'scale(1.5)';
  setTimeout(() => {
    badge.style.transform = 'scale(1)';
    badge.style.transition = 'transform 0.2s';
  }, 200);

  // Muda botão para "Adicionado ✓"
  button.textContent = 'Adicionado ✓';
  button.classList.add('added');
  button.disabled = true;

  // Re-renderiza a lista do carrinho
  renderCart();

  // Abre o carrinho automaticamente para mostrar o item
  openCart();
}

/**
 * removeFromCart(index)
 * Remove o item do array pelo índice e atualiza tudo.
 * Se o produto for removido, habilita o botão "Comprar" de volta.
 */
function removeFromCart(index) {
  const removedName = cartItems[index].name;
  cartItems.splice(index, 1); // remove 1 item na posição index

  // Atualiza badge
  document.getElementById('cartBadge').textContent = cartItems.length;

  // Reabilita o botão "Comprar" do produto removido
  document.querySelectorAll('.product-card').forEach(function(card) {
    if (card.dataset.name === removedName) {
      const btn = card.querySelector('.btn-buy');
      btn.textContent = 'Comprar';
      btn.classList.remove('added');
      btn.disabled = false;
    }
  });

  renderCart();
}

/**
 * renderCart()
 * Limpa e reconstrói a lista de itens no modal do carrinho.
 * Também recalcula o total.
 */
function renderCart() {
  const container = document.getElementById('cartItems');
  const emptyMsg  = document.getElementById('cartEmpty');
  const totalEl   = document.getElementById('cartTotal');

  // Remove todos os cart-item existentes (mantém o cart-empty)
  container.querySelectorAll('.cart-item').forEach(el => el.remove());

  if (cartItems.length === 0) {
    // Mostra mensagem de vazio
    emptyMsg.style.display = 'flex';
    totalEl.textContent = 'R$ 0,00';
    return;
  }

  // Esconde mensagem de vazio
  emptyMsg.style.display = 'none';

  // Cria um elemento HTML para cada item
  cartItems.forEach(function(item, index) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <span class="cart-item__name">${item.name}</span>
      <span class="cart-item__price">R$ ${item.price.toLocaleString('pt-BR')}</span>
      <button class="cart-item__remove" onclick="removeFromCart(${index})">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;
    container.appendChild(div);
  });

  // Calcula o total somando todos os preços
  const total = cartItems.reduce(function(acc, item) {
    return acc + item.price;
  }, 0);

  totalEl.textContent = 'R$ ' + total.toLocaleString('pt-BR') + ',00';
}


/* ------------------------------------------------
   2. SLIDER DE PREÇO
------------------------------------------------ */
function initPriceSlider() {
  const slider  = document.getElementById('priceRange');
  const display = document.getElementById('priceVal');
  if (!slider || !display) return;

  slider.addEventListener('input', function () {
    const value = parseInt(this.value);
    const pct   = (value / parseInt(this.max)) * 100;
    display.textContent = 'R$ ' + value.toLocaleString('pt-BR');
    this.style.background =
      `linear-gradient(to right, var(--red) ${pct}%, #333 ${pct}%)`;
  });
}


/* ------------------------------------------------
   3. TAGS DE MARCA
------------------------------------------------ */
function initBrandTags() {
  document.querySelectorAll('.tag').forEach(function(tag) {
    tag.addEventListener('click', function() {
      this.classList.toggle('tag--active');
    });
  });
}


/* ------------------------------------------------
   4. SIDEBAR — ITEM ATIVO
------------------------------------------------ */
function initSidebarMenu() {
  const items = document.querySelectorAll('.sidebar__item');
  items.forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      items.forEach(i => i.classList.remove('sidebar__item--active'));
      this.classList.add('sidebar__item--active');
    });
  });
}


/* ------------------------------------------------
   5. LIMPAR FILTROS
------------------------------------------------ */
function initClearFilters() {
  const btn = document.querySelector('.btn-clear');
  if (!btn) return;
  btn.addEventListener('click', function() {
    const slider  = document.getElementById('priceRange');
    const display = document.getElementById('priceVal');
    if (slider && display) {
      slider.value = 6000;
      display.textContent = 'R$ 6.000';
      slider.style.background = 'linear-gradient(to right, var(--red) 50%, #333 50%)';
    }
    document.querySelectorAll('.tag').forEach(t => t.classList.remove('tag--active'));
  });
}


/* ------------------------------------------------
   6. INICIALIZAÇÃO
------------------------------------------------ */
document.addEventListener('DOMContentLoaded', function() {
  initPriceSlider();
  initBrandTags();
  initSidebarMenu();
  initClearFilters();
  console.log('LojaPC carregado!');
});
