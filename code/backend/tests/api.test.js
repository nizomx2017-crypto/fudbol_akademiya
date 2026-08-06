const { after, before, describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { Client } = require("pg");
const jwt = require("jsonwebtoken");
process.env.NODE_ENV = "test";
require("dotenv").config();

const LOGIN_ACCOUNTS = [
  { login: "admin", password: "test-login-password" },
  { login: "director", password: "second-test-password" },
];
process.env.JWT_SECRET = "test-secret-for-jwt-rbac";
process.env.LOGIN_PASSWORD = "";
process.env.LOGIN_PASSWORDS = "";
process.env.LOGIN_USER_1 = LOGIN_ACCOUNTS[0].login;
process.env.LOGIN_PASSWORD_1 = LOGIN_ACCOUNTS[0].password;
process.env.LOGIN_ROLE_1 = "ADMIN";
process.env.LOGIN_USER_2 = LOGIN_ACCOUNTS[1].login;
process.env.LOGIN_PASSWORD_2 = LOGIN_ACCOUNTS[1].password;
process.env.LOGIN_ROLE_2 = "DIRECTOR";
process.env.LOGIN_RATE_LIMIT_MAX = "100";
process.env.REGISTER_RATE_LIMIT_MAX = "100";
process.env.API_RATE_LIMIT_MAX = "1000";
process.env.DISABLE_RECAPTCHA = "true";

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

async function login(account) {
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(account),
  });
  const body = await response.json();

  assert.ok(response.ok, `login failed: ${JSON.stringify(body)}`);

  return body;
}

async function request(path, options = {}) {
  const needsAuthorization =
    path.startsWith("/api") ||
    path.startsWith("/auth/users") ||
    path.startsWith("/auth/accesses") ||
    path.startsWith("/auth/me");
  const token = options.token || authToken;
  const headers = {
    "content-type": "application/json",
    ...(needsAuthorization ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const fetchOptions = { ...options };
  delete fetchOptions.token;

  const response = await fetch(`${baseUrl}${path}`, {
    headers,
    ...fetchOptions,
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

  const loginBody = await login(LOGIN_ACCOUNTS[0]);
  authToken = loginBody.accessToken;
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
    assert.equal(body.error, "Login yoki parol noto'g'ri");
  });

  it("requires captcha for login in production", async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalDisableRecaptcha = process.env.DISABLE_RECAPTCHA;

    process.env.NODE_ENV = "production";
    process.env.DISABLE_RECAPTCHA = "true";

    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(LOGIN_ACCOUNTS[0]),
    });
    const body = await response.json();

    process.env.NODE_ENV = originalNodeEnv;
    process.env.DISABLE_RECAPTCHA = originalDisableRecaptcha;

    assert.equal(response.status, 400);
    assert.equal(body.error, "Captcha tekshiruvidan o'tmadi");
  });

  it("returns API token after successful login", async () => {
    const body = await login(LOGIN_ACCOUNTS[0]);

    assert.equal(typeof body.accessToken, "string");
    assert.equal(typeof body.refreshToken, "string");
    assert.equal(body.accessToken.split(".").length, 3);
    assert.equal(body.refreshToken.split(".").length, 3);
    assert.equal(body.token, body.accessToken);
    assert.notEqual(body.accessToken, LOGIN_ACCOUNTS[0].password);
    assert.equal(jwt.decode(body.accessToken).exp - jwt.decode(body.accessToken).iat, 10 * 60);
    assert.equal(jwt.decode(body.refreshToken).exp - jwt.decode(body.refreshToken).iat, 7 * 24 * 60 * 60);
    assert.equal(body.user.login, LOGIN_ACCOUNTS[0].login);
    assert.equal(body.user.role, "ADMIN");
  });

  it("returns API token for DIRECTOR account", async () => {
    const body = await login(LOGIN_ACCOUNTS[1]);

    assert.equal(typeof body.accessToken, "string");
    assert.equal(typeof body.refreshToken, "string");
    assert.equal(body.accessToken.split(".").length, 3);
    assert.notEqual(body.accessToken, LOGIN_ACCOUNTS[1].password);
    assert.equal(body.user.login, LOGIN_ACCOUNTS[1].login);
    assert.equal(body.user.role, "DIRECTOR");
  });

  it("refreshes access token and clears refresh token on logout", async () => {
    const loginBody = await login(LOGIN_ACCOUNTS[0]);

    const refreshResponse = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ refreshToken: loginBody.refreshToken }),
    });
    const refreshBody = await refreshResponse.json();

    assert.equal(refreshResponse.status, 200);
    assert.equal(typeof refreshBody.accessToken, "string");
    assert.equal(typeof refreshBody.refreshToken, "string");
    assert.equal(refreshBody.token, refreshBody.accessToken);

    const logoutResponse = await fetch(`${baseUrl}/auth/logout`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ refreshToken: refreshBody.refreshToken }),
    });
    const logoutBody = await logoutResponse.json();

    assert.equal(logoutResponse.status, 200);
    assert.equal(logoutBody.message, "Logged out");

    const afterLogoutResponse = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ refreshToken: refreshBody.refreshToken }),
    });

    assert.equal(afterLogoutResponse.status, 401);
  });

  it("supports auth user management with roles and without exposing password hashes", async () => {
    const users = await request("/auth/users");
    assert.equal(users.length, 2);
    assert.equal(users[0].passwordHash, undefined);

    const created = await createRecord("/auth/users", {
      login: "operator",
      password: "operator-password",
      role: "MANAGER",
      accesses: ["students:view"],
    });
    assert.equal(created.login, "operator");
    assert.equal(created.role, "MANAGER");
    assert.deepEqual(created.accesses, ["students:view"]);
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
    assert.equal(loginBody.user.role, "MANAGER");

    const updated = await updateRecord(`/auth/users/${created.id}`, {
      password: "changed-password",
      accesses: ["students:view", "students:create"],
    });
    assert.equal(updated.login, "operator");
    assert.deepEqual(updated.accesses.sort(), ["students:create", "students:view"]);

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

  it("validates auth user creation payloads and blocks duplicate logins", async () => {
    const invalidResponse = await fetch(`${baseUrl}/auth/users`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        login: "",
        password: "short",
        role: "OWNER",
        status: "pending",
        accesses: "students:view",
      }),
    });
    const invalidBody = await invalidResponse.json();

    assert.equal(invalidResponse.status, 400);
    assert.equal(invalidBody.error, "Validation xato");
    assert.ok(invalidBody.details.includes("Login kiritilishi kerak"));
    assert.ok(invalidBody.details.includes("Parol kamida 8 ta belgidan iborat bo'lishi kerak"));
    assert.ok(invalidBody.details.includes("Role noto'g'ri"));
    assert.ok(invalidBody.details.includes("Status noto'g'ri"));
    assert.ok(invalidBody.details.includes("Accesses array bo'lishi kerak"));

    const duplicateResponse = await fetch(`${baseUrl}/auth/users`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        login: LOGIN_ACCOUNTS[0].login,
        password: "valid-password",
        role: "MANAGER",
      }),
    });
    const duplicateBody = await duplicateResponse.json();

    assert.equal(duplicateResponse.status, 400);
    assert.equal(duplicateBody.error, "Bunday login allaqachon mavjud");
  });

  it("locks a login after repeated wrong passwords and resets attempts after success", async () => {
    const user = await createRecord("/auth/users", {
      login: "brute-force-user",
      password: "safe-password",
      role: "MANAGER",
    });

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          login: "brute-force-user",
          password: "wrong-password",
        }),
      });
      const body = await response.json();

      assert.equal(response.status, 401);
      assert.equal(body.error, "Login yoki parol noto'g'ri");
    }

    const successfulLogin = await login({
      login: "brute-force-user",
      password: "safe-password",
    });
    assert.equal(successfulLogin.user.login, "brute-force-user");

    for (let attempt = 0; attempt < 4; attempt += 1) {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          login: "brute-force-user",
          password: "wrong-password",
        }),
      });
      const body = await response.json();

      assert.equal(response.status, 401);
      assert.equal(body.error, "Login yoki parol noto'g'ri");
    }

    const lockedResponse = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        login: "brute-force-user",
        password: "wrong-password",
      }),
    });
    const lockedBody = await lockedResponse.json();

    assert.equal(lockedResponse.status, 423);
    assert.match(lockedBody.error, /bloklangan/);

    const deleted = await deleteRecord(`/auth/users/${user.id}`);
    assert.equal(deleted.message, "Auth user deleted");
  });

  it("allows DIRECTOR full access without assigned permissions", async () => {
    const directorLogin = await login(LOGIN_ACCOUNTS[1]);
    const courses = await request("/api/courses", {
      token: directorLogin.accessToken,
    });

    assert.ok(Array.isArray(courses));
  });

  it("restricts MANAGER until DIRECTOR or ADMIN assigns accesses", async () => {
    const manager = await createRecord("/auth/users", {
      login: "manager",
      password: "manager-password",
      role: "MANAGER",
    });

    const managerLogin = await login({
      login: "manager",
      password: "manager-password",
    });

    const deniedResponse = await fetch(`${baseUrl}/api/students`, {
      headers: {
        Authorization: `Bearer ${managerLogin.accessToken}`,
      },
    });
    const deniedBody = await deniedResponse.json();

    assert.equal(deniedResponse.status, 403);
    assert.equal(deniedBody.requiredAccess, "students:view");

    const updated = await request(`/auth/users/${manager.id}/accesses`, {
      method: "PUT",
      body: JSON.stringify({
        accesses: ["students:view", "students:create"],
      }),
    });

    assert.deepEqual(updated.accesses.sort(), ["students:create", "students:view"]);

    const allowedStudents = await request("/api/students", {
      token: managerLogin.accessToken,
    });
    assert.equal(allowedStudents.total, 0);

    const stillDeniedResponse = await fetch(`${baseUrl}/api/teachers`, {
      headers: {
        Authorization: `Bearer ${managerLogin.accessToken}`,
      },
    });
    assert.equal(stillDeniedResponse.status, 403);
  });

  it("assigns default accesses for TEACHER and STUDENT roles", async () => {
    const teacher = await createRecord("/auth/users", {
      login: "teacher-default",
      password: "teacher-password",
      role: "TEACHER",
    });

    assert.equal(teacher.role, "TEACHER");
    assert.deepEqual(
      teacher.accesses.sort(),
      ["courses:view", "dashboard:view", "groups:view", "students:view", "teachers:view"].sort()
    );

    const teacherLogin = await login({
      login: "teacher-default",
      password: "teacher-password",
    });
    assert.deepEqual(
      teacherLogin.user.accesses.sort(),
      ["courses:view", "dashboard:view", "groups:view", "students:view", "teachers:view"].sort()
    );
    const teacherCourses = await request("/api/courses", {
      token: teacherLogin.accessToken,
    });
    assert.ok(Array.isArray(teacherCourses));

    const teacherCreateResponse = await fetch(`${baseUrl}/api/courses`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${teacherLogin.accessToken}`,
      },
      body: JSON.stringify({
        name: "Blocked Course",
      }),
    });
    assert.equal(teacherCreateResponse.status, 403);

    const student = await createRecord("/auth/users", {
      login: "student-default",
      password: "student-password",
      role: "STUDENT",
    });

    assert.equal(student.role, "STUDENT");
    assert.deepEqual(
      student.accesses.sort(),
      ["courses:view", "dashboard:view", "groups:view"].sort()
    );

    const studentLogin = await login({
      login: "student-default",
      password: "student-password",
    });
    assert.deepEqual(
      studentLogin.user.accesses.sort(),
      ["courses:view", "dashboard:view", "groups:view"].sort()
    );
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

  it("exposes health, readiness and OpenAPI", async () => {
    const health = await request("/ops/health");
    assert.equal(health.status, "ok");
    const ready = await request("/ops/ready");
    assert.equal(ready.database, "up");
    const spec = await request("/openapi.json");
    assert.equal(spec.openapi, "3.0.3");

    const docsResponse = await fetch(`${baseUrl}/api-docs/`);
    const docsHtml = await docsResponse.text();
    assert.equal(docsResponse.status, 200);
    assert.match(docsResponse.headers.get("content-type"), /text\/html/);
    assert.match(docsHtml, /id="swagger-ui"/);
  });

  it("creates idempotent-key protected payment and returns history", async () => {
    const missing = await fetch(`${baseUrl}/api/payments-v2`, { method: "POST", headers: { "content-type": "application/json", Authorization: `Bearer ${authToken}` }, body: JSON.stringify({ amount: 120000 }) });
    assert.equal(missing.status, 400);
    const payment = await request("/api/payments-v2", { method: "POST", headers: { "content-type": "application/json", "Idempotency-Key": "payment-test-1", Authorization: `Bearer ${authToken}` }, body: JSON.stringify({ amount: 120000 }) });
    assert.equal(payment.status, "pending");
    const duplicateResponse = await fetch(`${baseUrl}/api/payments-v2`, { method: "POST", headers: { "content-type": "application/json", "Idempotency-Key": "payment-test-1", Authorization: `Bearer ${authToken}` }, body: JSON.stringify({ amount: 120000 }) });
    const duplicate = await duplicateResponse.json();
    assert.equal(duplicateResponse.status, 200);
    assert.equal(duplicate.id, payment.id);
    const history = await request("/api/payments-v2");
    assert.equal(history.meta.total, 1);
    const cancelled = await request(`/api/payments-v2/${payment.id}/cancel`, { method: "POST" });
    assert.equal(cancelled.status, "cancelled");
  });

  it("uses atomic wallet transactions and prevents overdraft", async () => {
    const credited = await request("/api/billing/wallet/transactions", { method: "POST", body: JSON.stringify({ amount: 50000, type: "credit", reference: "credit-1" }) });
    assert.equal(Number(credited.wallet.balance), 50000);
    const debit = await request("/api/billing/wallet/transactions", { method: "POST", body: JSON.stringify({ amount: 20000, type: "debit", reference: "debit-1" }) });
    assert.equal(Number(debit.wallet.balance), 30000);
    const denied = await fetch(`${baseUrl}/api/billing/wallet/transactions`, { method: "POST", headers: { "content-type": "application/json", Authorization: `Bearer ${authToken}` }, body: JSON.stringify({ amount: 999999, type: "debit" }) });
    assert.equal(denied.status, 409);
  });

  it("supports chat, notifications, user profile and storage validation", async () => {
    const conversation = await request("/api/chat", { method: "POST", body: JSON.stringify({ title: "Test", participantId: 2 }) });
    const message = await request(`/api/chat/${conversation.id}/messages`, { method: "POST", body: JSON.stringify({ body: "Salom" }) });
    assert.equal(message.body, "Salom");
    const participantLogin = await login(LOGIN_ACCOUNTS[1]);
    const participantView = await request(`/api/chat/${conversation.id}`, { token: participantLogin.accessToken });
    assert.equal(participantView.id, conversation.id);
    const readMessage = await request(`/api/chat/messages/${message.id}/read`, { method: "PATCH", body: "{}", token: participantLogin.accessToken });
    assert.ok(readMessage.readAt);

    const outsider = await createRecord("/auth/users", { login: "chat-outsider", password: "outsider-password", role: "STUDENT" });
    const outsiderLogin = await login({ login: "chat-outsider", password: "outsider-password" });
    for (const [path, method, body] of [
      [`/api/chat/${conversation.id}`, "GET", undefined],
      [`/api/chat/${conversation.id}/messages`, "POST", JSON.stringify({ body: "Blocked" })],
      [`/api/chat/messages/${message.id}/read`, "PATCH", "{}"],
    ]) {
      const response = await fetch(`${baseUrl}${path}`, { method, headers: { "content-type": "application/json", Authorization: `Bearer ${outsiderLogin.accessToken}` }, body });
      assert.equal(response.status, 403);
    }
    await deleteRecord(`/auth/users/${outsider.id}`);
    const notification = await request("/api/notifications", { method: "POST", body: JSON.stringify({ userId: 1, title: "Test", body: "Xabar" }) });
    assert.equal(notification.title, "Test");
    const me = await request("/api/users/me");
    assert.equal(me.login, "admin");
    const upload = await fetch(`${baseUrl}/api/storage`, { method: "POST", headers: { Authorization: `Bearer ${authToken}` } });
    assert.equal(upload.status, 400);
  });

  it("rejects Telegram and payment webhooks without secrets", async () => {
    const telegram = await fetch(`${baseUrl}/telegram/webhook`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
    assert.equal(telegram.status, 401);
    const payment = await fetch(`${baseUrl}/webhooks/payment`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reference: "x", status: "paid" }) });
    assert.equal(payment.status, 401);
  });
});
