const DEFAULT_ROLE_ACCESSES = {
  MANAGER: [],
  TEACHER: [
    "dashboard:view",
    "courses:view",
    "groups:view",
    "students:view",
    "teachers:view",
  ],
  STUDENT: ["dashboard:view", "courses:view", "groups:view"],
};

module.exports = {
  DEFAULT_ROLE_ACCESSES,
};
