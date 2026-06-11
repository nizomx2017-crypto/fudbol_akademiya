# O'quv Markazi - Oddiy Reja

## Nima Kerak?
O'quv markazini boshqarish uchun oddiy va samarali platforma.

## Kimlar Ishlatadi?
- **Admin**: Markaz faoliyatini boshqaradi
- **O'qituvchi**: Kurs va darslarni olib boradi
- **O'quvchi**: Darslarda qatnashadi
- **Ota-ona**: Farzandining o'qishini kuzatadi

## Asosiy Funksiyalar

### 1. Foydalanuvchilar
- Ro'yxatdan o'tish
- Login qilish
- Profil ko'rish

### 2. Kurslar
- Kurs yaratish va boshqarish
- O'quvchilarni kursga qo'shish
- O'qituvchi tayinlash

### 3. Darslar
- Jadval yaratish
- Davomat belgilash
- Dars haqida eslatmalar

### 4. Progress
- Baholash va ballar
- Statistika ko'rsatish
- Hisobotlar

### 5. To'lovlar
- To'lov qabul qilish
- Faktura va kvitansiyalar
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
- Markaz va kurs tuzilmasi

### 2-oy (Kurslar)
- Kurslar yaratish
- O'quvchilar qo'shish
- O'qituvchilarni tayinlash

### 3-oy (Darslar)
- Jadval yaratish
- Davomat
- Progress hisobotlari

### 4-oy (Mobil)
- Aloqa va bildirishnomalar
- Kurs va darslar uchun mobil interfeys
- Foydalanuvchi xabarnomalari

### 5-oy (To'lovlar)
- To'lov tizimi
- Hisobotlar
- Test va ishga tushirish

## Kerakli Jadvallar

```sql
users (id, email, password, name, role)
centers (id, name, address)
courses (id, name, center_id, teacher_id)
students (id, user_id, course_id)
lessons (id, course_id, date, time)
attendance (id, lesson_id, student_id, status)
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
2. Kurslarni qo'shish (1 oy)
3. Mobil ilova (1 oy)
4. To'lovlar va test (1 oy)
5. Ishga tushirish

---

Bu oddiy reja - kichik o'quv markazi uchun asosiy funksiyalar bilan.
