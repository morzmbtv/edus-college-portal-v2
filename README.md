# EDUS College Portal

EDUS College Portal — кликабельный frontend-only демо-портал для колледжей Казахстана. Проект показывает управление студентами, посещаемостью Face ID, документооборотом, задачами, приёмной комиссией, структурой колледжа, AI-рисками и контролем соответствия.

Это презентационный макет: авторизация демонстрационная, все данные локальные и вымышленные. Backend, база данных, Prisma, API и реальные интеграции не используются. Переменные окружения для запуска и публикации не требуются.

## Технологии

- Next.js 15 и App Router
- React 19
- TypeScript
- Tailwind CSS
- lucide-react
- Recharts

## Demo login

```text
Логин: director@college.kz
Пароль: 123456
```

Авторизация фейковая: данные никуда не отправляются.

## Локальный запуск

Требуется Node.js 20 или новее.

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000). Начальная страница автоматически перенаправит на `/login`.

## Проверка и production-сборка

```bash
npm run lint
npm run build
npm run start
```

После `npm run start` production-версия доступна по адресу [http://localhost:3000](http://localhost:3000).

## Публикация в GitHub

Создайте пустой репозиторий на GitHub, затем выполните из корня проекта:

```bash
git init
git add .
git commit -m "Initial EDUS College Portal demo"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/edus-college-portal-demo.git
git push -u origin main
```

Замените `YOUR_USERNAME` на имя вашего аккаунта GitHub.

## Деплой на Vercel

1. Зайдите на [vercel.com](https://vercel.com) и авторизуйтесь через GitHub.
2. Нажмите **Add New Project**.
3. Выберите репозиторий `edus-college-portal-demo`.
4. Убедитесь, что Framework Preset определён как **Next.js**.
5. Не добавляйте Environment Variables — они проекту не нужны.
6. Нажмите **Deploy**.

Vercel автоматически выполнит `npm install` и `npm run build`. После сборки появится публичная demo-ссылка.

## Ограничения демо

- данные сбрасываются после обновления страницы или новой сессии;
- экспорт файлов, уведомления, смена статусов и интеграции работают только визуально;
- Face ID и AI представлены реалистичными mock-данными;
- проект не хранит и не отправляет персональные данные.
