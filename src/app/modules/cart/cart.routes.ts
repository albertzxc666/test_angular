import { Routes } from '@angular/router';

export const CART_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../components/cartPage/cart-page-component').then(c => c.CartPageComponent)
  }
];

