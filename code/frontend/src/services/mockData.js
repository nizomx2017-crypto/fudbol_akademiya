export const mockStudents = Array.from({ length: 24 }).map((_, i) => ({
  id: i + 1,
  name: ["Aziz Karimov","Dilshoda Yusupova","Sherzod Akmalov","Munisa Tursunova","Jasur Rahimov","Nilufar Sodiqova","Bekzod Mirzaev","Shahnoza Alimova","Otabek Nazarov","Madina Qodirova","Sardor Ibragimov","Zarina Hamidova"][i % 12],
  phone: `+998 90 ${100 + i}-${10 + i}-${20 + i}`,
  group: ["IT-101","ENG-204","MATH-301","UX-110"][i % 4],
  balance: (i % 5) * 250000,
  status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Pending" : "Active",
  joined: `2025-${String((i % 12) + 1).padStart(2, "0")}-12`,
}));

export const mockTeachers = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: ["Anvar Tursunov","Gulnoza Karimova","Rustam Alimov","Saodat Yo'ldosheva","Bobur Nazarov","Lola Saidova"][i % 6],
  subject: ["Frontend","English","Mathematics","UX Design","Backend","IELTS"][i % 6],
  phone: `+998 93 ${200 + i}-${10 + i}-${30 + i}`,
  experience: `${2 + (i % 8)} years`,
  groups: 1 + (i % 4),
}));

export const mockCourses = [
  { id: 1, title: "Frontend Development", duration: "6 months", price: 1200000, level: "Beginner", teacher: "Anvar Tursunov" },
  { id: 2, title: "English IELTS 7+", duration: "4 months", price: 950000, level: "Advanced", teacher: "Lola Saidova" },
  { id: 3, title: "UX/UI Design", duration: "3 months", price: 1100000, level: "Intermediate", teacher: "Saodat Yo'ldosheva" },
  { id: 4, title: "Mathematics Olympiad", duration: "5 months", price: 800000, level: "Advanced", teacher: "Rustam Alimov" },
  { id: 5, title: "Backend Node.js", duration: "6 months", price: 1400000, level: "Intermediate", teacher: "Bobur Nazarov" },
  { id: 6, title: "General English A2-B1", duration: "4 months", price: 700000, level: "Beginner", teacher: "Gulnoza Karimova" },
];

export const mockGroups = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: ["IT-101","ENG-204","MATH-301","UX-110","BE-220","IELTS-7","FRONT-A","FRONT-B","ENG-A1","UX-PRO"][i],
  course: mockCourses[i % mockCourses.length].title,
  teacher: mockTeachers[i % mockTeachers.length].name,
  students: 8 + (i % 12),
  schedule: ["Mon/Wed/Fri","Tue/Thu/Sat","Daily","Mon/Wed"][i % 4],
  room: `Room ${101 + (i % 6)}`,
}));

export const mockPayments = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  student: mockStudents[i % mockStudents.length].name,
  amount: 250000 + (i % 5) * 150000,
  method: ["Cash","Click","Payme","Card"][i % 4],
  date: `2025-11-${String((i % 28) + 1).padStart(2, "0")}`,
  status: i % 4 === 0 ? "Pending" : "Paid",
}));

export const mockRooms = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: `Room ${101 + i}`,
  capacity: 12 + (i % 4) * 4,
  floor: 1 + (i % 3),
  equipment: ["Projector, Whiteboard","TV, AC","Smart Board","Whiteboard"][i % 4],
  status: i % 5 === 0 ? "Maintenance" : "Available",
}));