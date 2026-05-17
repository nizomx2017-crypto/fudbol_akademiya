# 📝 Kod Yozish Standartlari (Coding Standards)

Loyiha toza va o'qishli bo'lishi uchun quyidagi kod yozish qoidalariga qat'iy amal qilinishi shart:

## 1. Nomlash Qoidalari (Naming Conventions)
- **O'zgaruvchilar va Funksiyalar**: Faqat `camelCase` ishlatiladi (masalan: `getUserData`, `playerScore`).
- **Komponentlar (React/Mobile)**: `PascalCase` ishlatiladi (masalan: `PlayerCard.jsx`, `Header.tsx`).
- **Fayl nomlari**:
  - React/UI komponentlar uchun: `PascalCase.jsx` yoki `.tsx`
  - Oddiy yordamchi funksiyalar (utils, xizmatlar): `camelCase.js` yoki `kebab-case.js`.

## 2. Kod Tozaligi (Clean Code)
- Bitta funksiya faqat bitta aniq ishni bajarishi kerak. Funksiyani uzaytirib yubormang.
- Yozilayotgan kod iloji boricha qayta ishlatilishi mumkin (reusable) bo'lishi kerak. Takrorlanuvchi kodlarni (copy-paste) yozmang.
- Logika murakkab bo'lgan joylarga albatta qisqa va tushunarli **izohlar (comments)** qoldiring.

## 3. Fayl va Ma'lumotlarni Ajratish
- Logika (API zaproslar, hisob-kitoblar) va vizual interfeyslarni (UI) alohida fayllarda saqlang.
- Katta kodni doim kichik, boshqarish oson bo'lgan bo'laklarga ajrating.
