import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../models/Product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;
  private staticDataUrl = '/assets/products.json';
  private products: Product[] = [];

  constructor(private http: HttpClient) { }

  public getAllProducts(): Observable<Product[]> {
    if (environment.useStaticData) {
      return this.http.get<Product[]>(this.staticDataUrl).pipe(
        map(products => {
          this.products = products;
          return products;
        }),
        catchError(this.handleError)
      );
    } else {
      return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
        map(products => {
          this.products = products;
          return products;
        }),
        catchError(this.handleError)
      );
    }
  }

  public getProductById(id: string): Observable<Product> {
    if (environment.useStaticData) {
      // Если данные уже загружены, используем их
      if (this.products.length > 0) {
        const product = this.products.find(p => p.id === id);
        if (product) {
          return of(product);
        } else {
          return throwError(() => new Error(`Товар с ID ${id} не найден`));
        }
      } else {
        // Если данные не загружены, загружаем их и затем ищем товар
        return this.getAllProducts().pipe(
          map(products => {
            const product = products.find(p => p.id === id);
            if (product) {
              return product;
            } else {
              throw new Error(`Товар с ID ${id} не найден`);
            }
          }),
          catchError(this.handleError)
        );
      }
    } else {
      return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
        catchError(this.handleError)
      );
    }
  }

  public createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    if (environment.useStaticData) {
      // В production режиме создание товаров недоступно
      return throwError(() => new Error('Создание товаров недоступно в production режиме'));
    } else {
      return this.http.post<Product>(`${this.apiUrl}/products`, product).pipe(
        catchError(this.handleError)
      );
    }
  }

  public updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    if (environment.useStaticData) {
      // В production режиме редактирование товаров недоступно
      return throwError(() => new Error('Редактирование товаров недоступно в production режиме'));
    } else {
      return this.http.put<Product>(`${this.apiUrl}/products/${id}`, product).pipe(
        catchError(this.handleError)
      );
    }
  }

  public deleteProduct(id: string): Observable<void> {
    if (environment.useStaticData) {
      // В production режиме удаление товаров недоступно
      return throwError(() => new Error('Удаление товаров недоступно в production режиме'));
    } else {
      return this.http.delete<void>(`${this.apiUrl}/products/${id}`).pipe(
        catchError(this.handleError)
      );
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Произошла ошибка при загрузке данных';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Ошибка: ${error.error.message}`;
    } else {
      errorMessage = `Код ошибки: ${error.status}\nСообщение: ${error.message}`;
    }
    
    console.error('Ошибка HTTP запроса:', error);
    return throwError(() => new Error(errorMessage));
  }
}