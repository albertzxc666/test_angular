import { Component, OnInit, ChangeDetectorRef, ViewChild, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/Product.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SearchComponent } from '../search/search-component';
import { CartIconComponent } from '../cartIcon/cart-icon-component';
import { ProductItemComponent } from '../productItem/product-item-component';
import { LanguageSwitcherComponent } from '../languageSwitcher/language-switcher-component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LanguageService } from '../../services/language.service';
import { Store } from '@ngrx/store';
import { CartItem } from '../../models/CartItem.model';
import * as CartActions from '../../store/cart/cart.actions';

@UntilDestroy({ arrayName: 'subscriptions' })
@Component({
  selector: 'app-product-list-component',
  imports: [RouterModule, CommonModule, SearchComponent, CartIconComponent, ProductItemComponent, LanguageSwitcherComponent, TranslatePipe],
  templateUrl: './product-list-component.html',
  styleUrl: './product-list-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  @ViewChild(SearchComponent) searchComponent!: SearchComponent;

  public products: Product[] = [];
  public filteredProducts: Product[] = [];
  public isLoading: boolean = false;
  public isSearching: boolean = false;
  public error: string | null = null;
  public deletingProductId: string | null = null;
  public subscriptions: any[] = [];
  public searchResultsCount: number = 0;
  public currentSearchQuery: string = '';

  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly languageService = inject(LanguageService);

  public ngOnInit(): void {
    this.loadProducts();
    this.setupNavigationListener();
    this.setupQueryParamsListener();
    
    // Подписываемся на изменения языка для обновления UI
    this.languageService.getCurrentLanguage$()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.cdr.detectChanges();
      });
  }

  /**
   * Обработка результатов поиска от компонента поиска
   */
  public onSearchResults(filteredProducts: Product[]): void {
    this.filteredProducts = filteredProducts;
    this.cdr.detectChanges();
  }

  /**
   * Обработка изменения состояния поиска
   */
  public onSearchingChange(isSearching: boolean): void {
    this.isSearching = isSearching;
    this.cdr.detectChanges();
  }

  /**
   * Обработка изменения поискового запроса
   */
  public onSearchQueryChange(query: string): void {
    // Сохраняем текущий поисковый запрос
    this.currentSearchQuery = query;
    
    // Выполняем поиск прямо здесь, без обращения к searchComponent
    const filteredProducts = this.performProductSearch(this.products, query);
    this.filteredProducts = filteredProducts;
    this.searchResultsCount = filteredProducts.length;
    this.cdr.detectChanges();
  }

  /**
   * Выполнение поиска товаров
   */
  private performProductSearch(products: Product[], query: string): Product[] {
    if (!query) {
      return products; // Возвращаем все товары, если запрос пустой
    }

    return products.filter(product => {
      const searchFields = [
        product.title.toLowerCase(),
        product.description.toLowerCase(),
        product.category.toLowerCase(),
        product.price.toString()
      ];

      return searchFields.some(field => field.includes(query.toLowerCase()));
    });
  }

  /**
   * Обработка изменения счетчика результатов поиска
   */
  public onSearchResultsCountChange(count: number): void {
    this.searchResultsCount = count;
    this.cdr.detectChanges();
  }

  /**
   * Инициализация поиска после загрузки товаров
   */
  private initializeSearch(): void {
    if (this.searchComponent) {
      this.searchComponent.initializeSearch(this.products);
    }
  }

  /**
   * Загрузка всех товаров
   */
  public loadProducts(): void {
    this.isLoading = true;
    this.error = null;
    this.cdr.detectChanges();
    
    this.productService.getAllProducts()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.filteredProducts = products; // Инициализируем отфильтрованные товары
          this.searchResultsCount = products.length; // Инициализируем счетчик
          this.isLoading = false;
          this.cdr.detectChanges();
          
          // Инициализируем поиск после загрузки товаров
          setTimeout(() => {
            this.initializeSearch();
          }, 0);
        },
        error: (error) => {
          this.error = error.message || 'Ошибка при загрузке товаров';
          this.isLoading = false;
          console.error('Error loading products:', error);
          this.cdr.detectChanges();
        }
      });
  }

  /**
   * Очистка поиска
   */
  public clearSearch(): void {
    if (this.searchComponent?.clearSearch) {
      this.searchComponent.clearSearch();
    }
    this.currentSearchQuery = '';
    this.filteredProducts = this.products;
    this.searchResultsCount = this.products.length;
    this.cdr.detectChanges();
  }

  /**
   * Проверка, есть ли активный поиск
   */
  public hasActiveSearch(): boolean {
    return !!this.currentSearchQuery;
  }

  /**
   * Получение текущего поискового запроса
   */
  public getCurrentSearchQuery(): string {
    return this.currentSearchQuery;
  }

  /**
   * TrackBy функция для оптимизации ngFor
   */
  public trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  /**
   * Удаление товара
   */
  public onDeleteProduct(productId: string, productTitle: string): void {
    const confirmMessage = this.languageService.translate('product.deleteConfirm', { title: productTitle });
    if (!confirm(confirmMessage)) {
      return;
    }

    this.deletingProductId = productId;
    this.error = null;

    this.productService.deleteProduct(productId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          console.log('Товар удален:', productTitle);
          this.deletingProductId = null;
          // Обновляем список товаров
          this.loadProducts();
        },
        error: (error) => {
          this.error = error.message || 'Ошибка при удалении товара';
          this.deletingProductId = null;
          console.error('Ошибка удаления товара:', error);
        }
      });
  }

  /**
   * Настройка слушателя навигации для обновления списка при возврате
   */
  private setupNavigationListener(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        untilDestroyed(this)
      )
      .subscribe((event: NavigationEnd) => {
        // Обновляем список товаров при возврате на страницу продуктов
        if (event.url === '/products') {
          console.log('Обновляем список товаров после навигации');
          this.loadProducts();
        }
      });
  }

  /**
   * Настройка слушателя query параметров для принудительного обновления
   */
  private setupQueryParamsListener(): void {
    this.route.queryParams
      .pipe(
        distinctUntilChanged(),
        untilDestroyed(this)
      )
      .subscribe(params => {
        if (params['refresh']) {
          console.log('Принудительное обновление списка товаров');
          this.loadProducts();
        }
      });
  }



  public onAddToCart(product: Product): void {
    const cartItem: CartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    };
    
    this.store.dispatch(CartActions.addToCart({ item: cartItem }));
    const message = this.languageService.translate('product.addedToCart');
    alert(message);
  }
}
