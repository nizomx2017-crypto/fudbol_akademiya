# MVP - Minimum Viable Product

## MVP Bosqichlari

### Bosqich 1: Asosiy Platforma (1-oy)
**Rollar**: Admin, Student
**Modullar**: Login, Profil, Guruh

#### Nimalar kerak:
- Login/Register
- Admin panel
- Student profil
- Oddiy guruh yaratish

#### Funksiyalar:
- Admin: Akademiya yaratish, guruh qo'shish
- Student: Ro'yxatdan o'tish, profil ko'rish

---

### Bosqich 2: Murabbiylik (2-oy)
**Rollar**: Admin, Coach, Student
**Modullar**: Guruhlar, Mashg'ulotlar

#### Nimalar kerak:
- Coach roli
- Mashg'ulot jadvali
- Davomat

#### Funksiyalar:
- Coach: Guruhga tayinlash, mashg'ulotlar rejalashtirish
- Student: Jadvalni ko'rish

---

### Bosqich 3: Progress (3-oy)
**Rollar**: Admin, Coach, Student, Parent
**Modullar**: Progress, Baholash

#### Nimalar kerak:
- Progress kuzatish
- Baholash tizimi
- Parent roli

#### Funksiyalar:
- Coach: Baholash qilish
- Student/Parent: Progress ko'rish

---

### Bosqich 4: To'lovlar (4-oy)
**Rollar**: Barcha rollar
**Modullar**: To'lovlar, Hisobotlar

#### Nimalar kerak:
- To'lov qabul qilish
- Oddiy hisobotlar

#### Funksiyalar:
- Admin: To'lovlarni boshqarish
- Parent: To'lovlar tarixi

---

## MVP Rollari (Soddalashtirilgan)

### 1. Admin
- Akademiya yaratish
- Guruhlar yaratish
- Murabbiylarni qo'shish
- To'lovlar

### 2. Coach
- O'z guruhlari
- Mashg'ulotlar jadvali
- Davomat
- Baholash

### 3. Student
- Profil
- Jadval
- Progress

### 4. Parent
- Bolasi profili
- Progress
- To'lovlar

## MVP Modullari (Minimal)

### 1. Authentication
- Login/Register
- Role-based access
- Profile management

### 2. Group Management
- Create groups
- Assign students
- Assign coaches

### 3. Schedule
- Training sessions
- Calendar view
- Basic notifications

### 4. Attendance
- Mark attendance
- Attendance reports
- Simple statistics

### 5. Progress
- Basic ratings (1-5)
- Progress charts
- Simple reports

### 6. Payments
- Basic billing
- Payment history
- Simple invoices

## MVP Database (Minimal)

```sql
users (id, email, password, name, role)
academies (id, name, admin_id)
groups (id, name, academy_id, coach_id)
students (id, user_id, group_id)
sessions (id, group_id, date, time)
attendance (id, session_id, student_id, status)
progress (id, student_id, score, date)
payments (id, student_id, amount, status)
```

## MVP Features (Qisqa ro'yxat)

### Week 1-2: Foundation
- [ ] Setup project
- [ ] Database design
- [ ] Authentication system
- [ ] Basic UI

### Week 3-4: Core
- [ ] Admin panel
- [ ] Group management
- [ ] User profiles

### Week 5-6: Training
- [ ] Schedule system
- [ ] Attendance
- [ ] Coach functions

### Week 7-8: Progress
- [ ] Progress tracking
- [ ] Basic reports
- [ ] Parent access

### Week 9-10: Payments
- [ ] Payment system
- [ ] Invoices
- [ ] Financial reports

### Week 11-12: Polish
- [ ] Mobile responsive
- [ ] Testing
- [ ] Deployment

## MVP Nimalar EMAS?
- Video analiz
- AI tavsiyalar
- Murakkab hisobotlar
- Ko'p tilli
- Advanced analytics
- Video streaming
- GPS tracking
- Complex notifications

## MVP Success Metrics
- 3 akademiya ishga tushishi
- 100+ active student
- 80% attendance tracking
- 90% payment collection
- Basic mobile support

## MVP Budget
- 2 dasturchi
- 3 oy
- $75,000-100,000

## MVP Tech Stack
- Backend: Node.js + Express
- Frontend: React
- Database: PostgreSQL
- Deployment: Vercel/Heroku

---

**MVP maqsadi**: Tezda ishga tushirish, feedback olish, keyin kengaytirish
