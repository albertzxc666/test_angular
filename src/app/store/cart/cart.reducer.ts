import { createReducer, on } from '@ngrx/store';
import { CartState, initialState } from './cart.state';
import * as CartActions from './cart.actions';

export const cartReducer = createReducer(
  initialState,
  
  on(CartActions.addToCart, (state, { item }) => {
    const existingItem = state.items.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      // Если товар уже есть в корзине, увеличиваем количество
      return {
        ...state,
        items: state.items.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        )
      };
    } else {
      // Если товара нет, добавляем новый
      return {
        ...state,
        items: [...state.items, item]
      };
    }
  }),

  on(CartActions.removeFromCart, (state, { itemId }) => ({
    ...state,
    items: state.items.filter(item => item.id !== itemId)
  })),

  on(CartActions.updateQuantity, (state, { itemId, quantity }) => ({
    ...state,
    items: state.items.map(item =>
      item.id === itemId
        ? { ...item, quantity: Math.max(1, quantity) } // Минимум 1
        : item
    )
  })),

  on(CartActions.clearCart, (state) => ({
    ...state,
    items: []
  })),

  on(CartActions.loadCart, (state) => ({
    ...state,
    loading: true
  })),

  on(CartActions.loadCartSuccess, (state, { items }) => ({
    ...state,
    items,
    loading: false
  })),

  on(CartActions.saveCart, (state) => ({
    ...state,
    loading: false
  }))
);

