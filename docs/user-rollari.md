# O'quv Markazi - User Rollari va Huquqlari

## Rollar

### 1. Super Admin
- **Kim?**: Tizim egasi
- **Nima qiladi?**: Butun tizimni boshqaradi
- **Huquqlari**:
  - Markazlarni yaratish/o'chirish
  - Barcha foydalanuvchilarni ko'rish
  - Tizim sozlamalari
  - Moliyaviy hisobotlar

### 2. Center Admin
- **Kim?**: Markaz direktori/menejeri
- **Nima qiladi?**: O'z markazini boshqaradi
- **Huquqlari**:
  - Kurslarni yaratish
  - O'qituvchilarni ishga olish
  - O'quvchilarni qabul qilish
  - To'lovlarni boshqarish
  - O'z markazi hisobotlari

### 3. Teacher (O'qituvchi)
- **Kim?**: O'qituvchi
- **Nima qiladi?**: Kurslarga dars beradi
- **Huquqlari**:
  - Darslar rejalashtirish
  - Davomat belgilash
  - Baholash qilish
  - O'z kurslari progressi
  - O'quvchilarga vazifa berish

### 4. Student (O'quvchi)
- **Kim?**: Talaba
- **Nima qiladi?**: Darslarda qatnashadi
- **Huquqlari**:
  - O'z profilini ko'rish
  - Jadvalni ko'rish
  - O'z progressini ko'rish
  - Kurslarga yozilish
  - Vazifalarni ko'rish

### 5. Parent (Ota-ona)
- **Kim?**: O'quvchi ota-onasi
- **Nima qiladi?**: Farzandining o'qishini kuzatadi
- **Huquqlari**:
  - Farzandining profilini ko'rish
  - Progress va statistika
  - To'lovlar tarixi
  - O'qituvchi bilan aloqa
  - Bildirishnomalarni olish

## Huquqlar Jadvali

| Funksiya | Super Admin | Center Admin | Teacher | Student | Parent |
|----------|-------------|--------------|---------|---------|--------|
| Markaz yaratish | ✅ | ❌ | ❌ | ❌ | ❌ |
| Kurs yaratish | ✅ | ✅ | ❌ | ❌ | ❌ |
| O'qituvchi tayinlash | ✅ | ✅ | ❌ | ❌ | ❌ |
| Dars rejalashtirish | ✅ | ✅ | ✅ | ❌ | ❌ |
| Davomat belgilash | ✅ | ✅ | ✅ | ❌ | ❌ |
| Baholash qilish | ✅ | ✅ | ✅ | ❌ | ❌ |
| Progress ko'rish | ✅ | ✅ | ✅ | ✅ (o'zi) | ✅ (farzandi) |
| Jadval ko'rish | ✅ | ✅ | ✅ | ✅ | ✅ |
| To'lovlar ko'rish | ✅ | ✅ (markaz) | ❌ | ❌ | ✅ (farzandi) |
| Profil tahrirlash | ✅ | ✅ | ✅ | ✅ | ✅ |

## Xavfsizlik Qatlamlari

### 1. System Level (Super Admin)
- Butun tizimga kirish
- Barcha ma'lumotlarni o'chirish
- Tizimni to'xtatish

### 2. Center Level (Center Admin)
- Faqat o'z markazi
- O'z xodimlari va o'quvchilari
- Moliyaviy ma'lumotlar

### 3. Course Level (Teacher)
- Faqat o'z kurslari
- Darslar va progress
- O'quvchi ma'lumotlari (cheklangan)

### 4. Individual Level (Student/Parent)
- Faqat o'z/bolasi ma'lumotlari
- Shaxsiy profil
- Progress va jadval

## Muhim Eslatmalar

### Privacy
- Ota-ona faqat farzandining ma'lumotlarini ko'radi
- O'qituvchi boshqa kurs ma'lumotlarini ko'rmaydi
- Center admin boshqa markaz ma'lumotlarini ko'rmaydi

### Huquq berish
- Barcha rollar Super Admin tomonidan tasdiqlanadi
- Center Admin o'z markazida o'qituvchi tayinlaydi
- Huquqlar rolega bog'liq, individual emas

### Cheklovlar
- Hech kim o'zidan yuqori rol ma'lumotlarini ko'rmaydi
- Moliyaviy ma'lumotlar faqat adminlar uchun
- Shaxsiy ma'lumotlar faqat tegishli shaxslar uchun

## Oddiy Qoida
- **Super Admin**: Hamma narsa
- **Center Admin**: O'z markazi
- **Teacher**: O'z kurslari
- **Student**: Faqat o'zi
- **Parent**: Faqat farzandi
