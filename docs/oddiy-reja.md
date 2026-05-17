# Futbol Akademiyasi - Oddiy Reja

## Nima Kerak?
Futbol akademiyasini boshqarish uchun oddiy dastur.

## Kimlar Ishlatadi?
- **Admin**: Akademiyani boshqaradi
- **Murabbiy**: Guruhlarga dars beradi
- **O'quvchi**: Mashg'ulotlarga qatnashadi
- **Ota-ona**: Bolasi progressini ko'radi

## Asosiy Funksiyalar

### 1. Foydalanuvchilar
- Ro'yxatdan o'tish
- Login qilish
- Profil ko'rish

### 2. Guruhlar
- Guruh yaratish (U-8, U-10, h.k.)
- O'quvchilarni guruhga qo'shish
- Murabbiy tayinlash

### 3. Mashg'ulotlar
- Jadval yasash
- Davomat belgilash
- Mashg'ulot haqida yozish

### 4. Progress
- Baholash (1-10 ball)
- Statistika ko'rsatish
- Hisobotlar

### 5. To'lovlar
- To'lov qabul qilish
- Kontraktlar
- Hisobotlar

## Texnologiya (oddiy)
- **Backend**: Node.js + Express
- **Frontend**: React
- **Database**: PostgreSQL
- **Mobile**: React Native

## Ishlanish Tartibi

### 1-oy (Asosiy)
- Login/registratsiya
- Foydalanuvchi profillari
- Akademiya yaratish

### 2-oy (Guruhlar)
- Guruhlar yaratish
- O'quvchilar qo'shish
- Murabbiylar tayinlash

### 3-oy (Mashg'ulotlar)
- Jadval yasash
- Davomat
- Oddiy progress

### 4-oy (Mobil)
- Iloqa qilish
- Bildirishnomalar
- Oddiy funksiyalar

### 5-oy (To'lovlar)
- To'lov tizimi
- Hisobotlar
- Test va ishga tushirish

## Kerakli Jadvallar

```sql
users (id, email, password, name, role)
academies (id, name, address)
groups (id, name, academy_id, coach_id)
students (id, user_id, group_id)
sessions (id, group_id, date, time)
attendance (id, session_id, student_id, status)
payments (id, student_id, amount, date)
```

## Narx (taxminan)
- Dasturchilar: 3-4 kishi
- Vaqt: 5-6 oy
- Byudjet: $150,000-200,000

## Nimalar Qilish Kerak Emas?
- Murakkab AI
- Video analiz
- Ko'p tilga tarjima
- Juda ko'p reportlar

## Qisqa Reja
1. Platformani qurish (2 oy)
2. Guruhlarni qo'shish (1 oy)  
3. Mobil ilova (1 oy)
4. To'lovlar va test (1 oy)
5. Ishga tushirish

---

Bu oddiy reja - katta tizim emas, asosiy funksiyalar bilan.
