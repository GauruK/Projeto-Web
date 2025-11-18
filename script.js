const cartbtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const closeModalBtn = document.getElementById('close-modal-btn')
const checkoutBtn = document.getElementById('checkout-btn')
const cartCount = document.getElementById('cart-count')
const AddressInput = document.getElementById('address-input')
const cartFooter = document.querySelector('footer.cart-footer')
let cart = []

// Abrir modal carrinho
cartbtn.addEventListener('click', function () {
  updateCartModal()
  cartModal.style.display = 'flex'
  if (cartFooter) {
    cartFooter.classList.add('cart-footer-active')
  }
})

// Fechar modal carrinho clicando fora
cartModal.addEventListener('click', function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = 'none'
    document.body.style.overflow = 'auto'
    if (cartFooter) {
      cartFooter.classList.remove('cart-footer-active')
    }
  }
})

//fechar modal clickando no fechar
closeModalBtn.addEventListener('click', function () {
  updateCartModal()
  cartModal.style.display = 'none'
  document.body.style.overflow = 'auto'
  if (cartFooter) {
    cartFooter.classList.remove('cart-footer-active')
  }
})

// Fechar com a tecla ESC
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    cartModal.style.display = 'none'
    document.body.style.overflow = 'auto'
    if (cartFooter) {
      cartFooter.classList.remove('cart-footer-active')
    }
  }
})

// Adicionar item ao carrinho (funciona em todos os botoes do cardapio)
document.addEventListener('click', function (event) {
  const button = event.target.closest('button[data-name][data-price]')
  if (!button) return

  const name = button.getAttribute('data-name')
  const price = parseFloat(button.getAttribute('data-price'))
  addToCart(name, price)
})

//função adicionar ao carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name)
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ name, price, quantity: 1 })
  }
  updateCartModal()
}

//função atualizar carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = ''
  let total = 0

  cart.forEach((item) => {
    const cartItemElement = document.createElement('div')
    cartItemElement.classList.add(
      'flex',
      'items-center',
      'justify-between',
      'mb-4',
      'w-full',
      'gap-4'
    )

    cartItemElement.innerHTML = `
      <div>
        <p class="font-bold">${item.name}</p>
        <p class="flex items-center gap-2">Qtd: ${item.quantity}
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-0.5 rounded text-xs"
            onclick="incrementCartItem('${item.name}')"
          >
            +
          </button>
        </p>
        <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
          onclick="removeFromCart('${item.name}')"
        >
          Remover
        </button>
      </div>
    `
    cartItemsContainer.appendChild(cartItemElement)
    total += item.price * item.quantity
  })

  cartTotal.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  cartCount.innerHTML = cart.length
}

//função remover item do carrinho
function removeFromCart(name) {
  cart = cart.filter((item) => item.name !== name)
  updateCartModal()
}

function incrementCartItem(name) {
  const item = cart.find((item) => item.name === name)
  if (!item) return
  item.quantity += 1
  updateCartModal()
}

//função para remover
cartItemsContainer.addEventListener('click', function (event) {
  const button = event.target.closest('button.removeFromCart')
  if (!button) return

  const name = button.getAttribute('data-name')
  removeFromCart(name)

  function removeItemCart(name) {
    const index = cart.findIndex((item) => item.name === name)
    if (index !== -1) {
      item.quantity > 1
      item.quantity -= 0
      updateCartModal()
      return
    }
    cart.splice(index, 1)
    updateCartModal()
  }
})

// Verificar a hora e manipular o card horario
function checkRestaurantOpen() {
  const data = new Date()
  const hora = data.getHours()
  return hora >= 18 && hora < 22
  // true = restaurante está aberto
}

const spanItem = document.getElementById('date-span')
const isOpen = checkRestaurantOpen()

if (isOpen) {
  spanItem.classList.remove('bg-red-500')
  spanItem.classList.add('bg-green-600')
} else {
  spanItem.classList.remove('bg-green-600')
  spanItem.classList.add('bg-red-500')
}

checkoutBtn.addEventListener('click', function () {
  if (cart.length === 0) {
    alert('Seu carrinho está vazio.')
    return
  }

  if (!checkRestaurantOpen()) {
    alert('O restaurante está fechado no momento.')
    return
  }

  let total = 0
  let resumo = 'Seu pedido:\n\n'

  cart.forEach((item) => {
    total += item.price * item.quantity
    resumo += `${item.quantity}x ${item.name} - R$ ${item.price.toFixed(2)}\n`
  })

  resumo += `\nTotal: R$ ${total.toFixed(2)}`

  alert(resumo)

  cart = []
  updateCartModal()
  cartModal.style.display = 'none'
  document.body.style.overflow = 'auto'
  if (cartFooter) {
    cartFooter.classList.remove('cart-footer-active')
  }
})
