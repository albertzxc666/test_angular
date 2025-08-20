# 🚀 Инструкция по деплою на Vercel

## ✅ Что было исправлено

1. **Данные перенесены в статические файлы**
   - `db.json` скопирован в `public/assets/products.json`
   - Данные доступны по URL: `/assets/products.json`

2. **Настроены environments**
   - `src/environments/environment.ts` - для development (localhost:3001)
   - `src/environments/environment.prod.ts` - для production (статические данные)

3. **Обновлен ProductService**
   - Автоматическое переключение между API и статическими данными
   - В production: только чтение данных (CRUD недоступен)
   - В development: полный функционал с JSON-server

## 🔧 Как работает

### Development режим (ng serve)
```typescript
environment = {
  production: false,
  apiUrl: 'http://localhost:3001',
  useStaticData: false  // Использует JSON-server
}
```

### Production режим (ng build --prod)
```typescript
environment = {
  production: true,
  apiUrl: '',
  useStaticData: true  // Использует /assets/products.json
}
```

## 📋 Шаги для деплоя на Vercel

1. **Убедитесь, что все изменения сохранены**
2. **Сделайте commit и push в Git**
3. **В Vercel подключите ваш репозиторий**
4. **Настройте Build Command: `ng build --configuration=production`**
5. **Настройте Output Directory: `dist/hello-world`**

## ⚠️ Ограничения в production

- ❌ Создание новых товаров недоступно
- ❌ Редактирование товаров недоступно  
- ❌ Удаление товаров недоступно
- ✅ Просмотр списка товаров работает
- ✅ Просмотр деталей товара работает
- ✅ Корзина работает полностью
- ✅ Поиск работает
- ✅ Локализация работает

## 🔍 Проверка

После деплоя проверьте:
- [ ] Главная страница загружается
- [ ] Товары отображаются
- [ ] Детали товара открываются
- [ ] Корзина работает
- [ ] Поиск работает
- [ ] Смена языка работает
