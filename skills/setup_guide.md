# 🛠️ Loyihani Ishga Tushirish Qo'llanmasi (Setup Guide)

Yangi dasturchi loyihani o'z kompyuterida ishga tushirishi uchun qisqa va tushunarli qadamlar:

## 1. Talab Qilinadigan Dasturlar
- **Node.js**: `v18.x` yoki undan yuqori
- **Paket menejeri**: `npm`

## 2. Muhitni Sozlash (Environment Variables)
Loyihani ishga tushirishdan oldin `.env` faylini to'g'irlash kerak.
1. `/code/backend` va `/code/frontend` papkalariga kiring.
2. Agar `.env.example` bo'lsa, undan nusxa olib, yangi `.env` faylini yarating.
3. Kerakli API kalitlar va Database parollarini foydalanuvchidan so'rab kiriting (hech qachon shaxsiy parollarni yoddan o'ylab topmang).

## 3. Loyihani Ishga Tushirish
Har bir qism alohida terminalda ishga tushiriladi:

**Backend (Server) uchun:**
```bash
cd code/backend
npm install
npm run dev
```

**Frontend (Web) uchun:**
```bash
cd code/frontend
npm install
npm run dev
```

**Mobile uchun:**
```bash
cd code/mobile
npm install
npm start
```

> **Eslatma:** Vazifa berilganda dasturni ishga tushirmasdan turib kod yozishni boshlamang. Avval joriy tizim ishlayotganiga ishonch hosil qiling!
