import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CartItem } from '../../models/CartItem.model';
import { 
  selectCartItems, 
  selectCartTotal, 
  selectIsCartEmpty 
} from '../../store/cart/cart.selectors';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { CurrencyConvertPipe } from '../../pipes/currency-convert.pipe';
import * as CartActions from '../../store/cart/cart.actions';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, CurrencyConvertPipe],
  templateUrl: './cart-page-component.html',
  styleUrls: ['./cart-page-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartPageComponent {
  private readonly store = inject(Store);
  
  public cartItems$: Observable<CartItem[]> = this.store.select(selectCartItems);
  public cartTotal$: Observable<number> = this.store.select(selectCartTotal);
  public isCartEmpty$: Observable<boolean> = this.store.select(selectIsCartEmpty);

  public onRemoveItem(itemId: string): void {
    this.store.dispatch(CartActions.removeFromCart({ itemId }));
  }

  public onUpdateQuantity(itemId: string, quantity: number): void {
    this.store.dispatch(CartActions.updateQuantity({ itemId, quantity }));
  }

  public onClearCart(): void {
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
      this.store.dispatch(CartActions.clearCart());
    }
  }

  public onCheckout(): void {
    alert('Функция оформления заказа будет реализована позже!');
  }

  /**
   * TrackBy функция для оптимизации ngFor корзины
   */
  public trackByCartItemId(index: number, item: CartItem): string {
    return item.id;
  }

  public onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/img/cover.webp';
  }
}

