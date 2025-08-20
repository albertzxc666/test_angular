import { Component, inject, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { Language } from '../../models/Language.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher-component.html',
  styleUrls: ['./language-switcher-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSwitcherComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly cdr = inject(ChangeDetectorRef);
  
  public readonly availableLanguages = this.languageService.availableLanguages;
  public currentLanguage = this.languageService.getCurrentLanguage(); // Обычное свойство вместо Observable

  ngOnInit(): void {
    // Подписываемся на изменения языка для принудительного обновления UI
    this.languageService.getCurrentLanguage$()
      .pipe(untilDestroyed(this))
      .subscribe((newLanguage) => {
        this.currentLanguage = newLanguage; // Обновляем свойство
        this.cdr.detectChanges(); // Принудительное обновление UI
      });
  }

  public onLanguageChange(language: Language): void {
    this.languageService.setLanguage(language.code);
  }
}
