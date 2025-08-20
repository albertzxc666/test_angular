import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Language } from '../models/Language.model';
import { TranslationParams } from '../models/Translation.model';
import { AVAILABLE_LANGUAGES, TRANSLATIONS } from '../consts/language.const';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly currentLanguage$ = new BehaviorSubject<string>('ru');
  
  public readonly availableLanguages: Language[] = AVAILABLE_LANGUAGES;
  public readonly translations = TRANSLATIONS;

  public getCurrentLanguage(): string {
    return this.currentLanguage$.value;
  }

  public getCurrentLanguage$() {
    return this.currentLanguage$.asObservable();
  }

  public setLanguage(languageCode: string): void {
    if (this.availableLanguages.some(lang => lang.code === languageCode)) {
      // Проверяем, действительно ли язык изменился
      if (this.currentLanguage$.value !== languageCode) {
        this.currentLanguage$.next(languageCode);
        localStorage.setItem('preferredLanguage', languageCode);
      }
    }
  }

  public translate(key: string, params?: TranslationParams): string {
    const currentLang = this.getCurrentLanguage();
    let translation = this.translations[currentLang]?.[key] || key;
    
    if (params) {
      Object.keys(params).forEach(paramKey => {
        translation = translation.replace(`{${paramKey}}`, String(params[paramKey]));
      });
    }
    
    return translation;
  }

  public initializeLanguage(): void {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && this.availableLanguages.some(lang => lang.code === savedLanguage)) {
      this.setLanguage(savedLanguage);
    } else {
      this.setLanguage('ru'); // По умолчанию русский
    }
  }
}
