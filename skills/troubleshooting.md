# 🛠️ Xatoliklarni Mustaqil Hal Qilish (Troubleshooting)

Ish jarayonida xatolik chiqsa vahimaga tushmang. Quyida eng ko'p uchrash ehtimoli bor xatolar va ularning yechimlari keltirilgan:

## 1. Port Band Xatosi (Port is already in use)
- **Xatolik:** `EADDRINUSE: address already in use :::3000` (yoki boshqa raqam)
- **Sababi va Yechim:** Sizda ushbu portda oldingi server o'chmay qolgan yoki boshqa dastur band qilyapti. Terminalda serverni majburan to'xtating (`Ctrl + C` bosib) yoki `.env` da boshqa port raqamini belgilang.

## 2. Kutubxona Topilmadi (Module not found)
- **Xatolik:** `Error: Cannot find module 'express'` yoki shunga o'xshash nomlar.
- **Sababi va Yechim:** Dasturga kerakli paketlar o'rnatilmagan. O'sha papkaning ichiga kirib (masalan `cd code/backend`), terminalda `npm install` komandasini yozib yuboring.

## 3. Database ulanmadi (Connection Refused)
- **Xatolik:** `MongoNetworkError` yoki baza ulanishini rad etishi.
- **Sababi va Yechim:** `.env` fayli yo'q yoki ichidagi URL manzil xato. Parollar va URL manzilini tekshiring, mahalliy baza ishga tushganiga ishonch hosil qiling.

> **Muhim Qoida:** O'zingiz umuman tushunmagan, mantiqsizdek ko'ringan katta xatolik (error) chiqsa, o'zboshimchalik bilan loyiha kodining asosiy arxitekturasini o'zgartirib xatoni yashirishga urinmang. Darhol foydalanuvchiga muammo sababini tushuntirib xabar bering.
