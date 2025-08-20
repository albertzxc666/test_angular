import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCartItemsCount } from '../../store/cart/cart.selectors';

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-icon-component.html',
  styleUrls: ['./cart-icon-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartIconComponent {
  private readonly store = inject(Store);
  
  public cartItemsCount$: Observable<number> = this.store.select(selectCartItemsCount);
}
