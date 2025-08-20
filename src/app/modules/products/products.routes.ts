import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../components/productList/product-list-component').then(c => c.ProductListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('../../components/productForm/product-form-component').then(c => c.ProductFormComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('../../components/productForm/product-form-component').then(c => c.ProductFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('../../components/productDetail/product-detail-component').then(c => c.ProductDetailComponent)
  }
];

