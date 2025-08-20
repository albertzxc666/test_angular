import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Pipe({
  name: 'currencyConvert',
  standalone: true,
  pure: false
})
export class CurrencyConvertPipe implements PipeTransform {
  private readonly languageService = inject(LanguageService);
  private readonly exchangeRate = 80; // 1 USD = 80 RUB

  transform(priceInRubles: number): { amount: number; currency: string; symbol: string } {
    const currentLanguage = this.languageService.getCurrentLanguage();
    
    if (currentLanguage === 'en') {
      // Конвертируем в доллары
      const amountInUSD = priceInRubles / this.exchangeRate;
      return {
        amount: Math.round(amountInUSD * 100) / 100, // Округляем до 2 знаков после запятой
        currency: 'USD',
        symbol: '$'
      };
    } else {
      // Оставляем в рублях
      return {
        amount: priceInRubles,
        currency: 'RUB',
        symbol: '₽'
      };
    }
  }
}
