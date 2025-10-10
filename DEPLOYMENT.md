# Развертывание на GitHub Pages

## Автоматическое развертывание

Проект настроен для автоматического развертывания на GitHub Pages при каждом push в ветку `main`.

### Шаги для настройки:

1. **Создайте репозиторий на GitHub** (если еще не создан)
2. **Загрузите код в репозиторий:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/mobilon-dev/chotto-0.3-demo.git
   git push -u origin main
   ```

3. **Включите GitHub Pages в настройках репозитория:**
   - Перейдите в Settings → Pages
   - В разделе "Source" выберите "GitHub Actions"
   - Сохраните настройки

4. **Дождитесь завершения первого деплоя:**
   - Перейдите во вкладку "Actions" в вашем репозитории
   - Дождитесь завершения workflow "Deploy to GitHub Pages"
   - После успешного завершения ваш сайт будет доступен по адресу:
     `https://mobilon-dev.github.io/chotto-0.3-demo/`

## Ручное развертывание

Если вы хотите развернуть проект вручную:

```bash
# Установите зависимости
npm install

# Соберите проект
npm run build

# Разверните на GitHub Pages
npm run deploy
```

## Настройка базового пути

В файле `vite.config.js` уже настроен правильный базовый путь для размещения в подпапке:

```javascript
export default defineConfig({
  base: '/chotto-0.3-demo/',  // Путь к подпапке на mobilon-dev.github.io
  plugins: [vue()],
})
```

Это означает, что ваш Vue.js проект будет доступен по адресу `https://mobilon-dev.github.io/chotto-0.3-demo/`

## Устранение проблем

- Убедитесь, что в настройках репозитория включен GitHub Pages
- Проверьте, что workflow выполняется успешно во вкладке Actions
- Если сайт не отображается корректно, проверьте консоль браузера на наличие ошибок
