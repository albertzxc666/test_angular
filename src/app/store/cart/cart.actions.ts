import { createAction, props } from '@ngrx/store';
import { CartItem } from '../../models/CartItem.model';

// Добавить товар в корзину
export const addToCart = createAction(
  '[Cart] Add To Cart',
  props<{ item: CartItem }>()
);

// Удалить товар из корзины
export const removeFromCart = createAction(
  '[Cart] Remove From Cart',
  props<{ itemId: string }>()
);

// Изменить количество товара
export const updateQuantity = createAction(
  '[Cart] Update Quantity',
  props<{ itemId: string; quantity: number }>()
);

// Очистить корзину
export const clearCart = createAction('[Cart] Clear Cart');

// Загрузить корзину из localStorage
export const loadCart = createAction('[Cart] Load Cart');

// Успешная загрузка корзины
export const loadCartSuccess = createAction(
  '[Cart] Load Cart Success',
  props<{ items: CartItem[] }>()
);

// Сохранить корзину в localStorage
export const saveCart = createAction('[Cart] Save Cart');

