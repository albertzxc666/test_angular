import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header-component';
import { Store } from '@ngrx/store';
import { LanguageService } from './services/language.service';
import * as CartActions from './store/cart/cart.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  private readonly store = inject(Store);
  private readonly languageService = inject(LanguageService);

  constructor() {
    // Загружаем корзину из localStorage при инициализации приложения
    this.store.dispatch(CartActions.loadCart());
    // Инициализируем язык
    this.languageService.initializeLanguage();
  }
}
