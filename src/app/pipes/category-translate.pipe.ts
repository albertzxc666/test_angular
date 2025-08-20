import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Pipe({
  name: 'categoryTranslate',
  standalone: true,
  pure: false
})
export class CategoryTranslatePipe implements PipeTransform {
  private readonly languageService = inject(LanguageService);

  transform(category: string): string {
    const translationKey = `category.${category.toLowerCase()}`;
    return this.languageService.translate(translationKey);
  }
}
