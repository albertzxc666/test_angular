import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/Product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form-component.html',
  styleUrls: ['./product-form-component.scss']
})
export class ProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  public productForm!: FormGroup;
  public isEditMode = false;
  public productId: string | null = null;
  public isLoading = false;
  public error: string | null = null;

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
    
    // Для тестирования - предзаполняем форму в режиме создания
    if (!this.isEditMode) {
      this.productForm.patchValue({
        title: 'Тестовый товар',
        price: 999.99,
        description: 'Описание тестового товара для демонстрации работы формы',
        image: '/assets/img/mouse.webp',
        category: 'mouse'
      });
    }
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      price: ['', [Validators.required, Validators.min(0.01), Validators.max(999999)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      image: ['', [Validators.pattern('^(/assets/img/.+|)$')]],
      category: ['', [Validators.required]]
    });
  }

            private checkEditMode(): void {
            const id = this.route.snapshot.paramMap.get('id');
            if (id) {
              this.isEditMode = true;
              this.productId = id;
              this.loadProductData();
            }
          }

  private loadProductData(): void {
    if (!this.productId) return;
    
    this.isLoading = true;
    this.error = null;
    
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        // Проверяем и корректируем поле image если нужно
        const formData = { ...product };
        if (formData.image && !formData.image.startsWith('/assets/img/')) {
          formData.image = ''; // Очищаем поле если путь не локальный
        }
        
        this.productForm.patchValue(formData);
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.isLoading = false;
        console.error('Ошибка загрузки товара:', error);
      }
    });
  }

  public onSubmit(): void {
    if (this.productForm.valid) {
      this.isLoading = true;
      this.error = null;
      
      const formData = this.productForm.value;
      
      if (this.isEditMode && this.productId) {
        // Редактирование существующего товара
        this.productService.updateProduct(this.productId, formData).subscribe({
          next: (updatedProduct) => {
            console.log('Товар обновлен:', updatedProduct);
            this.isLoading = false;
            this.router.navigate(['/products']);
          },
          error: (error) => {
            this.error = error.message;
            this.isLoading = false;
            console.error('Ошибка обновления товара:', error);
          }
        });
      } else {
        // Создание нового товара
                 this.productService.createProduct(formData).subscribe({
           next: (newProduct) => {
             console.log('Товар создан:', newProduct);
             this.isLoading = false;
             // Принудительно обновляем список товаров и перенаправляем
             this.router.navigate(['/products'], { queryParams: { refresh: Date.now() } });
           },
          error: (error) => {
            this.error = error.message;
            this.isLoading = false;
            console.error('Ошибка создания товара:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  public onReset(): void {
    this.productForm.reset();
  }

  public onCancel(): void {
    this.router.navigate(['/products']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  public getErrorMessage(controlName: string): string {
    const control = this.productForm.get(controlName);
    
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        if (controlName === 'category') {
          return 'Пожалуйста, выберите категорию товара';
        }
        return 'Это поле обязательно для заполнения';
      }
      if (control.errors['minlength']) {
        return `Минимальная длина: ${control.errors['minlength'].requiredLength} символов`;
      }
      if (control.errors['maxlength']) {
        return `Максимальная длина: ${control.errors['maxlength'].requiredLength} символов`;
      }
      if (control.errors['min']) {
        return `Минимальное значение: ${control.errors['min'].min}`;
      }
      if (control.errors['max']) {
        return `Максимальное значение: ${control.errors['max'].max}`;
      }
      if (control.errors['pattern']) {
        return 'Введите корректный локальный путь (начинается с /assets/img/) или оставьте поле пустым';
      }
    }
    
    return '';
  }
} 