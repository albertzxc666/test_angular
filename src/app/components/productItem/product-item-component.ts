import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/Product.model';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { CategoryTranslatePipe } from '../../pipes/category-translate.pipe';
import { DescriptionTranslatePipe } from '../../pipes/description-translate.pipe';
import { CurrencyConvertPipe } from '../../pipes/currency-convert.pipe';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, RouterModule, TruncatePipe, TranslatePipe, CategoryTranslatePipe, DescriptionTranslatePipe, CurrencyConvertPipe],
  templateUrl: './product-item-component.html',
  styleUrls: ['./product-item-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductItemComponent implements OnInit, OnDestroy {
  @Input() product!: Product;
  @Input() deletingProductId: string | null = null;
  
  @Output() addToCart = new EventEmitter<Product>();
  @Output() deleteProduct = new EventEmitter<{productId: string, productTitle: string}>();

  private readonly languageService = inject(LanguageService);
  private readonly cdr = inject(ChangeDetectorRef);
  private languageSubscription?: Subscription;

  public ngOnInit(): void {
    // Подписываемся на изменения языка для обновления UI
    this.languageSubscription = this.languageService.getCurrentLanguage$().subscribe(() => {
      this.cdr.markForCheck(); // Используем markForCheck с OnPush
    });
  }

  public ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  public onAddToCart(): void {
    this.addToCart.emit(this.product);
  }

  public onDeleteProduct(): void {
    this.deleteProduct.emit({
      productId: this.product.id,
      productTitle: this.product.title
    });
  }

  public onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/img/cover.webp';
  }

  public onImageLoad(event: Event): void {
    // Изображение загружено успешно
  }
}
