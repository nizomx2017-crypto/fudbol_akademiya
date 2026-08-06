# Backend arxitekturasi

`code/backend/modules` — modulli monolit. Modul tashqarisi faqat `router.js` yoki `service.js`ni import qiladi; repository va model modulning ichki qatlami.

```text
HTTP -> router -> validation -> controller -> service -> repository -> Sequelize/PostgreSQL
                                      |              -> MinIO / Redis / Telegram adapter
                                      -> AppError -> global error handler
```

## Model aloqalari

```text
AuthUser 1--1 Wallet 1--* WalletTransaction
AuthUser 1--* PaymentOrder
AuthUser 1--* File
Plan 1--* Subscription *--1 AuthUser
Conversation 1--* Message
AuthUser 1--* Notification
AuthUser 1--1 TelegramLink
AuthUser 1--* UserAccess *--1 Access
Course 1--* Student
```

Payment va wallet summalari `NUMERIC(18,2)`. Wallet debit/credit transaction ichida `SELECT ... FOR UPDATE` semantikasidagi Sequelize row lock bilan bajariladi. Payment provider webhook reference’i va client idempotency key unique.

## Qarorlar

- Mikroservis emas: transaction va deploy soddaligi uchun modular monolith.
- PostgreSQL metadata/source of truth; Redis vaqtinchalik cache/session/rate-limit adapteri; MinIO binary obyektlar uchun.
- Production migratsiya alohida deploy bosqichi; `force sync` taqiqlangan.
- Barcha requestlarda request ID, Helmet, allow-list CORS, rate limit, JWT va markaziy error format mavjud.
