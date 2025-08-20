import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.state';

export const selectCartState = createFeatureSelector<CartState>('cart');

// Все товары в корзине
export const selectCartItems = createSelector(
  selectCartState,
  (state: CartState) => state.items
);

// Количество товаров в корзине
export const selectCartItemsCount = createSelector(
  selectCartItems,
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);

// Общая сумма корзины
export const selectCartTotal = createSelector(
  selectCartItems,
  (items) => items.reduce((total, item) => total + (item.price * item.quantity), 0)
);

// Проверка, пуста ли корзина
export const selectIsCartEmpty = createSelector(
  selectCartItems,
  (items) => items.length === 0
);

// Получить конкретный товар из корзины
export const selectCartItemById = (itemId: string) => createSelector(
  selectCartItems,
  (items) => items.find(item => item.id === itemId)
);

