const { after, before, describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { Client } = require("pg");
require("dotenv").config();

const LOGIN_ACCOUNTS = [
  { login: "admin", password: "test-login-password" },
  { login: "teacher", password: "second-test-password" },
];
process.env.LOGIN_PASSWORD = "";
process.env.LOGIN_PASSWORDS = "";
process.env.LOGIN_USER_1 = LOGIN_ACCOUNTS[0].login;
process.env.LOGIN_PASSWORD_1 = LOGIN_ACCOUNTS[0].password;
process.env.LOGIN_USER_2 = LOGIN_ACCOUNTS[1].login;
process.env.LOGIN_PASSWORD_2 = LOGIN_ACCOUNTS[1].password;

let db;
let server;
let baseUrl;
let authToken;

async function ensureTestDatabase() {
  const defaultDbName = process.env.DB_NAME;
  const testDbName = process.env.TEST_DB_NAME || `${defaultDbName}_test`;

  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_MAINTENANCE_NAME || "postgres",
  });

  await client.connect();

  const result = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [
    testDbName,
  ]);

  if (result.rowCount === 0) {
    const safeDbName = testDbName.replace(/"/g, '""');
    await client.query(`CREATE DATABASE "${safeDbName}"`);
  }

  await client.end();
  process.env.DB_NAME = testDbName;
}

async function request(path, options = {}) {
  const needsAuthorization = path.startsWith("/api") || path.startsWith("/auth/users");
  const headers = {
    "content-type": "application/json",
    ...(needsAuthorization ? { Authorization: authToken } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${baseUrl}${path}`, {
    headers,
    ...options,
  });

  const body = await response.json();

  assert.ok(
    response.ok,
    `${options.method || "GET"} ${path} failed with ${response.status}: ${JSON.stringify(body)}`
  );

  return body;
}

async function createRecord(path, payload) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function updateRecord(path, payload) {
  return request(path, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

async function deleteRecord(path) {
  return request(path, {
    method: "DELETE",
  });
}

before(async () => {
  await ensureTestDatabase();

  const app = require("../app");
  const seedAuthUsers = require("../models/seedAuthUsers");
  db = require("../config/db");

  await db.sync({ force: true });
  await seedAuthUsers();

  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));

  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;

  const loginResponse = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(LOGIN_ACCOUNTS[0]),
  });
  const loginBody = await loginResponse.json();
  authToken = loginBody.token;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }

  await db.close();
});

describe("Backend API smoke tests", () => {
  it("GET / returns health message", async () => {
    const body = await request("/");

    assert.equal(body.message, "Backend ishlayapti");
  });

  it("blocks API requests without valid Authorization header", async () => {
    const response = await fetch(`${baseUrl}/api/courses`);
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.error, "Authorization xato yoki yuborilmagan");
  });

  it("blocks login with wrong login or password", async () => {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ login: "admin", password: "wrong-password" }),
    });
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.error, "Login yoki parol xato");
  });

  it("returns API token after successful login", async () => {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(LOGIN_ACCOUNTS[0]),
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(typeof body.token, "string");
    assert.equal(body.token.length, 64);
    assert.notEqual(body.token, LOGIN_ACCOUNTS[0].password);
    assert.equal(body.user.login, LOGIN_ACCOUNTS[0].login);
  });

  it("returns API token for another configured account", async () => {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(LOGIN_ACCOUNTS[1]),
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(typeof body.token, "string");
    assert.equal(body.token.length, 64);
    assert.notEqual(body.token, LOGIN_ACCOUNTS[1].password);
    assert.equal(body.user.login, LOGIN_ACCOUNTS[1].login);
  });

  it("supports auth user management without exposing password hashes", async () => {
    const users = await request("/auth/users");
    assert.equal(users.length, 2);
    assert.equal(users[0].passwordHash, undefined);

    const created = await createRecord("/auth/users", {
      login: "operator",
      password: "operator-password",
    });
    assert.equal(created.login, "operator");
    assert.equal(created.passwordHash, undefined);

    const loginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        login: "operator",
        password: "operator-password",
      }),
    });
    const loginBody = await loginResponse.json();
    assert.equal(loginResponse.status, 200);
    assert.equal(loginBody.user.login, "operator");

    const updated = await updateRecord(`/auth/users/${created.id}`, {
      password: "changed-password",
    });
    assert.equal(updated.login, "operator");

    const oldPasswordResponse = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        login: "operator",
        password: "operator-password",
      }),
    });
    assert.equal(oldPasswordResponse.status, 401);

    const deleted = await deleteRecord(`/auth/users/${created.id}`);
    assert.equal(deleted.message, "Auth user deleted");
  });

  it("supports Course CRUD", async () => {
    const course = await createRecord("/api/courses", {
      name: "Test Course",
      price: 100000,
      duration: "1 oy",
    });

    assert.equal(course.name, "Test Course");

    const courses = await request("/api/courses");
    assert.equal(courses.length, 1);

    const update = await updateRecord(`/api/courses/${course.id}`, {
      price: 120000,
    });
    assert.equal(update.message, "Course updated");

    const deleted = await deleteRecord(`/api/courses/${course.id}`);
    assert.equal(deleted.message, "Course deleted");
  });

  it("supports Student CRUD with pagination", async () => {
    const student = await createRecord("/api/students", {
      name: "Test Student",
      phone: "+998901234567",
      group: "Test Group",
      balance: 0,
      status: "active",
      joined: "2026-06-26",
    });

    assert.equal(student.name, "Test Student");

    const students = await request("/api/students?page=1&limit=5");
    assert.equal(students.total, 1);
    assert.equal(students.data.length, 1);

    const update = await updateRecord(`/api/students/${student.id}`, {
      status: "inactive",
    });
    assert.equal(update.message, "Student updated");

    const deleted = await deleteRecord(`/api/students/${student.id}`);
    assert.equal(deleted.message, "Student deleted");
  });

  it("supports Teacher CRUD", async () => {
    const teacher = await createRecord("/api/teachers", {
      fullname: "Test Teacher",
      phone: "+998901111111",
      subject: "Math",
      salary: 5000000,
    });

    assert.equal(teacher.fullname, "Test Teacher");

    const teachers = await request("/api/teachers");
    assert.equal(teachers.length, 1);

    const update = await updateRecord(`/api/teachers/${teacher.id}`, {
      salary: 5500000,
    });
    assert.equal(update.message, "Teacher updated");

    const deleted = await deleteRecord(`/api/teachers/${teacher.id}`);
    assert.equal(deleted.message, "Teacher deleted");
  });

  it("supports Group CRUD", async () => {
    const group = await createRecord("/api/groups", {
      name: "Test Group",
      course: "Math",
      teacher: "Test Teacher",
      students: 10,
      schedule: "Mon/Wed/Fri",
      room: "101",
    });

    assert.equal(group.name, "Test Group");

    const groups = await request("/api/groups");
    assert.equal(groups.length, 1);

    const update = await updateRecord(`/api/groups/${group.id}`, {
      students: 12,
    });
    assert.equal(update.message, "Group updated");

    const deleted = await deleteRecord(`/api/groups/${group.id}`);
    assert.equal(deleted.message, "Group deleted");
  });

  it("supports Payment CRUD", async () => {
    const payment = await createRecord("/api/payments", {
      student: "Test Student",
      amount: 100000,
      method: "cash",
      date: "2026-06-26",
      status: "paid",
    });

    assert.equal(payment.status, "paid");

    const payments = await request("/api/payments");
    assert.equal(payments.length, 1);

    const update = await updateRecord(`/api/payments/${payment.id}`, {
      status: "refunded",
    });
    assert.equal(update.message, "Payment updated");

    const deleted = await deleteRecord(`/api/payments/${payment.id}`);
    assert.equal(deleted.message, "Payment deleted");
  });

  it("supports Room CRUD", async () => {
    const room = await createRecord("/api/rooms", {
      name: "101",
      floor: 1,
      capacity: 20,
      equipment: "board",
      status: "active",
    });

    assert.equal(room.name, "101");

    const rooms = await request("/api/rooms");
    assert.equal(rooms.length, 1);

    const update = await updateRecord(`/api/rooms/${room.id}`, {
      capacity: 25,
    });
    assert.equal(update.message, "Room updated");

    const deleted = await deleteRecord(`/api/rooms/${room.id}`);
    assert.equal(deleted.message, "Room deleted");
  });
});
