
// All functions return Promises and follow REST conventions.
const BASE_URL = "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.status === 204 ? null : res.json();
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

export default { studentsApi, teachersApi, coursesApi, groupsApi, paymentsApi, roomsApi };
