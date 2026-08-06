# O‘quv Markazi

React frontend va Node.js/Express modular-monolith backend asosidagi o‘quv markazi boshqaruv tizimi. PostgreSQL asosiy baza, Redis cache/rate-limit infratuzilmasi, MinIO esa fayl obyektlari uchun ishlatiladi.

## Modullar

| Modul | Vazifa | Asosiy API |
|---|---|---|
| user | JWT, refresh token, RBAC, profil | `/auth`, `/api/users` |
| payment | yaratish, status, cancel, history, webhook | `/api/payments-v2`, `/webhooks/payment` |
| billing | wallet, atomic transaction, plan, subscription | `/api/billing` |
| storage | MinIO upload/download/list/delete | `/api/storage` |
| chat | conversation, message, read state | `/api/chat` |
| tgbot | `/start`, `/help`, account link, webhook | `/telegram/webhook` |
| notification | tizim xabarlari | `/api/notifications` |
| ops | health, readiness, audit | `/ops` |
| integration | tashqi provider chegarasi | `/api/integrations` |

Mavjud student, teacher, course, group, room va legacy payment API’lari o‘z manzillarida saqlangan. OpenAPI hujjati: `GET /openapi.json`.

## Lokal ishga tushirish

1. `.env.example`ni `.env`ga nusxalang va barcha `change_me` qiymatlarini xavfsiz secretlar bilan almashtiring.
2. `npm.cmd --prefix code/backend install` va `npm.cmd --prefix code/frontend install`.
3. PostgreSQL ishga tushgach: `npm.cmd --prefix code/backend run migrate`, keyin `npm.cmd --prefix code/backend run seed`.
4. Backend: `npm.cmd run backend:start`; frontend: `npm.cmd run frontend:dev`.

Windows PowerShell execution policy `npm.ps1`ni bloklasa `npm.cmd` ishlating.

## Docker

`.env` tayyorlang, keyin `docker compose up --build`. Frontend `http://localhost:8080`, backend `http://localhost:5000`, MinIO console `http://localhost:9001`. PostgreSQL, Redis, MinIO, backend va frontend health-check’lari bor. Backend startup bazani non-destructive sync qiladi va env orqali berilgan demo auth userlarni seed qiladi.

## Migration, seed va test

```text
npm.cmd --prefix code/backend run migrate
npm.cmd --prefix code/backend run seed
npm.cmd --prefix code/backend test
npm.cmd --prefix code/frontend run lint
npm.cmd --prefix code/frontend run build
docker compose config
```

Testlar alohida `TEST_DB_NAME` bazasini yaratadi va faqat o‘sha bazani qayta tiklaydi. Production’da `DB_FORCE_SYNC=true` qat’iy bloklanadi.

## Telegram webhook

BotFather tokenini `TELEGRAM_BOT_TOKEN`, tasodifiy secretni `TELEGRAM_WEBHOOK_SECRET`ga qo‘ying. Telegram webhook URL’i `/telegram/webhook`; `secret_token` aynan shu qiymat bo‘lishi kerak. Token yoki secret repoga yozilmaydi.

## Production

TLS reverse proxy ishlating, `NODE_ENV=production` belgilang, kuchli JWT/database/MinIO/webhook secretlarini secret manager’dan bering, migrationni deploydan oldin bajaring va persistent volume backup’larini sozlang. Default JWT secret va force-sync production’da ishlamaydi.

## Nima qilindi va nima uchun

Backend modulli monolitga ajratildi: har modul route/controller/service/repository/model/DTO chegarasiga ega. Bu hozir sodda deployni saqlaydi, keyinchalik modullarni servisga ajratishni yengillashtiradi. Pul qiymatlari DECIMAL, wallet o‘zgarishi transaction va row lock ichida; webhooklar secret va idempotency bilan, storage esa path traversalga chidamli server-generated key bilan ishlaydi.
