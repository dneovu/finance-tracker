# 💰 Трекер финансов

Приложение для учёта личных финансов. Позволяет добавлять расходы и доходы, управлять категориями, бюджетами и напоминаниями.

---

## Возможности
- Регистрация и авторизация пользователей
- Добавление друзей, создание общих напоминаний
- Управление транзакциями и бюджетами
- Управление категориями расходов и доходов
- Фильтрация по диапазону дат   

---

## Технологии
### Frontend
- React (TypeScript, Vite)
- React Router
- TailwindCSS

### Backend
- Flask  
- PostgreSQL

### Code quality
- ESLint
- Prettier

### Инфраструктура
- Vercel (деплой фронтенда) 
- Render (деплой бэкенда)  
- NeonDB

---

## Локальный запуск
```bash
git clone https://github.com/dneovu/finance-tracker.git

# backend
cd finance-tracker/backend
pip install -r requirements.txt
python -m flask --app project:app run --debug

# frontend
cd finance-tracker/frontend
npm install
npm run dev
```

## Демо
[Vercel](https://finance-tracker-xi-gray.vercel.app/)

Приложение развернуто на бесплатном тарифе Render/NeonDB.  
При первом открытии может потребоваться 20-30 секунд для запуска сервера.
