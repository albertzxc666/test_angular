import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as CartActions from './cart.actions';
import { selectCartItems } from './cart.selectors';

@Injectable()
export class CartEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  
  // Сохранение корзины в localStorage при любых изменениях
  saveCart$ = createEffect(() => this.actions$.pipe(
    ofType(
      CartActions.addToCart,
      CartActions.removeFromCart,
      CartActions.updateQuantity,
      CartActions.clearCart
    ),
    withLatestFrom(this.store.select(selectCartItems)),
    tap(([action, items]) => {
      localStorage.setItem('cart', JSON.stringify({ items }));
    }),
    map(() => CartActions.saveCart())
  ), { dispatch: false });

  // Загрузка корзины из localStorage при инициализации
  loadCart$ = createEffect(() => this.actions$.pipe(
    ofType(CartActions.loadCart),
    map(() => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        return CartActions.loadCartSuccess({ items: cartData.items || [] });
      }
      return CartActions.loadCartSuccess({ items: [] });
    })
  ));
}
