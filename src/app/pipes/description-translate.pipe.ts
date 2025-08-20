import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Pipe({
  name: 'descriptionTranslate',
  standalone: true,
  pure: false
})
export class DescriptionTranslatePipe implements PipeTransform {
  private readonly languageService = inject(LanguageService);

  transform(title: string): string {
    // Преобразуем название товара в ключ для перевода
    const key = title.toLowerCase().replace(/\s+/g, '-');
    const translationKey = `description.${key}`;
    const translation = this.languageService.translate(translationKey);
    
    // Если перевод не найден, возвращаем оригинальное описание
    return translation !== translationKey ? translation : '';
  }
}
