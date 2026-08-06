# O‘quv Markazi repository qo‘llanmasi

## Tuzilma

- `code/backend`: Node.js/Express/Sequelize modular monolith.
- `code/backend/modules/<name>`: router, controller, service, repository, model, DTO, test va README.
- `code/frontend`: React/Vite ilova.
- `docs`: arxitektura va reja; `vazifalar`: ish tracking.

## Buyruqlar

- Backend test/check: `npm.cmd --prefix code/backend test`, `npm.cmd --prefix code/backend run check`.
- Frontend: `npm.cmd --prefix code/frontend run lint`, `npm.cmd --prefix code/frontend run build`.
- DB: `npm.cmd --prefix code/backend run migrate`, `npm.cmd --prefix code/backend run seed`.
- Stack: `docker compose up --build`; config tekshiruv: `docker compose config`.

## Standartlar

Lowercase papka/import nomlari; controller’da biznes logika yo‘q; service modul public interface’i; repository DB’ni boshqaradi. Request DTO validationdan o‘tadi. Pul uchun DECIMAL ishlatiladi. Token, parol va shaxsiy ma’lumot log qilinmaydi. `.env` commit qilinmaydi. Modul ichki faylini boshqa modul to‘g‘ridan-to‘g‘ri import qilmaydi.

## Done mezoni

Kod real endpoint va persistence’ga ega; migration/seed yangilangan; auth va xato holatlari testlangan; backend test/check, frontend lint/build va Docker config o‘tgan; README/OpenAPI yangilangan; mavjud funksiyalar regressiyasiz.
