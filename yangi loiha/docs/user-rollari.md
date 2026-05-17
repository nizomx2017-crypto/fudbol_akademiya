# Futbol Akademiyasi - User Rollari va Huquqlari

## Rollar

### 1. Super Admin
- **Kim?**: Tizim egasi
- **Nima qiladi?**: Butun tizimni boshqaradi
- **Huquqlari**:
  - Akademiyalarni yaratish/o'chirish
  - Barcha foydalanuvchilarni ko'rish
  - Tizim sozlamalari
  - Moliyaviy hisobotlar

### 2. Academy Admin
- **Kim?**: Akademiya direktori/menejeri
- **Nima qiladi?**: O'z akademiyasini boshqaradi
- **Huquqlari**:
  - Guruhlarni yaratish
  - Murabbiylarni ishga olish
  - O'quvchilarni qabul qilish
  - To'lovlarni boshqarish
  - O'z akademiyasi hisobotlari

### 3. Coach (Murabbiy)
- **Kim?**: Murabbiy
- **Nima qiladi?**: Guruhlarga dars beradi
- **Huquqlari**:
  - Mashg'ulotlar rejalashtirish
  - Davomat belgilash
  - Baholash qilish
  - O'z guruhlari progressi
  - O'quvchilarga vazifa berish

### 4. Student (O'quvchi)
- **Kim?**: Futbolchi
- **Nima qiladi?**: Mashg'ulotlarda qatnashadi
- **Huquqlari**:
  - O'z profilini ko'rish
  - Jadvalni ko'rish
  - O'z progressini ko'rish
  - Mashg'ulotlarga yozilish
  - Vazifalarni ko'rish

### 5. Parent (Ota-ona)
- **Kim?**: O'quvchi ota-onasi
- **Nima qiladi?**: Bolasi progressini kuzatadi
- **Huquqlari**:
  - Bolasi profilini ko'rish
  - Progress va statistika
  - To'lovlar tarixi
  - Murabbiy bilan aloqa
  - Bildirishnomalarni olish

## Huquqlar Jadvali

| Funksiya | Super Admin | Academy Admin | Coach | Student | Parent |
|----------|-------------|---------------|-------|---------|--------|
| Akademiya yaratish | ✅ | ❌ | ❌ | ❌ | ❌ |
| Guruh yaratish | ✅ | ✅ | ❌ | ❌ | ❌ |
| Murabbiy tayinlash | ✅ | ✅ | ❌ | ❌ | ❌ |
| Mashg'ulot rejalashtirish | ✅ | ✅ | ✅ | ❌ | ❌ |
| Davomat belgilash | ✅ | ✅ | ✅ | ❌ | ❌ |
| Baholash qilish | ✅ | ✅ | ✅ | ❌ | ❌ |
| Progress ko'rish | ✅ | ✅ | ✅ | ✅ (o'zi) | ✅ (bolasi) |
| Jadval ko'rish | ✅ | ✅ | ✅ | ✅ | ✅ |
| To'lovlar ko'rish | ✅ | ✅ (akademiya) | ❌ | ❌ | ✅ (bolasi) |
| Profil tahrirlash | ✅ | ✅ | ✅ | ✅ | ✅ |

## Xavfsizlik Qatlamlari

### 1. System Level (Super Admin)
- Butun tizimga kirish
- Barcha ma'lumotlarni o'chirish
- Tizimni to'xtatish

### 2. Academy Level (Academy Admin)
- Faqat o'z akademiyasi
- O'z xodimlari va o'quvchilari
- Moliyaviy ma'lumotlar

### 3. Group Level (Coach)
- Faqat o'z guruhlari
- Mashg'ulotlar va progress
- O'quvchi ma'lumotlari (cheklangan)

### 4. Individual Level (Student/Parent)
- Faqat o'z/bolasi ma'lumotlari
- Shaxsiy profil
- Progress va jadval

## Muhim Eslatmalar

### Privacy
- Ota-ona faqat o'z bolasi ma'lumotlarini ko'radi
- Murabbiy boshqa guruh ma'lumotlarini ko'rmaydi
- Akademiya admin boshqa akademiya ma'lumotlarini ko'rmaydi

### Huquq berish
- Barcha rollar Super Admin tomonidan tasdiqlanadi
- Academy Admin o'z akademiyasida murabbiy tayinlaydi
- Huquqlar rolega bog'liq, individual emas

### Cheklovlar
- Hech kim o'zidan yuqori rol ma'lumotlarini ko'rmaydi
- Moliyaviy ma'lumotlar faqat adminlar uchun
- Shaxsiy ma'lumotlar faqat tegishli shaxslar uchun

## Oddiy Qoida
- **Super Admin**: Hamma narsa
- **Academy Admin**: O'z akademiyasi
- **Coach**: O'z guruhlari  
- **Student**: Faqat o'zi
- **Parent**: Faqat bolasi
