# Angular Hello World - Магазин компьютерной периферии

## Описание проекта

Это Angular приложение для отображения товаров компьютерной периферии с возможностью поиска и фильтрации. Все цены отображаются в рублях.

## Технологии

- **Angular 20** - основной фреймворк
- **TypeScript** - язык программирования
- **RxJS** - реактивное программирование
- **JSON Server** - локальный REST API
- **SCSS** - стилизация с использованием БЭМ методологии

## Структура проекта

```
src/
├── app/
│   ├── components/
│   │   ├── greeting/
│   │   ├── header/
│   │   ├── productList/
│   │   └── productDetail/
│   ├── services/
│   │   └── product.service.ts
│   ├── models/
│   │   └── Product.model.ts
│   └── app.config.ts
├── assets/
│   ├── fonts/
│   └── img/
└── styles.scss
```

## API

Проект использует **локальный JSON Server API** для получения данных о товарах.

### Запуск API сервера

```bash
npm run api
```

API будет доступен по адресу: `http://localhost:3001`

### Endpoints

- `GET /products` - получение всех товаров
- `GET /products/:id` - получение товара по ID

### Структура данных

```typescript
interface Product {
  id: number;
  title: string;
  price: number; // Цена в рублях
  description: string;
  category: string; // Категория товара (mouse, keyboard, headphones, etc.)
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}
```

## Функциональность

### ✅ Реализованные возможности

1. **Сервисы и Dependency Injection**
   - `ProductService` для работы с данными
   - Инжектирование сервисов в компоненты

2. **HTTP Client и RxJS**
   - Асинхронная загрузка данных
   - Обработка ошибок
   - Использование Observables

3. **Поиск и фильтрация**
   - Поиск в реальном времени
   - RxJS операторы: `debounceTime`, `distinctUntilChanged`, `switchMap`
   - Индикатор загрузки поиска

4. **UI/UX**
   - Адаптивный дизайн
   - Шрифт Minecraft
   - Анимации и переходы
   - Состояния загрузки и ошибок
   - Отображение цен в рублях

### 🔧 Ключевые особенности

- **БЭМ методология** в CSS
- **Reactive Forms** для поиска
- **Change Detection** для обновления UI
- **Error Handling** для HTTP запросов
- **Responsive Design** для всех устройств
- **Рубли** - все цены отображаются в рублях

## Запуск проекта

1. **Установка зависимостей:**
   ```bash
   npm install
   ```

2. **Запуск API сервера:**
   ```bash
   npm run api
   ```

3. **Запуск Angular приложения:**
   ```bash
   npm start
   ```

4. **Открыть в браузере:**
   ```
   http://localhost:4200
   ```

## Команды разработки

- `npm start` - запуск dev сервера
- `npm run api` - запуск JSON Server API
- `npm run build` - сборка проекта
- `npm test` - запуск тестов

## Преимущества собственного API

✅ **Полный контроль** над данными и структурой  
✅ **Надёжные изображения** - используются локальные файлы  
✅ **Быстрая работа** - нет внешних зависимостей  
✅ **Простота разработки** - легко добавлять новые товары  
✅ **Нет CORS проблем** - локальный сервер  
✅ **Рубли** - цены в российской валюте
