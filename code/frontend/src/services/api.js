
// All functions return Promises and follow REST conventions.
const API_ORIGIN = "http://localhost:5000";
const BASE_URL = `${API_ORIGIN}/api`;
const AUTH_URL = `${API_ORIGIN}/auth`;
export const AUTH_TOKEN_STORAGE_KEY = "edu_center_api_token";

export async function login(credentials) {
  const res = await fetch(`${API_ORIGIN}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.error || `API ${res.status}: ${res.statusText}`);
  }

  sessionStorage.setItem(AUTH_TOKEN_STORAGE_KEY, body.token);
  return body;
}

async function request(path, options = {}) {
  const authToken = sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  if (!authToken) {
    throw new Error("Avval tizimga kiring");
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authToken,
      ...(options.headers || {}),
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.status === 204 ? null : res.json();
}

async function authRequest(path, options = {}) {
  const authToken = sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  if (!authToken) {
    throw new Error("Avval tizimga kiring");
  }

  const res = await fetch(`${AUTH_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authToken,
      ...(options.headers || {}),
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const body = res.status === 204 ? null : await res.json();

  if (!res.ok) {
    throw new Error(body?.error || `API ${res.status}: ${res.statusText}`);
  }

  return body;
}

function crud(resource) {
  return {
    list: () => request(`/${resource}`),
    get: (id) => request(`/${resource}/${id}`),
    create: (data) => request(`/${resource}`, { method: "POST", body: data }),
    update: (id, data) => request(`/${resource}/${id}`, { method: "PUT", body: data }),
    remove: (id) => request(`/${resource}/${id}`, { method: "DELETE" }),
  };
}

export const studentsApi = crud("students");
export const teachersApi = crud("teachers");
export const coursesApi = crud("courses");
export const groupsApi = crud("groups");
export const paymentsApi = crud("payments");
export const roomsApi = crud("rooms");
export const authUsersApi = {
  list: () => authRequest("/users"),
  create: (data) => authRequest("/users", { method: "POST", body: data }),
  update: (id, data) => authRequest(`/users/${id}`, { method: "PUT", body: data }),
  remove: (id) => authRequest(`/users/${id}`, { method: "DELETE" }),
};

export default { studentsApi, teachersApi, coursesApi, groupsApi, paymentsApi, roomsApi, authUsersApi };
