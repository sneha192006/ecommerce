const CART_KEY = 'shopzone-cart';
const CART_COUNT_KEY = 'shopzone-cart-count';

export function readCart() {
  const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  return Array.isArray(cart) ? cart : [];
}

export function getCartCount() {
  return readCart().reduce(
    (count, item) => count + (Number(item.quantity) || 0),
    0
  );
}

export function addProductToCart(product) {
  const cart = readCart();
  const existing = cart.find(item => item.id === product.id);
  const updated = existing
    ? cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: (Number(item.quantity) || 0) + 1 }
          : item
      )
    : [...cart, { ...product, quantity: 1 }];

  saveCart(updated);
}

export function saveCart(cart) {
  const count = cart.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  localStorage.setItem(CART_COUNT_KEY, String(count));
  window.dispatchEvent(new Event('shopzone-cart-updated'));
}
